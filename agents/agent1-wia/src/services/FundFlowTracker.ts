import { Transaction, FundFlow } from '../types';
import { logger } from '../utils/logger';

export class FundFlowTracker {
  private knownExchanges = new Set([
    'binance', 'coinbase', 'kraken', 'kucoin', 'huobi', 'okx', 'bybit',
    'bitfinex', 'gemini', 'ftx', 'crypto.com', 'robinhood', 'webull'
  ]);

  private knownForexProviders = new Set([
    'oanda', 'fxcm', 'ig', 'saxo', 'dukascopy', 'pepperstone', 'avatrade',
    'xm', 'fxpro', 'icmarkets', 'fbs', 'hotforex', 'octafx'
  ]);

  /**
   * Track fund flows from transactions
   */
  async trackFundFlows(transactions: Transaction[], walletAddress: string): Promise<FundFlow[]> {
    try {
      logger.info(`Tracking fund flows for wallet: ${walletAddress}`);

      const fundFlows: FundFlow[] = [];

      for (const tx of transactions) {
        const flow = await this.analyzeTransactionFlow(tx, walletAddress);
        if (flow) {
          fundFlows.push(flow);
        }
      }

      // Sort by timestamp (newest first)
      fundFlows.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      logger.info(`Tracked ${fundFlows.length} fund flows`);
      return fundFlows;
    } catch (error) {
      logger.error('Fund flow tracking failed:', error);
      throw error;
    }
  }

  /**
   * Analyze a single transaction for fund flow
   */
  private async analyzeTransactionFlow(tx: Transaction, walletAddress: string): Promise<FundFlow | null> {
    try {
      const isIncoming = tx.to.toLowerCase() === walletAddress.toLowerCase();
      const isOutgoing = tx.from.toLowerCase() === walletAddress.toLowerCase();

      if (!isIncoming && !isOutgoing) {
        return null; // Not related to this wallet
      }

      const flowType = isIncoming ? 'incoming' : 'outgoing';
      const sourceAddress = isIncoming ? tx.from : walletAddress;
      const destinationAddress = isIncoming ? walletAddress : tx.to;

      // Analyze destination for exchange/forex/bank indicators
      const destinationAnalysis = await this.analyzeDestination(destinationAddress, flowType);

      const fundFlow: FundFlow = {
        id: `${tx.hash}-${flowType}`,
        sourceAddress,
        destinationAddress,
        amount: tx.value,
        currency: tx.currency,
        timestamp: tx.timestamp,
        transactionHash: tx.hash,
        flowType,
        blockchain: tx.currency.toLowerCase(),
        metadata: {
          exchangeName: destinationAnalysis.exchangeName,
          forexProvider: destinationAnalysis.forexProvider,
          bankAccount: destinationAnalysis.bankAccount,
          description: destinationAnalysis.description
        }
      };

      return fundFlow;
    } catch (error) {
      logger.error(`Failed to analyze transaction flow for ${tx.hash}:`, error);
      return null;
    }
  }

  /**
   * Analyze destination address for exchange/forex/bank indicators
   */
  private async analyzeDestination(address: string, flowType: 'incoming' | 'outgoing'): Promise<{
    exchangeName?: string;
    forexProvider?: string;
    bankAccount?: string;
    description?: string;
  }> {
    const analysis = {
      exchangeName: undefined as string | undefined,
      forexProvider: undefined as string | undefined,
      bankAccount: undefined as string | undefined,
      description: undefined as string | undefined
    };

    // Check for known exchange addresses
    const exchangeMatch = this.identifyExchange(address);
    if (exchangeMatch) {
      analysis.exchangeName = exchangeMatch;
      analysis.description = `Transfer to ${exchangeMatch} exchange`;
      return analysis;
    }

    // Check for forex provider indicators
    const forexMatch = this.identifyForexProvider(address);
    if (forexMatch) {
      analysis.forexProvider = forexMatch;
      analysis.description = `Transfer to ${forexMatch} forex provider`;
      return analysis;
    }

    // Check for bank account indicators
    const bankMatch = this.identifyBankAccount(address);
    if (bankMatch) {
      analysis.bankAccount = bankMatch;
      analysis.description = `Transfer to bank account via ${bankMatch}`;
      return analysis;
    }

    // Check for DeFi protocol indicators
    const defiMatch = this.identifyDeFiProtocol(address);
    if (defiMatch) {
      analysis.description = `DeFi interaction with ${defiMatch}`;
      return analysis;
    }

    // Generic description based on flow type
    analysis.description = flowType === 'incoming' 
      ? 'Incoming transfer'
      : 'Outgoing transfer';

    return analysis;
  }

  /**
   * Identify if address belongs to a known exchange
   */
  private identifyExchange(address: string): string | null {
    // This would typically use a database of known exchange addresses
    // For now, using a simplified approach with address patterns
    
    const addressLower = address.toLowerCase();
    
    // Check for exchange-like patterns in the address
    for (const exchange of this.knownExchanges) {
      if (addressLower.includes(exchange) || this.isExchangeAddress(address)) {
        return exchange;
      }
    }

    return null;
  }

  /**
   * Identify if address belongs to a forex provider
   */
  private identifyForexProvider(address: string): string | null {
    const addressLower = address.toLowerCase();
    
    for (const provider of this.knownForexProviders) {
      if (addressLower.includes(provider) || this.isForexAddress(address)) {
        return provider;
      }
    }

    return null;
  }

  /**
   * Identify if address is associated with bank transfers
   */
  private identifyBankAccount(address: string): string | null {
    // This would check for addresses that are known to be associated with
    // bank transfer services or fiat on/off ramps
    
    const bankIndicators = [
      'bank', 'fiat', 'usd', 'eur', 'gbp', 'wire', 'ach', 'sepa'
    ];

    const addressLower = address.toLowerCase();
    
    for (const indicator of bankIndicators) {
      if (addressLower.includes(indicator)) {
        return `Bank transfer via ${indicator}`;
      }
    }

    return null;
  }

  /**
   * Identify DeFi protocol interactions
   */
  private identifyDeFiProtocol(address: string): string | null {
    const defiProtocols = [
      'uniswap', 'sushiswap', 'pancakeswap', 'curve', 'aave', 'compound',
      'maker', 'yearn', 'balancer', 'synthetix', 'dydx', 'opensea'
    ];

    const addressLower = address.toLowerCase();
    
    for (const protocol of defiProtocols) {
      if (addressLower.includes(protocol)) {
        return protocol;
      }
    }

    return null;
  }

  /**
   * Check if address matches known exchange patterns
   */
  private isExchangeAddress(address: string): boolean {
    // This would use a more sophisticated algorithm to identify exchange addresses
    // For now, using a simplified approach
    
    // Exchange addresses often have specific patterns or are known hot wallets
    const exchangePatterns = [
      /^0x[a-fA-F0-9]{40}$/, // Ethereum-style addresses
      /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/, // Bitcoin addresses
      /^[1-9A-HJ-NP-Za-km-z]{32,44}$/ // Solana addresses
    ];

    return exchangePatterns.some(pattern => pattern.test(address));
  }

  /**
   * Check if address matches known forex provider patterns
   */
  private isForexAddress(address: string): boolean {
    // Forex providers often use specific address patterns or are identified
    // through their transaction patterns rather than address format
    
    // This would typically involve checking against a database of known
    // forex provider addresses or transaction patterns
    
    return false; // Simplified for now
  }

  /**
   * Get fund flow summary statistics
   */
  getFundFlowSummary(fundFlows: FundFlow[]): {
    totalIncoming: number;
    totalOutgoing: number;
    exchangeTransfers: number;
    forexTransfers: number;
    bankTransfers: number;
    defiInteractions: number;
    largestTransfer: FundFlow | null;
    averageTransfer: number;
  } {
    const incoming = fundFlows.filter(f => f.flowType === 'incoming');
    const outgoing = fundFlows.filter(f => f.flowType === 'outgoing');
    
    const exchangeTransfers = fundFlows.filter(f => f.metadata?.exchangeName).length;
    const forexTransfers = fundFlows.filter(f => f.metadata?.forexProvider).length;
    const bankTransfers = fundFlows.filter(f => f.metadata?.bankAccount).length;
    const defiInteractions = fundFlows.filter(f => 
      f.metadata?.description?.includes('DeFi')
    ).length;

    const totalIncoming = incoming.reduce((sum, f) => sum + parseFloat(f.amount), 0);
    const totalOutgoing = outgoing.reduce((sum, f) => sum + parseFloat(f.amount), 0);
    
    const largestTransfer = fundFlows.length > 0 
      ? fundFlows.reduce((max, f) => 
          parseFloat(f.amount) > parseFloat(max.amount) ? f : max, 
          fundFlows[0]
        )
      : null;

    const averageTransfer = fundFlows.length > 0 
      ? fundFlows.reduce((sum, f) => sum + parseFloat(f.amount), 0) / fundFlows.length 
      : 0;

    return {
      totalIncoming,
      totalOutgoing,
      exchangeTransfers,
      forexTransfers,
      bankTransfers,
      defiInteractions,
      largestTransfer,
      averageTransfer
    };
  }
} 
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundFlowTracker = void 0;
const logger_1 = require("../utils/logger");
class FundFlowTracker {
    constructor() {
        this.knownExchanges = new Set([
            'binance', 'coinbase', 'kraken', 'kucoin', 'huobi', 'okx', 'bybit',
            'bitfinex', 'gemini', 'ftx', 'crypto.com', 'robinhood', 'webull'
        ]);
        this.knownForexProviders = new Set([
            'oanda', 'fxcm', 'ig', 'saxo', 'dukascopy', 'pepperstone', 'avatrade',
            'xm', 'fxpro', 'icmarkets', 'fbs', 'hotforex', 'octafx'
        ]);
    }
    /**
     * Track fund flows from transactions
     */
    async trackFundFlows(transactions, walletAddress) {
        try {
            logger_1.logger.info(`Tracking fund flows for wallet: ${walletAddress}`);
            const fundFlows = [];
            for (const tx of transactions) {
                const flow = await this.analyzeTransactionFlow(tx, walletAddress);
                if (flow) {
                    fundFlows.push(flow);
                }
            }
            // Sort by timestamp (newest first)
            fundFlows.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            logger_1.logger.info(`Tracked ${fundFlows.length} fund flows`);
            return fundFlows;
        }
        catch (error) {
            logger_1.logger.error('Fund flow tracking failed:', error);
            throw error;
        }
    }
    /**
     * Analyze a single transaction for fund flow
     */
    async analyzeTransactionFlow(tx, walletAddress) {
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
            const fundFlow = {
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
        }
        catch (error) {
            logger_1.logger.error(`Failed to analyze transaction flow for ${tx.hash}:`, error);
            return null;
        }
    }
    /**
     * Analyze destination address for exchange/forex/bank indicators
     */
    async analyzeDestination(address, flowType) {
        const analysis = {
            exchangeName: undefined,
            forexProvider: undefined,
            bankAccount: undefined,
            description: undefined
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
    identifyExchange(address) {
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
    identifyForexProvider(address) {
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
    identifyBankAccount(address) {
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
    identifyDeFiProtocol(address) {
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
    isExchangeAddress(address) {
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
    isForexAddress(address) {
        // Forex providers often use specific address patterns or are identified
        // through their transaction patterns rather than address format
        // This would typically involve checking against a database of known
        // forex provider addresses or transaction patterns
        return false; // Simplified for now
    }
    /**
     * Get fund flow summary statistics
     */
    getFundFlowSummary(fundFlows) {
        const incoming = fundFlows.filter(f => f.flowType === 'incoming');
        const outgoing = fundFlows.filter(f => f.flowType === 'outgoing');
        const exchangeTransfers = fundFlows.filter(f => f.metadata?.exchangeName).length;
        const forexTransfers = fundFlows.filter(f => f.metadata?.forexProvider).length;
        const bankTransfers = fundFlows.filter(f => f.metadata?.bankAccount).length;
        const defiInteractions = fundFlows.filter(f => f.metadata?.description?.includes('DeFi')).length;
        const totalIncoming = incoming.reduce((sum, f) => sum + parseFloat(f.amount), 0);
        const totalOutgoing = outgoing.reduce((sum, f) => sum + parseFloat(f.amount), 0);
        const largestTransfer = fundFlows.length > 0
            ? fundFlows.reduce((max, f) => parseFloat(f.amount) > parseFloat(max.amount) ? f : max, fundFlows[0])
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
exports.FundFlowTracker = FundFlowTracker;
//# sourceMappingURL=FundFlowTracker.js.map
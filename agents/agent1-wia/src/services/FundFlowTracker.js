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
            fundFlows.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            logger_1.logger.info(`Tracked ${fundFlows.length} fund flows`);
            return fundFlows;
        }
        catch (error) {
            logger_1.logger.error('Fund flow tracking failed:', error);
            throw error;
        }
    }
    async analyzeTransactionFlow(tx, walletAddress) {
        try {
            const isIncoming = tx.to.toLowerCase() === walletAddress.toLowerCase();
            const isOutgoing = tx.from.toLowerCase() === walletAddress.toLowerCase();
            if (!isIncoming && !isOutgoing) {
                return null;
            }
            const flowType = isIncoming ? 'incoming' : 'outgoing';
            const sourceAddress = isIncoming ? tx.from : walletAddress;
            const destinationAddress = isIncoming ? walletAddress : tx.to;
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
    async analyzeDestination(address, flowType) {
        const analysis = {
            exchangeName: undefined,
            forexProvider: undefined,
            bankAccount: undefined,
            description: undefined
        };
        const exchangeMatch = this.identifyExchange(address);
        if (exchangeMatch) {
            analysis.exchangeName = exchangeMatch;
            analysis.description = `Transfer to ${exchangeMatch} exchange`;
            return analysis;
        }
        const forexMatch = this.identifyForexProvider(address);
        if (forexMatch) {
            analysis.forexProvider = forexMatch;
            analysis.description = `Transfer to ${forexMatch} forex provider`;
            return analysis;
        }
        const bankMatch = this.identifyBankAccount(address);
        if (bankMatch) {
            analysis.bankAccount = bankMatch;
            analysis.description = `Transfer to bank account via ${bankMatch}`;
            return analysis;
        }
        const defiMatch = this.identifyDeFiProtocol(address);
        if (defiMatch) {
            analysis.description = `DeFi interaction with ${defiMatch}`;
            return analysis;
        }
        analysis.description = flowType === 'incoming'
            ? 'Incoming transfer'
            : 'Outgoing transfer';
        return analysis;
    }
    identifyExchange(address) {
        const addressLower = address.toLowerCase();
        for (const exchange of this.knownExchanges) {
            if (addressLower.includes(exchange) || this.isExchangeAddress(address)) {
                return exchange;
            }
        }
        return null;
    }
    identifyForexProvider(address) {
        const addressLower = address.toLowerCase();
        for (const provider of this.knownForexProviders) {
            if (addressLower.includes(provider) || this.isForexAddress(address)) {
                return provider;
            }
        }
        return null;
    }
    identifyBankAccount(address) {
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
    isExchangeAddress(address) {
        const exchangePatterns = [
            /^0x[a-fA-F0-9]{40}$/,
            /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
            /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
        ];
        return exchangePatterns.some(pattern => pattern.test(address));
    }
    isForexAddress(address) {
        return false;
    }
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
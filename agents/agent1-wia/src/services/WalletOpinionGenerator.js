"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletOpinionGenerator = void 0;
const logger_1 = require("../utils/logger");
class WalletOpinionGenerator {
    /**
     * Generate wallet opinion based on analysis data
     */
    async generateOpinion(walletData, transactionAnalysis, fundFlows) {
        try {
            logger_1.logger.info('Generating wallet opinion');
            const characteristics = this.analyzeCharacteristics(walletData, transactionAnalysis, fundFlows);
            const walletType = this.determineWalletType(characteristics, transactionAnalysis);
            const confidence = this.calculateConfidence(transactionAnalysis, fundFlows);
            const reasoning = this.generateReasoning(characteristics, transactionAnalysis, fundFlows);
            const estimatedValue = this.estimateValue(walletData, fundFlows);
            const activityLevel = this.determineActivityLevel(transactionAnalysis);
            const riskLevel = this.determineRiskLevel(transactionAnalysis);
            const opinion = {
                walletType,
                confidence,
                reasoning,
                characteristics,
                estimatedValue,
                activityLevel,
                riskLevel,
                generatedAt: new Date()
            };
            logger_1.logger.info(`Generated wallet opinion: ${walletType} (confidence: ${confidence}%)`);
            return opinion;
        }
        catch (error) {
            logger_1.logger.error('Failed to generate wallet opinion:', error);
            throw error;
        }
    }
    /**
     * Analyze wallet characteristics
     */
    analyzeCharacteristics(walletData, transactionAnalysis, fundFlows) {
        const isActive = transactionAnalysis.totalTransactions > 10;
        const isHighValue = parseFloat(walletData.balance.usdValue) > 10000;
        const defiInteractions = fundFlows.filter(f => f.metadata?.description?.includes('DeFi')).length;
        const isDeFiUser = defiInteractions > 5;
        const exchangeTransfers = fundFlows.filter(f => f.metadata?.exchangeName).length;
        const isExchangeUser = exchangeTransfers > 3;
        const uniqueCounterparties = transactionAnalysis.counterpartyAnalysis.uniqueAddresses;
        const hasMultipleWallets = uniqueCounterparties > 20;
        const isInstitutional = this.detectInstitutionalPatterns(transactionAnalysis, fundFlows);
        return {
            isActive,
            isHighValue,
            isDeFiUser,
            isExchangeUser,
            hasMultipleWallets,
            isInstitutional
        };
    }
    /**
     * Determine wallet type based on characteristics
     */
    determineWalletType(characteristics, transactionAnalysis) {
        if (characteristics.isExchangeUser && characteristics.isHighValue) {
            return 'exchange';
        }
        if (characteristics.isDeFiUser && characteristics.isActive) {
            return 'defi';
        }
        if (characteristics.isHighValue && characteristics.isActive) {
            return 'main';
        }
        if (characteristics.hasMultipleWallets && characteristics.isActive) {
            return 'secondary';
        }
        return 'unknown';
    }
    /**
     * Calculate confidence level in the opinion
     */
    calculateConfidence(transactionAnalysis, fundFlows) {
        let confidence = 50; // Base confidence
        // More transactions = higher confidence
        if (transactionAnalysis.totalTransactions > 50)
            confidence += 20;
        else if (transactionAnalysis.totalTransactions > 20)
            confidence += 10;
        // More fund flows = higher confidence
        if (fundFlows.length > 20)
            confidence += 15;
        else if (fundFlows.length > 10)
            confidence += 10;
        // Clear patterns = higher confidence
        if (transactionAnalysis.counterpartyAnalysis.uniqueAddresses > 10)
            confidence += 10;
        // High value transactions = higher confidence
        if (transactionAnalysis.valueDistribution.totalValue > 1000)
            confidence += 5;
        return Math.min(confidence, 100);
    }
    /**
     * Generate reasoning for the opinion
     */
    generateReasoning(characteristics, transactionAnalysis, fundFlows) {
        const reasoning = [];
        if (characteristics.isActive) {
            reasoning.push('Wallet shows high activity with frequent transactions');
        }
        if (characteristics.isHighValue) {
            reasoning.push('Wallet contains significant value (>$10,000 USD)');
        }
        if (characteristics.isDeFiUser) {
            reasoning.push('Multiple DeFi protocol interactions detected');
        }
        if (characteristics.isExchangeUser) {
            reasoning.push('Regular transfers to known cryptocurrency exchanges');
        }
        if (characteristics.hasMultipleWallets) {
            reasoning.push('Interacts with many unique addresses, suggesting multiple wallet ownership');
        }
        if (characteristics.isInstitutional) {
            reasoning.push('Transaction patterns suggest institutional or professional use');
        }
        if (transactionAnalysis.temporalPatterns.averageTransactionsPerDay > 5) {
            reasoning.push('High daily transaction volume indicates active trading or business use');
        }
        if (fundFlows.filter(f => f.metadata?.forexProvider).length > 0) {
            reasoning.push('Transfers to forex providers detected, suggesting fiat trading activity');
        }
        return reasoning;
    }
    /**
     * Estimate wallet value
     */
    estimateValue(walletData, fundFlows) {
        const totalUSD = walletData.balance.usdValue;
        const breakdown = {
            [walletData.balance.currency]: totalUSD
        };
        // Add estimated value from fund flows
        const incomingFlows = fundFlows.filter(f => f.flowType === 'incoming');
        const outgoingFlows = fundFlows.filter(f => f.flowType === 'outgoing');
        const totalIncoming = incomingFlows.reduce((sum, f) => sum + parseFloat(f.amount), 0);
        const totalOutgoing = outgoingFlows.reduce((sum, f) => sum + parseFloat(f.amount), 0);
        breakdown['incoming_transfers'] = totalIncoming;
        breakdown['outgoing_transfers'] = totalOutgoing;
        return {
            totalUSD,
            breakdown
        };
    }
    /**
     * Determine activity level
     */
    determineActivityLevel(transactionAnalysis) {
        const avgTxPerDay = transactionAnalysis.temporalPatterns.averageTransactionsPerDay;
        if (avgTxPerDay > 20)
            return 'very_high';
        if (avgTxPerDay > 10)
            return 'high';
        if (avgTxPerDay > 3)
            return 'medium';
        return 'low';
    }
    /**
     * Determine risk level
     */
    determineRiskLevel(transactionAnalysis) {
        const riskScore = transactionAnalysis.riskPatterns.riskScore;
        if (riskScore > 80)
            return 'critical';
        if (riskScore > 60)
            return 'high';
        if (riskScore > 30)
            return 'medium';
        return 'low';
    }
    /**
     * Detect institutional patterns
     */
    detectInstitutionalPatterns(transactionAnalysis, fundFlows) {
        // Check for patterns that suggest institutional use
        const largeTransactions = transactionAnalysis.valueDistribution.maxValue > 10000;
        const regularPatterns = transactionAnalysis.temporalPatterns.averageTransactionsPerDay > 5;
        const multipleExchanges = fundFlows.filter(f => f.metadata?.exchangeName).length > 3;
        const forexActivity = fundFlows.filter(f => f.metadata?.forexProvider).length > 0;
        return largeTransactions && (regularPatterns || multipleExchanges || forexActivity);
    }
}
exports.WalletOpinionGenerator = WalletOpinionGenerator;
//# sourceMappingURL=WalletOpinionGenerator.js.map
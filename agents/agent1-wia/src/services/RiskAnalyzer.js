"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskAnalyzer = void 0;
const logger_1 = require("../utils/logger");
class RiskAnalyzer {
    /**
     * Assess risk based on analysis data
     */
    async assessRisk(walletData, transactionAnalysis, fundFlows, walletOpinion) {
        try {
            logger_1.logger.info('Performing risk assessment');
            const riskFactors = this.identifyRiskFactors(transactionAnalysis, fundFlows, walletOpinion);
            const suspiciousActivities = this.detectSuspiciousActivities(transactionAnalysis, fundFlows);
            const overallRiskScore = this.calculateOverallRiskScore(riskFactors, suspiciousActivities);
            const riskLevel = this.determineRiskLevel(overallRiskScore);
            const recommendations = this.generateRecommendations(riskFactors, suspiciousActivities);
            const assessment = {
                overallRiskScore,
                riskLevel,
                riskFactors,
                suspiciousActivities,
                recommendations,
                assessmentTimestamp: new Date()
            };
            logger_1.logger.info(`Risk assessment completed: ${riskLevel} risk (score: ${overallRiskScore})`);
            return assessment;
        }
        catch (error) {
            logger_1.logger.error('Risk assessment failed:', error);
            throw error;
        }
    }
    /**
     * Identify risk factors
     */
    identifyRiskFactors(transactionAnalysis, fundFlows, walletOpinion) {
        const riskFactors = [];
        // High transaction frequency risk
        if (transactionAnalysis.temporalPatterns.averageTransactionsPerDay > 20) {
            riskFactors.push({
                factor: 'High Transaction Frequency',
                severity: 'high',
                description: 'Unusually high number of daily transactions',
                evidence: [`${transactionAnalysis.temporalPatterns.averageTransactionsPerDay} transactions per day`]
            });
        }
        // Large value transfers risk
        if (transactionAnalysis.valueDistribution.maxValue > 50000) {
            riskFactors.push({
                factor: 'Large Value Transfers',
                severity: 'high',
                description: 'Multiple large value transfers detected',
                evidence: [`Largest transfer: ${transactionAnalysis.valueDistribution.maxValue}`]
            });
        }
        // Failed transactions risk
        const failedTransactions = transactionAnalysis.riskPatterns.riskFactors.filter(f => f.includes('failed'));
        if (failedTransactions.length > 0) {
            riskFactors.push({
                factor: 'Failed Transactions',
                severity: 'medium',
                description: 'Multiple failed transactions indicate potential issues',
                evidence: failedTransactions
            });
        }
        // Exchange activity risk
        const exchangeTransfers = fundFlows.filter(f => f.metadata?.exchangeName).length;
        if (exchangeTransfers > 10) {
            riskFactors.push({
                factor: 'High Exchange Activity',
                severity: 'medium',
                description: 'Frequent transfers to cryptocurrency exchanges',
                evidence: [`${exchangeTransfers} exchange transfers detected`]
            });
        }
        // Forex activity risk
        const forexTransfers = fundFlows.filter(f => f.metadata?.forexProvider).length;
        if (forexTransfers > 5) {
            riskFactors.push({
                factor: 'Forex Trading Activity',
                severity: 'high',
                description: 'Multiple transfers to forex providers',
                evidence: [`${forexTransfers} forex transfers detected`]
            });
        }
        // DeFi activity risk
        const defiInteractions = fundFlows.filter(f => f.metadata?.description?.includes('DeFi')).length;
        if (defiInteractions > 20) {
            riskFactors.push({
                factor: 'High DeFi Activity',
                severity: 'medium',
                description: 'Extensive DeFi protocol interactions',
                evidence: [`${defiInteractions} DeFi interactions detected`]
            });
        }
        // Gas inefficiency risk
        if (transactionAnalysis.gasAnalysis.gasEfficiency > 5) {
            riskFactors.push({
                factor: 'Gas Inefficiency',
                severity: 'low',
                description: 'High gas usage relative to transaction value',
                evidence: [`Gas efficiency ratio: ${transactionAnalysis.gasAnalysis.gasEfficiency}`]
            });
        }
        // Multiple counterparties risk
        if (transactionAnalysis.counterpartyAnalysis.uniqueAddresses > 100) {
            riskFactors.push({
                factor: 'High Counterparty Diversity',
                severity: 'medium',
                description: 'Interacts with many unique addresses',
                evidence: [`${transactionAnalysis.counterpartyAnalysis.uniqueAddresses} unique addresses`]
            });
        }
        return riskFactors;
    }
    /**
     * Detect suspicious activities
     */
    detectSuspiciousActivities(transactionAnalysis, fundFlows) {
        const suspiciousActivities = [];
        // Check for rapid large transfers
        const largeTransfers = fundFlows.filter(f => parseFloat(f.amount) > 10000);
        if (largeTransfers.length > 3) {
            suspiciousActivities.push({
                activity: 'Rapid Large Transfers',
                timestamp: new Date(),
                description: 'Multiple large transfers in short time period',
                riskScore: 75
            });
        }
        // Check for mixing patterns
        const mixingPatterns = this.detectMixingPatterns(transactionAnalysis);
        if (mixingPatterns.length > 0) {
            suspiciousActivities.push({
                activity: 'Potential Mixing Activity',
                timestamp: new Date(),
                description: 'Transaction patterns suggest mixing or layering',
                riskScore: 85
            });
        }
        // Check for pump and dump patterns
        const pumpDumpPatterns = this.detectPumpAndDumpPatterns(transactionAnalysis);
        if (pumpDumpPatterns) {
            suspiciousActivities.push({
                activity: 'Pump and Dump Patterns',
                timestamp: new Date(),
                description: 'Transaction patterns suggest market manipulation',
                riskScore: 90
            });
        }
        // Check for wash trading
        const washTrading = this.detectWashTrading(transactionAnalysis);
        if (washTrading) {
            suspiciousActivities.push({
                activity: 'Wash Trading',
                timestamp: new Date(),
                description: 'Circular transaction patterns detected',
                riskScore: 80
            });
        }
        return suspiciousActivities;
    }
    /**
     * Calculate overall risk score
     */
    calculateOverallRiskScore(riskFactors, suspiciousActivities) {
        let score = 0;
        // Base score from risk factors
        riskFactors.forEach(factor => {
            switch (factor.severity) {
                case 'critical':
                    score += 25;
                    break;
                case 'high':
                    score += 15;
                    break;
                case 'medium':
                    score += 10;
                    break;
                case 'low':
                    score += 5;
                    break;
            }
        });
        // Additional score from suspicious activities
        suspiciousActivities.forEach(activity => {
            score += activity.riskScore * 0.1; // Weight suspicious activities
        });
        return Math.min(score, 100);
    }
    /**
     * Determine risk level based on score
     */
    determineRiskLevel(score) {
        if (score > 80)
            return 'critical';
        if (score > 60)
            return 'high';
        if (score > 30)
            return 'medium';
        return 'low';
    }
    /**
     * Generate recommendations based on risks
     */
    generateRecommendations(riskFactors, suspiciousActivities) {
        const recommendations = [];
        if (riskFactors.some(f => f.factor === 'High Transaction Frequency')) {
            recommendations.push('Monitor for unusual transaction patterns');
        }
        if (riskFactors.some(f => f.factor === 'Large Value Transfers')) {
            recommendations.push('Verify source of large transfers');
        }
        if (riskFactors.some(f => f.factor === 'Forex Trading Activity')) {
            recommendations.push('Review forex trading compliance');
        }
        if (suspiciousActivities.some(a => a.activity === 'Potential Mixing Activity')) {
            recommendations.push('Investigate potential mixing or layering activity');
        }
        if (suspiciousActivities.some(a => a.activity === 'Pump and Dump Patterns')) {
            recommendations.push('Review for market manipulation patterns');
        }
        if (riskFactors.length === 0 && suspiciousActivities.length === 0) {
            recommendations.push('No significant risks detected');
        }
        return recommendations;
    }
    /**
     * Detect mixing patterns
     */
    detectMixingPatterns(transactionAnalysis) {
        const patterns = [];
        // Check for rapid transfers to many addresses
        if (transactionAnalysis.counterpartyAnalysis.uniqueAddresses > 50) {
            patterns.push('High number of unique counterparties');
        }
        // Check for small, frequent transfers
        if (transactionAnalysis.valueDistribution.averageValue < 0.1) {
            patterns.push('Small, frequent transfers');
        }
        return patterns;
    }
    /**
     * Detect pump and dump patterns
     */
    detectPumpAndDumpPatterns(transactionAnalysis) {
        // This would implement more sophisticated pattern detection
        // For now, using simplified heuristics
        const highValueTransactions = transactionAnalysis.valueDistribution.valueRanges['100+'] || 0;
        const totalTransactions = transactionAnalysis.totalTransactions;
        // If more than 20% of transactions are high value, might indicate pump and dump
        return (highValueTransactions / totalTransactions) > 0.2;
    }
    /**
     * Detect wash trading
     */
    detectWashTrading(transactionAnalysis) {
        // This would implement sophisticated wash trading detection
        // For now, using simplified heuristics
        const topCounterparties = transactionAnalysis.counterpartyAnalysis.topCounterparties;
        // Check if there are frequent transactions with the same counterparties
        return topCounterparties.some(cp => cp.interactionCount > 20);
    }
}
exports.RiskAnalyzer = RiskAnalyzer;
//# sourceMappingURL=RiskAnalyzer.js.map
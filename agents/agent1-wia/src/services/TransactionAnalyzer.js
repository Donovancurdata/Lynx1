"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionAnalyzer = void 0;
const logger_1 = require("../utils/logger");
class TransactionAnalyzer {
    /**
     * Analyze transactions for patterns and behaviors
     */
    async analyzeTransactions(transactions, blockchain) {
        try {
            logger_1.logger.info(`Analyzing ${transactions.length} transactions for blockchain: ${blockchain}`);
            const analysis = {
                totalTransactions: transactions.length,
                transactionTypes: this.analyzeTransactionTypes(transactions),
                temporalPatterns: this.analyzeTemporalPatterns(transactions),
                valueDistribution: this.analyzeValueDistribution(transactions),
                counterpartyAnalysis: this.analyzeCounterparties(transactions),
                gasAnalysis: this.analyzeGasUsage(transactions),
                riskPatterns: this.analyzeRiskPatterns(transactions),
                blockchain: blockchain,
                analysisTimestamp: new Date()
            };
            logger_1.logger.info('Transaction analysis completed successfully');
            return analysis;
        }
        catch (error) {
            logger_1.logger.error('Transaction analysis failed:', error);
            throw error;
        }
    }
    /**
     * Analyze transaction types distribution
     */
    analyzeTransactionTypes(transactions) {
        const typeCount = {};
        transactions.forEach(tx => {
            const type = tx.type || 'unknown';
            typeCount[type] = (typeCount[type] || 0) + 1;
        });
        return typeCount;
    }
    /**
     * Analyze temporal patterns in transactions
     */
    analyzeTemporalPatterns(transactions) {
        const hourlyDistribution = {};
        const dailyDistribution = {};
        const monthlyDistribution = {};
        // Initialize distributions
        for (let i = 0; i < 24; i++) {
            hourlyDistribution[i] = 0;
        }
        transactions.forEach(tx => {
            const date = new Date(tx.timestamp);
            const hour = date.getHours();
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });
            const month = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            hourlyDistribution[hour]++;
            dailyDistribution[day] = (dailyDistribution[day] || 0) + 1;
            monthlyDistribution[month] = (monthlyDistribution[month] || 0) + 1;
        });
        // Calculate averages and find most active periods
        const totalDays = this.calculateTotalDays(transactions);
        const averageTransactionsPerDay = totalDays > 0 ? transactions.length / totalDays : 0;
        const mostActiveHour = Object.entries(hourlyDistribution)
            .reduce((max, [hour, count]) => count > max.count ? { hour: parseInt(hour), count } : max, { hour: 0, count: 0 })
            .hour;
        const mostActiveDay = Object.entries(dailyDistribution)
            .reduce((max, [day, count]) => count > max.count ? { day, count } : max, { day: 'Unknown', count: 0 })
            .day;
        return {
            hourlyDistribution,
            dailyDistribution,
            monthlyDistribution,
            averageTransactionsPerDay,
            mostActiveHour,
            mostActiveDay
        };
    }
    /**
     * Analyze value distribution of transactions
     */
    analyzeValueDistribution(transactions) {
        const values = transactions
            .map(tx => parseFloat(tx.value) || 0)
            .filter(value => value > 0)
            .sort((a, b) => a - b);
        if (values.length === 0) {
            return {
                totalValue: 0,
                averageValue: 0,
                medianValue: 0,
                minValue: 0,
                maxValue: 0,
                valueRanges: {}
            };
        }
        const totalValue = values.reduce((sum, value) => sum + value, 0);
        const averageValue = totalValue / values.length;
        const medianValue = values[Math.floor(values.length / 2)];
        const minValue = values[0];
        const maxValue = values[values.length - 1];
        // Define value ranges
        const valueRanges = {
            '0-0.001': 0,
            '0.001-0.01': 0,
            '0.01-0.1': 0,
            '0.1-1': 0,
            '1-10': 0,
            '10-100': 0,
            '100+': 0
        };
        values.forEach(value => {
            if (value <= 0.001)
                valueRanges['0-0.001']++;
            else if (value <= 0.01)
                valueRanges['0.001-0.01']++;
            else if (value <= 0.1)
                valueRanges['0.01-0.1']++;
            else if (value <= 1)
                valueRanges['0.1-1']++;
            else if (value <= 10)
                valueRanges['1-10']++;
            else if (value <= 100)
                valueRanges['10-100']++;
            else
                valueRanges['100+']++;
        });
        return {
            totalValue,
            averageValue,
            medianValue,
            minValue,
            maxValue,
            valueRanges
        };
    }
    /**
     * Analyze counterparties (addresses that interact with the wallet)
     */
    analyzeCounterparties(transactions) {
        const addressCounts = {};
        const addressValues = {};
        const incomingAddresses = new Set();
        const outgoingAddresses = new Set();
        transactions.forEach(tx => {
            if (tx.from && tx.from !== '') {
                addressCounts[tx.from] = (addressCounts[tx.from] || 0) + 1;
                addressValues[tx.from] = (addressValues[tx.from] || 0) + (parseFloat(tx.value) || 0);
                outgoingAddresses.add(tx.from);
            }
            if (tx.to && tx.to !== '') {
                addressCounts[tx.to] = (addressCounts[tx.to] || 0) + 1;
                addressValues[tx.to] = (addressValues[tx.to] || 0) + (parseFloat(tx.value) || 0);
                incomingAddresses.add(tx.to);
            }
        });
        const topCounterparties = Object.entries(addressCounts)
            .map(([address, count]) => ({
            address,
            interactionCount: count,
            totalValue: addressValues[address] || 0
        }))
            .sort((a, b) => b.interactionCount - a.interactionCount)
            .slice(0, 10);
        return {
            uniqueAddresses: Object.keys(addressCounts).length,
            topCounterparties,
            incomingAddresses: Array.from(incomingAddresses),
            outgoingAddresses: Array.from(outgoingAddresses)
        };
    }
    /**
     * Analyze gas usage patterns (for EVM-based blockchains)
     */
    analyzeGasUsage(transactions) {
        const gasTransactions = transactions.filter(tx => tx.gasUsed);
        if (gasTransactions.length === 0) {
            return {
                totalGasUsed: 0,
                averageGasUsed: 0,
                gasEfficiency: 0,
                highGasTransactions: 0
            };
        }
        const totalGasUsed = gasTransactions.reduce((sum, tx) => sum + (parseInt(tx.gasUsed || '0') || 0), 0);
        const averageGasUsed = totalGasUsed / gasTransactions.length;
        // Calculate gas efficiency (lower is better)
        const gasEfficiency = averageGasUsed / 21000; // 21000 is the base gas for a simple transfer
        // Count high gas transactions (above 100k gas)
        const highGasTransactions = gasTransactions.filter(tx => (parseInt(tx.gasUsed || '0') || 0) > 100000).length;
        return {
            totalGasUsed,
            averageGasUsed,
            gasEfficiency,
            highGasTransactions
        };
    }
    /**
     * Analyze risk patterns in transactions
     */
    analyzeRiskPatterns(transactions) {
        const riskFactors = [];
        let riskScore = 0;
        // Check for high-frequency trading
        if (transactions.length > 100) {
            riskFactors.push('High transaction frequency');
            riskScore += 20;
        }
        // Check for large value transfers
        const largeTransfers = transactions.filter(tx => parseFloat(tx.value) > 100);
        if (largeTransfers.length > 5) {
            riskFactors.push('Multiple large transfers');
            riskScore += 15;
        }
        // Check for failed transactions
        const failedTransactions = transactions.filter(tx => tx.status === 'failed');
        if (failedTransactions.length > 10) {
            riskFactors.push('Multiple failed transactions');
            riskScore += 10;
        }
        // Check for contract interactions (potential DeFi activity)
        const contractTransactions = transactions.filter(tx => tx.type === 'contract');
        if (contractTransactions.length > 20) {
            riskFactors.push('High contract interaction');
            riskScore += 5;
        }
        // Check for token transfers
        const tokenTransactions = transactions.filter(tx => tx.type === 'token');
        if (tokenTransactions.length > 50) {
            riskFactors.push('High token transfer activity');
            riskScore += 10;
        }
        const suspiciousPatterns = riskFactors.length > 0 ? riskFactors : ['No suspicious patterns detected'];
        return {
            suspiciousPatterns,
            riskScore: Math.min(riskScore, 100), // Cap at 100
            riskFactors
        };
    }
    /**
     * Calculate total days between first and last transaction
     */
    calculateTotalDays(transactions) {
        if (transactions.length < 2)
            return 1;
        const sortedTransactions = transactions.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const firstDate = new Date(sortedTransactions[0].timestamp);
        const lastDate = new Date(sortedTransactions[sortedTransactions.length - 1].timestamp);
        const timeDiff = lastDate.getTime() - firstDate.getTime();
        return Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
    }
}
exports.TransactionAnalyzer = TransactionAnalyzer;
//# sourceMappingURL=TransactionAnalyzer.js.map
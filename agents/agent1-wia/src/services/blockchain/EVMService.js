"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVMService = void 0;
const ethers_1 = require("ethers");
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../../utils/logger");
const config_1 = require("../../utils/config");
const PriceService_1 = require("../PriceService");
class EVMService {
    constructor() {
        this.providers = new Map();
        this.chainConfigs = new Map();
        this.priceService = PriceService_1.PriceService.getInstance();
        this.initializeChains();
    }
    initializeChains() {
        // Ethereum
        const ethereumConfig = config_1.config.getEthereumConfig();
        this.chainConfigs.set('ethereum', {
            name: 'Ethereum',
            symbol: 'ETH',
            chainId: 1,
            rpcUrl: ethereumConfig.infuraProjectId
                ? `${ethereumConfig.rpcUrl}${ethereumConfig.infuraProjectId}`
                : 'https://eth.llamarpc.com',
            explorerUrl: 'https://etherscan.io',
            etherscanBaseUrl: 'https://api.etherscan.io/api',
            etherscanApiKey: ethereumConfig.etherscanApiKey || '',
            decimals: 18
        });
        // Polygon
        const polygonConfig = config_1.config.getPolygonConfig();
        this.chainConfigs.set('polygon', {
            name: 'Polygon',
            symbol: 'MATIC',
            chainId: 137,
            rpcUrl: polygonConfig.rpcUrl,
            explorerUrl: 'https://polygonscan.com',
            etherscanBaseUrl: 'https://api.etherscan.io/v2/api',
            etherscanApiKey: polygonConfig.polygonscanApiKey || '',
            decimals: 18
        });
        // Binance Smart Chain
        const binanceConfig = config_1.config.getBinanceConfig();
        this.chainConfigs.set('binance', {
            name: 'Binance Smart Chain',
            symbol: 'BNB',
            chainId: 56,
            rpcUrl: binanceConfig.rpcUrl,
            explorerUrl: 'https://bscscan.com',
            etherscanBaseUrl: 'https://api.etherscan.io/v2/api',
            etherscanApiKey: binanceConfig.bscscanApiKey || '',
            decimals: 18
        });
        // Initialize providers
        for (const [chain, config] of this.chainConfigs) {
            this.providers.set(chain, new ethers_1.ethers.JsonRpcProvider(config.rpcUrl));
            logger_1.logger.info(`${config.name} service initialized`);
        }
    }
    getBlockchainInfo(chain) {
        const chainConfig = this.chainConfigs.get(chain);
        if (!chainConfig) {
            throw new Error(`Unsupported EVM chain: ${chain}`);
        }
        return {
            name: chainConfig.name,
            symbol: chainConfig.symbol,
            chainId: chainConfig.chainId,
            rpcUrl: chainConfig.rpcUrl,
            explorerUrl: chainConfig.explorerUrl
        };
    }
    validateAddress(address, chain) {
        return ethers_1.ethers.isAddress(address);
    }
    async getBalance(address, chain) {
        try {
            const chainConfig = this.chainConfigs.get(chain);
            const provider = this.providers.get(chain);
            if (!chainConfig || !provider) {
                throw new Error(`Unsupported EVM chain: ${chain}`);
            }
            logger_1.logger.debug(`Getting ${chainConfig.name} balance for ${address}`);
            const balance = await provider.getBalance(address);
            const balanceInUnits = ethers_1.ethers.formatEther(balance);
            // Get USD value from price service
            const usdValue = await this.priceService.getTokenPrice(chainConfig.symbol, parseFloat(balanceInUnits));
            logger_1.logger.debug(`${chainConfig.name} balance for ${address}: ${balanceInUnits} ${chainConfig.symbol} ($${usdValue})`);
            return {
                balance: balanceInUnits,
                usdValue,
                lastUpdated: new Date()
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.warn(`Failed to get ${chain} balance: ${errorMessage}, using mock data`);
            return this.getMockBalance(address, chain);
        }
    }
    async getAllTokenBalances(address, chain) {
        try {
            logger_1.logger.debug(`Getting all token balances for ${address} on ${chain}`);
            // Get native balance
            const nativeBalance = await this.getBalance(address, chain);
            // Get ERC-20 tokens
            const tokens = await this.getERC20Tokens(address, chain);
            // Calculate total USD value
            const totalUsdValue = nativeBalance.usdValue + tokens.reduce((sum, token) => sum + token.usdValue, 0);
            return {
                native: nativeBalance,
                tokens,
                totalUsdValue
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error(`Failed to get all token balances for ${address} on ${chain}: ${errorMessage}`);
            throw new Error(`Failed to get all token balances: ${errorMessage}`);
        }
    }
    async getERC20Tokens(address, chain) {
        try {
            const chainConfig = this.chainConfigs.get(chain);
            if (!chainConfig) {
                throw new Error(`Unsupported EVM chain: ${chain}`);
            }
            if (!chainConfig.etherscanApiKey) {
                logger_1.logger.warn(`${chainConfig.name} API key not provided, using mock token data`);
                return this.getMockTokenBalances(address, chain);
            }
            logger_1.logger.debug(`Getting ERC-20 tokens for ${address} on ${chainConfig.name}`);
            // Get token transfers to find all tokens the address has interacted with
            const response = await axios_1.default.get(chainConfig.etherscanBaseUrl, {
                params: {
                    module: 'account',
                    action: 'tokentx',
                    address,
                    startblock: 0,
                    endblock: 99999999,
                    sort: 'desc',
                    apikey: chainConfig.etherscanApiKey,
                    ...(chain !== 'ethereum' && { chainId: chainConfig.chainId })
                },
                timeout: 15000
            });
            if (response.data.status === '1') {
                const tokenTransfers = response.data.result;
                const uniqueTokens = new Map();
                // Group by token contract address
                tokenTransfers.forEach((tx) => {
                    if (!uniqueTokens.has(tx.contractAddress)) {
                        uniqueTokens.set(tx.contractAddress, {
                            contractAddress: tx.contractAddress,
                            tokenName: tx.tokenName,
                            tokenSymbol: tx.tokenSymbol,
                            decimals: parseInt(tx.tokenDecimal),
                            transfers: []
                        });
                    }
                    uniqueTokens.get(tx.contractAddress).transfers.push(tx);
                });
                // Calculate current balance for each token
                const tokenBalances = [];
                for (const [contractAddress, tokenInfo] of uniqueTokens) {
                    try {
                        const balance = await this.getTokenBalance(address, contractAddress, tokenInfo, chain);
                        if (parseFloat(balance.balance) > 0) {
                            tokenBalances.push(balance);
                        }
                    }
                    catch (error) {
                        logger_1.logger.warn(`Failed to get balance for token ${tokenInfo.tokenSymbol}: ${error}`);
                    }
                }
                logger_1.logger.debug(`Found ${tokenBalances.length} tokens with non-zero balance on ${chainConfig.name}`);
                return tokenBalances;
            }
            else {
                logger_1.logger.warn(`Failed to get token transfers from ${chainConfig.name} API, using mock data`);
                return this.getMockTokenBalances(address, chain);
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error(`Failed to get ERC-20 tokens for ${address} on ${chain}: ${errorMessage}`);
            return this.getMockTokenBalances(address, chain);
        }
    }
    async getTokenBalance(address, contractAddress, tokenInfo, chain) {
        try {
            const provider = this.providers.get(chain);
            if (!provider) {
                throw new Error(`Provider not found for chain: ${chain}`);
            }
            // ERC-20 balanceOf function
            const balanceOfAbi = ['function balanceOf(address owner) view returns (uint256)'];
            const tokenContract = new ethers_1.ethers.Contract(contractAddress, balanceOfAbi, provider);
            const balance = await tokenContract.balanceOf(address);
            const formattedBalance = ethers_1.ethers.formatUnits(balance, tokenInfo.decimals);
            // Get USD value from price service
            const usdValue = await this.priceService.getTokenPrice(tokenInfo.tokenSymbol, parseFloat(formattedBalance));
            return {
                contractAddress,
                tokenName: tokenInfo.tokenName,
                tokenSymbol: tokenInfo.tokenSymbol,
                decimals: tokenInfo.decimals,
                balance: formattedBalance,
                usdValue,
                lastUpdated: new Date()
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to get token balance: ${errorMessage}`);
        }
    }
    async getTransactionHistory(address, chain, limit = 1000) {
        try {
            const chainConfig = this.chainConfigs.get(chain);
            const provider = this.providers.get(chain);
            if (!chainConfig || !provider) {
                throw new Error(`Unsupported EVM chain: ${chain}`);
            }
            if (!chainConfig.etherscanApiKey) {
                logger_1.logger.warn(`${chainConfig.name} API key not provided, using mock data`);
                return this.getMockTransactions(address, chain, limit);
            }
            logger_1.logger.debug(`Getting ${chainConfig.name} transaction history for ${address} (limit: ${limit})`);
            const response = await axios_1.default.get(chainConfig.etherscanBaseUrl, {
                params: {
                    module: 'account',
                    action: 'txlist',
                    address,
                    startblock: 0,
                    endblock: 99999999,
                    sort: 'desc',
                    apikey: chainConfig.etherscanApiKey,
                    ...(chain !== 'ethereum' && { chainId: chainConfig.chainId })
                },
                timeout: 15000
            });
            if (response.data.status === '1') {
                const transactions = response.data.result
                    .slice(0, limit)
                    .map((tx) => ({
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to,
                    value: ethers_1.ethers.formatEther(tx.value),
                    timestamp: new Date(parseInt(tx.timeStamp) * 1000),
                    blockNumber: parseInt(tx.blockNumber),
                    gasUsed: tx.gasUsed,
                    gasPrice: tx.gasPrice,
                    status: tx.isError === '0' ? 'success' : 'failed',
                    type: this.determineTransactionType(tx),
                    currency: chainConfig.symbol
                }));
                logger_1.logger.debug(`Retrieved ${transactions.length} transactions for ${address} on ${chainConfig.name}`);
                return transactions;
            }
            else {
                logger_1.logger.warn(`Failed to get transactions from ${chainConfig.name} API, using mock data`);
                return this.getMockTransactions(address, chain, limit);
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error(`Failed to get transaction history for ${address} on ${chain}: ${errorMessage}`);
            return this.getMockTransactions(address, chain, limit);
        }
    }
    async analyzeTransactionValues(transactions, walletAddress) {
        try {
            logger_1.logger.debug(`Analyzing transaction values for ${transactions.length} transactions for wallet ${walletAddress}`);
            let totalIncoming = 0;
            let totalOutgoing = 0;
            let largestTransaction = 0;
            const values = [];
            for (const tx of transactions) {
                const value = parseFloat(tx.value) || 0;
                values.push(value);
                // Determine if transaction is incoming or outgoing based on from/to addresses
                const isIncoming = tx.to && tx.to.toLowerCase() === walletAddress.toLowerCase();
                const isOutgoing = tx.from && tx.from.toLowerCase() === walletAddress.toLowerCase();
                if (isIncoming) {
                    totalIncoming += value;
                }
                else if (isOutgoing) {
                    totalOutgoing += value;
                }
                if (value > largestTransaction) {
                    largestTransaction = value;
                }
            }
            const netFlow = totalIncoming - totalOutgoing;
            const averageTransaction = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
            const lifetimeVolume = totalIncoming + totalOutgoing;
            return {
                totalIncoming,
                totalOutgoing,
                netFlow,
                largestTransaction,
                averageTransaction,
                transactionCount: transactions.length,
                lifetimeVolume
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error(`Failed to analyze transaction values: ${errorMessage}`);
            throw new Error(`Failed to analyze transaction values: ${errorMessage}`);
        }
    }
    async generateWalletOpinion(address, enhancedBalance, transactionAnalysis, transactions) {
        try {
            const totalValue = enhancedBalance.totalUsdValue;
            const transactionCount = transactionAnalysis.transactionCount;
            const lifetimeVolume = transactionAnalysis.lifetimeVolume;
            const averageTransaction = transactionAnalysis.averageTransaction;
            // Determine wallet type
            let type = 'unknown';
            if (totalValue > 1000000) {
                type = 'whale';
            }
            else if (transactionCount > 100 && averageTransaction > 1000) {
                type = 'active_trader';
            }
            else if (transactionCount < 10 && totalValue > 1000) {
                type = 'hodler';
            }
            else if (transactionCount < 5) {
                type = 'new_user';
            }
            else if (transactionCount === 0) {
                type = 'inactive';
            }
            else {
                type = 'active_trader';
            }
            // Determine activity level
            let activityLevel = 'low';
            if (transactionCount > 500) {
                activityLevel = 'very_high';
            }
            else if (transactionCount > 100) {
                activityLevel = 'high';
            }
            else if (transactionCount > 20) {
                activityLevel = 'medium';
            }
            else if (transactionCount > 5) {
                activityLevel = 'low';
            }
            else {
                activityLevel = 'very_low';
            }
            // Calculate confidence based on data quality
            let confidence = 'medium';
            if (transactionCount > 50 && totalValue > 10000) {
                confidence = 'high';
            }
            else if (transactionCount < 5) {
                confidence = 'low';
            }
            // Calculate risk score
            const riskScore = this.calculateRiskScore(enhancedBalance, transactionAnalysis, transactions);
            return {
                type,
                activityLevel,
                estimatedValue: totalValue,
                confidence,
                riskScore,
                riskFactors: this.getRiskFactors(enhancedBalance, transactionAnalysis, transactions)
            };
        }
        catch (error) {
            logger_1.logger.error(`Failed to generate wallet opinion: ${error}`);
            return {
                type: 'unknown',
                activityLevel: 'low',
                estimatedValue: 0,
                confidence: 'low',
                riskScore: 50,
                riskFactors: ['Unable to analyze wallet']
            };
        }
    }
    calculateRiskScore(enhancedBalance, transactionAnalysis, transactions) {
        let riskScore = 0;
        // High volume transactions increase risk
        if (transactionAnalysis.largestTransaction > 100000)
            riskScore += 20;
        if (transactionAnalysis.averageTransaction > 10000)
            riskScore += 15;
        // High frequency trading increases risk
        if (transactionAnalysis.transactionCount > 1000)
            riskScore += 25;
        if (transactionAnalysis.transactionCount > 100)
            riskScore += 15;
        // Large net flow might indicate suspicious activity
        if (Math.abs(transactionAnalysis.netFlow) > 50000)
            riskScore += 20;
        // Many different tokens might indicate complex activity
        if (enhancedBalance.tokens.length > 20)
            riskScore += 10;
        // Very high total value increases risk
        if (enhancedBalance.totalUsdValue > 1000000)
            riskScore += 15;
        return Math.min(riskScore, 100);
    }
    getRiskFactors(enhancedBalance, transactionAnalysis, transactions) {
        const factors = [];
        if (transactionAnalysis.largestTransaction > 100000) {
            factors.push('High value transactions detected');
        }
        if (transactionAnalysis.transactionCount > 1000) {
            factors.push('Very high transaction frequency');
        }
        if (Math.abs(transactionAnalysis.netFlow) > 50000) {
            factors.push('Large net fund flow detected');
        }
        if (enhancedBalance.tokens.length > 20) {
            factors.push('Complex token portfolio');
        }
        if (enhancedBalance.totalUsdValue > 1000000) {
            factors.push('High total portfolio value');
        }
        return factors;
    }
    async generateFundFlows(transactions, walletAddress) {
        try {
            const fundFlows = [];
            const now = new Date();
            // Generate fund flows for the last 5 days
            for (let i = 4; i >= 0; i--) {
                const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                const dateStr = date.toISOString().split('T')[0];
                // Filter transactions for this date
                const dayTransactions = transactions.filter(tx => {
                    const txDate = new Date(tx.timestamp);
                    return txDate.toISOString().split('T')[0] === dateStr;
                });
                let incoming = 0;
                let outgoing = 0;
                for (const tx of dayTransactions) {
                    const value = parseFloat(tx.value) || 0;
                    const isIncoming = tx.to && tx.to.toLowerCase() === walletAddress.toLowerCase();
                    const isOutgoing = tx.from && tx.from.toLowerCase() === walletAddress.toLowerCase();
                    if (isIncoming) {
                        incoming += value;
                    }
                    else if (isOutgoing) {
                        outgoing += value;
                    }
                }
                fundFlows.push({
                    date: dateStr,
                    incoming,
                    outgoing,
                    netFlow: incoming - outgoing,
                    transactionCount: dayTransactions.length
                });
            }
            return fundFlows;
        }
        catch (error) {
            logger_1.logger.error(`Failed to generate fund flows: ${error}`);
            return [];
        }
    }
    async investigateWallet(address, chain) {
        try {
            logger_1.logger.info(`Starting comprehensive wallet investigation for ${address} on ${chain}`);
            // Get all data in parallel
            const [balance, enhancedBalance, transactions] = await Promise.all([
                this.getBalance(address, chain),
                this.getAllTokenBalances(address, chain),
                this.getTransactionHistory(address, chain, 1000) // Get more transactions for analysis
            ]);
            // Analyze transactions
            const transactionAnalysis = await this.analyzeTransactionValues(transactions, address);
            // Get recent transactions (last 10)
            const recentTransactions = transactions.slice(0, 10);
            // Generate wallet opinion
            const walletOpinion = await this.generateWalletOpinion(address, enhancedBalance, transactionAnalysis, transactions);
            // Generate fund flows
            const fundFlows = await this.generateFundFlows(transactions, address);
            // Generate risk assessment
            const riskAssessment = {
                score: walletOpinion.riskScore,
                factors: walletOpinion.riskFactors,
                recommendations: this.generateRiskRecommendations(walletOpinion, transactionAnalysis)
            };
            const investigation = {
                address,
                blockchain: chain,
                balance,
                enhancedBalance,
                transactionAnalysis,
                recentTransactions,
                walletOpinion,
                fundFlows,
                riskAssessment,
                blockchainInfo: this.getBlockchainInfo(chain),
                investigationTimestamp: new Date()
            };
            logger_1.logger.info(`Wallet investigation completed for ${address}`);
            return investigation;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error(`Failed to investigate wallet ${address} on ${chain}: ${errorMessage}`);
            throw new Error(`Failed to investigate wallet: ${errorMessage}`);
        }
    }
    generateRiskRecommendations(walletOpinion, transactionAnalysis) {
        const recommendations = [];
        if (walletOpinion.riskScore > 70) {
            recommendations.push('High risk wallet - exercise extreme caution');
        }
        else if (walletOpinion.riskScore > 50) {
            recommendations.push('Moderate risk wallet - proceed with caution');
        }
        else {
            recommendations.push('Low risk wallet - appears safe for interaction');
        }
        if (transactionAnalysis.largestTransaction > 100000) {
            recommendations.push('Monitor for large transaction patterns');
        }
        if (transactionAnalysis.transactionCount > 1000) {
            recommendations.push('High frequency trading detected - monitor for suspicious patterns');
        }
        if (Math.abs(transactionAnalysis.netFlow) > 50000) {
            recommendations.push('Large net fund flow detected - verify source of funds');
        }
        return recommendations;
    }
    async getWalletData(address, chain) {
        try {
            const [balance, enhancedBalance, transactions] = await Promise.all([
                this.getBalance(address, chain),
                this.getAllTokenBalances(address, chain),
                this.getTransactionHistory(address, chain, 1000) // Get more transactions for analysis
            ]);
            const transactionAnalysis = await this.analyzeTransactionValues(transactions, address);
            return {
                balance,
                enhancedBalance,
                transactions,
                transactionAnalysis,
                blockchainInfo: this.getBlockchainInfo(chain)
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error(`Failed to get wallet data for ${address} on ${chain}: ${errorMessage}`);
            throw new Error(`Failed to get wallet data: ${errorMessage}`);
        }
    }
    determineTransactionType(tx) {
        if (tx.input === '0x' || tx.input === '') {
            return 'transfer';
        }
        else if (tx.input && tx.input.length > 10) {
            return 'contract';
        }
        else {
            return 'other';
        }
    }
    // Mock data methods for fallback
    getMockBalance(address, chain) {
        const chainConfig = this.chainConfigs.get(chain);
        const mockBalance = (Math.random() * 10).toFixed(6);
        return {
            balance: mockBalance,
            usdValue: parseFloat(mockBalance) * 2000, // Mock USD value
            lastUpdated: new Date()
        };
    }
    getMockTokenBalances(address, chain) {
        const mockTokens = [
            {
                contractAddress: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8',
                tokenName: 'Mock Token 1',
                tokenSymbol: 'MTK1',
                decimals: 18,
                balance: '100.0',
                usdValue: 150.0
            },
            {
                contractAddress: '0xB1c97a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8',
                tokenName: 'Mock Token 2',
                tokenSymbol: 'MTK2',
                decimals: 6,
                balance: '500.0',
                usdValue: 75.0
            }
        ];
        return mockTokens.map(token => ({
            ...token,
            lastUpdated: new Date()
        }));
    }
    getMockTransactions(address, chain, limit) {
        const chainConfig = this.chainConfigs.get(chain);
        const mockTransactions = [];
        for (let i = 0; i < Math.min(limit, 5); i++) {
            mockTransactions.push({
                hash: `0x${Math.random().toString(16).substring(2, 66)}`,
                from: address,
                to: `0x${Math.random().toString(16).substring(2, 42)}`,
                value: (Math.random() * 2).toFixed(6),
                timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                blockNumber: Math.floor(Math.random() * 1000000),
                gasUsed: Math.floor(Math.random() * 100000).toString(),
                gasPrice: Math.floor(Math.random() * 1000000000).toString(),
                status: 'success',
                type: 'transfer',
                currency: chainConfig?.symbol || 'ETH'
            });
        }
        return mockTransactions;
    }
}
exports.EVMService = EVMService;
//# sourceMappingURL=EVMService.js.map
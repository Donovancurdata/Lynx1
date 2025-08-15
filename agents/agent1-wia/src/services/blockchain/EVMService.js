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
        const ethereumConfig = config_1.config.getEthereumConfig();
        this.chainConfigs.set('ethereum', {
            name: 'Ethereum',
            symbol: 'ETH',
            chainId: 1,
            rpcUrl: ethereumConfig.rpcUrl || 'https://mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39',
            explorerUrl: 'https://etherscan.io',
            etherscanBaseUrl: 'https://api.etherscan.io/api',
            etherscanApiKey: ethereumConfig.etherscanApiKey || '',
            decimals: 18
        });
        const polygonConfig = config_1.config.getPolygonConfig();
        this.chainConfigs.set('polygon', {
            name: 'Polygon',
            symbol: 'MATIC',
            chainId: 137,
            rpcUrl: polygonConfig.rpcUrl || 'https://polygon-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39',
            explorerUrl: 'https://polygonscan.com',
            etherscanBaseUrl: 'https://api.etherscan.io/v2/api',
            etherscanApiKey: polygonConfig.polygonscanApiKey || '',
            decimals: 18
        });
        const binanceConfig = config_1.config.getBinanceConfig();
        this.chainConfigs.set('binance', {
            name: 'Binance Smart Chain',
            symbol: 'BNB',
            chainId: 56,
            rpcUrl: binanceConfig.rpcUrl || 'https://bsc-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39',
            explorerUrl: 'https://bscscan.com',
            etherscanBaseUrl: 'https://api.etherscan.io/v2/api',
            etherscanApiKey: binanceConfig.bscscanApiKey || '',
            decimals: 18
        });
        const avalancheConfig = config_1.config.getAvalancheConfig();
        this.chainConfigs.set('avalanche', {
            name: 'Avalanche',
            symbol: 'AVAX',
            chainId: 43114,
            rpcUrl: avalancheConfig.rpcUrl || 'https://avalanche-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39',
            explorerUrl: 'https://snowtrace.io',
            etherscanBaseUrl: 'https://api.snowtrace.io/api',
            etherscanApiKey: avalancheConfig.snowtraceApiKey || '',
            decimals: 18
        });
        const arbitrumConfig = config_1.config.getArbitrumConfig();
        this.chainConfigs.set('arbitrum', {
            name: 'Arbitrum One',
            symbol: 'ARB',
            chainId: 42161,
            rpcUrl: arbitrumConfig.rpcUrl || 'https://arbitrum-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39',
            explorerUrl: 'https://arbiscan.io',
            etherscanBaseUrl: 'https://api.arbiscan.io/api',
            etherscanApiKey: ethereumConfig.etherscanApiKey || '',
            decimals: 18
        });
        const optimismConfig = config_1.config.getOptimismConfig();
        this.chainConfigs.set('optimism', {
            name: 'Optimism',
            symbol: 'OP',
            chainId: 10,
            rpcUrl: optimismConfig.rpcUrl || 'https://optimism-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39',
            explorerUrl: 'https://optimistic.etherscan.io',
            etherscanBaseUrl: 'https://api-optimistic.etherscan.io/api',
            etherscanApiKey: ethereumConfig.etherscanApiKey || '',
            decimals: 18
        });
        const baseConfig = config_1.config.getBaseConfig();
        this.chainConfigs.set('base', {
            name: 'Base',
            symbol: 'ETH',
            chainId: 8453,
            rpcUrl: baseConfig.rpcUrl || 'https://base-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39',
            explorerUrl: 'https://basescan.org',
            etherscanBaseUrl: 'https://api.basescan.org/api',
            etherscanApiKey: ethereumConfig.etherscanApiKey || '',
            decimals: 18
        });
        const lineaConfig = config_1.config.getLineaConfig();
        this.chainConfigs.set('linea', {
            name: 'Linea',
            symbol: 'ETH',
            chainId: 59144,
            rpcUrl: lineaConfig.rpcUrl || 'https://linea-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39',
            explorerUrl: 'https://lineascan.build',
            etherscanBaseUrl: 'https://api.lineascan.build/api',
            etherscanApiKey: ethereumConfig.etherscanApiKey || '',
            decimals: 18
        });
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
            logger_1.logger.debug(`Getting ${chainConfig.name} balance for ${address} via ${chainConfig.rpcUrl}`);
            try {
                const blockNumber = await provider.getBlockNumber();
                logger_1.logger.debug(`RPC connection successful - Latest block: ${blockNumber}`);
            }
            catch (rpcError) {
                logger_1.logger.error(`RPC connection failed for ${chain}: ${rpcError instanceof Error ? rpcError.message : 'Unknown RPC error'}`);
                throw new Error(`RPC connection failed: ${rpcError instanceof Error ? rpcError.message : 'Unknown RPC error'}`);
            }
            const balance = await provider.getBalance(address);
            const balanceInUnits = ethers_1.ethers.formatEther(balance);
            const usdValue = await this.priceService.getTokenPrice(chainConfig.symbol, chain);
            logger_1.logger.debug(`${chainConfig.name} balance for ${address}: ${balanceInUnits} ${chainConfig.symbol} ($${usdValue})`);
            return {
                balance: balanceInUnits,
                usdValue,
                lastUpdated: new Date()
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error(`Failed to get ${chain} balance for ${address}: ${errorMessage}`);
            throw new Error(`Failed to get ${chain} balance: ${errorMessage}`);
        }
    }
    async getAllTokenBalances(address, chain) {
        try {
            logger_1.logger.debug(`Getting all token balances for ${address} on ${chain}`);
            const nativeBalance = await this.getBalance(address, chain);
            const tokens = await this.getERC20Tokens(address, chain);
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
                logger_1.logger.warn(`${chainConfig.name} API key not provided, cannot get token balances`);
                return [];
            }
            logger_1.logger.debug(`Getting ERC-20 tokens for ${address} on ${chainConfig.name}`);
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
                logger_1.logger.warn(`Failed to get token transfers from ${chainConfig.name} API, returning empty array`);
                return [];
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error(`Failed to get ERC-20 tokens for ${address} on ${chain}: ${errorMessage}`);
            return [];
        }
    }
    async getTokenBalance(address, contractAddress, tokenInfo, chain) {
        try {
            const provider = this.providers.get(chain);
            if (!provider) {
                throw new Error(`Provider not found for chain: ${chain}`);
            }
            const balanceOfAbi = ['function balanceOf(address owner) view returns (uint256)'];
            const tokenContract = new ethers_1.ethers.Contract(contractAddress, balanceOfAbi, provider);
            const balance = await tokenContract.balanceOf(address);
            const formattedBalance = ethers_1.ethers.formatUnits(balance, tokenInfo.decimals);
            const usdValue = await this.priceService.getTokenPrice(tokenInfo.tokenSymbol, chain);
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
                logger_1.logger.warn(`${chainConfig.name} API key not provided, cannot get transaction history`);
                return [];
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
                logger_1.logger.warn(`Failed to get transactions from ${chainConfig.name} API, will try RPC fallback`);
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error(`Failed to get transaction history for ${address} on ${chain}: ${errorMessage}`);
            try {
                logger_1.logger.debug(`Attempting RPC fallback for transaction history on ${chain}`);
                const provider = this.providers.get(chain);
                const chainConfig = this.chainConfigs.get(chain);
                if (provider && chainConfig) {
                    const latestBlock = await provider.getBlockNumber();
                    const transactions = [];
                    const startBlock = Math.max(0, latestBlock - 100);
                    for (let blockNum = latestBlock; blockNum >= startBlock && transactions.length < limit; blockNum--) {
                        try {
                            const block = await provider.getBlock(blockNum, true);
                            if (block && block.transactions) {
                                for (const tx of block.transactions) {
                                    if (transactions.length >= limit)
                                        break;
                                    if (typeof tx === 'string') {
                                        continue;
                                    }
                                    const txObj = tx;
                                    if (txObj.from?.toLowerCase() === address.toLowerCase() || txObj.to?.toLowerCase() === address.toLowerCase()) {
                                        transactions.push({
                                            hash: txObj.hash,
                                            from: txObj.from || '',
                                            to: txObj.to || '',
                                            value: ethers_1.ethers.formatEther(txObj.value || 0),
                                            timestamp: new Date((block.timestamp || 0) * 1000),
                                            blockNumber: blockNum,
                                            gasUsed: txObj.gasLimit?.toString() || '0',
                                            gasPrice: txObj.gasPrice?.toString() || '0',
                                            status: 'success',
                                            type: this.determineTransactionType(txObj),
                                            currency: chainConfig?.symbol || 'ETH'
                                        });
                                    }
                                }
                            }
                        }
                        catch (blockError) {
                            logger_1.logger.debug(`Failed to get block ${blockNum}: ${blockError instanceof Error ? blockError.message : 'Unknown error'}`);
                            continue;
                        }
                    }
                    if (transactions.length > 0) {
                        logger_1.logger.debug(`RPC fallback successful: Retrieved ${transactions.length} transactions for ${address} on ${chain}`);
                        return transactions;
                    }
                }
            }
            catch (rpcError) {
                logger_1.logger.debug(`RPC fallback also failed: ${rpcError instanceof Error ? rpcError.message : 'Unknown error'}`);
            }
            logger_1.logger.warn(`No transaction data available for ${address} on ${chain}, returning empty array`);
            return [];
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
            let confidence = 'medium';
            if (transactionCount > 50 && totalValue > 10000) {
                confidence = 'high';
            }
            else if (transactionCount < 5) {
                confidence = 'low';
            }
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
        if (transactionAnalysis.largestTransaction > 100000)
            riskScore += 20;
        if (transactionAnalysis.averageTransaction > 10000)
            riskScore += 15;
        if (transactionAnalysis.transactionCount > 1000)
            riskScore += 25;
        if (transactionAnalysis.transactionCount > 100)
            riskScore += 15;
        if (Math.abs(transactionAnalysis.netFlow) > 50000)
            riskScore += 20;
        if (enhancedBalance.tokens.length > 20)
            riskScore += 10;
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
            for (let i = 4; i >= 0; i--) {
                const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                const dateStr = date.toISOString().split('T')[0];
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
            const [balance, enhancedBalance, transactions] = await Promise.all([
                this.getBalance(address, chain),
                this.getAllTokenBalances(address, chain),
                this.getTransactionHistory(address, chain, 1000)
            ]);
            const transactionAnalysis = await this.analyzeTransactionValues(transactions, address);
            const recentTransactions = transactions.slice(0, 10);
            const walletOpinion = await this.generateWalletOpinion(address, enhancedBalance, transactionAnalysis, transactions);
            const fundFlows = await this.generateFundFlows(transactions, address);
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
                this.getTransactionHistory(address, chain, 1000)
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
}
exports.EVMService = EVMService;
//# sourceMappingURL=EVMService.js.map
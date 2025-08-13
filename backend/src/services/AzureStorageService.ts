import { DataLakeServiceClient } from '@azure/storage-file-datalake';
import { ClientSecretCredential } from '@azure/identity';
import { logger } from '../utils/logger';

export interface DeepAnalysisStorageData {
  walletAddress: string;
  blockchain: string;
  analysisDate: string;
  totalValue: number;
  totalTransactions: number;
  nativeBalance: string;
  nativeUsdValue: number;
  tokens: any[];
  transactions: any[];
  discoveredTokens: any[];
}

export class AzureStorageService {
  private static isInitialized = false;
  private static dataLakeServiceClient: DataLakeServiceClient | null = null;

  static async initialize(): Promise<void> {
    try {
      const accountName = process.env['AZURE_STORAGE_ACCOUNT_NAME'];
      const tenantId = process.env['AZURE_TENANT_ID'];
      const clientId = process.env['AZURE_CLIENT_ID'];
      const clientSecret = process.env['AZURE_CLIENT_SECRET'];
      
      if (accountName && tenantId && clientId && clientSecret) {
        // Create client secret credential for Azure AD authentication
        const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
        
        // Create Data Lake service client
        this.dataLakeServiceClient = new DataLakeServiceClient(
          `https://${accountName}.dfs.core.windows.net`,
          credential
        );
        
        logger.info('✅ Azure Data Lake Storage Gen2 client initialized successfully with Azure AD');
        this.isInitialized = true;
      } else {
        logger.warn('⚠️ Azure AD credentials not found, using mock storage');
        this.isInitialized = false;
      }
    } catch (error) {
      logger.error('Failed to initialize Azure storage service:', error);
      this.isInitialized = false;
    }
  }

  /**
   * Store deep analysis data to Azure
   */
  static async storeDeepAnalysisData(data: DeepAnalysisStorageData): Promise<string> {
    try {
      if (!this.isInitialized || !this.dataLakeServiceClient) {
        // Mock storage for development
        const mockId = `mock-${data.walletAddress}-${data.blockchain}-${Date.now()}`;
        logger.info(`💾 Mock stored deep analysis data: ${mockId}`);
        return mockId;
      }

      // Create container name for wallet analysis
      const containerName = `wallet-analysis-${data.walletAddress.toLowerCase()}-${data.blockchain.toLowerCase()}`;
      
      // Create file system (container) if it doesn't exist
      const fileSystemClient = this.dataLakeServiceClient.getFileSystemClient(containerName);
      try {
        await fileSystemClient.create();
        logger.info(`📁 Created file system: ${containerName}`);
      } catch (error: any) {
        if (error.statusCode !== 409) { // 409 = already exists
          throw error;
        }
      }

      // Create file path with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `analysis-${timestamp}.json`;
      const fileClient = fileSystemClient.getFileClient(fileName);

      // Prepare data for storage
      const storageData = {
        ...data,
        storedAt: new Date().toISOString(),
        version: '1.0'
      };

      // Convert to JSON string
      const jsonContent = JSON.stringify(storageData, null, 2);
      
      // Upload to Azure Data Lake
      await fileClient.create();
      await fileClient.append(jsonContent, 0, jsonContent.length);
      await fileClient.flush(jsonContent.length);

      const storageId = `azure-${data.walletAddress}-${data.blockchain}-${timestamp}`;
      logger.info(`💾 Azure stored deep analysis data: ${storageId}`);
      
      return storageId;
    } catch (error) {
      logger.error('Failed to store deep analysis data to Azure:', error);
      throw error;
    }
  }

  /**
   * Store discovered tokens for future daily collection evaluation
   */
  static async storeDiscoveredTokens(walletAddress: string, tokens: any[]): Promise<string> {
    try {
      if (!this.isInitialized || !this.dataLakeServiceClient) {
        const mockId = `mock-discovered-tokens-${walletAddress}-${Date.now()}`;
        logger.info(`💾 Mock stored discovered tokens: ${mockId}`);
        return mockId;
      }

      // Create container name for discovered tokens
      const containerName = 'discovered-tokens';
      
      // Create file system (container) if it doesn't exist
      const fileSystemClient = this.dataLakeServiceClient.getFileSystemClient(containerName);
      try {
        await fileSystemClient.create();
        logger.info(`📁 Created file system: ${containerName}`);
      } catch (error: any) {
        if (error.statusCode !== 409) { // 409 = already exists
          throw error;
        }
      }

      // Create file path with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `${walletAddress.toLowerCase()}-tokens-${timestamp}.json`;
      const fileClient = fileSystemClient.getFileClient(fileName);

      // Prepare data for storage
      const storageData = {
        walletAddress,
        tokens,
        discoveredAt: new Date().toISOString(),
        version: '1.0'
      };

      // Convert to JSON string
      const jsonContent = JSON.stringify(storageData, null, 2);
      
      // Upload to Azure Data Lake
      await fileClient.create();
      await fileClient.append(jsonContent, 0, jsonContent.length);
      await fileClient.flush(jsonContent.length);

      const storageId = `azure-discovered-tokens-${walletAddress}-${timestamp}`;
      logger.info(`💾 Azure stored discovered tokens: ${storageId}`);
      
      return storageId;
    } catch (error) {
      logger.error('Failed to store discovered tokens to Azure:', error);
      throw error;
    }
  }

  /**
   * Upload file to Azure Data Lake Storage Gen2
   */
  static async uploadFile(containerName: string, filePath: string, content: string): Promise<void> {
    try {
      if (!this.isInitialized || !this.dataLakeServiceClient) {
        logger.info(`💾 Mock uploaded file: ${containerName}/${filePath}`);
        return;
      }

      // Create file system (container) if it doesn't exist
      const fileSystemClient = this.dataLakeServiceClient.getFileSystemClient(containerName);
      try {
        await fileSystemClient.create();
        logger.info(`📁 Created file system: ${containerName}`);
      } catch (error: any) {
        if (error.statusCode !== 409) { // 409 = already exists
          throw error;
        }
      }

      // Get file client
      const fileClient = fileSystemClient.getFileClient(filePath);

      // Upload to Azure Data Lake
      await fileClient.create();
      await fileClient.append(content, 0, content.length);
      await fileClient.flush(content.length);

      logger.info(`💾 Azure uploaded file: ${containerName}/${filePath}`);
    } catch (error) {
      logger.error('Failed to upload file to Azure:', error);
      throw error;
    }
  }
}

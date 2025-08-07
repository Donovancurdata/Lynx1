import { DataLakeServiceClient } from '@azure/storage-file-datalake'
import { DefaultAzureCredential } from '@azure/identity'
import dotenv from 'dotenv'

dotenv.config()

export interface WalletTransaction {
  hash: string
  from: string
  to: string
  value: string
  blockNumber: string
  timestamp: string
  gasPrice: string
  gasUsed: string
  blockchain: string
  // Enhanced token information
  currency?: string
  tokenSymbol?: string
  tokenName?: string
  tokenAddress?: string
  tokenValue?: string
  tokenDecimals?: number
  isTokenTransfer?: boolean
}

export interface WalletAnalysisData {
  walletId: string
  analysisDate: string
  blockchains: {
    [blockchain: string]: {
      balance: {
        value: string
        usdValue: number
        currency: string
      }
      tokens: Array<{
        symbol: string
        name: string
        balance: string
        usdValue: number
        contractAddress: string
      }>
      transactions: WalletTransaction[]
      totalTransactionCount: number
      tokenTransactionCount: number
      historicalTradingValue: number
    }
  }
  totalValue: number
  totalTransactions: number
  lastUpdated: string
}

export class WalletAnalysisStorage {
  private dataLakeServiceClient: DataLakeServiceClient
  private fileSystemName = 'wallet-analysis'

  constructor() {
    const accountName = 'saprodtesting'
    const accountUrl = `https://${accountName}.dfs.core.windows.net`
    
    this.dataLakeServiceClient = new DataLakeServiceClient(
      accountUrl,
      new DefaultAzureCredential()
    )
  }

  public async storeWalletAnalysis(analysisData: WalletAnalysisData): Promise<void> {
    try {
      const fileSystemClient = this.dataLakeServiceClient.getFileSystemClient(this.fileSystemName)
      
      // Create file system if it doesn't exist
      try {
        await fileSystemClient.create()
        console.log(`✅ Created file system: ${this.fileSystemName}`)
      } catch (error: any) {
        if (error.statusCode !== 409) { // 409 = already exists
          console.log(`⚠️ File system creation error: ${error.message}`)
          throw error
        } else {
          console.log(`✅ File system already exists: ${this.fileSystemName}`)
        }
      }

      // Create filename with wallet ID and timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `${analysisData.walletId}-${timestamp}.json`
      
      const fileClient = fileSystemClient.getFileClient(fileName)
      
      const jsonData = JSON.stringify(analysisData, null, 2)
      const buffer = Buffer.from(jsonData, 'utf8')
      
      // Create the file first, then append data
      await fileClient.create()
      await fileClient.append(buffer, 0, buffer.length)
      await fileClient.flush(buffer.length)
      
      console.log(`✅ Stored wallet analysis for ${analysisData.walletId} in ${fileName}`)
      console.log(`📊 Analysis Summary:`)
      console.log(`   • Total Value: $${analysisData.totalValue.toFixed(2)}`)
      console.log(`   • Total Transactions: ${analysisData.totalTransactions}`)
      console.log(`   • Blockchains: ${Object.keys(analysisData.blockchains).join(', ')}`)
      
      // Log transaction counts per blockchain
      for (const [blockchain, data] of Object.entries(analysisData.blockchains)) {
        console.log(`   • ${blockchain.toUpperCase()}: ${data.transactions.length} transactions`)
      }
      
    } catch (error) {
      console.error('❌ Error storing wallet analysis:', error)
      throw error
    }
  }

  public async readWalletAnalysis(walletId: string, timestamp?: string): Promise<WalletAnalysisData | null> {
    try {
      const fileSystemClient = this.dataLakeServiceClient.getFileSystemClient(this.fileSystemName)
      
      let fileName: string
      if (timestamp) {
        fileName = `${walletId}-${timestamp}.json`
      } else {
        // Get the most recent file for this wallet
        const files = []
        for await (const file of fileSystemClient.listPaths()) {
          if (file.name && file.name.startsWith(walletId)) {
            files.push(file.name)
          }
        }
        
        if (files.length === 0) {
          return null
        }
        
        // Sort by timestamp and get the most recent
        files.sort()
        const latestFile = files[files.length - 1]
        if (!latestFile) {
          return null
        }
        fileName = latestFile
      }
      
      const fileClient = fileSystemClient.getFileClient(fileName)
      const response = await fileClient.read()
      const content = await this.streamToString(response.readableStreamBody!)
      
      return JSON.parse(content) as WalletAnalysisData
    } catch (error) {
      console.error('❌ Error reading wallet analysis:', error)
      return null
    }
  }

  public async listWalletAnalyses(walletId?: string): Promise<string[]> {
    try {
      const fileSystemClient = this.dataLakeServiceClient.getFileSystemClient(this.fileSystemName)
      const files = []
      
      for await (const file of fileSystemClient.listPaths()) {
        if (file.name && (!walletId || file.name.startsWith(walletId))) {
          files.push(file.name)
        }
      }
      
      return files.sort()
    } catch (error) {
      console.error('❌ Error listing wallet analyses:', error)
      return []
    }
  }

  private async streamToString(readableStream: NodeJS.ReadableStream): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []
      readableStream.on('data', (data) => {
        chunks.push(Buffer.from(data))
      })
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf8'))
      })
      readableStream.on('error', reject)
    })
  }
} 
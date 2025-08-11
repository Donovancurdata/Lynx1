import { DataLakeServiceClient } from '@azure/storage-file-datalake'
import { ClientSecretCredential, DefaultAzureCredential } from '@azure/identity'
import { logger } from '../utils/logger'

export interface ConversationMessageRecord {
  id: string
  role: 'user' | 'agent' | 'system' | 'progress' | 'insight' | 'error'
  content: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface ConversationSessionRecord {
  sessionId: string
  clientId: string
  startTime: string
  endTime: string
  messageCount: number
  messages: ConversationMessageRecord[]
  metadata?: Record<string, any>
}

export class AzureConversationStorage {
  private dataLakeServiceClient: DataLakeServiceClient
  private fileSystemName = 'agent-conversations'

  constructor() {
    const accountName = process.env['AZURE_STORAGE_ACCOUNT_NAME'] || 'saprodtesting'

    // Prefer explicit client secret credential if provided, else fall back to DefaultAzureCredential
    const tenantId = process.env['AZURE_TENANT_ID']
    const clientId = process.env['AZURE_CLIENT_ID']
    const clientSecret = process.env['AZURE_CLIENT_SECRET']

    let credential
    if (tenantId && clientId && clientSecret) {
      credential = new ClientSecretCredential(tenantId, clientId, clientSecret)
      logger.info('AzureConversationStorage using ClientSecretCredential')
    } else {
      credential = new DefaultAzureCredential()
      logger.info('AzureConversationStorage using DefaultAzureCredential')
    }

    // Use dfs endpoint for ADLS Gen2
    const accountUrl = `https://${accountName}.dfs.core.windows.net`
    this.dataLakeServiceClient = new DataLakeServiceClient(accountUrl, credential)
  }

  public async saveConversation(session: ConversationSessionRecord): Promise<void> {
    try {
      const fileSystemClient = this.dataLakeServiceClient.getFileSystemClient(this.fileSystemName)

      // Ensure filesystem exists
      try {
        await fileSystemClient.create()
        logger.info(`Created file system: ${this.fileSystemName}`)
      } catch (error: any) {
        if (error.statusCode !== 409) {
          // 409 = already exists
          logger.error('File system creation error', { error: error.message })
          throw error
        }
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const safeClientId = session.clientId.replace(/[^a-zA-Z0-9_-]/g, '_')
      const safeSessionId = session.sessionId.replace(/[^a-zA-Z0-9_-]/g, '_')
      const fileName = `${safeClientId}-${safeSessionId}-${timestamp}.json`

      const fileClient = fileSystemClient.getFileClient(fileName)

      const jsonData = JSON.stringify(session, null, 2)
      const buffer = Buffer.from(jsonData, 'utf8')

      await fileClient.create()
      await fileClient.append(buffer, 0, buffer.length)
      await fileClient.flush(buffer.length)

      logger.info('Stored conversation history to Azure', {
        fileSystem: this.fileSystemName,
        fileName,
        clientId: session.clientId,
        sessionId: session.sessionId,
        messageCount: session.messageCount
      })
    } catch (error) {
      logger.error('Error saving conversation to Azure', { error })
      // Do not rethrow to avoid breaking runtime message flow
    }
  }
}
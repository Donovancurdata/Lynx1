#!/usr/bin/env node

/**
 * OpenAI Setup Script for LYNX Intelligent Agent
 * This script helps configure and test the OpenAI integration
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupOpenAI() {
  console.log('🚀 LYNX Intelligent Agent - OpenAI Setup\n');
  
  try {
    // Check if .env file exists
    const envPath = path.join(__dirname, '..', '..', '.env');
    const envExists = fs.existsSync(envPath);
    
    if (!envExists) {
      console.log('❌ .env file not found in project root');
      console.log('Please create a .env file in the project root directory');
      return;
    }
    
    console.log('✅ Found .env file');
    
    // Read current .env content
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if OpenAI key is already set
    if (envContent.includes('OPENAI_API_KEY=your_openai_api_key_here')) {
      console.log('⚠️  OpenAI API key not configured yet');
      
      const apiKey = await question('Enter your OpenAI API key: ');
      
      if (!apiKey || apiKey.trim() === '') {
        console.log('❌ API key cannot be empty');
        return;
      }
      
      // Update the .env file
      envContent = envContent.replace(
        'OPENAI_API_KEY=your_openai_api_key_here',
        `OPENAI_API_KEY=${apiKey.trim()}`
      );
      
      // Also ensure other OpenAI settings are properly configured
      if (!envContent.includes('OPENAI_MODEL=gpt-4')) {
        envContent += '\n# OpenAI Configuration\n';
        envContent += 'OPENAI_MODEL=gpt-4\n';
        envContent += 'OPENAI_MAX_TOKENS=4000\n';
        envContent += 'OPENAI_TEMPERATURE=0.7\n';
      }
      
      // Write updated .env file
      fs.writeFileSync(envPath, envContent);
      console.log('✅ OpenAI API key configured successfully');
      
    } else if (envContent.includes('OPENAI_API_KEY=')) {
      console.log('✅ OpenAI API key already configured');
      
      // Test the configuration
      const testConfig = await question('Would you like to test the OpenAI connection? (y/n): ');
      
      if (testConfig.toLowerCase() === 'y' || testConfig.toLowerCase() === 'yes') {
        await testOpenAIConnection();
      }
    }
    
    // Show current configuration
    console.log('\n📋 Current OpenAI Configuration:');
    const lines = envContent.split('\n');
    lines.forEach(line => {
      if (line.startsWith('OPENAI_')) {
        const [key, value] = line.split('=');
        if (key === 'OPENAI_API_KEY') {
          console.log(`${key}=${value.substring(0, 8)}...${value.substring(value.length - 4)}`);
        } else {
          console.log(line);
        }
      }
    });
    
    console.log('\n🎉 Setup complete! You can now run the intelligent agent.');
    console.log('\nNext steps:');
    console.log('1. Build the project: npm run build');
    console.log('2. Test the agent: node test-ai-agent.js');
    console.log('3. Start the agent: npm run dev');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

async function testOpenAIConnection() {
  console.log('\n🧪 Testing OpenAI connection...');
  
  try {
    // Load environment variables
    require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
    
    // Try to create OpenAI service
    const { OpenAIService } = require('./dist/services/OpenAIService');
    
    const openaiService = new OpenAIService();
    console.log('✅ OpenAI service created successfully');
    
    // Test connection
    const isConnected = await openaiService.testConnection();
    
    if (isConnected) {
      console.log('✅ OpenAI connection test successful');
      console.log('✅ GPT-4 model is accessible');
    } else {
      console.log('❌ OpenAI connection test failed');
    }
    
  } catch (error) {
    console.error('❌ OpenAI connection test failed:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Verify your API key is correct');
    console.log('2. Ensure you have GPT-4 access');
    console.log('3. Check your OpenAI account billing status');
    console.log('4. Verify your API key has not expired');
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  setupOpenAI().catch(console.error);
}

module.exports = { setupOpenAI, testOpenAIConnection };


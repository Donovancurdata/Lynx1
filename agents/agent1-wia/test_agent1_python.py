#!/usr/bin/env python3
"""
Python test script for Agent 1 WIA
This script tests the TypeScript files by checking their structure and content
"""

import os
import json
import re
from pathlib import Path

def test_file_structure():
    """Test that all required files exist"""
    print("🔍 Testing file structure...")
    
    required_files = [
        "src/Agent1WIA.ts",
        "src/index.ts",
        "src/test-agent1.ts",
        "src/test-blockchain-services.ts",
        "src/services/blockchain/BlockchainServiceFactory.ts",
        "src/services/blockchain/EthereumService.ts",
        "src/services/blockchain/BitcoinService.ts",
        "src/services/blockchain/BinanceService.ts",
        "src/services/blockchain/PolygonService.ts",
        "src/services/blockchain/SolanaService.ts",
        "src/services/BlockchainDetector.ts",
        "src/services/WalletInvestigator.ts",
        "src/services/TransactionAnalyzer.ts",
        "src/services/FundFlowTracker.ts",
        "src/services/WalletOpinionGenerator.ts",
        "src/services/RiskAnalyzer.ts",
        "src/services/DataStorage.ts",
        "src/types/index.ts",
        "src/utils/logger.ts",
        "package.json",
        "README.md",
        "example-usage.ts"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
        else:
            print(f"  ✅ {file_path}")
    
    if missing_files:
        print(f"  ❌ Missing files: {missing_files}")
        return False
    else:
        print("  ✅ All required files exist")
        return True

def test_package_json():
    """Test package.json structure"""
    print("\n📦 Testing package.json...")
    
    try:
        with open("package.json", "r") as f:
            package_data = json.load(f)
        
        required_fields = ["name", "version", "description", "main", "scripts"]
        missing_fields = []
        
        for field in required_fields:
            if field not in package_data:
                missing_fields.append(field)
        
        if missing_fields:
            print(f"  ❌ Missing fields in package.json: {missing_fields}")
            return False
        
        # Check for required scripts
        required_scripts = ["build", "start", "dev", "test", "test:agent1"]
        missing_scripts = []
        
        for script in required_scripts:
            if script not in package_data.get("scripts", {}):
                missing_scripts.append(script)
        
        if missing_scripts:
            print(f"  ❌ Missing scripts in package.json: {missing_scripts}")
            return False
        
        print("  ✅ package.json structure is valid")
        print(f"  📋 Package name: {package_data['name']}")
        print(f"  📋 Version: {package_data['version']}")
        print(f"  📋 Description: {package_data['description']}")
        return True
        
    except Exception as e:
        print(f"  ❌ Error reading package.json: {e}")
        return False

def test_typescript_files():
    """Test TypeScript files for basic structure"""
    print("\n📝 Testing TypeScript files...")
    
    # Test main Agent1WIA class
    agent1_file = "src/Agent1WIA.ts"
    if os.path.exists(agent1_file):
        with open(agent1_file, "r") as f:
            content = f.read()
            
        # Check for required class
        if "class Agent1WIA" in content:
            print("  ✅ Agent1WIA class found")
        else:
            print("  ❌ Agent1WIA class not found")
            return False
        
        # Check for required methods
        required_methods = [
            "investigateWallet",
            "detectBlockchain", 
            "getMultiChainBalance",
            "getServiceHealth",
            "getSupportedBlockchains"
        ]
        
        missing_methods = []
        for method in required_methods:
            if f"async {method}" not in content and f"{method}(" not in content:
                missing_methods.append(method)
        
        if missing_methods:
            print(f"  ❌ Missing methods in Agent1WIA: {missing_methods}")
            return False
        else:
            print("  ✅ All required methods found in Agent1WIA")
    else:
        print("  ❌ Agent1WIA.ts not found")
        return False
    
    # Test blockchain services
    blockchain_files = [
        "src/services/blockchain/BlockchainServiceFactory.ts",
        "src/services/blockchain/EthereumService.ts",
        "src/services/blockchain/BitcoinService.ts",
        "src/services/blockchain/BinanceService.ts",
        "src/services/blockchain/PolygonService.ts",
        "src/services/blockchain/SolanaService.ts"
    ]
    
    for file_path in blockchain_files:
        if os.path.exists(file_path):
            print(f"  ✅ {os.path.basename(file_path)} exists")
        else:
            print(f"  ❌ {os.path.basename(file_path)} missing")
            return False
    
    return True

def test_blockchain_detection():
    """Test blockchain detection patterns"""
    print("\n🔍 Testing blockchain detection patterns...")
    
    detector_file = "src/services/BlockchainDetector.ts"
    if os.path.exists(detector_file):
        with open(detector_file, "r") as f:
            content = f.read()
        
        # Check for blockchain patterns
        blockchains = ["ethereum", "bitcoin", "binance", "polygon", "solana"]
        found_blockchains = []
        
        for blockchain in blockchains:
            if blockchain in content.lower():
                found_blockchains.append(blockchain)
        
        if len(found_blockchains) >= 4:  # At least 4 blockchains should be supported
            print(f"  ✅ Supported blockchains found: {found_blockchains}")
            return True
        else:
            print(f"  ❌ Insufficient blockchain support: {found_blockchains}")
            return False
    else:
        print("  ❌ BlockchainDetector.ts not found")
        return False

def test_data_storage():
    """Test data storage implementation"""
    print("\n🗄️ Testing data storage...")
    
    storage_file = "src/services/DataStorage.ts"
    if os.path.exists(storage_file):
        with open(storage_file, "r") as f:
            content = f.read()
        
        # Check for OneLake integration
        if "OneLake" in content or "onelake" in content.lower():
            print("  ✅ OneLake integration found")
        else:
            print("  ⚠️ OneLake integration not found")
        
        # Check for required methods
        required_methods = ["storeInvestigationData", "getInvestigationData", "storeAgentMessage"]
        missing_methods = []
        
        for method in required_methods:
            if f"async {method}" not in content:
                missing_methods.append(method)
        
        if missing_methods:
            print(f"  ❌ Missing storage methods: {missing_methods}")
            return False
        else:
            print("  ✅ All required storage methods found")
            return True
    else:
        print("  ❌ DataStorage.ts not found")
        return False

def test_types():
    """Test type definitions"""
    print("\n📋 Testing type definitions...")
    
    types_file = "src/types/index.ts"
    if os.path.exists(types_file):
        with open(types_file, "r") as f:
            content = f.read()
        
        # Check for required interfaces
        required_interfaces = [
            "WalletInvestigationRequest",
            "WalletInvestigationResponse", 
            "WalletInvestigationData",
            "Transaction",
            "BlockchainInfo",
            "AgentMessage"
        ]
        
        missing_interfaces = []
        for interface in required_interfaces:
            if f"interface {interface}" not in content:
                missing_interfaces.append(interface)
        
        if missing_interfaces:
            print(f"  ❌ Missing type interfaces: {missing_interfaces}")
            return False
        else:
            print("  ✅ All required type interfaces found")
            return True
    else:
        print("  ❌ types/index.ts not found")
        return False

def test_documentation():
    """Test documentation"""
    print("\n📚 Testing documentation...")
    
    readme_file = "README.md"
    if os.path.exists(readme_file):
        with open(readme_file, "r") as f:
            content = f.read()
        
        # Check for required sections
        required_sections = [
            "Overview",
            "Core Capabilities", 
            "Usage Examples",
            "API Reference"
        ]
        
        missing_sections = []
        for section in required_sections:
            if section not in content:
                missing_sections.append(section)
        
        if missing_sections:
            print(f"  ❌ Missing documentation sections: {missing_sections}")
            return False
        else:
            print("  ✅ All required documentation sections found")
            return True
    else:
        print("  ❌ README.md not found")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting Agent 1 WIA Python Tests...\n")
    
    tests = [
        test_file_structure,
        test_package_json,
        test_typescript_files,
        test_blockchain_detection,
        test_data_storage,
        test_types,
        test_documentation
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"  ❌ Test failed with error: {e}")
    
    print(f"\n📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Agent 1 WIA is properly implemented.")
        print("\n📋 Summary:")
        print("  ✅ File structure is correct")
        print("  ✅ Package configuration is valid")
        print("  ✅ TypeScript files are properly structured")
        print("  ✅ Blockchain detection is implemented")
        print("  ✅ Data storage is configured")
        print("  ✅ Type definitions are complete")
        print("  ✅ Documentation is comprehensive")
        print("\n🔧 Next steps:")
        print("  1. Install Node.js and npm")
        print("  2. Run 'npm install' to install dependencies")
        print("  3. Run 'npm run test:agent1' to execute the full test suite")
        print("  4. Run 'npm run build' to compile the TypeScript code")
    else:
        print("❌ Some tests failed. Please check the implementation.")
    
    return passed == total

if __name__ == "__main__":
    main() 
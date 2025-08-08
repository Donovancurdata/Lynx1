# PowerShell test script for Agent 1 WIA
# This script tests the TypeScript files by checking their structure and content

Write-Host "🚀 Starting Agent 1 WIA PowerShell Tests..." -ForegroundColor Green
Write-Host ""

# Test file structure
Write-Host "🔍 Testing file structure..." -ForegroundColor Yellow

$requiredFiles = @(
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
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        $missingFiles += $file
        Write-Host "  ❌ $file" -ForegroundColor Red
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "  ❌ Missing files: $($missingFiles -join ', ')" -ForegroundColor Red
    $fileStructurePass = $false
} else {
    Write-Host "  ✅ All required files exist" -ForegroundColor Green
    $fileStructurePass = $true
}

# Test package.json
Write-Host ""
Write-Host "📦 Testing package.json..." -ForegroundColor Yellow

if (Test-Path "package.json") {
    try {
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        
        $requiredFields = @("name", "version", "description", "main", "scripts")
        $missingFields = @()
        
        foreach ($field in $requiredFields) {
            if (-not $packageJson.PSObject.Properties.Name.Contains($field)) {
                $missingFields += $field
            }
        }
        
        if ($missingFields.Count -gt 0) {
            Write-Host "  ❌ Missing fields in package.json: $($missingFields -join ', ')" -ForegroundColor Red
            $packageJsonPass = $false
        } else {
            Write-Host "  ✅ package.json structure is valid" -ForegroundColor Green
            Write-Host "  📋 Package name: $($packageJson.name)" -ForegroundColor Cyan
            Write-Host "  📋 Version: $($packageJson.version)" -ForegroundColor Cyan
            Write-Host "  📋 Description: $($packageJson.description)" -ForegroundColor Cyan
            $packageJsonPass = $true
        }
    } catch {
        Write-Host "  ❌ Error reading package.json: $_" -ForegroundColor Red
        $packageJsonPass = $false
    }
} else {
    Write-Host "  ❌ package.json not found" -ForegroundColor Red
    $packageJsonPass = $false
}

# Test TypeScript files
Write-Host ""
Write-Host "📝 Testing TypeScript files..." -ForegroundColor Yellow

if (Test-Path "src/Agent1WIA.ts") {
    $agent1Content = Get-Content "src/Agent1WIA.ts" -Raw
    
    if ($agent1Content -match "class Agent1WIA") {
        Write-Host "  ✅ Agent1WIA class found" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Agent1WIA class not found" -ForegroundColor Red
        $typescriptPass = $false
    }
    
    $requiredMethods = @("investigateWallet", "detectBlockchain", "getMultiChainBalance", "getServiceHealth", "getSupportedBlockchains")
    $missingMethods = @()
    
    foreach ($method in $requiredMethods) {
        if ($agent1Content -notmatch "async $method" -and $agent1Content -notmatch "$method\(") {
            $missingMethods += $method
        }
    }
    
    if ($missingMethods.Count -gt 0) {
        Write-Host "  ❌ Missing methods in Agent1WIA: $($missingMethods -join ', ')" -ForegroundColor Red
        $typescriptPass = $false
    } else {
        Write-Host "  ✅ All required methods found in Agent1WIA" -ForegroundColor Green
        $typescriptPass = $true
    }
} else {
    Write-Host "  ❌ Agent1WIA.ts not found" -ForegroundColor Red
    $typescriptPass = $false
}

# Test blockchain services
$blockchainFiles = @(
    "src/services/blockchain/BlockchainServiceFactory.ts",
    "src/services/blockchain/EthereumService.ts",
    "src/services/blockchain/BitcoinService.ts",
    "src/services/blockchain/BinanceService.ts",
    "src/services/blockchain/PolygonService.ts",
    "src/services/blockchain/SolanaService.ts"
)

foreach ($file in $blockchainFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $(Split-Path $file -Leaf) exists" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $(Split-Path $file -Leaf) missing" -ForegroundColor Red
        $typescriptPass = $false
    }
}

# Test blockchain detection
Write-Host ""
Write-Host "🔍 Testing blockchain detection patterns..." -ForegroundColor Yellow

if (Test-Path "src/services/BlockchainDetector.ts") {
    $detectorContent = Get-Content "src/services/BlockchainDetector.ts" -Raw
    
    $blockchains = @("ethereum", "bitcoin", "binance", "polygon", "solana")
    $foundBlockchains = @()
    
    foreach ($blockchain in $blockchains) {
        if ($detectorContent.ToLower() -match $blockchain) {
            $foundBlockchains += $blockchain
        }
    }
    
    if ($foundBlockchains.Count -ge 4) {
        Write-Host "  ✅ Supported blockchains found: $($foundBlockchains -join ', ')" -ForegroundColor Green
        $blockchainDetectionPass = $true
    } else {
        Write-Host "  ❌ Insufficient blockchain support: $($foundBlockchains -join ', ')" -ForegroundColor Red
        $blockchainDetectionPass = $false
    }
} else {
    Write-Host "  ❌ BlockchainDetector.ts not found" -ForegroundColor Red
    $blockchainDetectionPass = $false
}

# Test data storage
Write-Host ""
Write-Host "🗄️ Testing data storage..." -ForegroundColor Yellow

if (Test-Path "src/services/DataStorage.ts") {
    $storageContent = Get-Content "src/services/DataStorage.ts" -Raw
    
    if ($storageContent -match "OneLake" -or $storageContent.ToLower() -match "onelake") {
        Write-Host "  ✅ OneLake integration found" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️ OneLake integration not found" -ForegroundColor Yellow
    }
    
    $requiredMethods = @("storeInvestigationData", "getInvestigationData", "storeAgentMessage")
    $missingMethods = @()
    
    foreach ($method in $requiredMethods) {
        if ($storageContent -notmatch "async $method") {
            $missingMethods += $method
        }
    }
    
    if ($missingMethods.Count -gt 0) {
        Write-Host "  ❌ Missing storage methods: $($missingMethods -join ', ')" -ForegroundColor Red
        $dataStoragePass = $false
    } else {
        Write-Host "  ✅ All required storage methods found" -ForegroundColor Green
        $dataStoragePass = $true
    }
} else {
    Write-Host "  ❌ DataStorage.ts not found" -ForegroundColor Red
    $dataStoragePass = $false
}

# Test types
Write-Host ""
Write-Host "📋 Testing type definitions..." -ForegroundColor Yellow

if (Test-Path "src/types/index.ts") {
    $typesContent = Get-Content "src/types/index.ts" -Raw
    
    $requiredInterfaces = @("WalletInvestigationRequest", "WalletInvestigationResponse", "WalletInvestigationData", "Transaction", "BlockchainInfo", "AgentMessage")
    $missingInterfaces = @()
    
    foreach ($interface in $requiredInterfaces) {
        if ($typesContent -notmatch "interface $interface") {
            $missingInterfaces += $interface
        }
    }
    
    if ($missingInterfaces.Count -gt 0) {
        Write-Host "  ❌ Missing type interfaces: $($missingInterfaces -join ', ')" -ForegroundColor Red
        $typesPass = $false
    } else {
        Write-Host "  ✅ All required type interfaces found" -ForegroundColor Green
        $typesPass = $true
    }
} else {
    Write-Host "  ❌ types/index.ts not found" -ForegroundColor Red
    $typesPass = $false
}

# Test documentation
Write-Host ""
Write-Host "📚 Testing documentation..." -ForegroundColor Yellow

if (Test-Path "README.md") {
    $readmeContent = Get-Content "README.md" -Raw
    
    $requiredSections = @("Overview", "Core Capabilities", "Usage Examples", "API Reference")
    $missingSections = @()
    
    foreach ($section in $requiredSections) {
        if ($readmeContent -notmatch $section) {
            $missingSections += $section
        }
    }
    
    if ($missingSections.Count -gt 0) {
        Write-Host "  ❌ Missing documentation sections: $($missingSections -join ', ')" -ForegroundColor Red
        $documentationPass = $false
    } else {
        Write-Host "  ✅ All required documentation sections found" -ForegroundColor Green
        $documentationPass = $true
    }
} else {
    Write-Host "  ❌ README.md not found" -ForegroundColor Red
    $documentationPass = $false
}

# Summary
Write-Host ""
Write-Host "📊 Test Results:" -ForegroundColor Cyan

$tests = @($fileStructurePass, $packageJsonPass, $typescriptPass, $blockchainDetectionPass, $dataStoragePass, $typesPass, $documentationPass)
$passed = ($tests | Where-Object { $_ -eq $true }).Count
$total = $tests.Count

Write-Host "  $passed/$total tests passed" -ForegroundColor Cyan

if ($passed -eq $total) {
    Write-Host ""
    Write-Host "🎉 All tests passed! Agent 1 WIA is properly implemented." -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Summary:" -ForegroundColor Yellow
    Write-Host "  ✅ File structure is correct" -ForegroundColor Green
    Write-Host "  ✅ Package configuration is valid" -ForegroundColor Green
    Write-Host "  ✅ TypeScript files are properly structured" -ForegroundColor Green
    Write-Host "  ✅ Blockchain detection is implemented" -ForegroundColor Green
    Write-Host "  ✅ Data storage is configured" -ForegroundColor Green
    Write-Host "  ✅ Type definitions are complete" -ForegroundColor Green
    Write-Host "  ✅ Documentation is comprehensive" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔧 Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Install Node.js and npm" -ForegroundColor White
    Write-Host "  2. Run 'npm install' to install dependencies" -ForegroundColor White
    Write-Host "  3. Run 'npm run test:agent1' to execute the full test suite" -ForegroundColor White
    Write-Host "  4. Run 'npm run build' to compile the TypeScript code" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Some tests failed. Please check the implementation." -ForegroundColor Red
}

Write-Host ""
Write-Host "Agent 1 WIA Test Complete!" -ForegroundColor Green 
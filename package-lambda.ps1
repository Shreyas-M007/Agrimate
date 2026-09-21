$stagingDir = "$PSScriptRoot/dist-server"
$zipPath = "$PSScriptRoot/server-update.zip"

Write-Host "Packaging MandiMate AWS Lambda Serverless bundle (excluding node_modules)..."

if (Test-Path $stagingDir) { Remove-Item -Recurse -Force $stagingDir }
New-Item -ItemType Directory -Path $stagingDir | Out-Null
New-Item -ItemType Directory -Path "$stagingDir/data" | Out-Null
New-Item -ItemType Directory -Path "$stagingDir/database" | Out-Null
New-Item -ItemType Directory -Path "$stagingDir/handlers" | Out-Null
New-Item -ItemType Directory -Path "$stagingDir/routes" | Out-Null
New-Item -ItemType Directory -Path "$stagingDir/services" | Out-Null

# Copy specific server modules
Copy-Item -Recurse -Force "$PSScriptRoot/server/services/*" "$stagingDir/services"
Copy-Item -Force "$PSScriptRoot/server/routes/api.js" "$stagingDir/routes/api.js"
Copy-Item -Force "$PSScriptRoot/server/data/verified_markets.json" "$stagingDir/data/verified_markets.json"
Copy-Item -Force "$PSScriptRoot/server/database/db.js" "$stagingDir/database/db.js"
Copy-Item -Force "$PSScriptRoot/server/database/mandimate.db" "$stagingDir/database/mandimate.db"
Copy-Item -Force "$PSScriptRoot/server/handlers/pipelineLambda.js" "$stagingDir/handlers/pipelineLambda.js"
Copy-Item -Force "$PSScriptRoot/server/lambda.js" "$stagingDir/lambda.js"
Copy-Item -Force "$PSScriptRoot/server/server.js" "$stagingDir/server.js"
Copy-Item -Force "$PSScriptRoot/package.json" "$stagingDir/package.json"

if (Test-Path $zipPath) { Remove-Item -Force $zipPath }

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($stagingDir, $zipPath)

Remove-Item -Recurse -Force $stagingDir

$fileSize = (Get-Item $zipPath).Length / 1MB
Write-Host "server-update.zip created successfully ($([math]::Round($fileSize, 2)) MB)"

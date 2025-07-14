# Verifica privilegi di amministratore
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "Esegui lo script come amministratore!" -ForegroundColor Red
    exit
}

# Funzione per verificare se un comando esiste
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# 1. Configurazione IIS Application Pool
Write-Host "`n=== Configurazione IIS Application Pool ===" -ForegroundColor Green
Import-Module WebAdministration

$appPoolName = "SponsorBenefitsFE"
if (!(Test-Path "IIS:\AppPools\$appPoolName")) {
    New-WebAppPool -Name $appPoolName
    Write-Host "Application Pool $appPoolName creato" -ForegroundColor Green
}

Set-ItemProperty IIS:\AppPools\$appPoolName -name "managedRuntimeVersion" -value ""
Set-ItemProperty IIS:\AppPools\$appPoolName -name "startMode" -value "AlwaysRunning"
Set-ItemProperty IIS:\AppPools\$appPoolName -name "processModel.identityType" -value "ApplicationPoolIdentity"

# 2. Installazione moduli npm globali
Write-Host "`n=== Installazione moduli npm globali ===" -ForegroundColor Green

# Verifica se Node.js è installato
if (-not (Test-Command node)) {
    Write-Host "Node.js non trovato! Installalo manualmente dalla versione v20.18.1" -ForegroundColor Red
    exit
}

# Installa pnpm versione specifica
Write-Host "Installazione pnpm 9.15.4..." -ForegroundColor Yellow
npm install -g pnpm@9.15.4

# Array dei pacchetti npm da installare globalmente
<# $packages = @(
    "@cyclonedx/cyclonedx-npm@2.0.0",
    "tt-archive-builds@1.0.1",
    "tt-archive-last-build-nextjs@1.0.0",
    "tt-generate-buildno@1.1.3",
    "tt-sync-production-nextjs@1.0.0",
    "tt-update-package-version-nextjs@1.0.0"
) #>
$packages = @("corepack@0.30.0")

# Installa ogni pacchetto
foreach ($package in $packages) {
    Write-Host "Installazione $package..." -ForegroundColor Yellow
    npm install -g $package
}

# 3. Verifica installazione moduli IIS
Write-Host "`n=== Verifica moduli IIS ===" -ForegroundColor Green

# Verifica IISNode
if (Test-Path "C:\Program Files\iisnode\iisnode.dll") {
    $iisNodeVersion = (Get-Item "C:\Program Files\iisnode\iisnode.dll").VersionInfo.FileVersion
    Write-Host "IISNode trovato (versione: $iisNodeVersion)" -ForegroundColor Green
} else {
    Write-Host "IISNode non trovato! Installalo manualmente versione 0.2.26" -ForegroundColor Red
}

# Verifica URL Rewrite
if (Test-Path "C:\Windows\System32\inetsrv\rewrite.dll") {
    $rewriteVersion = (Get-Item "C:\Windows\System32\inetsrv\rewrite.dll").VersionInfo.FileVersion
    Write-Host "URL Rewrite Module trovato (versione: $rewriteVersion)" -ForegroundColor Green
} else {
    Write-Host "URL Rewrite Module non trovato! Installalo manualmente versione 7.1.1993.2351" -ForegroundColor Red
}

# 4. Riepilogo finale
Write-Host "`n=== Riepilogo Installazione ===" -ForegroundColor Green
Write-Host "Node.js Version: $(node -v)"
Write-Host "pnpm Version: $(pnpm -v)"
Write-Host "Application Pool $appPoolName configurato"
Write-Host "`nPacchetti npm globali installati:"
npm list -g --depth=0

Write-Host "`nVerifica che le versioni dei moduli IIS corrispondano a:"
Write-Host "- IISNode: 0.2.26"
Write-Host "- URL Rewrite: 7.1.1993.2351" 
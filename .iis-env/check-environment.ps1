# Verifica se PowerShell è in esecuzione come amministratore
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "Lo script deve essere eseguito come amministratore!" -ForegroundColor Red
    Write-Host "Per favore, riavvia PowerShell come amministratore." -ForegroundColor Red
    exit
}

# Crea un file di output con la data e ora corrente nel nome
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$outputFile = "env_config_$timestamp.txt"

# Reindirizza tutto l'output al file
Start-Transcript -Path $outputFile

# Funzione per creare una linea separatrice
function Write-Separator {
    Write-Host "`n" + "="*50 + "`n" -ForegroundColor Cyan
}

# Funzione per scrivere un'intestazione di sezione
function Write-SectionHeader {
    param($title)
    Write-Separator
    Write-Host $title -ForegroundColor Green
    Write-Host
}

Write-SectionHeader "Node.js Info"
$nodeVersion = node -v
$nodePath = where.exe node
Write-Host "Version: $nodeVersion"
Write-Host "Path: $nodePath"

Write-SectionHeader "Global NPM Packages"
npm list -g --depth=0 | ForEach-Object {
    Write-Host $_
}

Write-SectionHeader "IIS Info"
Write-Host "IIS Version:" -ForegroundColor Yellow
Get-ItemProperty HKLM:\SOFTWARE\Microsoft\InetStp\ | 
    Select-Object -ExpandProperty versionString

Write-Host "`nIIS Modules:" -ForegroundColor Yellow
Get-WebManagedModule | 
    Format-Table Name, GlobalVersion -AutoSize | 
    Out-String -Width 120

Write-Host "Application Pools:" -ForegroundColor Yellow
Get-IISAppPool | 
    Format-Table Name, State, ManagedRuntimeVersion -AutoSize | 
    Out-String -Width 120

Write-SectionHeader "IISNode Info"
if (Test-Path "C:\Program Files\iisnode\iisnode.dll") {
    Write-Host "Status: IISNode è installato" -ForegroundColor Green
    $iisNodeVersion = (Get-Item "C:\Program Files\iisnode\iisnode.dll").VersionInfo.FileVersion
    Write-Host "Versione: $iisNodeVersion"
}
else {
    Write-Host "Status: IISNode non trovato!" -ForegroundColor Red
}

Write-SectionHeader "Environment Variables"
Get-ChildItem Env: | 
    Format-Table Name, Value -AutoSize -Wrap | 
    Out-String -Width 120

Write-SectionHeader "URL Rewrite Module"
if (Test-Path "C:\Windows\System32\inetsrv\rewrite.dll") {
    Write-Host "Status: URL Rewrite Module è installato" -ForegroundColor Green
    $rewriteVersion = (Get-Item "C:\Windows\System32\inetsrv\rewrite.dll").VersionInfo.FileVersion
    Write-Host "Versione: $rewriteVersion"
}
else {
    Write-Host "Status: URL Rewrite Module non trovato!" -ForegroundColor Red
}

# Ferma la registrazione dell'output
Stop-Transcript 
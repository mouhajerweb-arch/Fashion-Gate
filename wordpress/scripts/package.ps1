$ErrorActionPreference = 'Stop'
$fgRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$fgOutput = Join-Path $fgRoot 'dist'
New-Item -ItemType Directory -Force -Path $fgOutput | Out-Null
if (-not (Test-Path (Join-Path $fgRoot 'plugins/fashiongate-elementor-experience/assets/vendor/gsap.min.js'))) { throw 'Run npm run build first.' }
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression
function New-FgArchive([string]$SourceFolder, [string]$ArchiveName) {
    $fgSource = (Resolve-Path -LiteralPath (Join-Path $fgRoot $SourceFolder)).Path
    $fgDestination = [System.IO.Path]::GetFullPath((Join-Path $fgOutput $ArchiveName))
    if (-not $fgDestination.StartsWith($fgOutput + [System.IO.Path]::DirectorySeparatorChar)) { throw 'Archive path is outside dist.' }
    if (Test-Path -LiteralPath $fgDestination) { Remove-Item -LiteralPath $fgDestination }
    $fgArchive = [System.IO.Compression.ZipFile]::Open($fgDestination, [System.IO.Compression.ZipArchiveMode]::Create)
    try {
        foreach ($fgFile in Get-ChildItem -LiteralPath $fgSource -Recurse -File) {
            $fgRelative = $fgFile.FullName.Substring($fgSource.Length + 1).Replace('\', '/')
            $fgEntryName = [System.IO.Path]::GetFileName($fgSource) + '/' + $fgRelative
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($fgArchive, $fgFile.FullName, $fgEntryName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
        }
    } finally { $fgArchive.Dispose() }
}
New-FgArchive 'plugins/fashiongate-elementor-experience' 'fashiongate-elementor-experience.zip'
New-FgArchive 'themes/fashiongate-astra-child' 'fashiongate-astra-child.zip'
$fgHashes = Get-ChildItem -LiteralPath $fgOutput -Filter '*.zip' | Get-FileHash -Algorithm SHA256
$fgHashes | ForEach-Object { $_.Hash + '  ' + [System.IO.Path]::GetFileName($_.Path) } | Set-Content -LiteralPath (Join-Path $fgOutput 'SHA256SUMS.txt') -Encoding ASCII
$fgHashes | Select-Object Hash,@{Name='File';Expression={[System.IO.Path]::GetFileName($_.Path)}} | Format-Table -AutoSize

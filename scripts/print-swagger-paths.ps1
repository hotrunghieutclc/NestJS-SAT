Param(
    [string]$Url = 'http://localhost:8002/api/v1/docs-json'
)
try {
    $r = Invoke-RestMethod -Uri $Url -TimeoutSec 10 -ErrorAction Stop
} catch {
    Write-Host "Failed to fetch $Url : $($_.Exception.Message)"
    exit 1
}

if ($null -eq $r.paths) { Write-Host 'No paths found in swagger document'; exit 0 }

$keys = $r.paths.Keys
Write-Host "Found paths count: $($keys.Count)"
foreach ($k in $keys) { Write-Host $k }
exit 0

Param(
    [string]$Base = 'http://localhost:8002'
)

$candidates = @("$Base/api/v1/docs/swagger.json", "$Base/api/v1/docs-json", "$Base/swagger-json", "$Base/api-json", "$Base/api/v1/swagger.json")
Write-Host "Checking possible swagger JSON endpoints..."
foreach ($u in $candidates) {
    Write-Host "Trying: $u"
    try {
        $obj = Invoke-RestMethod -Uri $u -TimeoutSec 5 -ErrorAction Stop
        if ($obj -and $obj.paths) {
            Write-Host "Found swagger JSON at: $u"
            Write-Host "Available paths (sample up to 200):"
            $count = 0
            foreach ($p in $obj.paths.Keys) {
                Write-Host "  $p"
                $count++
                if ($count -ge 200) { break }
            }
            exit 0
        }
    } catch {
        Write-Host "  no JSON/failed: $($_.Exception.Message)"
    }
}
Write-Host "No swagger JSON found on attempted endpoints."
exit 1

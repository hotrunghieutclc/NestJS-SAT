param(
    [string]$ServerHost = 'localhost',
    [int]$ServerPort = 8002
)

$base = "http://${ServerHost}:${ServerPort}"
Write-Host "Checking endpoints for $base"
$urls = @($base, "${base}/api/v1", "${base}/api/v1/docs")
foreach ($u in $urls) {
    try {
        $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
        Write-Host "$u -> $($r.StatusCode)"
    } catch {
        Write-Host "$u -> ERROR: $($_.Exception.Message)"
    }
}

Write-Host "`nNetstat entries for port ${ServerPort}:`n"
try { netstat -ano | findstr ":$Port" } catch { Write-Host "netstat not available or error" }

Write-Host "`nNode processes (via WMI/CIM):`n"
try {
    $nodes = Get-CimInstance Win32_Process | Where-Object { $_.Name -ieq 'node.exe' -or $_.Name -ieq 'node' }
    if ($nodes) {
        foreach ($n in $nodes) {
            Write-Host "PID: $($n.ProcessId)"; Write-Host "CommandLine: $($n.CommandLine)"; Write-Host "---"
        }
    } else {
        Write-Host "No node processes found"
    }
} catch {
    Write-Host "Failed to query processes: $($_.Exception.Message)"
}

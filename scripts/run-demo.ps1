Param(
    [string]$ServerUrl = 'http://localhost:3000',
    [int]$WaitSeconds = 60
)

function Wait-ForServer {
    param($Url, $TimeoutSec)
    Write-Host "Waiting for $Url (timeout ${TimeoutSec}s) ..."
    $i = 0
    while ($i -lt $TimeoutSec) {
        try {
            $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
            Write-Host "Server is up"
            return $true
        } catch {
            Start-Sleep -Seconds 1
            $i++
        }
    }
    Write-Error "Timed out waiting for server at $Url"
    return $false
}

if (-not (Wait-ForServer -Url $ServerUrl -TimeoutSec $WaitSeconds)) {
    exit 1
}

try {
    Write-Host "Logging in as demo user..."
    $login = Invoke-RestMethod -Method Post -Uri "$ServerUrl/auth/login" -ContentType 'application/json' -Body (@{ email='user@example.com'; password='secret' } | ConvertTo-Json)
} catch {
    Write-Error "Login failed: $($_.Exception.Message)"; exit 2
}

$token = $login.accessToken
if (-not $token) { Write-Error 'No accessToken returned'; exit 3 }
Write-Host "Got token (length: $($token.Length))"

try {
    Write-Host "Creating TestPaper..."
    $create = Invoke-RestMethod -Method Post -Uri "$ServerUrl/test-papers" -Headers @{ Authorization = "Bearer $token" } -ContentType 'application/json' -Body (@{ title='Demo Paper'; description='Auto-created demo'; quantities=10 } | ConvertTo-Json)
} catch {
    Write-Error "Create TestPaper failed: $($_.Exception.Message)"; exit 4
}

$paperId = $create.id
Write-Host "Created TestPaper id: $paperId"

try {
    Write-Host "Adding items [1,2,3] to paper $paperId..."
    $added = Invoke-RestMethod -Method Post -Uri ("$ServerUrl/test-papers/$paperId/items") -Headers @{ Authorization = "Bearer $token" } -ContentType 'application/json' -Body (@{ itemIds = @(1,2,3) } | ConvertTo-Json)
    Write-Host "Added items count: $($added.Count)"
} catch {
    Write-Error "Add items failed: $($_.Exception.Message)"; exit 5
}

try {
    Write-Host "Fetching paper $paperId..."
    $paper = Invoke-RestMethod -Method Get -Uri ("$ServerUrl/test-papers/$paperId") -Headers @{ Authorization = "Bearer $token" }
    $paper | ConvertTo-Json -Depth 8
} catch {
    Write-Error "Fetch paper failed: $($_.Exception.Message)"; exit 6
}

Write-Host "Demo finished successfully"
exit 0

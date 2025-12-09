Param(
    [string]$ServerBase = 'http://localhost:8002'
)

function Try-Get($path) {
    $url = "$ServerBase$path"
    Write-Host "GET $url"
    try {
        $res = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        Write-Host "  Status: $($res.StatusCode)"
        if ($res.Content) { $c = $res.Content; Write-Host "  Body (truncated):"; Write-Host $c.Substring(0,[Math]::Min($c.Length,400)) }
        return $res
    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)"
        return $null
    }
}

function Try-PostJson($path, $bodyObj) {
    $url = "$ServerBase$path"
    Write-Host "POST $url"
    try {
        $res = Invoke-RestMethod -Method Post -Uri $url -ContentType 'application/json' -Body ($bodyObj | ConvertTo-Json) -ErrorAction Stop
        Write-Host "  OK - response:"; $res | ConvertTo-Json -Depth 6
        return $res
    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            try { $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream()); $txt = $sr.ReadToEnd(); Write-Host '  ResponseBody:'; Write-Host $txt } catch {}
        }
        return $null
    }
}

Write-Host "Probing server base: $ServerBase"
Try-Get '/' | Out-Null
Try-Get '/api/v1' | Out-Null
Try-Get '/api/v1/docs' | Out-Null

Write-Host "Trying auth endpoints (with and without prefix)"
$loginPayload = @{ email = 'user@example.com'; password = 'secret' }
Try-PostJson '/auth/login' $loginPayload | Out-Null
Try-PostJson '/api/v1/auth/login' $loginPayload | Out-Null

Write-Host '`nIf login succeeded above, script will continue to create a TestPaper and add items.'

$loginResp = $null
if ($env:AUTH_TOKEN) { $loginResp = @{ accessToken = $env:AUTH_TOKEN } }

if (-not $loginResp) {
    $loginResp = Try-PostJson '/api/v1/auth/login' $loginPayload
}

if (-not $loginResp) {
    $loginResp = Try-PostJson '/auth/login' $loginPayload
}

if (-not $loginResp -or -not $loginResp.accessToken) {
    Write-Host 'Login failed on both endpoints — aborting further automated steps.'
    exit 1
}

$token = $loginResp.accessToken
Write-Host "Using token length: $($token.Length)"

function Auth-Post($path, $bodyObj) {
    $url = "$ServerBase$path"
    Write-Host "POST $url (auth)"
    try {
        $res = Invoke-RestMethod -Method Post -Uri $url -Headers @{ Authorization = "Bearer $token" } -ContentType 'application/json' -Body ($bodyObj | ConvertTo-Json) -ErrorAction Stop
        Write-Host '  OK - response:'; $res | ConvertTo-Json -Depth 6
        return $res
    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)"
        if ($_.Exception.Response) { try{ $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream()); $txt = $sr.ReadToEnd(); Write-Host '  ResponseBody:'; Write-Host $txt } catch{} }
        return $null
    }
}

Write-Host '`nCreating TestPaper...'
$createResp = Auth-Post '/api/v1/test-papers' @{ title='Demo Paper'; description='Auto demo'; quantities=10 }
if (-not $createResp -or -not $createResp.id) { Write-Host 'Create failed'; exit 2 }
$paperId = $createResp.id
Write-Host "Created paper id: $paperId"

Write-Host 'Adding items [1,2,3] to the paper'
$addResp = Auth-Post "/api/v1/test-papers/$paperId/items" @{ itemIds = @(1,2,3) }
if (-not $addResp) { Write-Host 'Add items failed'; exit 3 }

Write-Host 'Fetching the created paper'
try {
    $paper = Invoke-RestMethod -Method Get -Uri "$ServerBase/api/v1/test-papers/$paperId" -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop
    Write-Host 'Paper:'; $paper | ConvertTo-Json -Depth 8
} catch {
    Write-Host "Fetch failed: $($_.Exception.Message)"; exit 4
}

Write-Host 'Demo finished successfully'
exit 0

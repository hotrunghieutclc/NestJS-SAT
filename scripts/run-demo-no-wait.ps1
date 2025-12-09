Param(
    [string]$ServerUrl = 'http://localhost:8002/api/v1'
)

try {
    Write-Host "Using server: $ServerUrl"
    Write-Host 'Logging in as demo user...'
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
    Write-Host "Added items:"; $added | ConvertTo-Json -Depth 5
} catch {
    Write-Error "Add items failed: $($_.Exception.Message)"; exit 5
}

try {
    Write-Host "Fetching paper $paperId..."
    $paper = Invoke-RestMethod -Method Get -Uri ("$ServerUrl/test-papers/$paperId") -Headers @{ Authorization = "Bearer $token" }
    Write-Host 'Paper result:'; $paper | ConvertTo-Json -Depth 8
} catch {
    Write-Error "Fetch paper failed: $($_.Exception.Message)"; exit 6
}

Write-Host "Demo finished successfully"
exit 0

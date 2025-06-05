$body = @{
    username = "test"
    password = "test"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri http://localhost:8000/api/accounts/login/ `
  -ContentType "application/json" `
  -Body $body

param(
  [Parameter(Mandatory = $true)]
  [string]$BaseUrl
)

Write-Host "Running remote E2E against $BaseUrl" -ForegroundColor Cyan
$env:BASE_URL = $BaseUrl
npm run test:e2e:remote -- tests/working-cart.spec.ts --reporter=line

param(
  [string]$BaseUrl = "http://localhost:8888"
)

function Invoke-Json {
  param(
    [string]$Method,
    [string]$Url,
    $Body = $null
  )
  try {
    if ($Body -ne $null -and -not ($Body -is [string])) { $Body = ($Body | ConvertTo-Json -Depth 6) }
    $resp = Invoke-WebRequest -Method $Method -Uri $Url -Headers @{ 'Accept'='application/json'; 'Content-Type'='application/json' } -Body $Body -TimeoutSec 30 -UseBasicParsing
    return [pscustomobject]@{ StatusCode = $resp.StatusCode; Body = $resp.Content }
  }
  catch {
    $r = $_.Exception.Response
    if ($r) {
      $reader = New-Object System.IO.StreamReader($r.GetResponseStream())
      $content = $reader.ReadToEnd()
      return [pscustomobject]@{ StatusCode = [int]$r.StatusCode; Body = $content }
    }
    return [pscustomobject]@{ StatusCode = -1; Body = $_.Exception.Message }
  }
}

Write-Host "Testing Netlify endpoints at $BaseUrl" -ForegroundColor Cyan

# 1) Newsletter subscribe (function)
$newsletterUrl = "$BaseUrl/.netlify/functions/subscribe"
$nl = Invoke-Json -Method Post -Url $newsletterUrl -Body @{ email = "test+$(Get-Random)@example.com" }
Write-Host "[subscribe] $($nl.StatusCode)" -ForegroundColor Yellow
Write-Output $nl.Body

# 2) Stripe create checkout session (may require valid secrets)
$stripeUrl = "$BaseUrl/.netlify/functions/stripe-create-checkout-session"
$st = Invoke-Json -Method Post -Url $stripeUrl -Body @{ items = @(@{ id = "sku_test"; quantity = 1 }) }
Write-Host "[stripe-create-checkout-session] $($st.StatusCode)" -ForegroundColor Yellow
Write-Output $st.Body

# 3) PayPal create order (sandbox)
$paypalCreateUrl = "$BaseUrl/.netlify/functions/paypal-create-order"
$pp = Invoke-Json -Method Post -Url $paypalCreateUrl -Body @{ amount = 10.0; currency = "USD" }
Write-Host "[paypal-create-order] $($pp.StatusCode)" -ForegroundColor Yellow
Write-Output $pp.Body

# 4) EasyPost rates
$ratesUrl = "$BaseUrl/.netlify/functions/easypost-rates"
$ez = Invoke-Json -Method Post -Url $ratesUrl -Body @{ from = @{ zip = "94105"; country = "US" }; to = @{ zip = "94016"; country = "US" }; parcel = @{ weight = 16 } }
Write-Host "[easypost-rates] $($ez.StatusCode)" -ForegroundColor Yellow
Write-Output $ez.Body

Write-Host "Done." -ForegroundColor Green

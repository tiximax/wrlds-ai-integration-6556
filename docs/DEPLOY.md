# Deploy guide (Vercel / Netlify) and E2E verification

## Vercel
- Endpoint: /api/subscribe (api/subscribe.ts)
- Steps
  1) npm i && npm run build
  2) vercel (hoặc connect repo và deploy tự động)
  3) (Tuỳ chọn) Cấu hình env như SUBSCRIBE_API_KEY

## Netlify
- Functions: netlify/functions/subscribe.ts
- Redirects: netlify.toml đã có "/api/subscribe -> /.netlify/functions/subscribe"
- SPA fallback: "/* -> /index.html" đã bật
- Steps
  1) npm i && npm run build
  2) netlify deploy --build (hoặc connect repo và deploy tự động)

## E2E sau khi đã deploy (remote)
- Thiết lập biến môi trường BASE_URL trỏ tới domain đã deploy
  - Windows PowerShell: `$env:BASE_URL = "https://your-domain"`
- Chạy smoke test remote:
  - `npm run test:e2e:remote -- tests/working-cart.spec.ts --reporter=line`
- Hoặc dùng scripts tiện dụng:
  - PowerShell: `./scripts/e2e-remote.ps1 -BaseUrl https://your-domain`
  - Bash: `bash ./scripts/e2e-remote.sh https://your-domain`

## Checklist verify sau deploy
- Mở trang chủ và /products, /category/<slug>
- Nút giỏ hàng mở/đóng bình thường, trạng thái giỏ hàng trống hiển thị đúng
- i18n: chuyển ngôn ngữ VN/EN (nếu UI có LanguageSwitcher)
- Subscribe API: POST /api/subscribe với email hợp lệ trả 200 { ok: true }
- Không có 404 client-side khi refresh ở route con (đã có SPA fallback Netlify)


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

## Webhook setup (optional)

Bạn có thể chuyển tiếp email đăng ký newsletter tới dịch vụ bên ngoài (Zapier/Make/Server riêng…) qua webhook, không cần thêm SDK provider.

- Biến môi trường cần thiết (thiết lập ở môi trường server, KHÔNG phơi bày trên client):
  - SUBSCRIBE_WEBHOOK_URL: URL webhook nhận POST
  - SUBSCRIBE_API_KEY: Bearer token tuỳ chọn, sẽ được gửi ở header Authorization: Bearer <token>
- Endpoint serverless đã hỗ trợ sẵn:
  - Vercel: /api/subscribe
  - Netlify: /api/subscribe (redirect tới /.netlify/functions/subscribe)
- Payload gửi tới webhook:
  - { email, source, userAgent, ip, timestamp }

Thiết lập nhanh
- Vercel: Project Settings > Environment Variables
  - Thêm SUBSCRIBE_WEBHOOK_URL và (tuỳ chọn) SUBSCRIBE_API_KEY
  - Redeploy hoặc re-run build
- Netlify: Site settings > Environment variables
  - Thêm SUBSCRIBE_WEBHOOK_URL và (tuỳ chọn) SUBSCRIBE_API_KEY
  - Deploy lại site

Kiểm thử an toàn
- Local (dev/preview) hoặc môi trường đã deploy, dùng POST tới /api/subscribe:
  - Windows PowerShell:
    - Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/subscribe" -ContentType "application/json" -Body '{"email":"user@example.com"}'
  - cURL (Linux/macOS/Git Bash):
    - curl -s -X POST "$BASE_URL/api/subscribe" -H "Content-Type: application/json" -d '{"email":"user@example.com"}'
- Lưu ý bảo mật:
  - Không in ra hoặc commit giá trị token. Thiết lập token trực tiếp trên nền tảng (Vercel/Netlify).
  - Không echo secret trong console/script. Nếu cần, đọc vào biến môi trường và chỉ truyền biến.

## Checklist verify sau deploy
- Mở trang chủ và /products, /category/<slug>
- Nút giỏ hàng mở/đóng bình thường, trạng thái giỏ hàng trống hiển thị đúng
- i18n: chuyển ngôn ngữ VN/EN (nếu UI có LanguageSwitcher)
- Subscribe API: POST /api/subscribe với email hợp lệ trả 200 { ok: true }
- Không có 404 client-side khi refresh ở route con (đã có SPA fallback Netlify)


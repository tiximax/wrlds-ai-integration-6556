# Changelog

## v1.0.0 (2025-09-18)

Highlights
- i18n chuẩn hoá với react-i18next, loại bỏ LanguageContext cũ; cập nhật LanguageSwitcher.
- SimpleCart trở thành giỏ hàng mặc định; dọn mã advanced cart (LEGACY) vào thư mục riêng.
- Nâng cấp EnhancedSearch: suggestions từ dữ liệu thật, lịch sử tìm kiếm (localStorage), tính số kết quả khi submit.
- Bảo mật subscribe: thay EmailJS frontend bằng service subscribeEmail với serverless endpoint (Vercel/Netlify); fallback an toàn khi chưa cấu hình.
- Tối ưu SEO/branding và hiệu năng (prefetch, preload, lazy routes, SEO metadata).

Testing
- Unit tests: 69/69 PASS (Vitest) — thêm test generateSearchSuggestions, subscribe service fallback.
- E2E (dev server): 15/15 PASS (Playwright) — smoke giỏ hàng, accessibility, UI elements.
- E2E (preview build): 15/15 PASS (Playwright).

CI/DevEx
- Thêm workflows: CI (Vitest + Playwright dev), E2E preview, E2E remote, Deploy Vercel + E2E.
- Sử dụng npx playwright install (hoặc container Playwright) thay action deprecated.
- Thêm scripts e2e-remote (ps1/sh), docs/DEPLOY.md, Netlify SPA fallback.

Notes
- Các phần nâng cao của giỏ hàng được gắn nhãn LEGACY và di chuyển vào src/components/legacy/ để tránh nhiễu.
- Có thể triển khai thật Subscribe backend (DB + email provider) trong phiên bản kế tiếp.


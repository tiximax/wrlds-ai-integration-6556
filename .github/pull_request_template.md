## Pull Request Title

Short description

## Summary
- What problem does this PR solve?
- Context and links (issue/plan/agent.md section)

## Changes
- [ ] Code changes
- [ ] Tests
- [ ] Docs (README/agent.md)

## Screenshots / Videos (optional)

## Checklist
- [ ] Unit tests pass locally: `npm test`
- [ ] E2E smoke (dev) passes: `npm run test:e2e -- tests/working-cart.spec.ts --reporter=line`
- [ ] If needed, E2E preview passes: `npm run test:e2e:preview -- tests/working-cart.spec.ts --reporter=line`
- [ ] i18n: only `react-i18next` (`useTranslation`); không dùng `LanguageContext`
- [ ] Cart: UI đang dùng `SimpleCartSidebar`; không reintroduce legacy enhanced cart
- [ ] Không thêm secrets vào code. Secrets (nếu có) phải dùng env trên platform
- [ ] Cập nhật `agent.md` (specify/plan/tasks/tiến trình)
- [ ] Đánh giá thay đổi lớn (nếu có) và đã xin ý kiến trước khi merge
- [ ] (PR only) Muốn chạy E2E preview trên CI? Thêm nhãn `run-e2e-preview`

## Notes
- Sau khi merge vào main, CI sẽ chạy Vitest + Playwright (dev).

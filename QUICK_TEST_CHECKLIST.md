# ⚡ QUICK TEST CHECKLIST - P0.7 Color Contrast

## 🚀 READY TO TEST!

**Server URL:** http://localhost:8080/  
**Time Required:** 2-5 minutes  
**Status:** ✅ Dev server RUNNING

---

## ✅ QUICK VISUAL TEST (2 min)

### Step 1: Homepage
- [ ] Open http://localhost:8080/
- [ ] Scroll to "Sản phẩm nổi bật"
- [ ] Check product cards:
  - [ ] Brand names are darker (below image)
  - [ ] Ratings text is readable
  - [ ] Descriptions are clear
  - [ ] Old prices visible but subtle

### Step 2: Cart Sidebar  
- [ ] Click cart icon (top right)
- [ ] Check empty state:
  - [ ] Notice banner readable
  - [ ] "Thêm sản phẩm..." text clear
  
### Step 3: Quick Verdict
- [ ] **Text looks darker overall?** ✅ = PASS

---

## 🔬 LIGHTHOUSE AUDIT (5 min)

### Setup
1. Open http://localhost:8080/
2. Press **F12** (DevTools)
3. Click **Lighthouse** tab

### Configure
- Mode: **Navigation**
- Device: **Mobile**
- Categories: **All** ✅

### Run
1. Click **"Analyze page load"**
2. Wait ~30-60 seconds
3. Review scores

### Expected Results
| Metric | Target | Status |
|--------|--------|--------|
| Accessibility | 80+ | ✅ |
| Performance | 70+ | ✅ |
| Best Practices | 90+ | ✅ |
| SEO | 95+ | ✅ |

### Key Checks
- [ ] **Accessibility** score ≥ 80
- [ ] **Color contrast** section = PASSED
- [ ] No console errors

---

## 📊 REPORT FORMAT

Copy this template after testing:

```
✅ Testing Complete - [DATE]

Visual Test:
- Product cards: [PASS/FAIL]
- Cart sidebar: [PASS/FAIL]
- Overall readability: [IMPROVED/SAME]

Lighthouse Results:
- Accessibility: [SCORE]/100
- Performance: [SCORE]/100
- Color Contrast Issues: [0 or list]

Verdict: [READY FOR PROD / NEEDS FIXES]
```

---

## 🎯 SUCCESS CRITERIA

**MUST HAVE:**
- ✅ Accessibility ≥ 80
- ✅ No color contrast errors
- ✅ Text visibly darker than before

**DEPLOYMENT READY IF:**
All criteria above met ✅

---

## 💡 TROUBLESHOOTING

**Text still light?**  
→ Hard refresh: `Ctrl + Shift + R`

**Score low?**  
→ Wait 5s after page load, run audit again

**Server not responding?**  
→ Check http://localhost:8080/ opens

---

## 📚 DETAILED DOCS

- **Full Guide:** TESTING_GUIDE.md (285 lines)
- **Technical:** UX_AUDIT_IMPLEMENTATION.md
- **Git Log:** `git log --oneline -1`

---

**Ready to test! 🚀 Report results when done!**

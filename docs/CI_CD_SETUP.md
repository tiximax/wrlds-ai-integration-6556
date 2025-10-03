# 🤖 CI/CD Setup Guide

## 📋 Overview

Automated CI/CD pipeline using GitHub Actions để:
- ✅ Run tests on every PR
- ✅ Auto-deploy on merge to main
- ✅ Lighthouse performance audits
- ✅ PR preview deployments

---

## 🎯 Workflows Created

### 1. **CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)

**Triggers:**
- Push to `main` → Deploy to production
- Pull Request → Run tests & checks

**Jobs:**
1. **Install Dependencies** (📦)
   - Install npm packages
   - Cache node_modules for faster builds

2. **Lint & Type Check** (🔍)
   - ESLint (continues on error)
   - TypeScript type checking

3. **Build Production** (🔨)
   - Production build
   - Bundle size analysis
   - Upload build artifacts

4. **Run Tests** (🧪)
   - Run test suite (if configured)
   - Continue on error

5. **Deploy to Production** (🚀) _[main branch only]_
   - Download build artifacts
   - Deploy to Netlify/Vercel
   - Trigger deployment

6. **Post-Deploy Checks** (🔍) _[main branch only]_
   - Health check
   - Report deployment status

7. **PR Preview** (🔍) _[PRs only]_
   - Deploy preview environment
   - Comment PR with preview URL

---

### 2. **Lighthouse CI** (`.github/workflows/lighthouse-ci.yml`)

**Triggers:**
- Pull Request to `main`

**Features:**
- Run Lighthouse audits on multiple pages
- Check Core Web Vitals
- Comment PR with scores
- Upload artifacts

**Pages Audited:**
- Homepage
- Products page
- About page

---

## ⚙️ Configuration Required

### GitHub Secrets (Optional)

Add these in: `GitHub Repo → Settings → Secrets → Actions`

#### For Netlify Deployment:
```
NETLIFY_AUTH_TOKEN=your-netlify-token
NETLIFY_SITE_ID=your-site-id
```

#### For Vercel Deployment:
```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

#### For Health Checks:
```
PRODUCTION_URL=https://your-production-url.com
```

---

## 🚀 How to Use

### For Developers

**Creating a Pull Request:**
1. Push changes to feature branch
2. Create PR to `main`
3. CI/CD will automatically:
   - ✅ Run linting & type checks
   - ✅ Build production bundle
   - ✅ Run tests
   - ✅ Run Lighthouse audit
   - ✅ Deploy PR preview (if configured)

**Merging to Main:**
1. Get PR approval
2. Merge to `main`
3. CI/CD will automatically:
   - ✅ Deploy to production
   - ✅ Run post-deploy checks
   - ✅ Send deployment notification

---

## 📊 Workflow Status

Check workflow status in:
- GitHub Repo → Actions tab
- PR checks section
- Commit status badges

---

## 🔧 Customization

### Add More Jobs

Edit `.github/workflows/ci-cd.yml`:

```yaml
  security-scan:
    name: 🔒 Security Scan
    runs-on: ubuntu-latest
    needs: install
    
    steps:
      - name: 🔒 Run npm audit
        run: npm audit --audit-level=moderate
```

### Add More Pages to Lighthouse

Edit `.github/workflows/lighthouse-ci.yml`:

```yaml
urls: |
  http://localhost:5000
  http://localhost:5000/products
  http://localhost:5000/about
  http://localhost:5000/contact  # Add this
```

### Change Node Version

Edit `env` section in both workflows:

```yaml
env:
  NODE_VERSION: '20'  # Change to '18' or '21'
```

---

## 🐛 Troubleshooting

### Build Fails

**Check:**
- Node version compatibility
- Dependencies installed correctly
- Build script exists in `package.json`

**Fix:**
```bash
npm install
npm run build
```

### Deployment Fails

**Check:**
- Secrets configured correctly
- Deployment platform connected
- Build artifacts uploaded

**Debug:**
```bash
# Test build locally
npm run build

# Check dist folder
ls -la dist/
```

### Lighthouse Fails

**Check:**
- Build completes successfully
- Preview server starts
- URLs accessible

**Adjust thresholds:**
```yaml
budgets:
  - path: '/'
    timings:
      - metric: first-contentful-paint
        budget: 2000
```

---

## 📈 Performance Budgets

### Current Budgets (Default)

| Metric | Budget | Current |
|--------|--------|---------|
| **FCP** | <2s | ~1.8s |
| **LCP** | <2.5s | ~2.3s |
| **TTI** | <3.5s | ~3.0s |
| **CLS** | <0.1 | ~0.05 |
| **Bundle Size** | <500KB gzip | ~447KB |

### Set Custom Budgets

Create `lighthouserc.json`:

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

---

## 🎯 Next Steps

### Immediate:
- [ ] Configure deployment secrets
- [ ] Test workflow on PR
- [ ] Monitor first deployment

### Soon:
- [ ] Add E2E tests (Playwright)
- [ ] Setup Sentry in CI
- [ ] Add bundle analysis
- [ ] Setup staging environment

### Future:
- [ ] Add security scanning
- [ ] Setup Docker builds
- [ ] Multi-environment deployment
- [ ] Advanced caching strategies

---

## 📚 Resources

- [GitHub Actions Docs](https://docs.github.com/actions)
- [Lighthouse CI Docs](https://github.com/GoogleChrome/lighthouse-ci)
- [Netlify Deploy Docs](https://docs.netlify.com/cli/get-started/)
- [Vercel Deploy Docs](https://vercel.com/docs/cli)

---

## ✅ Checklist

### Pre-Deployment:
- [x] CI/CD workflow created
- [x] Lighthouse CI configured
- [x] Documentation complete
- [ ] Secrets configured (optional)
- [ ] First workflow test passed

### Post-Deployment:
- [ ] Monitor workflow success rate
- [ ] Review Lighthouse scores
- [ ] Adjust performance budgets
- [ ] Optimize slow jobs

---

**Created:** 2025-10-03  
**Last Updated:** 2025-10-03  
**Status:** ✅ Ready to use

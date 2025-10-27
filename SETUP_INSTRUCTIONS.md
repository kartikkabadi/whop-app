# Setup Instructions for Whop App

## URGENT: Recreate pnpm-lock.yaml

The pnpm-lock.yaml file was deleted and needs to be recreated. Follow these steps:

### Prerequisites
- Ensure you have Node.js installed (v20 or higher recommended)
- Install pnpm if not already installed: `npm install -g pnpm@9.15.9`

### Steps to Recreate pnpm-lock.yaml

1. **Clone or pull the latest repository**
   ```bash
   git pull origin main
   ```

2. **Install dependencies with pnpm**
   ```bash
   pnpm install
   ```
   This will automatically generate a new `pnpm-lock.yaml` file based on the `package.json` dependencies.

3. **Verify the lockfile was created**
   ```bash
   ls -la | grep pnpm-lock.yaml
   ```

4. **Commit the new lockfile**
   ```bash
   git add pnpm-lock.yaml
   git commit -m "Re-generate pnpm-lock.yaml"
   git push origin main
   ```

### Current Dependencies (from package.json)

**Dependencies:**
- @vercel/functions: ^3.1.4
- @whop/react: 0.3.0
- @whop/sdk: 0.0.2
- next: 16.0.0
- react: 19.2.0
- react-dom: 19.2.0

**Dev Dependencies:**
- @biomejs/biome: 2.2.6
- @types/node: ^20.19.21
- @types/react: 19.2.2
- @types/react-dom: 19.2.2
- @whop-apps/dev-proxy: 0.0.1-canary.117
- typescript: ^5.9.3

### Next Steps After Lockfile is Created

1. **Test local development**
   ```bash
   pnpm dev
   ```

2. **Verify Vercel deployment**
   - Push the changes to trigger a new deployment
   - Check Vercel dashboard for build status

3. **Verify Whop integration**
   - Test authentication flows
   - Verify SDK initialization
   - Check company access permissions

## Dashboard Rebuild Plan

After the lockfile is recreated and the project builds successfully, we will:

1. **Start with clean template** - Ensure base Next.js app works
2. **Add authentication** - Implement Whop auth step-by-step
3. **Add Whop SDK** - Initialize and test SDK connections
4. **Add company access** - Implement company data fetching
5. **Add analytics placeholders** - Create simple analytics UI components
6. **Test incrementally** - Deploy and verify after each change

## Important Notes

- The package manager is locked to `pnpm@9.15.9+sha512...` (see packageManager field in package.json)
- React and React-DOM are using version 19.2.0 (latest)
- Next.js is on version 16.0.0
- Type overrides are configured in pnpm.overrides section

## Troubleshooting

If `pnpm install` fails:
1. Clear pnpm cache: `pnpm store prune`
2. Delete node_modules: `rm -rf node_modules`
3. Try install again: `pnpm install`
4. If still failing, check for conflicts in peer dependencies

## Contact

If you encounter issues, please:
1. Check the GitHub Actions logs for build errors
2. Review Vercel deployment logs
3. Ensure all environment variables are properly set in `.env.development`

# Testing the SDS CLI Locally

You don't need to publish to NPM to test the CLI! Here are several methods:

## Method 1: Global Link (Easiest)

This makes the `sds` command available globally on your machine.

```bash
# From the sds-cli directory
cd packages/sds-cli

# Build the CLI
pnpm build

# Link it globally
pnpm link --global

# Now test it anywhere on your system
cd ~/Desktop
sds create test-app

# When done testing, unlink
pnpm unlink --global
```

## Method 2: Direct Node Execution

Run the CLI directly without installing:

```bash
# From the sds-cli directory
cd packages/sds-cli

# Build first
pnpm build

# Run directly
node bin/index.js create test-app

# Or use from the monorepo root
cd ../..
node packages/sds-cli/bin/index.js create test-app
```

## Method 3: NPX with Local Path

Use npx to run the local package:

```bash
# From any directory
npx /Users/nicholasj.pino/Desktop/super-design-system/packages/sds-cli create test-app
```

## Method 4: Install as Local Dependency

Add it to a test project's package.json:

```json
{
  "devDependencies": {
    "@pinonoir/sds-cli": "file:../super-design-system/packages/sds-cli"
  }
}
```

Then run:
```bash
pnpm install
pnpm sds create my-app
```

## Recommended Testing Workflow

1. **Make changes** to the CLI source files
2. **Rebuild**: `pnpm build` (or use `pnpm dev` for watch mode)
3. **Test**: Run the CLI command
4. **Iterate**: Repeat steps 1-3

### Watch Mode for Development

For active development, use watch mode:

```bash
# Terminal 1 - Watch and rebuild on changes
cd packages/sds-cli
pnpm dev

# Terminal 2 - Test the CLI
cd ~/Desktop
sds create test-app
```

## Testing Interactive Prompts

To test the interactive mode:

```bash
# Just run create without a project name
sds create

# This will trigger all the interactive prompts:
# - Project name
# - Framework selection
# - Installation type
# - Product type (BCC, TSC, CORE, or Custom)
# - Theme variant (Light or Dark)
# - Package manager
# - TypeScript preference
# - Git initialization
```

## Testing Specific Scenarios

### Test BCC with Dark Theme
```bash
sds create bcc-test-app
# Select: React + Vite → Full → BCC → Dark → pnpm → Yes → Yes
```

### Test TSC with Light Theme
```bash
sds create tsc-test-app
# Select: Next.js → Full → TSC → Light → pnpm → Yes → Yes
```

### Test CORE with Custom Theme
```bash
sds create core-test-app
# Select: React + Vite → Full → CORE → Light → pnpm → Yes → Yes
```

### Test Custom Theme
```bash
sds create custom-test-app
# Select: React + Vite → Full → Custom → Enter "my-custom-theme" → pnpm → Yes → Yes
```

### Test Minimal Installation
```bash
sds create minimal-test-app
# Select: React + Vite → Minimal → pnpm → Yes → Yes
# Note: Product type won't be asked for minimal installation
```

## Verifying the Generated Project

After creating a test project, verify:

1. **Theme is correctly set** in `src/Providers.tsx`:
   ```tsx
   <ThemeProvider defaultTheme="tsc-light">
   ```

2. **Correct packages installed** in `package.json`:
   ```json
   "dependencies": {
     "@pinonoir/sds-ui": "^2.0.0",
     "@pinonoir/sds-styles": "^2.0.0",
     "@pinonoir/sds-tokens": "^2.0.0",
     "@pinonoir/mui-themes": "^2.0.0"
   }
   ```

3. **Version detection worked** - Check that versions match your local packages

4. **Project runs**:
   ```bash
   cd test-app
   pnpm dev
   ```

## Cleanup After Testing

Remove test projects:
```bash
rm -rf test-app bcc-test-app tsc-test-app core-test-app custom-test-app minimal-test-app
```

Unlink the CLI:
```bash
pnpm unlink --global @pinonoir/sds-cli
```

## Common Issues

### Issue: "Unsupported URL Type 'workspace:'" error with npm ⚠️

**Problem**: When testing locally with npm as the package manager, you'll get this error because the SDS packages haven't been published yet and contain `workspace:` protocol dependencies.

**Solution** (choose one):
1. **Use pnpm** instead of npm (pnpm understands workspace: protocol):
   ```bash
   pnpm test-create my-app
   # Select pnpm as package manager
   ```

2. **Use --skip-install** flag and install manually with pnpm:
   ```bash
   pnpm test-create my-app -- --skip-install
   cd my-app
   pnpm install
   ```

3. **Wait until packages are published to npm** - This error won't occur with published packages

**Why this happens**: The `sds-styles` package depends on `sds-tokens` using `workspace:^` protocol, which is a pnpm feature for monorepos. npm doesn't understand this until packages are published.

### Issue: Command not found after linking
**Solution**: Make sure you built the CLI first with `pnpm build`

### Issue: Old version of CLI is running
**Solution**:
```bash
pnpm unlink --global
pnpm build
pnpm link --global
```

### Issue: Changes not reflected
**Solution**: Always rebuild after making changes, or use watch mode (`pnpm dev`)

### Issue: Version detection not working
**Solution**: Make sure you're running from the monorepo and all packages have valid package.json files

## Publishing to NPM (When Ready)

Once you've tested thoroughly:

1. **Create a changeset**:
   ```bash
   pnpm changeset
   ```

2. **Version the packages**:
   ```bash
   pnpm version-packages
   ```

3. **Build all packages**:
   ```bash
   pnpm build
   ```

4. **Publish**:
   ```bash
   pnpm release
   ```

After publishing, users can run:
```bash
npx @pinonoir/sds-cli create my-app
# or
pnpm dlx @pinonoir/sds-cli create my-app
```

# @pinonoir/sds-cli

CLI tool for scaffolding Super Design System projects with ease.

## Usage

```bash
# npm
npx @pinonoir/sds-cli create my-app

# pnpm
pnpm dlx @pinonoir/sds-cli create my-app

# yarn
yarn dlx @pinonoir/sds-cli create my-app

# Or install globally
npm install -g @pinonoir/sds-cli
sds create my-app
```

## Options

```bash
# Interactive mode
sds create

# Specify project name
sds create my-app

# Use template
sds create my-app --template react-vite

# Full installation with all packages
sds create my-app --full

# Minimal installation (tokens & styles only)
sds create my-app --minimal

# Skip dependency installation
sds create my-app --skip-install

# Skip git initialization
sds create my-app --skip-git
```

## Available Templates

- `react-vite` - React with Vite (default)
- `nextjs` - Next.js App Router
- `base` - Minimal setup

## Installation Types

- **Full**: All SDS packages (UI components, styles, tokens, themes)
  - `@pinonoir/sds-ui`
  - `@pinonoir/sds-styles`
  - `@pinonoir/sds-tokens`
  - `@pinonoir/mui-themes`

- **Minimal**: Styles only (no components)
  - `@pinonoir/sds-styles` (tokens are included as a dependency)

- **Components**: UI components with styles
  - `@pinonoir/sds-ui`
  - `@pinonoir/sds-styles`

- **Custom**: Choose specific packages interactively

## Product Types & Themes

The CLI will ask which product your application is for and automatically configure the appropriate theme:

- **BCC** (Best Case Cloud): `bcc-light` or `bcc-dark`
- **TSC** (Trustee Suite Cloud): `tsc-light` or `tsc-dark`
- **CORE** (Corporate Restructuring): `core-light` or `core-dark`
- **Custom**: Specify your own theme name

## Features

- 🎨 Interactive project setup wizard
- 📦 Multiple framework support (React + Vite, Next.js)
- 🎯 TypeScript by default
- ⚡️ Fast project scaffolding
- 🔧 Auto-configured build tools
- 🎭 Smart theme selection (BCC, TSC, CORE, or custom)
- 📝 Example components included
- 🔄 Automatic version detection from monorepo
- 🎨 Product-specific theme configuration

## License

MIT

# SDS CLI Development Guide

## Overview

The `@pinonoir/sds-cli` package is a command-line tool for scaffolding Super Design System projects. It provides an interactive wizard and command-line options to quickly set up new projects with the SDS component library, design tokens, and styles.

## Architecture

### Directory Structure

```
packages/sds-cli/
├── bin/
│   └── index.js              # CLI entry point (executable)
├── src/
│   ├── index.ts              # Main CLI logic with Commander
│   ├── types.ts              # TypeScript type definitions
│   ├── prompts/
│   │   └── index.ts          # Interactive prompts with Inquirer
│   ├── generators/
│   │   ├── package-json.ts   # Generate package.json
│   │   ├── tsconfig.ts       # Generate TypeScript configs
│   │   └── providers.ts      # Generate provider components
│   ├── installers/
│   │   ├── dependencies.ts   # Dependency installation logic
│   │   └── project.ts        # Project scaffolding logic
│   └── utils/
│       ├── logger.ts         # Logging utilities with colors
│       ├── validation.ts     # Input validation
│       └── file-system.ts    # File operations
├── templates/                # Project templates (future use)
├── package.json
├── tsconfig.json
└── README.md
```

## Tech Stack

- **Commander.js**: CLI framework for command parsing
- **Inquirer.js**: Interactive command-line prompts
- **Chalk**: Terminal string styling and colors
- **Ora**: Elegant terminal spinners
- **Execa**: Process execution for running package managers
- **fs-extra**: Enhanced file system operations
- **TypeScript**: Type-safe development

## Features

### 1. Interactive Mode

```bash
sds create
```

Launches an interactive wizard that prompts for:
- Project name
- Framework choice (React + Vite, Next.js, CRA)
- Installation type (Full, Minimal, Components, Custom)
- Package manager (npm, pnpm, yarn)
- TypeScript preference
- Git initialization

### 2. Command-Line Mode

```bash
sds create my-app --template react-vite --full --typescript
```

Supports all options via CLI flags for CI/CD and automation.

### 3. Installation Types

- **Full**: All SDS packages (sds-ui, sds-styles, sds-tokens, mui-themes)
- **Minimal**: Design tokens and styles only
- **Components**: React component library only
- **Custom**: User selects specific packages

### 4. Framework Support

- **React + Vite**: Modern React development with Vite (default)
- **Next.js**: App Router with server components
- **React CRA**: Classic Create React App (future)

### 5. Auto-Configuration

The CLI automatically generates:
- `package.json` with correct dependencies and scripts
- `tsconfig.json` with optimal TypeScript settings
- Provider components with theme setup
- Vite or Next.js configuration files
- `.gitignore` and README files
- Example app component with SDS components

## Development

### Building

```bash
# Build the CLI
pnpm --filter sds-cli build

# Watch mode for development
pnpm --filter sds-cli dev

# Clean build artifacts
pnpm --filter sds-cli clean
```

### Testing Locally

```bash
# Link the package globally
cd packages/sds-cli
pnpm link --global

# Test the CLI
sds create test-app

# Unlink when done
pnpm unlink --global
```

### Adding New Templates

1. Create template directory in `src/templates/`
2. Add template configuration in `installers/project.ts`
3. Update `getTemplateConfig()` function
4. Add framework-specific file generators
5. Update prompts and types

### Adding New Package Options

1. Update `InstallationType` in `types.ts`
2. Modify `getSDSDependencies()` in `generators/package-json.ts`
3. Add prompt option in `prompts/index.ts`
4. Update README and help text

## How It Works

### 1. Command Parsing

The CLI uses Commander.js to parse commands and options:

```typescript
program
  .command('create [project-name]')
  .option('-t, --template <template>', 'Template to use')
  .option('--full', 'Install all SDS packages')
  .action(async (projectName, options) => {
    // Handle command
  });
```

### 2. User Input

If not all options are provided, Inquirer.js prompts the user:

```typescript
const answers = await inquirer.prompt([
  {
    type: 'list',
    name: 'framework',
    message: 'Select a framework:',
    choices: [...]
  }
]);
```

### 3. Validation

Project names and paths are validated:

```typescript
const validation = validateProjectName(name);
const pathValidation = validateProjectPath(targetPath);
```

### 4. Project Generation

Files are generated based on user selections:

```typescript
await createProject(config);
// Generates: package.json, tsconfig, providers, app files, etc.
```

### 5. Dependency Installation

Package manager is detected/selected and dependencies installed:

```typescript
await installDependencies(targetPath, packageManager);
```

### 6. Git Initialization

Git repository is initialized with initial commit:

```typescript
await initializeGit(targetPath);
```

## Publishing

The package is configured for NPM publishing:

```json
{
  "publishConfig": {
    "access": "public"
  },
  "files": ["bin", "dist", "templates"]
}
```

### Pre-publish Checklist

1. Build the package: `pnpm build`
2. Test locally with `pnpm link`
3. Update version in `package.json`
4. Create changeset: `pnpm changeset`
5. Build and publish: `pnpm release`

## Usage After Publishing

Once published to NPM, users can:

```bash
# Use npx (one-time)
npx @pinonoir/sds-cli create my-app

# Use pnpm dlx (one-time)
pnpm dlx @pinonoir/sds-cli create my-app

# Install globally
npm install -g @pinonoir/sds-cli
sds create my-app
```

## Future Enhancements

- [ ] More framework templates (Vue, Svelte, Angular)
- [ ] Component selection (cherry-pick specific components)
- [ ] Theme customization during setup
- [ ] Storybook integration option
- [ ] Testing setup (Jest, Vitest, Playwright)
- [ ] CI/CD configuration templates
- [ ] Docker support
- [ ] Monorepo setup option
- [ ] Migration tool from other design systems

## Troubleshooting

### CLI Not Found After Install

Ensure the bin file is executable:
```bash
chmod +x packages/sds-cli/bin/index.js
```

### TypeScript Compilation Errors

Clean and rebuild:
```bash
pnpm --filter sds-cli clean
pnpm --filter sds-cli build
```

### Dependencies Not Installing

Check package manager is installed and accessible:
```bash
which pnpm
which npm
which yarn
```

## Contributing

When contributing to the CLI:

1. Follow existing code patterns
2. Add JSDoc comments for public functions
3. Update types in `types.ts`
4. Test with all installation types
5. Test with all supported frameworks
6. Update README and DEVELOPMENT.md

## License

MIT - See LICENSE file for details

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Super Design System is a monorepo containing React components, design tokens, and CSS styles. Built with pnpm workspaces, it follows a strict build order and dependency chain between packages.

## Architecture & Dependencies

The monorepo has a specific build order that must be followed:

1. **sds-tokens** → Style Dictionary-based design tokens (CSS custom properties)
2. **sds-styles** → SASS-based CSS framework that depends on sds-tokens
3. **sds-ui** → React component library with TypeScript and CSS modules
4. **mui-themes** → Material-UI theme configurations

Each package depends on the previous ones in the chain. The sds-styles package automatically rebuilds sds-tokens when building.

## Commands

### Build Commands

```bash
# Build all packages in correct order
pnpm build

# Build individual packages
pnpm build:ui        # sds-ui package only
pnpm build:styles    # sds-styles package (includes sds-tokens)
pnpm build:tokens    # sds-tokens package only
```

### Development Commands

```bash
# Run Storybook development server (sds-ui)
pnpm --filter sds-ui dev

# Watch SASS compilation (sds-styles)
pnpm --filter sds-styles watch

# Test React app sandbox
pnpm --filter react-sandbox dev
```

### Testing & Quality

```bash
# Run all tests across workspaces
pnpm test

# Test specific package
pnpm --filter sds-ui test
pnpm --filter sds-ui test:watch
pnpm --filter sds-ui test:coverage

# Linting and formatting
pnpm lint              # Check all packages
pnpm lint:fix          # Fix linting issues
```

### Package Management

```bash
pnpm install-deps      # Install all dependencies
pnpm update-deps       # Update dependencies interactively
pnpm clean             # Clean all build outputs
```

## Key Technologies & Structure

- **Package Manager**: pnpm (required, >=10)
- **Node Version**: >=22
- **TypeScript**: Strict configuration with path mapping
- **Build Tools**: Custom scripts, Rollup (sds-ui), SASS (sds-styles), Style Dictionary (sds-tokens)
- **Testing**: Jest with React Testing Library
- **Development**: Storybook for component development
- **Linting**: ESLint + Prettier with custom React/TypeScript rules

## Development Workflow

1. **Component Development**: Use Storybook in sds-ui package (`pnpm --filter sds-ui dev`)
2. **Token Updates**: Edit sds-tokens, build will cascade to dependent packages
3. **Style Updates**: Modify sds-styles SASS files, use watch mode for development
4. **Testing**: Always run tests before committing (`pnpm test`)
5. **Building**: Use root `pnpm build` to build all packages in correct order

## Important Notes

- The build process uses a custom script that enforces the dependency order
- TypeScript path mapping is configured for cross-package imports
- CSS modules are used in sds-ui components
- The project uses semantic commit messages and Changesets for versioning
- Storybook serves as both development environment and documentation
- All packages export proper ES modules with TypeScript declarations

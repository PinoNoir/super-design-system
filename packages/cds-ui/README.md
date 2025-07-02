# Stretto - Cadence Design System - React Component Library

This is a custom Typescript React component library that uses Radix components & CSS modules for styling that's tailored for Best Case cloud. Our goal is to extend this framework to handle other Stretto applications with theming in the future.
Read the docs for Radix Components [here](https://www.radix-ui.com/docs/primitives/overview/introduction 'here').

## Project structure

Project file/folder structure:

- `/storybook` contains the Storybook config files necessary to run and build.
- `/src` contains all components, styles, themes, and storybook config
- `/lib` contains all bundled components as ES modules
- Check the `package.json` file for the dev/lint/build scripts for workflow

## Running the project

Run Storybook with:

```text
pnpm dev
```

Lint ts/tsx files to adhere to the eslint config and Design System guidelines with:

```text
pnpm lint
```

Bundle components/styles and generate lib folder with:

```text
pnpm build
```

## License

This project is under [MIT license]

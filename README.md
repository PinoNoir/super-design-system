# Super Design System

This is a monorepo configuration that uses `pnpm workspaces` for all related _Cadence Design System_ projects.

## Project/Directory Structure

- `.packages/` folder contains all of our individual packages and respective workspace environments:

  - sds-tokens (A custom Style Dictionary project that outputs global and theme design tokens for all brands). Please reference the `README.md` in that directory for instructions
  - sds-styles (A custom Sass project used to generate a global css files for all brands). Please reference the `README.md` in that directory for instructions
  - sds-ui (A custom Storybook dev environment, and React component library, & their respective CSS module files). Please reference the `README.md` in that directory for instructions
  - Check the `package.json` file for the build/dev/lint scripts used to start the dev server and build each library for each workspace.

- `.apps/` folder contains a react app bootstrapped with Vite and Tanstack React Router for testing components and styling:

  - react-sandbox (You can use this to test components, their props, and how they render in the browser). Please reference the `README.md` in that directory for instructions

## Prerequisites - Initial pnpm setup

Note: You must have at least node v18 installed.

Next, install pnpm globally by running the following command:

```text
npm install -g pnpm
```

That's it, you're ready to roll!

## Local Project Setup

Install all project dependencies by running:

```text
pnpm install
```

Build all project workspaces by running:

```text
pnpm build
```

# Tips: Running commands from the root workspace

When working with monorepos you can execute scripts from the "root" package.json file to run on all workspaces. These are used to maintain the codebase, check the scripts section for commands.

Lint all project workspaces by running:

```text
pnpm lint
```

Fix all lint errors/warnings by running:

```text
pnpm lint:fix
```

## License

This project is under [MIT license]

## Troubleshooting

• Know issues: When running the `build` script, sometimes the output folder, `lib` or `dist` will not be deleted and throw an EPERM error, simply manually delete the folder and run the `build` command again.
• If there are any node errors when installing the dependencies please check to make sure you have `pnpm` installed in your local environment.
• If errors persist, please reach out to me via email `nickpino.designs@gmail.com` or Teams chat. I'm more than happy to assist and help troubleshoot!

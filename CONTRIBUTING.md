# Contribution guidelines

Note: this document and process is still being fleshed out, we will continue to make changes to this document. (Last Updated: 6/10/2024).

---

This is an **official library** of shared UI components for Stretto developers and used for internal app development.

This library is open-sourced, and we encourage everyone to use and contribute into it.

## How to contribute

1. Create a new feature branch from `develop`
2. Please use the correct node version it is listed in the `.nvmrc` file (you can use `nvm use` in order to switch to the right node version).
3. Install dependencies with `pnpm install` command
4. Sync from upstream if needed
5. Each workspace in the `packages` folder contains its own respective project, please refer to the README file for an overview.
6. Run Storybook environment in the cds-ui workspace locally with `pnpm dev` command.
7. Make sure all components behave as expected by running all Jest tests locally with `pnpm test`.
8. If there are changes in some of the library snapshot tests, make sure all changes are intentional. If they are, update them with `pnpm test:update`.
9. Publish your branch
10. Commit to your local changes using [Semantic Commit Messages](https://seesparkbox.com/foundry/semantic_commit_messages)
11. Create a PR with title based using [Semantic Commit Messages](https://seesparkbox.com/foundry/semantic_commit_messages)
    For example: `CDS-56553: add new TextArea component`
12. Go over the [checklist](/.github/PULL_REQUEST_TEMPLATE.md) in the PR and make sure that all checks are passed
13. Wait for the Design and Code review
14. Enjoy your change after merge!

## Information about the project

### Creating new files in the library

Our code generator, Plop, is designed to simplify the creation of frequently used boilerplate code. To utilize it, execute the command `pnpm plop`. If you want to learn more about Plop, you can find additional information [here](https://plopjs.com/).
Currently, our Plop code generator supports the creation of the following:

1. Tests
2. Component story documentation pages
3. Hook story documentation pages
4. Entirely new components, which include tests and story pages

We strongly recommend utilizing our Plop code generator within this repository for generating any of the mentioned items. Doing so ensures that your code will be created with the latest recommended structure, providing a solid foundation for your development tasks.

### API

If you add new features or abilities to an existing component, please ensure your props' naming follows our conventions and best practices. Read more about it [here](./API_GUIDELINES.MD).

### Storybook

As the main development environment and documentation playground, we are using [Storybook](https://storybook.js.org/).
Each component should be developed in isolation in the Storybook environment.
You can read more about our docs implementation best practices [here](COMPONENTS_DOCUMENTATION_GUIDELINES.md).

### Theming

Every component should support theming, you can find more information about it [here](THEME_README.md).

### Tests and coverage

All the guidelines about testing your new component or changes to the existing one you can find [here](TESTING_README.md).

### Linting

We use [Prettier](https://prettier.io/) with the default community guidelines. Please, make sure that you are formatting your code with prettier.

### Commits

We are using [Semantic commits](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716) convention for creating Pull Requests and commits messages inside of the Pull Request.

### Releasing

To release a new version, you can run the ["Release new version" workflow](["Insert link/info here"]).

If you want to run it locally, you can do so with [Changesets CLI](["Insert link/info here"]):

```
$ pnpm "release"
```

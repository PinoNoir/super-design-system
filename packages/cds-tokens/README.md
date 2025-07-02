# Stretto Cadence Design System - Global and Theme Design Tokens

This project is a [Style Dictionary](https://github.com/amzn/style-dictionary) configuration to generate design tokens for _Cadence Design System_.
Please visit [Style Dictionary's](https://styledictionary.com/) new docs site for the latest updates.

**Notice**: _This code has been customized to output CSS Custom Properties. To view all the possible Style Dictionary configurations visit [API methods](https://amzn.github.io/style-dictionary/#/api)._

## Initial setup

Install the project dependencies via the CLI command:

```text
pnpm install
```

## Project structure

Project file and folder structure:

- `/tokens` contains the design token input JS files (IMPORTANT! Only edit these files!)
- `/lib` contains the generated output files (This version is configured to output CSS custom properties)
- `scripts/build.js` contains the build script used to parse the js files and generate the final output files for each brand theme (BCC, CDS, TSC)

## Running the project

You can build the design tokens from the `/tokens/` folder by running:

```text
pnpm build
```

The generated tokens are saved in the `/lib` folder, and organized by target application (i.e. BCC, CDS, TSC).

## License

This project is under [MIT license]

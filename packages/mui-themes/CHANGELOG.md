# @stretto/mui-themes

## 10.0.1

### Patch Changes

- \- Added an animated SkeletonTable component that can be rendered as a placeholder when loading data in a TableCustomization

  \- Added additional props to the Tooltip component for consumers to control positioning, timing, etc. and fixed css animations

  \- Added a new `header` parameter to the SplitButton Dropdown to add bolded header text to dropdowns

  \- Added the name parameter to the TextInput component

## 10.0.0

### Major Changes

- - Major Refactor of Table component, sub-components, types, and hooks (Breaking changes)
  - Added new docs and examples of using the Table component/hooks
  - Refactored Form component and removed internal state causing bugs (Breaking changes)
  - Added new docs and example of Form component
  - Updated Checkbox component to fix stop propagation bug
  - Updated CSS across various components to fix minor issues

## 9.0.9

### Patch Changes

- - Updated styling on the PromptInput
  - Added new props to the PromptInput (Please check storybook for API)
  - Included a new slot in the PromptInput for file uploads
  - Refactored Table component (WIP - Unstable)

## 9.0.8

### Patch Changes

- - Fixed rerender bug in the Sidebar component
  - Updated Table Pagination components (WIP)
  - Updated Pagination styling

## 9.0.7

### Patch Changes

- Added new FileChip and DropZone components for AI apps
  Refactored and updated the Sidebar component
  Added collapsible sections to Sidebar component
  Updated CSS for various components
  Updated token values for muted text (all dark mode themes)
  Added unit tests for all new components

## 9.0.6

### Patch Changes

- - Add new PromptInput component for AI applications
  - Removed the global button svg class causing overrides from the iconButton component
  - Updated Switch component props to allow for more flexibility and updated CSS
  - Removed unnecessary logic from the textInput component and added React-Hook-Form props for controlling state
  - Added a new useAutoFillsync hook to the Form component for checking field state in the form
  - Updated Avatar CSS for the core theme

## 9.0.5

### Patch Changes

- All export paths fixed in rollup ( All components and types can be imported from the main index.js file)
  Styling updates to Sidebar component

## 9.0.4

### Patch Changes

- Fixed the naming convention of the CSS entry file for component styling

## 9.0.3

### Patch Changes

- - Added all types to the main bundle for the Table component
  - Updated and fixed state management issues on the TableCheckbox component
  - Updated and restructured stylesheets for the Table
  - Updated Table component docs
  - Modified themes and CSS for various components

## 9.0.2

### Patch Changes

- - Added new renderRow prop to Table component for custom row/content rendering (See Storybook examples)
  - Updated styling for Table component and added new token values for theming (WIP)
  - Upgraded Storybook to version 9.0.4

## 9.0.1

### Patch Changes

- - @stretto/cds-ui package exports all component types for extendability
  - New Beacon & Sidebar components available for Gen AI React projects
  - Bundle size reduced considerably
  - Improved test coverage across CDS components (Over 80%)

## 9.0.0

### Major Changes

- - Added a new light and dark theme for CORE products that can be used for CDS React components
  - Included more components to be styled with theme variables
  - Removed all Vanilla Extract styled components
  - Introduced breaking changes with the way the component CSS is bundled (Please see Migrating to CDS-UI v9 in Storybook for docs)
  - Introduced breaking changes for the Box component (Previously used vanilla extract sprinkles, the new styling api uses more shorthand CSS properties)
  - Updated FileCard component CSS and typings (API is more flexible)
  - Fixed minor CSS discrepancies for various components
  - Worked to improve testing coverage and reduce bundle size for @stretto/cds-ui library
  - Separated mui-themes into it's own respective npm package

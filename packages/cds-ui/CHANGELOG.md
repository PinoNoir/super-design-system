# @stretto/cds-ui

## 10.0.1

### Patch Changes

### Bug Fixes & New Features

- Added an animated SkeletonTable component that can be rendered as a placeholder when loading data in a TableCustomization
- Added additional props to the Tooltip component for consumers to control positioning, timing, etc. and fixed css animations
- Added a new `header` parameter to the SplitButton Dropdown to add bolded header text to dropdowns
- Added the name parameter to the TextInput component

### Updated dependencies

- @stretto/cds-styles@10.0.1

## 10.0.0

### Major Changes

### Bug Fixes & New Features

- Major Refactor of Table component, sub-components, types, and hooks (Breaking changes)
- Added new docs and examples of using the Table component/hooks
- Refactored Form component and removed internal state causing bugs (Breaking changes)
- Added new docs and example of Form component
- Updated Checkbox component to fix stop propagation bug
- Updated CSS across various components to fix minor issues

### Patch Changes

### Updated dependencies

- @stretto/cds-styles@10.0.0

## 9.0.9

### Patch Changes

### Bug Fixes & New Features

- Updated styling on the PromptInput
- Added new props to the PromptInput (Please check storybook for API)
- Included a new slot in the PromptInput for file uploads
- Refactored Table component (WIP - Unstable)

### Updated dependencies

- @stretto/cds-styles@9.0.9

## 9.0.8

### Patch Changes

### Bug Fixes & New Features

- Fixed rerender bug in the Sidebar component
- Updated Table Pagination components (WIP)
- Updated Pagination styling

### Updated dependencies

- @stretto/cds-styles@9.0.8

## 9.0.7

### Patch Changes

### Bug Fixes & New Features

- Added new FileChip and DropZone components for AI apps
- Refactored and updated the Sidebar component
- Added collapsible sections to Sidebar component
- Updated CSS for various components
- Updated token values for muted text (all dark mode themes)
- Added unit tests for all new components

### Updated dependencies

- @stretto/cds-styles@9.0.7

## 9.0.6

### Patch Changes

### Bug Fixes & New Features

- Add new PromptInput component for AI applications
- Removed the global button svg class causing overrides from the iconButton component
- Updated Switch component props to allow for more flexibility and updated CSS
- Removed unnecessary logic from the textInput component and added React-Hook-Form props for controlling state
- Added a new useAutoFillsync hook to the Form component for checking field state (Autocomplete)
- Updated Avatar CSS for the core theme

### Updated dependencies

- @stretto/cds-styles@9.0.6

## 9.0.5

### Patch Changes

### Bug Fixes & New Features

- All export paths fixed in rollup ( All components and types can be imported from the main index.js file)
- Styling updates to Sidebar component

### Updated dependencies

- @stretto/cds-styles@9.0.5

## 9.0.4

### Patch Changes

### Bug Fixes & New Features

- Fixed the naming convention of the CSS entry file for component styling

### Updated dependencies

- @stretto/cds-styles@9.0.4

## 9.0.3

### Patch Changes

### Bug Fixes & New Features

- Added all types to the main bundle for the Table component
- Updated and fixed state management issues on the TableCheckbox component
- Updated and restructured stylesheets for the Table
- Updated Table component docs
- Modified themes and CSS for various components

# Updated dependencies

- @stretto/cds-styles@9.0.3

## 9.0.2

### Patch Changes

### Bug Fixes & New Features

- Added new renderRow prop to Table component for custom row/content rendering (See Storybook examples)
- Updated styling for Table component and added new token values for theming (WIP)
- Upgraded Storybook to version 9.0.4

### Updated dependencies

- @stretto/cds-styles@9.0.2

## 9.0.1

### Patch Changes

### Bug Fixes & New Features

- @stretto/cds-ui package exports all component types for extendability
- New Beacon & Sidebar components available for Gen AI React projects
- Bundle size reduced considerably
- Improved test coverage across CDS components (Over 80%)

### Updated dependencies

- @stretto/cds-styles@9.0.1

## 9.0.0

### Major Changes

### Bug Fixes & New Features

- Added a new light and dark theme for CORE products that can be used for CDS React components
- Included more components to be styled with theme variables
- Removed all Vanilla Extract styled components
- Introduced breaking changes with the way the component CSS is bundled (Please see Migrating to CDS-UI v9 in Storybook for docs)
- Introduced breaking changes for the Box component (Previously used vanilla extract sprinkles, the new styling api uses more shorthand CSS properties)
- Updated FileCard component CSS and typings (API is more flexible)
- Fixed minor CSS discrepancies for various components
- Worked to improve testing coverage and reduce bundle size for @stretto/cds-ui library
- Separated mui-themes into it's own respective npm package

### Updated Dependencies

- @stretto/cds-styles@9.0.0

## 8.2.0

### Minor Changes

### Bug Fixes & New Features

- Updates to theme tokens for various components
- Added and improved unit tests for several components to improve code coverage
- Fixed CSS issues for various components

### Updated Dependencies

- @stretto/cds-styles@8.2.0

## 8.1.0

### Minor Changes

### Bug Fixes & New Features

- Added multiselect functionality to Select component
- Added themes for BCC and TSC for the Select component
- Updated Accordion component sematic structure to improve accessibility
- Updated all components that used react context to use default exports
- Modified global color tokens to improve naming conventions
- Fixed minor code smells across codebase
- Improved test coverage for various components

### Updated dependencies

- @stretto/cds-styles@8.1.0

## 8.0.1

### Patch Changes

### Bug Fixes & New Features

- Added new component level design token values for multiple components for use with BCC and TSC themes
- Added a new `tsc-legacy` theme for CDS react components
- Updated several CSS files to fix minor UI issues
- Converted several component vanilla-extract CSS files to standard CSS modules (For better theming control and maintenance)

### Updated dependencies

- @stretto/cds-styles@8.0.1

## 8.0.0

### Major Changes

### Bug Fixes & New Features

- Added new global and theme design tokens for all applications
- Updated import paths for all CSS files (Breaking change)
- Updated sorting functionality on the Table component (Potential fix for RIO-59011)
- Updated Tooltip component CSS to use new theme token values (CSS module)
- Modified cds-ui build output to support commonjs and esm formats
- General dependency updates and file maintenance

### Updated dependencies

- @stretto/cds-styles@8.0.0

## 7.0.1

### Bug Fixes & New Features

- Fixed broken automation-id attribute on the Table component
- Updated the id prop on data table row interface as optional
- Removed unnecessary console log statements

### Updated dependencies

- @stretto/cds-styles@7.0.1

## 7.0.0

### Bug Fixes & New Features

- Updated useDataSearch hook to include the handleClear function (Should fix RIO-58478 and RIO-58626)
- Updated useDataSort hoo to improve sorting logic (Should fix RIO-59011)
- Updated Table component row selection functionality (Should fix RIO-58745)

### Updated dependencies

- @stretto/cds-styles@7.0.0

## 6.2.0

### Bug Fixes & New Features

- Updated Table component to fix issues with row selection.
- Removed local storage from the useCustomTableApi hook.
- Updated Table context to fix issues with ids being added on row selection

### Updated dependencies

- @stretto/cds-styles@6.2.0

## 6.1.0

### Bug Fixes & New Features

- Added Card component (Please check Storybook for usage and examples)
- Updated Table component to allow updating state through the data prop (Included example in Storybook)
- Fixed minor stling discrepancies
- Minor file cleanup/maintenance

### Updated dependencies

- @stretto/cds-styles@6.1.0

## 6.0.0

### Major Changes

#### Bug Fixes & New Features

- Added new ServerPagination component to handle server side pagination for the CDS table
- Added new input fields that handle formatting for phone numbers, SSN, emails
- Updated form component with new props and parameters for customization
- Updated CSS accross various components to fix minor issues in the LN application

### Patch Changes

#### Updated dependencies

- @stretto/cds-styles@6.0.0

## 5.2.3

### Patch Changes

#### Bug Fixes & New Features

- Updated DataTable component CSS to address responsive issues in LN project
- Added new minSearchThreshhold prop to Search component

#### Updated dependencies

- @stretto/cds-styles@5.2.3

## 5.2.2

### Patch Changes

#### Bug Fixes

- Removed CSS affecting number input fields in BCC V1 application

#### Updated dependencies

- @stretto/cds-styles@5.2.2

## 5.2.1

### Patch Changes

#### New Features & Bug Fixes

- Merged PR 45673: RIO-57982 fix problem with react-image-crop (Big thanks to Marcin Sochacki!)
- Updated Storybook version to 8.3.3

#### Updated dependencies

- @stretto/cds-styles@5.2.1

## 5.2.0

### Minor Changes

#### New Features and Bug Fixes

- Added an image crop modal powered by the react-image-crop library for use with the FileUploader component
- Merged PR 45561: RIO-57535 update FileUploader and useFileValidation (Big thanks to Marcin Sochacki!)
- Updated the isLoading state on Button component, improved component structure
- Added styling and more variants to ToggleButton component
- Updated lineheight values to match Figma V2 component library
- General maintenance and file cleanup

### Patch Changes

#### Updated dependencies

- @stretto/cds-styles@5.2.0

## 5.1.0

### Minor Changes

#### New Features and Bug Fixes

- Modified ProgressBar component and added an additional stopAnimation prop to control animation
- Modified the FileUploader component context and added additional properties to handle file tracking and adding files to context upon selection
- Adjusted global CSS for scrollbars to revert them back to browser defaults (fixes RIO-55971)
- Made minor adjustments to CSS for various components

### Patch Changes

#### Updated dependencies

- @stretto/cds-styles@5.1.0

## 5.0.1

### Patch Changes

#### Bug Fixes & New Features

- Added logic to useDataSort hook to handle date sorting in the data table component
- Added a new hook useDragAndDrop to handle drag and drop functionality and encapsulate logic
- Added tests for TablePagination and TableRows components
- Removed dynamically generated automation-id from all components so that it can be manually set

#### Updated dependencies

- @stretto/cds-styles@5.0.1

## 5.0.0

### Major Changes

#### New Features & Bug Fixes

- Refactored the FileUploader component (Added new state, separated logic into hooks, and created new Subcomponents to improve flexibility - introduces breaking changes)

### Patch Changes

#### Updated dependencies

- @stretto/cds-styles@5.0.0

## 4.1.3

### Patch Changes

- Styling updates for Table and Select components

#### Updated dependencies

- @stretto/cds-styles@4.1.3

## 4.1.2

### Patch Changes

#### Bug Fixes

- Fixed React key warning in TableRows component
- Fixed Checkbox rendering issue

#### Updated dependencies

- @stretto/cds-styles@4.1.2

## 4.1.1

### Patch Changes

#### Bug Fixes

- Fixed minor code smells across the project
- Updated Select component and added inline prop to control label position

#### Updated dependencies

- @stretto/cds-styles@4.1.1

## 4.1.0

### Minor Changes

#### Bug Fixes & New Features

- Updated primary button color from teal50 to teal70 to adhere to accessibility standards
- Added Combobox component (Unit tested)
- Added ButtonToggle component (Unit tested)
- Updated CSS on various components to fix minor issues
- Fixed code smells found in SonarQube

### Patch Changes

#### Updated dependencies

- @stretto/cds-styles@4.1.0

## 4.0.5

### Patch Changes

#### Bug Fixes

- Fixed various code smells across project

#### Updated dependencies

- @stretto/cds-styles@4.0.5

## 4.0.4

### Patch Changes

#### Bug Fixes

- Removed the react-focus-trap dependency causing errors when rendering the Dropdown and Select components

#### Updated dependencies

- @stretto/cds-styles@4.0.4

## 4.0.3

### Patch Changes

#### Bug Fixes

- Updated Select component and removed Context Api (Added unnecessary complexity and caused issues with default exports)

#### Updated dependencies

- @stretto/cds-styles@4.0.3

## 4.0.2

### Patch Changes

#### Bug Fixes

- Partially fixed code smells found in SonarQube
- Removed unused imports across all files
- Adjusted render function on the Select Component

#### Updated dependencies

- @stretto/cds-styles@4.0.2

## 4.0.1

### Patch Changes

#### Bug Fixes

- Updated default exports for the Select component and sub components (Fixes import errors in external dev environments)

#### Updated dependencies

- @stretto/cds-styles@4.0.1

## 4.0.0

### Major Changes

#### Bug Fixes & New Features

- Refactored Dropdown component and added new sub components and features (Introduces breaking changes)
- Refactored Select component and added new sub components and features (Also fixes RIO-52821 UI bug)
- Updated RadioButtonGroup to map missing union type to valueSelected prop
- Fixed styling issue with the Button component and cleaned up CSS file
- Updated Section Alert component to fix a minor styling issue in LN project
- Added the IconButton component for use in development (Also added unit test)
- Added EmptyState component for use in development (Also added unit test)
- Updated CSS on various components
- Updated general CDS documentation (Will update component docs next, where needed, for next release)
- Internal updates to packages
- Upgraded Storybook to latest version

### Patch Changes

#### Updated dependencies

- @stretto/cds-styles@4.0.0

## 3.5.0

### Minor Changes

#### Bug Fixes and New Features

- Updated Search component to fix isExpanded props and styling, added additional storybook examples (Does not introduce breaking changes).
- Fixed Styling on Select component when an Item is selected
- Updated Breadcrumb component and removed react router dependency, added styling, and unit test
- Added EmptyState component and unit test
- Fixed styling on various components

### Patch Changes

#### Updated dependencies

- @stretto/cds-styles@3.5.0

## 3.4.0

### Minor Changes

- Added New Form component with FormBlock, FormFooter subcomponents + unit tests
- Updated Select and TextInput component CSS
- Added a union type for radio-buttons and checkboxes to accept strings or numbers for all value props
- Internal updates and maintenance

### Patch Changes

#### Updated dependencies

- @stretto/cds-styles@3.4.0

## 3.3.2

### Patch Changes

- Updated Table pagination CSS to fix alignment issues
- Minor adjustment to the clearAllFiles function types in the FileContext (fixes a type error in the LN project)

#### Updated dependencies

- @stretto/cds-styles@3.3.2

## 3.3.1

### Patch Changes

- Minor CSS styling updates

#### Updated dependencies

- @stretto/cds-styles@3.3.1

## 3.3.0

### Minor Changes

#### Internal Updates and Bug Fixes

- Updated Select and MenuItem components to use the same value prop types
- Fixed Select component CSS
- Added the required prop to the useNormalizedInputProps utility function
- Added unit tests
- Internal updates to storybook and removed unnecessary addons causing build issues

### Patch Changes

#### Updated dependencies

- @stretto/cds-styles@3.3.0

## 3.2.0

### Minor Changes

- Added the number type to the value prop of the RadioButton component
- Removed console.log statement from the RadioButtonGroup component

### Patch Changes

#### Updated dependencies

- @stretto/cds-styles@3.2.0

## 3.1.0

### Minor Changes

- Updated RadioButtonGroup/RadioButton and fixed firefox rendering issues (Fixed CSS issue on psuedo-element in firefox)
- Added unit test for RadioButtonGroup and RadioButton components
- Added rough draft of IconButton component, still needs to be properly setup for vanilla-extract variants (Not for use in production)
- Began fleshing out the NavBar component, adding state management and creating subcomponents (Not for use in production)
- Updated Select & MenuItem component types and removed generics (Added unnecessary complexity)
- Fixed splitbutton CSS specificity issues
- Updated stories and added more implementation examples for various components
- General maintenance/file cleanup

### Patch Changes

#### Updated dependencies

- @stretto/cds-styles@3.1.0

## 3.0.1

### Patch Changes

#### Bug Fixes

- Added disableOnOverlayClick prop to Modal component for preventing closing the modal when clicking outside of it
- Minor CSS adjustments to Modal, Dialog, Popover

#### Internal

- Added Storybook Visual Tests addon for Chromatic

#### Updated dependencies

- @stretto/cds-styles@3.0.1

## 3.0.0

### Major Changes

- Fixed CSS issues with the Checkbox component
- Adjusted z-index of modal overlay to prevent stacking issues when dialogs appear above the modal
- Removed internal logic from the FileUploader that allows developers to control adding files to the context (breaking changes)

### Patch Changes

#### Updated dependencies

- @stretto/cds-styles@3.0.0

## 2.4.8

### Patch Changes

- Added parameters to the Toast component to control duration and open state

#### Updated dependencies

- @stretto/cds-styles@2.4.8

## 2.4.7

### Patch Changes

#### Bug Fixes and New Features

- Added more parameters to the Modal component for customization
- Adjusted spacing of RadioButton component when stacked vertically

#### Updated dependencies

- @stretto/cds-styles@2.4.7

## 2.4.6

### Patch Changes

#### Bug Fixes and New Features

- Removed internal logic from FileUploader causing conflicts (onUpload will be handled externally)
- CSS updates to Dialog, Modal, and DataTable

#### Internal Updates

- Updated Storybook Coming Soon section to Experimental

#### Updated dependencies

- @stretto/cds-styles@2.4.6

## 2.4.5

### Patch Changes

#### Bug Fixes

- Removed complex logic tied to the fileUploader component (Building file data will now be handled outside of CDS).
- Added CSS styling to table component

#### Updated dependencies

- @stretto/cds-styles@2.4.5

## 2.4.4

### Patch Changes

#### New Features

- Added the ability to attach a ref to the Accordion and AccordionItem components
- Added automation-id's to all Dropdown Menu sub components for testing purposes
- Added additional CSS styles/properties to Table, TextArea, and Select components
- Added additional props to ButtonConfig Interface on the Modal component for controlling disabled state etc.

#### Updated dependencies

- @stretto/cds-styles@2.4.4

## 2.4.3

### Patch Changes

#### New Features

- Added the ability to optionally specify whether a dialog has a delete action, setting prop to true will render a delete button with correct styling.
- Included some additional CSS classes to the Table component.

#### Updated dependencies

- @stretto/cds-styles@2.4.3

## 2.4.2

### Patch Changes

#### Styling Updates

- Updated Data Table, Select, and Radio Button CSS styling to account for responsive resizing.
- Added singleButton prop to Dialog to conditionally render single buttons.

#### Updated dependencies

- @stretto/cds-styles@2.4.2

## 2.4.1

### Patch Changes

#### Features

- Added style variants and disabled state to SplitButton component
- Included TextArea component in bundle (Ready for dev use - still needs to be unit tested)
- Adjusted Select component CSS (Width Properties)

#### Updated dependencies

- @stretto/cds-styles@2.4.1

## 2.4.0

### Minor Changes

- Refactored Modal component and removed Radix dependency.
- Added Dialog component to cds-ui bundle.
- Added draggable rows to the Table component.
- Fixed issues with custom hooks used for sorting and searching on table/list data.
- Added unit test for Breadcrumb, Modal, and Dialog components (Ready for use).
- Updated custom hook documentation is Storybook (Still needs to be standardized and cleaned up).

### Patch Changes

#### Updated dependencies

- @stretto/cds-styles@2.4.0

## 2.3.0

### Minor Changes

- Updates to FileUploader component that overhaul it's implementation, please refer to docs for more information
- Updated Accordion component CSSto add a white background for the content section when darkmode is enabled to match BCC current styling

### Patch Changes

#### Updated dependencies

- @stretto/cds-styles@2.3.0

## 2.2.6

### Patch Changes

- Updated the FileUploader to handle fetch requests from an endpoint.
- Also added z-index value for the Select Menu to prevent stacking issues when used with other components.

### Updated dependencies

- @stretto/cds-styles@2.2.6

## 2.2.5

### Patch Changes

- Updated internal logic of the FileUploader component, modifying the way it handles uploading files to a server and showing progress of the upload

### Updated dependencies

- @stretto/cds-styles@2.2.5

## 2.2.4

### Patch Changes

- Updates and Improvements to the FileUploader and FileCard components

### Updated dependencies

- @stretto/cds-styles@2.2.4

## 2.2.3

### Patch Changes

#### Updates

- Removed the simulate progress callback function from being called in the FileUploader component (Note: Does not cause breaking changes)
- Added a sorybook implementation to show as an example of how to simulate the progress of the file uploading using the updateFileProgress callback function from the FileContext

#### Updated dependencies

- @stretto/cds-styles@2.2.3

## 2.2.2

### Patch Changes

#### New Features

- Adjusted progress bar animation in the FileUploader component when a file is being uploaded

#### Updated dependencies

- @stretto/cds-styles@2.2.2

## 2.2.1

### Patch Changes

#### New Features

- Set FileContextProvider config prop as optional

#### Updated dependencies

- @stretto/cds-styles@2.2.1

## 2.2.0

### Minor Changes

#### New Features

- Added new Chip component (for different uses cases including filters)
- Added new CSS style properties to Table component
- Added new SplitButton component (BCC Primary styling only, will add more variants in the future)
- Added new Drawer component
- Updated FileUploader to handle endpoint configuration
- Added documentation for custom hooks provided in CDS
- Internal updates to dependencies, sorybook config to handle mock requests, etc.

### Patch Changes

#### Updated dependencies

- @stretto/cds-styles@2.2.0

## 2.1.8

### Patch Changes

#### Bug Fixes

- Fixed Select component CSS and popper placement when menu is open

#### Updated dependencies

- @stretto/cds-styles@2.1.8

## 2.1.7

### Patch Changes

#### New Features

- Modified Type generics on Table components that cause unnecessary contraints
- Added button controls on TablePagination component that allows users to got to first and last page respectively

#### Updated dependencies

- @stretto/cds-styles@2.1.7

## 2.1.6

### Patch Changes

#### Bug Fixes

- Fixed React Key warning on Select component

#### New Features

- Added a onRowSelect callback function that can be used for selecting table rows
- Fixed logic for selecting single and multiple rows in the Table component, which can be controlled with the multipleSelect boolean prop
- Separated data Sorting logic into its own custom useDataSort hook (Thanks Legal Noticing team!)
- Separated data Search logic into its own custom useDataSearch hook
- Updated CSS for Table Buttons to match LN Mockups

#### Updated dependencies

- @stretto/cds-styles@2.1.6

## 2.1.5

### Patch Changes

#### New Features

- Updated Select component API to meet requirements for the Legal Noticing project

#### Updated dependencies

- @stretto/cds-styles@2.1.5

## 2.1.4

### Patch Changes

#### New Features

- Updated Select component prop types and signatures to remain flexible, but remove complexity of implementation

#### Updated dependencies

- @stretto/cds-styles@2.1.4

## 2.1.3

### Patch Changes

#### New Features

- Updates to custom Table Component logic for single and multiple row selection

#### Updated dependencies

- @stretto/cds-styles@2.1.3

## 2.1.2

### Patch Changes

#### New Features

- Updated custom Table Components for selecting single or multiple rows
- Updated Select component typings and Aria roles to improve accessibility
- Updated FileUploader to expose clearAllFiles callback function in the FileContext only (for better control over when it's called)

#### Updated dependencies

- @stretto/cds-styles@2.1.2

## 2.1.1

### Patch Changes

#### New Features:

- Added additional prop types to TableButton component to add more flexibility
- Updated FileContext ClearAllFiles Function to remove uploaded files from context

#### Updated dependencies

- @stretto/cds-styles@2.1.1

## 2.1.0

### Minor Changes

#### New Features:

- Select & MenuItem Components:
  - Added Typescript generic props for developers to customize values that are accepted
  - Added Floating UI to Select component as a dependency for handling the placement of MenuItems
- Table Component:
  - Updated context and added/refactored logic
  - Added ability to subscribe to an event for individual or multiple table Rows
  - Added disabled state to rows and added styling
  - Added custom Pagination component that can be enabled to show pagination on the table
  - Ability to Select single or multiple rows
  - Added custom checkbox and button components to be specifically used within the Table for selecting rows
- Added Dialog component
- Added Dynamic List component
- Currency Input Component - Added a custom currency input to handle decimal values and added unit test (Thanks TSC team!)
- Added enableMenuContainer boolean prop on Accordions and FileCard components to conditionally show Context menus (Thanks Leon A!)
- Refactored Avatar component and added unit test
- Updated/Fixed CSS on various components

### Patch Changes

#### Updated dependencies

- @stretto/cds-styles@2.1.0

## 2.0.0

### Major Changes

#### Breaking Changes

- The labelText prop on the Search, TextInput, RadioButton, and Checkbox components has been changed to label.
- Checkbox component has been refactored, the RadixUI dependency has been removed, and props/typings have been improved.
- Select component has been refactored, the RadixUI dependency has been removed, and props/typings have been improved
- Menu Item for the Select component has been added for better customization and control, renders as an HTMLLIElement

#### Bug Fixes

- RadioButtonGroup component orientation prop has been fixed and Radio buttons can now be stacked vertically.

#### New Features

- Various CSS updates to components
- Added experimental components (For use in development): Form, FormBlock, TextArea, WorkflowModal, Portal, FilterBar, AsyncComponent (For loading data),
- Popover Component can now be displayed with any type of trigger, before it could only be displayed with buttons

#### Updated dependencies

- @stretto/cds-styles@2.0.0

## 1.5.6

### Patch Changes

#### Bug Fixes

- Reverted the Toast component back to the original implmentation based on requirements in the BCC Legal Noticing project
- Added a flexible ToastContainer component that can be used for multiple toasts
- Fixed CSS issues with Section Alert component

#### Updated dependencies

- @stretto/cds-styles@1.5.6

## 1.5.5

### Patch Changes

#### Hotfix

- Updated and simplified the implementation of the Toast component

#### Updated dependencies

- @stretto/cds-styles@1.5.5

## 1.5.4

### Patch Changes

#### Bug Fixes

- Added style={{ overflowY: undefined }} to the select component to remove React development error
- Modified CSS of the Select component for disabled states

#### Updated dependencies

- @stretto/cds-styles@1.5.4

## 1.5.3

### Patch Changes

#### Internal Changes

- Removed @storybook/test from dependencies and added to dev dependencies (Caused issues in LN project)
- Updated Storybook to version 8.0.2

#### Updated dependencies

- @stretto/cds-styles@1.5.3

## 1.5.2

### Patch Changes

#### Bug Fixes

- Updates to FileUploader Context (For LN project support)
- Updates to Toast useToastContext hook
- Added Modal BUtton Updates from PR !40657
- CSS updates to various components

#### Internal Changes

- Upgraded to Storybook 8.0.1

#### Updated dependencies

- @stretto/cds-styles@1.5.2

## 1.5.1

### Patch Changes

#### Bug Fixes/Updates

- Removed panelContent prop on the Panel component. Panel content can now be specified as children. i.e. `<Panel>Panel content now goes here.</Panel>`
- Updated Modal component's Trigger prop, this is now more flexible, so any type of visual trigger can be used to open the modal, i.e. button, icon, etc.
- Action buttons are now wrapped with RADIX Dialog.Close composite component. This triggers the onclick action of the button, then the close action.

#### New Features

- Added required prop to TextInput component and styles. This can now be used to specify fields that are required in a form, etc.
- Added react-hook-form (v7.50.1) library as a dependency.
- Added experimental Form component that uses the react-hook-form library (For dev use only)
- Added experimental Slot component for use with web components etc. (For dev use only)

#### Updated dependencies

- @stretto/cds-styles@1.5.1

## 1.5.0

### Minor Changes

#### Breaking Changes

- Modified onUploadComplete and clearAllFiles callback functions in FileContext and FileUploader component
- Refactored Toast component, added React Context API to manage state, and removed the Radix dependency
- Made minor CSS updates across various files to align with Figma BCC component library

#### New Features (Coming Soon - For dev use only)

- Added Form Component (POC for BCC Forms & Schedules Refactor)
- Added StickyFooter component (POC for BCC Forms & Schedules Refactor)

### Patch Changes

#### Updated dependencies

- @stretto/cds-styles@1.5.0

## 1.4.21

### Patch Changes

#### New Features

- Added Scrollbar to Select component
- Added a new prop to the Panel component to include an action button in the Panel header
- Made minor adjustments to Tab component styling/css

#### Updated dependencies

- @stretto/cds-styles@1.4.21

## 1.4.20

### Patch Changes

#### Bug Fixes

- Adjusted global.css styles to fix issues in BCC QA

#### Updated dependencies

- @stretto/cds-styles@1.4.20

## 1.4.19

### Patch Changes

#### Bug Fixes

- Updated CDS global.css bundle to fix conflicting CSS in BCC QA environment

#### Updated dependencies

- @stretto/cds-styles@1.4.19

## 1.4.18

### Patch Changes

#### Bug Fixes

- Removed base paragraph styles (cds-styles bundle)
- Updated .container class to .cds-container to avoid CSS conflicts (cds-styles bundle)

#### New Features

- Fixed issues with theme provider component, included story and interaction test

#### Updated dependencies

- @stretto/cds-styles@1.4.18

## 1.4.17

### Patch Changes

#### New Features

- Added modal trigger - PR https://devops.corp.stretto.com/DefaultCollection/Cadence%20Design%20System/_git/Cadence.Design.System/pullrequest/40101
- Added new Sidebar component
- Added new User Context

#### Bug Fixes

- Added fix for Accordion CSS - PR https://devops.corp.stretto.com/DefaultCollection/Cadence%20Design%20System/_git/Cadence.Design.System/pullrequest/40169
- Updated Avatar, Navbar, Accordion component apis (introduced breaking changes) and updated all related CSS
- Fixed Button CSS and removed stroke on the secondary button (when using the fill="none" prop)
- Installed current versions of zod, axios, react-hook-form - included as dependencies
- Fixed cds-gray color to reflect what's in Figma.
- Updated and fixed native Storybook components to fix type errors

#### Updated dependencies

- @stretto/cds-styles@1.4.17

## 1.4.16

### Patch Changes

- Adding modal trigger override prop
- Adjusting Accordion CSS for max-height and max-width to be dependent on content and parent sizing
  - @stretto/cds-styles@1.4.16

## 1.4.15

### Patch Changes

#### New Features

- Added an optional ref prop to the Grid component so the underlying DOM node can be referenced
- Set the color prop on the Text component to the default color so that it doesn't have to be explicitly set in every instance

#### Updated dependencies

- @stretto/cds-styles@1.4.15

## 1.4.14

### Patch Changes

#### New Features

- Updated Toast component and added interaction test in storybook
- Checked CSS on toast component to ensure there were no discrepancies called out in https://jira.stretto.com/browse/RIO-47029
- Reverted types in FileUploader that were changed in version 1.4.13 back to original structure i.e. onSelectedFileAlreadyUploaded?: (fileName: string) => void;
- Removed mock function for onSelectedFileAlreadyUploaded prop, this is now handeled by a default validation check in the FileUploader component itself, this may be no longer needed. Will check with the LN team.

#### Updated dependencies

- @stretto/cds-styles@1.4.14

## 1.4.13

### Patch Changes

#### New Features

- Included additional mock functions in FileUploader story for interaction testing

#### Updated dependencies

- @stretto/cds-styles@1.4.13

## 1.4.12

### Patch Changes

#### Bug Fixes

- Minor changes to FileUploader component to troubleshoot missing function errors in Legal Noticing

#### Updated dependencies

- @stretto/cds-styles@1.4.12

## 1.4.11

### Patch Changes

#### New Features

- Added onUploadCompleted as an optional prop to fileUploader component
- Added usage example and console log statement for testing in fileUploader story (storybook)

#### Updated dependencies

- @stretto/cds-styles@1.4.11

## 1.4.10

### Patch Changes

#### Bug Fixes

- Fixed focus state on navbar links

#### New Features

- Added weight prop to Text component for adjusting font weight and added more colors to choose from.
- Added an iconPosition prop to the button component for positioning svg icons to the left or right
- Made minor adjustments to FileUploader component, moved console logs from component file to storybook for testing props/functions

#### Updated dependencies

- @stretto/cds-styles@1.4.10

## 1.4.9

### Patch Changes

#### Bug Fixes

- Updated FileUploader component based on changes proposed in https://jira.stretto.com/browse/RIO-47184 and https://jira.stretto.com/browse/RIO-47311

#### New Features

- Added isLoading prop for button component and story in Storybook

#### Updated dependencies

- @stretto/cds-styles@1.4.9

## 1.4.8

### Patch Changes

#### Bug Fixes:

- Made additional changes to the FileUploader component to improve usage and troubleshoot issues raised in https://jira.stretto.com/browse/RIO-47311
- Fixed callback functions tied to FileUploader props in question

#### New Features

- Included robust error handling/messaging in UI
- Added additonal types to StatusMessages

#### Updated dependencies

- @stretto/cds-styles@1.4.8

## 1.4.7

### Patch Changes

#### Bug Fixes:

- Reverted optional types in FileContext to require
- Adjusted FileUploader based on suggestions in https://jira.stretto.com/browse/RIO-47311

#### Updated dependencies

- @stretto/cds-styles@1.4.7

## 1.4.6

### Patch Changes

#### Bug Fixes:

- Fixed MaxFile, MaxFileSize props used for validation that were not working as intended
- Fixed Drag and Drop functionality

#### New Features

- Added requirements found in Jira ticket https://jira.stretto.com/browse/RIO-47311
- Added additional logic to trigger error messages in the UI for a more intuitive UX

#### Updated dependencies

- @stretto/cds-styles@1.4.6

## 1.4.5

### Patch Changes

#### Internal Changes

- Modified exports for all custom hooks and HOC automation-id component

#### Updated dependencies

- @stretto/cds-styles@1.4.5

## 1.4.4

### Patch Changes

#### Bug Fixes:

- Added requirements for FileUploader listed in https://jira.stretto.com/browse/RIO-47184
- Fixed issues with Icon component (Ready for use)
- Fixed minor CSS issues in various components

#### New Features

- Added automation-id-hoc utility to test in LegalNoticing project for adding automation ids
- Included example Story for FileUploader using new props
- Included additional error handling in FileCard component

#### Updated dependencies

- @stretto/cds-styles@1.4.4

## 1.4.3

### Patch Changes

#### Bug Fixes:

- Removed display flex from panel content, causing unexpected behavior when the browser was resized.

#### Updated dependencies:

- @stretto/cds-styles@1.4.3

## 1.4.2

### Patch Changes

#### Bug Fixes:

- Deleted Unused props on FileUploader
- Fixed disabled state and CSS on FileUploader

#### New Features:

- Added onFileValidationFailure optional prop to FileUploader
- Added new enum entry to FileStatus enum type
- Added new enum type for file validation error type
- Updated Existing code for validations in FileUploader
- Rearranged stories in Storybook Sidebar Nav\

#### Updated dependencies:

- @stretto/cds-styles@1.4.2

## 1.4.1

### Patch Changes

#### Bug Fixes:

- Fixed the sort icon animation in the Table and mapped it to be controlled by the sortDirection prop
- Replaced the display "inline-flex" CSS property on panel content with "flex" and added a flexDirection prop

#### New Features:

- The Table sort icon will only appear when the isSortable prop is added to the column array and set to true
- Added a width prop to the table columns array to control individual column width

#### Internal Changes:

- Adjusted Jest config and tsconfig for ui tests

#### Updated dependencies:

- @stretto/cds-styles@1.4.1

## 1.4.0

### Minor Changes

#### Bug Fixes:

- Fixed issues and added sort functionality to Table component (possible breaking changes to API – check storybook example for implementation)
- Fixed issues and separated logic and placed into each FileUploader subcomponent (possible breaking changes to API – check storybook example for implementation)
- Fixed type size on Toast component (12px)
- Fixed CSS across various components

#### New Features:

- Addded typings across various components
- Added Accordion component and Jest tests
- Added useAutomationId function to add unique ids to any DOM element/component

### Patch Changes

- @stretto/cds-styles@1.4.0

## 1.3.0

### Minor Changes

#### Bug Fixes:

- Refactored Table component and all sub-components, fixed bugs
- Refactored File uploader and all sub-components, fixed bugs
- Fixed minor styling bugs on Table, FileUploader, ProgressBar, Modal, Panel, Tabs and all sub-components

#### New Features:

- Added useCustomTableApi hook
- Added typings to Table and FileUploader

### Patch Changes

- @stretto/cds-styles@1.3.0

## 1.2.3

### Patch Changes

#### Bug Fixes:

- Fixed JSON parsing error in TableContext.tsx

#### Updated dependencies:

- @stretto/cds-styles@1.2.3

## 1.2.2

### Patch Changes

#### Bug Fixes:

- Fixed table Zebra striping on Table component and selected row state
- Improved performance of search functionality using debounce from lodash and useMemo hook
- Moved state for row selection and local storage to TableContext.tsx file to improve performance and maintainability
- Improved table generic types to allow for more flexibility in data types
- Added automationId prop to all Table sub-components
- Increased size of search icon in SearchInput component
- Reverted all CDS typography values/tokens back to proposed changes to BCC made by design team (Figma is correct)

#### Updated dependencies:

- @stretto/cds-styles@1.2.2

## 1.2.1

### Patch Changes

- Updated storybook documentation for current build of CDS design tokens/css custom properties and developer guide
- Updated dependencies
  - @stretto/cds-styles@1.2.1

## 1.2.0

### Minor Changes

#### Bug Fixes:

- Added correct typography tokens throughout codebase to match BCC
- Applied Typography tokens to Text component
- Fixed various CSS styling issues & optimized component APIs

#### New Features:

- Added New TabGroup Component for use in LNBCC project

### Patch Changes

- Updated dependencies
  - @stretto/cds-styles@1.2.0

## 1.1.4

### Patch Changes

#### Bug Fixes:

- Fixed various CSS bugs

#### Updated dependencies:

- @stretto/cds-styles@1.1.4

## 1.1.3

### Patch Changes

#### Bug Fixes:

- Removed overflow-x property on the Panel components Content section/prop, causing unexpected ui bug

#### Updated dependencies:

- @stretto/cds-styles@1.1.3

## 1.1.2

### Patch Changes

#### Bug Fixes:

- Removed overflow-x: auto css property on Panel component, causing unexpected ui bug
- Fixed line height for small text size on Text component

#### Updated dependencies:

- @stretto/cds-styles@1.1.2

## 1.1.1

### Patch Changes

#### Bug Fixes:

- Fixed exports in the TableContext.tsx file
- Fixed exports in the FileUploadContext.tsx file
- Fixed various CSS styling issues & optimized component APIs

#### New Features:

- Added a custom automation-id react prop to all available components for automated testing

#### Updated dependencies:

- @stretto/cds-styles@1.1.1

## 1.1.0

### Minor Changes

#### Bug Fixes:

- Fixed exports in the TableContext.tsx file so the useTableContext function doesn't throw errors
- Fixed the defaultSelected prop on the Radio Button component, refactored logic, and fixed CSS styling issues
- Fixed various CSS styling issues & optimized component APIs

#### New Features:

- Added Icon component (Ready for use in next minor release - 1.2.0)

#### Updated dependencies:

- @stretto/cds-styles@1.1.0

## 1.0.6

### Patch Changes

#### Bug Fixes:

- Fixed broken paths in Storybook that static assets (fonts, images, icons) were pointing to

#### New Features:

- Added style prop to Divider component to support LN project needs
- Added Progress Bar component (Ready for use in development only)

#### Updated dependencies:

- @stretto/cds-styles@1.0.6

## 1.0.5

### Patch Changes

#### Internal Changes:

- Added staticDirs property in Main.tsx (Storybook config) for loading static assets (fonts, images, icons)

#### Bug Fixes:

- Fixed Text component props (cleared error message in storybook)

#### New Features:

- Added additional props to Toggle component to support LN project needs also changed the name to "Switch"
- Added additional types to Grid component(s) to support LN project needs
- Updated Progress Bar component (Coming Soon!)

#### Updated dependencies:

- @stretto/cds-styles@1.0.5

## 1.0.4

### Patch Changes

#### Bug Fixes:

- Fixed broken links to resources in Storybook
- Updated CSS styling on several components

#### New Features:

- Added FileUploader component to bundle (For development use only)
- Added DataTable component to bundle (For development use only)

#### Updated dependencies:

- @stretto/cds-styles@1.0.4

## 1.0.3

### Patch Changes

#### Internal:

- Separated layout components from the layout directory (All components can be found in the src/components folder).

#### Bug Fixes:

- Fixed ESLint errors in FileUploader component

#### New Features:

- Improved Avatar component API
- Added stricter typings to FileUploader component
- Added controls in FileUploader storybook instance

#### Updated dependencies:

- @stretto/cds-styles@1.0.3

## 1.0.2

### Patch Changes

#### Bug Fixes:

- Fixed bug found in Storybook causing it not to render or build

#### Internal:

- Modified scripts in root package.json

#### Updated dependencies:

- @stretto/cds-styles@1.0.2

## 1.0.1

### Patch Changes

#### New Features:

- Added new grid functionality and new component features

#### Updated dependencies:

- @stretto/cds-styles@1.0.1

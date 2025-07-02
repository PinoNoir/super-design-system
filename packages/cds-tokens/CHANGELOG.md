# @stretto/cds-tokens

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

## 8.2.0

### Minor Changes

- - Updates to theme tokens for various components
  - Added and improved unit tests for several components to improve code coverage
  - Fixed CSS issues for various components

## 8.1.0

### Minor Changes

- - Added multiselect functionality to Select component
  - Added themes for BCC and TSC for the Select component
  - Updated Accordion component sematic strus=ture to improve accessibility
  - Updated all components that used react context to use default exports
  - Modified global color tokens to improve naming conventions
  - Fixed minor code smells across codebase
  - Improved test coverage for various components

## 8.0.1

### Patch Changes

- - Added new component level design token values for multiple components for use with BCC and TSC themes
  - Added a new `tsc-legacy` theme for CDS react components
  - Updated several CSS files to fix minor UI issues
  - Converted several component vanilla-extract CSS files to standard CSS Modules
  - Updated dependencies for various packages
  - General file cleanup and organization

## 8.0.0

### Major Changes

- - Added new global and theme design tokens for all applications
  - Updated import paths for all CSS files
  - Updated sorting functionality on the Table component (Potential fix for RIO-59011)
  - Updated Tooltip component CSS to use new theme token values (CSS module)
  - Modified cds-ui build output to support commonjs and esm formats
  - General dependency updates and file maintenance

## 7.0.1

### Patch Changes

- - Fixed broken automation-id attribute on the Table component
  - Updated the id prop on data table row interface as optional
  - Removed unnecessary console log statements

## 7.0.0

### Major Changes

- - Updated useDataSearch hook to include the handleClear function (Should fix RIO-58478 and RIO-58626)
  - Updated useDataSort hoo to improve sorting logic (Should fix RIO-59011)
  - Updated Table component row selection functionality (Should fix RIO-58745)

## 6.2.0

### Minor Changes

- - Updated Table component to fix issues with row selection.
  - Removed local storage from the useCustomTableApi hook.
  - Updated Table context to fix issues with ids being added on row selection

## 6.1.0

### Minor Changes

- - Added Card component (Please check Storybook for usage and examples)
  - Updated Table component to allow updating state through the data prop (Included example in Storybook)
  - Fixed minor stling discrepancies
  - Minor file cleanup/maintenance

## 6.0.0

### Major Changes

- - Added new ServerPagination component to handle server side pagination for the CDS table
  - Added new input fields that handle formatting for phone numbers, SSN, emails
  - Updated form component with new props and parameters for customization
  - Updated CSS accross various components to fix minor issues in the LN application

## 5.2.3

### Patch Changes

- - Updated Table component CSS to address responsive issues in LN project
  - Added new minSearchThreshhold prop to Search component

## 5.2.2

### Patch Changes

- - Removed CSS affecting number input fields in BCC V1 application

## 5.2.1

### Patch Changes

- Merged PR 45673: RIO-57982 fix problem with react-image-crop

  - Updated Stroybook version to 8.3.3

## 5.2.0

### Minor Changes

- - Added an image crop modal powered by the react-image-crop library for use with the FileUploader component
  - Merged PR 45561: RIO-57535 update FileUploader and useFileValidation (Big thanks to Marcin Sochacki!)
  - Updated the isLoading state on Button component, improved component structure
  - Added styling and more variants to ToggleButton component
  - Updated lineheight values to match Figma V2 component library
  - General maintenance and file cleanup

## 5.1.0

### Minor Changes

- - Modified ProgressBar component and added an additional stopAnimation prop to control animation
  - Modified the FileUploader component context and added additional properties to handle file tracking and adding files to context upon selection
  - Adjusted global CSS for scrollbars to revert them back to browser defaults (fixes RIO-55971)
  - Made minor adjustments to CSS for various components

## 5.0.1

### Patch Changes

- Added logic to useDataSort hook to handle date sorting in the data table component
  Added a new hook useDragAndDrop to handle drag and drop functionality and encapsulate logic
  Added tests for TablePagination and TableRows components
  Removed dynamically generated automation-id from all components so that it can be manually set

## 5.0.0

### Major Changes

- - Refactored the FileUploader component (Added new state, separated logic into hooks, and created new Subcomponents to improve flexibility)

## 4.1.3

### Patch Changes

- - Styling updates for Table and Select components

## 4.1.2

### Patch Changes

- - Fixed React key warning in TableRows
  - Fixed Checkbox rendering issue

## 4.1.1

### Patch Changes

- - Fixed code smells across the project

## 4.1.0

### Minor Changes

- - Updated primary button color from teal50 to teal70 to adhere to accessibility standards
  - Added Combobox component (Unit tested)
  - Added ButtonToggle component (Unit tested)
  - Updated CSS on various components to fix minor issues
  - Fixed code smells found in SonarQube

## 4.0.5

### Patch Changes

- - Fixed various code smells across project

## 4.0.4

### Patch Changes

- - Removed the react-focus-trap dependency dependency causing errors when rendering the Dropdown and Select components

## 4.0.3

### Patch Changes

- - Updated Select component and removed Context Api (Added unnecessary complexity and caused issues with default exports)

## 4.0.2

### Patch Changes

- - Partially fixed code smells found in SonarQube
  - Removed unused imports across all files
  - Adjusted render function on the Select Component

## 4.0.1

### Patch Changes

- - Updated default exports for the Select component and sub components (Fixes import errors in external dev environments)

## 4.0.0

### Major Changes

- - Refactored Dropdown component and added new sub components and features (Introduces breaking changes)
  - Refactored Select component and added new sub components and features (Also fixes RIO-52821 UI bug)
  - Updated RadioButtonGroup to map missing union type to valueSelected prop
  - Fixed styling issue with the Button component and cleaned up CSS file
  - Updated Section Alert component to fix a minor styling issue in LN project
  - Added the IconButton component for use in development (Also added unit test)
  - Updated CSS on various components
  - Updated general CDS documentation (Will update component docs next, where needed, for next release)
  - Internal updates to packages
  - Upgraded Storybook to latest version

## 3.5.0

### Minor Changes

- - Updated Search component to fix isExpanded props and styling, added additional storybook examples (Does not introduce breaking changes).
  - Fixed Styling on Select component when an Item is selected
  - Updated Breadcrumb component and removed react router dependency, added styling, and unit test
  - Added EmptyState component and unit test
  - Fixed styling on various components

## 3.4.0

### Minor Changes

- - Added New Form component with FormBlock, FormFooter subcomponents + unit tests
  - Updated Select and TextInput component CSS
  - Added a union type for radio-buttons and checkboxes to accept strings or numbers for all value props
  - Internal updates and maintenance

## 3.3.2

### Patch Changes

- Updated Table pagination CSS to fix alignment issues
  Minor adjustment to the clearAllFiles function typing in the FileContext (fixes a type error in the LN project)

## 3.3.1

### Patch Changes

- - Minor CSS styling updates

## 3.3.0

### Minor Changes

- - Updated Select and MenuItem component to use the same value prop types
  - Fixed Select component CSS
  - Added the required prop to the useNormalizedInputProps utility function
  - Added unit tests
  - Internal updates to storybook and removed unnecessary addons causing build issues

## 3.2.0

### Minor Changes

- - Added the number type to the RadioButton component
  - Removed console.log statement from the RadioButtonGroup component

## 3.1.0

### Minor Changes

- - Updated RadioButtonGroup/RadioButton and fixed firefox rendering issues (Fixed CSS issue on psuedo-element in firefox)
  - Added unit test for RadioButtonGroup and RadioButton components
  - Added rough draft of IconButton component, still needs to be properly setup for vanilla-extract variants (Not for use in production)
  - Began fleshing out the NavBar component, adding state management and creating subcomponents (Not for use in production)
  - Updated Select & MenuItem component types and removed generics (Added unnecessary complexity)
  - Fixed splitbutton CSS specificity issues
  - Updated stories and added more implementation examples for various components
  - General maintenance/file cleanup

## 3.0.1

### Patch Changes

- - Added disableOnOverlayClick prop to Modal component for preventing closing the modal when clicking outside of it
  - Minor CSS adjustments to Modal, Dialog, Popvoer
  - Internal
    - Added Storybook Visual Tests addon for Chromatic

## 3.0.0

### Major Changes

- - Fixed CSS issues with the Checkbox component
  - Adjusted z-index of modal overlay to prevent stacking issues when dialogs appear above the modal

## 2.4.8

### Patch Changes

- - Added parameters to the Toast component to control duration and open state

## 2.4.7

### Patch Changes

- - Added more paramertes to the Modal component for customization
  - Adjusted spacing of radio button when stacked vertically

## 2.4.6

### Patch Changes

- - Removed internal logic from FileUploader causing conflicts (onUpload will be handled externally)
  - CSS updates to Dialog, Modal, and DataTable
  - Updated Storybook Coming Soon section to Experimental

## 2.4.5

### Patch Changes

- - Added CSS styling to table component
  - Removed complex logic tied to the fileUploader component (Building file data will now be handled outside of CDS).

## 2.4.4

### Patch Changes

- Added the ability to attach a ref to the Accordion and AccordionItem components
  Added automation-id's to all Dropdown Menu sub components for testing purposes
  Added styling to Table, TextArea, and Select components
  Added additional props to ButtonConfig Interface on the Modal component for controlling disabled state etc.

## 2.4.3

### Patch Changes

- - Added the ability to optionally specify whether a dialog has a delete action, setting prop to true will render a delete button with correct styling.
  - Included some additional CSS classes to the Table component.

## 2.4.2

### Patch Changes

- - Updated Data Table, Select, and Radio Button CSS styling to account for responsive resizing.
  - Added singleButton prop to Dialog to conditionally render single buttons.

## 2.4.1

### Patch Changes

- - Added style variants and disabled state to SplitButton component
  - Included TextArea component in bundle (Ready for dev use - still needs to be unit tested)

## 2.4.0

### Minor Changes

- - Refactored Modal component and removed Radix dependency.
  - Added Dialog component to cds-ui bundle.
  - Added draggable rows to the Table component.
  - Fixed issues with custom hooks used for sorting and searching on table/list data.
  - Added unit test for Breadcrumb, Modal, and Dialog components (Ready for use).
  - Updated custom hook documentation is Storybook (Still needs to be standardized and cleaned up).

## 2.3.0

### Minor Changes

- Updates to FileUploader component that overhaul it's implementation, please refer to docs for more information - Updated Accordion component CSSto add a white background for the content section when darkmode is enabled to match BCC current styling

## 2.2.6

### Patch Changes

- Updated the FileUploader to handle fetch requests from an endpoint. Also added z-index value for the Select Menu to prevent stacking issues when used with other components.

## 2.2.5

### Patch Changes

- Updated internal logic of the FileUploader component, modifying the way it handles uploading files to a server and showing progress of the upload

## 2.2.4

### Patch Changes

- Updates and Improvements to the FileUploader and FileCard components

## 2.2.3

### Patch Changes

- - Removed the simulate progress callback function from being called in the FileUploader component - Added a sorybook implementation to show as an example of how to simulate the progress of the file uploading

## 2.2.2

### Patch Changes

- - Adjusted progress bar animation in the FileUploader component when a file is being uploaded

## 2.2.1

### Patch Changes

- - Set FileContextProvider config prop as optional

## 2.2.0

### Minor Changes

- - Added new Chip component (for different uses cases including filters)
  - Added new CSS style properties to Table component
  - Added new SplitButton component (BCC Primary styling only, will add more variants in the future)
  - Added new Drawer component
  - Updated FileUploader to handle endpoint configuration
  - Added documentation for custom hooks provided in CDS
  - Internal updates to dependencies, sorybook config to handle mock requests, etc.

## 2.1.8

### Patch Changes

- - Fixed Select component CSS and popper placement when open

## 2.1.7

### Patch Changes

- - Modified Type generics on Table components that cause unnecessary contraints
  - Added button controls on TablePagination component that allows users to got to first and last page respectively

## 2.1.6

### Patch Changes

- - Added a onRowSelect callback function that can be used for selecting table rows
  - Fixed React Key warning on Select component
  - Separated data Sorting logic into its own custom useDataSort hook (Thanks Legal Noticing team!)
  - Separated data Search logic into its own custom useDataSearch hook
  - Fixed logic for selecting single and multiple rows in the Table component, which can be controlled with the multipleSelect boolean prop
  - Updated CSS for Table Buttons to match LN Mockups

## 2.1.5

### Patch Changes

- Updated Select component API to meet requirements for the Legal Noticing project

## 2.1.4

### Patch Changes

- Updated Select component prop types and signatures to remain flexible, but remove complexity of implementation

## 2.1.3

### Patch Changes

- Updates to custom Table Component logic for single and multiple row selection

## 2.1.2

### Patch Changes

- - Updated custom Table Components for selecting single or multiple rows
  - Updated Select component typings and Aria roles to improve accessibility
  - Updated FileUploader to expose clearAllFiles callback function in the FileContext only (for better control over when it's called)

## 2.1.1

### Patch Changes

- Updated table selection components to add more flexibility, Updated FileContext ClearAllFiles Function to remove uploaded files from context

## 2.1.0

### Minor Changes

- New Features:

  - Select Component:

    - Added Typescript generic props for developers to customize values the component can accept
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
  - Currency Input - Added a custom currency input to handle decimal values (Thanks TSC team!)
  - Added enableMenuContainer boolean prop on Accordions and FileCard components (Thanks Leon A!)
  - Refactored Avatar component and added unit test
  - Updated CSS on various components

## 2.0.0

### Major Changes

- Breaking Changes

  The labelText prop on the Search, TextInput, RadioButton, and Checkbox components has been changed to label.
  Checkbox component has been refactored, the RadixUI dependency has been removed, and props/typings have been improved.
  Select component has been refactored, the RadixUI dependency has been removed, and props/typings have been improved
  Menu Item for the Select component has been added for better customization and control, renders as an HTMLLIElement

  Bug Fixes

  RadioButtonGroup component orientation prop has been fixed and Radio buttons can now be stacked vertically.

  New Features

  Various CSS updates to components
  Added experimental components (For use in development): Form, FormBlock, TextArea, WorkflowModal, Portal, FilterBar, AsyncComponent (For loading data),
  Popover Component can now be displayed with any type of trigger, before it could only be displayed with buttons

## 1.5.6

### Patch Changes

- - Reverted the Toast component back to the original implmentation based on requirements in the BCC Legal Noticing project
  - Fixed CSS issues with Section Alert component

## 1.5.5

### Patch Changes

- - Updated and simplified the implementation of the Toast component

## 1.5.4

### Patch Changes

- Added style={{ overflowY: undefined }} to the select component to remove React development error
  Modified CSS of the Select component for disabled states

## 1.5.3

### Patch Changes

- Internal Changes
  Removed @storybook/test from dependencies and added to dev dependencies (Caused issues in LN project)
  Updated Storybook to version 8.0.2

## 1.5.2

### Patch Changes

- Bug Fixes
  Updates to FileUploader Context (For LN project support)
  Updates to Toast useToastContext hook
  Added Modal BUtton Updates from PR !40657
  CSS updates to various components

  Internal Changes
  Upgraded to Storybook 8.0.1

## 1.5.1

### Patch Changes

- - Removed panelContent prop on the Panel component. Panel content can now be specified as children. i.e. <Panel>{Panel content now goes here.}</Panel>
  - Updated Modal component's Trigger prop, this is now more flexible, so any type of visual trigger can be used to open the modal, i.e. button, icon, etc.
  - Action buttons are now wrapped with RADIX Dialog.Close composite component. This triggers the onclick action of the button, then the close action.
  - Added required prop to TextInput component and styles. This can now be used to specify fields that are required in a form, etc.
  - Added react-hook-form (v7.50.1) library as a dependency.
  - Added experimental Form component that uses the react-hook-form library (For dev use only)
  - Added experimental Slot component for use with web components etc. (For dev use only)

## 1.5.0

### Minor Changes

- Modified onUploadComplete and clearAllFiles callback functions in FileContext and FileUploader component
  Refactored Toast component, added React Context API to manage state, and removed the Radix dependency

## 1.4.21

### Patch Changes

- - Added Scrollbar to Select component
  - Added a new prop to the Panel component to include an action button in the Panel header
  - Made minor adjustments to Tab component styling/css

## 1.4.20

### Patch Changes

- - Adjusted global.css styles to fix issues in BCC QA

## 1.4.19

### Patch Changes

- Updated CDS global.css bundle to fix conflicting CSS in BCC QA environment

## 1.4.18

### Patch Changes

- - Removed base paragraph styles (cds-scss bundle)
  - Updated .container class to .cds-container to avoid CSS conflicts (cds-scss bundle)
  - Added flyout-panel React component
  - Fixed issues with theme provider component, included story and interaction test

## 1.4.17

### Patch Changes

- - Updated modal trigger - PR https://devops.corp.stretto.com/DefaultCollection/Cadence%20Design%20System/_git/Cadence.Design.System/pullrequest/40101
  - Added new Sidebar component
  - Added new User Context
  - Updated Avatar, Navbar, Accordion component apis (introduced breaking changes)
  - Updated all related CSS
  - Fixed Button CSS and removed stroke on the secondary button (when using the fill="none" prop)
  - Installed current versions of zod, axios, react-hook-form - included as dependencies
  - Fixed cds-gray color to reflect what's in Figma.
  - Updated and fixed native Storybook components to fix type errors

## 1.4.16

## 1.4.15

### Patch Changes

- - Added an optional ref prop to the Grid component so the underlying DOM node can be referenced
  - Set the color prop on the Text component to the default color so that it doesn't have to be explicitly set in every instance

## 1.4.14

### Patch Changes

- - Updated Toast component and added interaction test in storybook
  - Checked CSS on toast component to ensure there were no discrepancies called out in https://jira.stretto.com/browse/RIO-47029
  - Reverted types in FileUploader that were changed in version 1.4.13 back to original structure i.e. onSelectedFileAlreadyUploaded?: (fileName: string) => void;
  - Removed mock function for onSelectedFileAlreadyUploaded prop, this is now handeled by a default validation check in the FileUploader component itself, this may be no longer needed. Will check with the LN team.

## 1.4.13

### Patch Changes

- - Included additional mock functions in FileUploader story for interaction testing

## 1.4.12

### Patch Changes

- - Minor changes to FileUploader component to troubleshoot missing function errors in Legal Noticing

## 1.4.11

### Patch Changes

- Added onUploadCompleted as an optional prop to fileUploader component
  Added usage example and console log statement for testing in fileUploader story (storybook)

## 1.4.10

### Patch Changes

- - Fixed focus state on navbar links
  - Added weight prop to Text component for adjusting font weight and added more colors to choose from.
  - Added an iconPosition prop to the button component for positioning svg icons to the left or right
  - Made minor adjustments to FileUploader component, moved console logs from component file to storybook for testing props/functions

## 1.4.9

### Patch Changes

- Updated FileUploader component based on changes proposed in https://jira.stretto.com/browse/RIO-47184 and https://jira.stretto.com/browse/RIO-47311
  Added isLoading prop for button component and story in Storybook

## 1.4.8

### Patch Changes

- - Made additional changes to the FileUploader component to improve usage and troubleshoot issues raised in https://jira.stretto.com/browse/RIO-47311
  - Included robust error handling/messaging in UI
  - Fixed callback functions tied to FileUploader props in question
  - Added additonal types to StatusMessages

## 1.4.7

### Patch Changes

- - Reverted optional types in FileContext to required
  - Adjusted FileUploader based on suggestions in https://jira.stretto.com/browse/RIO-47311

## 1.4.6

### Patch Changes

- Added requirements found in Jira ticket https://jira.stretto.com/browse/RIO-47311
  Added additional logic to trigger error messages in the UI
  Fixed MaxFile, MaxFileSize props used for validation that were not working as intended
  Fixed Drag and Drop functionality

## 1.4.5

### Patch Changes

- - Modified exports for all custom hooks and HOC automation-id component

## 1.4.4

### Patch Changes

- - Added requirements for FileUploader listed in https://jira.stretto.com/browse/RIO-47184
  - Included example Story for FileUploader using new props
  - Included additional error handling in FileCard component
  - Fixed issues with Icon component (Ready for use)
  - Added automation-id-hoc utility to test in LegalNoticing project for adding automation ids
  - Fixed minor CSS issues in varios components

## 1.4.3

## 1.4.2

### Patch Changes

- - Added onFileValidationFailure optional prop to FileUploader
  - Added new enum entry to FileStatus enum type
  - Added new enum type for file validation error type
  - Updated Existing code for validations in FileUploader
  - Deleted Unused props on FileUploader
  - Fixed disabled state and CSS on FileUploader
  - Rearranged stories in Storybook Sidebar Nav

## 1.4.1

### Patch Changes

- - Fixed the sort icon animation in the Table and mapped it to be controlled by the sortDirection prop
  - The Table sort icon will only appear when the isSortable prop is added to the column array and set to true
  - Added a width prop to the table columns array to control individual column width
  - Replaced the display "inline-flex" CSS property on panel content with "flex" and added a flexDirection prop
  - Adjusted Jest config and tsconfig for ui tests

## 1.4.0

### Minor Changes

- Fixed issues and added sort functionality to Table component (possible breaking changes to API – check storybook example for implementation)
  Fixed issues and separated logic and placed into each FileUploader subcomponent (possible breaking changes to API – check storybook example for implementation)
  Fixed type size on Toast component (12px)
  Fixed CSS across various components

  Addded typings across various components
  Added Accordion component and Jest tests
  Added useAutomationId function to add unique ids to any DOM element/component

## 1.3.0

## 1.2.3

## 1.2.2

### Patch Changes

- Fixed table Zebra striping on Table component and selected row state
  Improved performance of search functionality using debounce from lodash and useMemo hook
  Moved state for row selection and local storage to TableContext.tsx file to improve performance and maintainability
  Improved table generic types to allow for more flexibility in data types
  Added automationId prop to all Table sub-components
  Increased size of search icon in SearchInput component
  Reverted all CDS typography values/tokens back to proposed changes to BCC made by design team (Figma is correct)

## 1.2.1

### Patch Changes

- Updated storybook documentation for cureent build of CDS design tokens/css custom properties and developer guide

## 1.2.0

### Minor Changes

- Added correct typography tokens throughout codebase to match BCC
  Applied Typography tokens to Text component
  Added New TabGroup Component for use in LNBCC project

  Fixed various minor styling issues

## 1.1.4

### Patch Changes

- ff028b8: Fixed various CSS bugs

## 1.1.3

## 1.1.2

### Patch Changes

- 5a2fa93: Removed overflow-x: auto css property on Panel component, causing unexpected ui bug

## 1.1.1

### Patch Changes

- - Fixed exports in the TableContext.tsx file
  - Fixed exports in the FileUploadContext.tsx file
  - Fixed various CSS styling issues & optimized component APIs

## 1.1.0

### Minor Changes

- - Fixed exports in TableContext.tsx file so that it can be used without issues
  - Fixed the defaultSelected prop on the radio component, refactored logic, and fixed CSS styling issues
  - Added Icon component (Ready for use in next minor release)

## 1.0.6

## 1.0.5

## 1.0.4

## 1.0.3

### Patch Changes

- Internal: - Separated layout components from the layout directory (All components can be found in the src/components folder).

  Bug Fixes: - Fixed ESLint errors in FileUploader component

  New Features: - Improved Avatar component API - Added stricter typings to FileUploader component - Added controls in FileUploader storybook instance

## 1.0.2

### Patch Changes

- - Fixed bug found in Storybook causing it not to render or build
  - Modified scripts in root package.json\

## 1.0.1

### Patch Changes

- Added new grid functionality and new component features

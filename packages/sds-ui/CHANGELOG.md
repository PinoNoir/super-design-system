# sds-ui

## 2.1.0

### Minor Changes

- ed71c87: Rebuild `TextInput` on a new, typed `useFieldStatus` hook, replacing the untyped `useNormalizedInputProps` + `textInputProps` indirection it previously depended on.
  - Fixed a real accessibility gap: `aria-describedby` on the input previously only ever pointed at helper text, never at the invalid/warn/success validation message, so a screen reader user focusing an invalid field never heard the error - only saw it. It now points at whichever combination of status message and helper text is actually rendered.
  - Removed `formatType`, `customFormat`, `register`, `rules`, and `path` from `TextInputProps`. None of these ever did anything at runtime in `TextInput` (they were destructured and silently discarded, or - in `path`'s case - spread onto the native `<input>` as a meaningless DOM attribute), so no working behavior changes, but this is a type-level removal: if you referenced these fields on `TextInputProps` directly, update your usage.
  - Removed the `title` attribute previously set to match `placeholder` on every input, which gave every field a native tooltip repeating its own placeholder text.
  - Simplified internal character-count tracking: it's now derived directly from `value` for controlled inputs instead of being duplicated in local state.

### Patch Changes

- @pinonoir/sds-styles@2.1.0

## 2.0.1

### Patch Changes

- Fix focus trapping and ARIA attributes in `Modal`, `Dialog`, and `WorkflowModal`. `Dialog` now properly invokes native `showModal()`/`close()` instead of only toggling the `open` attribute (so it's actually removed from the accessibility tree and tab order while open, matching its `aria-modal="true"`), all three components now correctly trap and restore keyboard focus on open/close, and several dangling or incorrect ARIA attribute references have been corrected.

  Fix several component bugs uncovered while resolving a large ESLint cleanup:
  - `Sidebar`'s `headerClassName` prop is now applied to the header element (previously silently dropped)
  - `EmptyState`'s default illustration now renders the correct icon (note: if you rely on the default `illustration` value, the rendered icon for the `'empty-data'` case has visibly changed from `AlertIcon` to `EmptyInboxIcon`)
  - `Search` now forwards passthrough props to the underlying `<input>`
  - `Select` now respects a caller-supplied `id` instead of always generating its own
  - `Toast` now respects its `icon` override prop and applies a caller's `className` to its close button
  - A date/time formatting utility now respects its `format24Hour` argument instead of always formatting as 24-hour

  Fix a case-sensitivity bug in an `sds-styles` SCSS partial (`@forward 'zIndex'` vs. the actual `_zindex.scss` file) that broke builds on case-sensitive filesystems.

- Updated dependencies
  - @pinonoir/sds-styles@2.0.1

## 2.0.0

### Major Changes

- Initial version of all super design system related packages

### Patch Changes

- Updated dependencies
  - sds-styles@2.0.0

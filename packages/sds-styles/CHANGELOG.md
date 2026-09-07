# sds-styles

## 2.0.1

### Patch Changes

- Fix focus trapping and ARIA attributes in `Modal`, `Dialog`, and `WorkflowModal`. `Dialog` now properly invokes native `showModal()`/`close()` instead of only toggling the `open` attribute (so it's actually removed from the accessibility tree and tab order while open, matching its `aria-modal="true"`), all three components now correctly trap and restore keyboard focus on open/close, and several dangling or incorrect ARIA attribute references have been corrected.

  Fix several component bugs uncovered while resolving a large ESLint cleanup:
  - `Sidebar`'s `headerClassName` prop is now applied to the header element (previously silently dropped)
  - `EmptyState`'s default illustration now renders the correct icon
  - `Search` now forwards passthrough props to the underlying `<input>`
  - `Select` now respects a caller-supplied `id` instead of always generating its own
  - `Toast` now respects its `icon` override prop and applies a caller's `className` to its close button
  - A date/time formatting utility now respects its `format24Hour` argument instead of always formatting as 24-hour

  Fix a case-sensitivity bug in an `sds-styles` SCSS partial (`@forward 'zIndex'` vs. the actual `_zindex.scss` file) that broke builds on case-sensitive filesystems.
  - @pinonoir/sds-tokens@2.0.1

## 2.0.0

### Major Changes

- Initial version of all super design system related packages

### Patch Changes

- Updated dependencies
  - sds-tokens@2.0.0

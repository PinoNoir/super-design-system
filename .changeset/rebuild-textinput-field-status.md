---
"@pinonoir/sds-ui": minor
---

Rebuild `TextInput` on a new, typed `useFieldStatus` hook, replacing the untyped `useNormalizedInputProps` + `textInputProps` indirection it previously depended on.

- Fixed a real accessibility gap: `aria-describedby` on the input previously only ever pointed at helper text, never at the invalid/warn/success validation message, so a screen reader user focusing an invalid field never heard the error - only saw it. It now points at whichever combination of status message and helper text is actually rendered.
- Removed `formatType`, `customFormat`, `register`, `rules`, and `path` from `TextInputProps`. None of these ever did anything at runtime in `TextInput` (they were destructured and silently discarded, or - in `path`'s case - spread onto the native `<input>` as a meaningless DOM attribute), so no working behavior changes, but this is a type-level removal: if you referenced these fields on `TextInputProps` directly, update your usage.
- Removed the `title` attribute previously set to match `placeholder` on every input, which gave every field a native tooltip repeating its own placeholder text.
- Simplified internal character-count tracking: it's now derived directly from `value` for controlled inputs instead of being duplicated in local state.

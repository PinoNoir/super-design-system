import { renderHook } from '@testing-library/react';
import useFieldStatus from '../useFieldStatus';

describe('useFieldStatus Hook', () => {
  it('returns no status and generated ids by default', () => {
    const { result } = renderHook(() => useFieldStatus({ id: 'field' }));

    expect(result.current.status).toBeNull();
    expect(result.current.invalid).toBe(false);
    expect(result.current.warn).toBe(false);
    expect(result.current.success).toBe(false);
    expect(result.current.disabled).toBe(false);
    expect(result.current.required).toBe(false);
    expect(result.current.StatusIcon).toBeNull();
    expect(result.current.invalidId).toBe('field-error-msg');
    expect(result.current.warnId).toBe('field-warn-msg');
    expect(result.current.successId).toBe('field-success-msg');
    expect(result.current.helperId).toBe('field-helper-text');
  });

  it('reports invalid status and its icon when invalid is true', () => {
    const { result } = renderHook(() => useFieldStatus({ id: 'field', invalid: true }));

    expect(result.current.status).toBe('invalid');
    expect(result.current.invalid).toBe(true);
    expect(result.current.StatusIcon).not.toBeNull();
  });

  it('prioritizes invalid over warn when both are true', () => {
    const { result } = renderHook(() => useFieldStatus({ id: 'field', invalid: true, warn: true }));

    expect(result.current.status).toBe('invalid');
    expect(result.current.invalid).toBe(true);
    expect(result.current.warn).toBe(false);
  });

  it('prioritizes warn over success when both are true', () => {
    const { result } = renderHook(() => useFieldStatus({ id: 'field', warn: true, success: true }));

    expect(result.current.status).toBe('warn');
    expect(result.current.warn).toBe(true);
    expect(result.current.success).toBe(false);
  });

  it('reports success status only when nothing else is active', () => {
    const { result } = renderHook(() => useFieldStatus({ id: 'field', success: true }));

    expect(result.current.status).toBe('success');
    expect(result.current.success).toBe(true);
  });

  it('readOnly suppresses disabled, invalid, warn, and success entirely', () => {
    const { result } = renderHook(() =>
      useFieldStatus({ id: 'field', readOnly: true, disabled: true, invalid: true, warn: true, success: true }),
    );

    expect(result.current.status).toBeNull();
    expect(result.current.disabled).toBe(false);
    expect(result.current.invalid).toBe(false);
    expect(result.current.warn).toBe(false);
    expect(result.current.success).toBe(false);
  });

  it('passes through disabled and required independently of status', () => {
    const { result } = renderHook(() => useFieldStatus({ id: 'field', disabled: true, required: true }));

    expect(result.current.disabled).toBe(true);
    expect(result.current.required).toBe(true);
    expect(result.current.status).toBeNull();
  });

  it('returns a stable result when inputs do not change', () => {
    const { result, rerender } = renderHook((props) => useFieldStatus(props), {
      initialProps: { id: 'field', invalid: true },
    });

    const first = result.current;
    rerender({ id: 'field', invalid: true });

    expect(result.current).toBe(first);
  });
});

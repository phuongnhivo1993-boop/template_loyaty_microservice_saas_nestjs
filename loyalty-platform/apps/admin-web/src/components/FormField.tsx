'use client';
import { ReactNode } from 'react';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1',
  borderRadius: '6px', fontSize: '14px', outline: 'none',
  transition: 'border-color 0.15s',
};
const inputFocusStyle: React.CSSProperties = { borderColor: '#2563eb', boxShadow: '0 0 0 2px rgba(37,99,235,0.1)' };
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px', color: '#1e293b' };
const errorStyle: React.CSSProperties = { color: '#dc2626', fontSize: '12px', marginTop: '4px' };
const requiredStar: React.CSSProperties = { color: '#dc2626', marginLeft: '2px' };

interface FormInputProps {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; type?: string; placeholder?: string; error?: string; disabled?: boolean;
  minLength?: number; maxLength?: number; helpText?: string;
}

export function FormInput({ label, value, onChange, required, type = 'text', placeholder, error, disabled, minLength, maxLength, helpText }: FormInputProps) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>
        {label}{required && <span style={requiredStar}>*</span>}
      </label>
      <input
        type={type} value={value} disabled={disabled}
        onChange={e => onChange(e.target.value)}
        required={required} placeholder={placeholder}
        minLength={minLength} maxLength={maxLength}
        style={{
          ...inputStyle,
          ...(error ? { borderColor: '#dc2626' } : {}),
          ...(disabled ? { background: '#f1f5f9', cursor: 'not-allowed' } : {}),
        }}
        onFocus={e => { if (!error) e.target.style.borderColor = inputFocusStyle.borderColor as string; }}
        onBlur={e => { if (!error) e.target.style.borderColor = '#cbd5e1'; }}
      />
      {error && <div style={errorStyle}>{error}</div>}
      {helpText && <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '12px', marginTop: '4px' }}>{helpText}</div>}
    </div>
  );
}

interface FormSelectProps {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean; placeholder?: string; error?: string; disabled?: boolean; helpText?: string;
}

export function FormSelect({ label, value, onChange, options, required, placeholder, error, disabled, helpText }: FormSelectProps) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>
        {label}{required && <span style={requiredStar}>*</span>}
      </label>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        required={required} disabled={disabled}
        style={{
          ...inputStyle,
          ...(error ? { borderColor: '#dc2626' } : {}),
          ...(disabled ? { background: '#f1f5f9', cursor: 'not-allowed' } : {}),
          background: 'white',
        }}
        onFocus={e => { if (!error) e.target.style.borderColor = inputFocusStyle.borderColor as string; }}
        onBlur={e => { if (!error) e.target.style.borderColor = '#cbd5e1'; }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      {error && <div style={errorStyle}>{error}</div>}
      {helpText && <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '12px', marginTop: '4px' }}>{helpText}</div>}
    </div>
  );
}

interface FormTextareaProps {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; placeholder?: string; error?: string; rows?: number; disabled?: boolean; helpText?: string;
}

export function FormTextarea({ label, value, onChange, required, placeholder, error, rows = 3, disabled, helpText }: FormTextareaProps) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>
        {label}{required && <span style={requiredStar}>*</span>}
      </label>
      <textarea
        value={value} onChange={e => onChange(e.target.value)}
        required={required} placeholder={placeholder}
        rows={rows} disabled={disabled}
        style={{
          ...inputStyle,
          ...(error ? { borderColor: '#dc2626' } : {}),
          ...(disabled ? { background: '#f1f5f9', cursor: 'not-allowed' } : {}),
          resize: 'vertical',
        }}
        onFocus={e => { if (!error) e.target.style.borderColor = inputFocusStyle.borderColor as string; }}
        onBlur={e => { if (!error) e.target.style.borderColor = '#cbd5e1'; }}
      />
      {error && <div style={errorStyle}>{error}</div>}
      {helpText && <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '12px', marginTop: '4px' }}>{helpText}</div>}
    </div>
  );
}

interface FormActionsProps {
  onCancel: () => void; loading?: boolean; submitLabel?: string; cancelLabel?: string;
}

export function FormActions({ onCancel, loading, submitLabel = 'Save', cancelLabel = 'Cancel' }: FormActionsProps) {
  return (
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
      <button type="button" onClick={onCancel} disabled={loading}
        style={{
          padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px',
          background: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px',
          opacity: loading ? 0.6 : 1,
        }}>
        {cancelLabel}
      </button>
      <button type="submit" disabled={loading}
        style={{
          padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none',
          borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600,
          fontSize: '14px', opacity: loading ? 0.6 : 1,
        }}>
        {loading ? 'Saving...' : submitLabel}
      </button>
    </div>
  );
}

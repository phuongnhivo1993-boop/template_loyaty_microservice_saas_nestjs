export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  patternMessage?: string;
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [field: string]: ValidationRule;
}

export function validateField(value: any, rules: ValidationRule): string | null {
  if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return 'This field is required';
  }
  if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
    return `Minimum ${rules.minLength} characters`;
  }
  if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
    return `Maximum ${rules.maxLength} characters`;
  }
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return rules.patternMessage || 'Invalid format';
  }
  if (rules.custom) {
    return rules.custom(value);
  }
  return null;
}

export function validateForm(data: Record<string, any>, schema: ValidationSchema): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const [field, rules] of Object.entries(schema)) {
    const error = validateField(data[field], rules);
    if (error) errors[field] = error;
  }
  return errors;
}

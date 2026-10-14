/**
 * Universal Form Validation Utilities for HARI HARA Jewellery Works
 */

/**
 * Validates Indian or international phone numbers.
 * Strips formatting, ensures at least 10 digits, and if 10 digits, starts with valid mobile prefix (6-9).
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return 'Phone number is required.';
  }
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  if (!/^\d+$/.test(cleaned)) {
    return 'Phone number can only contain digits.';
  }
  // Check for Indian 10-digit mobile or with 91 country code
  if (cleaned.length === 10) {
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      return 'Indian mobile number should start with 6, 7, 8, or 9.';
    }
    return null;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    if (!/^91[6-9]\d{9}$/.test(cleaned)) {
      return 'Mobile number should start with 6, 7, 8, or 9 after country code 91.';
    }
    return null;
  }
  if (cleaned.length < 10 || cleaned.length > 15) {
    return 'Please enter a valid 10-digit mobile number.';
  }
  return null;
}

/**
 * Validates standard email address format.
 */
export function validateEmail(email, required = false) {
  if (!email || !email.trim()) {
    return required ? 'Email address is required.' : null;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address (e.g. name@example.com).';
  }
  return null;
}

/**
 * Validates text fields with min/max length.
 */
export function validateText(text, fieldName = 'This field', minLength = 2, maxLength = 200) {
  if (!text || !text.trim()) {
    return `${fieldName} is required.`;
  }
  const trimmed = text.trim();
  if (trimmed.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters.`;
  }
  if (maxLength && trimmed.length > maxLength) {
    return `${fieldName} cannot exceed ${maxLength} characters.`;
  }
  return null;
}

/**
 * Validates positive number (e.g. weight, price, rates).
 */
export function validatePositiveNumber(value, fieldName = 'Value', required = false) {
  if (value === null || value === undefined || value === '') {
    return required ? `${fieldName} is required.` : null;
  }
  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} must be a valid number.`;
  }
  if (num < 0) {
    return `${fieldName} cannot be negative.`;
  }
  return null;
}

/**
 * Validates strictly greater than zero number.
 */
export function validateStrictlyPositiveNumber(value, fieldName = 'Value', required = true) {
  if (value === null || value === undefined || value === '') {
    return required ? `${fieldName} is required.` : null;
  }
  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} must be a valid number.`;
  }
  if (num <= 0) {
    return `${fieldName} must be greater than zero.`;
  }
  return null;
}

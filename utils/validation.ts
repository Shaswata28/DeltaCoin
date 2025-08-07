/**
 * Enhanced validation utilities for registration
 */

// Password strength requirements
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REQUIREMENTS = {
  minLength: PASSWORD_MIN_LENGTH,
  minUppercase: 1,
  minLowercase: 1,
  minNumbers: 1,
  minSymbols: 1, // Made required for better security
};

// Common password patterns to check against
const COMMON_PATTERNS = [
  /^[a-z]+[0-9]+$/, // lowercase + numbers
  /^[A-Z]+[0-9]+$/, // uppercase + numbers
  /^[0-9]+[a-z]+$/, // numbers + lowercase
  /^[0-9]+[A-Z]+$/, // numbers + uppercase
  /^[a-zA-Z]+$/,    // only letters
  /^[0-9]+$/,       // only numbers
  /^[a-z]+[A-Z]+$/, // only lowercase + uppercase
  /^[A-Z]+[a-z]+$/, // only uppercase + lowercase
];

// Common passwords to check against
const COMMON_PASSWORDS = [
  'password', 'password123', 'admin123', 'qwerty123',
  'welcome123', 'letmein123', 'monkey123', 'dragon123',
  'baseball123', 'football123', 'superman123', 'trustno1',
  'iloveyou123', 'sunshine123', 'princess123', 'admin1234',
  'welcome1', 'qwerty1', 'password1', 'abc123',
];

export function validateEmail(email: string): boolean {
  // Enhanced email validation with academic domain check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const academicDomains = ['eastdelta.edu.bd']; // Add all valid domains
  
  if (!emailRegex.test(email)) return false;
  
  const domain = email.split('@')[1];
  return academicDomains.includes(domain);
}

export const validatePassword = (password: string): {
  isValid: boolean;
  strength: number;
  criteria: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    symbol: boolean;
  };
} => {
  // Basic criteria check
  const criteria = {
    length: password.length >= PASSWORD_REQUIREMENTS.minLength,
    uppercase: (password.match(/[A-Z]/g) || []).length >= PASSWORD_REQUIREMENTS.minUppercase,
    lowercase: (password.match(/[a-z]/g) || []).length >= PASSWORD_REQUIREMENTS.minLowercase,
    number: (password.match(/[0-9]/g) || []).length >= PASSWORD_REQUIREMENTS.minNumbers,
    symbol: (password.match(/[^A-Za-z0-9]/g) || []).length >= PASSWORD_REQUIREMENTS.minSymbols,
  };

  // Calculate base strength from criteria (0-5)
  let strength = Object.values(criteria).filter(Boolean).length;

  // Additional strength factors
  const length = password.length;
  const uniqueChars = new Set(password).size;
  const hasSpecialChars = criteria.symbol;
  const hasNumbers = criteria.number;
  const hasMixedCase = criteria.uppercase && criteria.lowercase;

  // Length bonus (up to 2 points)
  if (length >= 12) strength += 2;
  else if (length >= 10) strength += 1;

  // Character variety bonus (up to 2 points)
  if (uniqueChars >= 12) strength += 2;
  else if (uniqueChars >= 8) strength += 1;

  // Complexity bonus (up to 2 points)
  if (hasSpecialChars && hasNumbers && hasMixedCase) strength += 2;
  else if ((hasSpecialChars && hasNumbers) || (hasSpecialChars && hasMixedCase) || (hasNumbers && hasMixedCase)) strength += 1;

  // Penalties
  // Check for common patterns
  if (COMMON_PATTERNS.some(pattern => pattern.test(password))) {
    strength = Math.max(0, strength - 2);
  }

  // Check for common passwords
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    strength = 0;
  }

  // Check for sequential characters
  if (/(.)\1{2,}/.test(password)) { // 3 or more repeated characters
    strength = Math.max(0, strength - 1);
  }

  // Check for keyboard patterns
  if (/(qwer|asdf|zxcv|1234|5678|qwerty|asdfgh|zxcvbn)/i.test(password)) {
    strength = Math.max(0, strength - 2);
  }

  // Normalize strength to 0-5 scale
  strength = Math.min(5, Math.max(0, Math.floor(strength / 2)));

  // Password is valid if it meets minimum length and required character types
  const isValid = criteria.length && criteria.uppercase && criteria.lowercase && criteria.number && criteria.symbol;

  return {
    isValid,
    strength,
    criteria,
  };
};

export const validateName = (name: string): boolean => {
  // Enhanced name validation
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name.trim());
};

export const validateStudentId = (id: string): boolean => {
  // Format: YYYYNNNNN (Year + 5 digit number)
  const studentIdRegex = /^\d{9}$/;
  return studentIdRegex.test(id);
};

export const validatePhone = (phone: string): boolean => {
  // Bangladesh phone number format
  const phoneRegex = /^(\+8801|01)[3-9][0-9]{8}$/;
  return phoneRegex.test(phone);
};

export const validateUsername = (username: string): boolean => {
  // Enhanced username requirements
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,29}$/;
  return usernameRegex.test(username);
};

export const validatePin = (pin: string): boolean => {
  // 5-digit PIN validation
  return /^\d{5}$/.test(pin);
};

export const validatePinMatch = (pin1: string, pin2: string): boolean => {
  return pin1 === pin2 && validatePin(pin1);
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

export const getPasswordStrengthText = (strength: number): string => {
  switch (strength) {
    case 0:
      return 'Very Weak';
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Good';
    case 4:
      return 'Strong';
    case 5:
      return 'Very Strong';
    default:
      return '';
  }
};
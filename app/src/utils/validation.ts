export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  custom?: (value: string) => boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateField(
  value: string,
  rules: ValidationRule,
  fieldName: string
): string | null {
  // Required check
  if (rules.required && (!value || value.trim() === '')) {
    return `${fieldName} est requis`;
  }

  // Skip other checks if value is empty and not required
  if (!value || value.trim() === '') {
    return null;
  }

  // Min length check
  if (rules.minLength && value.length < rules.minLength) {
    return `${fieldName} doit contenir au moins ${rules.minLength} caractères`;
  }

  // Max length check
  if (rules.maxLength && value.length > rules.maxLength) {
    return `${fieldName} ne doit pas dépasser ${rules.maxLength} caractères`;
  }

  // Email check
  if (rules.email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      return 'Veuillez entrer une adresse email valide';
    }
  }

  // Phone check
  if (rules.phone) {
    // More lenient phone pattern for international numbers
    const lenientPattern = /^[\+\d\s\-\(\)\.]{8,20}$/;
    if (!lenientPattern.test(value)) {
      return 'Veuillez entrer un numéro de téléphone valide';
    }
  }

  // Pattern check
  if (rules.pattern && !rules.pattern.test(value)) {
    return `${fieldName} n'est pas valide`;
  }

  // Custom validation
  if (rules.custom && !rules.custom(value)) {
    return `${fieldName} n'est pas valide`;
  }

  return null;
}

export function validateForm(
  values: Record<string, string>,
  rules: Record<string, ValidationRule>
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = values[field] || '';
    const error = validateField(value, fieldRules, field);
    
    if (error) {
      errors.push({ field, message: error });
    }
  }

  return errors;
}

// Common validation rules
export const validationRules = {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    required: true,
    email: true,
  },
  phone: {
    phone: true,
  },
  city: {
    maxLength: 100,
  },
  postalCode: {
    pattern: /^[0-9\-\s]{3,10}$/,
  },
  jobTitle: {
    maxLength: 100,
  },
  school: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  diploma: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  employer: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  skillName: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
};

// Real-time validation debounce
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Password strength checker (if needed for future features)
export function checkPasswordStrength(password: string): {
  score: number;
  message: string;
} {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const messages = [
    'Très faible',
    'Faible',
    'Moyen',
    'Bon',
    'Fort',
    'Très fort',
  ];

  return {
    score,
    message: messages[score],
  };
}

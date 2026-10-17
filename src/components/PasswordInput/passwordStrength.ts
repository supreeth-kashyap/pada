export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

export const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'] as const;

/**
 * A rough strength estimate from length and character variety, 0 (too weak) to 4 (strong).
 * For real policies use a dedicated estimator (zxcvbn, for example) and pass its score.
 */
export function estimatePasswordStrength(password: string): PasswordStrength {
  if (!password) return 0;
  const variety = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((pattern) => pattern.test(password)).length;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (variety >= 2) score += 1;
  if (variety >= 3 && password.length >= 10) score += 1;
  return Math.min(4, score) as PasswordStrength;
}


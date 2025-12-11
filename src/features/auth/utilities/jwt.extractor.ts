import { Request } from 'express';

export const cookieExtractor = (req: Request): string | null => {
  /** Refresh token */
  const cookieToken = req.cookies?.['refreshToken'] as string | undefined;

  if (!cookieToken) return null;

  return cookieToken;
};

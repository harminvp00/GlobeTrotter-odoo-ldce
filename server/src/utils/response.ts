import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: any,
  message?: string,
  statusCode: number = 200
): Response => {
  const payload: { message?: string; data: any } = { data };
  if (message) {
    payload.message = message;
  }
  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 400,
  details: any[] = []
): Response => {
  return res.status(statusCode).json({
    error,
    details,
  });
};

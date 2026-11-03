import { NextResponse } from 'next/server';
import { AppError } from './appError';

export function asyncWrapper(handler) {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (err) {
      const status = err instanceof AppError ? err.statusCode : 500;
      const message = err.message || 'Internal Server Error';
      return NextResponse.json({ error: message }, { status });
    }
  };
}

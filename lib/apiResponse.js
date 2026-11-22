import { NextResponse } from 'next/server';

/**
 * Standardized API success response
 */
export function successResponse(data, status = 200, message = null) {
  const payload = { success: true };
  if (data !== undefined) payload.data = data;
  if (message) payload.message = message;
  return NextResponse.json(payload, { status });
}

/**
 * Standardized API error response
 */
export function errorResponse(error, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

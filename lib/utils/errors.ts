import type { ApiResponse } from '@/types';
import { ZodError } from 'zod';

/**
 * Create a standard error response
 */
export function createErrorResponse(
  error: string,
  code: string,
  status: number = 400,
  details?: Array<{ field: string; message: string }>
): Response {
  const body: ApiResponse = {
    error,
    code,
    details,
  };
  return Response.json(body, { status });
}

/**
 * Create a success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): Response {
  const body: ApiResponse<T> = {
    data,
    message,
  };
  return Response.json(body, { status });
}

/**
 * Handle Zod validation errors
 */
export function handleValidationError(error: ZodError): Response {
  const details = error.issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  return createErrorResponse(
    'Données invalides',
    'VALIDATION_ERROR',
    400,
    details
  );
}

/**
 * Handle generic errors
 */
export function handleError(error: unknown): Response {
  console.error('Error:', error);

  if (error instanceof ZodError) {
    return handleValidationError(error);
  }

  if (error instanceof Error) {
    // Handle known error types
    switch (error.message) {
      case 'DUPLICATE_ENTRY':
        return createErrorResponse(
          'Un enregistrement avec ces informations existe déjà',
          'DUPLICATE_ENTRY',
          409
        );
      case 'NOT_FOUND':
        return createErrorResponse(
          'Ressource non trouvée',
          'NOT_FOUND',
          404
        );
      case 'CONCURRENT_MODIFICATION':
        return createErrorResponse(
          'Cet enregistrement a été modifié par un autre utilisateur',
          'CONCURRENT_MODIFICATION',
          412
        );
      case 'UNAUTHORIZED':
        return createErrorResponse(
          'Authentification requise',
          'UNAUTHORIZED',
          401
        );
      case 'FORBIDDEN':
        return createErrorResponse(
          'Accès interdit',
          'FORBIDDEN',
          403
        );
    }
  }

  // Generic server error
  return createErrorResponse(
    'Une erreur est survenue',
    'SERVER_ERROR',
    500
  );
}

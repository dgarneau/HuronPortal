import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth/session';
import { getAllMachineTypes, createMachineType, searchMachineTypes } from '@/lib/cosmos/models/machine-type';
import { machineTypeCreateSchema } from '@/lib/validation/schemas';
import { ZodError } from 'zod';

/**
 * GET /api/machine-types
 * Get all machine types or search by term
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get search parameter if provided
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');

    let machineTypes;
    if (search) {
      machineTypes = await searchMachineTypes(search);
    } else {
      machineTypes = await getAllMachineTypes();
    }

    return NextResponse.json({ data: machineTypes });
  } catch (error) {
    console.error('Error fetching machine types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch machine types' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/machine-types
 * Create a new machine type (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin role
    if (session.role !== 'Admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = machineTypeCreateSchema.parse(body);

    // Create machine type
    const machineType = await createMachineType(validatedData, session.userId);

    return NextResponse.json(
      { data: machineType },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating machine type:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.issues.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create machine type' },
      { status: 500 }
    );
  }
}

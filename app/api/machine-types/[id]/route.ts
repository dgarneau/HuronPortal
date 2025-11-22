import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth/session';
import { getMachineTypeById, updateMachineType, deleteMachineType } from '@/lib/cosmos/models/machine-type';
import { machineTypeUpdateSchema } from '@/lib/validation/schemas';
import { ZodError } from 'zod';

/**
 * GET /api/machine-types/[id]
 * Get a specific machine type by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const machineType = await getMachineTypeById(params.id);
    
    if (!machineType) {
      return NextResponse.json(
        { error: 'Machine type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: machineType });
  } catch (error) {
    console.error('Error fetching machine type:', error);
    return NextResponse.json(
      { error: 'Failed to fetch machine type' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/machine-types/[id]
 * Update a machine type (Admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validatedData = machineTypeUpdateSchema.parse(body);

    // Update machine type
    const machineType = await updateMachineType(params.id, validatedData, session.userId);

    return NextResponse.json({ data: machineType });
  } catch (error) {
    console.error('Error updating machine type:', error);

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
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
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
      { error: 'Failed to update machine type' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/machine-types/[id]
 * Delete a machine type (Admin only)
 * Prevents deletion if machines reference this type
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await deleteMachineType(params.id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting machine type:', error);

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      if (error.message.includes('Cannot delete') || error.message.includes('are using')) {
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
      { error: 'Failed to delete machine type' },
      { status: 500 }
    );
  }
}

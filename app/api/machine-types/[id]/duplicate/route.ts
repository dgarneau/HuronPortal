import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth/session';
import { duplicateMachineType } from '@/lib/cosmos/models/machine-type';

/**
 * POST /api/machine-types/[id]/duplicate
 * Duplicate a machine type (Admin only)
 * Creates a copy with new GUID and appends " (Copy)" to name
 */
export async function POST(
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

    const duplicated = await duplicateMachineType(params.id, session.userId);

    return NextResponse.json(
      { data: duplicated },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error duplicating machine type:', error);

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to duplicate machine type' },
      { status: 500 }
    );
  }
}

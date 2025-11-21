import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getMachineById, updateMachine, deleteMachine } from '@/lib/cosmos/models/machine';
import { machineUpdateSchema } from '@/lib/validation/schemas';
import { handleError } from '@/lib/utils/errors';
import { canWrite, isAdmin } from '@/lib/auth/permissions';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Verify session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const machine = await getMachineById(params.id);
    
    if (!machine) {
      return NextResponse.json(
        { error: 'Machine non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: machine });

  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Verify session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Check permissions
    if (!canWrite(session.role)) {
      return NextResponse.json(
        { error: 'Permission refusée' },
        { status: 403 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validation = machineUpdateSchema.safeParse(body);
    
    if (!validation.success) {
      return handleError(validation.error);
    }

    // Update machine
    const machine = await updateMachine(params.id, validation.data);

    return NextResponse.json({
      data: machine,
      message: 'Machine modifiée avec succès',
    });

  } catch (error) {
    if (error instanceof Error && error.message === 'Machine not found') {
      return NextResponse.json(
        { error: 'Machine non trouvée' },
        { status: 404 }
      );
    }
    if (error instanceof Error && error.message === 'Client not found') {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Verify session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Check permissions (Admin only)
    if (!isAdmin(session)) {
      return NextResponse.json(
        { error: 'Permission refusée - Admin requis' },
        { status: 403 }
      );
    }

    await deleteMachine(params.id);

    return NextResponse.json({
      message: 'Machine supprimée avec succès',
    });

  } catch (error) {
    return handleError(error);
  }
}

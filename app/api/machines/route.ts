import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { listMachines, createMachine, getMachineByNumeroOL } from '@/lib/cosmos/models/machine';
import { machineCreateSchema } from '@/lib/validation/schemas';
import { handleError } from '@/lib/utils/errors';
import { canWrite } from '@/lib/auth/permissions';

export async function GET(request: NextRequest) {
  try {
    // Verify session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const continuationToken = searchParams.get('continuationToken') || undefined;
    const clientId = searchParams.get('clientId') || undefined;
    const numeroOL = searchParams.get('numeroOL') || undefined;

    // Get machines
    const { machines, continuationToken: nextToken } = await listMachines(
      limit,
      continuationToken,
      { clientId, numeroOL }
    );

    return NextResponse.json({
      data: machines,
      continuationToken: nextToken,
      hasMore: !!nextToken,
    });

  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
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
    const validation = machineCreateSchema.safeParse(body);
    
    if (!validation.success) {
      return handleError(validation.error);
    }

    // Check if numeroOL already exists
    const existing = await getMachineByNumeroOL(validation.data.numeroOL);
    if (existing) {
      return NextResponse.json(
        { error: 'Ce numéro OL existe déjà' },
        { status: 409 }
      );
    }

    // Create machine
    const machine = await createMachine(validation.data, session.username);

    return NextResponse.json(
      { data: machine, message: 'Machine créée avec succès' },
      { status: 201 }
    );

  } catch (error) {
    if (error instanceof Error && error.message === 'Client not found') {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }
    return handleError(error);
  }
}


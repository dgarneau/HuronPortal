import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { createClient, listClients, searchClients } from '@/lib/cosmos/models/client';
import { clientCreateSchema } from '@/lib/validation/schemas';
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
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const continuationToken = searchParams.get('continuationToken') || undefined;

    // Search or list
    if (search) {
      const clients = await searchClients(search, limit);
      return NextResponse.json({ data: clients });
    } else {
      const { clients, continuationToken: nextToken } = await listClients(
        limit,
        continuationToken
      );
      return NextResponse.json({
        data: clients,
        continuationToken: nextToken,
        hasMore: !!nextToken,
      });
    }

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
    const validation = clientCreateSchema.safeParse(body);
    
    if (!validation.success) {
      return handleError(validation.error);
    }

    // Create client
    const client = await createClient(validation.data);

    return NextResponse.json(
      { data: client, message: 'Client créé avec succès' },
      { status: 201 }
    );

  } catch (error) {
    return handleError(error);
  }
}

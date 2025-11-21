import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getUserById, updateUser, deleteUser } from '@/lib/cosmos/models/user';
import { userUpdateSchema } from '@/lib/validation/schemas';
import { handleError } from '@/lib/utils/errors';
import { isAdmin } from '@/lib/auth/permissions';

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

    // Check permissions (Admin only)
    if (!isAdmin(session)) {
      return NextResponse.json(
        { error: 'Permission refusée - Admin requis' },
        { status: 403 }
      );
    }

    const user = await getUserById(params.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Remove passwordHash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json({ data: userWithoutPassword });

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

    // Check permissions (Admin only)
    if (!isAdmin(session)) {
      return NextResponse.json(
        { error: 'Permission refusée - Admin requis' },
        { status: 403 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validation = userUpdateSchema.safeParse(body);
    
    if (!validation.success) {
      return handleError(validation.error);
    }

    // Get existing user to get username
    const existing = await getUserById(params.id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Hash password if provided
    const updateData: any = { ...validation.data };
    if (validation.data.password) {
      const { hashPassword } = await import('@/lib/auth/password');
      updateData.passwordHash = await hashPassword(validation.data.password);
      delete updateData.password;
    }

    // Update user
    const user = await updateUser(params.id, existing.username, updateData);

    // Remove passwordHash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      data: userWithoutPassword,
      message: 'Utilisateur modifié avec succès',
    });

  } catch (error) {
    if (error instanceof Error && error.message === 'User not found') {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
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

    // Prevent self-deletion
    const user = await getUserById(params.id);
    if (user?.username === session.username) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas supprimer votre propre compte' },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    await deleteUser(params.id, user.username);

    return NextResponse.json({
      message: 'Utilisateur supprimé avec succès',
    });

  } catch (error) {
    return handleError(error);
  }
}

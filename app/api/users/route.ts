import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { listUsers, createUser, getUserByUsername, getUserByEmail } from '@/lib/cosmos/models/user';
import { userCreateSchema } from '@/lib/validation/schemas';
import { hashPassword } from '@/lib/auth/password';
import { handleError } from '@/lib/utils/errors';
import { isAdmin } from '@/lib/auth/permissions';

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

    // Check permissions (Admin only)
    if (!isAdmin(session)) {
      return NextResponse.json(
        { error: 'Permission refusée - Admin requis' },
        { status: 403 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role') || undefined;
    const isActive = searchParams.get('isActive') === 'true' ? true : undefined;

    // Get users
    const users = await listUsers({ role, isActive });

    return NextResponse.json({ data: users });

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

    // Check permissions (Admin only)
    if (!isAdmin(session)) {
      return NextResponse.json(
        { error: 'Permission refusée - Admin requis' },
        { status: 403 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validation = userCreateSchema.safeParse(body);
    
    if (!validation.success) {
      return handleError(validation.error);
    }

    // Check for duplicate username
    const existingUsername = await getUserByUsername(validation.data.username);
    if (existingUsername) {
      return NextResponse.json(
        { error: `Le nom d'utilisateur "${validation.data.username}" est déjà utilisé` },
        { status: 409 }
      );
    }

    // Check for duplicate email
    const existingEmail = await getUserByEmail(validation.data.email);
    if (existingEmail) {
      return NextResponse.json(
        { error: `Le courriel "${validation.data.email}" est déjà utilisé` },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(validation.data.password);

    // Create user
    const user = await createUser({
      username: validation.data.username,
      email: validation.data.email,
      name: validation.data.name,
      password: validation.data.password,
      passwordHash,
      role: validation.data.role,
      isActive: validation.data.isActive,
    });

    // Remove passwordHash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { data: userWithoutPassword, message: 'Utilisateur créé avec succès' },
      { status: 201 }
    );

  } catch (error) {
    if (error instanceof Error && error.message === 'DUPLICATE_USERNAME') {
      return NextResponse.json(
        { error: 'Ce nom d\'utilisateur existe déjà' },
        { status: 409 }
      );
    }
    return handleError(error);
  }
}

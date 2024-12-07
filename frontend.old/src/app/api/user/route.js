import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session) {
    return NextResponse.json(session.user);
  } else {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
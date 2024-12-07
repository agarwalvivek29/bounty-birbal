import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: { Authorization: `token ${session.user.accessToken}` },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json({ message: 'Error fetching repositories' }, { status: 500 });
  }
}
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  console.log('Session in API route:', {
    exists: !!session,
    user: session?.user ? {
      githubUsername: session.user.name,
      hasAccessToken: !!session.user.accessToken
    } : null
  });

  if (!session || !session.user.accessToken) {
    return NextResponse.json({
      message: 'Unauthorized',
      debug: { hasSession: !!session, hasAccessToken: !!session?.user?.accessToken }
    }, { status: 401 });
  }

  if (!session.user.name) {
    return NextResponse.json({
      message: 'GitHub username not found',
      debug: {
        sessionUser: session.user,
        githubUsername: session.user.name
      }
    }, { status: 400 });
  }

  const repoName = params.repoName;
  try {
    const url = `https://api.github.com/repos/${session.user.name}/${repoName}/issues`;
    console.log('Making request to:', url);
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
        Accept: 'application/vnd.github.v3+json'
      },
    });
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return NextResponse.json({
      message: 'Error fetching issues',
      error: error.response?.data || error.message
    }, { status: error.response?.status || 500 });
  }
}
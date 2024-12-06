import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface CognitoToken {
  'cognito:groups'?: string[];
}

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decodedToken: CognitoToken = jwtDecode(token);
  const groups = decodedToken['cognito:groups'];

  if (!groups?.includes('admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Fetch admin-specific data here
  return NextResponse.json({ message: 'Admin books data' });
}
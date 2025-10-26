import { NextRequest, NextResponse } from 'next/server';
import { Whop } from '@whop/sdk';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(new URL('/?error=oauth_failed', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    const whop = new Whop({
      clientId: process.env.NEXT_PUBLIC_WHOP_CLIENT_ID!,
      clientSecret: process.env.WHOP_CLIENT_SECRET!,
    });

    // Exchange authorization code for access token
    const tokenResponse = await whop.oauth.getAccessToken({
      code,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    });

    // Store access token securely (you may want to use cookies or session storage)
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.cookies.set('whop_access_token', tokenResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url));
  }
}

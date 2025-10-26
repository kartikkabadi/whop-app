import { Whop } from '@whop/sdk';

export function getWhopOAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_WHOP_CLIENT_ID!;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`;
  const scope = 'user:read companies:read';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
  });

  return `https://whop.com/oauth/authorize?${params.toString()}`;
}

export function createWhopClient(accessToken?: string) {
  return new Whop({
    clientId: process.env.NEXT_PUBLIC_WHOP_CLIENT_ID!,
    clientSecret: process.env.WHOP_CLIENT_SECRET!,
    accessToken,
  });
}

export async function getWhopUser(accessToken: string) {
  const whop = createWhopClient(accessToken);
  return await whop.users.me();
}

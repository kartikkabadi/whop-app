'use client';

import { getWhopOAuthUrl } from '../lib/whop-oauth';

export default function WhopLoginButton() {
  const handleLogin = () => {
    const oauthUrl = getWhopOAuthUrl();
    window.location.href = oauthUrl;
  };

  return (
    <button
      onClick={handleLogin}
      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
    >
      Sign in with Whop
    </button>
  );
}

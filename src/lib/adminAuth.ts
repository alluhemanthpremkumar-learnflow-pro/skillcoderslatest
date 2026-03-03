// ⚠️ WARNING: Frontend-only auth is NOT secure. Credentials are visible in source code.
// Migrate to Lovable Cloud for proper security.

const ADMIN_CREDENTIALS = {
  email: 'alluhemanth5063@gmail.com',
  username: 'scpanduprem2025',
  password: 'Scp4ndup83m@"2025',
};

export const adminLogin = (identifier: string, password: string): boolean => {
  const isValid =
    (identifier === ADMIN_CREDENTIALS.email || identifier === ADMIN_CREDENTIALS.username) &&
    password === ADMIN_CREDENTIALS.password;

  if (isValid) {
    sessionStorage.setItem('sc_admin_session', JSON.stringify({
      loggedIn: true,
      email: ADMIN_CREDENTIALS.email,
      loginTime: Date.now(),
    }));
  }
  return isValid;
};

export const isAdminLoggedIn = (): boolean => {
  try {
    const session = sessionStorage.getItem('sc_admin_session');
    if (!session) return false;
    const parsed = JSON.parse(session);
    // Session expires after 2 hours
    if (Date.now() - parsed.loginTime > 2 * 60 * 60 * 1000) {
      sessionStorage.removeItem('sc_admin_session');
      return false;
    }
    return parsed.loggedIn === true;
  } catch {
    return false;
  }
};

export const adminLogout = () => {
  sessionStorage.removeItem('sc_admin_session');
};

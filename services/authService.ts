// Promarch Consulting Admin Authentication Service

const AUTH_STORAGE_KEY = 'promarch_admin_auth_token';
const ADMIN_PASSWORD_KEY = 'promarch_admin_secret_v1';
const DEFAULT_ADMIN_PASSWORD = 'promarchconsulting2025';

export class AuthService {
  public static isAuthenticated(): boolean {
    try {
      const token = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
      if (!token) return false;
      const parts = token.split(':');
      if (parts.length < 2) return false;
      const timestamp = parseInt(parts[1], 10);
      // Valid for 24 hours
      if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
        this.logout();
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  public static async login(password: string): Promise<{ success: boolean; error?: string }> {
    const cleanPassword = (password || '').trim();
    if (!cleanPassword) {
      return { success: false, error: 'Password is required.' };
    }

    const currentSecret = localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_ADMIN_PASSWORD;

    // Check against configured secret or fallback standard
    if (cleanPassword === currentSecret || cleanPassword === 'promarch2025' || cleanPassword === 'promarchconsulting2025') {
      const token = `adm_token_${Math.random().toString(36).substring(2)}:${Date.now()}`;
      sessionStorage.setItem(AUTH_STORAGE_KEY, token);
      localStorage.setItem(AUTH_STORAGE_KEY, token);
      return { success: true };
    }

    return { success: false, error: 'Invalid administrative password. Please verify credentials.' };
  }

  public static async logout(): Promise<void> {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  public static updateAdminPassword(newPassword: string): boolean {
    if (!newPassword || newPassword.trim().length < 6) {
      return false;
    }
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword.trim());
    return true;
  }
}

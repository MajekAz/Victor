// Promarch Consulting Admin Authentication Service
// Communicates strictly with Hostinger PHP Backend / MySQL database session authority

const CSRF_STORAGE_KEY = 'promarch_admin_csrf_token';

export interface AuthSession {
  isAuthenticated: boolean;
  user?: string;
  role?: string;
  csrfToken?: string;
}

export class AuthService {
  private static csrfToken: string = '';

  public static getCSRFToken(): string {
    if (!this.csrfToken) {
      this.csrfToken = sessionStorage.getItem(CSRF_STORAGE_KEY) || '';
    }
    return this.csrfToken;
  }

  public static setCSRFToken(token: string): void {
    this.csrfToken = token || '';
    if (token) {
      sessionStorage.setItem(CSRF_STORAGE_KEY, token);
    } else {
      sessionStorage.removeItem(CSRF_STORAGE_KEY);
    }
  }

  // Deprecated helper kept for interface compatibility; returns null as PHP cookies are authoritative
  public static getAuthToken(): string | null {
    return null;
  }

  // Check current session strictly against the PHP/MySQL server session
  public static async checkSession(): Promise<AuthSession> {
    try {
      const res = await fetch('/api/admin/auth.php?action=check', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        const result = await res.json();
        const data = result.data || result;
        if (data?.csrfToken) {
          this.setCSRFToken(data.csrfToken);
        }
        if (data?.isAuthenticated === true) {
          return {
            isAuthenticated: true,
            user: data.user,
            role: data.role,
            csrfToken: data.csrfToken
          };
        }
      }
    } catch (e) {
      console.warn('PHP session check failed:', e);
    }

    // Never fall back to browser storage or fake tokens
    return { isAuthenticated: false };
  }

  // Admin Login strictly against PHP/MySQL database backend
  public static async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; data?: AuthSession; error?: string }> {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = password || '';

    if (!cleanEmail) {
      return { success: false, error: 'Administrator email is required.' };
    }

    if (!cleanPassword) {
      return { success: false, error: 'Password is required.' };
    }

    try {
      const res = await fetch('/api/admin/auth.php?action=login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword
        })
      });

      const result = await res.json().catch(() => null);

      if (res.ok && result?.success) {
        const data = result.data || {};
        const csrf = data.csrfToken || result.csrfToken || '';
        if (csrf) {
          this.setCSRFToken(csrf);
        }

        return {
          success: true,
          data: {
            isAuthenticated: true,
            user: data.user || cleanEmail,
            role: data.role || 'admin',
            csrfToken: csrf
          }
        };
      }

      if (res.status === 429) {
        return {
          success: false,
          error: result?.message || 'Too many failed login attempts. For security reasons, please wait 15 minutes before trying again.'
        };
      }

      return {
        success: false,
        error: result?.message || 'Invalid administrator credentials. Please check your email and password.'
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Unable to connect to authentication server. Please verify your network connection.'
      };
    }
  }

  // Admin Logout invalidating PHP server session
  public static async logout(): Promise<void> {
    try {
      await fetch('/api/admin/auth.php?action=logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': this.getCSRFToken()
        }
      }).catch(() => {});
    } catch {
      // Ignore network failures on logout
    }

    this.setCSRFToken('');
  }
}


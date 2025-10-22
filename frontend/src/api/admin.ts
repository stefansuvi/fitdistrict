const ADMIN_URL = "https://fitdistrict.onrender.com/api/admins/login";

export interface AdminLoginResponse {
  message: string;
  username?: string;
}

export const loginAdmin = async (username: string, password: string): Promise<AdminLoginResponse> => {
  try {
    const res = await fetch(ADMIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Baci grešku sa porukom iz response-a
      throw new Error(data.message || 'Login failed');
    }

    return data;
  } catch (err: any) {
    console.error('Greška pri login-u:', err);
    throw err;
  }
};

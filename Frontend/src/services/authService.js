// Default API base points to the Auth Service running on port 4000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const authService = {
  /**
   * Register a new user
   * @param {string} name - User's full name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} mobileNumber - User's mobile number
   * @param {string} dob - User's date of birth (YYYY-MM-DD format)
   * @returns {Promise<{token: string, user: object}>}
   */
  async register(name, email, password, mobileNumber, dob) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          mobileNumber,
          dob,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Login user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<{token: string, user: object}>}
   */
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async forgotPassword(email) {
    const response = await fetch(`${API_BASE_URL}/auth/forgotpassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to send reset email");
    return data;
  },

  async resetPassword(token, password) {
    const response = await fetch(`${API_BASE_URL}/auth/resetpassword/${token}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to reset password");
    return data;
  },

  /**
   * Get stored auth token
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('authToken');
  },

  /**
   * Store auth token
   * @param {string} token - JWT token
   */
  setToken(token) {
    localStorage.setItem('authToken', token);
  },

  /**
   * Remove auth token
   */
  removeToken() {
    localStorage.removeItem('authToken');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getToken();
  },
};

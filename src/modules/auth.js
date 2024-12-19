// Authentication module
export class Auth {
  constructor() {
    this.isLoggedIn = false;
    this.currentUser = null;
  }

  async login(email, password) {
    try {
      // Validate email
      if (!email.endsWith('@ju.edu.jo')) {
        throw new Error('Only university email addresses are allowed');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.isLoggedIn = true;
      this.currentUser = {
        email,
        role: email.includes('staff') ? 'staff' : 'student',
        id: Math.random().toString(36).substr(2, 9)
      };
      
      localStorage.setItem('user', JSON.stringify(this.currentUser));
      return this.currentUser;
    } catch (error) {
      throw new Error('Login failed: ' + error.message);
    }
  }

  logout() {
    this.isLoggedIn = false;
    this.currentUser = null;
    localStorage.removeItem('user');
    window.location.href = '/index.html';
  }

  getCurrentUser() {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        this.isLoggedIn = true;
      }
    }
    return this.currentUser;
  }

  checkAuth() {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = '/index.html';
    }
    return user;
  }
}

export const auth = new Auth();
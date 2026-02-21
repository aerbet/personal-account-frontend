import axios from 'axios';

const API_URL = '/api/auth/';

class AuthService {
  async submitPhone(phone) {
    const response = await axios.post(API_URL + 'phone', { phone });
    return response.data;
  }

  async requestOtp(phone, method) {
    const response = await axios.post(API_URL + 'request-otp', { phone, method });
    return response.data;
  }

  async verify(phone, code, email = null) {
    const payload = { phone, code };
    if (email) payload.email = email;
    const response = await axios.post(API_URL + 'verify', payload);
    if (response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  async resendOtp(phone) {
    const response = await axios.post(API_URL + 'resend-otp', { phone });
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
  }
}

export default new AuthService();
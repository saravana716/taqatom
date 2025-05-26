import get from 'lodash/get';
import ObjectStorage from './ObjectStorageService';
export const DOMAIN_KEY='domain_name'
export default {
  async setAuthToken(authToken) {
    return await ObjectStorage.setItem('auth_token', {access_token: authToken});
  },
  async setSessionToken(sessionToken) {
    return await ObjectStorage.setItem('session', {session_token: sessionToken});
  },
  async setDomainName(name) {
    return await ObjectStorage.setItem(DOMAIN_KEY, {domain: name});
  },
  async setAuth(auth) { 
    return await ObjectStorage.setItem('auth', auth);
  },
  async isLoggedIn() {
    const data = await ObjectStorage.getItem('auth', {});
    return !!get(data, 'access_token');
  },
  async getToken() {
    const data = await ObjectStorage.getItem('auth_token', {});
    return get(data, 'access_token');
  },
  async getSessionToken() {
    const data = await ObjectStorage.getItem('session', {});
    return get(data, 'session_token');
  },
  async getDomainName() {
    const data = await ObjectStorage.getItem(DOMAIN_KEY, {});
    return get(data, 'domain');
  },
  async getMetamaskSession() {
    const data = await ObjectStorage.getItem(
      '@walletconnect/qrcode-modal-react-native:session',
      {},
    );
    return data;
  },
  async getUser() {
    const data = await ObjectStorage.getItem('auth', {});
    return data;
  },
  async getUserName() {
    const data = await ObjectStorage.getItem('auth', {});
    return get(data, 'name');
  },
  async getUserUsername() {
    const data = await ObjectStorage.getItem('auth', {});
    return get(data, 'username');
  },
  async getUserId() {
    const data = await ObjectStorage.getItem('auth', {});

    return get(data, 'user_id');
  },

  async getUserImage() {
    const data = await ObjectStorage.getItem('auth', {});
    return get(data, 'picture');
  },
  async logout() {
    await ObjectStorage.setItem('auth_token', {});
    await ObjectStorage.setItem('auth', {});

    // UserNavigationService.registerLoginStack();
  },
  async setLoggedInAccounts(email) {
    const data = await ObjectStorage.getItem('logged_in_accounts');
    let accounts = [];
    if (Array.isArray(data)) {
      if (data.includes(email)) {
        return;
      }
      accounts = [...data, email];
    } else {
      accounts.push(email);
    }
    return await ObjectStorage.setItem('logged_in_accounts', accounts);
  },
  async getLoggedInAccounts() {
    const data = await ObjectStorage.getItem('logged_in_accounts');
    return data;
  },
};

import APIService, { getUrlForHeaders } from '../APIService';
let API_URL="https://api-test.hr-ms.com"
const AuthServices = {
  sendSignUp(options) {
    return new Promise(async(resolve, reject) => {
      const domainName=await getUrlForHeaders()
      APIService.fetch(
        `${API_URL}/api/v1/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            hostname: domainName,
          },
          body: JSON.stringify(options),
        },
        (error, data) => {
          console.log(error, data);
          if (error) {
            reject(error);
            return;
          }
          resolve(data);
        },
      );
    });
  },

  sendSignIn(options) {
    return new Promise(async(resolve, reject) => {
      const domainName=await getUrlForHeaders()
    return  APIService.fetch(
        `${API_URL}/login/`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'hostname': domainName,
          },
          body: JSON.stringify(options),
        },
        (error, data) => {
          console.log('l8l', error, data);
          if (error) {
            reject(data);
            return;
          }
          resolve(data);
        },
      );
    });
  },
  sendOtp(options) {
    return new Promise((resolve, reject) => {
      APIService.fetch(
        `${API_URL}/tenant/t1/user_password/reset_password/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(options),
        },
        (error, data) => {
          console.log(error, data);
          if (error) {
            reject(error);
            return;
          }
          resolve(data);
        },
      );
    });
  },
  resetPassword(options) {
    return new Promise((resolve, reject) => {
      APIService.fetch(
        `${API_URL}/tenant/t1/user_password/change_password/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(options),
        },
        (error, data) => {
          console.log(error, data);
          if (error) {
            reject(error);
            return;
          }
          resolve(data);
        },
      );
    });
  },
  sendForgotOtp({email}) {
    return new Promise((resolve, reject) => {
      APIService.fetch(
        `${API_URL}/tenant/t1/user_password/forgot_password/?email=${email}`,
        {
          method: 'PUT',
        },
        (error, data) => {
          console.log(error, data);
          if (error) {
            reject(error);
            return;
          }
          resolve(data);
        },
      );
    });
  },
};

export default AuthServices;

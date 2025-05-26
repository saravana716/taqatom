import { isEmpty } from 'lodash';
import get from 'lodash/get';
import includes from 'lodash/includes';
import isString from 'lodash/isString';
import noop from 'lodash/noop';
import { Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import packageJSON from '../package.json';
import AuthService from './AuthService';

const DEFAULT_TIMEOUT = 40000;
const TYPE_JSON = 'application/json';
const API_URL="https://api-test.hr-ms.com"
export const getUrlForHeaders=async()=>{
  try{

    const urlArray=API_URL?.split('//')
  const domain=await AuthService.getDomainName()
  return `${domain}.${get(urlArray,'1','')}`
  }
  catch(err){
    console.error(err)
  }
}

const fnGetFileNameFromContentDispositionHeader = header => {
  let fileName = 'output1.pdf';
  if (isEmpty(header)) {
    return fileName;
  }

  const contentDisposition = header.split('filename=');
  return contentDisposition[1] || fileName;
};

const handleLogout = async () => {
  try {
    setIsLoading(true);
    await AsyncStorage.removeItem('auth_token');
    Navigation.setRoot({
      root: {
        stack: {
          id: 'MainPage',
          children: [
            {
              component: {
                name: 'SignIn',
                options: {
                  animations: {
                    push: {
                      enabled: false,
                    },
                    pop: {
                      enabled: false,
                    },
                  },
                  topBar: {
                    visible: false,
                  },
                },
              },
            },
          ],
        },
      },
    });
    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
    console.error('Error clearing authentication token:', error);
  }
};

export default {
  _getJsonData(data) {
    return isString(data) ? data : JSON.stringify(data);
  },

  promisifiedFetch(url, params = {}) {
    return new Promise((res, rej) => {
      this.fetch(url, params, (err, data) => {
        if (err) {
          rej(err);
          return;
        }
        res(data);
      });
    });
  },

  staticRequest(options, cb = noop) {
    AuthService.getToken().then(async token => {
      const sessionToken = await AuthService.getSessionToken();
      const {
        url,
        method = 'GET',
        data,
        customHeaders,
        fileName,
        isFileData = false,
      } = options;
      // console.log('data1212', data, options, isFileData);
      let headers = {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'x-platform-os': Platform.OS,
        'x-platform-version': Platform.Version,
        'x-app-version': packageJSON.version,
      };

      // if (!isFileData) {
      //   headers["Content-Type"] = TYPE_JSON;
      // }

      /**
       * Attaching Bearer token
       */
      headers = {
        ...headers,
        ...{
          Authorization: `Bearer ${token}`,
          Referer: 'oneworldgames-hybrid',
          hostname: await getUrlForHeaders(),
          SessionToken: sessionToken,
        },
      };
      console.log('customHeaders12', customHeaders);
      if (customHeaders) {
        console.log('customHeaders', customHeaders);
        headers = {...headers, ...customHeaders};
      }

      let fetchOptions = {
        method,
        headers,
        body:
          headers['Content-Type'] === TYPE_JSON && !isFileData
            ? this._getJsonData(data)
            : data,
      };
      console.log('fileName12', fileName);
      if (fileName) {
        console.log('fileName', fileName);
        fetchOptions.fileName = fileName;
      }

      this.fetchPdfURL(url, fetchOptions, cb);
    });
  },

  request(options, cb = noop) {
    AuthService.getToken().then(async token => {
      const sessionToken = await AuthService.getSessionToken();
      const {
        url,
        method = 'GET',
        data,
        customHeaders,
        fileName,
        isFileData = false,
      } = options;
      // console.log('data1212', data, options);
      let headers = {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'x-platform-os': Platform.OS,
        'x-platform-version': Platform.Version,
        'x-app-version': packageJSON.version,
      };

      if (!isFileData) {
        headers['Content-Type'] = TYPE_JSON;
      }

      /**
       * Attaching Bearer token
       */
      headers = {
        ...headers,
        ...{
          Authorization: `Bearer ${token}`,
          Referer: 'oneworldgames-hybrid',
          hostname: await AuthService.getDomainName(),
          SessionToken: sessionToken,
        },
      };
      if (customHeaders) {
        headers = {...headers, ...customHeaders};
      }

      let fetchOptions = {
        method,
        headers,
        body:
          headers['Content-Type'] === TYPE_JSON && !isFileData
            ? this._getJsonData(data)
            : data,
      };

      if (fileName) {
        fetchOptions.fileName = fileName;
      }

      this._fetch(url, fetchOptions, cb);
    });
  },
  async _fetchWithTimeout(url, options, cb, timeout = DEFAULT_TIMEOUT) {
    const domainName=await getUrlForHeaders()
    return Promise.race([
      fetch(
        url,
        {
          ...options,
          headers: {
            ...(options?.headers || {}),
            'x-platform-os': Platform.OS,
            'x-platform-version': Platform.Version,
            'x-app-version': packageJSON.version,
            hostname: domainName
          },
        },
        cb,
      ),
      new Promise((resolve, reject) =>
        setTimeout(
          () =>
            reject({
              code: 900,
              detail: 'Connection Timeout, Please check your Internet',
            }),
          timeout,
        ),
      ),
    ]);
  },

  _fetch(url, options, cb) {
    let response;
    let serverRes;
    this._fetchWithTimeout(url, options, cb)
      .then(serverResponse => {
        response = serverResponse;

        serverRes = serverResponse;
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.indexOf('application/json') !== -1) {
          if (response.status === 204) {
            return '{}';
          }
          return serverResponse.json();
        }
        if (
          contentType &&
          (contentType.indexOf('application/pdf') !== -1 ||
            contentType.indexOf('zip') !== -1)
        ) {
          return response.blob();
        }
        return serverResponse.text();
      })
      .then(parsedResponse => {
        console.log('response121', response);
        const contentType = response.headers.get('content-type');
        if (
          contentType &&
          (contentType.indexOf('application/pdf') !== -1 ||
            contentType.indexOf('zip') !== -1)
        ) {
          console.log('contentTypecontentType', contentType);
          const fileURL = window.URL.createObjectURL(parsedResponse);
          const a = document.createElement('a');
          a.href = fileURL;
          let zipDocument;
          if (serverRes.url.indexOf('document-zip') !== -1) {
            zipDocument = 'candidate-documents.zip';
          }
          a.download =
            zipDocument ||
            options.fileName ||
            fnGetFileNameFromContentDispositionHeader(
              response.headers.get('content-disposition'),
            );
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); // afterwards we remove the element again
        }

        const {status} = response;
        // If it is not success then respond with error on the response status
        if (
          includes(
            [200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210],
            response.status,
          )
        ) {
          return cb(null, parsedResponse);
        }
        if (
          !includes(
            [200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210],
            response.status,
          )
        ) {
          console.error(parsedResponse.message);
        }
        if (status === 403) {
        }
        // if (status === 401) {
        //   AuthService.logout().then(() => {
        //     return cb({ detail: "Please login to continue" });
        //   });
        //   return;
        // }

        if (status === 401) {
          console.error('Unauthorized access, logging out...');
          AuthService.logout()
            .then(() => {
              Navigation.setRoot({
                root: {
                  stack: {
                    id: 'MainPage',
                    children: [
                      {
                        component: {
                          name: 'SignIn',
                          options: {
                            animations: {
                              push: {
                                enabled: false,
                              },
                              pop: {
                                enabled: false,
                              },
                            },
                            topBar: {
                              visible: false,
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              });
            })
            .catch(error => console.error('Logout error:', error));

          return cb({detail: 'Please login to continue'});
        }

        return cb(
          {
            status: response.status,
            statusText: response.statusText,
            message: get(parsedResponse, 'message'),
            error_code: get(parsedResponse, 'error_code'),
            errorResponse: parsedResponse,
          },
          parsedResponse,
        );
      })
      .catch(err => {
        cb(err);
      });
  },
  /**
   * General purpose fetch
   * @param {*} url
   * @param {*} params
   * @param {*} cb
   */
  fetch(url, params, cb) {
    console.log('API Fetching', {url, params});

    let response;
    this._fetchWithTimeout(url, params, cb)
      .then(serverResponse => {
        response = serverResponse;
        if (includes(url, 's3.') && get(params, 'method') === 'PUT') {
          // need not convert resonse to json for s3 response
          return serverResponse;
        }
        return serverResponse.json();
      })
      .then(parsedResponse => {
        //
        if (includes([200, 204, 201], response.status)) {
          return cb(null, parsedResponse);
        }
        if (!includes([200, 201], response.status)) {
          console.error(parsedResponse.message || 'Error Occurred', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        return cb(
          {
            status: response.status,
            statusText: response.statusText,
            detail: parsedResponse.message,
            error_code: parsedResponse.code,
          },
          parsedResponse,
        );
      })
      .catch(err => {
        console.log(err,'EEERR')
        cb(err);
      });
  },
  fetchJSON(path) {
    return fetch(path)
      .then(data => data.text())
      .then(res => {
        return JSON.parse(res);
      });
  },
  /**
   * Used to download file from other URLS
   * @param {*} url
   */
  fetchBlobURL(blobURL, fileName = 'file', extension = 'csv') {
    fetch(blobURL, {
      method: 'GET',
      headers: {'Content-Security-Policy': 'upgrade-insecure-requests'},
    })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.${extension}`;
        document.body.appendChild(a); // to Support Firefox
        a.click();
        a.remove(); // afterwards we remove the element again
      });
  },
  fetchPdfURL(url, fetchOptions, cb) {
    console.log('NANANnn', url);

    return new Promise((resolve, reject) => {
      fetch(url, {method: 'GET'})
        .then(response => {
          console.log('responseAN', response);
          // if (!response.ok) {
          //   throw new Error(`HTTP error! status: ${response.status}, URL: ${url}`);
          // }
          return response.blob();
        })
        .then(blob => {
          console.log('Successfully fetched payslip data:', blob);
          resolve(blob); // Resolve the promise with the blob
        })
        .catch(error => {
          console.error('Error downloading payslip:', error.message);
          reject(error); // Reject the promise with the error
        });
    });
  },
};

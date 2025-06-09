import APIService from '../APIService';
const API_URL="https://api.hr-ms.com"

const LoanServices = {

  getUserDetails() {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/api/v1/booking/user/information`,
          method: 'GET',
        },
        (error, data) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(data);
        },
      );
    });
  },

  postLoanDetails(options) {
    return new Promise((resolve, reject) => {
      console.log('optionsnnd', options);
      APIService.request(
        {
          url: `${API_URL}/v1/employeeloan/`,
          method: 'POST',
          data: options,
        },
        (error, data) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(data);
        },
      );
    });
  },
  getOutstandinBalance(userId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/employeenewloanrequest/calculate_outstanding_amount_empId/?employee_id=${userId}`,
          method: 'GET',
        },
        (error, data) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(data);
        },
      );
    });
  },
  getTotalEmiBalance(userId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/employeenewloanrequest/calculate_emi_amount_empId/?employee_id=${userId}`,
          method: 'GET',
        },
        (error, data) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(data);
        },
      );
    });
  },
  getTotalEmiPaid(userId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/employeenewloanrequest/total_emi_paid_by_empid/?employee_id=${userId}`,
          method: 'GET',
        },
        (error, data) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(data);
        },
      );
    });
  },
  getTotalLoanAmount(userId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/employeenewloanrequest/total_loan_amount_by_empid/?employee_id=${userId}`,
          method: 'GET',
        },
        (error, data) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(data);
        },
      );
    });
  },
  getRunningLoan(userId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/employeenewloanrequest/get_runningloan_requests_empId/?employee_id=${userId}`,
          method: 'GET',
        },
        (error, data) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(data);
        },
      );
    });
  },
  getAllLoan(id) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/employeenewloanrequest/retrieve_by_emp/?employee_id=${id}`,
          method: 'GET',
        },
        (error, data) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(data);
        },
      );
    });
  },
  getRequestedLoan(id) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/employeeloan/retrieve_by_employee_id/?employee_id=${id}`,
          method: 'GET',
        },
        (error, data) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(data);
        },
      );
    });
  },
  getClearedLoan(userId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/employeenewloanrequest/get_clearedloan_requests_empId/?employee_id=${userId}`,
          method: 'GET',
        },
        (error, data) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(data);
        },
      );
    });
  },
  getDeductionLoan(id) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/employeenewloanrequest/upcoming_deduction/?id=${id}`,
          method: 'GET',
        },
        (error, data) => {
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

export default LoanServices;

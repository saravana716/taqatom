import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
import useSWR from 'swr';
import APIService, { getUrlForHeaders } from '../APIService';
import AuthService from '../AuthService';
let API_URL="https://api.hr-ms.com"

const ProfileServices = {
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
  getEmployeeNameDetails() {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/employee/subordinate_to_manager/`,
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
  getResignations(employeeId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/resign/resignation_status_without_pagination/?id=${employeeId}`,
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
  getPayrollHistoryData(empId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/payroll/p1/payruns/emp_history/?emp_id=${empId}`,
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
  getPayrollHistory(empId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/payroll/p1/payruns/emp_history_mobile/?emp_id=${empId}`,
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
  getpayrollDetails(payrollId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/payroll/${payrollId}/`,
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
  getSalaryStructure(earning, id) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/employee/get_salary_components/?q=${earning}&emp=${id}`,
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
  getHolidayDetails(userId, selectedYear) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/holiday/get_holidays/?employee_id=${userId}&year=${selectedYear}`,
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
  getPayrollHistoryFullData(sumId, payrunId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/payroll/p1/payruns/emp_salary_details/?summary_id=${sumId}&payrun_id=${payrunId}`,
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

  // downloadPaySlip(pay_run_id, employee_id) {
  //   
  //   console.log(
  //     `${API_URL}/file/get_all_payslips/?pay_run_id=${pay_run_id}&employee_id=${employee_id}`,
  //   );

  //   return new Promise(async (resolve, reject) => {
  //     resolve({
  //       data: `${API_URL}/file/get_all_payslips/?pay_run_id=${pay_run_id}&employee_id=${employee_id}`,
  //     });

  //     // 

  //     const session = await AuthService.getSessionToken();
  //     const token = await AuthService.getToken();
  //     const domainName = await AuthService.getDomainName();

  //     const res = await fetch(
  //       `${API_URL}/file/get_all_payslips/?pay_run_id=${pay_run_id}&employee_id=${employee_id}`,
  //       {
  //         method: 'GET',
  //         headers: {
  //           sessionToken: session,
  //           Authorization: `Bearer ${token}`,
  //           domainName: domainName,
  //           hostName: domainName,
  //         },
  //       },
  //     );
  //     // const data = await res.json();
  //     // APIService.staticRequest(
  //     //   {
  //     //     url: `${API_URL}/file/get_all_payslips/?pay_run_id=${pay_run_id}&employee_id=${employee_id}`,
  //     //     method: 'GET',
  //     //   },
  //     //   (error, data) => {
  //     //     
  //     //     if (error) {
  //     //       
  //     //       reject(error);
  //     //       return;
  //     //     }
  //     //     
  //     //     resolve(data);
  //     //   },
  //     // );
  //     const pdfBlob = new Blob([get(res, 'data')], {type: 'application/pdf'});
  //     
  //     const pdfurl = URL.createObjectURL(pdfBlob);
  //     
  //     const data = res;
  //     resolve(data);
  //   });
  // },

  // downloadPaySlip(pay_run_id, employee_id) {
  //   
  
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const session = await AuthService.getSessionToken();
  //       const token = await AuthService.getToken();
  //       const domainName = await getUrlForHeaders();
  //       const pdfUrl = `${API_URL}/file/get_all_payslips/?pay_run_id=${pay_run_id}&employee_id=${employee_id}`;
        
  //       
  
  //       const {config, fs} = RNFetchBlob;
  //       const downloadDir =
  //         Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
  
  //       const response = await config({
  //         fileCache: true,
  //         addAndroidDownloads: {
  //           useDownloadManager: true,
  //           notification: true,
  //           path: `${downloadDir}/${`payslip`}.pdf`,
  //           description: 'Downloading PDF file.',
  //         },
  //         path: `${downloadDir}/payslip.pdf`,
  //       }).fetch('GET', pdfUrl, {
  //         sessionToken: session,
  //         Authorization: `Bearer ${token}`,
  //         hostName: domainName,
  //       });
  
  //       );
  //       resolve({
  //         path: response.path(),
  //         success: true,
  //       });
  //     } catch (error) {
  //       
  //       reject(error);
  //     }
  //   });
  // },
  
 downloadPaySlip(pay_run_id, employee_id) {
    

    return new Promise((resolve, reject) => {
      let sessionToken = '';
      let token = '';
      let domainName = '';
      let downloadUri = '';

      AuthService.getSessionToken()
        .then((session) => {
          sessionToken = session;
          return AuthService.getToken();
        })
        .then((tok) => {
          token = tok;
          return getUrlForHeaders();
        })
        .then((domain) => {
          domainName = domain;
          const pdfUrl = `${API_URL}/file/get_all_payslips/?pay_run_id=${pay_run_id}&employee_id=${employee_id}`;
          

          downloadUri = `${FileSystem.documentDirectory}payslip_${pay_run_id}_${employee_id}.pdf`;

          const downloadResumable = FileSystem.createDownloadResumable(
            pdfUrl,
            downloadUri,
            {
              headers: {
                sessionToken: sessionToken,
                Authorization: `Bearer ${token}`,
                hostName: domainName,
              },
            }
          );

          return downloadResumable.downloadAsync();
        })
        .then(({ uri }) => {
          

          if (Platform.OS === 'android') {
            return MediaLibrary.requestPermissionsAsync().then((permission) => {
              if (permission.granted) {
                return MediaLibrary.createAssetAsync(uri).then((asset) => {
                  return MediaLibrary.getAlbumAsync('Download').then((album) => {
                    if (album == null) {
                      return MediaLibrary.createAlbumAsync('Download', asset, false);
                    } else {
                      return MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                    }
                  });
                });
              } else {
                
                return Promise.resolve(); // Continue without saving
              }
            });
          }

          return Promise.resolve();
        })
        .then(() => {
          resolve({
            path: downloadUri,
            success: true,
          });
        })
        .catch((error) => {
          
          reject(error);
        });
    });
  },
  updateClockStatus(options) {
    
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/clockInOut/`,
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
  postResignationDetails(options) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/resign/`,
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
  resetPassword(options) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/tenant/t1/user_changepassword/change_password/`,
          method: 'PUT',
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
  // resetPassword(options) {
  //   return new Promise((resolve, reject) => {
  //     APIService.fetch(
  //       `${API_URL}/tenant/t1/user_password/change_password/`,
  //       {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(options),
  //       },
  //       (error, data) => {
  //         
  //         if (error) {
  //           reject(error);
  //           return;
  //         }
  //         resolve(data);
  //       },
  //     );
  //   });
  // },
  updateProfilePic(code, file) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/employee/getProfileURL/?emp_code=${code}&file_format=png`,
          method: 'GET',
          // data: file,
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
  editUserDetails(file, id) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/employee/${id}/`,
          method: 'PUT',
          data: file,
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

  sendImagesToS3(options) {
    
    return new Promise((resolve, reject) => {
      APIService.fetch(
        options.S3URL,
        {
          method: 'PUT',
          headers: {
            'Content-Type': options.type ? options.type : 'image/jpg',
          },
          body: options.file,
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

  getRecentActivityData(id) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/clockInOut/recents/?emp_id=${id}`,
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
  getTotalExpense(id) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/Expense/total_expense_and_expense_percentage/?employee_id=${id}`,
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
  getTotalPendingExpense(id) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/Expense/get_pending_total_amount/?employee_id=${id}`,
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
  getTotalApprovedExpense(id) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/Expense/get_approved_total_amount/?employee_id=${id}`,
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
  getTotalRejectedExpense(id) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/Expense/get_rejected_total_amount/?employee_id=${id}`,
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
  getExpenseGraph(id) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/Expense/get_sixmonth_expenses/?employee_id=${id}`,
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
  RecentShiftDetails(id) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/emp_schedule/get_today_schedule/?emp_id=${id}`,
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
  getShiftDetails({id, start, end}) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/emp_schedule/get_shift_for_employee/?emp_id=${id}&start_date=${start}&end_date=${end}`,
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
  getAllReports({id, start, end, page, size}) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/reports/first_last/?&start_date=${start}&end_date=${end}&employees=${id}&page=${
            page + 1
          }&page_size=${size}`,
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
  getExpenseDetails(userId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/Expense/retrieve_by_employee_id/?employee_id=${userId}`,
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
  getEmployeeDetailsData(id) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/employee/getBy_empCode/?emp_code=${id}`,
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
  submitExpenseData(options) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/Expense/`,
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
  getEmployeeFullDetails(id) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/v1/employee/${id}/`,
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
  getUserDetailsData(id) {
    
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/tenant/t1/tenantGet/${id}/`,
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
  getRecentActivityAllData({id, start, end}) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/clockInOut/recentByDate/?emp_id=${id}&start=${start}&end=${end}`,
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
  getRecentShiftAllData({id, start, end}) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/emp_schedule/get_schedule_by_date/?emp_id=${id}&start=${start}&end=${end}`,
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

  addManualLogRequest(options) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/manual_log/`,
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

  editManualLogRequest({options, id}) {
    
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/manual_log/${id}/`,
          method: 'PUT',
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

  getManualLogData(employeeId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/manual_log/list_by_employee/?emp_id=${employeeId}`,
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

  addLeaveRequest(options) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/leave/`,
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

  editLeaveRequest({options, id}) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/leave/${id}/`,
          method: 'PUT',
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

  getLeaveData(employeeId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/leave/list_by_employee/?emp_id=${employeeId}`,
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

  addOvertimeRequest(options) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/overtime/`,
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

  editOvertimeRequest({options, id}) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/overtime/${id}/`,
          method: 'PUT',
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

  getOvertimeData(employeeId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/overtime/list_by_employee/?emp_id=${employeeId}`,
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

  addTrainingRequest(options) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/training/`,
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

  editTrainingRequest({options, id}) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/training/${id}/`,
          method: 'PUT',
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

  getTrainingData(employeeId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/training/list_by_employee/?emp_id=${employeeId}`,
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

  getApprovalManualLogData(employeeId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/manual_log/list_for_approver/`,
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

  getApprovalLeaveData(employeeId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/leave/list_for_approver/`,
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

  getApprovalOvertimeData(employeeId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/overtime/list_for_approver/`,
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

  getApprovalTrainingData(employeeId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/training/list_for_approver/`,
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

  postManualLogApprove(options,approveReason) {
    
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/manual_log/approve/`,
          method: 'POST',
          data: {manual_log_ids: [options], reason: approveReason},
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

  postManualLogReject(options,rejectReason) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/manual_log/reject/`,
          method: 'POST',
          data: {manual_log_ids: [options],reason: rejectReason },
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

  postLeaveApprove(options, reason) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/leave/approve/`,
          method: 'POST',
          data: {leave_ids: [options], reason: reason},
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

  postLeaveReject(options, reason) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/leave/reject/`,
          method: 'POST',
          data: {leave_ids: [options], reason: reason},
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

  postOvertimeApprove(options, reason) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/overtime/approve/`,
          method: 'POST',
          data: {overtime_ids: [options], reason: reason},
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

  postOvertimeReject(options, reason) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/overtime/reject/`,
          method: 'POST',
          data: {overtime_ids: [options], reason: reason},
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

  postTrainingApprove(options, reason) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/training/approve/`,
          method: 'POST',
          data: {training_ids: [options], reason: reason},
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

  postTrainingReject(options, reason) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/training/reject/`,
          method: 'POST',
          data: {training_ids: [options], reason: reason},
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

  getPayCodeLists(paycodeIds) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/pay_code/get_paycodes/?&paycode=${paycodeIds}`,
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

  postManualLogRevoke(id) {
    
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/manual_log/revoke/`,
          method: 'POST',
          data: {manual_log_ids: [id]},
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

  postLeaveRevoke(options) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/leave/revoke/`,
          method: 'POST',
          data: {leave_ids: [options]},
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

  postOvertimeRevoke(options) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/overtime/revoke/`,
          method: 'POST',
          data: {overtime_ids: [options]},
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

  postTrainingRevoke(options) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/training/revoke/`,
          method: 'POST',
          data: {training_ids: [options]},
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

  deleteManualRequest({id}) {
    
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/manual_log/${id}/`,
          method: 'DELETE',
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

  deleteLeaveRequest({id}) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/leave/${id}/`,
          method: 'DELETE',
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

  deleteOvertimeRequest({id}) {
    
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/overtime/${id}/`,
          method: 'DELETE',
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

  deleteTrainingRequest({id}) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/training/${id}/`,
          method: 'DELETE',
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

  getLeaveBalance(employeeId) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/attendance/leave_year_balance/get_employee_balance/?emp_id=${employeeId}`,
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

  getNotifications: () => {
    const fetcher = url => {
      return new Promise((resolve, reject) => {
        APIService.request(
          {
            url,
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
    };
    const {data, error, isNotifyLoading, mutate} = useSWR(
      `${API_URL}/notify/notify/unread_notifications/`,
      fetcher,
      {
        refreshInterval: 5000,
      },
    );

    return {
      notifications: data,
      notificationsCount: data?.length,
      isNotifyLoading,
      isError: error,
      mutate,
    };
  },

  markNotifyAsRead(options) {
    return new Promise((resolve, reject) => {
      APIService.request(
        {
          url: `${API_URL}/notify/notify/mark_as_read/`,
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
};

export default ProfileServices;

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { AuthContext } from '../components/AuthContext';

// Import all screens
import ApprovedExpenseScreen from "../components/ApprovedExpenseScreen";
import ClockActivityComponent from "../components/ClockActivityComponent";
import Dashboard from "../components/Dashboard";
import ExpenseComponents from "../components/ExpenseComponents";
import ExpenseScreen from "../components/ExpenseScreen";
import ForgotPassword from "../components/ForgotPassword";
import Holiday from "../components/Holiday";
import AllLoansDetails from "../components/Loan/AllLoansDetails";
import ApplyLoanScreen from "../components/Loan/ApplyLoanScreen";
import ClearedLoan from "../components/Loan/ClearedLoan";
import RequestedLoans from "../components/Loan/RequestedLoans";
import RunningLoans from "../components/Loan/RunningLoans";
import LoanScreen from "../components/LoanScreen";
import Login from "../components/Login";
import Notification from "../components/Notification";
import OtpVerification from "../components/OtpVerification";
import PasswordUpdate from "../components/PasswordUpdate";
import PaySlipComponent from "../components/PaySlipComponent";
import PaySlipScreen from "../components/PaySlipScreen";
import Profile from "../components/Profile";
import ProfileUpdate from "../components/ProfileUpdate";
import RecentResignationComponent from "../components/RecentResignationComponent";
import IndividualResignation from "../components/IndividualResignation";
import ReimbursementScreen from "../components/ReimbursementScreen";
import ResignationScreen from "../components/ResignationScreen";
import AddResignation from "../components/AddResignation";
import RequestScreen from "../components/RequestScreen";
import OverTimeScreen from "../components/OverTimeScreen";
import OvertimeRequestDetails from "../components/OvertimeRequestDetails";
import OverTimeCard from "../components/OverTimeCard";
import OverTimesComponent from "../components/OverTimesComponent";
import ManualLogScreen from "../components/Request/ManualLogScreen";
import Training from "../components/Request/Training";
import TrainingRequestDetails from "../components/Request/TrainingRequestDetails";
import ManualLogRequestDetails from "../components/Request/ManualLogRequestDetails";
import LeaveScreen from "../components/Request/LeaveScreen";
import LeaveRequestDetails from "../components/Request/LeaveRequestDetails";
import Shift from "../components/Shift";
import ApprovalScreen from "../components/ApprovalScreen";
import ReportScreen from "../components/ReportScreen";
import ApprovalManualLogScreen from "../components/Approval/ApprovalManualLogScreen";
import ApprovalLeaveScreen from "../components/Approval/ApprovalLeaveScreen";
import ApprovalLeaveCard from "../components/ApprovalCards/ApprovalLeaveCard";
import ApprovalOvertimeScreen from "../components/Approval/ApprovalOvertimeScreen";
import ApprovalTrainingScreen from "../components/Approval/ApprovalTrainingScreen";
import ApprovalManualCard from "../components/ApprovalCards/ApprovalManualCard";
import ApprovalOvertimeCard from "../components/ApprovalCards/ApprovalOvertimeCard";
import ApprovalTrainingCard from "../components/ApprovalCards/ApprovalTrainingCard";
import SwitchOrganization from "../components/SwitchOrganization";
import NotificationScreen from "../components/NotificationScreen";
import NotificationComponent from "../components/NotificationComponent";
import ApprovalManualLogDetails from "../components/Approval/ApprovalManualLogDetails";
import ApprovalLeaveDetails from "../components/Approval/ApprovalLeaveDetails";
import ApprovalOvertimeDetails from "../components/Approval/ApprovalOvertimeDetails";
import ApprovalTrainingDetails from "../components/Approval/ApprovalTrainingDetails";
import PaySlipPreview from "../components/PaySlipPreview";
import LoanRecoveryDetails from "../components/Loan/LoanRecoveryDetails";

const Stack = createNativeStackNavigator();

const Routing = () => {
  const { isAuthenticated, isOrgSelected, loading } = useContext(AuthContext);

  if (loading) return null; // Can be replaced with splash screen

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isOrgSelected ? (
        // Show organization switch screen first time
        <Stack.Screen name="Organization" component={SwitchOrganization} />
      ) : !isAuthenticated ? (
        // Login flow
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="OtpVerification" component={OtpVerification} />
          <Stack.Screen name="Organization" component={SwitchOrganization} />
        </>
      ) : (
        // Authenticated app screens
        <>
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Holiday" component={Holiday} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="Password" component={PasswordUpdate} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="ProfileUpdate" component={ProfileUpdate} />
          <Stack.Screen name="Shift" component={Shift} />
          <Stack.Screen name="Loan" component={LoanScreen} />
          <Stack.Screen name="ApplyLoanScreen" component={ApplyLoanScreen} />
          <Stack.Screen name="RunningLoans" component={RunningLoans} />
          <Stack.Screen name="ClearedLoans" component={ClearedLoan} />
          <Stack.Screen name="AllLoansDetails" component={AllLoansDetails} />
          <Stack.Screen name="RequestedLoans" component={RequestedLoans} />
          <Stack.Screen name="ExpenseComponents" component={ExpenseComponents} />
          <Stack.Screen name="ApprovedExpenseScreen" component={ApprovedExpenseScreen} />
          <Stack.Screen name="ExpenseScreen" component={ExpenseScreen} />
          <Stack.Screen name="ReimbursementScreen" component={ReimbursementScreen} />
          <Stack.Screen name="PaySlipScreen" component={PaySlipScreen} />
          <Stack.Screen name="ClockActivityComponent" component={ClockActivityComponent} />
          <Stack.Screen name="PaySlipComponent" component={PaySlipComponent} />
          <Stack.Screen name="ResignationScreen" component={ResignationScreen} />
          <Stack.Screen name="RecentResignationComponent" component={RecentResignationComponent} />
          <Stack.Screen name="IndividualResignation" component={IndividualResignation} />
          <Stack.Screen name="AddResignation" component={AddResignation} />
          <Stack.Screen name="RequestScreen" component={RequestScreen} />
          <Stack.Screen name="ManualLogScreen" component={ManualLogScreen} />
          <Stack.Screen name="ManualLogRequestDetails" component={ManualLogRequestDetails} />
          <Stack.Screen name="LeaveScreen" component={LeaveScreen} />
          <Stack.Screen name="LeaveRequestDetails" component={LeaveRequestDetails} />
          <Stack.Screen name="OverTimeScreen" component={OverTimeScreen} />
          <Stack.Screen name="OverTimeCard" component={OverTimeCard} />
          <Stack.Screen name="OverTimesComponent" component={OverTimesComponent} />
          <Stack.Screen name="OvertimeRequestDetails" component={OvertimeRequestDetails} />
          <Stack.Screen name="Training" component={Training} />
          <Stack.Screen name="TrainingRequestDetails" component={TrainingRequestDetails} />
          <Stack.Screen name="ApprovalScreen" component={ApprovalScreen} />
          <Stack.Screen name="ApprovalManualLogScreen" component={ApprovalManualLogScreen} />
          <Stack.Screen name="ApprovalLeaveScreen" component={ApprovalLeaveScreen} />
          <Stack.Screen name="ApprovalLeaveCard" component={ApprovalLeaveCard} />
          <Stack.Screen name="ApprovalManualCard" component={ApprovalManualCard} />
          <Stack.Screen name="ApprovalOvertimeScreen" component={ApprovalOvertimeScreen} />
          <Stack.Screen name="ApprovalTrainingScreen" component={ApprovalTrainingScreen} />
          <Stack.Screen name="ApprovalOvertimeCard" component={ApprovalOvertimeCard} />
          <Stack.Screen name="ApprovalTrainingCard" component={ApprovalTrainingCard} />
          <Stack.Screen name="ApprovalManualLogDetails" component={ApprovalManualLogDetails} />
          <Stack.Screen name="ApprovalLeaveDetails" component={ApprovalLeaveDetails} />
          <Stack.Screen name="ReportScreen" component={ReportScreen} />
          <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
          <Stack.Screen name="NotificationComponent" component={NotificationComponent} />
          <Stack.Screen name="ApprovalOvertimeDetails" component={ApprovalOvertimeDetails} />
          <Stack.Screen name="ApprovalTrainingDetails" component={ApprovalTrainingDetails} />
          <Stack.Screen name="PaySlipPreview" component={PaySlipPreview} />
          <Stack.Screen name="LoanRecoverDetail" component={LoanRecoveryDetails} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Routing;

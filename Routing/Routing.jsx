import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { AuthContext } from '../components/AuthContext';

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
import ManualLogRequestDetails from "../components/Request/ManualLogRequestDetails";
import LeaveScreen from "../components/Request/LeaveScreen";
import LeaveRequestDetails from "../components/Request/LeaveRequestDetails";
import Shift from "../components/Shift";
import SwitchOrganization from "../components/SwitchOrganization";
const Stack = createNativeStackNavigator();

const Routing = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);


  if (loading) return null; // Optional: you can return a splash screen here

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
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
          
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Organization" component={SwitchOrganization} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="OtpVerification" component={OtpVerification} />

        </>
      )}
    </Stack.Navigator>
  );
};

export default Routing;

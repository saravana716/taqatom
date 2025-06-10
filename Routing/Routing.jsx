import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { AuthContext } from '../components/AuthContext';

import ApprovedExpenseScreen from "../components/ApprovedExpenseScreen";
import Dashboard from "../components/Dashboard";
import ExpenseComponents from "../components/ExpenseComponents";
import ExpenseScreen from "../components/ExpenseScreen";
import ReimbursementScreen from "../components/ReimbursementScreen";
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
import Profile from "../components/Profile";
import ProfileUpdate from "../components/ProfileUpdate";
import Shift from "../components/Shift";
import SwitchOrganization from "../components/SwitchOrganization";
const Stack = createNativeStackNavigator();

const Routing = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
console.log("auth",isAuthenticated);

  if (loading) return null; // Optional: you can return a splash screen here

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Holiday" component={Holiday} />
          <Stack.Screen name="OtpVerification" component={OtpVerification} />
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
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Organization" component={SwitchOrganization} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Routing;

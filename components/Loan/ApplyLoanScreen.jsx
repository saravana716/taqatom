import DateTimePicker from "@react-native-community/datetimepicker";
import round from "lodash/round";
import moment from "moment";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import tokens from "@/locales/tokens";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
import LoanServices from "../../Services/API/LoanServices";
import { formatErrorsToToastMessages } from "../../utils/error-format";

export default function ApplyLoanScreen({ navigation }) {
  const selectorid = useSelector(function (data) {
    return data.empid;
  });
    const {t,i18n}=useTranslation()
  const isRTL = i18n.language === 'ar';
  console.log("yyyyyyyyyyyyyyyyyyyy",isRTL);

  const [date, setDate] = useState();
  const [endDate, setEndDate] = useState();
  const [formatExpectDate, setFormatExpectDate] = useState(null);
  const [emiStartDate, setEmiStartDate] = useState();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loanCategory, setLoanCategory] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [interestAmount, setInterestAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [repaymentTerm, setRepaymentTerm] = useState("");
  const [fromDateShow, setFromDateShow] = useState(false);
  const [endDateShow, setEndDateShow] = useState(false);

  function calculateEMIZeroInterest(loanAmount, repaymentPeriod) {
     const {t,i18n}=useTranslation()
      const isRTL = i18n.language === 'ar';
      console.log("yyyyyyyyyyyyyyyyyyyy",isRTL);
    const emi = Math.ceil(loanAmount / repaymentPeriod);
    const totalRepaymentAmount = loanAmount;
    return {
      EMI: round(emi, 2),
      totalRepaymentAmount: round(totalRepaymentAmount, 2),
    };
  }

  function calculateLoanSplitUps(
    loanAmount,
    annualInterestRate,
    repaymentPeriod
  ) {
    if (annualInterestRate <= 0) {
      return calculateEMIZeroInterest(loanAmount, repaymentPeriod);
    }
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const numberOfMonths = repaymentPeriod;
    const emi =
      (loanAmount *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfMonths)) /
      (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1);
    const totalRepaymentAmount = emi * numberOfMonths;
    return {
      EMI: round(emi, 2),
      totalRepaymentAmount: round(totalRepaymentAmount, 2),
    };
  }

  const onChange = (event, selectedDate) => {
    const currentSelectDate = selectedDate || date;
    const formattedDate = moment(currentSelectDate).format("DD MMMM YYYY");
    setFromDateShow(false);
    setDate(currentSelectDate);
    setFormatExpectDate(formattedDate);
  };

  const onChangeEnd = (event, selectedDate) => {
    const currentSelectDate = selectedDate || date;
    setEndDateShow(false);
    setEndDate(currentSelectDate);
    const formattedDate = moment(currentSelectDate).format("DD MMMM YYYY");
    setEmiStartDate(formattedDate);
  };

  const handleSignIn = async () => {
    try {
      if (selectorid && loanCategory && loanAmount && date && endDate) {
        await LoanServices.postLoanDetails({
          employee_id: selectorid,
          loan_category: loanCategory,
          loan_amount: loanAmount,
          predictable_month: moment(date).format("YYYY-MM-DD"),
          terms_month: moment(endDate).format("YYYY-MM-DD"),
          notes: notes,
        });
        Toast.show({
          type: "success",
          text1: "Loan Applied",
          position: "bottom",
        });
        setTimeout(() => {
          navigation.navigate("Loan");
        }, 1000);
      } else {
        Toast.show({
          type: "error",
          text1: "All Fields required",
          position: "bottom",
        });
      }
    } catch (error) {
      
      formatErrorsToToastMessages(error);
    }
  };

  const handleNumberChange = (text) => !isNaN(text) && setLoanAmount(text);
  const handleInterestNumberChange = (text) =>
    !isNaN(text) && setInterestAmount(text);
  const handleInterestMonthChange = (text) =>
    !isNaN(text) && setRepaymentTerm(text);
function navigatepage(params) {
  navigation.navigate("Loan")
}
function openCalculator(params) {
  
}
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>


        <TouchableOpacity onPress={navigatepage}>
        <Icon name="angle-left" size={30} color="#697ce3" />

        </TouchableOpacity>
     
        <Text style={styles.title}>{t(tokens.nav.applyLoan)}</Text>
<TouchableOpacity  onPress={() => {
              setConfirmVisible(true);
            }}>
          <Icon name="calculator" size={20} color="#697ce3" />
        </TouchableOpacity>
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.formContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput
              style={styles.input}
              placeholder={t(tokens.common.loanCategory)}
              onChangeText={setLoanCategory}
            />
            <TextInput
              style={styles.input}
              placeholder={t(tokens.common.loanAmount)}
              value={loanAmount}
              onChangeText={handleNumberChange}
            />
            <TouchableOpacity
              style={styles.input}
              onPress={() => setFromDateShow(true)}
            >
              <Text> {formatExpectDate ? formatExpectDate : t(tokens.common.expectedMonth)}</Text>
          <Icon name="calendar-check-o" size={20} color="lightgray" />

            </TouchableOpacity>
            {fromDateShow && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                is24Hour
                onChange={onChange}
              />
            )}
            <TouchableOpacity
              style={styles.input}
              onPress={() => setEndDateShow(true)}
            >
              <Text>{emiStartDate ? emiStartDate : t(tokens.common.emiStartsFrom)}</Text>
          <Icon name="calendar-check-o" size={20} color="lightgray" />

            </TouchableOpacity>
            {endDateShow && (
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                is24Hour
                display="default"
                onChange={onChangeEnd}
              />
            )}
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder={t(tokens.common.notes)}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSignIn}
            >
              <Text style={styles.submitButtonText}>{t(tokens.nav.applyLoan)}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={confirmVisible}
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>EMI Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Loan Amount"
              keyboardType="numeric"
              value={loanAmount}
              onChangeText={handleNumberChange}
            />
            <TextInput
              style={styles.input}
              placeholder="Interest"
              keyboardType="numeric"
              value={interestAmount}
              onChangeText={handleInterestNumberChange}
            />
            <TextInput
              style={styles.input}
              placeholder="Repayment Terms (Month)"
              keyboardType="numeric"
              value={repaymentTerm}
              onChangeText={handleInterestMonthChange}
            />
            <View style={styles.resultBox}>
              <Text>Total Repay Amount</Text>
              <Text>
                SAR{" "}
                {loanAmount && repaymentTerm
                  ? calculateLoanSplitUps(
                      loanAmount,
                      interestAmount,
                      repaymentTerm
                    ).totalRepaymentAmount
                  : 0}
              </Text>
            </View>
            <View style={styles.resultBox}>
              <Text>EMI</Text>
              <Text>
                SAR{" "}
                {loanAmount && repaymentTerm
                  ? calculateLoanSplitUps(
                      loanAmount,
                      interestAmount,
                      repaymentTerm
                    ).EMI
                  : 0}{" "}
                /per month
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setConfirmVisible(false)}
            >
              <Text style={styles.submitButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8FF",
  },
  headerContainer: {
    width:"100%",
    display:"flex",
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontSize: 20,
    color: "black",
    textAlign: "center",
  },
  bodyContainer: {
    flex: 1,
    padding: 10,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 10,
  },
  input: {
    height: 56,
    borderRadius: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 10,
    display:"flex",
    alignItems:"center",justifyContent:"space-between",flexDirection:"row"
  },
  submitButton: {
    height: 48,
    backgroundColor: "#697CE3",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBox: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign:"center"
  },
  resultBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF0000",
  },
  closeButton: {
    marginTop: 20,
    height: 48,
    backgroundColor: "#697CE3",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
});

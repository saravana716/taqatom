import tokens from "@/locales/tokens";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
export default function PayslipComponent({
  newItem,
  employeeFullDetails,
  payrollData,
}) {
    const {t,i18n}=useTranslation()
    const isRTL = i18n.language === 'ar';
    
  const navigation = useNavigation();


  function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(date);
    return formattedDate;
  }

  const handlePayslipPreview = () => {
    navigation.navigate("PaySlipPreview", {
      newItem,
      employeeFullDetails,
      payrollData,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Image source={require("../assets/images/Assets/table-report.png")} />
        <View style={styles.dateInfo}>
          <Text style={styles.dateText}>
            {formatDate(newItem?.start_date)}
          </Text>
          <Text style={styles.dateRangeText}>
            {newItem?.start_date?.split("T")[0]} - {newItem?.end_date?.split("T")[0]}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handlePayslipPreview}
        style={styles.rightSection}
      >
        <View style={styles.amountInfo}>
          <Text style={styles.amountText}>
            {newItem?.net_pay} SAR
          </Text>
          <Text style={styles.daysText}>
       {t(tokens.messages.paidFor)} {newItem?.total_days??'-'}
            {t(tokens.common.days)}
          </Text>
        </View>
        <Icon name="angle-right" size={30} color="#697ce3" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    marginBottom: 10,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateInfo: {
    marginLeft: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
    color: "#000",
  },
  dateRangeText: {
    fontSize: 10,
    color: "#919EAB",
    fontFamily: "Poppins-SemiBold",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  amountInfo: {
    marginRight: 4,
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
    color: "#000",
  },
  daysText: {
    fontSize: 8,
    color: "#919EAB",
    fontFamily: "Poppins-SemiBold",
  },
});

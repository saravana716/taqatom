import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import tokens from "../../locales/tokens";
import ProfileServices from "../../Services/API/ProfileServices";
import { formatErrorsToToastMessages } from "../../utils/error-format";
import { dateTimeToShow } from "../../utils/formatDateTime";
export default function ApprovalLeaveCard({
  newItem,
  employeeId,
  getLeaveList,
}) {
  const navigation = useNavigation();
  const [approveConfirmVisible, setApproveConfirmVisible] = useState(false);
  const [rejectedConfirmVisible, setRejectedConfirmVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  
  const handleFulldetails = () => {
    navigation.navigate("ApprovalLeaveDetails", {
      employeeId,
      newItem,
      leaveList: getLeaveList,
    });
  };

  const handleApprove = async () => {
    try {
      const response = await ProfileServices.postLeaveApprove(newItem?.id);
      Toast.show({
        type: "success",
        text1: "Approve Success",
        position: "bottom",
      });
      getLeaveList();
      setApproveConfirmVisible(false);
    } catch (error) {
      formatErrorsToToastMessages(error);
      setApproveConfirmVisible(false);
    }
  };

  const handleRejected = async () => {
    try {
      const response = await ProfileServices.postLeaveReject(newItem?.id);
      Toast.show({
        type: "success",
        text1: "Reject Success",
        position: "bottom",
      });
      getLeaveList();
      setRejectedConfirmVisible(false);
    } catch (error) {
      formatErrorsToToastMessages(error);
      setRejectedConfirmVisible(false);
    }
  };

  return (
    <>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          onPress={handleFulldetails}
          activeOpacity={1}
          style={{ width: "100%" }}
        >
          <View style={styles.innerCard}>
            <View style={styles.rowBetween}>
              <View>
                {newItem?.approval_status === 3 && (
                  <Text style={[styles.badge, styles.rejectBadge]}>
                    {t(tokens.actions.reject)}
                  </Text>
                )}
                {newItem?.approval_status === 2 && (
                  <Text style={[styles.badge, styles.approveBadge]}>
                    {t(tokens.actions.approve)}
                  </Text>
                )}
                {newItem?.approval_status === 1 && (
                  <Text style={[styles.badge, styles.pendingBadge]}>
                    {t(tokens.actions.pending)}
                  </Text>
                )}
                {newItem?.approval_status === 4 && (
                  <Text style={[styles.badge, styles.revokeBadge]}>
                    {t(tokens.actions.revoke)}
                  </Text>
                )}
              </View>
              <View>
                <Text style={styles.label}>{t(tokens.common.startDate)}</Text>
                <Text style={styles.value}>
                  {dateTimeToShow(newItem?.start_time)}
                </Text>
              </View>
            </View>

            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.label}>{t(tokens.common.endDate)}</Text>
                <Text style={styles.value}>
                  {dateTimeToShow(newItem?.end_time)}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.label}>{t(tokens.nav.payCode)}</Text>
                <Text style={styles.value}>
                  {newItem?.paycode_details?.name}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderBottomWidth: 4,
    borderBottomColor: "#697CE3",
    marginVertical: 6,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
    borderTopWidth: 0.1,
    borderLeftWidth: 0.1,
    borderRightWidth: 0.1,
    borderTopColor: "#000",
    borderLeftColor: "#000",
    borderRightColor: "#000",
  },
  innerCard: {
    padding: 16,
    borderRadius: 16,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  badge: {
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontWeight: "bold",
    borderWidth: 1,
    overflow: "hidden",
  },
  approveBadge: {
    backgroundColor: "#08CA0F08",
    borderColor: "#08CA0F",
    color: "#08CA0F",
  },
  rejectBadge: {
    backgroundColor: "#E4030308",
    borderColor: "#E40303",
    color: "#E40303",
  },
  pendingBadge: {
    backgroundColor: "#D1A40408",
    borderColor: "#D1A404",
    color: "#D1A404",
  },
  revokeBadge: {
    backgroundColor: "#E4030308",
    borderColor: "#E40303",
    color: "#E40303",
  },
  label: {
    fontSize: 12,
    color: "#888",
    fontWeight: "bold",
  },
  value: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 2,
  },
});

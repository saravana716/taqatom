import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";

export default function ExpenseComponents({ newItem }) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Icon name="money" size={30} color="#697CE3" />
        <View style={styles.info}>
          <Text style={styles.categoryText}>{newItem?.Expense_Category}</Text>
          <Text style={styles.dateText}>{newItem?.Expense_Date}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.rightContent}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>{newItem?.Amount}</Text>

          {newItem?.Status === "Approved" && (
            <Text style={[styles.statusText, styles.approved]}>
              {newItem?.Status}
            </Text>
          )}
          {newItem?.Status === "Paid" && (
            <Text style={[styles.statusText, styles.approved]}>
              {newItem?.Status}
            </Text>
          )}
          {newItem?.Status === "Pending" && (
            <Text style={[styles.statusText, styles.pending]}>
              {newItem?.Status}
            </Text>
          )}
          {newItem?.Status === "Rejected" && (
            <Text style={[styles.statusText, styles.rejected]}>
              {newItem?.Status}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FBFBFB',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    marginBottom: 8,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
  },
  dateText: {
    fontSize: 10,
    color: '#919EAB',
    fontFamily: 'Poppins-SemiBold',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'right',
    fontFamily: 'Poppins-SemiBold',
  },
  statusText: {
    fontSize: 10,
    textAlign: 'center',
    width: 80,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginTop: 4,
    fontFamily: 'Poppins-SemiBold',
    borderWidth: 1,
  },
  approved: {
    color: '#22C55E',
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  pending: {
    color: '#F97316',
    backgroundColor: '#FFEDD5',
    borderColor: '#F97316',
  },
  rejected: {
    color: '#EF4444',
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
});

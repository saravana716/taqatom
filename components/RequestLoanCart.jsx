import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";

export default function RequestLoanCard({ requestLoan, newItem }) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.iconWrapper}>
          <Icon name="money" size={30} color="#6466F1" />
        </View>
        <View style={styles.headerTextContainer}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.amountText}>
              SAR {newItem?.loan_amount}
            </Text>
            <Text style={styles.categoryText}>
              {newItem?.loan_category ? `${newItem?.loan_category}` : ''}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.rowBetween}>
          <View style={styles.interestRateContainer}>
            <Text style={styles.labelText}>Interest Rate</Text>
            <Text style={styles.interestRateText}>
              {newItem?.interest_rate}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <Icon name="circle" size={12} color="#3F3748" />
            <Text style={styles.statusText}>{newItem?.status}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#6466F10D',
    borderRadius: 16,
  },
  headerContainer: {
    backgroundColor: '#6466F1',
    height: 72, // h-18 = 18 * 4 = 72px
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 9999, // fully rounded
  },
  headerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  headerTextBlock: {
    gap: 2,
  },
  amountText: {
    fontSize: 16,
    fontFamily: 'PublicSans-Bold',
    color: 'white',
  },
  categoryText: {
    fontSize: 12,
    color: 'white',
  },
  bodyContainer: {
    padding: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    alignItems: 'center',
  },
  interestRateContainer: {
    gap: 2,
  },
  labelText: {
    fontSize: 12,
    color: 'black',
  },
  interestRateText: {
    fontSize: 14,
    fontFamily: 'PublicSans-Bold',
    color: 'black',
  },
  statusContainer: {
    backgroundColor: '#E4E4E4',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    padding: 4,
    paddingRight: 8,
  },
  statusText: {
    fontSize: 10,
    color: '#3F3748',
    marginLeft: 4,
  },
});

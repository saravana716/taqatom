import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";

export default function LoanCard({ status, requestLoan, newItem }) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
                                    
                                       <Icon name="money" size={30} color="#6466F1" />
               </View>
        <View style={styles.headerTextContainer}>
          <View style={styles.headerTextWrapper}>
            <Text style={styles.loanAmount}>
              SAR {newItem?.loan_amount} {newItem?.loan_category ? `- ${newItem?.loan_category}` : ''}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.label}>EMI Amount</Text>
            <Text style={styles.emiAmount}>SAR {newItem?.emi_amount}</Text>
          </View>
          <View style={styles.alignEnd}>
            <Text style={styles.outstandingLabel}>Outstanding Amount</Text>
            <Text style={styles.outstandingAmount}>{newItem?.outstanding_amount}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.termLabel}>Repayment EMI Term</Text>
          <Text style={styles.termValue}>
            {newItem?.emicompletedterms_inmonth} Out of {newItem?.repaymentterms_inmonth}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          {/* <Iconify icon="radix-icons:dot-filled" size={20} color="#3F3748" /> */}
          <Text style={styles.statusText}>{newItem?.status}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#6466F10D',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#6466F1',
    height: 72,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  iconWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 4,
    borderRadius: 999,
    marginRight: 12,
  },
  headerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  headerTextWrapper: {
    justifyContent: 'center',
  },
  loanAmount: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'PublicSans-Bold',
  },
  body: {
    padding: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#919EAB7A',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#000000',
  },
  emiAmount: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'PublicSans-Bold',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  outstandingLabel: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'PublicSans-Bold',
  },
  outstandingAmount: {
    fontSize: 16,
    color: '#000000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    alignItems: 'center',
  },
  termLabel: {
    fontSize: 10,
    color: '#64748B',
    fontFamily: 'PublicSans-Bold',
  },
  termValue: {
    fontSize: 16,
    fontFamily: 'PublicSans-Bold',
    paddingRight: 8,
  },
  statusContainer: {
    backgroundColor: '#E4E4E4',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 4,
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 10,
    color: '#3F3748',
    paddingLeft: 4,
  },
});

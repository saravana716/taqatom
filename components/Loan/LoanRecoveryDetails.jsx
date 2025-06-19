import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import LoanServices from '../../Services/API/LoanServices';

export default function LoanRecoveryDetails({route}) {
    const {newItem}=route.params
  const [loanDetails, setLoanDetails] = useState([]);
const navigation=useNavigation()
  const handleBack = () => {
navigation.goBack()
  };

  const getUserDetails = async () => {
    console.log(newItem?.id);
    
    try {
      const allLoansList = await LoanServices.getDeductionLoan(newItem?.id);
      setLoanDetails(allLoansList?.emi_schedule);
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                     <Icon name="angle-left" size={35} color="black" />
              </TouchableOpacity>
          <Text style={styles.headerText}>Loan Recovery Details</Text>
        </View>
      </View>

      <View style={styles.contentWrapper}>
        <View style={styles.scrollWrapper}>
          <View style={styles.card}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View>
                <View style={styles.loanTopRow}>
                  <View style={styles.iconWrapper}>
                              <Icon name="money" size={30} color="#6466F1" />
                    
                  </View>
                  <View style={styles.loanTitleBlock}>
                    <Text style={styles.loanAmountText}>
                      SAR {newItem?.loan_amount}{' '}
                      {newItem?.loan_category
                        ? `- ${newItem?.loan_category}`
                        : ''}
                    </Text>
                  </View>
                </View>

                <View style={styles.upcomingRow}>
                     <Icon name="circle" size={14} color="#3AB5D0" />
                 
                  <Text style={styles.upcomingText}>Upcoming Deduction</Text>
                </View>

                {loanDetails && (
                  <View style={styles.installmentsList}>
                    {loanDetails.map((newItem) => (
                      <View style={styles.installmentItem} key={newItem.id}>
                        <View style={styles.installmentCard}>
                          <View>
                            <Text style={styles.installmentAmount}>
                              SAR {newItem?.emi_amount}
                            </Text>
                            <View style={styles.dateRow}>
                              <Text style={styles.dateText}>
                                {newItem?.payroll_month}{' '}
                                {newItem?.emi_deducted_date}
                              </Text>
                                                  <Icon name="circle" size={14} color="#3AB5D0" />

                            </View>
                          </View>
                          <View style={styles.balanceWrapper}>
                            <Text style={styles.balanceLabel}>
                              Balance Amount
                            </Text>
                            <Text style={styles.balanceValue}>
                              SAR {newItem?.outstanding_amount}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 28,
    paddingTop: 28,
    paddingLeft: 16,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'PublicSansBold',
    color: '#000',
    textAlign: 'center',
    paddingLeft: 56,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 8,
    paddingBottom: 80,
    width: '100%',
  },
  scrollWrapper: {
    padding: 8,
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 24,
    flex: 1,
  },
  scrollContent: {
    gap: 8,
  },
  loanTopRow: {
    height: 72,
    padding: 16,
    paddingLeft: 4,
    paddingRight: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#D1D5DB',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  iconWrapper: {
    backgroundColor: '#F3F3FF',
    padding: 8,
    borderRadius: 9999,
  },
  loanTitleBlock: {
    marginLeft: 20,
    flex: 1,
  },
  loanAmountText: {
    fontSize: 18,
    fontFamily: 'PublicSansBold',
    color: '#000000',
  },
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
  },
  upcomingText: {
    fontSize: 16,
    fontFamily: 'PublicSansBold',
    color: '#3F3748',
    marginLeft: 8,
  },
  installmentsList: {
    paddingBottom: 40,
  },
  installmentItem: {
    paddingBottom: 16,
  },
  installmentCard: {
    backgroundColor: '#6466F10D',
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  installmentAmount: {
    fontSize: 18,
    fontFamily: 'PublicSansBold',
    color: '#000000',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#1C2536',
    marginRight: 4,
  },
  balanceWrapper: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
  },
  balanceValue: {
    fontSize: 18,
    fontFamily: 'PublicSansBold',
    color: '#1C2536',
  },
});

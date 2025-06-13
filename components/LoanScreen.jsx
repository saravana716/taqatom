import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Icon from "react-native-vector-icons/FontAwesome";
// import {Iconify} from 'react-native-iconify';
import { useSelector } from 'react-redux';
import LoanServices from '../Services/API/LoanServices';

export default function LoanScreen({navigation}) {
  const { t } = useTranslation();
  const [outstandinBalance, setOutstandinBalance] = useState('');
  const [emiBalance, setEmiBalance] = useState('');
  const [emiPaid, setEmiPaid] = useState('');
  const [loanAmount, setLoanAmount] = useState('');

const selectorid=useSelector(function (data) {
    return data.empid
})



  const handleApplyLoanScreen = (event) => {
 navigation.navigate(event)
  };

  const getOutstandinBalance = async () => {
    try {
      const totalOutstanding = await LoanServices.getOutstandinBalance(selectorid);
      setOutstandinBalance(totalOutstanding);
    } catch (err) {
      
    }
  };
  const getTotalEmiBalance = async () => {
    try {
      const totalEMI = await LoanServices.getTotalEmiBalance(selectorid);
      setEmiBalance(totalEMI);
    } catch (err) {
      
    }
  };
  const getTotalEmiPaid = async () => {
    try {
      const totalEmiPaid = await LoanServices.getTotalEmiPaid(selectorid);
      setEmiPaid(totalEmiPaid);
    } catch (err) {
      
    }
  };
  const getTotalLoanAmount = async () => {
    try {
      const totalLoanAmount = await LoanServices.getTotalLoanAmount(selectorid);
      setLoanAmount(totalLoanAmount);
    } catch (err) {
      
    }
  };

  useEffect(() => {
    getOutstandinBalance();
    getTotalEmiBalance();
    getTotalEmiPaid();
    getTotalLoanAmount();
  }, []);

  const handleRunningLoanScreen = () => {
   
  };
  const handleAllLoanScreen = () => {
   
  };
  const handleClearedLoanScreen = () => {
 
  };
  const handleRequestedLoanScreen = () => {
   
  };

  return (
    <View style={styles.container}>
      <View>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            {/* <Iconify icon="mingcute:left-line" size={30} color="#000" /> */}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loan</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View>
          <View style={styles.cardWrapper}>
            <View style={[styles.card, styles.shadow]}>
              <View style={[styles.cardBorder, { borderLeftColor: '#FF0000' }]}>
                <Text style={styles.cardTitle}>
                  Outstanding Principle Balance
                </Text>
                <Text style={styles.cardValue}>
                  SAR 0
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.cardWrapper}>
            <View style={[styles.card, styles.shadow]}>
              <View style={[styles.cardBorder, { borderLeftColor: '#FF00C7' }]}>
                <Text style={styles.cardTitle}>Total EMI</Text>
                <View style={styles.flexRowAlignEnd}>
                  <Text style={styles.cardValue}>
                    SAR 0
                  </Text>
                  <Text style={styles.cardSmallText}>
                    / perMonth
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.cardWrapper}>
            <View style={[styles.card, styles.shadow]}>
              <View style={[styles.cardBorder, { borderLeftColor: '#DD8C12' }]}>
                <Text style={styles.cardTitle}>Total EMI Paid</Text>
                <Text style={styles.cardValue}>SAR 0</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardWrapper}>
            <View style={[styles.card, styles.shadow]}>
              <View style={[styles.cardBorder, { borderLeftColor: '#DD8C12' }]}>
                <Text style={styles.cardTitle}>Total Loan Amount</Text>
                <Text style={styles.cardValue}>SAR 0</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.scrollViewWrapper}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContent}
            >
              <TouchableOpacity
                onPress={()=>handleApplyLoanScreen("ApplyLoanScreen")}
                style={[styles.listItem, { backgroundColor: '#F7F2FE' }]}
              >
                <Text style={styles.listItemText}>Apply Loan</Text>
                                    <Icon name="angle-right" size={30} color="black" />

                {/* <Iconify icon="mingcute:right-fill" size={25} color="#000" /> */}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={()=>handleApplyLoanScreen("RunningLoans")}
                style={[styles.listItem, { backgroundColor: '#EFF4FF' }]}
              >
                <Text style={styles.listItemText}>Running Loans</Text>
                                    <Icon name="angle-right" size={30} color="black" />

                {/* <Iconify icon="mingcute:right-fill" size={25} color="#000" /> */}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={()=>handleApplyLoanScreen("ClearedLoans")}
                style={[styles.listItem, { backgroundColor: '#F0FAF9' }]}
              >
                <Text style={styles.listItemText}>Cleared Loans</Text>
                                    <Icon name="angle-right" size={30} color="black" />

                {/* <Iconify icon="mingcute:right-fill" size={25} color="#000" /> */}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={()=>handleApplyLoanScreen("AllLoansDetails")}
                style={[styles.listItem, { backgroundColor: '#64A5F10D' }]}
              >
                <Text style={styles.listItemText}>All Loan Details</Text>
                                    <Icon name="angle-right" size={30} color="black" />

                {/* <Iconify icon="mingcute:right-fill" size={25} color="#000" /> */}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={()=>handleApplyLoanScreen("RequestedLoans")}
                style={[styles.listItem, { backgroundColor: '#FFFAEB' }]}
              >
                <Text style={styles.listItemText}>Requested Loans</Text>
                                    <Icon name="angle-right" size={30} color="black" />
                
                {/* <Iconify icon="mingcute:right-fill" size={25} color="#000" /> */}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </View>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 12,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'PublicSans-Bold',
    color: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 20,
    paddingBottom: 80,
    width: '100%',
  },
  cardWrapper: {
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  card: {
    width: '100%',
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    borderRadius: 12,
    height: 80,
  },
  shadow: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardBorder: {
    borderLeftWidth: 4,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingVertical: 4,
    paddingLeft: 8,
  },
  cardTitle: {
    fontSize: 10,
    fontFamily: 'PublicSans-Bold',
    color: '#000',
  },
  cardValue: {
    fontSize: 20,
    fontFamily: 'PublicSans-Bold',
    color: '#000',
  },
  flexRowAlignEnd: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  cardSmallText: {
    fontSize: 12,
    fontFamily: 'PublicSans-Bold',
    color: '#6B7280', // Tailwind gray-500
    marginLeft: 4,
  },
  bottomContainer: {
    paddingHorizontal: 8,
    height: '60%',
  },
  scrollViewWrapper: {
    backgroundColor: '#fff',
    padding: 12,
    flex: 1,
    borderRadius: 24,
    paddingBottom: 96,
  },
  scrollViewContent: {
    rowGap: 12, // space between list items
  },
  listItem: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  listItemText: {
    fontSize: 20,
    fontFamily: 'PublicSans-Bold',
    color: '#000',
  },
});

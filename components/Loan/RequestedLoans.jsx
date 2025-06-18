import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

import RequestLoanCard from '../../components/RequestLoanCart';
import LoanServices from '../../Services/API/LoanServices';

export default function RequestedLoans({ navigation }) {
  const selectorid = useSelector(data => data.empid);
  const [loanDetails, setLoanDetails] = useState([]);

  const handleBack = () => {
    navigation.navigate("Loan"); // updated from Navigation.pop to navigation.goBack
  };

  const getUserDetails = async () => {
    try {
      const allLoansList = await LoanServices.getRequestedLoan(selectorid);

      
      if (allLoansList?.error) {
        setLoanDetails([]);
      } else {
        setLoanDetails(allLoansList);
      }
    } catch (err) {
      
      
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="angle-left" size={35} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Requested Loans</Text>
        </View>
      </View>

      <View style={styles.bodyWrapper}>
        <View style={styles.innerWrapper}>
          <View style={styles.cardBox}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {!isEmpty(loanDetails) ? (
                <View style={styles.loanList}>
                  {loanDetails.reverse().map(newItem => (
                    <View style={styles.loanItem} key={newItem.id}>
                      <RequestLoanCard requestLoan={false} newItem={newItem} />
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No requested loans available</Text>
                </View>
              )}
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
  headerWrapper: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    paddingBottom: 28,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },

  headerText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
  },
  bodyWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 8,
    paddingTop: 20,
    paddingBottom: 80,
    width: '100%',
  },
  innerWrapper: {
    padding: 8,
    height: '100%',
  },
  cardBox: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 24,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loanList: {
    paddingBottom: 40,
  },
  loanItem: {
    paddingBottom: 16,
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 160,
  },
  noDataText: {
    fontSize: 18,
    color: 'black',
  },
});

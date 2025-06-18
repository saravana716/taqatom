import isEmpty from 'lodash/isEmpty';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from 'react-redux';

import LoanCard from '../../components/LoanCart';
import LoanServices from '../../Services/API/LoanServices';

export default function AllLoansDetails({ navigation }) {
  const selectorid = useSelector(data => data.empid);
  const [loanDetails, setLoanDetails] = useState([]);

  const handleBack = () => {
    navigation.navigate("Loan");
  };

  const getUserDetails = async () => {
    try {
      const allLoansList = await LoanServices.getAllLoan(selectorid);
      
      setLoanDetails(allLoansList);
    } catch (err) {
      
      
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="angle-left" size={35} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>All Loan Details</Text>
        </View>
      </View>

      <View style={styles.contentWrapper}>
        <View style={styles.scrollWrapper}>
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {!isEmpty(loanDetails) ? (
                <View style={styles.loanList}>
                  {loanDetails.map(newItem => (
                    <View style={styles.loanCardWrapper} key={newItem.id}>
                      <LoanCard requestLoan={false} newItem={newItem} />
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No loan data available</Text>
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
  headerContainer: {
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
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 8,
    paddingTop: 20,
    paddingBottom: 80,
    width: '100%',
  },
  scrollWrapper: {
    padding: 8,
    height: '100%',
  },
  scrollContainer: {
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
  loanCardWrapper: {
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

import isEmpty from 'lodash/isEmpty';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import LoanCard from '../../components/LoanCart';
import LoanServices from '../../Services/API/LoanServices';

export default function RunningLoans({ navigation }) {
  const selectid = useSelector(data => data.empid);
  const { t } = useTranslation();
  const [loanDetails, setLoanDetails] = useState([]);

  const handleBack = () => {
    navigation.navigate('Loan');
  };

  const getUserDetails = async () => {
    try {
      const allLoansList = await LoanServices.getRunningLoan(selectid);
      setLoanDetails(allLoansList);
    } catch (err) {
      
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const handleLoanRecoveryScreen = newItem => {
    Navigation.push(componentId, {
      component: {
        name: 'LoanRecoveryDetails',
        passProps: {
          newItem,
          selectid,
        },
        options: {
          animations: {
            push: { enabled: false },
            pop: { enabled: false },
          },
          topBar: { visible: false },
          bottomTabs: { visible: false, drawBehind: true },
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="angle-left" size={35} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Running Loans</Text>
      </View>

      <View style={styles.contentWrapper}>
        <View style={styles.contentContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            {!isEmpty(loanDetails) ? (
              <View style={styles.listContainer}>
                {loanDetails.map(newItem => (
                  <View style={styles.listItem} key={newItem.id}>
                    <TouchableOpacity onPress={() => handleLoanRecoveryScreen(newItem)}>
                      <LoanCard
                        status="Pending"
                        requestLoan={false}
                        newItem={newItem}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No running loans data available.</Text>
              </View>
            )}
          </ScrollView>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
 
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  contentWrapper: {
    flex: 1,
    padding: 10,
    paddingBottom: 80,
  },
  contentContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 24,
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  listItem: {
    paddingBottom: 16,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
  },
  noDataText: {
    fontSize: 18,
    color: '#333',
  },
});

import isEmpty from 'lodash/isEmpty';
import React, { useEffect, useState } from 'react';
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

export default function ClearedLoan({ navigation }) {
    const selectorid=useSelector(function (data) {
        return data.empid
    })
    
    
  const [loanDetails, setLoanDetails] = useState([]);

  const handleBack = () => {
    navigation.navigate('Loan');
  };

  const getUserDetails = async () => {
    try {
      const allLoansList = await LoanServices.getClearedLoan(selectorid);
      
      setLoanDetails(allLoansList);
    } catch (err) {
      
      
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="angle-left" size={35} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Cleared Loans</Text>
      </View>

      {/* Main Section */}
      <View style={styles.container}>
        <View style={styles.innerWrapper}>
          <View style={styles.cardWrapper}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {!isEmpty(loanDetails) ? (
                <View style={styles.cardList}>
                  {loanDetails.map((newItem) => (
                    <View style={styles.cardItem} key={newItem.id}>
                      <LoanCard requestLoan={false} newItem={newItem} />
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No cleared loans data available.</Text>
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
  screen: {
    flex: 1,
    backgroundColor: '#F8F8FF',
  },
  header: {
    flexDirection: 'row',
    paddingBottom: 28,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },

  headerText: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 8,
    paddingTop: 20,
    paddingBottom: 80,
  },
  innerWrapper: {
    flex: 1,
    padding: 8,
  },
  cardWrapper: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 24,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cardList: {
    paddingBottom: 40,
  },
  cardItem: {
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    paddingTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#000',
  },
});

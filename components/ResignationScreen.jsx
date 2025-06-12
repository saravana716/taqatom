import map from 'lodash/map';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import isEmpty from 'lodash/isEmpty';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useSelector } from 'react-redux';
import ProfileServices from '../Services/API/ProfileServices';
import RecentResignationComponent from '../components/RecentResignationComponent';

export default function ResignationScreen({navigation}) {
    const employeeFullDetails=useSelector(function (data) {
        return data.employeeFullDetails
    })
  const [dataCheck, setDataCheck] = useState(false);
  const [recentActivityData, setRecentActivityData] = useState([]);

  const AddResignation = async () => {
    navigation.navigate("AddResignation", {
    dataCheck,
    setDataCheck,
  });
  };

  const getResignationList = async () => {
    try {
      const RecentActivities = await ProfileServices.getResignations(employeeFullDetails?.id);
      setRecentActivityData(RecentActivities);
    } catch (error) {
    }
  };

  useEffect(() => {
    getResignationList();
  }, [dataCheck]);

  const handleBack = () => {
    navigation.navigate("Dashboard")
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
         <Icon name="angle-left" size={30} color="black" />
                         </TouchableOpacity>
        <Text style={styles.title}>Resignation</Text>
      </View>

      {/* Scroll Area */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {!isEmpty(recentActivityData) ? (
            <View className="pb-20">
              {map(recentActivityData.slice(), newItem => (
                <View className="" key={newItem.id}>
                  <RecentResignationComponent
                    newItem={newItem}
                    getResignationList={getResignationList}
                  />
                </View>
              ))}
            </View>
          ): (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Resignations</Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity onPress={AddResignation} style={styles.fab}>
        
<Icon name="plus" size={30} color="#697CE3" />
      </TouchableOpacity>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    paddingRight: '15%',
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  listContainer: {
    paddingBottom: 80,
  },
  emptyContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888',
    textAlign: 'center',
  },
 fab: {
  position: 'absolute',
  right: 12,
  top: 12,
  height: 56,
  width: 56,
  borderRadius: 16,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 8, // Android shadow

  // iOS shadow
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 3,
},
});

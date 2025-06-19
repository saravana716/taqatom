import { useNavigation } from '@react-navigation/native';
import get from 'lodash/get';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
export default function ReportsCard({ reportsData }) {
  const navigation = useNavigation();
    const {t,i18n}=useTranslation()
      const isRTL = i18n.language === 'ar';
      
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleCardDetails = () => setIsExpanded(prev => !prev);

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={toggleCardDetails} activeOpacity={1}>
        <View style={styles.cardContent}>
          {/* First and Last Name */}
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>First Name</Text>
              <Text style={styles.value}>{get(reportsData, 'first_name') || '-'}</Text>
            </View>
            <View style={styles.alignRight}>
              <Text style={styles.label}>Last Name</Text>
              <Text style={styles.value}>{get(reportsData, 'last_name') || '-'}</Text>
            </View>
          </View>

          {/* Employee Code & Total Time */}
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Employee Code</Text>
              <Text style={styles.value}>{get(reportsData, 'emp_code')}</Text>
            </View>
            <View style={styles.alignRight}>
              <Text style={styles.label}>Total Time</Text>
              <Text style={styles.value}>{get(reportsData, 'total_time')}</Text>
            </View>
          </View>

          {/* Expanded Details */}
          {isExpanded && (
            <>
              {get(reportsData, 'department_code') && (
                <View style={styles.row}>
                  <View>
                    <Text style={styles.label}>Department Code</Text>
                    <Text style={styles.value}>{get(reportsData, 'department_code')}</Text>
                  </View>
                  <View style={styles.alignRight}>
                    <Text style={styles.label}>Department Name</Text>
                    <Text style={styles.value}>{get(reportsData, 'department_name')}</Text>
                  </View>
                </View>
              )}

              {get(reportsData, 'position_code') && (
                <View style={styles.row}>
                  <View>
                    <Text style={styles.label}>Position Code</Text>
                    <Text style={styles.value}>{get(reportsData, 'position_code')}</Text>
                  </View>
                  <View style={styles.alignRight}>
                    <Text style={styles.label}>Position Name</Text>
                    <Text style={styles.value}>{get(reportsData, 'position_name')}</Text>
                  </View>
                </View>
              )}

              <View style={styles.row}>
                <View>
                  <Text style={styles.label}>Date</Text>
                  <Text style={styles.value}>{get(reportsData, 'att_date')}</Text>
                </View>
                <View style={styles.alignRight}>
                  <Text style={styles.label}>Week Day</Text>
                  <Text style={styles.value}>{get(reportsData, 'weekday')}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View>
                  <Text style={styles.label}>First Punch</Text>
                  <Text style={styles.value}>{get(reportsData, 'first_punch')}</Text>
                </View>
                <View style={styles.alignRight}>
                  <Text style={styles.label}>Last Punch</Text>
                  <Text style={styles.value}>{get(reportsData, 'last_punch')}</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderBottomWidth: 4,
    borderBottomColor: '#697CE3',
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#888',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
    marginTop: 2,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
});

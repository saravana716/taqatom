import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

export default function OverTimesComponent({status}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.projectName}>Project Name.. Project...</Text>
          <Text style={styles.date}>01 Dec 2023</Text>
        </View>
        <View style={styles.rightAlign}>
          <Text style={styles.time}>09:00Am - 06:14Pm</Text>
          <Text style={styles.duration}>09:15 Hrs</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View>
          <Text style={styles.label}>Overtime Code</Text>
          <Text style={styles.value}>3498474646</Text>
        </View>
        <View>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.value}>280 SAR</Text>
        </View>
        <View>
          <Text style={styles.label}>Incharge By</Text>
          <Text style={styles.value}>Martin Luther</Text>
          <Text style={styles.role}>Manager</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#697CE3',
    height: 144,
    width: '100%',
    padding: 16,
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 12,
    alignItems: 'center',
  },
  projectName: {
    fontSize: 14,
    fontFamily: 'PublicSansBold',
  },
  date: {
    fontSize: 12,
    color: '#D1D5DB',
    fontFamily: 'PublicSansBold',
  },
  rightAlign: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    fontFamily: 'PublicSansBold',
  },
  duration: {
    fontSize: 12,
    color: '#D1D5DB',
    fontFamily: 'PublicSansBold',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  label: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'PublicSansBold',
  },
  value: {
    fontSize: 12,
    fontFamily: 'PublicSansBold',
  },
  role: {
    fontSize: 8,
    color: '#9CA3AF',
    fontFamily: 'PublicSansBold',
  },
});

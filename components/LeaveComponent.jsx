import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function LeaveComponent({ status }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>Dec 15, 2023 - Dec 18, 2023</Text>
        </View>

        {status === 'Rejected' && (
          <Text style={[styles.status, styles.rejected]}>Rejected</Text>
        )}
        {status === 'Approved' && (
          <Text style={[styles.status, styles.approved]}>Approved</Text>
        )}
        {status === 'Pending' && (
          <Text style={[styles.status, styles.pending]}>Pending</Text>
        )}
        {status === 'Cancelled' && (
          <Text style={[styles.status, styles.rejected]}>Cancelled</Text>
        )}
      </View>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.label}>Apply Days</Text>
          <Text style={styles.value}>3</Text>
        </View>
        <View>
          <Text style={styles.label}>Leave Balance</Text>
          <Text style={styles.value}>16</Text>
        </View>
        <View>
          <Text style={styles.label}>Approved By</Text>
          <Text style={styles.value}>Martin</Text>
          <Text style={styles.subLabel}>Manager</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#697CE3',
    height: 144, // 36 * 4
    width: '100%',
    padding: 16,
    borderRadius: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingBottom: 12,
    borderColor: '#E5E7EB', // Tailwind gray-200
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  label: {
    fontSize: 12,
    color: '#9CA3AF', // Tailwind gray-400
    fontFamily: 'PublicSans-Bold',
  },
  value: {
    fontSize: 16,
    fontFamily: 'PublicSans-Bold',
    color: '#000',
  },
  subLabel: {
    fontSize: 8,
    color: '#9CA3AF',
    fontFamily: 'PublicSans-Bold',
  },
  status: {
    fontSize: 14,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    fontFamily: 'PublicSans-Bold',
  },
  rejected: {
    backgroundColor: '#E4030308',
    borderColor: '#E40303',
    color: '#E40303',
  },
  approved: {
    backgroundColor: '#08CA0F08',
    borderColor: '#08CA0F',
    color: '#08CA0F',
  },
  pending: {
    backgroundColor: '#D1A40408',
    borderColor: '#D1A404',
    color: '#D1A404',
  },
});

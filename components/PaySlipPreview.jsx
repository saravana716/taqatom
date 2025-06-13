import { useNavigation } from "@react-navigation/native";
import { get } from 'lodash';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { G, Rect, Text as SvgText } from 'react-native-svg';
import { PieChart } from 'react-native-svg-charts';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProfileServices from '../Services/API/ProfileServices';
import { formatErrorsToToastMessages } from '../utils/error-format';

export default function PayslipPreview({
  route
}) {
    const{newItem,
      employeeFullDetails,
      payrollData,}=route.params
    const navigation=useNavigation()
    console.log("news",newItem);
    
  const handleBack = () => {
    navigation.navigate("PaySlipComponent");
  };
const getMediaPermission = async () => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === 'granted';
};
  const earnings = get(newItem, 'earnings');
  const deductions = get(newItem, 'deductions');

  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(date);
  }

 const downloadPDF = async () => {
  try {
    const response = await ProfileServices.downloadPaySlip(
      newItem?.payrun_id,
      employeeFullDetails?.id
    );

    console.log("Download response:", response);

    if (response?.success) {
      Toast.show({
        type: 'success',
        text1: `Payslip downloaded to ${response.path}`,
        position: 'bottom',
      });
    }
  } catch (error) {
    console.error('Error downloading PDF: ', error.message);
    Toast.show({
      type: 'error',
      text1: 'Failed to download payslip',
      text2: error.message,
      position: 'bottom',
    });
  }
};


  const data = [
    {
      key: 'Gross Pay',
      value: newItem?.gross_pay || 0,
      svg: { fill: '#697CE3', innerRadius: '50%', outerRadius: '80%' },
    },
    {
      key: 'Net Pay',
      value: newItem?.net_pay || 0,
      svg: { fill: '#FFC907', innerRadius: '50%', outerRadius: '80%' },
    },
  ];

  const legends = data.map((item, index) => (
    <G key={index} x={index * 100} y={0}>
      <Rect width={10} height={10} fill={item.svg.fill} />
      <SvgText x={15} y={10} fontSize={12} fill={'black'}>
        {item.key}
      </SvgText>
    </G>
  ));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
         <Icon name="angle-left" size={30} color="#697ce3" />
        </TouchableOpacity>
        <Text style={styles.title}>Payslip</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.chartContainer}>
          <View style={styles.pieChartWrapper}>
            <PieChart
              style={{ flex: 1 }}
              data={data}
              padAngle={0}
              innerRadius={'70%'}
            />
          </View>
          <View style={styles.chartInfo}>
            <Text style={styles.monthBox}>
              {formatDate(newItem?.start_date)}
            </Text>
            <View style={styles.payValues}>
              <View style={styles.payRow}>
                <View style={[styles.dot, { backgroundColor: '#697CE3' }]} />
                <View>
                  <Text style={styles.payAmount}>
                    {newItem?.gross_pay || '0'}
                  </Text>
                  <Text style={styles.payLabel}>Gross Pay</Text>
                </View>
              </View>
              <View style={styles.payRow}>
                <View style={[styles.dot, { backgroundColor: '#FFC907' }]} />
                <View>
                  <Text style={styles.payAmount}>
                    {newItem?.net_pay || '0'}
                  </Text>
                  <Text style={styles.payLabel}>Net Pay</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings</Text>
          <View>
            {earnings?.map(item => (
              <View key={item.reference_id} style={styles.row}>
                <Text style={styles.rowText}>
                  {item?.type || item?.component_data?.name}
                </Text>
                <Text style={styles.rowText}>{item?.amount}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deductions</Text>
          <View>
            {deductions?.map(deduct => (
              <View key={deduct.reference_id} style={styles.row}>
                <Text style={styles.rowText}>
                  {deduct?.type || deduct?.component_data?.name}
                </Text>
                <Text style={styles.rowText}>{deduct?.amount}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Toast />
      <View style={styles.buttonWrapper}>
        <TouchableOpacity onPress={downloadPDF} style={styles.downloadButton}>
          <Text style={styles.downloadButtonText}>Download Payslip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F3F4',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 0,
    alignItems: 'center',
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    paddingLeft: 112,
    fontFamily: 'PublicSans-Bold',
    color: '#000',
    textAlign: 'center',
  },
  scrollView: {
    padding: 16,
    flex: 1,
  },
  chartContainer: {
    backgroundColor: '#fff',
    height: 160,
    padding: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pieChartWrapper: {
    width: '35%',
  },
  chartInfo: {
    width: '65%',
    paddingRight: 16,
    justifyContent: 'center',
    gap: 16,
  },
  monthBox: {
    fontSize: 14,
    padding: 4,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 12,
    fontFamily: 'PublicSans-Bold',
    color: '#000',
    textAlign: 'center',
  },
  payValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 9999,
    marginRight: 4,
  },
  payAmount: {
    fontSize: 14,
    fontFamily: 'PublicSans-Bold',
    color: '#000',
  },
  payLabel: {
    fontSize: 8,
    fontFamily: 'PublicSans-Bold',
    color: '#9CA3AF',
  },
  section: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PublicSans-Bold',
    color: '#697CE3',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    width: '100%',
  },
  rowText: {
    fontSize: 14,
    fontFamily: 'PublicSans-Bold',
    color: '#000',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  downloadButton: {
    backgroundColor: '#697CE3',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    width: '100%',
  },
  downloadButtonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
});

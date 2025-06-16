import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import tokens from '../../locales/tokens';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import ProfileServices from '../../Services/API/ProfileServices';
import ApprovalManualCard from '../../components/ApprovalCards/ApprovalManualCard';
import { formatErrorsToToastMessages } from '../../utils/error-format';

export default function ApprovalManualLogScreen({ navigation }) {
  const selectorid = useSelector((data) => data.empid);
    const {t,i18n}=useTranslation()
    const isRTL = i18n.language === 'ar';
    console.log("yyyyyyyyyyyyyyyyyyyy",isRTL);
  
  const [workCode, setWorkCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [manualLogData, setManualLogData] = useState([]);

  const handleBack = () => {
    navigation.navigate('ApprovalScreen');
  };

  const getManualLogList = async () => {
    setIsLoading(true);
    try {
      const RecentActivities = await ProfileServices.getApprovalManualLogData(
        selectorid
      );
      
      
      setManualLogData(RecentActivities?.results);
    } catch (error) {
      formatErrorsToToastMessages(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getManualLogList();
  }, []);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack}>
            <Icon name="angle-left" size={30} color="#697ce3" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
{t(tokens.nav.manualLog)}

          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#697CE3" />
          </View>
        ) : isEmpty(manualLogData) ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
          {t(tokens.messages.noManualLog)}

            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}>
            {manualLogData.map((newItem) => (
              <View style={styles.cardWrapper} key={newItem?.id}>
                <ApprovalManualCard
                  newItem={newItem}
                  employeeId={selectorid}
                  componentId={''} // replace with actual componentId if needed
                  getManualLogList={getManualLogList}
                />
              </View>
            ))}
          </ScrollView>
        )}

        <Toast />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingBottom: 48,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
    paddingRight: '15%',
  },
  loadingContainer: {
    width: '100%',
    height: '88%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: '100%',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 40,
    color: '#000',
  },
  scrollContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    height: '88%',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  cardWrapper: {
    paddingBottom: 24,
  },
});

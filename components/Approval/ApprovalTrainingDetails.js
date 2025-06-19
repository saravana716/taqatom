import find from 'lodash/find';
import get from 'lodash/get';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import tokens from '@/locales/tokens';
import { useTranslation } from 'react-i18next';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import ProfileServices from '../../Services/API/ProfileServices';
import { formatErrorsToToastMessages } from '../../utils/error-format';
import { dateTimeToShow } from '../../utils/formatDateTime';
export default function ApprovalTrainingDetails({ navigation, route }) {
    const { newItem, employeeId, componentId, getTrainingList } = route.params;
    const [isLoading, setIsLoading] = useState(false);
    const handleBack = () => {
        Navigation.pop(componentId);
    };
     const {t,i18n}=useTranslation()
        const isRTL = i18n.language === 'ar';
        
    const [approveConfirmVisible, setApproveConfirmVisible] = useState(false);
    const [rejectedConfirmVisible, setRejectedConfirmVisible] = useState(false);
    const [trainingData, setTrainingData] = useState([]);
    const matchedData = find(trainingData, log => log?.id === newItem?.id);
    const [approveReason, setApproveReason] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const showApproveConfirmDialog = () => {
        setApproveConfirmVisible(true);
    };

    const showRejectedConfirmDialog = () => {
        setRejectedConfirmVisible(true);
    };

    const handleTrainingScreen = () => {
        Navigation.pop(componentId);
    };
    const handleApprove = async () => {
        if (!approveReason.trim()) {
            setErrorMessage('Reason is required');
            return;
        }
        try {
            const response = await ProfileServices.postTrainingApprove(
                matchedData?.id,
                approveReason,
            );
            getTrainingData();
            setApproveConfirmVisible(false);
            Toast.show({
                type: 'success',
                text1: 'Approve Success',
                position: 'bottom',
            });
            getTrainingList();
            setApproveReason('');
        } catch (error) {
            setApproveConfirmVisible(false);
            formatErrorsToToastMessages(error);
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            setErrorMessage('Reason is required');
            return;
        }
        try {
            const response = await ProfileServices.postTrainingReject(
                matchedData?.id,
                rejectReason,
            );
            getTrainingData();
            setRejectedConfirmVisible(false);
            Toast.show({
                type: 'success',
                text1: 'Reject Success',
                position: 'bottom',
            });
            getTrainingList();
            setRejectReason('');
        } catch (error) {
            setRejectedConfirmVisible(false);
            formatErrorsToToastMessages(error);
        }
    };

    const getTrainingData = async () => {
        try {
            const RecentActivities = await ProfileServices.getApprovalTrainingData(
                employeeId,
            );
            setTrainingData(RecentActivities?.results);
        } catch (error) { }
    };
    useEffect(() => {
        getTrainingData();
    }, []);

    return (
        <>
            {!matchedData ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#697CE3" />
                </View>
            ) : (
                <View style={styles.mainContainer}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <Icon name="angle-left" size={30} color="#697ce3" />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>
              {t(tokens.actions.view)}
                            
                        </Text>
                    </View>
                    <View style={styles.contentArea}>
                        <View style={styles.card}>
                            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                                <View style={styles.detailsContainer}>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>
                        {t(tokens.charts.approvalStatus)}
                                            
                                        </Text>
                                        {matchedData?.approval_status === 3 && (
                                            <Text style={[styles.statusText, styles.rejectedStatus]}>
                          {t(tokens.actions.reject)}
                                                
                                            </Text>
                                        )}
                                        {matchedData?.approval_status === 2 && (
                                            <Text style={[styles.statusText, styles.approvedStatus]}>
                          {t(tokens.actions.approve)}
                                                
                                            </Text>
                                        )}
                                        {matchedData?.approval_status === 1 && (
                                            <Text style={[styles.statusText, styles.pendingStatus]}>
                          {t(tokens.actions.pending)}
                                                
                                            </Text>
                                        )}
                                        {matchedData?.approval_status === 4 && (
                                            <Text style={[styles.statusText, styles.revokedStatus]}>
                          {t(tokens.actions.revoke)}
                                                
                                            </Text>
                                        )}
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>
                        {t(tokens.common.firstName)}
                                            
                                        </Text>
                                        <Text style={styles.detailValue}>
                                            {get(matchedData, 'first_name')}
                                        </Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>
                        {t(tokens.common.lastName)}
                                            
                                        </Text>
                                        <Text style={styles.detailValue}>
                                            {get(matchedData, 'last_name') || '-'}
                                        </Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>
                        {t(tokens.common.employeeCode)}
                                            
                                        </Text>
                                        <Text style={styles.detailValue}>
                                            {get(matchedData, 'emp_code')}
                                        </Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>
                        {t(tokens.nav.department)}
                                            
                                        </Text>
                                        <Text style={styles.detailValue}>
                                            {get(matchedData, 'department_info.department_name')}
                                        </Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>
                        {t(tokens.common.startTime)}
                                            
                                        </Text>
                                        <Text style={styles.detailValue}>
                                            {dateTimeToShow(matchedData?.start_time)}
                                        </Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>
                        {t(tokens.common.endTime)}
                                            
                                        </Text>
                                        <Text style={styles.detailValue}>
                                            {dateTimeToShow(matchedData?.end_time)}
                                        </Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>
                        {t(tokens.nav.payCode)}
                                            
                                        </Text>
                                        <Text style={styles.detailValue}>
                                            {matchedData?.paycode_details?.name}
                                        </Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>
                        {t(tokens.common.reason)}
                                            
                                        </Text>
                                        <Text style={styles.detailValue}>
                                            {matchedData?.apply_reason || '-'}
                                        </Text>
                                    </View>
                                </View>
                            </ScrollView>
                            <View>
                                {matchedData?.approval_status === 1 && (
                                    <View style={styles.actionButtonsContainer}>
                                        <TouchableOpacity
                                            onPress={showRejectedConfirmDialog}
                                            style={[styles.actionButton, styles.rejectButtonBorder]}
                                        >
                                            <Text style={styles.rejectButtonText}>
                        {t(tokens.actions.reject)}
                                                
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            disabled={isLoading}
                                            onPress={showApproveConfirmDialog}
                                            style={[styles.actionButton, styles.approveButtonBackground]}
                                        >
                                            {isLoading ? (
                                                <ActivityIndicator size="large" color="#697CE3" />
                                            ) : (
                                                <Text style={styles.approveButtonText}>
                          {t(tokens.actions.approve)}
                                                    
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                            <Toast />
                            <Modal
                                animationType={'fade'}
                                visible={approveConfirmVisible}
                                transparent
                                onRequestClose={() => {
                                    setApproveConfirmVisible(!approveConfirmVisible);
                                }}>
                                <View style={styles.modalOverlay}>
                                    <View style={styles.modalContent}>
                                        <Text style={styles.modalTitle}>
                        {t(tokens.actions.approve)}
                                            
                                        </Text>
                                        <Text style={styles.modalMessage}>
                        {t(tokens.messages.approveConfirm)}
                                            
                                        </Text>
                                        <View style={styles.modalTextInputContainer}>
                                            <TextInput
                                                style={styles.modalTextInput}
                                                placeholder="Enter reason"
                                                value={approveReason}
                                                onChangeText={text => {
                                                    setApproveReason(text);
                                                    setErrorMessage('');
                                                }}
                                            />
                                            {errorMessage ? (
                                                <Text style={styles.errorMessageText}>
                                                    {errorMessage}
                                                </Text>
                                            ) : null}
                                        </View>
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setApproveConfirmVisible(false);
                                                }}
                                                style={[styles.modalButton, styles.modalCancelButtonBorder]}
                                            >
                                                <Text style={styles.modalCancelButtonText}>
                            {t(tokens.actions.cancel)}
                                                    
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                disabled={isLoading}
                                                onPress={handleApprove}
                                                style={[styles.modalButton, styles.modalApproveButtonBackground]}
                                            >
                                                {isLoading ? (
                                                    <ActivityIndicator size="large" color="#697CE3" />
                                                ) : (
                                                    <Text style={styles.modalApproveButtonText}>
                              {t(tokens.actions.approve)}
                                                        
                                                    </Text>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>

                            <Modal
                                animationType={'fade'}
                                visible={rejectedConfirmVisible}
                                transparent
                                onRequestClose={() => {
                                    setRejectedConfirmVisible(!rejectedConfirmVisible);
                                }}>
                                <View style={styles.modalOverlay}>
                                    <View style={styles.modalContent}>
                                        <Text style={styles.modalTitle}>
                        {t(tokens.actions.reject)}
                                            
                                        </Text>
                                        <Text style={styles.modalMessage}>
                                                                   {t(tokens.messages.rejectConfirm)}

                                        </Text>
                                        <View style={styles.modalTextInputContainer}>
                                            <TextInput
                                                style={styles.modalTextInput}
                                                placeholder="Enter reason"
                                                value={rejectReason}
                                                onChangeText={text => {
                                                    setRejectReason(text);
                                                    setErrorMessage('');
                                                }}
                                            />
                                            {errorMessage ? (
                                                <Text style={styles.errorMessageText}>
                                                    {errorMessage}
                                                </Text>
                                            ) : null}
                                        </View>
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setRejectedConfirmVisible(false);
                                                }}
                                                style={[styles.modalButton, styles.modalCancelButtonBorder]}
                                            >
                                                <Text style={styles.modalCancelButtonText}>
                            {t(tokens.actions.cancel)}
                                                    
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                disabled={isLoading}
                                                onPress={handleReject}
                                                style={[styles.modalButton, styles.modalRejectButtonBackground]}
                                            >
                                                {isLoading ? (
                                                    <ActivityIndicator size="large" color="#697CE3" />
                                                ) : (
                                                    <Text style={styles.modalApproveButtonText}>
                              {t(tokens.actions.reject)}
                                                        
                                                    </Text>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    </View>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainContainer: {
        backgroundColor: '#F1F3F4',
        height: '100%',
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        paddingBottom: 28, // pb-7 * 4
        paddingHorizontal: 20, // p-5 * 4
        alignItems: 'center',
    },
    backButton: {
        paddingLeft: 4, // pl-1 * 4
    },
    headerText: {
        fontSize: 20, // text-xl
        width: '100%',
        // fontFamily: 'PublicSansBold', // Assuming you have this font linked
        color: 'black',
        textAlign: 'center',
        paddingRight: '15%', // pr-[15%]
    },
    contentArea: {
        padding: 16, // p-4
        height: '100%', // h-full
        maxHeight: '90%', // h-[90vh] - approximated for RN
    },
    card: {
        flex: 1,
        height: '100%', // h-full
        backgroundColor: 'white',
        borderRadius: 24, // rounded-3xl
    },
    scrollViewContent: {
        padding: 16, // p-4
        flexGrow: 1, // h-full flex-1
    },
    detailsContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16, // rounded-2xl
        width: '100%',
        justifyContent: 'flex-start',
        padding: 12, // p-3
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#F1F3F4', // border-white (this might be a slight approximation as Tailwind's border-white usually means a white border, which might not be visible on a white background unless it's a subtle shade)
        alignItems: 'center',
        width: '100%',
        paddingVertical:20
    },
    detailLabel: {
        fontSize: 12, // text-xs
        color: '#A0A0A0', // text-gray-400
        // fontFamily: 'PublicSansBold',
    },
    detailValue: {
        fontSize: 12, // text-xs
        // fontFamily: 'PublicSansBold',
    },
    statusText: {
        fontSize: 12, // text-xs
        borderWidth: 1,
        padding: 4, // p-1
        paddingHorizontal: 8, // pl-2 pr-2
        borderRadius: 8, // rounded-lg
        // fontFamily: 'PublicSansBold',
    },
    rejectedStatus: {
        backgroundColor: 'rgba(228, 3, 3, 0.031)', // bg-[#E4030308]
        borderColor: '#E40303', // border-[#E40303]
        color: '#E40303', // text-[#E40303]
    },
    approvedStatus: {
        backgroundColor: 'rgba(8, 202, 15, 0.031)', // bg-[#08CA0F08]
        borderColor: '#08CA0F', // border-[#08CA0F]
        color: '#08CA0F', // text-[#08CA0F]
    },
    pendingStatus: {
        backgroundColor: 'rgba(209, 164, 4, 0.031)', // bg-[#D1A40408]
        borderColor: '#D1A404', // border-[#D1A404]
        color: '#D1A404', // text-[#D1A404]
    },
    revokedStatus: {
        backgroundColor: 'rgba(228, 3, 3, 0.031)', // bg-[#E4030308]
        borderColor: '#E40303', // border-[#E40303]
        color: '#E40303', // text-[#E40303]
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: 12, // gap-3
        justifyContent: 'space-between',
        paddingBottom: 20, // pb-5
        paddingHorizontal: 12, // pl-3 pr-3
    },
    actionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40, // h-10
        flex: 1,
        padding: 8, // p-2
        borderRadius: 8, // rounded-lg
    },
    rejectButtonBorder: {
        borderWidth: 1,
        borderColor: '#FF0000', // border-[#FF0000]
    },
    rejectButtonText: {
        fontSize: 12, // text-xs
        color: '#FF0000', // text-[#FF0000]
        // fontFamily: 'semibold-poppins',
    },
    approveButtonBackground: {
        backgroundColor: '#697CE3', // bg-[#697CE3]
    },
    approveButtonText: {
        fontSize: 12, // text-xs
        color: 'white', // text-white
        // fontFamily: 'semibold-poppins',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        alignItems: 'center',
        backgroundColor: 'white',
        marginVertical: 60,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 7,
        width: '90%',
        elevation: 10,
        paddingHorizontal: 20, // paddingX: 20
        paddingTop: 20,
        paddingBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalMessage: {
        marginTop: 10,
        fontSize: 16,
    },
    modalTextInputContainer: {
        paddingHorizontal: 8, // pl-2 pr-2
        width: '100%',
    },
    modalTextInput: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
        paddingHorizontal: 10,
        width: '100%',
    },
    errorMessageText: {
        color: 'red',
        marginTop: 5,
        paddingLeft: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'flex-end',
        width: '100%',
        gap: 20,
        padding: 9,
    },
    modalButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80, // w-20
        height: 40, // h-10
        padding: 8, // p-2
        borderRadius: 8, // rounded-lg
    },
    modalCancelButtonBorder: {
        borderWidth: 1,
        borderColor: '#697CE3', // border-[#697CE3]
    },
    modalCancelButtonText: {
        fontSize: 12, // text-xs
        color: '#697CE3', // text-[#697CE3]
        // fontFamily: 'semibold-poppins',
    },
    modalApproveButtonBackground: {
        backgroundColor: '#697CE3', // bg-[#697CE3]
    },
    modalRejectButtonBackground: {
        backgroundColor: '#cf3636', // bg-[#cf3636]
    },
});
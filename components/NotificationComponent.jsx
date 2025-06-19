import { useNavigation } from '@react-navigation/native';
import get from 'lodash/get';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import AntDesign from 'react-native-vector-icons/AntDesign'; // Using AntDesign for the close icon
import ProfileServices from '../Services/API/ProfileServices';
import { formatErrorsToToastMessages } from '../utils/error-format';
import {
    convertUtcToLocalTime,
    dateTimeToShow,
} from '../utils/formatDateTime';

export default function NotificationComponent({
    status,
    notify,
    mutate,
    // Removed componentId as it's not needed with React Navigation's useNavigation hook
    employeeId,
    setProfilePicUrl,
    employeeFullDetails,
    userDetails,
    profilePicUrl,
    setUpdateKey,
    updateKey,
    setGender,
    gender,
    subordinateName,
    setSubordinateName,
    token,
}) {
    const [isHovered, setIsHovered] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const navigation = useNavigation(); // Hook to access navigation object

    const handleRemoveOne = async notificationId => {
        setIsRemoving(true);
        try {
            const options = {
                notification_ids: [notificationId],
            };
            await ProfileServices.markNotifyAsRead(options);
            mutate();
            Toast.show({
                type: 'success',
                text1: 'Marked as read',
                position: 'bottom',
            });
        } catch (error) {
            formatErrorsToToastMessages(error);
        } finally {
            setIsRemoving(false);
        }
    };

    // With React Navigation, you don't typically define "common navigation options"
    // like animations, topBar, bottomTabs here. These are configured in your
    // Navigator (e.g., Stack.Navigator, Tab.Navigator) itself.
    // If you need specific screen options, you set them within the Stack.Screen component
    // or using navigation.setOptions() inside the screen component.
    // For now, we'll remove this constant as it's not applicable to navigate().

    const handleManualLogScreen = useCallback(() => {
        navigation.navigate("ApprovalManualLogScreen", { employeeId });
    }, [navigation, employeeId]);

    const handleLeaveScreen = useCallback(() => {
        navigation.navigate("ApprovalLeaveScreen", { employeeId });
    }, [navigation, employeeId]);

    const handleOvertimeScreen = useCallback(() => {
        navigation.navigate("ApprovalOvertimeScreen", { userId: employeeId });
    }, [navigation, employeeId]);

    const handleTrainingScreen = useCallback(() => {
        navigation.navigate("ApprovalTrainingScreen", { userId: employeeId });
    }, [navigation, employeeId]);

    const handleReqManualLogScreen = useCallback(() => {
        navigation.navigate("ManualLogScreen", { employeeId });
    }, [navigation, employeeId]);

    const handleReqLeaveScreen = useCallback(() => {
        navigation.navigate("LeaveScreen", { employeeId });
    }, [navigation, employeeId]);

    const handleReqOvertimeScreen = useCallback(() => {
        navigation.navigate("OvertimeScreen", { userId: employeeId });
    }, [navigation, employeeId]);

    const handleReqTrainingScreen = useCallback(() => {
        navigation.navigate("TrainingScreen", { userId: employeeId });
    }, [navigation, employeeId]);

    const handleProfileScreen = useCallback(() => {
        navigation.navigate("SettingsScreen", {
            setProfilePicUrl: val => setProfilePicUrl(val),
            employeeFullDetails,
            userDetails,
            profilePicUrl,
            setUpdateKey,
            updateKey,
            setGender: val => setGender(val),
            gender,
            subordinateName,
            setSubordinateName,
            token,
        });
    }, [
        navigation,
        setProfilePicUrl,
        employeeFullDetails,
        userDetails,
        profilePicUrl,
        setUpdateKey,
        updateKey,
        setGender,
        gender,
        subordinateName,
        setSubordinateName,
        token,
    ]);

    const handleShiftScreen = useCallback(() => {
        navigation.navigate("ShiftScreen", { userId: employeeId });
    }, [navigation, employeeId]);

    const handlePayslipScreen = useCallback(() => {
        navigation.navigate("PaySlipScreen", { employeeFullDetails: employeeFullDetails });
    }, [navigation, employeeFullDetails]);

    const navigateBasedOnLink = useCallback(link => {
        
        const paths = link?.split('/')?.filter(Boolean);
        

        if (paths?.includes('employeeApproval')) {
            if (paths?.includes('manualLog')) {
                handleManualLogScreen();
            } else if (paths?.includes('leave')) {
                handleLeaveScreen();
            } else if (paths?.includes('overtime')) {
                handleOvertimeScreen();
            } else if (paths?.includes('training')) {
                handleTrainingScreen();
            } else if (paths?.includes('resign')) {
                handleTrainingScreen(); // Original code navigates to TrainingScreen for 'resign'
            }
        } else if (paths?.includes('request')) {
            if (paths?.includes('manualLog')) {
                handleReqManualLogScreen();
            } else if (paths?.includes('leave')) {
                handleReqLeaveScreen();
            } else if (paths?.includes('overtime')) {
                handleReqOvertimeScreen();
            } else if (paths?.includes('training')) {
                handleReqTrainingScreen();
            }
        } else if (paths?.includes('orgStructure')) {
            if (paths?.includes('employeeView')) {
                handleProfileScreen();
            }
        } else if (paths?.includes('employeeShift')) {
            if (paths?.includes('details')) {
                handleShiftScreen();
            }
        } else if (paths?.includes('payroll')) {
            if (paths?.includes('payslips')) {
                handlePayslipScreen();
            }
        } else {
            
        }
    }, [
        handleManualLogScreen,
        handleLeaveScreen,
        handleOvertimeScreen,
        handleTrainingScreen,
        handleReqManualLogScreen,
        handleReqLeaveScreen,
        handleReqOvertimeScreen,
        handleReqTrainingScreen,
        handleProfileScreen,
        handleShiftScreen,
        handlePayslipScreen
    ]);

    return (
        <>
            {isRemoving ? (
                <ActivityIndicator size="small" color="#000" />
            ) : (
                <View style={styles.container}>
                    <View style={styles.notificationCard}>
                        <View style={styles.contentWrapper}>
                            <View style={styles.textContainer}>
                                <Text style={styles.senderText}>
                                    {get(notify, 'system_sender')}
                                </Text>
                                <Text style={styles.contentText}>
                                    {get(notify, 'content')}
                                </Text>
                                <View style={styles.bottomRow}>
                                    <View style={styles.dateContainer}>
                                        <Text style={styles.dateText}>
                                            {dateTimeToShow(
                                                convertUtcToLocalTime(get(notify, 'notification_time')),
                                            )}
                                        </Text>
                                    </View>
                                    {get(notify, 'link') === '/attendance/employeeApproval/resign' ? (
                                        <TouchableOpacity style={styles.linkButton}>
                                            <Text style={styles.linkText}>Check Web</Text>
                                        </TouchableOpacity>
                                    ) : get(notify, 'link') ? (
                                        <TouchableOpacity
                                            style={styles.linkButton}
                                            onPress={() => navigateBasedOnLink(get(notify, 'link'))}>
                                            <Text style={styles.linkText}>
                                                Go to Screen
                                            </Text>
                                        </TouchableOpacity>
                                    ) : null}
                                </View>
                            </View>
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={() => handleRemoveOne(get(notify, 'id'))}
                                style={styles.closeButton}>
                                <AntDesign name="close" size={16} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    notificationCard: {
        backgroundColor: '#F1F3F4',
        flexDirection: 'row',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    contentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    textContainer: {
        width: '100%',
        marginLeft: 12,
    },
    senderText: {
        fontSize: 20,
        // fontFamily: 'PublicSansBold',
        marginBottom: 4,
    },
    contentText: {
        fontSize: 12,
        color: '#919EAB',
        marginBottom: 4,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateContainer: {
        width: 'auto',
    },
    dateText: {
        fontSize: 12,
    },
    linkButton: {
        width: 'auto',
        marginLeft: 4,
    },
    linkText: {
        fontSize: 12,
        color: '#3B82F6',
    },
    closeButton: {
        paddingBottom: 10,
    },
});
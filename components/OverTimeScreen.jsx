import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import DateTimePicker from "@react-native-community/datetimepicker";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import { Dropdown } from "react-native-element-dropdown";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useSelector } from "react-redux";
import OvertimeCard from "../components/OverTimeCard";
import ProfileServices from "../Services/API/ProfileServices";
import { formatErrorsToToastMessages } from "../utils/error-format";
import { dateTimeToShow, formatDateTime } from "../utils/formatDateTime";

export default function OvertimeScreen({ navigation }) {
    const selectorid= useSelector(function (data) {
        return data.empid
    })
  const [modalVisible, setModalVisible] = useState(false);
  const [startDatePicker, setStartDatePicker] = useState(false);
  const [startTimePicker, setStartTimePicker] = useState(false);
  const [endDatePicker, setEndDatePicker] = useState(false);
  const [endTimePicker, setEndTimePicker] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [payCode, setPayCode] = useState("");
  const [applyReason, setApplyReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [timeStart, setTimeStart] = useState(new Date());
  const [timeEnd, setTimeEnd] = useState(new Date());
  const [OvertimeData, setOvertimeData] = useState([]);
  const [payCodesList, setPayCodesList] = useState([]);
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setendDateError] = useState("");
  const [payCodeError, setPayCodeError] = useState("");

  const handleBack = () => navigation.navigate("RequestScreen");

  const onStartDateChange = useCallback((event, selectedDate) => {
    if (selectedDate) {
      setStartDate(selectedDate);
      setStartDatePicker(false);
      setStartTimePicker(true);
    } else {
      setStartDatePicker(false);
    }
  }, []);

  const onStartTimeChange = useCallback(
    (event, selectedTime) => {
      if (event.type === "set" && selectedTime) {
        const combinedDateTime = new Date(startDate);
        combinedDateTime.setHours(selectedTime.getHours());
        combinedDateTime.setMinutes(selectedTime.getMinutes());
        const formattedDate = moment(combinedDateTime).format(
          "YYYY-MM-DDTHH:mm:ss"
        );
        setStartTime(formattedDate);
        setStartTimePicker(false);
      } else {
        setStartTimePicker(false);
      }
    },
    [startDate]
  );

  const onEndDateChange = useCallback((event, selectedDate) => {
    if (selectedDate) {
      setEndDate(selectedDate);
      setEndDatePicker(false);
      setEndTimePicker(true);
    } else {
      setEndDatePicker(false);
    }
  }, []);

  const onEndTimeChange = useCallback(
    (event, selectedTime) => {
      if (selectedTime) {
        const combinedDateTime = new Date(endDate);
        combinedDateTime.setHours(selectedTime.getHours());
        combinedDateTime.setMinutes(selectedTime.getMinutes());
        const formattedDate = moment(combinedDateTime).format(
          "YYYY-MM-DDTHH:mm:ss"
        );
        setEndTime(formattedDate);
        setEndTimePicker(false);
      } else {
        setEndTimePicker(false);
      }
    },
    [endDate]
  );

  const renderItem = (item) => (
    <View style={styles.item}>
      <Text style={styles.textItem}>{item.name}</Text>
    </View>
  );

  const handleAddOvertime = async () => {
    setendDateError("");
    setStartDateError("");
    setPayCodeError("");
    if (!payCode) {
      setPayCodeError("Paycode is required");
      return;
    }
    if (new Date(endTime) <= new Date(startTime)) {
      setendDateError("End date must be after start date");
      return;
    }
    try {
      const response = await ProfileServices.addOvertimeRequest({
        employee: selectorid,
        start_time: formatDateTime(startTime),
        end_time: formatDateTime(endTime),
        pay_code: payCode,
        apply_reason: applyReason,
      });
      setIsLoading(false);
      setModalVisible(false);
      getOvertimeList();
      setStartTime();
      setEndTime();
      setPayCode();
      setApplyReason();
      Toast.show({
        type: "success",
        text1: "Added Successfully",
        position: "bottom",
      });
    } catch (error) {
      setIsLoading(false);
      formatErrorsToToastMessages(error);
    }
  };

  const getOvertimeList = async () => {
    setIsLoading(true);
    try {
      const RecentActivities = await ProfileServices.getOvertimeData(selectorid);
      setOvertimeData(RecentActivities?.results);
    } catch (error) {
      formatErrorsToToastMessages(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPayCodeList = async () => {
    try {
      const response = await ProfileServices.getPayCodeLists([2]);
      const { overtime_paycodes } = response;
      setPayCodesList(overtime_paycodes);
    } catch (error) {
      formatErrorsToToastMessages(error);
    }
  };

  useEffect(() => {
    getOvertimeList();
    getPayCodeList();
  }, []);

  return (
    <View style={styles.main}>
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="angle-left" size={30} color="#697ce3" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Overtime</Text>
        </View>
        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#697CE3" />
          </View>
        ) : isEmpty(OvertimeData) ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No overtime data</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.cardContainer}>
              {OvertimeData?.slice()?.map((newItem) => (
                <View style={styles.card} key={newItem?.id}>
                  <OvertimeCard
                    newItem={newItem}
                    employeeId={selectorid}
                    payCodesList={payCodesList}
                    getPayCodeList={getPayCodeList}
                    overtimeList={getOvertimeList}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        )}
        <Toast />
      </View>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.fab}
      >
        <Icon name="plus" size={24} color="#697ce3" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        visible={modalVisible}
        transparent
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add</Text>
            <View style={styles.form}>
              <TouchableOpacity
                onPress={() => setStartDatePicker(true)}
                style={styles.dateButton}
              >
                <Text style={styles.dateText}>
                  {startTime ? dateTimeToShow(startTime) : "Start Date"}
                </Text>
                <Icon name="calendar-check-o" size={23} color="#919EABD9" />
              </TouchableOpacity>
              {startDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  is24Hour
                  onChange={onStartDateChange}
                  maximumDate={new Date()}
                />
              )}
              {startTimePicker && (
                <DateTimePicker
                  value={timeStart}
                  mode="time"
                  is24Hour={false}
                  onChange={onStartTimeChange}
                />
              )}
              <TouchableOpacity
                onPress={() => setEndDatePicker(true)}
                style={styles.dateButton}
              >
                <Text style={styles.dateText}>
                  {endTime ? dateTimeToShow(endTime) : "End Date"}
                </Text>
                <Icon name="calendar-check-o" size={23} color="#919EABD9" />
              </TouchableOpacity>
              {endDateError && (
                <Text style={styles.errorText}>{endDateError}</Text>
              )}
              {endDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  is24Hour
                  onChange={onEndDateChange}
                  maximumDate={new Date()}
                />
              )}
              {endTimePicker && (
                <DateTimePicker
                  value={timeEnd}
                  mode="time"
                  is24Hour={false}
                  onChange={onEndTimeChange}
                />
              )}
              <View style={styles.container}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={payCodesList}
                  search
                  maxHeight={300}
                  labelField="name"
                  valueField="id"
                  placeholder="Select Paycode"
                  searchPlaceholder="Search..."
                  value={payCode}
                  onChange={(item) => setPayCode(item?.id)}
                  renderItem={renderItem}
                />
              </View>
              {payCodeError && (
                <Text style={styles.errorText}>{payCodeError}</Text>
              )}
              <TextInput
                style={styles.textInput}
                placeholder="Reason"
                editable
                multiline
                textAlignVertical="top"
                onChangeText={setApplyReason}
                numberOfLines={8}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleAddOvertime}
                style={styles.submitBtn}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitText}>Add</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Toast />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, justifyContent: "space-between", backgroundColor: "white" },
  headerWrapper: { paddingBottom: 48 },
  header: {
    flexDirection: "row",
    paddingBottom: 28,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  backButton: { paddingLeft: 4 },
  headerText: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    paddingRight: "15%",
  },
  loader: {
    height: "88%",
    justifyContent: "center",
    alignItems: "center",
  },
  empty: { height: "100%" },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 160,
  },
  scroll: {
    paddingTop: 20,
    padding: 20,
    borderRadius: 16,
    height: "88%",
    backgroundColor: "white",
  },
  cardContainer: { paddingBottom: 40, paddingTop: 16 },
  card: { paddingBottom: 24 },
  fab: {
    position: "absolute",
    top: 16,
    right: 12,
    height: 56,
    width: 56,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 7,
    padding: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 8,
  },
  form: { paddingHorizontal: 8, width: "100%", gap: 16 },
  dateButton: {
    height: 56,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: { fontSize: 14, color: "#333", fontWeight: "600" },
  errorText: { color: "red", fontSize: 12, marginLeft: 6 },
  textInput: {
    width: "100%",
    height:120,
    borderRadius: 10,
    borderColor: "#697CE3",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 14,
  },
  cancelBtn: {
    width: 80,
    height: 48,
    borderColor: "#697CE3",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  cancelText: { color: "#697CE3", fontSize: 12, fontWeight: "600" },
  submitBtn: {
    width: 80,
    height: 48,
    backgroundColor: "#697CE3",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  submitText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  container: {
    padding: 0,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#697CE3",
  },
  dropdown: { height: 60, paddingHorizontal: 8 },
  placeholderStyle: { fontSize: 12, color: "#000" },
  selectedTextStyle: { fontSize: 12, color: "#000" },
  iconStyle: { width: 20, height: 20 },
  inputSearchStyle: { height: 40, fontSize: 12 },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: { flex: 1, color: "#000", fontSize: 12 },
  buttonContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingtop: 20,
    marginTop:20,
    paddingHorizontal: 10,
    gap:20
  },
});

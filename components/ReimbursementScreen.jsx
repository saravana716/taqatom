import { myreducers } from "@/Store/Store";
import React, { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import ExpenseComponents from "../components/ExpenseComponents";
import ProfileServices from "../Services/API/ProfileServices";
import { useTranslation } from "react-i18next";
import tokens from "@/locales/tokens";
export default function ReimbursementScreen({ navigation }) {
  const {t,i18n}=useTranslation()
  const isRTL = i18n.language === 'ar';
  console.log("yyyyyyyyyyyyyyyyyyyy",isRTL);
const dispatch=useDispatch()
    const selectorid=useSelector(function (data) {
        return data.empid
    })
    
    
  const [activeField, setActiveField] = useState("");
  const [expenseDetails, setExpenseDetails] = useState([]);
  const [totalExpenseDetails, setTotalExpenseDetails] = useState({});
  const [totalPendingDetails, setTotalPendingDetails] = useState({});
  const [totalApprovedDetails, setTotalApprovedDetails] = useState({});
  const [totalRejectedDetails, setTotalRejectedDetails] = useState({});
  const [expenseGraphDetails, setExpenseGraphDetails] = useState({});

  const handleBack = () => {
    navigation.navigate("Dashboard");
  };

  const AddExpensive = () => {
    navigation.navigate("ExpenseScreen");
  };

  const ApprovedExpense = (newItem) => {
    dispatch(myreducers.sendExpenseData(newItem))
    navigation.navigate("ApprovedExpenseScreen");
    
  };

  const customDataPoint = () => <View style={styles.dataPoint} />;

  const customLabel = (val) => (
    <View style={styles.labelBox}>
      <Text style={styles.labelText}>{val}</Text>
    </View>
  );

  const getUserDetails = async () => {
    try {
      const userId = "user_id_placeholder"; // Replace with actual logic
      const RecentActivities = await ProfileServices.getExpenseDetails(selectorid);
      setExpenseDetails(RecentActivities);
      const totalExpens = await ProfileServices.getTotalExpense(selectorid);
      setTotalExpenseDetails(totalExpens);
      const totalPendingExpense = await ProfileServices.getTotalPendingExpense(selectorid);
      setTotalPendingDetails(totalPendingExpense);
      const totalApprovedExpense = await ProfileServices.getTotalApprovedExpense(selectorid);
      setTotalApprovedDetails(totalApprovedExpense);
      const expenseGraph = await ProfileServices.getExpenseGraph(selectorid);
      setExpenseGraphDetails(expenseGraph);
      const totalRejectedExpense = await ProfileServices.getTotalRejectedExpense(selectorid);
      setTotalRejectedDetails(totalRejectedExpense);
    } catch (err) {
      
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const chartData = expenseGraphDetails?.total_expenses_last_six_months?.map(
    (item) => {
      const month = Object.keys(item)[0];
      const value = item[month];
      return { date: month, value: value };
    }
  );

  const months = chartData?.map((item) => item.date);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/Assets/blue-bg.png")}
        style={styles.headerImage}
      />
      <View style={styles.headerOverlay}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="chevron-back" size={35} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t(tokens.nav.expense)}</Text>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.card}>
          <View style={styles.innerContent}>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>   {t(tokens.charts.totalExpense)}</Text>
                <Text style={styles.statValue}>
                  {totalExpenseDetails?.total_expense_amount || "0.00"} SAR
                </Text>
              </View>
              <View style={styles.statBoxRight}>
                <Text style={styles.statLabel}>{t(tokens.actions.approve)}</Text>
                <Text style={styles.statValue}>
                  {totalApprovedDetails?.approved_total_amount || "0.00"} SAR
                </Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>{t(tokens.actions.reject)}</Text>
                <Text style={styles.statValue}>
                  {totalRejectedDetails?.rejected_total_amount || "0.00"} SAR
                </Text>
              </View>
              <View style={styles.statBoxRight}>
                <Text style={styles.statLabel}> {t(tokens.actions.pending)}</Text>
                <Text style={styles.statValue}>
                  {totalPendingDetails?.pending_total_amount || "0.00"} SAR
                </Text>
              </View>
            </View>

            <LineChart
              data={chartData}
              width={300}
              color="#697CE3"
              height={200}
              areaChart
              curved
              xLabels={months}
              xAccessor={({ index }) => chartData[index].date}
              startFillColor={"#697CE3"}
              endFillColor={"#697CE3"}
              startOpacity={0.8}
              endOpacity={0.2}
              spacing={38}
              rulesColor="white"
              rulesType="white"
              yLabelsOffset={20}
              chartConfig={{
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
              }}
              bezier
            />
          </View>

          <View style={styles.recentBox}>
            <Text style={styles.recentTitle}> {t(tokens.common.recents)}</Text>
            <ScrollView style={styles.scrollArea}>
              {expenseDetails?.map((newItem, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setActiveField(index);
                    ApprovedExpense(newItem);
                  }}
                >
                  <ExpenseComponents newItem={newItem} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={AddExpensive} style={styles.fab}>
        <Icon name="add-outline" size={40} color="#697CE3" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F3F4" },
  headerImage: {
    width: "100%",
    resizeMode: "cover",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerOverlay: {
    position: "absolute",
    top: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  mainContent: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
  },
  card: { backgroundColor: "white", borderRadius: 20, padding: 16, flex: 1 },
  innerContent: { flex: 1 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statBox: {},
  statBoxRight: { alignItems: "flex-end" },
  statLabel: { fontSize: 10, color: "gray", fontWeight: "600" },
  statValue: { fontSize: 16, fontWeight: "bold" },
  labelBox: { width: 70, marginLeft: 7 },
  labelText: { color: "white", fontWeight: "bold" },
  dataPoint: {
    width: 20,
    height: 20,
    backgroundColor: "white",
    borderWidth: 4,
    borderRadius: 10,
    borderColor: "#07BAD1",
  },
  recentBox: { marginTop: 20, flex: 1 },
  recentTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  scrollArea: { maxHeight: 300 },
  fab: {
    position: "absolute",
    top: 16,
    right: 16,
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },
});

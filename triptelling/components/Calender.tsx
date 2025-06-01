import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router"; // ✅ Import router

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getDaysInMonth = (month: number, year: number): number[] => {
  const date = new Date(year, month, 1);
  const days: number[] = [];
  while (date.getMonth() === month) {
    days.push(date.getDate());
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const Calendar = () => {
  const router = useRouter(); // ✅ Initialize router

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const days = getDaysInMonth(month, year);
  const firstDay = new Date(year, month, 1).getDay();

  const holidays = [
    { name: "New Year's Day", date: "Jan 1" },
    { name: "Martin Luther King Jr. Day", date: "Jan 15" },
    { name: "Independence Day", date: "Jul 4" },
    { name: "Labor Day", date: "Sep 2" },
    { name: "Thanksgiving", date: "Nov 28" },
    { name: "Christmas Day", date: "Dec 25" },
  ];

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={() => router.push("/landing")}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      {/* Calendar Header */}
      <View style={styles.header}>
        <Pressable onPress={handlePrev}>
          <Text style={styles.nav}>‹</Text>
        </Pressable>
        <Text style={styles.monthLabel}>
          {new Date(year, month).toLocaleString("default", {
            month: "long",
          })}{" "}
          {year}
        </Text>
        <Pressable onPress={handleNext}>
          <Text style={styles.nav}>›</Text>
        </Pressable>
      </View>

      {/* Week Labels */}
      <View style={styles.weekRow}>
        {daysOfWeek.map((day) => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>

      {/* Days Grid */}
      <View style={styles.grid}>
        {Array(firstDay)
          .fill(null)
          .map((_, i) => (
            <Text key={`empty-${i}`} style={styles.day} />
          ))}
        {days.map((d) => (
          <Text key={d} style={styles.day}>
            {d}
          </Text>
        ))}
      </View>

      {/* Scrollable Holiday List */}
      <Text style={styles.holidayTitle}>Upcoming Holidays</Text>
      <ScrollView style={styles.holidayList}>
        {holidays.map((holiday, idx) => (
          <View key={idx} style={styles.holidayItem}>
            <Text style={styles.holidayName}>{holiday.name}</Text>
            <Text style={styles.holidayDate}>{holiday.date}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  backText: {
    fontSize: 16,
    color: "#333",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  nav: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 20,
  },
  monthLabel: {
    fontSize: 20,
    fontWeight: "600",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  weekDay: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontWeight: "500",
    color: "#444",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  day: {
    width: `${100 / 7}%`,
    textAlign: "center",
    paddingVertical: 10,
    color: "#222",
  },
  holidayTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 10,
    color: "#333",
  },
  holidayList: {
    maxHeight: screenHeight * 0.25,
  },
  holidayItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  holidayName: {
    fontSize: 15,
    color: "#222",
  },
  holidayDate: {
    fontSize: 15,
    color: "#666",
  },
});

export default Calendar;

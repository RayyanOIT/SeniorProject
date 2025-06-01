import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Alert,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // ✅ Added router import

const today = new Date();
const date = today.getDate();
const weekday = today.toLocaleDateString("en-US", { weekday: "short" });
const month = today.toLocaleDateString("en-US", { month: "short" });

const LandingScreen = () => {
  const router = useRouter(); // ✅ Initialize router

  const handleNavPress = (label: string) => {
    if (label === "Calendar") {
      router.push("/display-calendar");
    } else if (label === "Notebook") {
      router.push("/itineraries");
    } else if (label === "Brain") {
      router.push("/travel-chat"); // ✅ Navigate to chatbot
    } else if (label === "Logout") {
      router.push("/");
    } else {
      Alert.alert("Navigation", `You pressed ${label}`);
    }
  };
  
  

  return (
    <SafeAreaView style={styles.container}>
      {/* Centered 4 Cards */}
      <View style={styles.gridWrapper}>
        <View style={styles.cardRow}>
          <Pressable style={styles.cardLarge}>
            <Text style={styles.dateLarge}>{date}</Text>
            <Text style={styles.dateSmall}>{`${weekday} ${month}`}</Text>
          </Pressable>
          <Pressable style={styles.cardLarge}>
            <Text style={styles.progressLabel}>Day</Text>
            <Text style={styles.progressValue}>45%</Text>
          </Pressable>
        </View>
        <View style={styles.cardRow}>
          <Pressable style={styles.cardLarge}>
            <Text style={styles.iconText}>📝</Text>
            <Text style={styles.cardLabel}>Quick Notes</Text>
          </Pressable>
          <Pressable style={styles.cardLarge}>
            <Text style={styles.iconText}>📅</Text>
            <Text style={styles.cardLabel}>Daily Tasks</Text>
          </Pressable>
        </View>
      </View>

      {/* Favorites */}
      <View style={styles.favoritesCard}>
        <Text style={styles.favoritesTitle}>Favorites</Text>
        <View style={styles.favoritesItem}>
          <FontAwesome5 name="brain" size={18} />
          <Text style={styles.favText}>  Second Brain</Text>
        </View>
        <View style={styles.favoritesItem}>
          <Ionicons name="calendar" size={18} />
          <Text style={styles.favText}>  Content Calendar</Text>
        </View>
        <View style={styles.favoritesItem}>
          <Ionicons name="navigate" size={18} />
          <Text style={styles.favText}>  Decisions</Text>
        </View>
        <Pressable style={styles.addButton}>
          <Text style={styles.addIcon}>＋</Text>
        </Pressable>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomBar}>
        <Pressable onPress={() => handleNavPress("Notebook")}>
          <SimpleLineIcons name="notebook" size={28} />
        </Pressable>
        <Pressable onPress={() => handleNavPress("Calendar")}>
          <MaterialCommunityIcons name="calendar-month" size={28} />
        </Pressable>
        <Pressable onPress={() => handleNavPress("Brain")}>
          <FontAwesome5 name="brain" size={28} />
        </Pressable>
        <Pressable onPress={() => handleNavPress("Logout")}>
        <FontAwesome5 name="sign-out-alt" size={24} />
      </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    padding: 20,
    justifyContent: "space-between",
  },
  gridWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  cardLarge: {
    width: 170,
    height: 130,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  dateLarge: {
    fontSize: 40,
    fontWeight: "bold",
  },
  dateSmall: {
    fontSize: 16,
    color: "#999",
    marginTop: 6,
  },
  progressLabel: {
    fontSize: 20,
    fontWeight: "600",
  },
  progressValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#555",
  },
  iconText: {
    fontSize: 28,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
  favoritesCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  favoritesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  favoritesItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  favText: {
    fontSize: 15,
  },
  addButton: {
    position: "absolute",
    right: 15,
    bottom: 15,
    backgroundColor: "black",
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  addIcon: {
    color: "white",
    fontSize: 18,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
});

export default LandingScreen;

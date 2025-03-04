import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Animated,
  ToastAndroid,
} from "react-native";
import { useRouter } from "expo-router"; // ✅ Correct navigation for expo-router
import { FontAwesome5 } from "@expo/vector-icons";

const ItineraryCard = ({
  title,
  details,
  onDelete,
}: {
  title: string;
  details: string;
  onDelete?: () => void;
}) => {
  const fadeAnim = useState(new Animated.Value(1))[0];
  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      if (onDelete) {
        onDelete();
      } else {
        console.warn("onDelete function is not provided.");
      }
      ToastAndroid.show("Itinerary deleted", ToastAndroid.SHORT);
    });
  };

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDetails}>{details}</Text>
      <View style={styles.cardButtons}>
        <Pressable style={styles.manageButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Manage</Text>
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </Pressable>
      </View>

      {/* Modal for Manage Button */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Flight Itinerary</Text>
            <Text style={styles.modalSubtitle}>John F. Kennedy International Airport</Text>

            <View style={styles.flightInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Departure:</Text>
                <Text style={styles.value}>London Heathrow Airport (LHR)</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Arrival:</Text>
                <Text style={styles.value}>John F. Kennedy International Airport (JFK)</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Flight Time:</Text>
                <Text style={styles.value}>8h 15m</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.delayedText}>Delayed</Text>
              </View>
            </View>

            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

// ----------------------
// Parent Component (MainMenu)
// ----------------------
const MainMenu = () => {
  const router = useRouter(); // ✅ Use expo-router for navigation
  const [itineraryList, setItineraryList] = useState([
    { id: 1, title: "Upcoming Trip 1", details: "Details for trip 1" },
    { id: 2, title: "Upcoming Trip 2", details: "Details for trip 2" },
    { id: 3, title: "Upcoming Trip 3", details: "Details for trip 3" },
    { id: 4, title: "Upcoming Trip 4", details: "Details for trip 4" },
  ]);

  const handleDelete = (id: number) => {
    setItineraryList((prevList) => prevList.filter((trip) => trip.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* ✅ Logout Button at the Very Top Right */}
      <View style={styles.header}>
        <Pressable style={styles.logoutButton} onPress={() => router.push("/")}>
          <FontAwesome5 name="sign-out-alt" size={24} color="white" />
        </Pressable>
      </View>

      {/* ✅ Added Space Before Itinerary Cards */}
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {itineraryList.map((trip) => (
          <ItineraryCard
            key={trip.id}
            title={trip.title}
            details={trip.details}
            onDelete={() => handleDelete(trip.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1C",
    paddingTop: 60, // ✅ Adjusted padding to push content down
    paddingHorizontal: 20,
  },
  header: {
    position: "absolute",
    top: 10,
    right: 20,
    zIndex: 10,
  },
  logoutButton: {
    padding: 10,
    backgroundColor: "#9370DB",
    borderRadius: 5,
  },
  scrollViewContainer: {
    paddingTop: 50, // ✅ Added spacing between logout and itinerary cards
  },
  card: {
    backgroundColor: "#2C2C2C",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9370DB",
    marginBottom: 5,
  },
  cardDetails: {
    color: "white",
    marginBottom: 10,
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  manageButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  flightInfo: {
    width: "100%",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
  },
  value: {
    fontSize: 16,
  },
  delayedText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#9370DB",
    borderRadius: 5,
  },
});

export default MainMenu;

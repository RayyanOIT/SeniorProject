import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal, TouchableOpacity, ScrollView, Alert, Animated } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

type MenuButtonProps = {
  title: string;
  onPress: () => void;
};

const MenuButton: React.FC<MenuButtonProps> = ({ title, onPress }) => (
  <Pressable
    style={({ pressed }) => [styles.button, pressed && styles.buttonHover]}
    onPress={onPress}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </Pressable>
);

const ItineraryCard = ({ title, details, onDelete }: { title: string; details: string; onDelete: () => void }) => {
  const fadeAnim = useState(new Animated.Value(1))[0];

  const handleDelete = () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this trip?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => onDelete());
        }, style: "destructive" }
    ]);
  };

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}> 
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDetails}>{details}</Text>
      <View style={styles.cardButtons}>
        <Pressable style={styles.manageButton}><Text style={styles.buttonText}>Manage</Text></Pressable>
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const MainMenu = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [itineraryList, setItineraryList] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      title: `Upcoming Trip ${i + 1}`,
      details: `Details for trip ${i + 1}`,
    }))
  );

  const handleDelete = (id: number) => {
    setItineraryList(itineraryList.filter(trip => trip.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.hamburger} onPress={() => setMenuVisible(true)}>
          <FontAwesome5 name="bars" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={() => alert("Logging out...")}>
          <FontAwesome5 name="sign-out-alt" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.menu}>
            <MenuButton title="View Itineraries" onPress={() => alert("Navigate to View Itineraries")} />
            <MenuButton title="Compare Itineraries" onPress={() => alert("Navigate to Compare Itineraries")} />
            <Pressable onPress={() => setMenuVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
      <ScrollView style={styles.cardContainer}>
        {itineraryList.map((trip) => (
          <ItineraryCard key={trip.id} title={trip.title} details={trip.details} onDelete={() => handleDelete(trip.id)} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1C",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    width: "80%",
    padding: 15,
    backgroundColor: "#9370DB",
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonHover: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  hamburger: {
    padding: 10,
  },
  logoutButton: {
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  menu: {
    width: "80%",
    backgroundColor: "#2C2C2C",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  cardContainer: {
    marginTop: 20,
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
  manageButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
});

export default MainMenu;

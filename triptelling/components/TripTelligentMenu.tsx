import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import Toast from "react-native-toast-message"; // ✅ Import Toast directly

type Itinerary = {
  id: number;
  title: string;
  details: string;
};

type ItineraryCardProps = {
  title: string;
  details: string;
  onDelete: () => void;
};

const ItineraryCard: React.FC<ItineraryCardProps> = ({ title, details, onDelete }) => {
  const fadeAnim = useState(new Animated.Value(1))[0];
  const handleDelete = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      onDelete();
      // ✅ Trigger toast message for deletion
      Toast.show({
        type: "success",
        text1: "Itinerary deleted",
        position: "bottom",
      });
    });
  };
  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDetails}>{details}</Text>
      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete</Text>
      </Pressable>
    </Animated.View>
  );
};

const MainMenu: React.FC = () => {
  const router = useRouter();
  const [itineraryList, setItineraryList] = useState<Itinerary[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [weather, setWeather] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Generate Itinerary Using GPT and Log JSON
  const handleCreateItinerary = async () => {
    if (!weather || !cuisine || !budget) {
      // ✅ Trigger toast message for missing fields
      Toast.show({
        type: "error",
        text1: "Please fill all fields",
        position: "bottom",
      });
      return;
    }

    setLoading(true);
    setModalVisible(false);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`, // 🔥 Replace with your API Key
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a travel assistant. Given a preferred weather, cuisine, and budget, suggest a destination with a hotel (price, booking link) and a flight (price, booking link) in JSON format.`,
            },
            {
              role: "user",
              content: `Plan a trip with:
                - Weather preference: ${weather}
                - Cuisine preference: ${cuisine}
                - Budget: $${budget}

                The JSON format should be:
                {
                  "destination": "Hawaii, USA",
                  "hotel": {
                    "name": "Waikiki Beach Resort",
                    "price_per_night": 180,
                    "booking_link": "https://www.waikikiresort.com"
                  },
                  "flight": {
                    "price": 400,
                    "booking_link": "https://www.expedia.com/flight-to-hawaii"
                  },
                  "total_cost": 1200
                }`,
            },
          ],
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      const parsedItinerary = JSON.parse(data.choices[0]?.message?.content || "{}");

      // ✅ Log the JSON response to the console
      console.log("Generated Itinerary:", parsedItinerary);

      // Add generated itinerary to the itinerary list
      setItineraryList([
        ...itineraryList,
        {
          id: Date.now(),
          title: `Trip to ${parsedItinerary.destination}`,
          details: `Weather: ${weather}, Cuisine: ${cuisine}, Budget: $${budget}`,
          ...parsedItinerary,
        },
      ]);

      setWeather("");
      setCuisine("");
      setBudget("");
    } catch (error) {
      console.error("Error fetching itinerary:", error);
      // ✅ Trigger toast message for error
      Toast.show({
        type: "error",
        text1: "Error generating itinerary. Please try again.",
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.createButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Create Itinerary</Text>
        </Pressable>
        <Pressable style={styles.logoutButton} onPress={() => router.push("/")}>
          <FontAwesome5 name="sign-out-alt" size={24} color="white" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {itineraryList.map((trip) => (
          <ItineraryCard key={trip.id} title={trip.title} details={trip.details} onDelete={() => setItineraryList(itineraryList.filter((item) => item.id !== trip.id))} />
        ))}
      </ScrollView>
      <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Itinerary</Text>
            <TextInput style={styles.input} placeholder="Preferred Weather" value={weather} onChangeText={setWeather} />
            <TextInput style={styles.input} placeholder="Preferred Cuisine" value={cuisine} onChangeText={setCuisine} />
            <TextInput style={styles.input} placeholder="Budget" value={budget} onChangeText={setBudget} keyboardType="numeric" />
            <Pressable style={styles.saveButton} onPress={handleCreateItinerary}>
              <Text style={styles.buttonText}>Generate Itinerary</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Add Toast container for toast messages */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1C1C1C", paddingTop: 60, paddingHorizontal: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  createButton: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5 },
  logoutButton: { backgroundColor: "#9370DB", padding: 10, borderRadius: 5 },
  scrollViewContainer: { paddingTop: 20 },
  card: { backgroundColor: "#2C2C2C", padding: 15, borderRadius: 10, marginBottom: 15 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#9370DB", marginBottom: 5 },
  cardDetails: { color: "white", marginBottom: 10 },
  deleteButton: { backgroundColor: "red", padding: 10, borderRadius: 5 },
  buttonText: { color: "white", fontSize: 16, textAlign: "center" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)" },
  modalContent: { width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { width: "100%", padding: 10, borderWidth: 1, borderColor: "gray", borderRadius: 5, marginBottom: 10 },
  saveButton: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5 },
});

export default MainMenu;

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
  Linking,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { ImageBackground } from "react-native";
import RNPickerSelect from "react-native-picker-select";


// Types

type Itinerary = {
  id: number;
  title: string;
  details: string;
  nights: string;
  hotel: {
    name: string;
    price_per_night: number;
    booking_link: string;
  };
  flight: {
    price: number;
    booking_link: string;
  };
  total_cost: number;
};

type ItineraryCardProps = Itinerary & {
  onDelete: () => void;
  onEdit: () => void;
  selected: boolean;
  onSelect: () => void;
};

const ItineraryCard: React.FC<ItineraryCardProps> = ({
  title,
  details,
  nights,
  hotel,
  flight,
  total_cost,
  onDelete,
  onEdit,
  selected,
  onSelect,
}) => {
  const fadeAnim = useState(new Animated.Value(1))[0];

  const handleDelete = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      onDelete();
      Toast.show({
        type: "success",
        text1: "Itinerary deleted",
        position: "bottom",
      });
    });
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Failed to open link.");
    });
  };

  return (
    <Animated.View
      style={[styles.card, { opacity: fadeAnim, borderColor: selected ? '#FFD700' : '#2C2C2C', borderWidth: 2 }]}
    >
      <Pressable onPress={onSelect}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDetails}>{details}</Text>
        <Text style={styles.cardDetails}>🛏️ Nights: {nights}</Text>

        <Text style={styles.cardDetails}>🏨 Hotel: {hotel.name}</Text>
        <Text style={styles.cardDetails}>💰 Price/Night: ${hotel.price_per_night.toFixed(2)}</Text>
        <Text style={styles.link} onPress={() => openLink(hotel.booking_link)}>
          🔗 Hotel Booking
        </Text>

        <Text style={styles.cardDetails}>✈️ Flight Price: ${flight.price.toFixed(2)}</Text>
        <Text style={styles.link} onPress={() => openLink(flight.booking_link)}>
          🔗 Flight Booking
        </Text>

        <Text style={styles.cardDetails}>💵 Total Cost: ${total_cost.toFixed(2)}</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Pressable style={[styles.deleteButton, { flex: 1, marginRight: 5 }]} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
          <Pressable style={[styles.saveButton, { flex: 1, marginLeft: 5 }]} onPress={onEdit}>
            <Text style={styles.buttonText}>Edit</Text>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
};
const airports = [
  "JFK - New York John F. Kennedy",
  "LAX - Los Angeles International",
  "ORD - Chicago O'Hare",
  "DFW - Dallas/Fort Worth",
  "DEN - Denver International",
  "SFO - San Francisco International",
  "ATL - Hartsfield-Jackson Atlanta",
  "SEA - Seattle-Tacoma",
  "MIA - Miami International",
  "BOS - Boston Logan",
];

const MainMenu: React.FC = () => {
  const router = useRouter();
  const [itineraryList, setItineraryList] = useState<Itinerary[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [compareVisible, setCompareVisible] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [weather, setWeather] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [budget, setBudget] = useState("");
  const [nights, setNights] = useState("");
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState<Itinerary | null>(null);
  const [location, setLocation] = useState("");



  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length === 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const getDifferences = () => {
    const selected = itineraryList.filter((i) => selectedIds.includes(i.id));
    if (selected.length !== 2) return [];
    const [a, b] = selected;
    return [
      { label: "Hotel", a: a.hotel.name, b: b.hotel.name },
      { label: "Hotel Price/Night", a: `$${a.hotel.price_per_night}`, b: `$${b.hotel.price_per_night}` },
      { label: "Flight Price", a: `$${a.flight.price}`, b: `$${b.flight.price}` },
      { label: "Total Cost", a: `$${a.total_cost}`, b: `$${b.total_cost}` },
      { label: "Nights", a: a.nights, b: b.nights },
    ];
  };

  const handleComparePress = () => {
    if (selectedIds.length !== 2) {
      Toast.show({
        type: "info",
        text1: "Select exactly 2 itineraries to compare",
        position: "bottom",
      });
      return;
    }
    setCompareVisible(true);
  };

  const handleCreateItinerary = async () => {
    if (!weather || !cuisine || !budget || !nights) {
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
          Authorization: `Bearer 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`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { 
              role: "system", content: `
              You are a travel assistant. Given a preferred weather, cuisine, budget, and number of nights, suggest a destination with a hotel (price, booking link) and a flight (price, booking link) in JSON format. 
              Always provide a Google Flights link such as https://www.google.com/flights when suggesting flights.
            `}
            ,
            {
              role: "user",
              content: `Plan a trip with:
                - Weather preference: ${weather}
                - Cuisine preference: ${cuisine}
                - Budget: $${budget}
                - Number of nights: ${nights}
                - Departure location: ${location}

                Look for a two-way flight, and calculate total cost including roundtrip flight and hotel.

                Always provide a Google Flights link such as https://www.google.com/flights when suggesting flights. Give me a specific flights. 
                
                Fill in the Where From to, the Where to, Departure, and Return with the cheapest Dates. provide the link after everything has been filled out.

                If it is not possible to find a trip within the budget, return "not possible".

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
      const parsedItinerary = JSON.parse(data.choices[0]?.message?.content || "{}");

      const numNights = isNaN(parseInt(nights)) ? 1 : parseInt(nights);
      const hotelPricePerNight = parsedItinerary.hotel?.price_per_night || 0;
      const flightPrice = parsedItinerary.flight?.price || 0;
      const hotelCost = hotelPricePerNight * numNights;
      const totalCost = hotelCost + flightPrice;

      setItineraryList((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: `Trip to ${parsedItinerary.destination}`,
          details: `Weather: ${weather}, Cuisine: ${cuisine}, Budget: $${budget}`,
          hotel: parsedItinerary.hotel,
          flight: parsedItinerary.flight,
          total_cost: totalCost,
          nights: nights,
        },
      ]);

      setWeather("");
      setCuisine("");
      setBudget("");
      setNights("");
      //setLocation("");
    } catch (error) {
      console.error("Error fetching itinerary:", error);
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
        <Pressable style={styles.createButton} onPress={() => setCompareVisible(true)}>
          <Text style={styles.buttonText}>Compare Itineraries</Text>
        </Pressable>
      </View>


      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {itineraryList.map((trip) => (
          <ItineraryCard
            key={trip.id}
            {...trip}
            onDelete={() => setItineraryList((prev) => prev.filter((item) => item.id !== trip.id))}
            onEdit={() => {
              setEditingItinerary(trip);
              setEditModalVisible(true);
            }}

            selected={selectedIds.includes(trip.id)}
            onSelect={() => toggleSelect(trip.id)}
          />
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Itinerary</Text>
            <View style={[styles.input, { padding: 0, height: 160 }]}>
            <ScrollView>
              {airports.map((airport) => (
                <Pressable
                  key={airport}
                  onPress={() => setLocation(airport)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    backgroundColor: location === airport ? "#eee" : "transparent",
                  }}
                >
                  <Text>{airport}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          {location ? (
            <Text style={{ marginBottom: 10, fontStyle: "italic", color: "#444" }}>
              Selected: {location}
            </Text>
          ) : null}
            <TextInput style={styles.input} placeholder="Preferred Weather" value={weather} onChangeText={setWeather} />
            <TextInput style={styles.input} placeholder="Preferred Cuisine" value={cuisine} onChangeText={setCuisine} />
            <TextInput style={styles.input} placeholder="Budget" value={budget} onChangeText={setBudget} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Number of Nights" value={nights} onChangeText={setNights} keyboardType="numeric" />
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
            <Pressable style={[styles.saveButton, { flex: 1 }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Back</Text>
            </Pressable>

            <Pressable style={[styles.saveButton, { flex: 1 }]} onPress={handleCreateItinerary}>
              <Text style={styles.buttonText}>Generate</Text>
            </Pressable>
          </View>
          </View>
        </View>
      </Modal>

      <Modal visible={compareVisible} transparent animationType="fade" onRequestClose={() => setCompareVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Itinerary Comparison</Text>
            {selectedIds.length === 2 && getDifferences().map((diff, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>{diff.label}</Text>
                <Text>Option A: {diff.a}</Text>
                <Text>Option B: {diff.b}</Text>
              </View>
            ))}
            <Pressable style={styles.saveButton} onPress={() => setCompareVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
          visible={editModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Itinerary</Text>
              <TextInput
                style={styles.input}
                placeholder="Title"
                value={editingItinerary?.title}
                onChangeText={(text) =>
                  setEditingItinerary((prev) =>
                    prev ? { ...prev, title: text } : prev
                  )
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Details"
                value={editingItinerary?.details}
                onChangeText={(text) =>
                  setEditingItinerary((prev) =>
                    prev ? { ...prev, details: text } : prev
                  )
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Number of Nights"
                keyboardType="numeric"
                value={editingItinerary?.nights}
                onChangeText={(text) =>
                  setEditingItinerary((prev) =>
                    prev ? { ...prev, nights: text } : prev
                  )
                }
              />
              <Pressable
                style={styles.saveButton}
                onPress={() => {
                  if (!editingItinerary) return;
                  setItineraryList((prev) =>
                    prev.map((item) =>
                      item.id === editingItinerary.id ? editingItinerary : item
                    )
                  );
                  setEditModalVisible(false);
                  Toast.show({
                    type: "success",
                    text1: "Itinerary updated",
                    position: "bottom",
                  });
                }}
              >
                <Text style={styles.buttonText}>Save Changes</Text>
              </Pressable>
            </View>
          </View>
        </Modal>


      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexShrink: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#444",
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollViewContainer: {
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 5,
  },
  cardDetails: {
    color: "#333",
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: "#e63946",
    padding: 12,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    color: "#1d4ed8",
    textDecorationLine: "underline",
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111",
  },
  input: {
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});

export default MainMenu;


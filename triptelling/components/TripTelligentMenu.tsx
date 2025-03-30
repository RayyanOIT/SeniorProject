// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   Modal,
//   TextInput,
//   ScrollView,
//   Animated,
//   Linking,
//   Alert,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { FontAwesome5 } from "@expo/vector-icons";
// import Toast from "react-native-toast-message";

// // Types

// type Itinerary = {
//   id: number;
//   title: string;
//   details: string;
//   nights: string;
//   hotel: {
//     name: string;
//     price_per_night: number;
//     booking_link: string;
//   };
//   flight: {
//     price: number;
//     booking_link: string;
//   };
//   total_cost: number;
// };

// type ItineraryCardProps = Itinerary & {
//   onDelete: () => void;
//   selected: boolean;
//   onSelect: () => void;
// };

// const ItineraryCard: React.FC<ItineraryCardProps> = ({
//   title,
//   details,
//   nights,
//   hotel,
//   flight,
//   total_cost,
//   onDelete,
//   selected,
//   onSelect,
// }) => {
//   const fadeAnim = useState(new Animated.Value(1))[0];

//   const handleDelete = () => {
//     Animated.timing(fadeAnim, {
//       toValue: 0,
//       duration: 500,
//       useNativeDriver: true,
//     }).start(() => {
//       onDelete();
//       Toast.show({
//         type: "success",
//         text1: "Itinerary deleted",
//         position: "bottom",
//       });
//     });
//   };

//   const openLink = (url: string) => {
//     Linking.openURL(url).catch(() => {
//       Alert.alert("Error", "Failed to open link.");
//     });
//   };

//   return (
//     <Animated.View
//       style={[styles.card, { opacity: fadeAnim, borderColor: selected ? '#FFD700' : '#2C2C2C', borderWidth: 2 }]}
//     >
//       <Pressable onPress={onSelect}>
//         <Text style={styles.cardTitle}>{title}</Text>
//         <Text style={styles.cardDetails}>{details}</Text>
//         <Text style={styles.cardDetails}>🛏️ Nights: {nights}</Text>

//         <Text style={styles.cardDetails}>🏨 Hotel: {hotel.name}</Text>
//         <Text style={styles.cardDetails}>💰 Price/Night: ${hotel.price_per_night.toFixed(2)}</Text>
//         <Text style={styles.link} onPress={() => openLink(hotel.booking_link)}>
//           🔗 Hotel Booking
//         </Text>

//         <Text style={styles.cardDetails}>✈️ Flight Price: ${flight.price.toFixed(2)}</Text>
//         <Text style={styles.link} onPress={() => openLink(flight.booking_link)}>
//           🔗 Flight Booking
//         </Text>

//         <Text style={styles.cardDetails}>💵 Total Cost: ${total_cost.toFixed(2)}</Text>

//         <Pressable style={styles.deleteButton} onPress={handleDelete}>
//           <Text style={styles.buttonText}>Delete</Text>
//         </Pressable>
//       </Pressable>
//     </Animated.View>
//   );
// };

// const MainMenu: React.FC = () => {
//   const router = useRouter();
//   const [itineraryList, setItineraryList] = useState<Itinerary[]>([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [compareVisible, setCompareVisible] = useState(false);
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);

//   const [weather, setWeather] = useState("");
//   const [cuisine, setCuisine] = useState("");
//   const [budget, setBudget] = useState("");
//   const [nights, setNights] = useState("");
//   const [loading, setLoading] = useState(false);

//   const toggleSelect = (id: number) => {
//     setSelectedIds((prev) => {
//       if (prev.includes(id)) return prev.filter((item) => item !== id);
//       if (prev.length === 2) return [prev[1], id];
//       return [...prev, id];
//     });
//   };

//   const getDifferences = () => {
//     const selected = itineraryList.filter((i) => selectedIds.includes(i.id));
//     if (selected.length !== 2) return [];
//     const [a, b] = selected;
//     return [
//       { label: "Hotel", a: a.hotel.name, b: b.hotel.name },
//       { label: "Hotel Price/Night", a: `$${a.hotel.price_per_night}`, b: `$${b.hotel.price_per_night}` },
//       { label: "Flight Price", a: `$${a.flight.price}`, b: `$${b.flight.price}` },
//       { label: "Total Cost", a: `$${a.total_cost}`, b: `$${b.total_cost}` },
//       { label: "Nights", a: a.nights, b: b.nights },
//     ];
//   };

//   const handleComparePress = () => {
//     if (selectedIds.length !== 2) {
//       Toast.show({
//         type: "info",
//         text1: "Select exactly 2 itineraries to compare",
//         position: "bottom",
//       });
//       return;
//     }
//     setCompareVisible(true);
//   };

//   const handleCreateItinerary = async () => {
//     if (!weather || !cuisine || !budget || !nights) {
//       Toast.show({
//         type: "error",
//         text1: "Please fill all fields",
//         position: "bottom",
//       });
//       return;
//     }

//     setLoading(true);
//     setModalVisible(false);

//     try {
//       const response = await fetch("https://api.openai.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer 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`,
//         },
//         body: JSON.stringify({
//           model: "gpt-3.5-turbo",
//           messages: [
//             {
//               role: "system",
//               content:
//                 `You are a travel assistant. Given a preferred weather, cuisine, budget, and number of nights, suggest a destination with a hotel (price, booking link) and a flight (price, booking link) in JSON format.`,
//             },
//             {
//               role: "user",
//               content: `Plan a trip with:
//                 - Weather preference: ${weather}
//                 - Cuisine preference: ${cuisine}
//                 - Budget: $${budget}
//                 - Number of nights: ${nights}

//                 Look for a two-way flight, and calculate total cost including roundtrip flight and hotel.

//                 If it is not possible to find a trip within the budget, return "not possible".

//                 The JSON format should be:
//                 {
//                   "destination": "Hawaii, USA",
//                   "hotel": {
//                     "name": "Waikiki Beach Resort",
//                     "price_per_night": 180,
//                     "booking_link": "https://www.waikikiresort.com"
//                   },
//                   "flight": {
//                     "price": 400,
//                     "booking_link": "https://www.expedia.com/flight-to-hawaii"
//                   },
//                   "total_cost": 1200
//                 }`,
//             },
//           ],
//         }),
//       });

//       const data = await response.json();
//       const parsedItinerary = JSON.parse(data.choices[0]?.message?.content || "{}");

//       const numNights = isNaN(parseInt(nights)) ? 1 : parseInt(nights);
//       const hotelPricePerNight = parsedItinerary.hotel?.price_per_night || 0;
//       const flightPrice = parsedItinerary.flight?.price || 0;
//       const hotelCost = hotelPricePerNight * numNights;
//       const totalCost = hotelCost + flightPrice;

//       setItineraryList((prev) => [
//         ...prev,
//         {
//           id: Date.now(),
//           title: `Trip to ${parsedItinerary.destination}`,
//           details: `Weather: ${weather}, Cuisine: ${cuisine}, Budget: $${budget}`,
//           hotel: parsedItinerary.hotel,
//           flight: parsedItinerary.flight,
//           total_cost: totalCost,
//           nights: nights,
//         },
//       ]);

//       setWeather("");
//       setCuisine("");
//       setBudget("");
//       setNights("");
//     } catch (error) {
//       console.error("Error fetching itinerary:", error);
//       Toast.show({
//         type: "error",
//         text1: "Error generating itinerary. Please try again.",
//         position: "bottom",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Pressable style={styles.createButton} onPress={() => setModalVisible(true)}>
//           <Text style={styles.buttonText}>Create Itinerary</Text>
//         </Pressable>
//         <Pressable style={[styles.createButton, { backgroundColor: "#FFD700" }]} onPress={handleComparePress}>
//           <Text style={styles.buttonText}>Compare Itineraries</Text>
//         </Pressable>
//         <Pressable style={styles.logoutButton} onPress={() => router.push("/")}>
//           <FontAwesome5 name="sign-out-alt" size={24} color="white" />
//         </Pressable>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollViewContainer}>
//         {itineraryList.map((trip) => (
//           <ItineraryCard
//             key={trip.id}
//             {...trip}
//             onDelete={() => setItineraryList((prev) => prev.filter((item) => item.id !== trip.id))}
//             selected={selectedIds.includes(trip.id)}
//             onSelect={() => toggleSelect(trip.id)}
//           />
//         ))}
//       </ScrollView>

//       <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Create Itinerary</Text>
//             <TextInput style={styles.input} placeholder="Preferred Weather" value={weather} onChangeText={setWeather} />
//             <TextInput style={styles.input} placeholder="Preferred Cuisine" value={cuisine} onChangeText={setCuisine} />
//             <TextInput style={styles.input} placeholder="Budget" value={budget} onChangeText={setBudget} keyboardType="numeric" />
//             <TextInput style={styles.input} placeholder="Number of Nights" value={nights} onChangeText={setNights} keyboardType="numeric" />
//             <Pressable style={styles.saveButton} onPress={handleCreateItinerary}>
//               <Text style={styles.buttonText}>Generate Itinerary</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>

//       <Modal visible={compareVisible} transparent animationType="fade" onRequestClose={() => setCompareVisible(false)}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Itinerary Comparison</Text>
//             {selectedIds.length === 2 && getDifferences().map((diff, index) => (
//               <View key={index} style={{ marginBottom: 10 }}>
//                 <Text style={{ fontWeight: 'bold' }}>{diff.label}</Text>
//                 <Text>Option A: {diff.a}</Text>
//                 <Text>Option B: {diff.b}</Text>
//               </View>
//             ))}
//             <Pressable style={styles.saveButton} onPress={() => setCompareVisible(false)}>
//               <Text style={styles.buttonText}>Close</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>

//       <Toast />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#1C1C1C", paddingTop: 60, paddingHorizontal: 20 },
//   header: { flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 20 },
//   createButton: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5 },
//   logoutButton: { backgroundColor: "#9370DB", padding: 10, borderRadius: 5 },
//   scrollViewContainer: { paddingTop: 20 },
//   card: { backgroundColor: "#2C2C2C", padding: 15, borderRadius: 10, marginBottom: 15 },
//   cardTitle: { fontSize: 18, fontWeight: "bold", color: "#9370DB", marginBottom: 5 },
//   cardDetails: { color: "white", marginBottom: 5 },
//   deleteButton: { backgroundColor: "red", padding: 10, borderRadius: 5, marginTop: 10 },
//   buttonText: { color: "white", fontSize: 16, textAlign: "center" },
//   link: { color: "#00BFFF", textDecorationLine: "underline", marginBottom: 5 },
//   modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)" },
//   modalContent: { width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10 },
//   modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
//   input: { width: "100%", padding: 10, borderWidth: 1, borderColor: "gray", borderRadius: 5, marginBottom: 10 },
//   saveButton: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5 },
// });

// export default MainMenu;
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
              role: "system",
              content:
                `You are a travel assistant. Given a preferred weather, cuisine, budget, and number of nights, suggest a destination with a hotel (price, booking link) and a flight (price, booking link) in JSON format.`,
            },
            {
              role: "user",
              content: `Plan a trip with:
                - Weather preference: ${weather}
                - Cuisine preference: ${cuisine}
                - Budget: $${budget}
                - Number of nights: ${nights}

                Look for a two-way flight, and calculate total cost including roundtrip flight and hotel.

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
        <Pressable style={[styles.createButton, { backgroundColor: "#FFD700" }]} onPress={handleComparePress}>
          <Text style={styles.buttonText}>Compare Itineraries</Text>
        </Pressable>
        <Pressable style={styles.logoutButton} onPress={() => router.push("/")}>
          <FontAwesome5 name="sign-out-alt" size={24} color="white" />
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
            <TextInput style={styles.input} placeholder="Preferred Weather" value={weather} onChangeText={setWeather} />
            <TextInput style={styles.input} placeholder="Preferred Cuisine" value={cuisine} onChangeText={setCuisine} />
            <TextInput style={styles.input} placeholder="Budget" value={budget} onChangeText={setBudget} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Number of Nights" value={nights} onChangeText={setNights} keyboardType="numeric" />
            <Pressable style={styles.saveButton} onPress={handleCreateItinerary}>
              <Text style={styles.buttonText}>Generate Itinerary</Text>
            </Pressable>
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
  container: { flex: 1, backgroundColor: "#1C1C1C", paddingTop: 60, paddingHorizontal: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  createButton: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5 },
  logoutButton: { backgroundColor: "#9370DB", padding: 10, borderRadius: 5 },
  scrollViewContainer: { paddingTop: 20 },
  card: { backgroundColor: "#2C2C2C", padding: 15, borderRadius: 10, marginBottom: 15 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#9370DB", marginBottom: 5 },
  cardDetails: { color: "white", marginBottom: 5 },
  deleteButton: { backgroundColor: "red", padding: 10, borderRadius: 5 },
  saveButton: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5 },
  buttonText: { color: "white", fontSize: 16, textAlign: "center" },
  link: { color: "#00BFFF", textDecorationLine: "underline", marginBottom: 5 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)" },
  modalContent: { width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { width: "100%", padding: 10, borderWidth: 1, borderColor: "gray", borderRadius: 5, marginBottom: 10 },
});

export default MainMenu;

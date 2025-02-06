import React, { useState } from "react";
import { Pressable, Text, View, StyleSheet, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect } from "react";

const Button: React.FC<{ title: string; backgroundColor: string; textColor: string; onPress: () => void }> = ({ title, backgroundColor, textColor, onPress }) => (
  <Pressable
    style={({ pressed }) => [
      styles.button,
      { backgroundColor },
      pressed && styles.buttonHover,
    ]}
    onPress={onPress}>
    <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
  </Pressable>
);

const GrabLogin: React.FC = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [notesData, setNotesData] = useState([]);

  const loadNotesData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users");
      if (!response.ok) {
        console.error("Failed to fetch users data from server", response.statusText);
        setNotesData([]);
        return; 
      }
      const data = await response.json();
      setNotesData(data);
      console.log("Notes data loaded", data["docs"][0]["email"]);
    } catch (error) {
      console.error("Error fetching notes data:", error);
      setNotesData([]);
    }
  };

  useEffect(() => {
    console.log("HEY")
    loadNotesData();
  }, []);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
    Alert.alert("Success", "Login successful!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>TripTelligent</Text>
        <Text style={styles.subtitle}>Plan YOUR Vacation</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="gray"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="gray"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <Button title="Login" backgroundColor="#9370DB" textColor="white" onPress={handleLogin} />
        
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>
        
        <Button title="Create Account" backgroundColor="#9370DB" textColor="white" onPress={() => navigation.navigate("AccountCreation")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9370DB',
  },
  card: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9370DB',
    textAlign: 'center',
  },
  subtitle: {
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonHover: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'gray',
  },
  orText: {
    marginHorizontal: 10,
    color: 'gray',
  },
});

export default GrabLogin;

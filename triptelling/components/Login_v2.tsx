
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; // ✅ Expo Router for navigation
import { auth } from "../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

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

const Login = () => {
  const router = useRouter(); // ✅ Navigation using expo-router
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      // ✅ Authenticate with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Login successful!");
      
      // ✅ Redirect to the dashboard or home screen
      router.push("/itineraries");
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", error.message || "Invalid credentials.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Access your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="gray"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="gray"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <Button title="Login" backgroundColor="#9370DB" textColor="white" onPress={handleLogin} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9370DB",
  },
  card: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#9370DB",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonHover: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Login;

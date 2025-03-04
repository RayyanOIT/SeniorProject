import React, { useState } from "react";
import { Pressable, Text, View, StyleSheet, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router"; // ✅ Correct way to navigate

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

const AccountCreation: React.FC = () => {
  const router = useRouter(); // ✅ Use expo-router for navigation
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleSignUp = () => {
    if (!firstName || !lastName || !dob || !username || !password || !confirmPassword) {
      Alert.alert("Error", "All fields must be filled out.");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
  
    setPasswordsMatch(true);
    Alert.alert("Success", "Account created successfully!");
  
    // ✅ Clear all input fields
    setFirstName("");
    setLastName("");
    setDob("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  
    // ✅ Navigate to index page
    router.push("/");
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join us and enjoy seamless service</Text>
        
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="gray"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="gray"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Date of Birth (DD/MM/YYYY)"
          placeholderTextColor="gray"
          value={dob}
          onChangeText={setDob}
        />
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
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={[styles.input, !passwordsMatch && styles.errorInput]}
          placeholder="Confirm Password"
          placeholderTextColor="gray"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {!passwordsMatch && <Text style={styles.errorText}>Passwords do not match</Text>}
        
        <Button title="Sign Up" backgroundColor="#9370DB" textColor="white" onPress={handleSignUp} />
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
    marginBottom: 10,
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
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
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
});

export default AccountCreation;

// import React, { useState } from "react";
// import { Pressable, Text, View, StyleSheet, TextInput, Alert } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { FontAwesome5 } from "@expo/vector-icons";

// const Button: React.FC<{ title: string; backgroundColor: string; textColor: string; onPress: () => void }> = ({ title, backgroundColor, textColor, onPress }) => (
//   <Pressable
//     style={({ pressed }) => [
//       styles.button,
//       { backgroundColor },
//       pressed && styles.buttonHover,
//     ]}
//     onPress={onPress}>
//     <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
//   </Pressable>
// );

// const AccountCreation: React.FC = () => {
//   const navigation = useNavigation();
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [dob, setDob] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [passwordsMatch, setPasswordsMatch] = useState(true);

//   const handleSignUp = () => {
//     if (!firstName || !lastName || !dob || !username || !password || !confirmPassword) {
//       Alert.alert("Error", "All fields must be filled out.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       setPasswordsMatch(false);
//       Alert.alert("Error", "Passwords do not match.");
//       return;
//     }
//     setPasswordsMatch(true);
//     Alert.alert("Success", "Account created successfully!");
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Create Account</Text>
//         <Text style={styles.subtitle}>Join us and enjoy seamless service</Text>
        
//         <TextInput
//           style={styles.input}
//           placeholder="First Name"
//           placeholderTextColor="gray"
//           value={firstName}
//           onChangeText={setFirstName}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Last Name"
//           placeholderTextColor="gray"
//           value={lastName}
//           onChangeText={setLastName}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Date of Birth (DD/MM/YYYY)"
//           placeholderTextColor="gray"
//           value={dob}
//           onChangeText={setDob}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Username"
//           placeholderTextColor="gray"
//           value={username}
//           onChangeText={setUsername}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           placeholderTextColor="gray"
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//         />
//         <TextInput
//           style={[styles.input, !passwordsMatch && styles.errorInput]}
//           placeholder="Confirm Password"
//           placeholderTextColor="gray"
//           secureTextEntry
//           value={confirmPassword}
//           onChangeText={setConfirmPassword}
//         />
//         {!passwordsMatch && <Text style={styles.errorText}>Passwords do not match</Text>}
        
//         <Button title="Sign Up" backgroundColor="#9370DB" textColor="white" onPress={handleSignUp} />
//         {/* <Button title="Back to Login" backgroundColor="#9370DB" textColor="white" onPress={() => navigation.navigate("GrabLogin")} /> */}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#9370DB',
//   },
//   card: {
//     width: '80%',
//     padding: 20,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#9370DB',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   subtitle: {
//     color: 'gray',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   input: {
//     width: '100%',
//     padding: 10,
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 5,
//     marginBottom: 10,
//     fontSize: 16,
//   },
//   errorInput: {
//     borderColor: 'red',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 14,
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 5,
//   },
//   buttonHover: {
//     opacity: 0.7,
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default AccountCreation;

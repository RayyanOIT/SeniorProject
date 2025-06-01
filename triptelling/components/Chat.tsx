import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";


const TravelChatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: { role: "user" | "assistant"; text: string }[] = [
        ...messages,
        { role: "user", text: input },
      ];
      
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`, // Replace this with your actual API key
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful travel assistant who answers travel-related questions." },
            ...newMessages.map((m) => ({ role: m.role, content: m.text })),
          ],
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", text: "Error fetching response." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ marginTop: 80, paddingHorizontal: 20 }}>
    <Pressable style={styles.backButton} onPress={() => router.push("/landing")}>
        <Text style={styles.backText}>Back</Text>
    </Pressable>
    </View>


      <ScrollView style={styles.chatArea} contentContainerStyle={{ paddingBottom: 100 }}>
        {messages.map((msg, index) => (
          <View key={index} style={[styles.messageBubble, msg.role === "user" ? styles.user : styles.bot]}>
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask a travel question..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
        />
        <Pressable style={styles.sendButton} onPress={sendMessage} disabled={loading}>
          <Text style={styles.sendText}>{loading ? "..." : "Send"}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f6f6" },
  chatArea: {
    padding: 20,
    marginTop: 5, // ~1 inch lower
  },  
  messageBubble: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  user: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  bot: {
    alignSelf: "flex-start",
    backgroundColor: "#000", // Slightly darker
  },  
  messageText: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 20, // ~1 inch above the bottom
    width: "100%",
  },  
  input: {
    flex: 1,
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#000",
    paddingHorizontal: 18,
    justifyContent: "center",
    borderRadius: 10,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 12,
    paddingTop: 60,
    paddingBottom: 0,
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
});

export default TravelChatbot;

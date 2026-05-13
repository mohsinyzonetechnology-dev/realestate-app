import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { client } from "@/lib/sanity";
import socket from "@/services/socket";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMarketplaceStore } from "../../../store/marketplaceStore";

export default function ChatRoom() {
  const { roomId, propertyId, propertyTitle, ownerId, initialMessage } =
    useLocalSearchParams();

  const router = useRouter();
  const currentUser = useMarketplaceStore((s) => s.currentUser);
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const safeRoomId = Array.isArray(roomId) ? roomId[0] : roomId;
  const [chatUser, setChatUser] = useState<any>(null);
  const getDisplayName = (email?: string) => {
    if (!email) return "User";
    return email.split("@")[0];
  };

  useEffect(() => {
    if (!safeRoomId || !currentUser) return;

    const fetchChatHistory = async () => {
      try {
        const query = `*[_type == "message" && roomId == $roomId] | order(createdAt asc)`;
        const result = await client.fetch(query, { roomId: safeRoomId });

        const formatted = result.map((msg: any) => ({
          id: msg._id,
          text: msg.text,
          from: msg.from,
          to: msg.to,
          sender: msg.from === currentUser.uid ? "me" : "other",
          senderName: msg.senderName,
        }));
        setMessages(formatted);
      } catch (error) {
        console.log("History error:", error);
      }
    };

    fetchChatHistory();
    socket.emit("join", safeRoomId);

    const handleReceiveMessage = (msg: any) => {
      if (msg.roomId !== safeRoomId) return;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: msg.text,
          from: msg.from,
          to: msg.to,
          sender: msg.from === currentUser.uid ? "me" : "other",
          senderName: msg.senderName,
        },
      ]);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [safeRoomId, currentUser]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !currentUser || !safeRoomId) return;

    const messageData = {
      _type: "message",
      roomId: safeRoomId,
      from: currentUser.uid,
      to: ownerId,
      text: inputText,
      senderName: currentUser.name,
      propertyId,
      propertyTitle,
      createdAt: new Date().toISOString(),
    };

    const localMsg = {
      id: Date.now().toString(),
      text: inputText,
      sender: "me",
    };

    setMessages((prev) => [...prev, localMsg]);
    setInputText("");
    socket.emit("sendMessage", messageData);

    try {
      await client.create(messageData);
    } catch (err) {
      console.log("Sanity error:", err);
    }

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    if (initialMessage && typeof initialMessage === "string") {
      setInputText(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!ownerId) return;
      try {
        const user = await client.fetch(`*[_type == "user" && _id == $id][0]`, {
          id: ownerId,
        });

        setChatUser(user);
      } catch (err) {
        console.log("User fetch error:", err);
      }
    };
    fetchUser();
  }, [ownerId]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 15,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
          borderBottomWidth: 1,
          borderColor: "#eee",
        }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
          />
        </TouchableOpacity>

        <Text style={{ fontWeight: "500", marginLeft: 15, fontSize: 18 }}>
          {getDisplayName(chatUser?.email)}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}
        enabled>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={{
            padding: 15,
            paddingBottom: 30,
            flexGrow: 1,
          }}
          style={{ flex: 1 }}
          renderItem={({ item }) => {
            const isMe = item.from === currentUser?.uid;

            return (
              <View
                style={{
                  alignSelf: isMe ? "flex-end" : "flex-start",
                  backgroundColor: isMe ? "#007AFF" : "#E5E5EA",
                  padding: 12,
                  marginVertical: 4,
                  borderRadius: 18,
                  maxWidth: "75%",
                }}>
                <Text style={{ color: isMe ? "white" : "black" }}>
                  {item.text}
                </Text>
              </View>
            );
          }}
        />

        {/* Input Area */}
        <View
          style={{
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: "#eee",
            paddingHorizontal: 10,
            paddingTop: 8,
            paddingBottom: insets.bottom + 17,
          }}>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <TextInput
              style={{
                flex: 1,
                backgroundColor: "#F2F2F7",
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                maxHeight: 120,
              }}
              placeholder="Write a message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              returnKeyType="send"
              onSubmitEditing={handleSendMessage}
            />

            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
              style={{
                marginLeft: 8,
                backgroundColor: inputText.trim() ? "#007AFF" : "#B0B0B0",
                width: 44,
                height: 44,
                borderRadius: 22,
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Ionicons
                name="send"
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

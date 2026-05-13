import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { client } from "@/lib/sanity";
import { useMarketplaceStore } from "../../../store/marketplaceStore";

interface IMessage {
  roomId: string;
  text: string;
  from: string;
  to: string;
  propertyId: string;
  propertyTitle: string;
  createdAt: string;
}

interface IRoomPreview {
  roomId: string;
  lastMessage: string;
  from: string;
  to: string;
  propertyId: string;
  propertyTitle: string;
  createdAt: string;
}

export default function ChatListScreen() {
  const currentUser = useMarketplaceStore((s) => s.currentUser);
  const [rooms, setRooms] = useState<IRoomPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!currentUser?.uid) return;

    const fetchRooms = async () => {
      try {
        const query = `
          *[_type == "message" && (from == $uid || to == $uid)]
          | order(createdAt desc)
        `;
        const data: IMessage[] = await client.fetch(query, {
          uid: currentUser.uid,
        });

        const grouped = data.reduce(
          (acc: Record<string, IRoomPreview>, msg: IMessage) => {
            if (!acc[msg.roomId]) {
              acc[msg.roomId] = {
                roomId: msg.roomId,
                lastMessage: msg.text,
                from: msg.from,
                to: msg.to,
                propertyId: msg.propertyId,
                propertyTitle: msg.propertyTitle,
                createdAt: msg.createdAt,
              };
            }
            return acc;
          },
          {} as Record<string, IRoomPreview>,
        );

        const uniqueRooms = Object.values(grouped);

        uniqueRooms.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        const names: Record<string, string> = {};

        for (const room of uniqueRooms) {
          const otherUserId =
            room.from === currentUser.uid ? room.to : room.from;

          if (!names[otherUserId]) {
            const user = await client.fetch(
              `*[_type == "user" && _id == $id][0]`,
              { id: otherUserId },
            );

            names[otherUserId] = user?.email?.split("@")[0] || "User";
          }
        }

        setUserNames(names);
        setRooms(uniqueRooms);
      } catch (err) {
        console.log("Fetch rooms error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [currentUser?.uid]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
      />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Chats</Text>
      </View>

      {/* LIST OR EMPTY STATE */}
      {rooms.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={60}
            color="#ccc"
          />
          <Text style={styles.emptyText}>No chats found yet</Text>
        </View>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item, index) =>
            item.roomId ? item.roomId.toString() : index.toString()
          }
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => {
            const isMeSender = item.from === currentUser?.uid;
            const otherUserId = isMeSender ? item.to : item.from;

            return (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/chatSection/[roomId]",
                    params: {
                      roomId: item.roomId,
                      propertyId: item.propertyId,
                      propertyTitle: item.propertyTitle,
                      ownerId: otherUserId,
                    },
                  })
                }
                style={styles.chatCard}
                activeOpacity={0.7}>
                {/* ICON */}
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={24}
                    color="#007AFF"
                  />
                </View>

                {/* TEXT */}
                <View style={styles.textContainer}>
                  <Text
                    style={styles.propertyTitle}
                    numberOfLines={1}>
                    {userNames[isMeSender ? item.to : item.from] || "User"}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={styles.lastMessage}>
                    {item.lastMessage}
                  </Text>
                </View>

                {/* FORWARD ARROW */}
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="#999"
                />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingHorizontal: 30,
    paddingVertical: 36,
    borderBottomWidth: 1,
    borderColor: "#f2f2f2",
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontWeight: "600",
    fontSize: 22,
    color: "#111",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
  },
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f0f8ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  propertyTitle: {
    fontWeight: "600",
    fontSize: 16,
    color: "#222",
  },
  lastMessage: {
    color: "#777",
    marginTop: 4,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 12,
    color: "#999",
    fontSize: 16,
  },
});

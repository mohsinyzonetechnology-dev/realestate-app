import BoostModal from "@/components/modals/BoostModal";
import { useBoostStore } from "@/store/boost.store";
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMarketplaceStore } from "../../store/marketplaceStore";

interface Props {
  onBoost?: (item: any) => void;
}

const MyListings = ({ onBoost }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { selectedItem, closeBoost, confirmBoost, openBoost } = useBoostStore();
  const { users, listings, currentUser, deleteListing, fetchListings } =
    useMarketplaceStore();

  const myPosts = useMemo(() => {
    return listings.filter((item) => item.userId === currentUser?.uid);
  }, [listings, currentUser]);

  const isBoostActive = (item: any) => {
    if (!item?.isBoosted) return false;
    const expiry = item?.boostExpiresAt;
    if (!expiry) return false;
    const expiryDate = new Date(expiry);
    if (isNaN(expiryDate.getTime())) return false;
    return expiryDate.getTime() > Date.now();
  };
  /* ===== DELETE CONFIRM ===== */
  const confirmDelete = (id: string) => {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteListing(id);
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
    );
  };

  const handleConfirmBoost = async () => {
    try {
      await confirmBoost(currentUser, users, fetchListings);
      await fetchListings();

      Alert.alert("Success", "Post Boosted 🚀");
    } catch (err: any) {
      if (err.message === "INSUFFICIENT_BALANCE") {
        Alert.alert("Low Balance", "You need Rs 1000 to boost this post", [
          { text: "Cancel" },
          {
            text: "Wallet",
            onPress: () => {
              closeBoost();
              openBoost(false);
              router.push("/wallet/WalletScreen");
            },
          },
        ]);
      } else {
        Alert.alert("Error", "Boost failed");
      }
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchListings();
      setLoading(false);
    };
    load();
  }, [fetchListings]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Listings</Text>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator
            size="large"
            color="#3B82F6"
          />
          <Text style={styles.loadingText}>Loading listings...</Text>
        </View>
      ) : (
        <FlatList
          data={myPosts}
          keyExtractor={(item) => item._id as string}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* IMAGE */}
              <View style={styles.imageWrapper}>
                {(() => {
                  const mediaItem = item.media?.[0];

                  const isVideo =
                    mediaItem?.asset?.url?.includes(".mp4") ||
                    mediaItem?.mimeType?.startsWith("video") ||
                    mediaItem?._type === "file";

                  if (isVideo) {
                    return (
                      <Video
                        source={{ uri: mediaItem?.asset?.url }}
                        style={styles.image}
                        resizeMode={ResizeMode.COVER}
                        useNativeControls={false}
                        isLooping
                        shouldPlay={false}
                      />
                    );
                  }

                  return (
                    <Image
                      source={{
                        uri:
                          mediaItem?.asset?.url ||
                          "https://via.placeholder.com/400x300",
                      }}
                      style={styles.image}
                    />
                  );
                })()}

                {/* Badge same rahega */}
                <View style={styles.badge}>
                  <Text
                    style={[
                      styles.listingType,
                      {
                        color:
                          item.listingType === "sale" ? "#3B82F6" : "#10B981",
                      },
                    ]}>
                    {item.listingType === "sale" ? "FOR SALE" : "FOR RENT"}
                  </Text>
                </View>
              </View>
              <BoostModal
                visible={!!selectedItem}
                item={selectedItem}
                onClose={closeBoost}
                onConfirm={handleConfirmBoost}
              />
              {/* DETAILS */}
              <View style={styles.details}>
                <Text
                  numberOfLines={1}
                  style={styles.title}>
                  {item.title}
                </Text>

                <Text style={styles.price}>Rs. {item.price}</Text>

                <Text style={styles.meta}>
                  {item.category} • {item.condition}
                </Text>

                <View style={styles.locationRow}>
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color="#6B7280"
                  />
                  <Text
                    numberOfLines={1}
                    style={styles.location}>
                    {item.location}
                  </Text>
                </View>
              </View>

              {/* ACTION BUTTONS */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.editBtn]}
                  onPress={() => router.push(`/edit/${item._id}` as any)}>
                  <Ionicons
                    name="create-outline"
                    size={16}
                    color="#3B82F6"
                  />
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                {/* Delete */}
                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => confirmDelete(item._id as string)}>
                  <Ionicons
                    name="trash-outline"
                    size={16}
                    color="#EF4444"
                  />
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
                {/* Boost */}
                <TouchableOpacity
                  disabled={isBoostActive(item)}
                  onPress={() => openBoost(item)}
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: isBoostActive(item)
                        ? "#9CA3AF"
                        : "#F59E0B",
                      opacity: isBoostActive(item) ? 0.6 : 1,
                    },
                  ]}>
                  <Ionicons
                    name={
                      isBoostActive(item)
                        ? "checkmark-circle"
                        : "rocket-outline"
                    }
                    size={16}
                    color="#fff"
                  />
                  <Text
                    style={{ color: "#fff", fontWeight: "600", marginLeft: 4 }}>
                    {isBoostActive(item) ? "Boosted" : "Boost"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="document-outline"
                size={56}
                color="#9CA3AF"
              />
              <Text style={styles.emptyText}>
                You havent posted anything yet.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default MyListings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },
  listContainer: {
    paddingBottom: 24,
  },
  centerContainer: {
    marginTop: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    // Shadowing
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 180,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  listingType: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  details: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  meta: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 13,
    marginLeft: 6,
    color: "#4B5563",
  },
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editBtn: {
    backgroundColor: "#EFF6FF",
  },
  editText: {
    marginLeft: 6,
    color: "#3B82F6",
    fontWeight: "600",
    fontSize: 13,
  },
  deleteBtn: {
    backgroundColor: "#FEF2F2",
    flexDirection: "row",
    alignItems: "center",
  },
  deleteText: {
    marginLeft: 6,
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 13,
  },
  empty: {
    alignItems: "center",
    marginTop: 80,
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "500",
  },
});

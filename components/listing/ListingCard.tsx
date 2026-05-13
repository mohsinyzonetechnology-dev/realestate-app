import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import React from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  loading: boolean;
  listings: any[];
  currentUser: any;
  users: any;
  onOpenDetail: (item: any) => void;
}

export default function ListingList({
  loading,
  listings,
  currentUser,
  users,
  onOpenDetail,
}: Props) {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          color="#3B82F6"
        />
        <Text style={styles.loadingText}>Loading listings...</Text>
      </View>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons
          name="search-outline"
          size={56}
          color="#9CA3AF"
        />
        <Text style={styles.emptyText}>
          No listings found.{"\n"}
          <Text style={styles.subText}>Try another category.</Text>
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {listings.map((item) => {
        const isOwner = currentUser?.uid && item.userId === currentUser.uid;
        const isUnlocked = users?.[
          currentUser?.uid || ""
        ]?.unlockedPosts?.includes(item._id);
        const isLocked = !isOwner && !isUnlocked;
        return (
          <View
            key={item._id}
            style={styles.card}>
            {/* IMAGE + DETAILS */}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onOpenDetail(item)}>
              <View style={styles.imageWrapper}>
                {item.video ? (
                  <Video
                    source={{ uri: item.video }}
                    style={[styles.image, isLocked && { opacity: 0.3 }]}
                    resizeMode={ResizeMode.COVER}
                    isMuted
                    shouldPlay={false}
                  />
                ) : (
                  <Image
                    source={{
                      uri: item.images?.[0]
                        ? item.images[0] + "?w=400&h=300&fit=crop"
                        : "https://via.placeholder.com/600x400",
                    }}
                    style={styles.image}
                    blurRadius={isLocked ? 6 : 0}
                  />
                )}
                {isOwner && (
                  <View style={[styles.badge, styles.badgeOwner]}>
                    <Text style={styles.badgeText}>Owner</Text>
                  </View>
                )}
                {!isOwner && isUnlocked && (
                  <View style={[styles.badge, styles.badgeUnlocked]}>
                    <Ionicons
                      name="lock-open"
                      size={12}
                      color="#fff"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.badgeText}>Unlocked</Text>
                  </View>
                )}
              </View>

              <View style={styles.contentContainer}>
                <View style={styles.row}>
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

                <Text
                  numberOfLines={1}
                  style={styles.title}>
                  Titel : {item.title}
                </Text>

                <Text style={styles.price}>Rs. {item.price}</Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons
                      name="pricetag-outline"
                      size={14}
                      color="#6B7280"
                    />
                    <Text style={styles.metaText}>{item.condition}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#6B7280"
                    />
                    <Text
                      numberOfLines={1}
                      style={[styles.metaText, { flex: 1 }]}>
                      {item.location}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  emptyText: {
    color: "#4B5563",
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  subText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    // Shadow effects
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  badgeOwner: {
    backgroundColor: "#3B82F6",
  },
  badgeUnlocked: {
    backgroundColor: "#10B981",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  contentContainer: {
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  listingType: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  metaText: {
    fontSize: 13,
    color: "#4B5563",
  },
  actionsContainer: {
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
});

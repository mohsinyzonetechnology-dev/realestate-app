import { createRoomId } from "@/utils/createRoomId";
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMarketplaceStore } from "../../../store/marketplaceStore";

const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = 320;

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const { listings } = useMarketplaceStore();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const item = listings.find((l) => l._id === id);
  const currentUser = useMarketplaceStore((s) => s.currentUser);
  const defaultMessage =
    "Hi, I am interested in your property. Is it still available?";

  if (!item) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Product not found!</Text>
      </View>
    );
  }

  const goNext = () => {
    if (currentIndex < item.media.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      {/* Slider Container */}
      <View style={styles.sliderContainer}>
        <FlatList
          ref={flatListRef}
          data={item.media}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(img, index) => index.toString()}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          renderItem={({ item: mediaItem }) => {
            const isVideo =
              mediaItem?.asset?.url?.includes(".mp4") ||
              mediaItem?.mimeType?.startsWith("video") ||
              mediaItem?._type === "file";

            if (isVideo) {
              return (
                <View style={{ width }}>
                  <Video
                    source={{ uri: mediaItem?.asset?.url }}
                    style={{ width, height: IMAGE_HEIGHT }}
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                    isLooping
                  />
                </View>
              );
            }

            return (
              <View style={{ width }}>
                <Image
                  source={{ uri: mediaItem?.asset?.url }}
                  style={{ width, height: IMAGE_HEIGHT }}
                  resizeMode="cover"
                />
              </View>
            );
          }}
        />

        {/* Buttons Overlay */}
        <View style={styles.overlayButtons}>
          <TouchableOpacity
            onPress={goPrev}
            style={[styles.arrowButton, { opacity: currentIndex > 0 ? 1 : 0 }]}>
            <Ionicons
              name="chevron-back-circle"
              size={40}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goNext}
            style={[
              styles.arrowButton,
              { opacity: currentIndex < item.media.length - 1 ? 1 : 0 },
            ]}>
            <Ionicons
              name="chevron-forward-circle"
              size={40}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Details Container */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>Rs {item.price}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {item.description || "No description provided."}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons
            name="location"
            size={18}
            color="gray"
          />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
      </View>

      {/* Interested Button */}
      {currentUser?.uid !== item.userId && (
        <TouchableOpacity
          style={styles.interestedBtn}
          onPress={() => {
            const userId = currentUser?.uid;
            const ownerId = item.userId;
            const propertyId = item._id;

            if (!userId || !ownerId || !propertyId) return;

            const roomId = createRoomId(userId, ownerId);
            router.push({
              pathname: "/chatSection/[roomId]",
              params: {
                roomId,
                propertyId,
                propertyTitle: item.title,
                ownerId,
                initialMessage: defaultMessage,
              },
            });
          }}>
          <Text style={styles.interestedText}>I’m Interested</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "gray",
  },
  sliderContainer: {
    position: "relative",
    height: IMAGE_HEIGHT,
    width: "100%",
  },
  overlayButtons: {
    position: "absolute",
    top: IMAGE_HEIGHT / 2 - 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  arrowButton: {
    // Ensures a solid touchable area for the buttons
    padding: 4,
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
  },
  price: {
    fontSize: 18,
    color: "#1877F2",
    fontWeight: "600",
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  locationText: {
    marginLeft: 6,
    color: "gray",
  },
  interestedBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: "center",
  },
  interestedText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

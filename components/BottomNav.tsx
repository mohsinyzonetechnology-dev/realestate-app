import { CATEGORIES, CategoryEnum } from "@/constants/listing";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CategoryItem {
  id: string;
  name: CategoryEnum;
  icon: string;
}

interface BottomNavProps {
  onCategoryChange?: (category: CategoryEnum) => void;
  selectedCategory?: CategoryEnum | null;
}

export default function BottomNav({
  onCategoryChange,
  selectedCategory,
}: BottomNavProps) {
  const [selectedId, setSelectedId] = useState<string>("1");
  const insets = useSafeAreaInsets(); // Automatically safe area padding calculate karta hai

  const handlePress = (item: CategoryItem) => {
    setSelectedId(item.id);
    onCategoryChange?.(item.name);
  };

  const renderItem = ({ item }: { item: CategoryItem }) => {
    const isSelected = item.id === selectedId;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.item, isSelected && styles.activeItemContainer]}
        onPress={() => handlePress(item)}>
        <View
          style={[styles.iconWrapper, isSelected && styles.activeIconWrapper]}>
          <Ionicons
            name={(item.icon || "home-outline") as any}
            size={18}
            color={isSelected ? "#006AFF" : "#6B7280"}
          />
        </View>

        <Text style={[styles.title, isSelected && styles.activeText]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    if (!selectedCategory) {
      setSelectedId(""); // default (All / Home)
      return;
    }

    const match = CATEGORIES.find((c) => c.name === selectedCategory);
    if (match) {
      setSelectedId(match.id);
    }
  }, [selectedCategory]);
  return (
    // SafeArea bottom insets dynamic add honge
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, 12) },
      ]}>
      <FlatList
        data={CATEGORIES as readonly CategoryItem[]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listPadding}
      />
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    justifyContent: "center",
    paddingTop: 10,
    // Shadows and Elevation for professional design
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  listPadding: {
    paddingHorizontal: 12,
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: "#F3F4F6",
  },
  activeItemContainer: {
    backgroundColor: "#EFF6FF",
    borderColor: "#3B82F6",
    borderWidth: 1,
  },
  iconWrapper: {
    marginRight: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIconWrapper: {},
  title: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  activeText: {
    color: "#006AFF",
    fontWeight: "700",
  },
});

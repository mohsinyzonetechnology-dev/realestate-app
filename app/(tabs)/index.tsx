import BottomNav from "@/components/BottomNav";
import ListingList from "@/components/listing/ListingCard";
import { CATEGORIES, CategoryEnum } from "@/constants/listing";
import { useBoostedListings } from "@/hooks/useBoostListing";
import { client } from "@/lib/sanity";
import { Listing } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SellBottomSheet from "../../components/modals/SellBottomSheet";
import { useMarketplaceStore } from "../../store/marketplaceStore";
import { styles } from "../../style/index";

type Category = {
  id: string;
  name: string;
  icon: string;
};

export default function MarketplaceHome() {
  const router = useRouter();
  const categories = CATEGORIES;
  const bottomSheetRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const { users, listings, currentUser, fetchListings } = useMarketplaceStore();
  const [expandedType, setExpandedType] = useState<"sale" | "rent" | null>(
    null,
  );
  const balance = users[currentUser?.uid || ""]?.balance ?? 0;
  const { filter, type } = useLocalSearchParams<{
    filter: string;
    type: string;
  }>();

  const filteredListings = useMemo(() => {
    if (!filter && !type) return listings;

    return listings.filter(
      (item) =>
        (!filter || item.category === filter) &&
        (!type || item.listingType === type),
    );
  }, [listings, filter, type]);
  const sortedListings = useBoostedListings(filteredListings);

  const handleOpenSell = useCallback(async () => {
    const uid = currentUser?.uid;
    if (!uid) {
      Alert.alert("Error", "User not logged in yet");
      router.replace("/(auth)/FormLogin");
      return;
    }

    try {
      const userPlan = await client.fetch(
        `*[_type == "user" && _id == $uid][0]`,
        { uid },
      );

      if (!userPlan) {
        Alert.alert("Error", "User not found");
        return;
      }

      if (!userPlan.currentPlan) {
        Alert.alert("No Active Plan", "Buy a plan to continue", [
          { text: "Cancel", style: "cancel" },
          { text: "View Plans", onPress: () => router.push("/plan/plan") },
        ]);
        return;
      }

      if (userPlan.postsUsed >= userPlan.postsLimit) {
        Alert.alert("Limit Reached", "Upgrade your plan", [
          { text: "Cancel", style: "cancel" },
          { text: "Upgrade", onPress: () => router.push("/plan/plan") },
        ]);
        return;
      }

      setTimeout(() => {
        bottomSheetRef.current?.present();
      }, 50);
    } catch (error) {
      console.log("Plan check error:", error);
      Alert.alert("Error", "Something went wrong");
    }
  }, [currentUser, router]);

  const handleOpenDetail = (item: Listing) => {
    const uid = currentUser?.uid;
    const isOwner = item.userId === uid;
    const isUnlocked = users[uid || ""]?.unlockedPosts?.includes(
      item._id ?? "",
    );
    if (isOwner) {
      router.push(`/property/${item._id}`);
      return;
    }
    if (isUnlocked) {
      router.push(`/property/${item._id}`);
      return;
    }
    if (balance < 5) {
      Alert.alert("Low Balance", "Rs.5 required to view this post", [
        { text: "Cancel" },
        {
          text: "Open Wallet",
          onPress: () => router.push("/wallet/WalletScreen"),
        },
      ]);
      return;
    }
    router.push({
      pathname: "/visit/payScreen",
      params: { id: item._id },
    });
  };

  const handleFilter = useCallback(
    (category: string, type: "sale" | "rent") => {
      router.setParams({ filter: category, type });
      setShowDropdown(false);
    },
    [router],
  );

  const handleCategoryFromNav = (category: CategoryEnum) => {
    router.setParams({
      filter: category,
      type: "",
    });
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
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ zIndex: 10, backgroundColor: "#fff" }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Marketplace</Text>
        </View>

        {/*  Buttons Row */}
        <View style={styles.stickyContainer}>
          <View style={styles.topButtonsRow}>
            <TouchableOpacity
              style={styles.mainBtn}
              onPress={handleOpenSell}>
              <Ionicons
                name="create-outline"
                size={20}
                color="#1c1c1e"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.mainBtnText}>Sell</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mainBtn}
              onPress={() => setShowDropdown(!showDropdown)}>
              <Ionicons
                name="list-outline"
                size={20}
                color="#1c1c1e"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.mainBtnText}>Categories</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/*  Active Filter Row */}
        {(filter || type) && (
          <View style={styles.activeFilterRow}>
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <Ionicons
                name="funnel"
                size={14}
                color="#3B82F6"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{ fontSize: 14, color: "#1C1C1E" }}
                numberOfLines={1}>
                Showing:{" "}
                <Text style={{ fontWeight: "700" }}>{filter || "All"}</Text>
                {type ? ` • ${type}` : ""}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.setParams({ filter: "", type: "" })}
              style={{
                paddingLeft: 15,
                paddingVertical: 5,
              }}>
              <Text
                style={{
                  color: "#EF4444",
                  fontWeight: "bold",
                  fontSize: 14,
                }}>
                Clear
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/*  Dropdown Row  */}
        {showDropdown && (
          <View
            style={[
              styles.dropdownContainer,
              { elevation: 5, shadowOpacity: 0.1, shadowRadius: 4 },
            ]}>
            <TouchableOpacity
              onPress={() => setShowDropdown(false)}
              style={styles.closeBtn}>
              <Ionicons
                name="close"
                size={20}
                color="#4B5563"
              />
            </TouchableOpacity>

            <View style={styles.dropdownSection}>
              <TouchableOpacity
                style={styles.dropdownHeader2}
                activeOpacity={0.7}
                onPress={() =>
                  setExpandedType(expandedType === "sale" ? null : "sale")
                }>
                <View style={styles.headerLeft}>
                  <View style={[styles.dot, { backgroundColor: "#3B82F6" }]} />
                  <Text style={styles.dropdownTitle2}>Property For Sale</Text>
                </View>
                <Ionicons
                  name={expandedType === "sale" ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#6B7280"
                />
              </TouchableOpacity>

              {expandedType === "sale" && (
                <View style={styles.itemsList}>
                  {categories.map((cat: Category) => (
                    <TouchableOpacity
                      key={`sale-${cat.id}`}
                      style={styles.dropdownItem2}
                      onPress={() => handleFilter(cat.name, "sale")}>
                      <Ionicons
                        name={cat.icon as any}
                        size={16}
                        color="#3B82F6"
                        style={{ marginRight: 12 }}
                      />
                      <Text style={styles.dropdownItemText}>{cat.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.dropdownSection}>
              <TouchableOpacity
                style={styles.dropdownHeader2}
                activeOpacity={0.7}
                onPress={() =>
                  setExpandedType(expandedType === "rent" ? null : "rent")
                }>
                <View style={styles.headerLeft}>
                  <View style={[styles.dot, { backgroundColor: "#10B981" }]} />
                  <Text style={styles.dropdownTitle2}>Property For Rent</Text>
                </View>
                <Ionicons
                  name={expandedType === "rent" ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#6B7280"
                />
              </TouchableOpacity>

              {expandedType === "rent" && (
                <View style={styles.itemsList}>
                  {categories.map((cat: Category) => (
                    <TouchableOpacity
                      key={`rent-${cat.id}`}
                      style={styles.dropdownItem2}
                      onPress={() => handleFilter(cat.name, "rent")}>
                      <Ionicons
                        name={cat.icon as any}
                        size={16}
                        color="#10B981"
                        style={{ marginRight: 12 }}
                      />
                      <Text style={styles.dropdownItemText}>{cat.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Scrollable Listings Section Only */}
      <ScrollView
        contentContainerStyle={[styles.feedGrid, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.todayPicksHeader}>
          <Text style={styles.picksTitle}>
            {filter || type ? "Filtered Results" : "All Posts"}
          </Text>
        </View>

        <View style={styles.gridContainer}>
          <ListingList
            loading={loading}
            listings={sortedListings}
            currentUser={currentUser}
            users={users}
            onOpenDetail={handleOpenDetail}
          />
        </View>
      </ScrollView>

      {/*  Bottom Nav */}
      <View style={styles.bottomNav}>
        <BottomNav
          onCategoryChange={handleCategoryFromNav}
          selectedCategory={filter as CategoryEnum}
        />
      </View>

      <View
        style={StyleSheet.absoluteFill}
        pointerEvents="box-none">
        <SellBottomSheet ref={bottomSheetRef} />
      </View>
    </View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { logoutUser } from "../services/auth.service";
import { useMarketplaceStore } from "../store/marketplaceStore";

/* ================= MENU ITEM ================= */
const MenuItem = ({ icon, label, onPress }: any) => (
  <TouchableOpacity
    style={styles.item}
    onPress={onPress}>
    <Ionicons
      name={icon}
      size={20}
      color="#333"
    />
    <Text style={{ marginLeft: 10 }}>{label}</Text>
  </TouchableOpacity>
);

export default function Navbar() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const setCurrentUser = useMarketplaceStore((s) => s.setCurrentUser);
  const currentUser = useMarketplaceStore((s) => s.currentUser);
  const userData = useMarketplaceStore((s) =>
    currentUser?.uid ? s.users[currentUser.uid] : undefined,
  );
  const fetchUserData = useMarketplaceStore((s) => s.fetchUserData);
  const postsUsed = userData?.postsUsed ?? 0;
  const postsLimit = userData?.postsLimit ?? 0;
  const remainingPosts = Math.max(0, postsLimit - postsUsed);
  const planName = userData?.currentPlan || "No Active Plan";
  const requireAuth = () => {
    if (!currentUser) {
      setOpen(false);
      router.push("/(auth)/FormLogin");
      return false;
    }
    return true;
  };
  const daysLeft = userData?.planExpire
    ? Math.max(
        0,
        Math.ceil(
          (new Date(userData.planExpire).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : null;
  const updateProfileImage = useMarketplaceStore((s) => s.updateProfileImage);
  const handlePickImage = async () => {
    if (!requireAuth()) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Gallery permission required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      updateProfileImage(uri);
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setOpen(false);
    router.replace("/(auth)/FormLogin");
  };

  useEffect(() => {
    if (currentUser?.uid) {
      fetchUserData(currentUser.uid).finally(() => setLoading(false));
    }
  }, [currentUser, fetchUserData]);

  return (
    <>
      {/* NAVBAR */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.logoSection}
            onPress={() => router.replace("/")}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
            />
            <View>
              <Text style={styles.brandText}>Real State</Text>
              <Text style={styles.tagline}>Marketplace</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setOpen(true)}>
            <Ionicons
              name="menu"
              size={28}
              color="#1A5F7A"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* DRAWER */}
      <Modal
        visible={open}
        transparent
        animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.drawer}>
            {/* CLOSE */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setOpen(false)}>
              <Ionicons
                name="close"
                size={26}
              />
            </TouchableOpacity>

            {/* AVATAR */}
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={handlePickImage}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  marginBottom: 4,
                }}
                activeOpacity={0.7}>
                {userData?.photoURL || currentUser?.photoURL ? (
                  <Image
                    source={{
                      uri: userData?.photoURL || currentUser?.photoURL,
                    }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons
                      name="camera"
                      size={30}
                      color="#666"
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
            {/* USER INFO */}
            <Text style={styles.name}>
              {userData?.userName || currentUser?.displayName || "No Name"}
            </Text>

            <Text style={styles.email}>{currentUser?.email || "No Email"}</Text>

            {/* MENU */}
            <View style={styles.menu}>
              <MenuItem
                icon="wallet-outline"
                label={`Balance: Rs. ${loading ? "Loading..." : (userData?.balance ?? 0)}`}
                onPress={() => {
                  if (!requireAuth()) return;
                  setOpen(false);
                  router.push("/wallet/WalletScreen");
                }}
              />

              <MenuItem
                icon="rocket-outline"
                label="Upgrade Plan"
                onPress={() => {
                  if (!requireAuth()) return;
                  setOpen(false);
                  router.push("/plan/plan");
                }}
              />

              <MenuItem
                icon="list-outline"
                label="My Posts"
                onPress={() => {
                  if (!requireAuth()) return;
                  setOpen(false);
                  router.push("/(tabs)/my-posts");
                }}
              />

              <MenuItem
                icon="chatbubble-outline"
                label="My Chat"
                onPress={() => {
                  if (!requireAuth()) return;
                  setOpen(false);
                  router.push("/chatSection/Chat");
                }}
              />
            </View>

            {/* PLAN INFO */}
            <View
              style={[
                styles.planBox,
                {
                  borderColor: planName === "unlimited" ? "#673AB7" : "#1A5F7A",
                },
              ]}>
              <Text style={styles.planTitle}>Your Active Plan</Text>

              <Text
                style={[
                  styles.planValue,
                  {
                    color: planName === "unlimited" ? "#673AB7" : "#1A5F7A",
                  },
                ]}>
                {planName.toUpperCase()}
              </Text>

              <Text style={styles.usage}>
                Posts Used: {postsUsed} / {postsLimit || "∞"}
              </Text>

              <Text style={styles.remaining}>
                Remaining:{" "}
                {planName === "unlimited" ? "Unlimited" : remainingPosts}
              </Text>

              <Text style={styles.remaining}>
                Plan Expiry:{" "}
                {daysLeft === null
                  ? "Loading..."
                  : daysLeft > 0
                    ? `${daysLeft} days left`
                    : "Expired"}
              </Text>
            </View>
            {/* LOGOUT */}
            {currentUser ? (
              <TouchableOpacity
                style={styles.logout}
                onPress={handleLogout}>
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color="red"
                />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.logIn}
                onPress={handleLogout}>
                <Ionicons
                  name="log-in-outline"
                  size={20}
                  color="red"
                />
                <Text style={styles.logoutText}>LogIn</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 30 : 0,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },

  container: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  logoSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },

  brandText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A5F7A",
  },

  tagline: {
    fontSize: 10,
    color: "#86B6BB",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  drawer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  closeBtn: {
    alignSelf: "flex-end",
  },

  avatar: {
    width: 75,
    height: 75,
    borderRadius: 37,
    alignSelf: "center",
    marginVertical: 10,
  },

  name: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },

  email: {
    textAlign: "center",
    color: "gray",
    marginBottom: 20,
  },

  menu: {
    marginTop: 10,
  },

  item: {
    flexDirection: "row",
    paddingVertical: 14,
    alignItems: "center",
  },

  logout: {
    flexDirection: "row",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#eee",
    marginTop: 10,
    alignItems: "center",
  },
  logIn: {
    flexDirection: "row",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#eee",
    marginTop: 10,
    alignItems: "center",
  },

  logoutText: {
    color: "red",
    marginLeft: 10,
    fontWeight: "600",
  },
  planBox: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
  },

  planTitle: {
    fontWeight: "700",
    marginBottom: 5,
  },

  planValue: {
    color: "#1877F2",
    fontWeight: "600",
  },

  usage: {
    marginTop: 5,
    color: "#444",
  },

  remaining: {
    marginTop: 3,
    color: "#666",
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    alignSelf: "center",
  },
});

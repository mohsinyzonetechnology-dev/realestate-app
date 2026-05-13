import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMarketplaceStore } from "../../../store/marketplaceStore";
import { styles } from "../../../style/payScreen";

export default function PayScreen() {
  const [loading, setLoading] = useState(false);
  const { id } = useLocalSearchParams();
  const postId = String(id);
  const { currentUser, users, unlockPost } = useMarketplaceStore();
  const balance = useMarketplaceStore(
    (s) => s.users[s.currentUser?.uid || ""]?.balance ?? 0,
  );
  const [amount] = useState(5);
  const isAlreadyUnlocked =
    users[currentUser?.uid || ""]?.unlockedPosts?.includes(postId) ?? false;
  const handlePay = () => {
    if (isAlreadyUnlocked) {
      router.replace(`/property/${id}`);
      return;
    }
    if (balance < amount) {
      Alert.alert("Insufficient Balance", "Please add money to your wallet.");
      return;
    }

    Alert.alert(
      "Confirm Payment",
      `Rs. ${amount} will be deducted from your wallet.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Pay Now",
          onPress: async () => {
            try {
              setLoading(true);
              await unlockPost(postId, amount);
              setTimeout(() => {
                setLoading(false);
                router.replace(`/property/${id}`);
              }, 500);
            } catch (error: any) {
              Alert.alert("Error", error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Icon */}
        <View style={styles.iconContainer}>
          <Ionicons
            name="lock-open-outline"
            size={50}
            color="#4CAF50"
          />
        </View>

        <Text style={styles.title}>Unlock Premium Post</Text>
        <Text style={styles.subtitle}>
          Get full access to contact details and location.
        </Text>

        {/* Pricing Card */}
        <View style={styles.card}>
          <Text style={styles.label}>Unlock Charges</Text>
          <View style={styles.priceRow}>
            <Text style={styles.amountText}>Rs. {amount}</Text>
          </View>
        </View>

        {/* Balance Info */}
        <View style={styles.balanceContainer}>
          <Ionicons
            name="wallet-outline"
            size={20}
            color="#666"
          />
          <Text style={styles.balanceText}> Available Balance: </Text>
          <Text style={styles.balanceAmount}>Rs. {balance}</Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={handlePay}
          disabled={loading || balance < amount}
          style={[
            styles.payBtn,
            (balance < amount || loading) && styles.disabledBtn,
          ]}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payBtnText}>Confirm & Pay Rs. {amount}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

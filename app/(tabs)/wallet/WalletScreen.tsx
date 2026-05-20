import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useMarketplaceStore } from "../../../store/marketplaceStore";
import { styles } from "../../../style/walletScreen";

const WalletScreen = () => {
  const [loading, setLoading] = useState(false);
  const [showMsg] = useState(false);
<<<<<<< HEAD
=======

>>>>>>> 24271f71e8db66cdfed1193bde9c5fec9922dcda
  const balance = useMarketplaceStore(
    (s) => s.users[s.currentUser?.uid || ""]?.balance ?? 0,
  );
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      WebBrowser.dismissBrowser();

      if (url.includes("payment-success")) {
        alert("Payment successful");
      }
      if (url.includes("payment-cancel")) {
        alert("Payment cancelled");
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const payNow = async () => {
    try {
      setLoading(true);

<<<<<<< HEAD
      const response = await fetch(`${API_URL}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
=======
      const response = await fetch(
        "http://localhost:5000/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product: "T-Shirt",
            amount: 500,
          }),
>>>>>>> 24271f71e8db66cdfed1193bde9c5fec9922dcda
        },
        body: JSON.stringify({
          product: "T-Shirt",
          amount: 500,
          currency: "usd",
        }),
      });

      const data = await response.json();

      if (!data?.url) {
        Alert.alert("Error", "No checkout URL received");
        return;
      }

      await WebBrowser.openBrowserAsync(data.url);
<<<<<<< HEAD
      console.log("checkout URL received :", data.url);
    } catch (e: any) {
      console.log(e);
=======
    } catch (e: any) {
>>>>>>> 24271f71e8db66cdfed1193bde9c5fec9922dcda
      Alert.alert("Payment Error", e.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={[styles.container]}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="#000"
              />
            </TouchableOpacity>

            <Text style={styles.title}>💳 My Wallet</Text>

            {showMsg && (
              <View style={styles.toast}>
                <Text style={styles.toastText}>Successfull !</Text>
              </View>
            )}

            <View style={styles.card}>
              <Text style={styles.label}>Available Balance</Text>
              <Text style={styles.balanceText}>Rs. {balance}</Text>
            </View>

            <Text style={styles.subtitle}>Quick Top-up</Text>

            <TouchableOpacity
              style={styles.addBtn}
              onPress={payNow}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.addBtnText}>Pay with Safepay</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default WalletScreen;

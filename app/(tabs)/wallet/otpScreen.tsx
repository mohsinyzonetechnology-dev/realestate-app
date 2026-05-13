import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useMarketplaceStore } from "../../../store/marketplaceStore";

const OtpScreen = () => {
  const { token, amount } = useLocalSearchParams();
  const [otp, setOtp] = useState("");

  const updateBalance = useMarketplaceStore((s) => s.updateBalance);

  // 🔥 STEP: VERIFY OTP WITH SAFEPAY
  const verifyOtp = async () => {
    try {
      const res = await fetch(
        "https://sandbox.api.getsafepay.com/order/v1/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            otp,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        await updateBalance(Number(amount));

        Alert.alert("Success", "Payment Completed 🎉");

        router.replace("/plan/plan");
      } else {
        Alert.alert("Error", "Invalid OTP ❌");
      }
    } catch (err: any) {
      Alert.alert("Error", "Verification failed", err);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        OTP sent to your phone 📱
      </Text>

      <TextInput
        placeholder="Enter OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
        style={{
          borderWidth: 1,
          padding: 12,
          borderRadius: 10,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={verifyOtp}
        style={{
          backgroundColor: "black",
          padding: 15,
          borderRadius: 10,
        }}>
        <Text style={{ color: "white", textAlign: "center" }}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OtpScreen;

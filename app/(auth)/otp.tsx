import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../services/firebase";

const OtpScreen = () => {
  const router = useRouter();
  const { verificationId, phone } = useLocalSearchParams();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setError("");

      if (!code || code.length < 6) {
        setError("Enter valid OTP");
        return;
      }

      setLoading(true);

      // 🔥 Create credential for verification
      const credential = PhoneAuthProvider.credential(
        verificationId as string,
        code,
      );

      await signInWithCredential(auth, credential);
      setLoading(false);

      router.replace("/");
    } catch (e: any) {
      setLoading(false);
      console.log("OTP Error:", e);
      setError("Invalid or expired OTP");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <View>
        <Text style={styles.title}>Enter OTP sent to {phone}</Text>

        <TextInput
          value={code}
          onChangeText={(text) => {
            setCode(text);
            setError("");
          }}
          keyboardType="number-pad"
          placeholder="123456"
          style={styles.input}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          onPress={handleVerify}
          style={styles.button}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify OTP</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10,
    padding: 15,
    borderRadius: 5,
    fontSize: 18,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

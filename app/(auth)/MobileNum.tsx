import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// import Constants from "expo-constants";
// import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../services/firebase";

const MobileNumberScreen = () => {
  const router = useRouter();
  const recaptchaVerifier = useRef<any>(null);

  const [countryCode, setCountryCode] = useState("+92");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    try {
      setError("");
      setLoading(true);

      let formattedNumber = phoneNumber.trim();

      if (formattedNumber.startsWith("0")) {
        formattedNumber = formattedNumber.substring(1);
      }

      if (formattedNumber.length !== 10 || isNaN(Number(formattedNumber))) {
        setError("Exactly 10 digits are allowed (e.g., 3001234567)");
        setLoading(false);
        return;
      }

      const fullNumber = `${countryCode}${formattedNumber}`;

      const confirmation = await signInWithPhoneNumber(
        auth,
        fullNumber,
        recaptchaVerifier.current,
      );

      setLoading(false);

      router.push({
        pathname: "/(auth)/otp",
        params: {
          phone: fullNumber,
          verificationId: confirmation.verificationId,
        },
      });
    } catch (e: any) {
      setLoading(false);
      console.log("OTP Error:", e);

      if (e.code === "auth/invalid-phone-number") {
        setError("The phone number is not valid. Please check and try again.");
      } else {
        setError(e.message || "Failed to send OTP. Check your connection.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          {/* <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={Constants.expoConfig?.extra?.firebase}
          /> */}

          <Text style={styles.title}>Enter Your Phone Number</Text>

          <View style={styles.inputContainer}>
            <View style={styles.countryCodeBox}>
              <TextInput
                value={countryCode}
                onChangeText={setCountryCode}
                keyboardType="phone-pad"
                style={styles.countryCodeText}
              />
            </View>

            <TextInput
              style={styles.phoneNumberInput}
              placeholder="3001234567"
              keyboardType="phone-pad"
              maxLength={12}
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                setError("");
              }}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.button}
            onPress={handleContinue}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default MobileNumberScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  inner: {},
  title: { fontSize: 20, marginBottom: 20 },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  countryCodeBox: {
    width: 70,
    borderWidth: 1,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  countryCodeText: {
    fontSize: 16,
  },
  phoneNumberInput: {
    flex: 1,
    borderWidth: 1,
    padding: 12,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

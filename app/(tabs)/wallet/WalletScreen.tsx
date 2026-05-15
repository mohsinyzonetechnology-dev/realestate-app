// import { Ionicons } from "@expo/vector-icons";
// import * as Linking from "expo-linking"; // Use expo-linking for better Expo support
// import { router } from "expo-router";
// import * as WebBrowser from "expo-web-browser";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Keyboard,
//   Platform,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";
// import { useMarketplaceStore } from "../../../store/marketplaceStore";
// import { styles } from "../../../style/walletScreen";

// const WalletScreen = () => {
//   const [loading, setLoading] = useState(false);
//   const [showMsg] = useState(false);
//   const [keyboardPadding, setKeyboardPadding] = useState(20);

//   const balance = useMarketplaceStore(
//     (s) => s.users[s.currentUser?.uid || ""]?.balance ?? 0,
//   );

//   // 1. Handle Keyboard
//   useEffect(() => {
//     const showSubscription = Keyboard.addListener(
//       Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
//       (e) => setKeyboardPadding(e.endCoordinates.height + 20),
//     );
//     const hideSubscription = Keyboard.addListener(
//       Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
//       () => setKeyboardPadding(20),
//     );

//     return () => {
//       showSubscription.remove();
//       hideSubscription.remove();
//     };
//   }, []);

//   // 2. Properly handle deep linking & close browser (FIXED)
//   useEffect(() => {
//     const subscription = Linking.addEventListener("url", ({ url }) => {
//       console.log("Redirect URL:", url);

//       // Close the in-app browser when redirected back to the app
//       WebBrowser.dismissBrowser();

//       if (url.includes("payment-success")) {
//         alert("Payment successful");
//         // Trigger balance update here
//       }

//       if (url.includes("payment-cancel")) {
//         alert("Payment cancelled");
//       }
//     });

//     return () => {
//       subscription.remove(); // Cleanup listener to prevent memory leaks
//     };
//   }, []);

//   const payNow = async () => {
//     try {
//       setLoading(true);

//       const redirectUrl = Linking.createURL("payment-success");
//       const cancelUrl = Linking.createURL("payment-cancel");

//       const response = await fetch(
//         "http://127.0.0.1:5001/authentication-app-832db/us-central1/api/create-payment",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             amount: 500,
//             currency: "PKR",
//             redirect_url: redirectUrl,
//             cancel_url: cancelUrl,
//           }),
//         },
//       );

//       const data = await response.json();
//       console.log("FULL RESPONSE:", JSON.stringify(data, null, 2));

//       const token = data?.data?.token || data?.token;
//       console.log("Actual Token", token);

//       if (!token) {
//         Alert.alert("Error", "No Safepay token found");
//         return;
//       }

//       const paymentUrl = `https://sandbox.api.getsafepay.com/${token}`;

//       // Open Gateway
//       await WebBrowser.openBrowserAsync(paymentUrl);
//       console.log("PAYMENT URL:", paymentUrl);
//     } catch (e: any) {
//       console.log(e);
//       Alert.alert("Payment Error", e?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <View style={{ flex: 1, backgroundColor: "#fff" }}>
//         <ScrollView
//           contentContainerStyle={{ flexGrow: 1 }}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}>
//           <View style={[styles.container, { paddingBottom: keyboardPadding }]}>
//             <TouchableOpacity
//               onPress={() => router.back()}
//               style={styles.backBtn}>
//               <Ionicons
//                 name="arrow-back"
//                 size={24}
//                 color="#000"
//               />
//             </TouchableOpacity>

//             <Text style={styles.title}>💳 My Wallet</Text>

//             {showMsg && (
//               <View style={styles.toast}>
//                 <Text style={styles.toastText}>Successfull !</Text>
//               </View>
//             )}

//             <View style={styles.card}>
//               <Text style={styles.label}>Available Balance</Text>
//               <Text style={styles.balanceText}>Rs. {balance}</Text>
//             </View>

//             <Text style={styles.subtitle}>Quick Top-up</Text>

//             <TouchableOpacity
//               style={styles.addBtn}
//               onPress={payNow}>
//               {loading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={styles.addBtnText}>Pay with Safepay</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// export default WalletScreen;
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useMarketplaceStore } from "../../../store/marketplaceStore";
import { styles } from "../../../style/walletScreen";
const WalletScreen = () => {
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const updateBalance = useMarketplaceStore((s) => s.updateBalance);
  const balance = useMarketplaceStore(
    (s) => s.users[s.currentUser?.uid || ""]?.balance ?? 0,
  );
  const addBalance = async () => {
    if (selectedAmount == null) return;

    try {
      setLoading(true);
      await updateBalance(selectedAmount);
      setSelectedAmount(null);
      setShowMsg(true);
      setTimeout(() => {
        setShowMsg(false);
        router.replace("/plan/plan");
      }, 1200);
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", "Failed to update wallet ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backBtn}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#000"
        />
      </TouchableOpacity>
      {/* HEADER */}
      <Text style={styles.title}>💳 My Wallet</Text>
      {showMsg && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>Successfull !</Text>
        </View>
      )}
      {/* BALANCE CARD */}
      <View style={styles.card}>
        <Text style={styles.label}>Available Balance</Text>
        <Text style={styles.balanceText}>Rs. {balance}</Text>
      </View>

      {/* TOPUP OPTIONS */}
      <Text style={styles.subtitle}>Quick Top-up</Text>

      <View style={styles.row}>
        {[500, 1000, 5000].map((amount) => (
          <TouchableOpacity
            key={amount}
            onPress={() => setSelectedAmount(amount)}
            style={[
              styles.amountBtn,
              selectedAmount === amount && styles.selectedBtn,
            ]}>
            <Text
              style={[
                styles.amountText,
                selectedAmount === amount && styles.selectedText,
              ]}>
              + Rs. {amount}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ADD BUTTON */}
      <TouchableOpacity
        style={[
          styles.addBtn,
          (!selectedAmount || loading) && { opacity: 0.5 },
        ]}
        disabled={!selectedAmount || loading}
        onPress={addBalance}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.addBtnText}>Add Rs. {selectedAmount ?? 0}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default WalletScreen;

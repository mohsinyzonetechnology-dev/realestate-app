import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMarketplaceStore } from "../../../store/marketplaceStore";
import { styles } from "../../../style/plan";

const Plans = () => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [showMsg, setShowMsg] = useState(false);
  const currentUser = useMarketplaceStore((s) => s.currentUser);
  const balance = useMarketplaceStore(
    (s) => s.users[s.currentUser?.uid || ""]?.balance ?? 0,
  );
  const purchasePlan = useMarketplaceStore((s) => s.purchasePlan);
  const plansData = [
    {
      id: 1,
      title: "Starter",
      price: "500",
      posts: 10,
      color: "#4CAF50",
    },
    { id: 2, title: "Pro", price: "1000", posts: 20, color: "#2196F3" },
    {
      id: 3,
      title: "Unlimited",
      price: "2000",
      posts: Infinity,
      color: "#673AB7",
    },
  ];
  const [loading, setLoading] = useState(false);

  const handelPlanData = async () => {
    if (!selectedPlan || loading) return;
    const plan = plansData.find((p) => p.id === selectedPlan);
    if (!plan) return;
    const price = Number(plan.price);
    const userId = currentUser?.uid;
    if (!userId) return;
    if (balance < price) {
      Alert.alert("Low Balance", "Please add money to your wallet.", [
        { text: "Cancel" },
        {
          text: "Open Wallet",
          onPress: () => router.push("/wallet/WalletScreen"),
        },
      ]);
      return;
    }
    Alert.alert("Confirm Plan", `Buy ${plan.title} plan for Rs.${price}?`, [
      { text: "No" },
      {
        text: "Yes, Buy",
        onPress: async () => {
          try {
            setLoading(true);
            await purchasePlan(
              userId,
              plan.posts,
              plan.title.toLowerCase(),
              price,
            );
            setShowMsg(true);

            setTimeout(() => {
              setShowMsg(false);
              router.replace("/"); // Home par wapas
            }, 1000);
          } catch (error: any) {
            Alert.alert(
              "Purchase Failed",
              error?.message || "Something went wrong ❌",
            );
            return;
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {showMsg && (
          <View style={styles.toast}>
            <Text style={styles.toastText}>Successfull your plan active!</Text>
          </View>
        )}
        <Text style={styles.header}>Choose Your Plan</Text>
        <View style={styles.walletHeader}>
          <Text style={styles.walletTitle}>Current Balance: </Text>
          <Text style={styles.walletAmount}> Rs. {balance}</Text>
        </View>

        {plansData.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            activeOpacity={0.8}
            onPress={() => setSelectedPlan(plan.id)}
            style={[
              styles.planCard,
              { borderColor: plan.color },
              selectedPlan === plan.id && {
                backgroundColor: plan.color + "10",
                borderWidth: 3,
              },
            ]}>
            <View style={[styles.badge, { backgroundColor: plan.color }]}>
              <Text style={styles.badgeText}>{plan.title}</Text>
            </View>

            <View style={styles.planDetails}>
              <Text style={styles.priceText}>Rs. {plan.price}</Text>
              <Text style={styles.postCount}>{plan.posts}</Text>
            </View>

            <View style={[styles.radio, { borderColor: plan.color }]}>
              {selectedPlan === plan.id && (
                <View
                  style={[styles.radioInner, { backgroundColor: plan.color }]}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[
            styles.subscribeBtn,
            { opacity: selectedPlan && !loading ? 1 : 0.6 },
          ]}
          disabled={!selectedPlan || loading}
          onPress={handelPlanData}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.subscribeText}>Continue with Plan</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Plans;

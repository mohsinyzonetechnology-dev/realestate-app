import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useMarketplaceStore } from "../../../store/marketplaceStore";

export default function EditListing() {
  const [loading, setLoading] = useState(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { listings, updateListing } = useMarketplaceStore();
  const item = listings.find((l) => l._id === String(id));
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setPrice(item.price);
      setDescription(item.description ?? "");
    }
  }, [item]);

  if (!item) return <Text style={styles.notFound}>Not Found</Text>;

  const handleUpdate = async () => {
    if (!title.trim() || !price.trim()) {
      Alert.alert("Error", "Title and Price are required");
      return;
    }
    try {
      setLoading(true);
      await updateListing(item._id as string, {
        title: title.trim(),
        price: price.trim(),
        description: description.trim(),
      });
      setShowMsg(true);

      setTimeout(() => {
        setShowMsg(false);
        router.back();
      }, 1200);
    } catch (error: any) {
      Alert.alert("Update Failed", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Listing</Text>
      <Text style={styles.subHeading}>Update your property details below</Text>
      <View style={styles.card}>
        {showMsg && (
          <View style={styles.toast}>
            <Text style={styles.toastText}>Post updated successfully</Text>
          </View>
        )}
        {/* Title */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        {/* Price */}
        <Text style={styles.label}>Price</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />
        {/* description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdate}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Listing</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f6f7fb",
    flexGrow: 1,
  },

  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1c1c1e",
    marginBottom: 5,
  },

  subHeading: {
    color: "#8e8e93",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  label: {
    fontSize: 14,
    color: "#8e8e93",
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    backgroundColor: "#f2f3f5",
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
  },

  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: "#f2f3f5",
    padding: 14,
    borderRadius: 12,
  },

  selectorText: {
    fontSize: 15,
    color: "#1c1c1e",
  },

  arrow: {
    fontSize: 20,
    color: "#8e8e93",
  },

  button: {
    marginTop: 25,
    backgroundColor: "#1877F2",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  notFound: {
    textAlign: "center",
    marginTop: 50,
    color: "red",
  },
  toast: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: "#47c176",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    zIndex: 999,
  },

  toastText: {
    color: "#fff",
    fontSize: 14,
  },
});

import {
  CATEGORIES,
  CONDITIONS,
  CategoryEnum,
  ConditionEnum,
  ListingTypeEnum,
} from "@/constants/listing";
import { uploadImageToSanity, uploadVideoToSanity } from "@/lib/sanity";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { ResizeMode, Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useMarketplaceStore } from "../../../store/marketplaceStore";
import { styles } from "../../../style/add-listing";

export default function AddListing() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isManualLocation, setIsManualLocation] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const categorySheetRef = useRef<BottomSheetModal>(null);
  const conditionSheetRef = useRef<BottomSheetModal>(null);
  const { type } = useLocalSearchParams();
  const { currentUser, addListing } = useMarketplaceStore();
  const categories = CATEGORIES;
  const conditions = CONDITIONS;

  const screenTitle =
    type === "rent" ? "Select Category for Rent" : "Select Category for Sale";

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    images: [] as string[],
    video: null as string | null,
    category: null as CategoryEnum | null,
    condition: null as ConditionEnum | null,
    location: "Getting location...",
    manualLocation: "",
  });

  const updateForm = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isFormValid =
    form.title.trim().length > 0 &&
    form.price.trim().length > 0 &&
    (form.images.length > 0 || form.video) &&
    form.category !== null &&
    form.condition !== null;

  const openCategorySheet = () => {
    Keyboard.dismiss();
    categorySheetRef.current?.present();
  };

  const openConditionSheet = () => {
    Keyboard.dismiss();
    conditionSheetRef.current?.present();
  };

  const pickVideo = async () => {
    if (form.images.length > 0) {
      Alert.alert("Not allowed", "Remove images to upload a video");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      videoMaxDuration: 60,
      quality: 0.7,
    });

    if (!result.canceled) {
      const video = result.assets[0];

      if (video.duration && video.duration > 60000) {
        Alert.alert("Error", "Video must be less than 60 seconds");
        return;
      }

      updateForm("video", video.uri);
    }
  };

  const pickImages = async (replaceIndex?: number) => {
    if (form.video) {
      Alert.alert("Not allowed", "Remove video to upload images");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: replaceIndex === undefined,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((a) => a.uri);

      if (replaceIndex !== undefined) {
        const updated = [...form.images];
        updated[replaceIndex] = newUris[0];
        updateForm("images", updated);
      } else {
        updateForm("images", [...form.images, ...newUris].slice(0, 10));
      }
    }
  };

  const openMediaPicker = () => {
    Alert.alert("Upload Media", "Select what you want to upload", [
      {
        text: "Images",
        onPress: () => pickImages(),
      },
      {
        text: "Video (60 sec)",
        onPress: () => pickVideo(),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const removeImage = (index: number) => {
    updateForm(
      "images",
      form.images.filter((_, i) => i !== index),
    );
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  const resetCondition = () => {
    conditionSheetRef.current?.dismiss();
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      updateForm("location", "Permission denied");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    const address = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    if (address.length > 0) {
      const city = address[0].city || address[0].region || "Unknown";
      updateForm("location", city);
    }
  };

  const saveManualLocation = () => {
    if (form.manualLocation.trim()) {
      updateForm("location", form.manualLocation.trim());
    }
    setIsManualLocation(false);
  };

  const listingType =
    (type as ListingTypeEnum) === ListingTypeEnum.RENT
      ? ListingTypeEnum.RENT
      : ListingTypeEnum.SALE;

  const handlePublish = async () => {
    const userId = currentUser?.uid;
    setLoading(true);
    try {
      const imageAssets = await Promise.all(
        form.images.map((uri) => uploadImageToSanity(uri)),
      );

      let videoAssetId = null;
      if (form.video) {
        videoAssetId = await uploadVideoToSanity(form.video);
      }

      const media = [
        ...imageAssets.map((id) => ({
          _type: "image",
          asset: { _type: "reference", _ref: id },
        })),
        ...(videoAssetId
          ? [
              {
                _type: "file",
                asset: { _type: "reference", _ref: videoAssetId },
              },
            ]
          : []),
      ];
      await addListing({
        title: form.title.trim(),
        price: form.price.trim(),
        category: form.category!,
        condition: form.condition!,
        description: form.description.trim(),
        location: form.location,
        userId,
        media,
        listingType,
      });

      setShowMsg(true);
      setTimeout(() => {
        setShowMsg(false);
        router.replace("/");
      }, 1000);
    } catch (error) {
      Alert.alert(
        "Publish Failed",
        "Error: " + (error instanceof Error ? error.message : "Unknown error"),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {showMsg && (
            <View style={styles.toast}>
              <Text style={styles.toastText}>
                Property published for {type}!
              </Text>
            </View>
          )}

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="close"
                size={28}
                color="black"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Listing</Text>
            <TouchableOpacity
              onPress={handlePublish}
              disabled={!isFormValid || loading}>
              <Text
                style={[
                  styles.publishText,
                  (!isFormValid || loading) && { color: "#A0C9FF" },
                ]}>
                {loading ? <ActivityIndicator color="#1877F2" /> : "Publish"}
              </Text>
            </TouchableOpacity>
          </View>
          {/* //////////////////// */}
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator
                size="large"
                color="#1877F2"
              />
              <Text style={{ marginTop: 10, color: "#fff" }}>
                Publishing...
              </Text>
            </View>
          )}
          <ScrollView
            contentContainerStyle={[styles.form, { paddingBottom: 60 }]}
            keyboardShouldPersistTaps="handled">
            <Text style={[styles.sectionTitle, { color: "#1877F2" }]}>
              {screenTitle}
            </Text>

            {/* Location Display Box */}
            <View style={styles.locationBox}>
              <Ionicons
                name="location-outline"
                size={18}
                color="gray"
              />
              <Text style={{ marginLeft: 6, flex: 1 }}>{form.location}</Text>
              <TouchableOpacity
                onPress={() => {
                  updateForm("manualLocation", form.location);
                  setIsManualLocation(true);
                }}>
                <Text style={{ color: "#1877F2", fontWeight: "600" }}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>

            {/* Manual Edit Field with Save/Cancel */}
            {isManualLocation && (
              <View style={{ marginBottom: 15 }}>
                <TextInput
                  placeholder="Enter location manually..."
                  style={styles.inputField}
                  value={form.manualLocation}
                  onChangeText={(text) => updateForm("manualLocation", text)}
                  autoFocus
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    gap: 15,
                    marginTop: -5,
                    paddingRight: 5,
                  }}>
                  <TouchableOpacity onPress={() => setIsManualLocation(false)}>
                    <Text style={{ color: "red" }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveManualLocation}>
                    <Text style={{ color: "#1877F2", fontWeight: "bold" }}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Photos Section */}
            <View style={styles.photoSection}>
              <Text style={styles.sectionTitle}>
                Photos ({form.images.length}/10)
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imageScroll}>
                {form.images.length < 10 && (
                  <TouchableOpacity
                    style={styles.addPhotoBox}
                    onPress={() => !loading && openMediaPicker()}>
                    <Ionicons
                      name="camera"
                      size={32}
                      color="#666"
                    />
                    <Text style={styles.addPhotoText}>Add</Text>
                  </TouchableOpacity>
                )}

                {form.images.map((uri: string, index: number) => (
                  <View
                    key={index}
                    style={styles.imageContainer}>
                    <Image
                      source={{ uri }}
                      style={styles.uploadedImage}
                    />

                    <TouchableOpacity
                      style={styles.replaceBtn}
                      onPress={() => !loading && pickImages(index)}>
                      <Ionicons
                        name="refresh"
                        size={18}
                        color="white"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => !loading && removeImage(index)}>
                      <Ionicons
                        name="close-circle"
                        size={24}
                        color="#ff3b30"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              {form.video && (
                <View style={{ marginTop: 15 }}>
                  <Text style={styles.sectionTitle}>Video</Text>

                  <Video
                    source={{ uri: form.video }}
                    style={{ width: "100%", height: 200, borderRadius: 10 }}
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                  />

                  <TouchableOpacity
                    onPress={() => updateForm("video", null)}
                    style={{ marginTop: 5 }}>
                    <Text style={{ color: "red" }}>Remove Video</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TextInput
              placeholder="Title *"
              style={styles.inputField}
              value={form.title}
              editable={!loading}
              onChangeText={(text) => updateForm("title", text)}
            />
            <TextInput
              placeholder="Price (Rs) *"
              style={styles.inputField}
              keyboardType="numeric"
              value={form.price}
              editable={!loading}
              onChangeText={(text) => updateForm("price", text)}
            />

            <TouchableOpacity
              style={styles.selectorField}
              onPress={() => !loading && openCategorySheet()}>
              <Text style={[styles.selectorValue, styles.selectedText]}>
                {form.category ?? "Select Category"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color="gray"
              />
            </TouchableOpacity>

            {/* Fixed: Condition Sheet opens with Keyboard Dismiss */}
            <TouchableOpacity
              style={styles.selectorField}
              onPress={() => !loading && openConditionSheet()}>
              <Text style={[styles.selectorValue, styles.selectedText]}>
                {form.condition ?? "Select Condition"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color="gray"
              />
            </TouchableOpacity>

            {/* Description (Keyboard will not cover this) */}
            <TextInput
              placeholder="Description (optional)"
              multiline
              numberOfLines={4}
              style={[
                styles.inputField,
                { height: 120, textAlignVertical: "top" },
              ]}
              value={form.description}
              onChangeText={(text) => updateForm("description", text)}
            />
          </ScrollView>
          {/* Bottom Sheets (Original UI) */}
          <BottomSheetModal
            ref={categorySheetRef}
            index={0}
            snapPoints={["56%"]}
            backdropComponent={renderBackdrop}
            enableDynamicSizing={false}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{screenTitle}</Text>
              {categories.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.optionRow}
                  onPress={() => {
                    updateForm("category", item.name);
                    categorySheetRef.current?.dismiss();
                  }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={styles.iconCircleSmall}>
                      <Ionicons
                        name={item.icon as any}
                        size={22}
                        color="black"
                      />
                    </View>
                    <Text style={styles.optionText}>{item.name}</Text>
                  </View>
                  {form.category === item.name && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#1877F2"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </BottomSheetModal>

          <BottomSheetModal
            ref={conditionSheetRef}
            index={0}
            snapPoints={["49%"]}
            backdropComponent={renderBackdrop}
            enableDynamicSizing={false}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Condition</Text>
                <TouchableOpacity onPress={resetCondition}>
                  <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
              </View>
              {conditions.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.optionRow}
                  onPress={() => {
                    // setSelectedCondition(item);
                    updateForm("condition", item);
                    conditionSheetRef.current?.dismiss();
                  }}>
                  <Text style={styles.optionText}>{item}</Text>
                  <View
                    style={[
                      styles.radioOuter,
                      form.condition === item && styles.radioActive,
                    ]}>
                    {form.condition === item && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </BottomSheetModal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

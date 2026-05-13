import { Ionicons } from "@expo/vector-icons";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SellBottomSheet = forwardRef<BottomSheetModal>((_, ref) => {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  // forward ref ko connect kiya gaya hai
  useImperativeHandle(ref, () => bottomSheetRef.current!, []);

  const snapPoints = useMemo(() => ["33"], []);

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

  const options = [
    {
      id: "1",
      title: "Property for rent",
      icon: "business-outline",
      route: "/seller/add-listing?type=rent",
    },
    {
      id: "2",
      title: "Property for sale",
      icon: "business-outline",
      route: "/seller/add-listing?type=sale",
    },
  ];

  const handlePress = useCallback(
    (route: string) => {
      bottomSheetRef.current?.dismiss();
      router.push(route as any);
    },
    [router],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: "#ccc" }}
      enablePanDownToClose={true}
      enableDynamicSizing={false}>
      <View
        style={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}>
        <Text style={styles.title}>Create new listing</Text>

        {options.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.option}
            onPress={() => handlePress(item.route)}>
            <View style={styles.iconCircle}>
              <Ionicons
                name={item.icon as any}
                size={22}
                color="black"
              />
            </View>
            <Text style={styles.optionText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </BottomSheetModal>
  );
});

SellBottomSheet.displayName = "SellBottomSheet";

export default SellBottomSheet;

const styles = StyleSheet.create({
  content: {
    padding: 20,
    width: "100%",
  },
  title: { fontSize: 20, fontWeight: 500, marginBottom: 20 },
  option: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f2f5",
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: { marginLeft: 15, fontSize: 16, fontWeight: "500" },
});

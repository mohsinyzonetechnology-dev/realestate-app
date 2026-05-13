import { client } from "@/lib/sanity";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { loginUser, signupUser } from "../../services/auth.service";
import { useMarketplaceStore } from "../../store/marketplaceStore";
import { styles } from "../../style/formLogin";

export default function AuthPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ user: "", email: "", password: "" });
  const validate = () => {
    const newErrors = {
      user: "",
      email: "",
      password: "",
    };

    if (!isLogin) {
      if (!form.userName) newErrors.user = "Username is required";
      else if (form.userName.length < 4)
        newErrors.user = "Minimum 4 characters";
    }

    if (!form.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email";

    if (!form.password) newErrors.password = "Password required";
    else if (form.password.length < 6) newErrors.password = "Min 6 characters";

    setErrors(newErrors);
    return !newErrors.user && !newErrors.email && !newErrors.password;
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      let firebaseUser;

      if (isLogin) {
        firebaseUser = await loginUser(form.email, form.password);
      } else {
        firebaseUser = await signupUser(
          form.userName,
          form.email,
          form.password,
        );
      }

      if (firebaseUser) {
        await client.createIfNotExists({
          _id: firebaseUser.uid,
          _type: "user",
          userId: firebaseUser.uid,
          email: form.email,
          photoURL: firebaseUser.photoURL || "",
        });
      }

      useMarketplaceStore.getState().setCurrentUser(firebaseUser);

      router.replace("/");
    } catch (err: any) {
      showMessage({
        message: "Error",
        description: err.message,
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>{isLogin ? "Login" : "Sign Up"}</Text>

          {/* Username Field (Sign Up Only) */}
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="gray"
                style={styles.icon}
              />
              <TextInput
                placeholder="Username"
                style={styles.input}
                value={form.userName}
                onChangeText={(text) => handleChange("userName", text)}
              />
            </View>
          )}
          {errors.user ? (
            <Text style={styles.errorText}>{errors.user}</Text>
          ) : null}

          {/* Email Field */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="gray"
              style={styles.icon}
            />
            <TextInput
              placeholder="Email"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(text) => handleChange("email", text)}
            />
          </View>
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}

          {/* Password Field */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="gray"
              style={styles.icon}
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry={!showPassword}
              value={form.password}
              onChangeText={(text) => handleChange("password", text)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, loading && { backgroundColor: "#ccc" }]}
            onPress={handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                {isLogin ? "Login" : "Create Account"}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Toggle Login/Signup */}
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.toggleText}>
              {isLogin ? "Create new account" : "Already have account? Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

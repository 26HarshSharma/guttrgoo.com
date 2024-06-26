//client id: 163771112967-urcdasbhhcavc501igl54h6glht09g00.apps.googleusercontent.com
import React, { useState } from "react";
import { View, Button, TextInput, StyleSheet } from "react-native";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  //google sign in:
  const [userInfo, setUserInfo] = useState(null);
    const [request, response, promptAsync] = Google.useAuthRequest({
      webClientId:
        "163771112967-urcdasbhhcavc501igl54h6glht09g00.apps.googleusercontent.com",
    });
    

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignIn = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Do something after successful sign-in if needed
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == "auth/invalid-credential") {
          alert("Invalid credential");
        }
        if (errorCode == "auth/user-not-found") {
          alert("User not found, please register");
        }
        if (errorCode == "auth/wrong-password") {
          alert("Wrong password");
        }
      });
  };

  const onPasswordReset = () => {
    const auth = getAuth();
    if (email === "") {
      alert("Please enter the email first");
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent to your registered email address!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == "auth/user-not-found") {
          alert("User not found");
        }
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.text}
        placeholder="email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.text}
        placeholder="password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <View style={{ width: "65%", marginTop: "36px", marginBottom: "18px" }}>
        <Button title="Log in" onPress={() => onSignIn()} />
        <Button title="Forget Password" onPress={() => onPasswordReset()} />
        <Button title="Sign in with Google" onPress={promptAsync} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    border: "2px solid black",
    padding: "6px",
    width: "100%",
  },
  text: {
    fontSize: 20,
    color: "black",
    border: "2px solid black",
    padding: "6px",
    width: "65%",
    marginBottom: "8px",
  },
});

export default Login;

import React, { useState } from "react";
import { View, Button, TextInput, StyleSheet } from "react-native";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignIn = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Do something after successful sign-in if needed
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
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
      <View style={{ width: "65%", marginTop: "18px" }}>
        <Button style={styles.btn} title="Log in" onPress={() => onSignIn()} />
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
    textAlign: "center",
    border: "2px solid black",
    padding: "6px",
    width: "65%",
    marginBottom: "8px",
  },
});

export default Login;

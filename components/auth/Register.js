import React, { useState } from "react";
import { View, Button, TextInput, StyleSheet } from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../App";

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email) => {
    for (let i = 0; i < email.length; i++) {
      if (email[i] === "@") return true;
    }
    return false;
  };

  const validatePassword = (password) => {
    // Password should be at least 8 characters long
    if (password.length < 8) {
      return false;
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return false;
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return false;
    }

    // Check for at least one digit
    if (!/\d/.test(password)) {
      return false;
    }

    // Check for at least one special character
    if (!/[\W_]/.test(password)) {
      return false;
    }

    // Password meets all criteria
    return true;
  };

  const onSignUp = async () => {
    if (!validateEmail(email)) {
      alert("Invalid Email, Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      alert(
        "Invalid Password, Password should contain at least 8 characters, 1 uppercase, 1 lowercase, 1 special symbol, 1 digit"
      );
      return;
    }
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const db = getFirestore(app);
      const docRef = await addDoc(collection(db, "users"), {
        name: name,
        email: email,
      });
      await sendEmailVerification(user);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.text}
        placeholder="name"
        onChangeText={(text) => setName(text)}
        value={name}
      />
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
      <View style={{ width: "65%", marginTop: "22px" }}>
        <Button title="Sign Up" onPress={() => onSignUp()} />
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

export default Register;

import React, { Component } from "react";
import { View, TextInput, Button } from "react-native";
import { app } from "../App";
import { format } from "date-fns";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { verificationStatus } from "./Blogs";

export class WriteBlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };
    this.saveContent = this.saveContent.bind(this);
  }
  async saveContent() {
    const { text } = this.state;
    const currentDate = new Date();
    const formattedDate = format(currentDate, "MMMM dd, yyyy");
    const currentTime = new Date();
    const formattedTime = format(currentTime, "HH:mm:ss");
    const db = getFirestore(app);
    const auth = getAuth();
    const user = auth.currentUser;
    let email;
    let id;
    let entries = []; // Instead of a 2D array, use an array of objects

    try {
      if (user !== null) {
        email = user.email;
      }
      if (verificationStatus === false) {
        alert(
          "Please verify your email first by clicking on the link send on your registered email address"
        );
        return;
      }
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", `${email}`));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        id = doc.id;
        const content = doc.data().content || []; // Handle case where content is undefined

        // Convert existing content to an array of objects
        entries = content.map((entry) => ({ id: entry.id, text: entry.text }));
      });

      if (text.trim() === "") {
        alert("The content cannot be empty!");
        return;
      }

      // Push the new entry to the entries array
      entries.push({ id: "", text });
      // Update the Firestore document with the new entries array
      const usersDocRef = doc(db, "users", `${id}`);
      await updateDoc(usersDocRef, {
        content: entries,
        date: formattedDate,
        time: formattedTime,
      });
      console.log("Updated successfully!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  render() {
    const { navigation } = this.props;
    return (
      <View>
        <TextInput
          style={{ border: "2px solid black", marginBottom: "4px" }}
          multiline={true}
          numberOfLines={20} // Set the number of lines to display initially (optional)
          placeholder="Enter your text here"
          onChangeText={(text) => this.setState({ text })}
        />
        <Button
          title="Submit"
          onPress={() => {
            this.saveContent();
            this.props.navigation.navigate("Blogs");
          }}
        />
      </View>
    );
  }
}

export default WriteBlog;

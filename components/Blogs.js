import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, ScrollView } from "react-native"; // Import TextInput for editing
import { getAuth } from "firebase/auth";
import { app } from "../App";
import { format } from "date-fns";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getDatabase, ref, push, remove, onValue } from "firebase/database";

//email verification link send kiya tha, uspr click kiya hai ki nhi user ne uska track rakhne ke liye ye veriable banaya hai jiska export krr raha hoon WriteBlog.js file mai, kyuki mai nhi chahta agr kisi ne email verify nhi kiya ho toh wo koi blog submit kr paye.
let verificationStatus = false;

export default function Blogs({ navigation }) {
  const [data, setData] = useState([]);
  const [name, setName] = useState("User");
  const [editIndex, setEditIndex] = useState(-1); // State to track editing index
  const [editedContent, setEditedContent] = useState(""); // State to hold edited content

  const realtimeDb = getDatabase(app);
  const currentDate = new Date();
  const formattedDate = format(currentDate, "MMMM dd, yyyy");
  const currentTime = new Date();
  const formattedTime = format(currentTime, "HH:mm:ss");
  const auth = getAuth();
  const user = auth.currentUser;
  let id;
  let email;
  let username;
  let docs = [[]];

  //ye check krr raha hai ki user logged in hai ya nhi, i think
  if (user !== null) {
    email = user.email;
  }

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore(app);
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", `${email}`));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        username = doc.data().name;
        if (doc.data().content && Array.isArray(doc.data().content)) {
          docs = doc.data().content.map((entry) => [entry.id, entry.text]);
        } else {
          docs = [];
        }
      });
      //ye update krne ke liye ki kya user ne email verification link prr click kiya hai yaa nhi
      auth.onAuthStateChanged((user) => {
        if (user.emailVerified === true) {
          verificationStatus = true;
        }
      });
      setData(docs);
      setName(username);
    };
    fetchData();
  }, []);

  const db = getFirestore(app);
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", `${email}`));

  // delete blog.

  const deleteBlog = async (index) => {
    // Get the user's ID from Firestore
    const querySnapshot = await getDocs(q);
    let userId;
    let deletedId;
    querySnapshot.forEach((doc) => {
      userId = doc.id;
      deletedId = doc.data().content[index].id;
    });
    console.log(deletedId);
    // Update the content array by removing the item at the specified index
    const updatedItems = [...data];

    const deletedBlog = updatedItems.splice(index, 1)[0];

    // Update Firestore with the updated content array
    const usersDocRef = doc(db, "users", `${userId}`);
    const updatedContent = updatedItems.map((item) => ({
      id: item[0],
      text: item[1],
    }));

    await updateDoc(usersDocRef, {
      content: updatedContent,
    });

    // Update state to reflect the changes
    setData(updatedItems);

    // Delete the blog from Realtime Database
    //ye check lagana zaroori tha nhi toh saarey ke saarey blogs deleted ho jaa rahe thai realtime DB se.
    if (deletedId !== "") {
      const realtimeDbContentRef = ref(
        realtimeDb,
        `users/${userId}/${deletedId}`
      );
      remove(realtimeDbContentRef);
    }

    // Return the deleted blog for any additional handling
    return deletedBlog;
  };

  //edit blog index, isse pata chalega ki konsa blog ke edit button prr click kiya hai.
  /*
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedContent(data[index][1]);
  };
*/
  //Yaha prr actual edit ho raha hai.

  /*
  const handleSaveEdit = async (index) => {
    const updatedItems = [[...data]]; //updatedItems array hai jismai saara content aa raha hai.
    console.log(updatedItems);
    updatedItems[index][1] = editedContent;
    const arrayOfObjects = updatedItems.map(([id, text]) => ({ id, text }));
    console.log(arrayOfObjects);
    setEditIndex(-1); // reset krr rahe hai.
    setEditedContent(""); // reset krr rahe hai.
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      id = doc.id;
    });
    const usersDocRef = doc(db, "users", `${id}`);
    await updateDoc(usersDocRef, {
      content: arrayOfObjects,
    });
    setData(updatedItems);
  };
*/

  //Publish blog.
  const handlePublish = async (index) => {
    let id;
    let updatedDocId;
    let publicContent;
    let firestoreContent;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      id = doc.id;
      updatedDocId = doc.data().content[index].id;
      publicContent = doc.data().content[index].text;
      firestoreContent = doc.data().content;
    });

    if (updatedDocId !== "") {
      alert("This blog is already public, publishing it again is not allowed!");
      return;
    }

    // Assuming you have fetched the publicContent and updatedDocId correctly
    const dbContent = ref(realtimeDb, `users/${id}`);
    let realtimeDbContentPath = await push(dbContent, publicContent);
    //giving me the exact destination for the data being stored in realtime DB.
    firestoreContent[index].id = realtimeDbContentPath._path.pieces_[2];

    const usersDocRef = doc(db, "users", `${id}`);

    await updateDoc(usersDocRef, {
      content: firestoreContent,
    });
    let docs = firestoreContent.map((entry) => [entry.id, entry.text]);
    setData(docs);
  };

  return (
    <View style={{ display: "flex", justifyContent: "center" }}>
      <Text
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 12,
          marginTop: 12,
        }}
      >
        {name} is logged in...
      </Text>
      <Button
        title="Log Out"
        onPress={() => {
          const auth = getAuth();
          auth.signOut().then(() => {
            navigation.navigate("Landing");
          });
        }}
      />
      <Button title="Write" onPress={() => navigation.navigate("WriteBlog")} />
      <View style={{ flex: 1 }}>
        <ScrollView horizontal={true}>
          {data.length > 0 ? (
            data.map((item, index) => (
              <View key={index}>
                {editIndex === index ? (
                  {
                    /*
                
                Edit related stuff/coding:

                (
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                      marginTop: 12,
                    }}
                  >
                    <TextInput
                      style={{
                        border: "2px solid black",
                        padding: 5,
                        flex: 1,
                        width: "95vw",
                        height: "100%",
                        margin: 12,
                      }}
                      multiline={true}
                      numberOfLines={24}
                      value={editedContent}
                      onChangeText={(text) => setEditedContent(text)}
                    />
                    
                    <View style={{ margin: 12 }}>
                      <Button
                        title="Save"
                        onPress={() => handleSaveEdit(index)}
                      />
                    </View>
                    </View>
                    ) */
                  }
                ) : (
                  <ScrollView>
                    <Text
                      style={{
                        borderLeftColor: "black",
                        borderLeftWidth: 2,
                        padding: 12,
                        margin: 12,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "95vw",
                        height: "70vh",
                      }}
                    >
                      {item[1]}
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginTop: 24,
                        }}
                      >
                        <View style={{ margin: 4 }}>
                          <Button
                            title="Delete"
                            onPress={() => deleteBlog(index)}
                          />
                        </View>
                        {/*
                        <View style={{ margin: 4 }}>
                          <Button
                            title="Edit"
                            onPress={() => handleEdit(index)}
                          /> 
                        </View>*/}
                        <View style={{ margin: 4 }}>
                          <Button
                            title="Publish"
                            onPress={() => handlePublish(index)}
                          />
                        </View>
                      </View>
                    </Text>
                  </ScrollView>
                )}
              </View>
            ))
          ) : (
            <Text>No data available</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

export { verificationStatus };

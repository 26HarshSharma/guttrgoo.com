import React, { useState, useEffect } from "react";
import { View, Button, ScrollView, Text } from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../../App";

export default function Landing({ navigation }) {
  const [data, setData] = useState([]);
  const realtimeDb = getDatabase(app);
  let docs = [];

  useEffect(() => {
    const fetchData = async () => {
      const dbContent = ref(realtimeDb, `users/`);
      onValue(dbContent, function (snapshot) {
        if (!snapshot.exists()) {
          alert("Empty!");
          return;
        }
        let publicContentArrayEnteries = Object.entries(snapshot.val());

        let arr1 = Object.entries(publicContentArrayEnteries);
        let arr2 = [];
        let arr3 = [];
        //console.log(arr);
        for (const i of arr1) {
          arr2.push(i[1]);
        }
        for (const j of arr2) {
          arr3.push(j[1]);
        }
        for (const k of arr3) {
          let text = Object.values(k);
          docs.push(text);
        }
        console.log(docs);
        setData(docs[0]);
      });
    };
    fetchData();
  }, []);

  return (
    <View>
      <View>
        <Button
          title="Register"
          onPress={() => navigation.navigate("Register")}
        />
        <Button title="Login" onPress={() => navigation.navigate("Login")} />
      </View>
      <ScrollView horizontal={true}>
        {/* Render your data here */}
        {data.map((item, index) => (
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
              height: "75vh",
            }}
            key={index}
          >
            {item}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

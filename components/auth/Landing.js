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
          return;
        }
        let publicContentArrayEnteries = Object.entries(snapshot.val());

        let arr1 = Object.entries(publicContentArrayEnteries);
        let arr2 = [];
        let arr3 = [];

        for (const i of arr1) {
          arr2.push(i[1]);
        }
        for (const j of arr2) {
          arr3.push(j[1]);
        }
        for (const k of arr3) {
          let text = Object.values(k);
          for (const l of text) {
            docs.push(l);
          }
        }
        setData(docs);
      });
    };
    fetchData();
  }, []);

  return (
    <View>
      <View>
        <Text
          style={{
            marginTop: "12px",
            marginBottom: "12px",
            marginLeft: "12px",
          }}
        >
          Suggest me a feature at{" "}
          <Text
            style={{
              textDecorationLine: "underline",
            }}
          >
            "freelancerbuddy26@gmail.com"
          </Text>
          . This is the very first version of the site, need your support to
          enhance it further ;).
        </Text>
        <Button
          title="Register"
          onPress={() => navigation.navigate("Register")}
        />
        <Button title="Login" onPress={() => navigation.navigate("Login")} />
      </View>

      <ScrollView horizontal={true}>
        {/* Render your data here */}
        {data.map((item, index) => (
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
                height: "75vh",
              }}
              key={index}
            >
              {item}
            </Text>
          </ScrollView>
        ))}
      </ScrollView>
    </View>
  );
}

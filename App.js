import { StatusBar } from "expo-status-bar"; // an expo stuff called status bar which is shown at the top of the screen on a mobile device.
import react from "react"; // importing react to use/manage react components from react library.

import { View, Text } from "react-native";
import React, { Component } from "react";
import { initializeApp } from "firebase/app"; // to use firebase in our project
import { getAuth } from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native"; // a library used for managing navigation (moving between different screens) in a React Native app.
import { createStackNavigator } from "@react-navigation/stack"; // createStackNavigator is a function provided by React Navigation that helps in creating a stack navigator, which is used for managing a stack of screens in a React Native app.
import LandingScreen from "./components/auth/Landing"; //It is my own component(custom component) which is displaying user registration/login page.
import RegisterScreen from "./components/auth/Register";
import LoginScreen from "./components/auth/Login";
import BlogsScreen from "./components/Blogs";
import WritingBlogScreen from "./components/WriteBlog";


const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

//to initialise the firebase in our project.
const app = initializeApp(firebaseConfig);

const Stack = createStackNavigator(); //  This line creates a new stack navigator using the createStackNavigator function imported earlier. The Stack variable will be used to define the navigation stack for the app.

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loggedIn: false,
    };
  }
  //componentDidMount() ka mtlb hai jb tk component poora load nhi ho jaata frontend/screen prr, ye function run nhi hoga
  //isko bind krne ki zroort nhi padti hai baaki normal/custom functions ki tarah.
  componentDidMount() {
    const auth = getAuth();
    //user track krne ke liye, ki kya uss user ne log in kiya hai yaa nhi.
    auth.onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false, // agr user logged in nhi hai toh user=false hoga that's why loggedIn mai false ayega.
          loaded: true, // yaha tk pahuchne ka mtlb hai component load toh ho chuka hai poora, that's why loaded mai true rakh diya.
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        });
      }
    });
  }
  render() {
    const { loggedIn, loaded } = this.state;
    //jub tk component/screen/display/frontend poora load nhi ho jaata tb tk ye screen display hogi.
    //ye ek loader hai
    if (!loaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading...</Text>
        </View>
      );
    }
    //Agr user logged In nhi hai toh ye screen display hogi
    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: true }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    //agr user logged in hai toh ye screen display hogi
    return (
      <NavigationContainer
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Stack.Navigator>
          <Stack.Screen
            name="Blogs"
            component={BlogsScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="WriteBlog"
            component={WritingBlogScreen}
            options={{ headerShown: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
export { app };

/*
<NavigationContainer> ... </NavigationContainer>: This JSX element represents the NavigationContainer component provided by React Navigation. It wraps the app's navigation structure and provides navigation-related functionality to the app.
<Stack.Navigator initialRouteName="Landing"> ... </Stack.Navigator>: This JSX element represents the Stack.Navigator component created earlier. It defines a stack navigator for the app and sets the initial route (the first screen to be displayed) as the Landing screen.
<Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown : false}} />: This JSX element represents a screen (or route) within the stack navigator. It specifies that the LandingScreen component should be rendered when the route named "Landing" is active. The options prop is used to configure the screen's appearance, such as hiding the header.
*/

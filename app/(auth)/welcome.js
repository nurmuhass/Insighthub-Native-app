import { Text, View, TextInput, StyleSheet, Image } from "react-native";

import { StatusBar } from "react-native";
import { Stack } from "expo-router";
import { ImageBackground } from "react-native";
import { Dimensions } from "react-native";
const { height } = Dimensions.get("window");
export default function Index() {
return (
<View style={{ flex: 1,backgroundColor:'#ffffff' }}>
    <StatusBar
      translucent
      barStyle="dark-content"
      backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
  />
  <View style={{marginLeft:15 }}>
    
  
      {/* <AnimatedIntro />
      <BottomLoginSheet /> */}




  
  <View style={{marginTop:50,alignItems:'center'}}>
     
  </View>


  <View style={{marginTop:20,alignItems:'center',marginBottom:30}}>
    <Text style={{fontSize:30,fontWeight:'bold'}}>Welcome to</Text>
    <Text style={{marginTop:5,color:'#555',fontSize:17,}}> Citizen Engagement Platform System</Text>
  </View>

 
  
  <Text
            style={{
             marginTop:5,
             color:'#555',
             fontSize:17,
              textAlign: "center",
              marginTop: 10 * 2,
            }}
          >
         Empower your community, report to the government and shape a brighter future together!
          </Text>

  </View>

    </View>
  );
}

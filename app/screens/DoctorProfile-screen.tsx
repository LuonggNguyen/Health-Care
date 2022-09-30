import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, Text, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Button, Header } from "@rneui/themed"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import auth from "@react-native-firebase/auth"
import { color } from "../theme"

//bug cmnr

export const DoctorProfileScreen: FC<StackScreenProps<NavigatorParamList, "doctorProfile">> =
  observer(function DoctorProfileScreen({ navigation }) {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={color.colorHeader}
          centerComponent={<Text style={styles.titleHeader}>Doctor</Text>}
          rightComponent={
            <MaterialIcons
              name="logout"
              size={28}
              color="#000"
              onPress={() =>
                auth()
                  .signOut()
                  .then(() => {
                    navigation.navigate("login")
                  })
              }
            />
          }
        />
        <Text>Doctor</Text>
        <Button
          title={"Update Proflie"}
          onPress={() => navigation.navigate("doctorUpdateProfile")}
        />
      </View>
    )
  })

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  titleHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
})

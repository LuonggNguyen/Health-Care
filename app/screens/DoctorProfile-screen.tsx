import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, Text, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Button } from "@rneui/themed"
import auth from "@react-native-firebase/auth"

export const DoctorProfileScreen: FC<StackScreenProps<NavigatorParamList, "doctorProfile">> =
  observer(function DoctorProfileScreen({ navigation }) {
    return (
      <View style={styles.container}>
        <Text>Doctor</Text>
        <Button
          title={"logout"}
          onPress={() =>
            auth()
              .signOut()
              .then(() => {
                navigation.navigate("login")
              })
          }
        />
      </View>
    )
  })

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})

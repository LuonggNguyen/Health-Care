import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { StyleSheet, View } from "react-native"
import { MyHeader } from "../components/MyHeader"

export const DetailsDoctorScreen: FC<StackScreenProps<NavigatorParamList, "detailsDoctor">> =
  observer(function DetailsDoctorScreen({ route, navigation }) {
    const { idDoctor } = route.params

    console.log("idDoctor: ", idDoctor)

    return (
      <View>
        <MyHeader title="Details Doctor" onPress={() => navigation.goBack()} />
        <View style={styles.container}></View>
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

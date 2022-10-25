import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, Text, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Header } from "@rneui/themed"
import { color } from "../theme"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

export const DoctorHealthScreen: FC<StackScreenProps<NavigatorParamList, "doctorHealth">> =
  observer(function DoctorHealthScreen({ navigation }) {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={color.colorHeader}
          centerComponent={
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#000",
              }}
            >
              Articles Health
            </Text>
          }
          rightComponent={
            <MaterialIcons
              name="note-add"
              size={28}
              color="#000"
              onPress={() => navigation.navigate("postArticle")}
            />
          }
        />
        <View style={styles.content}></View>
      </View>
    )
  })
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
})

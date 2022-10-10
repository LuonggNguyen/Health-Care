import * as React from "react"
import { StyleSheet, Text, View } from "react-native"
import { observer } from "mobx-react-lite"
import { Header } from "@rneui/themed"
import { color } from "../theme"
import Iconicons from "react-native-vector-icons/Ionicons"

export interface MyHeaderProps {
  title?: string
  onPress?
}

/**
 * Describe your component here
 */
export const MyHeader = React.memo(
  observer(function MyHeader(props: MyHeaderProps) {
    return (
      <Header
        centerComponent={<Text style={styles.titleHeader}>{props.title}</Text>}
        backgroundColor={color.colorHeader}
        leftComponent={
          <Iconicons name="arrow-back" color="#000" size={28} onPress={props.onPress} />
        }
      />
    )
  }),
)
const styles = StyleSheet.create({
  Header: {
    flex: 1,
    alignItems: "center",
  },
  titleHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
})

import * as React from "react"
import { StyleSheet, Text } from "react-native"
import { observer } from "mobx-react-lite"
import { Header } from "@rneui/themed"
import { color } from "../theme"
import Iconicons from "react-native-vector-icons/Ionicons"

export interface MyHeaderProps {
  title?: string
  onPress?
  height?
  bgColor
}

/**
 * Describe your component here
 */
export const MyHeader = React.memo(
  observer(function MyHeader(props: MyHeaderProps) {
    return (
      <Header
        style={{ height: props.height }}
        centerComponent={<Text style={styles.titleHeader}>{props.title}</Text>}
        backgroundColor={props.bgColor}
        leftComponent={
          <Iconicons name="arrow-back" color="#000" size={28} onPress={props.onPress} />
        }
      />
    )
  }),
)
const styles = StyleSheet.create({
  titleHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
})

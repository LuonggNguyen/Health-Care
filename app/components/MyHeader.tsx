import * as React from "react"
import { StyleSheet, Text } from "react-native"
import { observer } from "mobx-react-lite"
import { Header } from "@rneui/themed"
import { color } from "../theme"
import Iconicons from "react-native-vector-icons/Ionicons"
import { moderateScale, scale } from "../utils/Scale/Scaling"

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
          <Iconicons
            name="arrow-back"
            color={color.colorTextHeader}
            size={scale(24)}
            onPress={props.onPress}
          />
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
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: color.colorTextHeader,
  },
})

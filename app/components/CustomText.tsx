import { Text } from "react-native"
import React from "react"
import { observer } from "mobx-react-lite"
import { moderateScale } from "../utils/Scale/Scaling"

export interface CustomText {
  title?: any
  color?: string
  size?: any
  textAlign?: any
}

export const CustomText = React.memo(
  observer(function MyHeader(props: CustomText) {
    return (
      <Text
        style={{
          textAlign: props.textAlign == null ? "center" : props.textAlign,
          color: props.color == null ? "#000" : props.color,
          fontSize: props.size == null ? moderateScale(16) : props.size,
        }}
      >
        {props.title}
      </Text>
    )
  }),
)

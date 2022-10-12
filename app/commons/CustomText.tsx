import { Text, StyleSheet, View } from "react-native"
import React, { Component } from "react"
import { observer } from "mobx-react-lite"

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
          fontSize: props.size == null ? 16 : props.size,
        }}
      >
        {props.title}
      </Text>
    )
  }),
)
const styles = StyleSheet.create({})

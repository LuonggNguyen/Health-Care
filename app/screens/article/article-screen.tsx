import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { database } from "../../../configs/firebase"

export const ArticleScreen: FC<StackScreenProps<NavigatorParamList, "article">> = observer(
  function ArticleScreen() {
    useEffect(() => {
      database.ref("/post").on("value", (response) => {
        const listkey = Object.keys(response.val())
        listkey.map((key) => {
          database.ref("/posts/" + key).update({
            idPost: key,
          })
        })
      })
    }, [])
    return <View></View>
  },
)
const styles = StyleSheet.create({})

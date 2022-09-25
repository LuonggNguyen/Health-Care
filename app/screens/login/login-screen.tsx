import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Button } from "@rneui/themed"
import Icon from "react-native-vector-icons/Ionicons"

export const LoginScreen: FC<StackScreenProps<NavigatorParamList, "login">> = observer(
  function LoginScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <View style={styles.container}>
        <Button
          type="solid"
          title={"login"}
          color="success"
          style={{ height: 50, width: 100 }}
          titleStyle={{ color: "#000" }}
          icon={<Icon name="home" size={24} color="#000" />}
        />
      </View>
    )
  },
)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})

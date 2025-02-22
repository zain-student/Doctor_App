import React, { useEffect, useState } from "react"
import { Pressable, PressableProps, ViewStyle, TouchableOpacity } from "react-native"
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"
import type { SharedValue } from "react-native-reanimated"
import { isRTL } from "../../i18n"
import { colors, spacing } from "../../theme"
import { Text, Icon } from "../../components"
import { useStores } from "app/models"

interface HeaderBackButton extends PressableProps {
  title: string
}

export function HeaderBackButton(props: HeaderBackButton) {
  const { title, navigation } = props
  const { authenticationStore } = useStores()
  const [user, setUser] = useState(authenticationStore.login)

  const backButtonPress = () => {
    navigation.goBack()
  }
  return (
    <TouchableOpacity onPress={backButtonPress} style={$profileView}>
      <Icon
        icon={"back"}
        // color={focused && colors.tint}
        size={26}
      />
      <Text
        preset="bold"
        tx={title}
        style={{ color: colors.themeText, marginHorizontal: spacing.sm }}
      >
        {user.length > 0 && user[0].FullName ? user[0].FullName : ""}
      </Text>
    </TouchableOpacity>
  )
}

const barHeight = 2

const $container: ViewStyle = {
  alignItems: "center",
  height: 56,
  justifyContent: "center",
  width: 56,
}

const $topBar: ViewStyle = {
  height: barHeight,
}

const $middleBar: ViewStyle = {
  height: barHeight,
  marginTop: spacing.xxs,
}

const $bottomBar: ViewStyle = {
  height: barHeight,
}

const $profileView: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: spacing.sm,
}
// @demo remove-file

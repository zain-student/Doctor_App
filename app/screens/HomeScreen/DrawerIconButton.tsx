import React, {useEffect} from 'react';
import {
  Image,
  Pressable,
  PressableProps,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import type {SharedValue} from 'react-native-reanimated';
import {isRTL} from '../../i18n';
import {colors, spacing} from '../../theme';

interface DrawerIconButtonProps extends PressableProps {
  open: boolean;
  progress: SharedValue<number>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DrawerIconButton(props: DrawerIconButtonProps) {
  const {open, progress, ...PressableProps} = props;

  return (
    <TouchableOpacity onPress={props.onPress}>
      <Image
        source={require('../../../assets/images/drawerIcon.png')}
        style={{height: 16, width: 22, marginLeft: 25}}
      />
    </TouchableOpacity>
  );
}

const barHeight = 2;

const $container: ViewStyle = {
  alignItems: 'center',
  height: 56,
  justifyContent: 'center',
  width: 56,
};

const $topBar: ViewStyle = {
  height: barHeight,
};

const $middleBar: ViewStyle = {
  height: barHeight,
  marginTop: spacing.xxs,
};

const $bottomBar: ViewStyle = {
  height: barHeight,
};

// @demo remove-file

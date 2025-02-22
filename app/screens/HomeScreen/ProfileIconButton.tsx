import React, {useEffect, useState} from 'react';
import {
  Pressable,
  PressableProps,
  ViewStyle,
  TouchableOpacity,
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
import {Text, Icon} from '../../components';
import {useStores} from 'app/models';

interface ProfileIconButtonProps extends PressableProps {
  open: boolean;
  progress: SharedValue<number>;
}

export function ProfileIconButton(props: ProfileIconButtonProps) {
  const {open, progress, ...PressableProps} = props;
  const {authenticationStore} = useStores();
  const [user, setUser] = useState(authenticationStore.login);

  return (
    <TouchableOpacity
      // onPress={}
      style={$profileView}>
      <Text
        preset="formLabel"
        // tx={
        //   'header.nurse' + user.length > 0 && user[0].FullName
        //     ? user[0].FullName
        //     : ''
        // }
        style={{marginHorizontal: 6, color: '#313450', fontSize: 14}}>
        Doctor App
      </Text>
      <Icon
        icon={'profile'}
        // color={focused && colors.tint}
        size={32}
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

const $profileView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: spacing.sm,
};
// @demo remove-file

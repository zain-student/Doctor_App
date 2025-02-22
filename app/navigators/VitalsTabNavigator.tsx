import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React from 'react';
import {TextStyle, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon} from '../components';
import {translate} from '../i18n';
import * as Screens from 'app/screens';
import {colors, spacing, typography} from '../theme';
import {AppStackParamList, AppStackScreenProps} from './AppNavigator';
import {PatientFaceSheetScreen} from 'app/screens/PatientFaceSheetScreen';
import {SoapScreen} from 'app/screens/SoapScreen';
import {PatientHistory} from 'app/screens/PatientHistory';
import {SelectAPatientScreen} from 'app/screens/SelectAPatientScreen';

const Stack = createNativeStackNavigator();

export function VitalsTabNavigator() {
  const {bottom} = useSafeAreaInsets();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
      }}>
      <Stack.Screen
        name="SelectAPatient"
        component={Screens.TodaysPatientsScreen}
      />
      <Stack.Screen name="PatientVitals" component={PatientHistory} />
    </Stack.Navigator>
  );
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
};

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
};

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  flex: 1,
};

// @home remove-file

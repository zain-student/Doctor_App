import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import React from 'react';
import {TextStyle, ViewStyle, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon} from '../components';
import {translate} from '../i18n';
import {
  // PatientSearchScreen,
  HomeScreen,
  // HomeDebugScreen,
  TodaysPatientsScreen,
  PatientStatusScreen,
  AddNewVitalsScreen,
} from '../screens';
// import { HomePodcastListScreen } from "../screens/HomePodcastListScreen"
import {colors, spacing, typography} from '../theme';
import {
  AppStackParamList,
  AppStackScreenProps,
  StackNavigator,
} from './AppNavigator';
import {PatientNavigator} from './PatientNavigator';
import {PatientHistory} from 'app/screens/PatientHistory';
import {SelectAPatientScreen} from 'app/screens/SelectAPatientScreen';
import {VitalsTabNavigator} from './VitalsTabNavigator';
import {isTablet} from 'react-native-device-info';

export type HomeTabParamList = {
  // PatientSearch: undefined
  HomeScreen: {queryIndex?: string; itemIndex?: string};
  // PatientAdvanceSearchScreen: undefined
  TodaysPatients: undefined;
  PatientStatus: undefined;
  // HomeDebug: undefined
  // HomePodcastList: undefined
};

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<HomeTabParamList, T>,
    AppStackScreenProps<keyof AppStackParamList>
  >;

const Tab = createBottomTabNavigator<HomeTabParamList>();

export function HomeNavigator() {
  const {bottom} = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, {height: bottom + 70}],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={StackNavigator}
        options={{
          // tabBarLabel: translate("homeNavigator.homeScreen"),
          tabBarLabel: ({focused, color}) => (
            <Text
              style={[
                {
                  color: focused ? colors.themeText : color,
                  fontFamily: typography.primary.medium,
                  fontSize: 10,
                },
                isTablet() && {marginLeft: 20, marginTop: 10},
              ]}>
              {translate('homeNavigator.homeScreen')}
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <>
              {focused ? (
                <View
                  style={{
                    height: 4,
                    width: 4,
                    borderRadius: 4 / 2,
                    backgroundColor: '#23AAFA',
                    marginBottom: 4,
                  }}
                />
              ) : null}

              <Icon
                icon={focused ? 'home_blue' : 'home'}
                // color={focused && colors.tint}
                size={30}
                // style={{ borderWidth: 2, borderColor: focused ? colors.tint : colors.background}}
              />
            </>
          ),
        }}
      />

      <Tab.Screen
        name="PatientsTab"
        component={PatientNavigator}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();

            navigation.navigate('PatientsTab', {screen: 'TodaysPatients'});
          },
        })}
        options={{
          tabBarAccessibilityLabel: translate('homeNavigator.todaysPatients'),
          // tabBarLabel: translate("homeNavigator.todaysPatients"),
          tabBarLabel: ({focused, color}) => (
            <Text
              style={[
                {
                  color: focused ? colors.themeText : color,
                  fontFamily: typography.primary.medium,
                  fontSize: 10,
                },
                isTablet() && {marginLeft: 20, marginTop: 5},
              ]}>
              {translate('homeNavigator.todaysPatients')}
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <>
              {focused ? (
                <View
                  style={{
                    height: 4,
                    width: 4,
                    borderRadius: 4 / 2,
                    backgroundColor: '#23AAFA',
                    marginBottom: 4,
                  }}
                />
              ) : null}
              <Icon
                icon={focused ? 'queue_blue' : 'queue'}
                // color={focused && colors.tint}
                size={30}
                // style={{ borderWidth: 2, borderColor: focused ? colors.tint : colors.background}}
              />
            </>
          ),
        }}
      />

      <Tab.Screen
        name="VitalsTab"
        component={VitalsTabNavigator}
        options={{
          // tabBarLabel: translate("homeNavigator.patientSearch"),
          tabBarLabel: ({focused, color}) => (
            <Text
              style={[
                {
                  color: focused ? colors.themeText : color,
                  fontFamily: typography.primary.medium,
                  fontSize: 10,
                },
                isTablet() && {marginLeft: 20, marginTop: 5},
              ]}>
              {translate('homeNavigator.patientVitals')}
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <>
              {focused ? (
                <View
                  style={{
                    height: 4,
                    width: 4,
                    borderRadius: 4 / 2,
                    backgroundColor: '#23AAFA',
                    marginBottom: 4,
                  }}
                />
              ) : null}
              <Icon
                icon={focused ? 'vitals_history_blue' : 'vitals_history'}
                // color={focused && colors.tint}
                size={30}
                // style={{ borderWidth: 2, borderColor: focused ? colors.tint : colors.background}}
              />
            </>
          ),
        }}
      />

      <Tab.Screen
        name="PatientStatus"
        component={PatientStatusScreen}
        options={{
          // tabBarLabel: translate("homeNavigator.patientStatus"),
          tabBarLabel: ({focused, color}) => (
            <Text
              style={[
                {
                  color: focused ? colors.themeText : color,
                  fontFamily: typography.primary.medium,
                  fontSize: 10,
                },
                isTablet() && {marginLeft: 20, marginTop: 5},
              ]}>
              {translate('homeNavigator.patientStatus')}
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <>
              {focused ? (
                <View
                  style={{
                    height: 4,
                    width: 4,
                    borderRadius: 4 / 2,
                    backgroundColor: '#23AAFA',
                    marginBottom: 4,
                  }}
                />
              ) : null}
              <Icon
                icon={focused ? 'status_blue' : 'status'}
                // color={focused && colors.tint}
                size={30}
                // style={{ borderWidth: 2, borderColor: focused ? colors.tint : colors.background}}
              />
            </>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
  elevation: 5,
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

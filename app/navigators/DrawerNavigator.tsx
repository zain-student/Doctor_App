import {View, Text} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {CustomDrawerContent} from './DrawerContent';
import {HomeNavigator} from './HomeNavigator';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false}}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="HomeNavigator" component={HomeNavigator} />
    </Drawer.Navigator>
  );
}

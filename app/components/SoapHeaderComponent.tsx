import {StyleSheet, View} from 'react-native';
import React from 'react';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {Icon} from './Icon';
import {Text} from './Text';
import {typography} from 'app/theme';
import DeviceInfo, {isTablet} from 'react-native-device-info';

console.warn('DeviceInfo.isTablet()', DeviceInfo.isTablet());
export default function SoapHeaderComponent(props: {doctorName: string}) {
  return (
    <View
      style={{
        width: widthPercentageToDP(90),
        flexDirection: 'row',
        marginBottom: 20,
      }}>
      <View
        style={{
          backgroundColor: '#2196F3',
          width: DeviceInfo.isTablet()
            ? widthPercentageToDP(30)
            : widthPercentageToDP(39),
          marginRight: widthPercentageToDP(1.5),
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon
          icon="button_soap"
          size={
            DeviceInfo.isTablet()
              ? widthPercentageToDP(8)
              : widthPercentageToDP(20)
          }
          style={{tintColor: 'white'}}
        />
        <Text
          preset="bold"
          style={{
            fontSize: 12,
            color: 'white',
          }}>
          SOAP Note
        </Text>
      </View>
      <View
        style={{
          width: isTablet() ? widthPercentageToDP(62) : widthPercentageToDP(46),
        }}>
        <View
          style={{
            backgroundColor: '#F9EF9D',
            paddingVertical: 3,
            borderRadius: 4,
          }}>
          <Text
            // preset="bold"
            style={{
              fontSize: 8,
              color: 'black',
              paddingHorizontal: 6,
              lineHeight: 14,
              fontFamily: typography.primary.medium,
            }}>
            Doctor
          </Text>
          <Text
            preset="bold"
            style={{
              fontSize: 10,
              color: 'black',
              paddingHorizontal: 6,
            }}>
            {props.doctorName ? props.doctorName : 'Dr. Noreen'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 6,
          }}>
          <View style={styles.itemContainer}>
            <Text
              // preset="bold"
              style={styles.titleText}>
              Time
            </Text>
            <Text preset="bold" style={styles.secondaryText}>
              10:14:00
            </Text>
          </View>
          <View style={styles.itemContainer}>
            <Text
              // preset="bold"
              style={styles.titleText}>
              Date
            </Text>
            <Text preset="bold" style={styles.secondaryText}>
              09/22/24
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 6,
          }}>
          <View style={styles.itemContainer}>
            <Text
              // preset="bold"
              style={styles.titleText}>
              Reason
            </Text>
            <Text preset="bold" style={styles.secondaryText} numberOfLines={1}>
              Consultation
            </Text>
          </View>
          <View style={styles.itemContainer}>
            <Text
              // preset="bold"
              style={styles.titleText}>
              Note Type
            </Text>
            <Text preset="bold" style={styles.secondaryText}>
              Out Patient
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#F4F4F4',
    width: isTablet() ? widthPercentageToDP(31) : widthPercentageToDP(22),
    paddingVertical: isTablet() ? 10 : 3,
    borderRadius: 4,
  },
  titleText: {
    fontSize: 8,
    paddingLeft: 6,
    color: 'black',
    lineHeight: 14,
    fontFamily: typography.primary.medium,
  },
  secondaryText: {
    fontSize: 8,
    color: 'black',
    paddingLeft: 6,
    lineHeight: 12,
  },
});

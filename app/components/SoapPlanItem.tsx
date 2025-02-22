import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Text} from './Text';
import {Icon} from './Icon';
import {widthPercentageToDP} from 'react-native-responsive-screen';

export default function SoapPlanItem(props: any) {
  const renderMedicationItem = ({item, index}: any) => (
    <View style={{borderWidth: 1, marginBottom: 6, borderColor: '#DBDADE'}}>
      <View style={{flexDirection: 'row'}}>
        <View style={{width: widthPercentageToDP(22)}}>
          <Text preset="bold" style={{fontSize: 11, paddingLeft: 4}}>
            {item.DrugName}
          </Text>
          <Text style={{fontSize: 11, paddingLeft: 4}}>{item.desc}</Text>
        </View>
        <View style={{width: widthPercentageToDP(18)}}>
          <Text style={{fontSize: 11, alignSelf: 'center'}}>
            {item.Quantity}
          </Text>
        </View>
        <View style={{width: widthPercentageToDP(20)}}>
          <Text style={{fontSize: 11}}>{item.startDate}</Text>
          <Text style={{fontSize: 11}}>Provider: {item.ProviderName}</Text>
        </View>
        <View style={{width: widthPercentageToDP(20)}}>
          <Text style={{fontSize: 11, alignSelf: 'center'}}>
            {item.endDate}
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: '#DBDADE',
        }}>
        <Text style={{fontSize: 11, paddingLeft: 4, flex: 1}}>
          Comment: {item.DirectionToPatient}
        </Text>
        {item.isNew && (
          <View style={{flexDirection: 'row'}}>
            <Icon
              icon={'deleteIcon'}
              size={18}
              style={{marginLeft: 0}}
              onPress={() => props.onDeleteMedicationPressed(index)}
            />
            <Icon
              icon={'editIcon'}
              size={14}
              style={{marginHorizontal: 8, marginTop: 2}}
              onPress={() => props.onAddMedicationPressed(index)}
            />
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#F8FEFF',
          height: 28,
          alignItems: 'center',
        }}>
        <Text
          preset="bold"
          style={{
            color: '#23AAFA',
            fontSize: 13,
            marginLeft: 10,
          }}>
          Medications
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (props.innerExpandedItem === 'medication') {
              props.setInnerExpandedItem('');
            } else {
              props.setInnerExpandedItem('medication');
            }
          }}>
          <Icon icon={'eyeIcon'} size={24} style={{marginLeft: 6}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.onAddMedicationPressed()}>
          <Icon icon={'blueAddIcon'} size={20} style={{marginLeft: 6}} />
        </TouchableOpacity>
      </View>
      {props.innerExpandedItem === 'medication' && (
        <View style={styles.listSubContainer}>
          {props.currentPatient?.medications?.length > 0 ? (
            <View
              style={{
                flex: 1,
                borderLeftWidth: 2,
                borderRightWidth: 2,
                borderColor: 'white',
                marginTop: 4,
              }}>
              <FlatList
                data={props.currentPatient?.medications}
                renderItem={renderMedicationItem}
              />
              <TouchableOpacity
                onPress={props.onSavePressed}
                style={{
                  width: '100%',
                  backgroundColor: '#48BD69',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 6.5,
                  marginBottom: 6,
                  height: 40,
                }}>
                <Text preset="bold" style={{color: 'white'}}>
                  SAVE
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text
              preset="default"
              style={{
                color: '#4B465C',
                fontSize: 13,
                marginLeft: 10,
              }}>
              No medication found
            </Text>
          )}
        </View>
      )}
      {/* <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#F8FEFF',
          height: 28,
          alignItems: 'center',
        }}>
        <Text
          preset="bold"
          style={{
            color: '#23AAFA',
            fontSize: 13,
            marginLeft: 10,
          }}>
          Follow Up Visit
        </Text>
        <Icon icon={'blueAddIcon'} size={20} style={{marginLeft: 10}} />
      </View>
      <View style={styles.listSubContainer}>
        <Text
          preset="default"
          style={{
            color: '#4B465C',
            fontSize: 13,
            marginLeft: 10,
          }}>
          Follow up needed
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#F8FEFF',
          height: 28,
          alignItems: 'center',
        }}>
        <Text
          preset="bold"
          style={{
            color: '#23AAFA',
            fontSize: 13,
            marginLeft: 10,
          }}>
          Outside Services Referrals
        </Text>
        <Icon icon={'blueAddIcon'} size={20} style={{marginLeft: 10}} />
      </View>
      <View style={styles.listSubContainer}>
        <Text
          preset="default"
          style={{
            color: '#4B465C',
            fontSize: 13,
            marginLeft: 10,
          }}>
          No referral needed
        </Text>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  listSubContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#56B4FF',
    alignItems: 'center',
    paddingVertical: 4,
    // paddingHorizontal: 10,
  },
});

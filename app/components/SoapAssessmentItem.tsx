import {FlatList, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Text} from './Text';
import {Icon} from './Icon';

export default function SoapAssessmentItem(props: any) {
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
          Order Investigations
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (props.innerExpandedItem === 'investigation') {
              props.setInnerExpandedItem('');
            } else {
              props.setInnerExpandedItem('investigation');
            }
          }}>
          <Icon icon={'eyeIcon'} size={24} style={{marginLeft: 6}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={props.onAddOrderInvestigation}>
          <Icon icon={'blueAddIcon'} size={20} style={{marginLeft: 6}} />
        </TouchableOpacity>
      </View>
      {props.innerExpandedItem === 'investigation' && (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'white',
            // height: 28,
            borderTopWidth: 0.5,
            borderBottomWidth: 0.5,
            borderColor: '#56B4FF',
            alignItems: 'center',
            paddingLeft: 10,
          }}>
          <FlatList
            numColumns={8}
            columnWrapperStyle={{flexWrap: 'wrap'}}
            // horizontal
            data={props.currentPatient?.orderInvestigations}
            ListEmptyComponent={() => (
              <Text
                preset="default"
                style={{
                  color: 'black',
                  fontSize: 11,
                }}>
                No data found
              </Text>
            )}
            renderItem={({item, index}) => (
              <View
                style={{
                  height: 20,
                  backgroundColor: '#2196F3',
                  borderWidth: 0,
                  borderColor: '#2196F3',
                  paddingHorizontal: 10,
                  marginRight: 10,
                  borderRadius: 10,
                  justifyContent: 'center',
                  marginVertical: 6,
                }}>
                <Text
                  preset="bold"
                  style={{
                    color: 'white',
                    fontSize: 10,
                    textAlign: 'center',
                  }}>
                  {item.ServiceName}
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

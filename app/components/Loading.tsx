import {View, Text, Modal, ActivityIndicator} from 'react-native';
import React from 'react';

export default function Loading(props: {isLoading: boolean}) {
  return (
    <Modal transparent visible={props.isLoading}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            height: 60,
            width: 60,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
          }}>
          <ActivityIndicator size={'large'} color={'#0CABF0'} />
        </View>
      </View>
    </Modal>
  );
}

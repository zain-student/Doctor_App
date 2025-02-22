import React from 'react';
import {View, Modal, Text, TouchableOpacity, StyleSheet} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import {Icon} from './Icon';

interface Iprops {
  showQrCodeScanner: boolean;
  onSuccess: (e: BarCodeReadEvent) => void;
  onHideQrCodeScanner: () => void;
}
const QrCodeScanner = (props: Iprops) => {
  return (
    <Modal
      onRequestClose={props.onHideQrCodeScanner}
      transparent={true}
      visible={props.showQrCodeScanner}>
      <View style={styles.mainContainer}>
        <QRCodeScanner
          onRead={props.onSuccess}
          showMarker={true}
          fadeIn={true}
          flashMode={RNCamera.Constants.FlashMode.off}
          cameraContainerStyle={{}}
          notAuthorizedView={
            <View
              style={{
                backgroundColor: 'white',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 5,
              }}>
              <Text style={{textAlign: 'center'}}>
                Please Allow Camera Permission From Settings To Use This
                Feature.
              </Text>
              <TouchableOpacity
                onPress={props.onHideQrCodeScanner}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <Icon icon={'back'} color={'white'} size={26} />
                <Text>Back</Text>
              </TouchableOpacity>
            </View>
          }
          topContent={
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'White',
              }}>
              <TouchableOpacity
                onPress={props.onHideQrCodeScanner}
                style={{padding: 5}}>
                <Icon icon={'back'} color={'white'} size={26} />
              </TouchableOpacity>
              <Text style={styles.centerText}>
                Positon your camera on Qr Code
              </Text>
            </View>
          }
        />
      </View>
    </Modal>
  );
};

export default QrCodeScanner;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    // padding: 32,
    color: '#777',
    textAlign: 'center',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

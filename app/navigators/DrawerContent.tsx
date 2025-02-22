import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {ListItem, Text} from 'app/components';
import QrCodeScanner from 'app/components/QRCodePopup';
import {isRTL} from 'app/i18n';
import {colors, spacing} from 'app/theme';
import {UserContext, mmkvStorage} from 'app/utils/UserContext';
import {useSafeAreaInsetsStyle} from 'app/utils/useSafeAreaInsetsStyle';
import React, {useContext} from 'react';
import {
  FlatList,
  Image,
  ImageStyle,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  View,
  ViewStyle,
} from 'react-native';
import {BarCodeReadEvent} from 'react-native-camera';

const MENU = [
  {
    id: 1,
    name: "Today's Patients",
    data: [],
    icon: 'button_search',
  },
  {
    id: 2,
    name: 'Patient Status',
    data: [],
    icon: 'button_search',
  },
  {
    id: 3,
    name: 'Patients SOAP Note',
    data: [],
    icon: 'button_search',
  },
  {
    id: 4,
    name: 'Patients Face Sheet',
    data: [],
    icon: 'button_search',
  },
  {
    id: 7,
    name: 'Patients Vitals',
    data: [],
    icon: 'button_search',
  },

  {
    id: 6,
    name: 'Scan QR Code',
    data: [],
    icon: 'button_search',
  },
  {
    id: 11,
    name: 'Signout',
    data: [],
    icon: 'button_search',
  },
];

const NativeListItem: FC<HomeListItem> = ({item, menuPressed}) => {
  // console.log('item............', item)
  return (
    <View>
      <Text
        onPress={() => menuPressed(item)}
        preset="bold"
        style={$menuContainer}>
        {item.name}
      </Text>
    </View>
  );
};
const logo = require('../../assets/images/logo.png');

export function CustomDrawerContent(props) {
  const userContext = useContext(UserContext);
  const [showQrCodeScanner, setshowQrCodeScanner] = React.useState(false);
  const menuPressed = item => {
    console.warn(item);
    if (item.id === 1) {
      props.navigation.navigate('PatientsTab');
    } else if (item.id === 2) {
      props.navigation.navigate('PatientStatus');
    } else if (item.id === 7) {
      props.navigation.navigate('VitalsTab');
    } else if (item.id === 4) {
      props.navigation.navigate('PatientsTab', {
        screen: 'TodaysPatients',
        params: {flow: 'faceSheet'},
      });
    } else if (item.id === 3) {
      props.navigation.navigate('PatientsTab', {
        screen: 'TodaysPatients',
        params: {flow: 'SOAPNote'},
      });
    } else if (item.id === 6) {
      onShowQrCodeScanner();
    } else if (item.id === 11) {
      // mmkvStorage.clearAll();
      // AsyncStorage.clear();
      // userContext.updatePatientsData([]);
      clearupData();
      userContext.updateSelectedPatientIndex(-1);
      userContext.updateIsLoggedIn(false);
      console.warn('rrr');
      // props.navigation.navigate('PatientStatus');
    }
  };

  const clearupData = () => {
    try {
      let patients = [...userContext.patientsData];
      let filteredData = patients.filter(item => {
        if (item.patient.isFromNurse || item.isEditedByDoc) {
          return true;
        } else {
          return false;
        }
      });
      console.warn('filteredData', filteredData);
      userContext.updatePatientsData(filteredData);
    } catch (e) {}
  };

  const onShowQrCodeScanner = async () => {
    let granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === 'granted') {
      setshowQrCodeScanner(true);
    } else {
      ToastAndroid.show(
        'Please grant permission to access camera',
        ToastAndroid.LONG,
      );
    }
  };

  const onHideQrCodeScanner = async () => {
    setshowQrCodeScanner(false);
  };

  const onQrRead = (e: BarCodeReadEvent) => {
    let ip = e.data;
    global.ip = ip;
    userContext.startConnectionDiscovery();
    console.warn('qr data', e);
    setshowQrCodeScanner(false);
  };

  return (
    <DrawerContentScrollView {...props} style={{backgroundColor: 'white'}}>
      <QrCodeScanner
        showQrCodeScanner={showQrCodeScanner}
        onHideQrCodeScanner={onHideQrCodeScanner}
        onSuccess={onQrRead}
      />
      {/* <DrawerItemList {...props} /> */}
      <View style={[$drawer]}>
        <View style={$logoContainer}>
          <Image source={logo} style={$logoImage} />
        </View>
        <FlatList<{name: string; useCases: string[]}>
          //   ref={menuRef}
          contentContainerStyle={$flatListContentContainer}
          // data={Object.values(Homes).map((d) => ({
          //   name: d.name,
          //   useCases: d.data.map((u) => u.props.name),
          // }))}
          data={MENU}
          keyExtractor={item => item.name}
          renderItem={({item, index: sectionIndex}) => (
            <ShowroomListItem {...{item, sectionIndex, menuPressed}} />
          )}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const ShowroomListItem = Platform.select({
  web: null,
  default: NativeListItem,
});

// const $drawerInsets = useSafeAreaInsetsStyle(['top']);

const $logoImage: ImageStyle = {
  height: 42,
  width: 177,
};

const $logoContainer: ViewStyle = {
  alignSelf: 'flex-start',
  justifyContent: 'center',
  height: 56,
  paddingHorizontal: spacing.lg,
};

const $drawer: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
};

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: 20,
};

const $menuContainer: ViewStyle = {
  paddingBottom: spacing.xs,
  paddingTop: spacing.lg,
};

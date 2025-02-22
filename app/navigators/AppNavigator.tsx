/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams, // @demo remove-current-line
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {
  AppState,
  AppStateStatus,
  ToastAndroid,
  useColorScheme,
} from 'react-native';
import * as Screens from 'app/screens';
import Config from '../config';
import {useStores} from '../models'; // @demo remove-current-line
import {DemoNavigator, DemoTabParamList} from './DemoNavigator'; // @demo remove-current-line
import {HomeNavigator, HomeTabParamList} from './HomeNavigator';
import {navigationRef, useBackButtonHandler} from './navigationUtilities';
import {colors} from 'app/theme';
import {PatientNavigator, PatientStackParamList} from './PatientNavigator';
import {UserContext, mmkvStorage} from 'app/utils/UserContext';
import {NetworkInfo} from 'react-native-network-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PatientFaceSheetScreen} from 'app/screens/PatientFaceSheetScreen';
import {SoapScreen} from 'app/screens/SoapScreen';
import {PatientHistory} from 'app/screens/PatientHistory';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {CustomDrawerContent} from './DrawerContent';
import DrawerNavigator from './DrawerNavigator';
import moment from 'moment';
import KeepAwake from 'react-native-keep-awake';
var net = require('react-native-tcp');

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined;
  Login: undefined; // @demo remove-current-line
  Landing: undefined;
  SitesScreen: undefined;
  PatientFaceSheet: undefined;
  Home: NavigatorScreenParams<HomeTabParamList>; // @demo remove-current-line
  Patient: NavigatorScreenParams<PatientStackParamList>;
  Demo: NavigatorScreenParams<DemoTabParamList>; // @demo remove-current-line
  // 🔥 Your screens go here
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
};

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes;

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>();
const Drawer = createDrawerNavigator();

const AppStack = observer(function AppStack() {
  // @demo remove-block-start
  const {
    authenticationStore: {isAuthenticated},
  } = useStores();
  let vitalUnits = {
    Pulse: 'BPM',
    Temp: 'F',
    'BP Systolic': 'mmHg',
    SpO2: '%',
    'BP Diastolic': 'mmHg',
    Weight: 'KG',
    BMI: 'kg/m*m',
    Height: 'F',
    'Waist Circumference': 'CM',
  };
  const {siteStore, patientStore, vitalStore} = useStores();
  const [clientSocket, setClientSocket] = useState(null);
  const [syncCompleted, setSyncCompleted] = useState(false);
  const [patientsData, setPatientsData] = useState(
    mmkvStorage.getString('patientsData')
      ? JSON.parse(mmkvStorage.getString('patientsData'))
      : [],
  );
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(
    mmkvStorage.getNumber('selectedPatientIndex') !== undefined
      ? mmkvStorage.getNumber('selectedPatientIndex')
      : -1,
  );
  const [isLoggedIn, setIsLoggedIn] = useState(
    mmkvStorage.getBoolean('isLoggedIn') ? true : false,
  );
  const [refreshData, setRefreshData] = useState(false);

  const updateclientSocket = (socket: any) => {
    setClientSocket(socket);
  };

  const updatePatientsData = (_patientsData: any) => {
    let stringifiedData = JSON.stringify(_patientsData);
    global.patientsBackup = JSON.parse(stringifiedData);
    mmkvStorage.set('patientsData', stringifiedData);
    setPatientsData(_patientsData);
  };

  const updateSelectedPatientIndex = (_selectedPatientIndex: number) => {
    mmkvStorage.set('selectedPatientIndex', _selectedPatientIndex);
    setSelectedPatientIndex(_selectedPatientIndex);
  };

  const updateSyncCompleted = (_sel: boolean) => {
    setSyncCompleted(_sel);
  };

  const updateIsLoggedIn = (_item: boolean) => {
    mmkvStorage.set('isLoggedIn', _item ? true : false);
    setIsLoggedIn(_item);
  };
  useEffect(() => {
    KeepAwake.activate();
    try {
      if (mmkvStorage.getString('patientsData')) {
        global.patientsBackup = JSON.parse(
          mmkvStorage.getString('patientsData'),
        );
      } else {
        global.patientsBackup = [];
      }
      let allergyData = mmkvStorage.getString('allergyDropdownData');
      if (allergyData) {
        global.allergyDropdownData = JSON.parse(allergyData);
      }
      let diagnosisData = mmkvStorage.getString('diagnosisDropdownData');
      if (diagnosisData) {
        global.diagnosisDropdownData = JSON.parse(diagnosisData);
      }
      global.successResponses = [];
      if (mmkvStorage.getString('successResponses')) {
        global.successResponses = JSON.parse(
          mmkvStorage.getString('successResponses'),
        );
      }
      global.checkoutSuccessResponses = [];
      if (mmkvStorage.getString('checkoutSuccessResponses')) {
        global.checkoutSuccessResponses = JSON.parse(
          mmkvStorage.getString('checkoutSuccessResponses'),
        );
      }
      console.warn('initiatings');
      global.connectionEstabished = false;
      initiateConnection();
      //////////////////////////////////////
      let presentComplaintData = mmkvStorage.getString('presentComplaintData');
      if (presentComplaintData) {
        global.presentComplaintData = JSON.parse(presentComplaintData);
      }
      //physicalExamData
      let physicalExamData = mmkvStorage.getString('physicalExamData');
      if (physicalExamData) {
        global.physicalExamData = JSON.parse(physicalExamData);
      }
      /////enrich data //////////////////////
      let diagnosisListData = mmkvStorage.getString('diagnosisListData');
      if (diagnosisListData) {
        global.diagnosisListData = JSON.parse(diagnosisListData);
      }
      //Order investigation
      let vaccinationDropdownData = mmkvStorage.getString(
        'vaccinationDropdownData',
      );
      if (vaccinationDropdownData) {
        global.vaccinationDropdownData = JSON.parse(vaccinationDropdownData);
      }
      let investigationDropdownData = mmkvStorage.getString(
        'investigationDropdownData',
      );
      if (investigationDropdownData) {
        global.investigationDropdownData = JSON.parse(
          investigationDropdownData,
        );
      }
      //Medication Form Data
      let medicineListData = mmkvStorage.getString('medicineListData');
      if (medicineListData) {
        global.medicineListData = JSON.parse(medicineListData);
      }
      //
      let medicineRoutesData = mmkvStorage.getString('medicineRoutesData');
      if (medicineRoutesData) {
        global.medicineRoutesData = JSON.parse(medicineRoutesData);
      }
      //
      let medicineFrequencyData = mmkvStorage.getString(
        'medicineFrequencyData',
      );
      if (medicineFrequencyData) {
        global.medicineFrequencyData = JSON.parse(medicineFrequencyData);
      }
    } catch (e) {}
  }, []);

  const initiateConnection = async () => {
    try {
      // await AsyncStorage.setItem('socketIp', '10.0.2.15');
      let data = await AsyncStorage.getItem('socketIp');
      console.warn('data', data);
      if (data) {
        global.ip = data;
        startConnectionDiscovery();
      }
    } catch (e) {}
  };
  const startConnectionDiscovery = () => {
    clearInterval(global.connectionDiscoveryInterval);

    global.connectionDiscoveryInterval = setInterval(() => {
      if (!global.connectionEstabished) {
        createClient();
      }
    }, 3000);
  };

  const createClient = async () => {
    try {
      console.warn('creating client', global.ip);
      // let ip = await NetworkInfo.getGatewayIPAddress();

      const client = net.createConnection(6666, global.ip, () => {
        console.log('opened client on ' + JSON.stringify(client.address()));
        client.write(JSON.stringify({type: 'initial', from: 'doctor'}));
        updateclientSocket(client);
        global.clientSock = client;
        //@ts-ignore
        if (global.dataToTransfer) {
          //@ts-ignore
          // client.write(global.dataToTransfer);
        }
        global.connectionEstabished = true;
        clearInterval(global.connectionDiscoveryInterval);
        AsyncStorage.setItem('socketIp', global.ip);
        // ToastAndroid.show('Connected successfully!', ToastAndroid.LONG);
      });

      client.on('data', data => {
        console.log('Client Received: ' + data);
        let receivedData = JSON.parse(data);

        if (receivedData.receiver === 'doctor') {
          let sender = receivedData.sender;
          try {
            if (sender === 'nurse') {
              client.write(
                JSON.stringify({
                  type: 'resp_success',
                  from: 'doctor',
                  patientId: receivedData.payload.PatientId,
                }),
              );
            } else if (sender === 'pharmacy') {
              client.write(
                JSON.stringify({
                  type: 'resp_success',
                  from: 'doctor',
                  successType: 'pharmacy',
                  patientId: receivedData.payload.PatientId,
                }),
              );
            }
          } catch (e) {}
          if (receivedData.type === 'resp_success') {
            if (receivedData.from === 'receptionist') {
              if (receivedData.isCheckoutSync) {
                global.checkoutSuccessResponses.push(receivedData.patientId);
                mmkvStorage.set(
                  'checkoutSuccessResponses',
                  JSON.stringify(global.checkoutSuccessResponses),
                );
              } else {
                global.successResponses.push(receivedData.patientId);
                mmkvStorage.set(
                  'successResponses',
                  JSON.stringify(global.successResponses),
                );
              }
              setSyncCompleted(!syncCompleted);
              // setRefreshData(!refreshData);
              // global.socket = socket;
              // global.isServerConnected = true;
              // updateSocket(socket);
            }
            return;
          }
          let item = global.patientsBackup.find(
            itm => itm.patient?.PatientId === receivedData.payload.PatientId,
          );
          if (item) {
            console.warn('existing item');
          } else {
            if (sender === 'pharmacy') {
              return;
            }
          }
          let _data: any = {patient: {}};
          if (sender !== 'pharmacy') {
            _data.patient = receivedData.payload;
            _data.isDetailFetched = true;
            if (receivedData.payload.Vitals) {
              let _vitals = [
                {
                  PatientId: receivedData.payload.PatientId,
                  VitalDate: receivedData.payload.VitalsTime,
                  NurseName: receivedData.payload.nurseName,
                  EnteredBy: receivedData.payload.NurseEnteredBy,
                  Data: Object.keys(receivedData.payload.Vitals[0]).map(itm => {
                    return {
                      Name: itm,
                      Value: receivedData.payload.Vitals[0][itm],
                      Unit: vitalUnits[itm],
                    };
                  }),
                },
              ];
              _data.vitals = _vitals;
            }
          } else {
            _data.patient = {
              ...item.patient,
              Status: 'Pharmacy',
              PharmacyTime: receivedData.payload.PharmacyTime,
              PharmacyEnteredBy: receivedData.payload.EnteredBy,
            };
            _data.isDetailFetched = true;
            _data.vitals = [];
          }
          console.warn('structured data::', _data);
          if (global.receivedPatients) {
            global.receivedPatients.push(_data);
          } else {
            global.receivedPatients = [_data];
          }
          setTimeout(() => {
            // setRefreshData(!refreshData);
          }, 1000);
        }

        // client.destroy(); // kill client after server's response
        // this.server.close();
      });

      client.on('error', error => {
        updateclientSocket(null);
        global.connectionEstabished = false;
        startConnectionDiscovery();
        console.log('client error ' + error);
      });

      client.on('close', () => {
        console.log('client close');
        updateclientSocket(null);
        global.connectionEstabished = false;
        startConnectionDiscovery();
      });
    } catch (e) {}
  };

  const resetConnection = () => {
    try {
      if (global.clientSock) {
        global.clientSock.destroy();
        global.clientSock = null;
      }
      // updateclientSocket(null);
      // global.connectionEstabished = false;
    } catch (e) {
      console.warn('err::', e);
    }
  };

  // @demo remove-block-end
  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        clientSocket,
        refreshData,
        patientsData,
        selectedPatientIndex,
        syncCompleted,
        updateIsLoggedIn,
        updateclientSocket,
        startConnectionDiscovery,
        updatePatientsData,
        updateSelectedPatientIndex,
        updateSyncCompleted,
        resetConnection,
      }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          navigationBarColor: colors.background,
        }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
          </>
        ) : (
          <>
            <Stack.Screen name="Landing" component={Screens.LandingScreen} />
            <Stack.Screen name="Sites" component={Screens.SitesScreen} />
            <Stack.Screen name="Login" component={Screens.LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </UserContext.Provider>
  );
});

export const StackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      navigationBarColor: colors.background,
    }}>
    <Stack.Screen name="Home" component={Screens.HomeScreen} />
  </Stack.Navigator>
);

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(
  props: NavigationProps,
) {
  const colorScheme = useColorScheme();

  useBackButtonHandler(routeName => exitRoutes.includes(routeName));

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      {...props}>
      <AppStack />
    </NavigationContainer>
  );
});

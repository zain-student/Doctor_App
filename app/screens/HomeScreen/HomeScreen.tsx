// @ts-nocheck

import {Link, RouteProp, useRoute} from '@react-navigation/native';
import React, {
  FC,
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageStyle,
  Platform,
  SectionList,
  TextStyle,
  View,
  ViewStyle,
  TouchableOpacity,
  ToastAndroid,
  PermissionsAndroid,
} from 'react-native';
import {DrawerLayout, DrawerState} from 'react-native-gesture-handler';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import {Icon, ListItem, Screen, Text, Header} from '../../components';
import {isRTL} from '../../i18n';
import {
  HomeTabParamList,
  HomeTabScreenProps,
} from '../../navigators/HomeNavigator';
import {colors, spacing} from '../../theme';
import {useSafeAreaInsetsStyle} from '../../utils/useSafeAreaInsetsStyle';
// import * as Homes from "./DrawerScreens"
import {DrawerIconButton} from './DrawerIconButton';
import {ProfileIconButton} from './ProfileIconButton';
import {useStores} from '../../models';
import {fetch} from '@react-native-community/netinfo';
import {NetworkInfo} from 'react-native-network-info';
import {UserContext, mmkvStorage} from 'app/utils/UserContext';
import QrCodeScanner from 'app/components/QRCodePopup';
import {BarCodeReadEvent} from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {FlatListIndicator} from '@fanchenbao/react-native-scroll-indicator';
import {getRequest, postRequest} from 'app/services/api/NetworkService';
import Loading from 'app/components/Loading';
import {patientData} from '../../../patientData';
import moment from 'moment';

const logo = require('../../../assets/images/logo.png');

const MENU = [
  {
    id: 1,
    name: 'Today Patients',
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
    id: 8,
    name: 'Patients Allergies',
    data: [],
    icon: 'button_search',
  },
  {
    id: 9,
    name: 'Patients Diagnosis',
    data: [],
    icon: 'button_search',
  },
  {
    id: 10,
    name: 'Patients Physical Exam',
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
    id: 5,
    name: 'Signout',
    data: [],
    icon: 'button_search',
  },
];

export interface Home {
  name: string;
  description: string;
  data: ReactElement[];
}

interface HomeListItem {
  item: {name: string; useCases: string[]};
  sectionIndex: number;
  menuPressed?: (sectionIndex: number, itemIndex?: number) => void;
  drawerMenuPressed?: (item) => void;
}

const slugify = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const WebListItem: FC<HomeListItem> = ({item, sectionIndex}) => {
  const sectionSlug = item.name.toLowerCase();

  return (
    <View>
      <Link to={`/showroom/${sectionSlug}`} style={$menuContainer}>
        <Text preset="bold">{item.name}</Text>
      </Link>
      {item.useCases.map(u => {
        const itemSlug = slugify(u);

        return (
          <Link
            key={`section${sectionIndex}-${u}`}
            to={`/showroom/${sectionSlug}/${itemSlug}`}>
            <Text>{u}</Text>
          </Link>
        );
      })}
    </View>
  );
};

const NativeListItem: FC<HomeListItem> = ({
  item,
  sectionIndex,
  menuPressed,
}) => {
  // console.log('item............', item)
  return (
    <View>
      <Text
        onPress={() => menuPressed(sectionIndex)}
        preset="bold"
        style={$menuContainer}>
        {item.name}
      </Text>
      {item.useCases.map((u, index) => (
        <ListItem
          key={`section${sectionIndex}-${u}`}
          onPress={() => menuPressed(sectionIndex, index + 1)}
          text={u}
          rightIcon={isRTL ? 'caretLeft' : 'caretRight'}
        />
      ))}
    </View>
  );
};

const MenuButtonListItem: FC<HomeListItem> = ({
  item,
  sectionIndex,
  menuPressed,
  drawerMenuPressed,
}) => {
  if (item.name !== 'Signout') {
    return (
      <TouchableOpacity
        onPress={() => drawerMenuPressed(item)}
        style={$menuButtonContainer}>
        <Icon
          icon={
            item.name == 'Patients SOAP Note'
              ? 'button_soap'
              : item.name == 'Patients Face Sheet'
              ? 'button_face'
              : item.name == 'Patients Allergies'
              ? 'button_allergies'
              : item.name == 'Patients Vitals'
              ? 'button_vitals'
              : item.name == 'Patients Diagnosis'
              ? 'button_diagnosis'
              : item.name == 'Patients Physical Exam'
              ? 'button_exam'
              : item.name == 'Today Patients'
              ? 'button_queue'
              : item.name == 'Patient Status'
              ? 'button_status'
              : 'button_logout'
          }
          // color={focused && colors.tint}
          size={90}
        />
        <Text
          numberOfLines={2}
          style={{
            fontSize: 10,
            textAlign: 'center',
            color: '#94A3B8',
          }}
          // onPress={() => menuPressed(sectionIndex)}
          onPress={() => drawerMenuPressed(item)}
          preset="formLabel">
          {item.name}
        </Text>
        {item.useCases.map((u, index) => (
          <ListItem
            key={`section${sectionIndex}-${u}`}
            onPress={() => menuPressed(sectionIndex, index + 1)}
            text={u}
            rightIcon={isRTL ? 'caretLeft' : 'caretRight'}
          />
        ))}
      </TouchableOpacity>
    );
  } else {
    return null;
  }
};
const ShowroomListItem = Platform.select({
  web: WebListItem,
  default: NativeListItem,
});
var net = require('react-native-tcp');
let connectionEstabished = false;
let connectionDiscoveryInterval: ReturnType<typeof setInterval>;

export const HomeScreen: FC<HomeTabScreenProps<'Home'>> = function HomeScreen(
  _props,
) {
  const [open, setOpen] = useState(false);
  // const [isLoading, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const drawerRef = useRef<DrawerLayout>();
  const listRef = useRef<SectionList>();
  const menuRef = useRef<FlatList>();
  const progress = useSharedValue(0);
  const route = useRoute<RouteProp<HomeTabParamList, 'Home'>>();
  const params = route.params;
  // const { pickerStore} = useStores()
  const [isLoading, setIsLoading] = React.useState(false);
  const [showQrCodeScanner, setshowQrCodeScanner] = React.useState(false);
  const {siteStore, patientStore, vitalStore} = useStores();
  const userContext = useContext(UserContext);

  const {
    authenticationStore: {logout, appIsOnline},
    // patientStore,
    //  serviceStore
  } = useStores();

  useEffect(() => {
    // if(appIsOnline() == '1'){
    (async function load() {
      try {
        setIsLoading(true);
        await enrichData();
        // await pickerStore.fetchPickers()
        // await serviceStore.fetchServices()
        console.warn('patients data ', userContext.patientsData?.length);
        if (userContext.patientsData?.length === 0 || global.refetchPatients) {
          await getPatientsData();
        } else {
          await checkPatientsDetails();
          setIsLoading(false);
        }
      } catch (e) {
        console.warn('err', e);
        setIsLoading(false);
      }
    })();
    // }
  }, []);

  // handle Web links
  React.useEffect(() => {
    if (route.params) {
      const homeValues = Object.values(Homes);
      const findSectionIndex = homeValues.findIndex(
        x => x.name.toLowerCase() === params.queryIndex,
      );
      let findItemIndex = 0;
      if (params.itemIndex) {
        try {
          findItemIndex =
            homeValues[findSectionIndex].data.findIndex(
              u => slugify(u.props.name) === params.itemIndex,
            ) + 1;
        } catch (err) {
          console.error(err);
        }
      }
      menuPressed(findSectionIndex, findItemIndex);
    }
  }, [route]);

  const enrichData = async () => {
    try {
      let allergyData = mmkvStorage.getString('allergyDropdownData');
      if (allergyData) {
        global.allergyDropdownData = JSON.parse(allergyData);
      } else {
        getAllergiesDropdown();
      }
      let diagnosisData = mmkvStorage.getString('diagnosisDropdownData');
      if (diagnosisData) {
        global.diagnosisDropdownData = JSON.parse(diagnosisData);
      } else {
        getDiagnosisDropdown();
      }
      let diagnosisListData = mmkvStorage.getString('diagnosisListData');
      if (diagnosisListData) {
        global.diagnosisListData = JSON.parse(diagnosisListData);
      } else {
        getDiagnosisList();
      }
      //Order investigation
      let vaccinationDropdownData = mmkvStorage.getString(
        'vaccinationDropdownData',
      );
      if (vaccinationDropdownData) {
        global.vaccinationDropdownData = JSON.parse(vaccinationDropdownData);
      } else {
        getVaccinationDropdown();
      }
      let investigationDropdownData = mmkvStorage.getString(
        'investigationDropdownData',
      );
      if (investigationDropdownData) {
        global.investigationDropdownData = JSON.parse(
          investigationDropdownData,
        );
      } else {
        getInvestigationDropdown();
      }
      //Medication Form Data
      let medicineListData = mmkvStorage.getString('medicineListData');
      if (medicineListData) {
        global.medicineListData = JSON.parse(medicineListData);
      } else {
        getMedicineListData();
      }
      //
      let medicineRoutesData = mmkvStorage.getString('medicineRoutesData');
      if (medicineRoutesData) {
        global.medicineRoutesData = JSON.parse(medicineRoutesData);
      } else {
        getMedicineRouteData();
      }
      //
      let medicineFrequencyData = mmkvStorage.getString(
        'medicineFrequencyData',
      );
      if (medicineFrequencyData) {
        global.medicineFrequencyData = JSON.parse(medicineFrequencyData);
      } else {
        getMedicineFrequencyData();
      }
      //presentComplaintData
      let presentComplaintData = mmkvStorage.getString('presentComplaintData');
      if (presentComplaintData) {
        global.presentComplaintData = JSON.parse(presentComplaintData);
      } else {
        getPresentComplaintData();
      }
      //physicalExamData
      let physicalExamData = mmkvStorage.getString('physicalExamData');
      if (physicalExamData) {
        global.physicalExamData = JSON.parse(physicalExamData);
      } else {
        getPhysicalExamData();
      }
      // getPatientsData();
      // console.warn('response', response);
      // api/Auth/LoginUser
    } catch (e) {}
  };

  //emrapi.techmedology.com/api/Definition/List/MedicalTemplate?pageId=29&patientId=1
  const getPresentComplaintData = async () => {
    try {
      let response = await getRequest(
        'Definition/List/MedicalTemplate?pageId=28&patientId=1',
      );
      console.warn('response', response);
      if (response.code === 200) {
        let temp = response.data[0];
        const groupedData = temp.reduce((prevValue, item) => {
          const monthKey = item.SectionName;

          if (!prevValue[monthKey]) {
            prevValue[monthKey] = [];
          }

          prevValue[monthKey].push({
            ...item,
            QuestionName: item.QuestionShortName,
          });

          return prevValue;
        }, {});

        const dataArray = Object.keys(groupedData).map(monthKey => ({
          title: monthKey,
          data: groupedData[monthKey],
        }));

        global.presentComplaintData =
          removeDuplicatesFromSectionList(dataArray);
        mmkvStorage.set(
          'presentComplaintData',
          JSON.stringify(global.presentComplaintData),
        );
      }
      // api/Auth/LoginUser
    } catch (e) {}
  };

  const getPhysicalExamData = async () => {
    try {
      let response = await getRequest(
        'Definition/List/MedicalTemplate?pageId=29&patientId=1',
      );
      console.warn('response', response);
      if (response.code === 200) {
        let temp = response.data[0];
        const groupedData = temp.reduce((prevValue, item) => {
          const monthKey = item.SectionName;

          if (!prevValue[monthKey]) {
            prevValue[monthKey] = [];
          }

          prevValue[monthKey].push({
            ...item,
            QuestionName: item.QuestionShortName,
          });

          return prevValue;
        }, {});

        const dataArray = Object.keys(groupedData).map(monthKey => ({
          title: monthKey,
          data: groupedData[monthKey],
        }));
        global.physicalExamData = removeDuplicatesFromSectionList(dataArray);
        mmkvStorage.set(
          'physicalExamData',
          JSON.stringify(global.physicalExamData),
        );
      }
      // api/Auth/LoginUser
    } catch (e) {}
  };

  const removeDuplicatesFromSectionList = sectionList => {
    return sectionList.map(section => {
      const uniqueQuestions = new Set();
      const filteredData = section.data.filter(item => {
        if (!uniqueQuestions.has(item.QuestionShortName.trim())) {
          uniqueQuestions.add(item.QuestionShortName.trim());
          return true;
        }
        return false;
      });
      return {
        title: section.title,
        data: filteredData,
      };
    });
  };

  const getAllergiesDropdown = async () => {
    try {
      let response = await getRequest('Doctor/GetAllergiesDropdown');
      console.warn('response', response);
      if (response.code === 200) {
        let temp = response.data[0];
        for (let i = 0; i < temp.length; i++) {
          let allergenTypes = await getAllergensByAllergy(temp[i].AllergenId);
          if (allergenTypes) {
            temp[i].allergenTypes = allergenTypes;
          }
        }
        response.data[0] = temp;
        global.allergyDropdownData = response.data;
        console.warn('setting data', response.data);
        mmkvStorage.set('allergyDropdownData', JSON.stringify(response.data));
      }
      // api/Auth/LoginUser
    } catch (e) {}
  };

  const getAllergensByAllergy = async (id: number) => {
    try {
      let response = await getRequest(
        `Doctor/GetAllergenTypesAgainstAllergen?AllergenId=${id}`,
      );
      if (response.code === 200) {
        console.warn('response succes');
        return response.data[0];
      }
      return null;
      // api/Auth/LoginUser
    } catch (e) {
      return null;
    }
  };

  const getDiagnosisDropdown = async () => {
    try {
      let response = await getRequest('Doctor/GetDiagnosisDropdown');
      console.warn('response', response);
      if (response.code === 200 && response.data[0]) {
        global.diagnosisDropdownData = response.data[0];
        mmkvStorage.set(
          'diagnosisDropdownData',
          JSON.stringify(global.diagnosisDropdownData),
        );
      }
      // api/Auth/LoginUser
    } catch (e) {}
  };

  const getDiagnosisList = async () => {
    try {
      let response = await getRequest('Definition/List/Diagnosis');
      console.warn('response', response);
      if (response.code === 200 && response.data[0]) {
        global.diagnosisListData = response.data[0];
        mmkvStorage.set(
          'diagnosisListData',
          JSON.stringify(global.diagnosisListData),
        );
      }
      // api/Auth/LoginUser
    } catch (e) {}
  };

  const getVaccinationDropdown = async () => {
    try {
      let response = await getRequest('Definition/List/Vaccination');
      console.warn('response', response);
      if (response.code === 200 && response.data[0]) {
        global.vaccinationDropdownData = response.data[0];
        mmkvStorage.set(
          'vaccinationDropdownData',
          JSON.stringify(global.vaccinationDropdownData),
        );
      }
      // api/Auth/LoginUser
    } catch (e) {}
  };

  const getInvestigationDropdown = async () => {
    try {
      let response = await getRequest('Definition/List/LabTest');
      console.warn('response', response);
      if (response.code === 200 && response.data[0]) {
        global.investigationDropdownData = response.data[0];
        mmkvStorage.set(
          'investigationDropdownData',
          JSON.stringify(global.investigationDropdownData),
        );
      }
      // api/Auth/LoginUser
    } catch (e) {}
  };

  const getMedicineListData = async () => {
    try {
      let response = await getRequest('Definition/List/Medication');
      console.warn('response', response);
      if (response.code === 200 && response.data[0]) {
        global.medicineListData = response.data[0];
        mmkvStorage.set(
          'medicineListData',
          JSON.stringify(global.medicineListData),
        );
      }
      // api/Auth/LoginUser
    } catch (e) {}
  };

  const getMedicineRouteData = async () => {
    try {
      let response = await getRequest('Definition/List/DrugRoute');
      console.warn('response', response);
      if (response.code === 200 && response.data[0]) {
        global.medicineRoutesData = response.data[0];
        mmkvStorage.set(
          'medicineRoutesData',
          JSON.stringify(global.medicineRoutesData),
        );
      }
      // api/Auth/LoginUser
    } catch (e) {}
  };

  const getMedicineFrequencyData = async () => {
    try {
      let response = await getRequest('Definition/List/DrugFrequency');
      console.warn('response', response);
      if (response.code === 200 && response.data[0]) {
        global.medicineFrequencyData = response.data[0];
        mmkvStorage.set(
          'medicineFrequencyData',
          JSON.stringify(global.medicineFrequencyData),
        );
      }
      // api/Auth/LoginUser
    } catch (e) {}
  };

  const getPatientsData = async () => {
    try {
      console.warn('fetching patients ::');
      global.patientDetails = [];
      if (!global.patientsBackup?.length > 0) {
        global.patientsBackup = [];
      }
      let response = await getRequest(
        `Patient/GetPatientBySiteId?SiteId=${
          siteStore.getSelectedSite()?.SiteId
        }`,
      );
      console.warn(
        'response patients ::',
        response,
        siteStore.getSelectedSite()?.SiteId,
      );
      if (response.code === 200) {
        global.refetchPatients = false;
        if (response.data[0]) {
          let patients = response.data[0];
          patients.sort((a, b) => {
            return moment(b.EnteredOn).diff(moment(a.EnteredOn), 'hours');
          });
          let _patients = [];
          if (patients.length > 100) {
            _patients = patients.slice(0, 5);
            _patients = _patients.map(item => {
              return {
                patient: item,
              };
            });
          } else {
            _patients = patients.map(item => {
              return {
                patient: item,
              };
            });
          }
          if (global.patientsBackup?.length > 0) {
            let filtered = _patients.filter(item => {
              let exists = false;
              for (let i = 0; i < global.patientsBackup.length; i++) {
                if (
                  item.patient.PatientId ===
                  global.patientsBackup[i].patient.PatientId
                ) {
                  exists = true;
                  break;
                }
              }
              return !exists;
            });
            _patients = [...filtered];
            userContext.updatePatientsData([
              ...global.patientsBackup,
              ..._patients,
            ]);
          } else {
            userContext.updatePatientsData([..._patients]);
          }
          setIsLoading(false);
          for (let i = 0; i < _patients.length; i++) {
            let details = await getPatientDetailsById(
              _patients[i].patient.PatientId,
            );
            if (details) {
              global.patientDetails.push(details);
            }
          }
        } else {
          setIsLoading(false);
        }
        // console.warn('patientsresponse', response.data[0]);
        // patientStore.setPatientsData([patientData]);
        // console.warn('new patient', patientData);
        // userContext.updatePatientsData([patientData]);
        // global.diagnosisDropdownData = response.data;
      } else {
        ToastAndroid.show(
          'Unable to fetch patients data. Please try again later',
          ToastAndroid.LONG,
        );
        setIsLoading(false);
      }
    } catch (e) {
      ToastAndroid.show(
        'Unable to fetch patients data. Please try again later',
        ToastAndroid.LONG,
      );
      setIsLoading(false);
      console.warn('err', e);
    }
  };

  const getPatientDetailsById = async (id: number) => {
    try {
      console.warn('fetching patient details');
      let response = await getRequest(`Patient/GetPatientById?PatientId=${id}`);
      if (response.code === 200) {
        if (response.data[0]) {
          let physicalExams = response.data[0].physicalExams;
          let _physicalExams = physicalExams.map(element => {
            let data = [];
            const groupedData = element.Data.reduce((prevValue, item) => {
              const monthKey = item.SectionName;

              if (!prevValue[monthKey]) {
                prevValue[monthKey] = [];
              }

              prevValue[monthKey].push(item);

              return prevValue;
            }, {});

            const dataArray = Object.keys(groupedData).map(monthKey => ({
              title: monthKey,
              data: groupedData[monthKey],
            }));
            data.push(...dataArray);
            return {
              ...element,
              Data: data,
            };
          });
          ///
          let presentingComplain = response.data[0].presentingComplain;
          let _presentingComplain = presentingComplain.map(element => {
            let data = [];
            const groupedData = element.Data.reduce((prevValue, item) => {
              const monthKey = item.SectionName;

              if (!prevValue[monthKey]) {
                prevValue[monthKey] = [];
              }

              prevValue[monthKey].push(item);

              return prevValue;
            }, {});

            const dataArray = Object.keys(groupedData).map(monthKey => ({
              title: monthKey,
              data: groupedData[monthKey],
            }));
            data.push(...dataArray);
            return {
              ...element,
              Data: data,
            };
          });
          return {
            ...response.data[0],
            physicalExams: _physicalExams,
            presentingComplain: _presentingComplain,
          };
        }
      }
      return null;
    } catch (e) {
      console.warn('err fetching details', e);
      return null;
    }
  };

  const checkPatientsDetails = async () => {
    try {
      global.patientDetails = [];
      let patients = userContext.patientsData;
      let filteredPatients = patients.filter(itm => !itm.isDetailFetched);
      if (filteredPatients.length > 0) {
        for (let i = 0; i < filteredPatients.length; i++) {
          let details = await getPatientDetailsById(
            filteredPatients[i].patient.PatientId,
          );
          if (details) {
            global.patientDetails.push(details);
          }
        }
      }
      console.warn('filteredPatients', filteredPatients.length);
    } catch (e) {
      console.warn('err', e);
    }
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

  const toggleDrawer = () => {
    _props.navigation.toggleDrawer();
    if (!open) {
      setOpen(true);
      // drawerRef.current?.openDrawer({speed: 2});
    } else {
      setOpen(false);
      drawerRef.current?.closeDrawer({speed: 2});
    }
  };

  const menuPressed = (sectionIndex: number, itemIndex) => {
    console.log('item.........in press button', itemIndex);
    console.log('item.........in press button', MENU[sectionIndex]);
    const item = MENU[sectionIndex];
    if (item.name == 'Signout') {
      // AsyncStorage.clear();
      logout();
      clearupData();
      _props.navigation.navigate('Landing');
    } else if (item.name == "Today's Patients") {
      _props.navigation.navigate('PatientsTab');
    } else if (item.name == 'Patient Status') {
      _props.navigation.navigate('PatientStatus');
    } else if (item.name == 'Vitals History') {
      _props.navigation.navigate('TodaysPatients');
    } else if (item.name == 'Patients Face Sheet') {
      _props.navigation.navigate('Patient', {screen: 'PatientVitalsHistory'});
    } else if (item.name == 'Scan QR Code') {
      onShowQrCodeScanner();
      // _props.navigation.navigate('TodaysPatients');
    }
    if (open) toggleDrawer();
  };

  const drawerMenuPressed = item => {
    // fetchData();
    console.log('item.drawer menu........in press button', item);
    // _props.navigation.navigate('Patient')
    if (item.name == 'Signout') {
      logout();
      _props.navigation.navigate('Landing');
    } else if (item.name == 'Today Patients') {
      _props.navigation.navigate('PatientsTab', {
        screen: 'TodaysPatients',
        params: {flow: undefined},
      });
    } else if (item.name == 'Patient Status') {
      _props.navigation.navigate('PatientStatus');
    } else if (item.name == 'Patients Face Sheet') {
      _props.navigation.navigate('PatientsTab', {
        screen: 'TodaysPatients',
        params: {flow: 'faceSheet'},
      });
    } else if (item.name == 'Patients SOAP Note') {
      _props.navigation.navigate('PatientsTab', {
        screen: 'TodaysPatients',
        params: {flow: 'SOAPNote'},
      });
    } else if (item.name == 'Patients Vitals') {
      _props.navigation.navigate('PatientsTab', {
        screen: 'TodaysPatients',
        params: {flow: 'Vitals'},
      });
    } else if (item.name == 'Patients Allergies') {
      _props.navigation.navigate('PatientsTab', {
        screen: 'TodaysPatients',
        params: {flow: 'Allergies'},
      });
    } else if (item.name == 'Patients Diagnosis') {
      _props.navigation.navigate('PatientsTab', {
        screen: 'TodaysPatients',
        params: {flow: 'Diagnosis'},
      });
    } else if (item.name == 'Patients Physical Exam') {
      _props.navigation.navigate('PatientsTab', {
        screen: 'TodaysPatients',
        params: {flow: 'Physical Examination'},
      });
    }
    // if (open) toggleDrawer();
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

  const listItemPressed = item => {
    console.log('item.........in press button', item);
    _props.navigation.navigate(item.key);
    toggleDrawer();
  };
  const scrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    listRef.current?.getScrollResponder()?.scrollToEnd();
    timeout.current = setTimeout(
      () =>
        listRef.current?.scrollToLocation({
          animated: true,
          itemIndex: info.index,
          sectionIndex: 0,
        }),
      50,
    );
  };

  useEffect(() => {
    return () => timeout.current && clearTimeout(timeout.current);
  }, []);

  const $drawerInsets = useSafeAreaInsetsStyle(['top']);
  const profilePress = () => {
    // console.log('Profile pressed.......')
  };

  return (
    <>
      <QrCodeScanner
        showQrCodeScanner={showQrCodeScanner}
        onHideQrCodeScanner={onHideQrCodeScanner}
        onSuccess={onQrRead}
      />
      <Loading isLoading={isLoading} />
      <Header
        LeftActionComponent={
          <DrawerIconButton onPress={toggleDrawer} {...{open, progress}} />
        }
        RightActionComponent={<ProfileIconButton onPress={profilePress} />}
      />
      <Screen
        preset="fixed"
        //  safeAreaEdges={["top"]}
        contentContainerStyle={$screenContainer}>
        <Text
          style={{
            paddingHorizontal: '5%',
            color: userContext.clientSocket ? '#0CABF0' : 'black',
          }}>
          {userContext.clientSocket ? 'Connected' : 'Not Connected'}
        </Text>
        <TouchableOpacity onPress={() => userContext.resetConnection()}>
          <Text
            style={{
              paddingHorizontal: '5%',
              color: 'red',
              fontSize: 12,
              alignSelf: 'flex-end',
            }}>
            Reset Connection
          </Text>
        </TouchableOpacity>
        {/* <Text
          style={{
            paddingHorizontal: '5%',
            color: userContext.clientSocket ? '#0CABF0' : 'black',
            marginBottom: 20,
          }}>
          {userContext.clientSocket ? 'Connected' : 'Not Connected'}
        </Text> */}
        {/* <DrawerIconButton onPress={toggleDrawer} {...{ open, progress }} /> */}
        <FlatListIndicator
          indStyle={{
            width: 4,
            marginTop: 6,
            marginRight: 16,
            backgroundColor: '#23AAFA',
          }}
          flatListProps={{
            ref: menuRef,
            contentContainerStyle: $flatListContentContainer,
            numColumns: 2,
            data: MENU.map(d => ({
              name: d.name,
              useCases: d.data.map(u => u.props.name),
            })),
            keyExtractor: item => item.name,
            renderItem: ({item, index: sectionIndex}) => (
              <>
                {item.name !== 'Scan QR Code' && (
                  <MenuButtonListItem
                    {...{item, sectionIndex, menuPressed, drawerMenuPressed}}
                  />
                )}
              </>
            ),
          }}
          // data={Object.values(Homes).map((d) => ({
          //   name: d.name,
          //   useCases: d.data.map((u) => u.props.name),
          // }))}
        />
        {/* <SectionList
            ref={listRef}
            contentContainerStyle={$sectionListContentContainer}
            stickySectionHeadersEnabled={false}
            sections={Object.values(Homes)}
            renderItem={({ item }) => item}
            renderSectionFooter={() => <View style={$homeUseCasesSpacer} />}
            ListHeaderComponent={
              <View style={$heading}>
                <Text preset="heading" tx="HomeScreen.jumpStart" />
              </View>
            }
            onScrollToIndexFailed={scrollToIndexFailed}
            renderSectionHeader={({ section }) => {
              return (
                <View>
                  <Text preset="heading" style={$homeItemName}>
                    {section.name}
                  </Text>
                  <Text style={$homeItemDescription}>{section.description}</Text>
                </View>
              )
            }}
          /> */}
      </Screen>
    </>
  );
};

const $screenContainer: ViewStyle = {
  flex: 1,
  paddingHorizontal: 20,
};

const $drawer: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
};

const $flatListContentContainer: ViewStyle = {
  // paddingHorizontal: 10,
};

const $sectionListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
};

const $heading: ViewStyle = {
  marginBottom: spacing.xxxl,
};

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

const $menuContainer: ViewStyle = {
  paddingBottom: spacing.xs,
  paddingTop: spacing.lg,
};

const $menuButtonContainer: ViewStyle = {
  flex: 1,
  margin: 6,
  borderRadius: 5,
  elevation: 5,
  backgroundColor: colors.background,
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing.lg,
  // width: widthPercentageToDP(40),
  minHeight: 150,
};

const $homeItemName: TextStyle = {
  fontSize: 24,
  marginBottom: spacing.md,
};

const $homeItemDescription: TextStyle = {
  marginBottom: spacing.xxl,
};

const $homeUseCasesSpacer: ViewStyle = {
  paddingBottom: spacing.xxl,
};

// @home remove-file

import React, {FC, useCallback, useContext, useState} from 'react';
import {
  TouchableOpacity,
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  FlatList,
  TextInput,
} from 'react-native';
import {Header, Button, ListItem, Screen, Text, Icon} from '../components';
import {HomeTabScreenProps} from '../navigators/HomeNavigator';
import {spacing, colors, typography} from '../theme';
import {openLinkInBrowser} from '../utils/openLinkInBrowser';
import {isRTL} from '../i18n';
import {useStores} from 'app/models';
import {ageCalculator, calculateFullAge} from 'app/models/helpers/dateHelpers';
import {DrawerIconButton} from './HomeScreen/DrawerIconButton';
import {ProfileIconButton} from './HomeScreen/ProfileIconButton';
import {HeaderBackButton} from './HomeScreen/HeaderBackButton';
import {useFocusEffect} from '@react-navigation/native';
import {UserContext} from 'app/utils/UserContext';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {useSharedValue} from 'react-native-reanimated';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  getDoctorNameFromPatient,
  getPhysicalExamFromPatients,
  getPresentCompFromPatients,
} from 'app/utils/UtilFunctions';
import {isTablet} from 'react-native-device-info';

const chainReactLogo = require('../../assets/images/cr-logo.png');
const reactNativeLiveLogo = require('../../assets/images/rnl-logo.png');
const reactNativeRadioLogo = require('../../assets/images/rnr-logo.png');
const reactNativeNewsletterLogo = require('../../assets/images/rnn-logo.png');

const ADV_SEARCH_DROPDOWN = [
  {
    id: 1,
    label: 'MRN',
    value: 'MRN',
  },
  {
    id: 2,
    label: 'First Name',
    value: 'FirstName',
  },
  {
    id: 3,
    label: 'Last Name',
    value: 'LastName',
  },
  {
    id: 4,
    label: 'Cell No',
    value: 'CellNo',
  },
  {
    id: 5,
    label: 'CNIC',
    value: 'CNIC',
  },
  {
    id: 6,
    label: 'Gender',
    value: 'Gender',
  },
  {
    id: 7,
    label: 'Spouse Name',
    value: 'SpouseName',
  },
];

export const TodaysPatientsScreen: FC<HomeTabScreenProps<'TodaysPatients'>> =
  function TodaysPatientsScreen(_props) {
    const [patient, setPatient] = useState('');
    const {navigation, route} = _props;
    const {patientStore, vitalStore, authenticationStore} = useStores();
    const {patientQueue, patientQueueForList, patientsForList} = patientStore;
    const [isLoading, setIsLoading] = React.useState(false);
    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState('1');
    const [advanceSearch, setAdvanceSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [query, setQuery] = useState('');
    const [loadingPatients, setLoadingPatients] = useState(false);
    const userContext = useContext(UserContext);
    // const [open, setOpen] = useState(false);
    const progress = useSharedValue(0);
    const [advanceSearchDropdownOpen, setAdvanceSearchDropdownOpen] =
      useState(false);

    useFocusEffect(
      useCallback(() => {
        setRefresh(Math.random().toString());
      }, [userContext.refreshData]),
    );

    useFocusEffect(
      useCallback(() => {
        let intervalRef: ReturnType<typeof setInterval>;
        try {
          if (global.receivedPatients?.length > 0) {
            let patients = JSON.parse(JSON.stringify(global.patientsBackup));
            for (let k = 0; k < global.receivedPatients.length; k++) {
              let exists = false;
              for (let i = 0; i < patients.length; i++) {
                console.warn(
                  'exists',
                  global.receivedPatients[k]?.patient.PatientId,
                );
                if (
                  !global.receivedPatients[k].isSyncedLocally &&
                  global.receivedPatients[k]?.patient.PatientId ===
                    patients[i].patient?.PatientId
                ) {
                  patients[i].patient = global.receivedPatients[k].patient;
                  patients[i].patient.isFromNurse = true;
                  if (patients[i].vitals) {
                    patients[i].vitals.push(
                      ...global.receivedPatients[k].vitals,
                    );
                  } else {
                    patients[i].vitals = global.receivedPatients[k].vitals;
                  }
                  if (patients[i].presentingComplain?.length > 0) {
                    //nothing
                  } else {
                    patients[i].presentingComplain = [];
                  }
                  if (patients[i].physicalExams?.length > 0) {
                    //nothing
                  } else {
                    patients[i].physicalExams = [];
                  }
                  global.receivedPatients[k].isSyncedLocally = true;
                  exists = true;
                  break;
                }
              }
              if (!exists && !global.receivedPatients[k].isSyncedLocally) {
                global.receivedPatients[k].isSyncedLocally = true;
                global.receivedPatients[k].physicalExams = [];
                global.receivedPatients[k].presentingComplain = [];
                patients.unshift({
                  ...global.receivedPatients[k],
                  isFromNurse: true,
                });
              }
            }
            userContext.updatePatientsData(patients);
          }
          let incompletePatietns = checkIncompletePatientsCount();
          if (incompletePatietns > 0) {
            setLoadingPatients(true);
            startUpdatingUserDetails();
            intervalRef = setInterval(() => {
              let incompletePatients = checkIncompletePatientsCount();
              if (incompletePatients > 0) {
                startUpdatingUserDetails();
              } else {
                setLoadingPatients(false);
                clearInterval(intervalRef);
              }
            }, 3000);
          } else {
            setLoadingPatients(false);
          }
        } catch (e) {
          console.warn('err', e);
        }
        return () => {
          clearInterval(intervalRef);
        };
      }, []),
    );

    const checkIncompletePatientsCount = () => {
      try {
        let patients = global.patientsBackup;
        let filteredPatients = patients.filter(itm => !itm.isDetailFetched);
        console.warn('filteredPatients', filteredPatients.length);
        return filteredPatients.length ? filteredPatients.length : 0;
      } catch (e) {
        return 0;
      }
    };

    const startUpdatingUserDetails = () => {
      try {
        let dataChanged = false;
        let patientDetails = global.patientDetails;
        let patients = JSON.parse(JSON.stringify(global.patientsBackup));
        for (let i = 0; i < patients.length; i++) {
          if (!patients[i].isDetailFetched) {
            let detailItem = patientDetails.find(
              itm =>
                itm?.patient?.PatientId === patients[i]?.patient?.PatientId,
            );
            if (detailItem) {
              patients[i] = {
                ...detailItem,
                patient: {
                  ...detailItem.patient,
                  MRNNo: detailItem.patient.MRNumber,
                },
                isDetailFetched: true,
              };
            }
          }
        }
        userContext.updatePatientsData(patients);
        // setRefresh(Math.random().toString());
      } catch (e) {}
    };

    const handleSearch = (text: string) => {
      try {
        const formattedQuery = text.toLowerCase();
        const _filteredData = userContext.patientsData.filter(_item => {
          let item = _item.patient;
          if (advanceSearch?.length > 0) {
            // console.warn('inadva ce', advanceSearch);
            switch (advanceSearch) {
              case 'MRN':
                console.log('Search by,.....MRN....', advanceSearch);
                return item.MRNNo.toLowerCase().includes(formattedQuery);
                break;
              case 'FirstName':
                console.log('Search by,.....FirstName....', advanceSearch);
                return item.FirstName.toLowerCase().includes(formattedQuery);
                break;
              case 'LastName':
                console.log('Search by,.....LastName....', advanceSearch);
                return item.LastName.toLowerCase().includes(formattedQuery);
                break;
              case 'CellNo':
                console.log(
                  'Search by,.....CellPhoneNumber....',
                  advanceSearch,
                );
                return item.CellPhoneNumber.toLowerCase().includes(
                  formattedQuery,
                );
                break;
              case 'CNIC':
                console.log('Search by,.....CNIC....', advanceSearch);
                return item.CNIC.toLowerCase().includes(formattedQuery);
                break;
              case 'Gender':
                console.log('Search by,.....Gender....', advanceSearch);
                return item.Gender.toLowerCase().includes(formattedQuery);
                break;
              case 'SpouseName':
                console.log('Search by,.....SpouseName....', advanceSearch);
                return item.SpouseName.toLowerCase().includes(formattedQuery);
                break;
              default:
                return false;
                break;
            }
          } else {
            return item.MRNNo.toLowerCase().includes(formattedQuery);
          }
        });
        // console.warn('filtered', filteredData, advanceSearch);
        setFilteredData(_filteredData);
        setQuery(text);
      } catch (e) {
        setQuery(text);
      }
    };

    function onItemPress(item: any, index: number) {
      try {
        // patientStore.selectAPatient(item);
        let _index = global.patientsBackup.findIndex(
          it => it.patient?.PatientId === item.PatientId,
        );
        console.warn('_index', _index);
        if (route.name === 'SelectAPatient') {
          userContext.updateSelectedPatientIndex(_index);
          navigation.navigate('PatientVitals');
          return;
        }
        userContext.updateSelectedPatientIndex(_index);
        console.warn('route?.params?.flow', route?.params?.flow);
        if (!route?.params?.flow) {
          navigation.navigate('PatientClinicalModules');
          return;
        }
        if (route?.params?.flow === 'faceSheet') {
          navigation.navigate('PatientFaceSheet');
        } else if (route?.params?.flow === 'SOAPNote') {
          navigation.navigate('SoapNote');
        } else {
          navigation.navigate('SoapNote', {flow: route?.params?.flow});
        }
      } catch (e) {}
    }

    const PatientItem = ({title, isDetailFetched, doctorName, index}) => (
      <TouchableOpacity
        onPress={() => onItemPress(title, index)}
        disabled={!isDetailFetched}
        style={{...$patientItemView, opacity: isDetailFetched ? 1 : 0.4}}>
        <View style={$patientItemTitleView}>
          {/* <Text testID="login-heading" preset="bold" style={$patientTitleText}>
            {'T/No: ' + (index + 1)}
          </Text> */}
          <Text testID="login-heading" preset="bold" style={$patientTitleText}>
            {'MRN: ' + title.MRNNo}
          </Text>
        </View>
        <View
          style={{
            ...$patientItemDetailView,
            height: 35,
            alignItems: 'center',
            borderBottomWidth: 2,
            borderColor: '#E2E8F0',
          }}>
          <Text
            testID="login-heading"
            preset="bold"
            style={{maxWidth: '50%', color: '#475569', fontSize: 12}}>
            {title.FirstName + ' ' + title.LastName}
          </Text>
          <Text testID="login-heading" preset="default" style={$patientsText}>
            {
              // item.MRNNo + ' | ' +
              title.Gender + ' | ' + calculateFullAge(title.DOB)
            }
          </Text>
        </View>
        {[{ServiceName: 'Dr Azeem'}].length > 0 ? (
          <View
            style={{
              height: 38,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={$serviceItem}>
              <Text
                testID="login-heading"
                preset="bold"
                style={{color: 'black', fontSize: 12}}>
                {doctorName}
              </Text>
            </View>
          </View>
        ) : null}
      </TouchableOpacity>
    );

    function patientItemPress(title: React.SetStateAction<string>) {
      console.log('-=-=-=-=-=-=-=-=-', title);
      // console.log('-=-=-=-=-=-=-=-=-', patient)
      setPatient(title);
    }

    function addNewPress() {
      navigation.navigate('Profile');
    }

    function advanceSearchPress() {
      navigation.navigate('Patient');
    }

    const backButtonPress = () => {
      navigation.goBack();
    };

    const profilePress = () => {
      // console.log('Profile pressed.......')
    };

    const toggleDrawer = () => {
      navigation.toggleDrawer();
    };

    return (
      <>
        {/* <Header
          LeftActionComponent={
            <HeaderBackButton
              {...{
                title: 'todaysPatientsScreen.todaysPatients',
                navigation: navigation,
              }}
            />
          }
          RightActionComponent={<ProfileIconButton onPress={profilePress} />}
        /> */}
        <Header
          LeftActionComponent={<DrawerIconButton onPress={toggleDrawer} />}
          RightActionComponent={<ProfileIconButton onPress={profilePress} />}
        />
        <Screen
          preset="fixed"
          contentContainerStyle={$container}
          //  safeAreaEdges={["top"]}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: '#A1AEC1',
              height: 38,
              marginHorizontal: 20,
              backgroundColor: 'white',
              // justifyContent: 'center',
              borderRadius: 6,
              // marginBottom: 18,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              value={query}
              style={{
                color: '#94A3B8',
                fontSize: 12,
                fontFamily: typography.primary.normal,
                flex: 1,
                paddingHorizontal: 10,
                justifyContent: 'center',
              }}
              placeholder="Search Patient"
              placeholderTextColor={'#94A3B8'}
              onChangeText={handleSearch}
            />
            <Icon icon="searchIcon" size={23} style={{marginRight: 10}} />
          </View>
          <DropDownPicker
            style={[
              {
                marginVertical: 10,
                width: '90%',
                alignSelf: 'center',
                height: 40,
                marginBottom: 18,
              },
            ]}
            placeholder="Advance Search Filters"
            listMode="MODAL"
            open={advanceSearchDropdownOpen}
            value={advanceSearch}
            items={ADV_SEARCH_DROPDOWN}
            setOpen={setAdvanceSearchDropdownOpen}
            setValue={setAdvanceSearch}
          />
          <View
            style={{
              backgroundColor: '#F3F3F3',
              paddingVertical: 8,
              width: widthPercentageToDP(100),
              paddingHorizontal: 30,
            }}>
            <Text preset="bold" style={{fontSize: 14}}>
              {route.name === 'SelectAPatient'
                ? 'Select A Patient'
                : "Today's Patients"}
            </Text>
          </View>
          {loadingPatients && (
            <Text
              style={{
                textAlign: 'left',
                paddingHorizontal: '5%',
                paddingTop: 8,
                fontSize: 12,
                color: 'grey',
              }}>
              Loading Patients Details ...
            </Text>
          )}
          {/* <Text preset="heading" tx="todaysPatientsScreen.todaysPatients" style={$title} /> */}
          <View style={$patientsListView}>
            <FlatList
              key={refresh}
              data={query?.length > 0 ? filteredData : userContext.patientsData}
              // style={$patientsListView}
              extraData={patientStore.patientsForList}
              renderItem={({item, index}) => (
                <>
                  {item && item.patient ? (
                    item.isDetailFetched ? (
                      true ? (
                        <PatientItem
                          title={item.patient}
                          isDetailFetched={item.isDetailFetched}
                          doctorName={
                            getDoctorNameFromPatient(item)
                              ? getDoctorNameFromPatient(item)
                              : authenticationStore.login
                              ? 'Dr. ' + authenticationStore.login[0]?.FullName
                              : ''
                          }
                          index={index}
                        />
                      ) : item.isFromNurse ? (
                        <PatientItem
                          title={item.patient}
                          isDetailFetched={item.isDetailFetched}
                          doctorName={
                            getDoctorNameFromPatient(item)
                              ? getDoctorNameFromPatient(item)
                              : authenticationStore.login
                              ? 'Dr. ' + authenticationStore.login[0]?.FullName
                              : ''
                          }
                          index={index}
                        />
                      ) : null
                    ) : (
                      <PatientItem
                        title={item.patient}
                        isDetailFetched={item.isDetailFetched}
                        doctorName={
                          getDoctorNameFromPatient(item)
                            ? getDoctorNameFromPatient(item)
                            : authenticationStore.login
                            ? 'Dr. ' + authenticationStore.login[0]?.FullName
                            : ''
                        }
                        index={index}
                      />
                    )
                  ) : null}
                </>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </Screen>
      </>
    );
  };

const $container: ViewStyle = {
  // paddingTop: spacing.lg + spacing.xl,
  // paddingHorizontal: spacing.lg,
  flex: 1,
};

const $title: TextStyle = {
  flex: 0.5,
  marginBottom: spacing.sm,
};

const $patientsListView: ViewStyle = {
  flex: 1,
  // borderWidth: 1,
  width: '100%',
  alignSelf: 'center',
  // backgroundColor: 'red',
  // marginVertical: spacing.sm,
};

const $patientsText: TextStyle = {
  fontSize: 10,
  // padding: spacing.sm,
};

const $buttonsView: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  // alignSelf: 'baseline',
  // position: 'absolute',
  // bottom: 20,
  width: '100%',
};

const $tapButton: ViewStyle = {
  flex: 1,
  margin: spacing.md,
};

const $patientItemView: ViewStyle = {
  elevation: 4,
  marginVertical: spacing.md,
  backgroundColor: colors.background,
  borderRadius: 10,
  marginHorizontal: spacing.lg,
  overflow: 'hidden',
};

const $patientItemTitleView: ViewStyle = {
  flex: 1,
  backgroundColor: '#ECF6F8',
  borderTopRightRadius: 6,
  borderTopLeftRadius: 6,
  padding: spacing.sm,
  // borderWidth: 0.25,
  elevation: 0,
  // flexDirection: 'row',
  // justifyContent: 'space-around',
};

const $patientTitleText: TextStyle = {
  fontSize: 12,
  color: colors.themeText,
  // paddingHorizontal: spacing.sm
};

const $serviceItem: ViewStyle = {
  // flex: 1,
  height: 26,
  justifyContent: 'center',
  paddingHorizontal: 10,
  // alignItems: 'center',
  backgroundColor: '#F9F09D',
  // margin: '2%',
  borderRadius: 5,
  width: isTablet() ? '98%' : '90%',
};

const $patientItemDetailView: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  // borderBottomRightRadius: 6,
  // borderWidth: 0.25,
  // borderBottomLeftRadius: 6,
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: spacing.sm,
};

// @home remove-file

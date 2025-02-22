import React, {FC, useContext, useState} from 'react';
import {
  View,
  ViewStyle,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ToastAndroid,
} from 'react-native';
import {Header, Screen, Text, Profile, Icon} from '../components';
import {PatientStackScreenProps} from 'app/navigators';
import {spacing, typography} from '../theme';
import {useStores} from 'app/models';
import {ProfileIconButton} from './HomeScreen/ProfileIconButton';
import {HeaderBackButton} from './HomeScreen/HeaderBackButton';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {DrawerIconButton} from './HomeScreen/DrawerIconButton';
import {UserContext} from 'app/utils/UserContext';
import moment from 'moment';
import {isTablet} from 'react-native-device-info';

let initialState = [
  {
    icon: 'pulseIcon',
    title: 'Pulse',
    value: '',
    unit: 'BPM',
    bgColor: '#F4F4F4',
  },
  {
    icon: 'tempIcon',
    title: 'Temp',
    value: '',
    unit: 'F',
    bgColor: '#F4F4F4',
  },
  {
    icon: 'bpSysIcon',
    title: 'BP Systolic',
    value: '',
    unit: 'mmHg',
    bgColor: '#FFE7DF',
  },
  {
    icon: 'sp02Icon',
    title: 'SpO2',
    value: '',
    unit: '%',
    bgColor: '#F4F4F4',
  },
  {
    icon: 'bpDia',
    title: 'BP Diastolic',
    value: '',
    unit: 'mmHg',
    bgColor: '#E0FFDB',
  },
  {
    icon: 'weightIcon',
    title: 'Weight',
    value: '',
    unit: 'KG',
    bgColor: '#F4F4F4',
  },
  {
    icon: 'bmiIcon',
    title: 'BMI',
    value: '',
    unit: 'kg/m*m',
    bgColor: '#F4F4F4',
  },
  {
    icon: 'heightIcon',
    title: 'Height',
    value: '',
    unit: 'F',
    bgColor: '#F4F4F4',
  },
  {
    icon: 'waistCircumIcon',
    title: 'Waist Circumference',
    value: '',
    unit: 'CM',
    bgColor: '#F4F4F4',
  },
];
export const PatientHistory: FC<
  PatientStackScreenProps<'PatientVitalsHistory'>
> = function PatientVitalsHistoryScreen(_props) {
  const {flow} = _props.route?.params || {};
  const routeName = _props.route?.name;
  const [vitalsData, setVitalsData] = useState(
    JSON.parse(JSON.stringify(initialState)),
  );
  const [selectedPatientLIndex, setSelectedPatientLIndex] = useState(-1);
  const [vitalActiveEditIndex, setVitalActiveEditIndex] = useState(-1);
  const [patient, setPatient] = useState('');
  const userContext = useContext(UserContext);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showVitalDetails, setShowVitalDetails] = useState(false);
  const {navigation} = _props;
  const {patientStore, vitalStore, fieldStore, authenticationStore} =
    useStores();
  const {
    patientQueue,
    patientQueueForList,
    patientsForList,
    getSelectedPatient,
  } = patientStore;
  const [currentPatient, setCurrentPatient] = useState(getSelectedPatient());
  // const [user, setUser] = useState(authenticationStore.login);
  function onItemPress(item: any) {
    console.log('-=-=-=-=-=-=-=', item);
    // patientStore.selectAPatient(item)
    // navigation.navigate('Patient')
  }

  function onVitalHistoryPress() {
    fieldStore.fetchFields();
    navigation.navigate('EditVitals');
  }

  const profilePress = () => {
    // console.log('Profile pressed.......')
  };

  const toggleDrawer = () => {
    navigation.toggleDrawer();
    // console.log('Profile pressed.......')
  };

  const onEditPressed = (index: number) => {
    try {
      if (vitalActiveEditIndex === index) {
        ///
        let prevData = [...userContext.patientsData];
        let _vitals = prevData[userContext.selectedPatientIndex]?.vitals;
        let tempVitalsData = [...vitalsData];
        let isPrevVitalUpdated = false;

        for (let i = 0; i < _vitals[selectedIndex]?.Data.length; i++) {
          if (
            _vitals[selectedIndex]?.Data[i].Name === tempVitalsData[index].title
          ) {
            _vitals[selectedIndex].Data[i].Value = tempVitalsData[index].value;
            isPrevVitalUpdated = true;
            break;
          }
        }
        if (!isPrevVitalUpdated) {
          _vitals[selectedIndex]?.Data.push({
            Name: tempVitalsData[index].title,
            Value: tempVitalsData[index].value,
            Unit: tempVitalsData[index].unit,
          });
        }
        userContext.updatePatientsData([...userContext.patientsData]);
        setVitalActiveEditIndex(-1);
      } else {
        setVitalActiveEditIndex(index);
      }
    } catch (e) {}
  };

  const onVitalChange = (val: string) => {
    let _vitalsData = [...vitalsData];
    _vitalsData[vitalActiveEditIndex].value = val;
    setVitalsData(_vitalsData);
  };

  return (
    <>
      <Header
        LeftActionComponent={<DrawerIconButton onPress={toggleDrawer} />}
        RightActionComponent={<ProfileIconButton onPress={profilePress} />}
        showBackToSoapNote={routeName !== 'PatientVitals'}
        onGoBack={() => {
          if (showVitalDetails) {
            setShowVitalDetails(false);
          } else {
            _props.navigation.goBack();
          }
        }}
      />
      <View
        style={{
          backgroundColor: '#F3F3F3',
          paddingVertical: 6,
          width: widthPercentageToDP(100),
          paddingHorizontal: 30,
        }}>
        <Text preset="bold" style={{fontSize: 14}}>
          {flow === 'soapNote'
            ? 'Vital History'
            : routeName === 'PatientVitals'
            ? 'Patient Vitals'
            : 'History'}
        </Text>
      </View>
      <Screen
        preset="fixed"
        contentContainerStyle={$container}
        // safeAreaEdges={["top"]}
      >
        <ScrollView>
          <Profile
            currentPatient={
              userContext.patientsData[userContext.selectedPatientIndex]
                ?.patient
            }
          />
          {showVitalDetails ? (
            <View
              style={{
                backgroundColor: 'white',
                borderTopWidth: 0.5,
                borderBottomWidth: 0.5,
                borderColor: '#56B4FF',
                alignItems: 'center',
                paddingTop: 6,
                paddingHorizontal: 4,
              }}>
              <FlatList
                // horizontal
                key={'2'}
                numColumns={2}
                data={vitalsData}
                columnWrapperStyle={{justifyContent: 'space-between'}}
                renderItem={({item, index}) => (
                  <View
                    style={{
                      // height: 36,
                      backgroundColor: item.bgColor,
                      borderRadius: 3,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: index === 8 ? '99.5%' : '49%',
                      marginBottom: 5,
                      paddingHorizontal: 10,
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        width: '86%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingBottom: 4,
                      }}>
                      <Icon
                        icon={item.icon}
                        size={
                          isTablet()
                            ? widthPercentageToDP(2)
                            : widthPercentageToDP(5)
                        }
                      />
                      <View style={{marginLeft: widthPercentageToDP(1)}}>
                        <Text
                          //   preset=""
                          style={{
                            paddingTop: 8,
                            color: 'black',
                            fontSize: isTablet()
                              ? 12
                              : widthPercentageToDP(2.6),
                            width:
                              item.title === 'Waist Circumference'
                                ? widthPercentageToDP(55)
                                : widthPercentageToDP(25),
                            lineHeight: 10,
                            fontFamily: typography.primary.normal,
                            paddingLeft: 3,
                          }}>
                          {item.title} ({item.unit})
                        </Text>
                        {/* <Text
                       preset="bold"
                       style={{
                         color: 'black',
                         fontSize: 10,
                         lineHeight: 16,
                       }}>
                       {item.value}
                     </Text> */}
                        <TextInput
                          editable={vitalActiveEditIndex === index}
                          value={item.value}
                          placeholder="Enter"
                          placeholderTextColor={'grey'}
                          maxLength={6}
                          style={{
                            color: 'black',
                            fontSize: 10,
                            // lineHeight: 16,
                            fontFamily: typography.primary.bold,
                            height: 20,
                            paddingVertical: 0,
                          }}
                          onChangeText={onVitalChange}
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => onEditPressed(index)}
                      style={{height: 20, width: 18}}>
                      <Icon
                        icon={
                          vitalActiveEditIndex === index ? 'check' : 'editIcon'
                        }
                        size={18}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          ) : (
            <View style={$patientsListView}>
              <FlatList
                key={'1'}
                scrollEnabled={false}
                data={
                  userContext.patientsData[userContext.selectedPatientIndex]
                    ?.vitals
                }
                ListHeaderComponent={() => (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 6,
                      borderBottomWidth: 1,
                      borderColor: '#DBDADE',
                    }}>
                    <Text
                      preset="bold"
                      style={{
                        fontSize: 12,
                        color: 'black',
                        width: '48%',
                        textAlign: 'center',
                      }}>
                      Doctor
                    </Text>
                    <Text
                      preset="bold"
                      style={{
                        fontSize: 12,
                        // marginLeft: 12,
                        color: 'black',
                        width: '48%',
                        textAlign: 'center',
                      }}>
                      Date
                    </Text>
                  </View>
                )}
                renderItem={({item, index}) => (
                  <View style={{}}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedIndex(index);
                      }}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderBottomWidth: 1,
                        borderColor:
                          index === selectedIndex ? '#56B4FF' : '#DBDADE',
                        paddingVertical: 6,
                        backgroundColor:
                          index === selectedIndex ? '#EFFBFF' : 'white',
                        borderLeftWidth: index === selectedIndex ? 2 : 0,
                        borderRightWidth: index === selectedIndex ? 2 : 0,
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          paddingLeft: '10%',
                          color: 'black',
                          width: '48%',
                        }}>
                        {item.NurseName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          marginLeft: 12,
                          color: 'black',
                          width: '48%',
                          textAlign: 'center',
                        }}>
                        {moment(item.VitalDate)
                          ? moment(item.VitalDate).format('YYYY-MM-DD')
                          : ''}
                      </Text>
                      {/* {index === selectedIndex && (
                        <Icon
                          icon="addNote"
                          size={18}
                          style={{
                            // backgroundColor: 'red',
                            position: 'absolute',
                            right: 6,
                            zIndex: 3,
                          }}
                        />
                      )} */}
                    </TouchableOpacity>
                  </View>
                )}
                // keyExtractor={item => item.PatientId}
              />
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                try {
                  if (showVitalDetails) {
                    setShowVitalDetails(false);
                    return;
                  }
                  if (selectedIndex !== -1) {
                    let _vitals =
                      userContext.patientsData[userContext.selectedPatientIndex]
                        ?.vitals[selectedIndex]?.Data;
                    let newVitalsData = JSON.parse(
                      JSON.stringify(initialState),
                    );
                    vitalsData.forEach((item, index) => {
                      for (let i = 0; i < _vitals.length; i++) {
                        if (_vitals[i].Name === item.title) {
                          newVitalsData[index].value = _vitals[i].Value;
                          newVitalsData[index].unit = _vitals[i].Unit;
                          break;
                        }
                      }
                    });
                    setVitalsData(newVitalsData);
                    setShowVitalDetails(true);
                  } else {
                    ToastAndroid.show(
                      'Please select an item',
                      ToastAndroid.LONG,
                    );
                  }
                } catch (e) {
                  console.warn('err', e);
                }
              }}
              style={{
                height: 42,
                width: '68%',
                backgroundColor: '#2196F3',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 9.5,
                marginBottom: 6,
                borderRadius: 4,
              }}>
              <Text preset="bold" style={{color: 'white', fontSize: 14}}>
                {showVitalDetails ? 'GO BACK' : 'VIEW / EDIT'}
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={{
                height: 42,
                width: '48%',
                backgroundColor: '#48BD69',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 9.5,
                marginBottom: 6,
                borderRadius: 4,
              }}>
              <Text preset="bold" style={{color: 'white', fontSize: 14}}>
                GRAPHS
              </Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </Screen>
    </>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: spacing.lg,
  flex: 1,
};

const $patientsListView: ViewStyle = {
  width: '92%',
  borderWidth: 1.5,
  borderColor: '#DBDADE',
  alignSelf: 'center',
  //   backgroundColor: 'red',
};

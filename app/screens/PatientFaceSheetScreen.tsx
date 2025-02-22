import React, {FC, useContext, useState} from 'react';
import {View, ViewStyle, FlatList, TouchableOpacity} from 'react-native';
import {Header, Screen, Text, Profile, Icon} from '../components';
import {PatientStackScreenProps} from 'app/navigators';
import {spacing} from '../theme';
import {useStores} from 'app/models';
import {ProfileIconButton} from './HomeScreen/ProfileIconButton';
import {HeaderBackButton} from './HomeScreen/HeaderBackButton';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {DrawerIconButton} from './HomeScreen/DrawerIconButton';
import {UserContext} from 'app/utils/UserContext';
import {isTablet} from 'react-native-device-info';

export const PatientFaceSheetScreen: FC<
  PatientStackScreenProps<'PatientVitalsHistory'>
> = function PatientVitalsHistoryScreen(_props) {
  const userContext = useContext(UserContext);
  const faceSheetData = [
    {title: 'Presenting Complaint', icon: 'faceSheetHeartIcon'},
    {title: 'Allergies', icon: 'faceSheetAllergyIcon'},
    {title: 'Vitals', icon: 'faceSheetHeartIcon'},
    {title: 'Physical Examination', icon: 'faceSheetHeartIcon'},
    {title: 'Diagnosis', icon: 'faceSheetHeartIcon'},
    {title: 'Order Investigations', icon: 'faceSheetHeartIcon'},
    {title: 'Medications', icon: 'faceSheetHeartIcon'},
  ];
  const [patient, setPatient] = useState('');
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
    _props.navigation.toggleDrawer();
    // console.log('Profile pressed.......')
  };

  const onItemPressed = (item: {title: string; icon: string}) => {
    _props.navigation.navigate('SoapNote', {flow: item.title});
  };

  return (
    <>
      <Header
        LeftActionComponent={<DrawerIconButton onPress={toggleDrawer} />}
        RightActionComponent={<ProfileIconButton onPress={profilePress} />}
      />
      <Screen
        preset="fixed"
        contentContainerStyle={$container}
        // safeAreaEdges={["top"]}
      >
        <Profile
          currentPatient={
            userContext.patientsData[userContext.selectedPatientIndex]?.patient
          }
        />
        <View style={$patientsListView}>
          <Text
            preset="bold"
            style={{
              fontSize: 16,
              marginTop: 18,
              textAlign: 'center',
              marginBottom: 10,
              color: '#009FFF',
            }}>
            Face Sheet
          </Text>
          <FlatList
            data={faceSheetData}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  onItemPressed(item);
                }}
                style={{
                  flexDirection: 'row',
                  marginBottom: 10,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#F4F4F4',
                    // height: 36,
                    paddingVertical: 6,
                    width: isTablet()
                      ? widthPercentageToDP(82)
                      : widthPercentageToDP(71),
                    marginLeft: widthPercentageToDP(4),
                    borderRadius: 6,
                  }}>
                  <Icon icon={item.icon} size={16} style={{marginLeft: 8}} />
                  <Text
                    preset="bold"
                    style={{
                      fontSize: 12,
                      marginLeft: 10,
                      color: 'black',
                      width: '90%',
                    }}>
                    {item.title}
                  </Text>
                </View>
                <Icon
                  icon={'faceSheetaddIcon'}
                  size={isTablet() ? 20 : widthPercentageToDP(7)}
                  style={{marginLeft: widthPercentageToDP(2)}}
                />
              </TouchableOpacity>
            )}
            // keyExtractor={item => item.PatientId}
          />
        </View>
      </Screen>
    </>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: spacing.lg,
  flex: 1,
};

const $patientsListView: ViewStyle = {
  width: '100%',
  // height: ,
  // flex: 1,/
  alignSelf: 'center',
  backgroundColor: 'white',
  elevation: 8,
  marginBottom: 30,
  borderRadius: 12,
};

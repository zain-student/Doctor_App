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

const chainReactLogo = require('../../assets/images/cr-logo.png');
const reactNativeLiveLogo = require('../../assets/images/rnl-logo.png');
const reactNativeRadioLogo = require('../../assets/images/rnr-logo.png');
const reactNativeNewsletterLogo = require('../../assets/images/rnn-logo.png');

export const SelectPatientScreen: FC<HomeTabScreenProps<'TodaysPatients'>> =
  function SelectPatientScreen(_props) {
    const [patient, setPatient] = useState('');
    const {navigation, route} = _props;
    const {patientStore, vitalStore} = useStores();
    const {patientQueue, patientQueueForList, patientsForList} = patientStore;
    const [isLoading, setIsLoading] = React.useState(false);
    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState('1');
    const userContext = useContext(UserContext);
    // const [open, setOpen] = useState(false);
    const progress = useSharedValue(0);

    useFocusEffect(
      useCallback(() => {
        setRefresh(Math.random().toString());
      }, [userContext.refreshData]),
    );

    function onItemPress(item: any) {
      console.log('-=-=-=-=-=-=-=', item);
      patientStore.selectAPatient(item);
      {
        (async function load() {
          setIsLoading(true);
          await vitalStore.fetchVitals(item.PatientId);
          setIsLoading(false);
        })();
      }
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
    }

    const PatientItem = ({title, index}) => (
      <TouchableOpacity
        onPress={() => onItemPress(title)}
        style={$patientItemView}>
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
            {title.FirstName}
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
            style={[
              $patientItemDetailView,
              {flexDirection: 'column', height: 35, justifyContent: 'center'},
            ]}>
            <FlatList
              data={[{ServiceName: 'Dr Azeem'}]}
              // style={$patientsListView}
              numColumns={2}
              extraData={title.Services}
              renderItem={({item}) => {
                return (
                  <View style={$serviceItem}>
                    <Text
                      testID="login-heading"
                      preset="bold"
                      style={{color: 'black', fontSize: 12}}>
                      {item.ServiceName}
                    </Text>
                    {/* <Text testID="login-heading" 
                    style={$patientsText}
                  >
                  {item.Charges }
                  </Text>  */}
                  </View>
                );
              }}
              keyExtractor={item => item.ServiceId}
            />
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
              marginBottom: 18,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
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
            />
            <Icon icon="downIcon" size={13} style={{marginRight: 10}} />
          </View>
          <View
            style={{
              backgroundColor: '#F3F3F3',
              paddingVertical: 8,
              width: widthPercentageToDP(100),
              paddingHorizontal: 30,
            }}>
            <Text preset="bold" style={{fontSize: 14}}>
              Today's Patients
            </Text>
          </View>
          {/* <Text preset="heading" tx="todaysPatientsScreen.todaysPatients" style={$title} /> */}
          <View style={$patientsListView}>
            <FlatList
              key={refresh}
              data={patientStore.patientsForList}
              // style={$patientsListView}
              extraData={patientStore.patientsForList}
              renderItem={({item, index}) => (
                <PatientItem title={item} index={index} />
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
  flex: 1,
  height: 22,
  justifyContent: 'center',
  paddingHorizontal: 10,
  // alignItems: 'center',
  backgroundColor: '#F9F09D',
  // margin: '2%',
  borderRadius: 5,
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

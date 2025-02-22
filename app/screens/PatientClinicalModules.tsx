import React, {FC, useContext, useState} from 'react';
import {
  TouchableOpacity,
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  FlatList,
} from 'react-native';
import {
  Header,
  Button,
  ListItem,
  Screen,
  Text,
  Profile,
  Icon,
} from '../components';
import {HomeTabScreenProps} from '../navigators/HomeNavigator';
import {PatientStackScreenProps} from 'app/navigators';
import {spacing, colors} from '../theme';
import {openLinkInBrowser} from '../utils/openLinkInBrowser';
import {isRTL} from '../i18n';
import {useStores} from 'app/models';
import {ageCalculator, calculateFullAge} from 'app/models/helpers/dateHelpers';
import {formatDate} from 'app/utils/formatDate';
import {ProfileIconButton} from './HomeScreen/ProfileIconButton';
import {HeaderBackButton} from './HomeScreen/HeaderBackButton';
import {DrawerIconButton} from './HomeScreen/DrawerIconButton';
import {FlatListIndicator} from '@fanchenbao/react-native-scroll-indicator';
import {UserContext} from 'app/utils/UserContext';

export const PatientClinicalModules: FC<
  PatientStackScreenProps<'PatientVitalsHistory'>
> = function PatientVitalsHistoryScreen(_props) {
  const listItems = [
    {
      id: 1,
      name: 'Face Sheet',
      data: [],
      icon: 'button_face',
    },
    {
      id: 2,
      name: 'SOAP Note',
      data: [],
      icon: 'button_soap',
    },
    {
      id: 3,
      name: 'Allergies',
      data: [],
      icon: 'button_allergies',
    },
    {
      id: 4,
      name: 'Vitals',
      data: [],
      icon: 'button_vitals',
    },
    {
      id: 5,
      name: 'Physical Examination',
      data: [],
      icon: 'button_exam',
    },
    {
      id: 6,
      name: 'Diagnosis',
      data: [],
      icon: 'button_diagnosis',
    },
    {
      id: 9,
      name: 'Order Investigations',
      data: [],
      icon: 'investigationIcon',
    },
    {
      id: 10,
      name: 'Medications',
      data: [],
      icon: 'medicationsIcon',
    },
  ];

  const userContext = useContext(UserContext);
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
  // const [currentPatient, setCurrentPatient] = useState(getSelectedPatient());
  function onItemPress(item: any) {
    console.log('-=-=-=-=-=-=-=', item);
    // patientStore.selectAPatient(item)
    // navigation.navigate('Patient')
  }

  const MenuButtonListItem = ({item, drawerMenuPressed}) => {
    if (item.name !== 'Signout') {
      return (
        <TouchableOpacity
          onPress={() => drawerMenuPressed(item)}
          style={$menuButtonContainer}>
          <Icon
            icon={item.icon}
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
            preset="bold">
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  function patientItemPress(title: React.SetStateAction<string>) {
    console.log('-=-=-=-=-=-=-=-=-', title);
    console.log('-=-=-=-=-=-=-=-=-', patient);
    setPatient(title);
  }

  function addNewPress() {
    fieldStore.fetchFields();
    navigation.navigate('AddNewVitals');
  }

  const drawerMenuPressed = item => {
    if (item.name == 'Face Sheet') {
      _props.navigation.navigate('PatientFaceSheet');
    } else if (item.name == 'SOAP Note') {
      _props.navigation.navigate('SoapNote');
    } else {
      _props.navigation.navigate('SoapNote', {flow: item.name});
    }
  };

  const toggleDrawer = () => {
    _props.navigation.toggleDrawer();
    // console.log('Profile pressed.......')
  };

  const profilePress = () => {};

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
        {/* <Text preset="heading" tx="vitalsHistoryScreen.vitalsHistoryScreen" style={$title} /> */}
        <View style={$patientsListView}>
          <FlatListIndicator<{name: string; useCases: string[]}>
            indStyle={{
              width: 4,
              // marginLeft: 10,
              backgroundColor: '#23AAFA',
            }}
            flatListProps={{
              renderItem: ({item, index: sectionIndex}) => (
                <>
                  {item.name !== 'Scan QR Code' && (
                    <MenuButtonListItem
                      {...{item, sectionIndex, drawerMenuPressed}}
                    />
                  )}
                </>
              ),
              numColumns: 2,
              data: listItems,
              contentContainerStyle: $flatListContentContainer,
            }}
            // contentContainerStyle={$flatListContentContainer}
            // data={Object.values(Homes).map((d) => ({
            //   name: d.name,
            //   useCases: d.data.map((u) => u.props.name),
            // }))}
            // numColumns={2}
            // data={listItems}
            // keyExtractor={item => item.name}
          />
        </View>
      </Screen>
    </>
  );
};

const $container: ViewStyle = {
  // paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
  flex: 1,
};

const $flatListContentContainer: ViewStyle = {
  paddingRight: 6,
};

const $patientsListView: ViewStyle = {
  flex: 6,
  // height: 200,
  // borderWidth: 1,
  width: '100%',
  alignSelf: 'center',
  // marginVertical: spacing.sm,
};

const $menuButtonContainer: ViewStyle = {
  flex: 1,
  marginHorizontal: 6,
  // marginRight: 16,
  marginBottom: 31,
  borderRadius: 5,
  elevation: 5,
  backgroundColor: colors.background,
  alignItems: 'center',
  justifyContent: 'center',
  // padding: spacing.lg,
  // paddingHorizontal: 44,
  // width: widthPercentageToDP(40),
  minHeight: 150,
};

const $grayBackgroundText: TextStyle = {
  flex: 1,
  borderRadius: 5,
  width: '100%',
  backgroundColor: colors.themeLightGray,
  textAlignVertical: 'center',
  margin: spacing.xs,
  paddingStart: spacing.xs,
};

const $buttonsView: ViewStyle = {
  flex: 1,
  width: '100%',
  marginBottom: 60,
};

const $tapButton: ViewStyle = {
  flex: 1,
  margin: spacing.md,
};

const $patientItemView: ViewStyle = {
  elevation: 8,
  marginVertical: spacing.md,
  backgroundColor: colors.background,
  borderRadius: 10,
  // flex: 2,
  // elevation: 10,
  // borderWidth: 1,
  // margin: spacing.md,
  // backgroundColor: colors.background,
  // borderRadius: 20,
  // padding: '4%',
  // paddingVertical: '6%',
  // borderColor: colors.palette.accent500
};

const $patientItemTitleView: ViewStyle = {
  flex: 1,
  // backgroundColor: colors.themeColorLight,
  borderTopRightRadius: 6,
  borderTopLeftRadius: 6,
  padding: spacing.sm,
  borderWidth: 0.25,
  elevation: 0,
};

const $patientTitleText: TextStyle = {
  // paddingHorizontal: spacing.sm
};

const $serviceItem: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: colors.palette.accent200,
  margin: '2%',
  paddingHorizontal: '4%',
  borderRadius: 5,
};

const $patientItemDetailView: ViewStyle = {
  height: 50,
  backgroundColor: colors.background,
  // borderBottomRightRadius: 6,
  borderWidth: 0.25,
  // borderBottomLeftRadius: 6,
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: spacing.sm,
  alignItems: 'center',
};

const $patientItemGrayViewStyle: ViewStyle = {
  height: 50,
  backgroundColor: colors.background,
  // borderBottomRightRadius: 6,
  borderWidth: 0.25,
  // borderBottomLeftRadius: 6,
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: spacing.xxxs,
  // alignItems: 'center'
};

// @home remove-file

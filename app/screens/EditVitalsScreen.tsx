import React, { FC, useState, useEffect } from "react"
import {
  TouchableOpacity,
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  FlatList,
} from "react-native"
import { Header, TextField, Button, ListItem, Screen, Text, Profile } from "../components"
import { HomeTabScreenProps } from "../navigators/HomeNavigator"
import { PatientStackScreenProps } from "app/navigators"
import { spacing, colors } from "../theme"
import { openLinkInBrowser } from "../utils/openLinkInBrowser"
import { isRTL } from "../i18n"
import { useStores } from "app/models"
import { ageCalculator, calculateFullAge } from "app/models/helpers/dateHelpers"
import { formatDate } from "app/utils/formatDate"
import { ScrollView } from "react-native-gesture-handler"
import { format } from "date-fns"
import { HeaderBackButton } from "./HomeScreen/HeaderBackButton"
import { ProfileIconButton } from "./HomeScreen/ProfileIconButton"

const chainReactLogo = require("../../assets/images/cr-logo.png")
const reactNativeLiveLogo = require("../../assets/images/rnl-logo.png")
const reactNativeRadioLogo = require("../../assets/images/rnr-logo.png")
const reactNativeNewsletterLogo = require("../../assets/images/rnn-logo.png")

const PATIENTS = [
  {
    patientId: 1,
    firstName: "M. ",
    lastName: "Ali",
    mrn: "123456789",
    gender: "Male",
    age: "35Y|3M",
  },
  {
    patientId: 2,
    firstName: "M. ",
    lastName: "Ali",
    mrn: "123456789",
    gender: "Male",
    age: "35Y|3M",
  },
  {
    patientId: 3,
    firstName: "M. ",
    lastName: "Ali",
    mrn: "123456789",
    gender: "Male",
    age: "35Y|3M",
  },
  {
    patientId: 4,
    firstName: "M. ",
    lastName: "Ali",
    mrn: "123456789",
    gender: "Male",
    age: "35Y|3M",
  },
  {
    patientId: 5,
    firstName: "M. ",
    lastName: "Ali",
    mrn: "123456789",
    gender: "Male",
    age: "35Y|3M",
  },
  {
    patientId: 6,
    firstName: "M. ",
    lastName: "Ali",
    mrn: "123456789",
    gender: "Male",
    age: "35Y|3M",
  },
  {
    patientId: 7,
    firstName: "M. ",
    lastName: "Ali",
    mrn: "123456789",
    gender: "Male",
    age: "35Y|3M",
  },
  {
    patientId: 8,
    firstName: "M. ",
    lastName: "Ali",
    mrn: "123456789",
    gender: "Male",
    age: "35Y|3M",
  },
  {
    patientId: 9,
    firstName: "M. ",
    lastName: "Ali",
    mrn: "123456789",
    gender: "Male",
    age: "35Y|3M",
  },
  {
    patientId: 10,
    firstName: "M. ",
    lastName: "Ali",
    mrn: "123456789",
    gender: "Male",
    age: "35Y|3M",
  },
]

export const EditVitalsScreen: FC<PatientStackScreenProps<"EditVitals">> =
  function EditVitalsScreen(_props) {
    const [patient, setPatient] = useState("")
    const { navigation } = _props
    const { patientStore, vitalStore, fieldStore } = useStores()
    const { getSelectedPatient } = patientStore
    const [currentPatient, setCurrentPatient] = useState(getSelectedPatient())
    const [vitals, setVitals] = useState(currentPatient[0].Vitals[0])

    const [fields, setFields] = useState(fieldStore.fieldsForList)
    const [values, setValues] = useState({ ...vitals })
    const [nursingNote, setNursingNote] = useState(currentPatient[0].NursingNote)

    // useEffect(() => {
    //   console.log("vitals.....vitals...", vitals)
    //   console.log("Values.........", values)
    //   const valObj = values
    //   const keys = Object.keys(vitals)
    //   console.log("keys.........", keys)
    //   for (let i = 0; i < keys.length; i++) {
    //     valObj[keys[i]] = vitals[keys[i]]
    //   }
    //   console.log("final object.....", valObj)
    //   setValues(valObj)
    //   console.log("values......", values)
    // }, [])

    // useEffect(() => {
    //   const valObj = values
    //   const keys = Object.keys(vitals)

    //   for (let i = 0; i < keys.length; i++) {
    //     valObj[keys[i]] = vitals[keys[i]]
    //   }

    //   setValues(valObj)
    // }, [])

    // useEffect(() => {
    //   const newValues = { ...values }
    //   const keys = Object.keys(vitals)

    //   for (let i = 0; i < keys.length; i++) {
    //     newValues[keys[i]] = vitals[keys[i]]
    //   }

    //   setValues(newValues)
    // }, [values])

    // simulate a longer refresh, if the refresh is too fast for UX
    async function manualRefresh() {
      setRefreshing(true)
      await Promise.all([siteStore.fetchSites(), delay(750)])
      setRefreshing(false)
    }

    function onItemPress(item: any) {
      console.log("-=-=-=-=-=-=-=", item)
      // patientStore.selectAPatient(item)
      // navigation.navigate('Patient')
    }

    const PatientItem = ({ title }) => (
      <TouchableOpacity
        // onPress={()=>onItemPress(title)}
        style={$patientItemView}
      >
        <View style={$patientItemTitleView}>
          <Text testID="login-heading" preset="bold" style={$patientTitleText}>
            {title.Name ? title.Name : " "}
          </Text>
        </View>
        <Text
          testID="login-heading"
          preset="bold"
          style={[$patientsText, { color: colors.palette.primary600 }]}
        >
          {"Reading: "}
          {title.Reading ? title.Reading + " " + title.Unit : ""}
        </Text>
        <Text
          testID="login-heading"
          preset="bold"
          style={[$patientsText, { color: colors.palette.primary600 }]}
        >
          {"Reading By: "}
          {title.NurseName ? title.NurseName : ""}
        </Text>
        <Text
          testID="login-heading"
          preset="bold"
          style={[$patientsText, { color: colors.palette.primary600 }]}
        >
          {"Reading On: "}
          {title.Date ? formatDate(title.Date) : ""}
        </Text>
        <Text
          testID="login-heading"
          preset="bold"
          style={[$patientsText, { color: colors.palette.primary600 }]}
        >
          {"Reading Time: "}
          {title.Time ? title.Time : ""}
        </Text>
        {/* <Text testID="login-heading" 
          preset="bold" 
          style={$patientsText}
          >
          {
          // title.MRNNo + ' | ' +
           title.Gender + ' | ' + calculateFullAge(title.DOB)}
        </Text> */}
      </TouchableOpacity>
    )

    function patientItemPress(title: React.SetStateAction<string>) {
      console.log("-=-=-=-=-=-=-=-=-", title)
      console.log("-=-=-=-=-=-=-=-=-", patient)
      setPatient(title)
    }

    function savePressed() {
      console.log("Vitals list.....", values)
      console.log("Vitals list.....", nursingNote)

      patientStore.addVitals(values)
      patientStore.addNursingNote(nursingNote)
      const currentDateTime = format(new Date(), "dd-MM-yyyy hh:mm a")

      patientStore.addVitalsTimeTime(currentDateTime)
      // console.log('-=-=-==--=-=-=-=-', patientStore.getSelectedPatient())
      patientStore.getSelectedPatient.length > 0 &&
        patientStore.deselectPatient(patientStore.getSelectedPatient[0])

      navigation.navigate("Home")
    }

    function advanceSearchPress() {
      navigation.navigate("Patient")
    }

    const updateValues = (field, newValue) => {
      const newValues = { ...values }
      newValues[field] = newValue
      console.log("newValue.....", newValue)
      console.log("New Values...", newValues)
      setValues(newValues)
    }

    const profilePress = () => {
      // console.log('Profile pressed.......')
    }

    return (
      <>
        {/* {console.log('inside patient queue screen....', patientQueueForList())} */}
        {console.log("Vitals............", vitals)}
        <Header
          LeftActionComponent={
            <HeaderBackButton
              {...{ title: "editVitalsScreen.editVitals", navigation: navigation }}
            />
          }
          RightActionComponent={<ProfileIconButton onPress={profilePress} />}
        />
        <Screen
          preset="fixed"
          contentContainerStyle={$container}
          // safeAreaEdges={["top"]}
        >
          <Profile />
          {/* <Text preset="heading" tx="vitalsHistoryScreen.vitalsHistoryScreen" style={$title} /> */}
          <ScrollView style={$patientsListView}>
            {fieldStore.fieldsForList.map((item) => {
              return (
                <View style={$fieldRowView}>
                  {console.log("itemmmmmm", item.Name + ": " + values[item.Name])}
                  <TextField
                    value={values[item.Name]}
                    onChangeText={(text) => updateValues(item.Name, text)}
                    // value={
                    //   values.hasOwnProperty(item.Name) && values[item.Name]
                    //   // + ' ' + item.Unit
                    // }
                    // onChangeText={(text) => {
                    //   var obj = values
                    //   if (obj.hasOwnProperty(item.Name)) {
                    //     obj[item.Name] = text
                    //   } else {
                    //     obj[item.Name] = text
                    //   }
                    //   setValues(obj)
                    //   console.log("logging. array....", obj)
                    // }}
                    inputWrapperStyle={{ backgroundColor: colors.inputBackground }}
                    containerStyle={$textField}
                    autoCapitalize="none"
                    // autoComplete="email"
                    autoCorrect={false}
                    keyboardType="numeric"
                    labelTx={item.Name}
                    placeholderTx={item.Name}
                    // onSubmitEditing={() => authPasswordInput.current?.focus()}
                  />
                  <Text preset="formLabel" style={{ marginStart: "2%", marginTop: spacing.sm }}>
                    {item.Unit}
                  </Text>
                </View>
              )
            })}

            {/* <FlatList
            data={vitalStore.vitalsForList}
            // style={$patientsListView}
            extraData={vitalStore.vitalsForList}
            renderItem={({item}) => <PatientItem title={item} />}
            keyExtractor={item => item.PatientId}
          /> */}
            <View style={$fieldRowView}>
              <TextField
                multiline={true}
                value={nursingNote}
                onChangeText={setNursingNote}
                inputWrapperStyle={{ backgroundColor: colors.inputBackground }}
                containerStyle={$noteTextField}
                autoCapitalize="none"
                // autoComplete="email"
                autoCorrect={false}
                // keyboardType="numeric"
                labelTx={"NursingNote"}
                placeholderTx={"NursingNote"}
                // onSubmitEditing={() => authPasswordInput.current?.focus()}
              />
            </View>
          </ScrollView>
          <View style={$buttonsView}>
            <Button
              testID="login-button"
              tx={"Save"}
              style={[$tapButton, { backgroundColor: colors.themeText }]}
              preset="reversed"
              onPress={savePressed}
            />
          </View>
        </Screen>
      </>
    )
  }

const $container: ViewStyle = {
  // paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
  flex: 1,
}

const $title: TextStyle = {
  flex: 0.5,
  marginBottom: spacing.sm,
}

const $patientsListView: ViewStyle = {
  // flex: 1,
  // borderWidth: 1,
  width: "100%",
  alignSelf: "center",
  marginVertical: spacing.sm,
  borderRadius: 10,
  elevation: 5,
  backgroundColor: colors.background,
  paddingTop: spacing.sm,
  paddingBottom: spacing.lg,
}

const $patientsText: TextStyle = {
  // padding: spacing.sm,
}

const $buttonsView: ViewStyle = {
  width: "100%",
  marginBottom: 60,
}

const $tapButton: ViewStyle = {
  flex: 1,
  margin: spacing.md,
}

const $patientItemView: ViewStyle = {
  flex: 2,
  elevation: 10,
  borderWidth: 1,
  margin: spacing.md,
  backgroundColor: colors.background,
  borderRadius: 20,
  padding: "4%",
  paddingVertical: "6%",
  borderColor: colors.palette.accent500,
}

const $patientItemTitleView: ViewStyle = {
  // borderWidth: 0.5,
  position: "absolute",
  backgroundColor: colors.palette.accent500,
  top: -spacing.sm,
  start: spacing.sm,
  borderRadius: 25,
  paddingHorizontal: spacing.sm,
  alignItems: "center",
  justifyContent: "center",
}

const $patientTitleText: TextStyle = {
  // paddingHorizontal: spacing.sm
}

const $serviceItem: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  backgroundColor: colors.palette.accent200,
  margin: "2%",
  paddingHorizontal: "4%",
  borderRadius: 5,
}

const $textField: ViewStyle = {
  marginBottom: spacing.sm,
  width: "60%",
}

const $noteTextField: ViewStyle = {
  marginBottom: 80,
  width: "90%",
  height: 100,
}

const $fieldRowView: ViewStyle = {
  flexDirection: "row",
  // width: '100%',
  marginStart: "4%",
  // justifyContent: 'space-around',
  alignItems: "center",
}

// @home remove-file

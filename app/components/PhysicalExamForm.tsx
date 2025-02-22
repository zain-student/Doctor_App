import {
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Text} from './Text';
import {typography} from 'app/theme';
import {Icon} from './Icon';
import DatePicker from 'react-native-date-picker';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import moment from 'moment';
import {mmkvStorage, UserContext} from 'app/utils/UserContext';

let dropdownList: string[] = [];
let medicationFormDataBackup = [
  {
    title: 'Diagnosis (Search)',
    value: '',
    type: 'search',
    list: ['INJECT', 'ORAL'],
  },
  {
    title: 'Chronicity (Select)',
    value: '',
    type: 'dropdown',
    list: [],
  },
  {
    title: 'Severity (Select)',
    value: '',
    type: 'dropdown',
    list: [],
  },
  {
    title: 'Start Date',
    value: '',
    type: 'date',
  },
  {
    title: 'End Date',
    value: '',
    type: 'date',
  },
];
let medicationFormData = [
  {
    title: 'Diagnosis (Search)',
    value: '',
    type: 'search',
    list: ['INJECT', 'ORAL'],
  },
  {
    title: 'Chronicity (Select)',
    value: '',
    type: 'dropdown',
    list: [],
  },
  {
    title: 'Severity (Select)',
    value: '',
    type: 'dropdown',
    list: [],
  },
  {
    title: 'Start Date',
    value: '',
    type: 'date',
  },
  {
    title: 'End Date',
    value: '',
    type: 'date',
  },
];
let dateType = -1;

export default function PhysicalExamForm(props: any) {
  const userContext = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownIndex, setDropdownIndex] = useState(-1);
  const [refreshData, setRefreshData] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchedStr, setSearchedStr] = useState('');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  useEffect(() => {
    medicationFormData = JSON.parse(JSON.stringify(medicationFormDataBackup));
  }, []);
  const onItemPressed = (item: any, index: number) => {
    if (index === 3 || index === 4) {
      dateType = index;
      setIsDatePickerVisible(true);
      return;
    }
    if (showDropdown && index === dropdownIndex) {
      setShowDropdown(false);
      return;
    }
    if (item.title === 'Chronicity (Select)') {
      dropdownList = global.diagnosisDropdownData
        ? global.diagnosisDropdownData?.DiagnosisChronicityLevel
        : [];
    } else if (item.title === 'Severity (Select)') {
      dropdownList = global.diagnosisDropdownData
        ? global.diagnosisDropdownData?.DiagnosisSeverityLevel
        : [];
    } else if (item.title === 'Onset') {
      dropdownList = global.allergyDropdownData
        ? global.allergyDropdownData[1]
        : [];
    }
    console.warn('dropdownList', dropdownList, global.diagnosisDropdownData);
    setDropdownIndex(index);
    setShowDropdown(true);
  };
  const onDropdownItemPressed = (item: any) => {
    medicationFormData[dropdownIndex].value =
      dropdownIndex === 0 ? item.ICD10Name : item.ShortName;
    if (dropdownIndex === 0) setSearchedStr(item.ICD10Name);
    setShowDropdown(false);
  };
  const onChangeItemCount = (item: any, index: number, action: string) => {
    let _value = medicationFormData[index].value;
    if (typeof _value === 'number') {
    }
    setRefreshData(!refreshData);
  };
  const onChangeText = (queryStr: string) => {
    setSearchedStr(queryStr);
    let data = global.diagnosisListData;
    let filteredData = [];
    if (data) {
      filteredData = data.filter(item => item.ICD10Name.includes(queryStr));
    }
    console.warn('sss', filteredData);
    setFilteredData(filteredData);
    setDropdownIndex(0);
    setShowDropdown(true);
  };
  const onDateSelected = (val: Date) => {
    // setDob(date
    medicationFormData[dateType].value = val.toDateString();
    setIsDatePickerVisible(false);
  };
  return (
    <ScrollView style={{flex: 1, paddingTop: 12}}>
      <DatePicker
        modal
        open={isDatePickerVisible}
        mode={'date'}
        theme={'light'}
        // maximumDate={new Date('2005-11-02')}
        date={new Date()}
        // androidVariant="iosClone"
        onConfirm={val => onDateSelected(val)}
        onCancel={() => {
          setIsDatePickerVisible(false);
        }}
      />
      <FlatList
        data={medicationFormData}
        renderItem={({item, index}) => (
          <View style={{marginBottom: 8}}>
            <TouchableOpacity
              disabled={item.type === 'search'}
              style={{
                ...styles.listSubContainer,
                height: undefined,
              }}
              onPress={() => onItemPressed(item, index)}>
              <>
                {item.type !== 'search' ? (
                  <Text
                    style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}>
                    {item.title} {item.value ? `- (${item.value})` : ''}
                  </Text>
                ) : (
                  <TextInput
                    placeholder={item.title}
                    placeholderTextColor={'#80858A'}
                    value={searchedStr}
                    onChangeText={onChangeText}
                    style={{
                      // flex: 1,
                      color: '#80858A',
                      fontSize: 12,
                      paddingLeft: 16,
                      // backgroundColor: 'red',
                      paddingVertical: 0,
                      width: '80%',
                    }}
                    multiline
                    // numberOfLines={2}
                  />
                )}
                <View
                  style={{
                    justifyContent: 'center',
                    marginRight: 16,
                  }}>
                  {item.type === 'dropdown' ? (
                    <EntypoIcon
                      name={
                        index === dropdownIndex && showDropdown
                          ? 'chevron-up'
                          : 'chevron-down'
                      }
                      color="#80858A"
                      size={20}
                      style={{}}
                    />
                  ) : (
                    <Icon
                      icon={
                        item.type === 'search' ? 'searchIcon' : 'calendarIcon'
                      }
                      size={item.type === 'search' ? 30 : 20}
                    />
                  )}
                </View>
              </>
            </TouchableOpacity>
            {index === dropdownIndex && showDropdown && (
              <View style={{backgroundColor: '#F3F3F3', borderRadius: 12}}>
                <FlatList
                  data={item.type === 'search' ? filteredData : dropdownList}
                  renderItem={({item: _itm}) => (
                    <TouchableOpacity
                      onPress={() => onDropdownItemPressed(_itm)}>
                      <Text
                        style={{
                          fontSize: 12,
                          padding: 6,
                          paddingHorizontal: 20,
                        }}>
                        {item.type === 'search'
                          ? _itm.ICD10Name
                          : _itm.ShortName}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
        )}
      />
      <TouchableOpacity
        onPress={() => {
          try {
            if (medicationFormData.some(item => item.value?.length === 0)) {
              ToastAndroid.show('All fields are required', ToastAndroid.LONG);
              return;
            }
            let diff = moment(medicationFormData[4].value).diff(
              medicationFormData[3].value,
              'days',
            );
            console.warn('diff', diff);
            if (diff >= 1) {
              // go onw
              let patient = props.currentPatient;
              // patient.diagnosis?.PatientWiseList=[]
              let data = {
                Severity: medicationFormData[2].value,
                Chronicity: medicationFormData[1].value,
                ChronicityId: '',
                SeverityId: '',
                SelectedProblems: '',
                SelectedSeverity: '',
                DiagnosisId: 0,
                Problem: medicationFormData[0].value,
                EnteredOn: medicationFormData[3].value,
                StartDate: medicationFormData[3].value,
                StopDate: medicationFormData[4].value,
                ICD10Code: '',
                ICD10Name: medicationFormData[0].value,
                EnteredBy: {
                  UserId: mmkvStorage.getNumber('loggedInUserId'),
                  FullName: mmkvStorage.getString('loggedInUsername'),
                },
                isChanged: true,
              };
              if (global.diagnosisDropdownData?.DiagnosisSeverityLevel) {
                data.SeverityId =
                  global.diagnosisDropdownData.DiagnosisSeverityLevel.find(
                    item => item.ShortName === medicationFormData[2].value,
                  )?.DiagnosisSeverityLevelId;
              }
              if (global.diagnosisDropdownData?.DiagnosisChronicityLevel) {
                data.ChronicityId =
                  global.diagnosisDropdownData.DiagnosisChronicityLevel.find(
                    item => item.ShortName === medicationFormData[1].value,
                  )?.DiagnosisChronicityLevelId;
              }
              if (global.diagnosisListData) {
                data.ICD10Code = global.diagnosisListData.find(
                  item => item.ICD10Name === data.ICD10Name,
                )?.ICD10Code;
                data.DiagnosisId = global.diagnosisListData.find(
                  item => item.ICD10Name === data.ICD10Name,
                )?.DiagnosisId;
              }
              if (patient.diagnosis?.PatientWiseList) {
                patient.diagnosis.PatientWiseList.push(data);
              } else {
                if (patient.diagnosis) {
                  patient.diagnosis.PatientWiseList = [data];
                } else {
                  patient.diagnosis = {
                    PatientWiseList: [data],
                  };
                }
              }
              props.updateCurrentPatient(patient);
              props.onGoBack();
            } else {
              ToastAndroid.show(
                'Start date should be before end date',
                ToastAndroid.LONG,
              );
            }
          } catch (e) {}
        }}
        style={{
          height: 42,
          width: '100%',
          backgroundColor: '#48BD69',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 15,
          marginBottom: 6,
        }}>
        <Text preset="bold" style={{color: 'white', fontSize: 14}}>
          ADD
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  listSubContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.16)',
    paddingVertical: 11,
    borderRadius: 6,
    // marginBottom: 8,

    justifyContent: 'space-between',
  },
});

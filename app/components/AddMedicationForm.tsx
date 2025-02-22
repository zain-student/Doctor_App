import {
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Text} from './Text';
import {typography} from 'app/theme';
import {Icon} from './Icon';
import DatePicker from 'react-native-date-picker';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import {dosageForms} from 'app/constant/DosageForms';
import {mmkvStorage} from 'app/utils/UserContext';

let dropdownList: string[] = [];
let medicineName = '';
let medicationFormData = [];
let medicationFormDataBackup = [
  {title: 'Dose', value: 1, type: 'counter'},
  {title: 'Route', value: 'ORAL', type: 'dropdown', list: ['INJECT', 'ORAL']},
  {
    title: 'Dosage Form',
    value: 'TABLET',
    type: 'dropdown',
    list: ['SYRUP', 'TABLET'],
  },
  {
    title: 'Frequency',
    value: '',
    type: 'dropdown',
    list: ['Once Daily', 'Twice Daily', 'Thrice Daily'],
  },
  {title: 'Duration', value: 1, type: 'counter'},
  {title: 'Quantity', value: 1, type: 'counter'},
  {
    title: 'Refill',
    value: '',
    type: 'dropdown',
    list: ['Once Daily', 'Twice Daily', 'Thrice Daily'],
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
  {
    title: 'Direction To Patient',
    value: '',
    type: 'comments',
  },
  {
    title: 'Direction To Pharmacist',
    value: '',
    type: 'comments',
  },
  {
    title: 'Comments',
    value: '',
    type: 'comments',
  },
];
let medicineId = -1;
let dateType = -1;

export default function AddMedicationForm(props: any) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownIndex, setDropdownIndex] = useState(-1);
  const [refreshData, setRefreshData] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchedStr, setSearchedStr] = useState('');
  useEffect(() => {
    try {
      console.warn(
        'props.selectedMedicationIndex',
        props.selectedMedicationIndex,
      );
      if (props.currentPatient && props.selectedMedicationIndex !== -1) {
        medicationFormData = JSON.parse(
          JSON.stringify(medicationFormDataBackup),
        );
        let medicationsData =
          props.currentPatient.medications[props.selectedMedicationIndex];
        medicineName = medicationsData.DrugName ? medicationsData.DrugName : '';
        medicineId = medicationsData.MedicationListId
          ? medicationsData.MedicationListId
          : '';
        setSearchedStr(medicineName);
        medicationFormData[5].value = medicationsData.Quantity
          ? medicationsData.Quantity
          : 0;
        medicationFormData[9].value = medicationsData.DirectionToPatient
          ? medicationsData.DirectionToPatient
          : '';
        medicationFormData[10].value = medicationsData.DirectionToProivder
          ? medicationsData.DirectionToProivder
          : '';
        medicationFormData[11].value = medicationsData.Comments
          ? medicationsData.Comments
          : '';
        medicationFormData[0].value = medicationsData.Dose
          ? parseInt(medicationsData.Dose)
          : 1;
        medicationFormData[1].value = medicationsData.Route
          ? medicationsData.Route
          : '';
        medicationFormData[2].value = medicationsData.DosageForm
          ? medicationsData.DosageForm
          : '';
        medicationFormData[3].value = medicationsData.Frequency
          ? medicationsData.Frequency
          : '';
        medicationFormData[7].value = medicationsData.StartDate
          ? medicationsData.StartDate
          : '';
        medicationFormData[8].value = medicationsData.EndDate
          ? medicationsData.EndDate
          : '';
        medicationFormData[6].value = medicationsData.Refill
          ? medicationsData.Refill
          : '';
        setRefreshData(!refreshData);
        // medicationFormData[4].value = moment(allergyData.AllergenDate)
        //   ? moment(allergyData.AllergenDate).format('YYYY-MM-DD')
        //   : '';
        console.warn(
          'first',
          medicationFormData[5].value,
          medicationsData.Quantity,
        );
      } else {
        medicationFormData = JSON.parse(
          JSON.stringify(medicationFormDataBackup),
        );
        setRefreshData(!refreshData);
        console.warn('medicationFormData', medicationFormData);
      }
    } catch (e) {
      console.warn('err', e);
    }
  }, []);

  const onItemPressed = (item: any, index: number) => {
    if (index === 7 || index === 8) {
      dateType = index;
      setIsDatePickerVisible(true);
      return;
    }
    if (showDropdown && index === dropdownIndex) {
      setShowDropdown(false);
      return;
    }
    setDropdownIndex(index);
    if (item.title === 'Route') {
      dropdownList = global.medicineRoutesData ? global.medicineRoutesData : [];
    } else if (item.title === 'Frequency') {
      dropdownList = global.medicineFrequencyData
        ? global.medicineFrequencyData
        : [];
    } else if (item.title === 'Dosage Form') {
      dropdownList = dosageForms.map(item => item.shortName);
    } else {
      dropdownList = item.list;
    }
    setShowDropdown(true);
  };
  const onDropdownItemPressed = (item: any) => {
    medicationFormData[dropdownIndex].value =
      dropdownIndex === 1
        ? item.Route
        : dropdownIndex === 3
        ? item.Frequency
        : item;
    setShowDropdown(false);
  };
  const onChangeText = (queryStr: string) => {
    setSearchedStr(queryStr);
    try {
      let data = global.medicineListData;
      let filteredData = [];
      if (data) {
        filteredData = data.filter(item => item.Name.includes(queryStr));
      }
      console.warn('sss', filteredData);
      setFilteredData(filteredData);
      // setDropdownIndex(0);
      // setShowDropdown(true);
    } catch (e) {}
  };
  const onChangeItemCount = (item: any, index: number, action: string) => {
    let _value = medicationFormData[index].value;
    if (typeof _value === 'number') {
      if (action === 'add') {
        medicationFormData[index].value = _value + 1;
      } else {
        medicationFormData[index].value = _value > 1 ? _value - 1 : 1;
      }
    }
    setRefreshData(!refreshData);
  };
  const onDateSelected = (val: Date) => {
    // setDob(date);
    medicationFormData[dateType].value = val.toDateString();
    setIsDatePickerVisible(false);
  };
  const onSubmit = () => {
    try {
      if (
        medicationFormData.some(
          item => item.value === 0 || item.value?.length === 0,
        ) ||
        medicineName.length === 0
      ) {
        ToastAndroid.show('All fields are required', ToastAndroid.LONG);
        return;
      }
      let diff = moment(medicationFormData[8].value).diff(
        medicationFormData[7].value,
        'days',
      );
      console.warn('diff', diff);
      if (diff >= 1) {
        // go onw
        let patient = props.currentPatient;
        // patient.diagnosis?.PatientWiseList=[]
        let data = {
          // Id: 72,
          // PatientMedicationId: 78,
          Id:
            props.currentPatient && props.selectedMedicationIndex !== -1
              ? patient.medications[props.selectedMedicationIndex].Id
              : null,
          MedicineId: medicineId,
          MedicationListId: medicineId,
          // PatientId: props.currentPatient.patient.PatientId,
          // OrderNumber: 'PH-21-000068',
          // RxNumber: 'RX-000068',
          DrugName: medicineName,
          RemainingQTY: 0,
          Date: '2021-12-29T00:00:00',
          ProviderName: mmkvStorage.getString('loggedInUsername') ?? '',
          DirectionToProivder: medicationFormData[10].value,
          DirectionToPatient: medicationFormData[9].value,
          Quantity: medicationFormData[5].value,
          //Custom Added
          Comments: medicationFormData[11].value,
          Dose: medicationFormData[0].value,
          Route: medicationFormData[1].value,
          DosageForm: medicationFormData[2].value,
          Frequency: medicationFormData[3].value,
          Refill: medicationFormData[6].value,
          //Custom Added
          NoteId: 0,
          Issued: true,
          UnitPrice: 22.8,
          // PatientName: 'Test-1 Test-1',
          // MRNo: '01-01-000006',
          // TokenDate: null,
          EnteredBy: 0,
          EnteredByName: 'Ali',
          EnteredOn: moment().toISOString(),
          UpdatedBy: 0,
          UpdatedOn: moment().toISOString(),
          StartDate: medicationFormData[7].value,
          EndDate: medicationFormData[8].value,
          QtyInStock: 0,
          isNew: true,
          // Alert: false,
        };
        if (props.currentPatient && props.selectedMedicationIndex !== -1) {
          patient.medications[props.selectedMedicationIndex] = data;
        } else {
          if (patient.medications) {
            patient.medications.push(data);
          } else {
            patient.medications = [data];
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
    } catch (e) {
      console.warn('err', e);
    }
  };
  return (
    <ScrollView style={{flex: 1}}>
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
      <View
        style={{
          backgroundColor: '#F3F3F3',
          paddingVertical: 6,
          paddingHorizontal: 10,
          marginBottom: 10,
        }}>
        <Text preset="bold" style={{fontSize: 14}}>
          Patient Medications
        </Text>
      </View>
      <View
        style={{
          borderWidth: 1,
          borderColor: '#A1AEC1',
          // height: 38,
          backgroundColor: 'white',
          borderRadius: 6,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: filteredData.length > 0 ? 0 : 20,
        }}>
        <TextInput
          value={searchedStr}
          onChangeText={onChangeText}
          style={{
            color: '#94A3B8',
            fontSize: 12,
            fontFamily: typography.primary.normal,
            flex: 1,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
          placeholder="Search Medicine"
          placeholderTextColor={'#94A3B8'}
        />
        <Icon icon="searchIcon" size={23} style={{marginRight: 10}} />
      </View>
      {filteredData.length > 0 && (
        <View
          style={{
            backgroundColor: '#F3F3F3',
            borderRadius: 12,
            marginBottom: 20,
          }}>
          <FlatList
            data={filteredData}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  medicineName = item.Name;
                  setSearchedStr(item.Name);
                  medicineId = item.MedicationListId;
                  setFilteredData([]);
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    padding: 6,
                    paddingHorizontal: 20,
                  }}>
                  {item.Name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <FlatList
        data={medicationFormData}
        renderItem={({item, index}) => (
          <View style={{marginBottom: 8}}>
            <TouchableOpacity
              disabled={item.type === 'comments' || item.type === 'counter'}
              style={{
                ...styles.listSubContainer,
                height: item.type === 'comments' ? undefined : 46,
              }}
              onPress={() => onItemPressed(item, index)}>
              {item.type === 'comments' ? (
                <View>
                  <Text
                    preset="bold"
                    style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}>
                    {item.title}:
                  </Text>
                  <TextInput
                    value={item.value}
                    multiline
                    onChangeText={val => {
                      medicationFormData[index].value = val;
                      setRefreshData(!refreshData);
                    }}
                    placeholder="Enter directions"
                    style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}
                  />
                  {/* <Text
                    preset="bold"
                    style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}>
                    Direction To Pharmacist:
                  </Text>
                  <TextInput
                    placeholder="Enter directions"
                    style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}
                  />
                  <Text
                    preset="bold"
                    style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}>
                    Comments:
                  </Text>
                  <TextInput
                    placeholder="Enter comments"
                    style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}
                  /> */}
                </View>
              ) : (
                <>
                  <Text
                    style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}>
                    {item.title} {item.value ? `- (${item.value})` : ''}
                  </Text>
                  <View
                    style={{
                      justifyContent: 'center',
                      marginRight: 16,
                    }}>
                    {item.type === 'counter' && (
                      <TouchableOpacity
                        style={{height: 20}}
                        onPress={() => onChangeItemCount(item, index, 'add')}>
                        <EntypoIcon
                          name="chevron-up"
                          color="#80858A"
                          size={20}
                          style={{}}
                        />
                      </TouchableOpacity>
                    )}
                    {item.type !== 'date' ? (
                      <TouchableOpacity
                        disabled={item.type !== 'counter'}
                        onPress={() =>
                          onChangeItemCount(item, index, 'substract')
                        }>
                        <EntypoIcon
                          name="chevron-down"
                          color="#80858A"
                          size={20}
                          style={{}}
                        />
                      </TouchableOpacity>
                    ) : (
                      <Icon icon="calendarIcon" size={20} />
                    )}
                  </View>
                </>
              )}
            </TouchableOpacity>
            {index === dropdownIndex && showDropdown && (
              <View style={{backgroundColor: '#F3F3F3', borderRadius: 12}}>
                <FlatList
                  data={dropdownList}
                  renderItem={({item: _itm}) => (
                    <TouchableOpacity
                      onPress={() => onDropdownItemPressed(_itm)}>
                      <Text
                        style={{
                          fontSize: 12,
                          padding: 6,
                          paddingHorizontal: 20,
                        }}>
                        {item.title === 'Route'
                          ? _itm.Route
                          : item.title === 'Frequency'
                          ? _itm.Frequency
                          : JSON.stringify(_itm)}
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
        style={{
          height: 42,
          width: '100%',
          backgroundColor: '#2196F3',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 15,
          marginBottom: 6,
        }}
        onPress={() => onSubmit()}>
        <Text preset="bold" style={{color: 'white', fontSize: 14}}>
          ADD MEDICINE
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

    justifyContent: 'space-between',
  },
});

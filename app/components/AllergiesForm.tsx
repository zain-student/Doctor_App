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
import {colors, typography} from 'app/theme';
import {Icon} from './Icon';
import DatePicker from 'react-native-date-picker';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import moment from 'moment';
import {mmkvStorage, UserContext} from 'app/utils/UserContext';
import {isTablet} from 'react-native-device-info';

let dropdownList: string[] = [];
let medicationFormData = [
  {
    title: 'Select Allergen',
    value: '',
    itemId: '',
    type: 'dropdown',
    list: [],
  },
  {
    title: '',
    value: '',
    type: 'list',
    list: ['VERY MILD', 'MILD', 'MODERATE', 'SEVERE'],
  },
  {
    title: 'Allergen Type',
    value: '',
    itemId: '',
    type: 'dropdown',
    list: [],
  },
  {
    title: 'Select Reaction',
    value: '',
    itemId: '',
    type: 'dropdown',
    list: [],
  },
  {
    title: 'Allergen Date',
    value: '',
    type: 'date',
  },
  {
    title: 'Onset',
    value: '',
    itemId: '',
    type: 'dropdown',
    list: [],
  },
];
let dateType = -1;

export default function AllergiesForm(props: any) {
  const userContext = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownIndex, setDropdownIndex] = useState(-1);
  const [refreshData, setRefreshData] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  useEffect(() => {
    if (props.selectedAllergyItemForEdit) {
      let allergyData = props.selectedAllergyItemForEdit;
      medicationFormData[0].value = allergyData.Allergen
        ? allergyData.Allergen
        : '';
      medicationFormData[0].itemId = allergyData.AllergenId
        ? allergyData.AllergenId
        : '';
      medicationFormData[1].value = allergyData.Severity
        ? allergyData.Severity
        : '';
      medicationFormData[2].value = allergyData.AllergenType
        ? allergyData.AllergenType
        : '';
      medicationFormData[2].itemId = allergyData.AllergenTypeId
        ? allergyData.AllergenTypeId
        : '';
      medicationFormData[3].value = allergyData.ReactionName
        ? allergyData.ReactionName
        : '';
      medicationFormData[3].itemId = allergyData.ReactionsId
        ? allergyData.ReactionsId
        : '';
      medicationFormData[4].value = moment(allergyData.AllergenDate)
        ? moment(allergyData.AllergenDate).format('YYYY-MM-DD')
        : '';
      medicationFormData[5].value = allergyData.OnSet ? allergyData.OnSet : '';
      medicationFormData[5].itemId = allergyData.OnsetId
        ? allergyData.OnsetId
        : '';
      console.warn('first', medicationFormData[1].value);
    } else {
      medicationFormData = [
        {
          title: 'Select Allergen',
          value: '',
          itemId: '',
          type: 'dropdown',
          list: [],
        },
        {
          title: '',
          value: '',
          type: 'list',
          list: ['VERY MILD', 'MILD', 'MODERATE', 'SEVERE'],
        },
        {
          title: 'Allergen Type',
          value: '',
          itemId: '',
          type: 'dropdown',
          list: [],
        },
        {
          title: 'Select Reaction',
          value: '',
          itemId: '',
          type: 'dropdown',
          list: [],
        },
        {
          title: 'Allergen Date',
          value: '',
          type: 'date',
        },
        {
          title: 'Onset',
          value: '',
          itemId: '',
          type: 'dropdown',
          list: [],
        },
      ];
      setRefreshData(!refreshData);
    }
  }, []);

  const onItemPressed = (item: any, index: number) => {
    if (item.title === 'Allergen Date') {
      dateType = index;
      setIsDatePickerVisible(true);
      return;
    }
    if (showDropdown && index === dropdownIndex) {
      setShowDropdown(false);
      return;
    }
    if (item.title === 'Allergen Type') {
      if (medicationFormData[0].value?.length === 0) {
        ToastAndroid.show('Select Allergen First', ToastAndroid.LONG);
      } else {
        let temp = global.allergyDropdownData[0];
        dropdownList = temp.find(
          ite => ite.Name === medicationFormData[0].value,
        )?.allergenTypes;
      }
    } else if (item.title === 'Select Allergen') {
      dropdownList = global.allergyDropdownData
        ? global.allergyDropdownData[0]
        : [];
    } else if (item.title === 'Select Reaction') {
      dropdownList = global.allergyDropdownData
        ? global.allergyDropdownData[2]
        : [];
    } else if (item.title === 'Onset') {
      dropdownList = global.allergyDropdownData
        ? global.allergyDropdownData[1]
        : [];
    }

    if (dropdownList) {
      setDropdownIndex(index);
      setShowDropdown(true);
    } else {
      ToastAndroid.show('No data found', ToastAndroid.LONG);
    }
  };
  const onDropdownItemPressed = (item: any) => {
    medicationFormData[dropdownIndex].value = item.Name;
    medicationFormData[dropdownIndex].itemId = item.AllergenId
      ? item.AllergenId
      : item.OnsetId
      ? item.OnsetId
      : item.ReactionsId
      ? item.ReactionsId
      : '';
    setShowDropdown(false);
  };
  const onChangeItemCount = (item: any, index: number, action: string) => {
    let _value = medicationFormData[index].value;
    if (typeof _value === 'number') {
    }
    setRefreshData(!refreshData);
  };
  const onDateSelected = (val: Date) => {
    // setDob(date);
    medicationFormData[dateType].value = val.toDateString();
    setIsDatePickerVisible(false);
  };

  const onSavePressed = () => {
    try {
      if (medicationFormData.some(item => item.value?.length === 0)) {
        ToastAndroid.show('All fields are required', ToastAndroid.LONG);
      } else {
        let currPatient = props.currentPatient;
        let allergyData: any = {};
        if (props.selectedAllergyItemForEdit) {
          allergyData = props.selectedAllergyItemForEdit;
        }
        allergyData.Allergen = medicationFormData[0].value;
        allergyData.AllergenId = medicationFormData[0].itemId;
        allergyData.Severity = medicationFormData[1].value;
        allergyData.AllergenType = medicationFormData[2].value;
        allergyData.AllergenTypeId = medicationFormData[2].itemId;
        allergyData.ReactionName = medicationFormData[3].value;
        allergyData.ReactionId = medicationFormData[3].itemId;
        allergyData.AllergenDate = medicationFormData[4].value;
        allergyData.OnSet = medicationFormData[5].value;
        allergyData.OnSetId = medicationFormData[5].itemId;
        allergyData.FirstName = mmkvStorage.getString('loggedInUsername')
          ? mmkvStorage.getString('loggedInUsername')
          : 'Ali';
        if (props.selectedAllergyItemForEdit) {
          let index = currPatient.allergies.findIndex(
            itm =>
              itm.PatientAllergyId ===
              props.selectedAllergyItemForEdit.PatientAllergyId,
          );
          if (index !== -1) {
            currPatient.allergies[index] = allergyData;
          }
        } else {
          if (currPatient.allergies) {
            currPatient.allergies.push(allergyData);
          } else {
            currPatient.allergies = [allergyData];
          }
        }
        props.updateCurrentPatient(currPatient);
        props.onGoBack();
      }
    } catch (e) {}
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
            {item.type === 'list' ? (
              <FlatList
                data={item.list}
                horizontal
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    onPress={() => {
                      medicationFormData[1].value = item;
                      setRefreshData(!refreshData);
                    }}
                    style={{
                      backgroundColor:
                        index === 0
                          ? '#1ABC9C'
                          : index === 1
                          ? '#F1C40F'
                          : index === 2
                          ? '#E67E22'
                          : index === 3
                          ? '#E74C3C'
                          : '',
                      marginRight: widthPercentageToDP(1.5),
                      borderRadius: 4,
                      borderWidth:
                        item?.toLowerCase() ===
                        medicationFormData[1]?.value?.toLowerCase()
                          ? 2
                          : 0,
                      borderColor: colors.themeColorDark,
                      // marginBottom: 8,
                    }}>
                    <Text
                      preset="bold"
                      style={{
                        fontSize: isTablet() ? 12 : widthPercentageToDP(3),
                        color: 'white',
                        paddingHorizontal: widthPercentageToDP(2.9),
                        paddingVertical: 6,
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <TouchableOpacity
                style={{
                  ...styles.listSubContainer,
                  // height: item.type === 'comments' ? undefined : 46,
                }}
                onPress={() => onItemPressed(item, index)}>
                <>
                  <Text
                    style={{
                      color: '#80858A',
                      fontSize: 12,
                      paddingLeft: 16,
                      width: '90%',
                    }}>
                    {item.title} {item.value ? `- (${item.value})` : ''}
                  </Text>
                  <View
                    style={{
                      justifyContent: 'center',
                      marginRight: 16,
                    }}>
                    {item.type !== 'date' ? (
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
                      <Icon icon="calendarIcon" size={20} />
                    )}
                  </View>
                </>
              </TouchableOpacity>
            )}
            {index === dropdownIndex && showDropdown && (
              <View style={{backgroundColor: '#F3F3F3', borderRadius: 12}}>
                <FlatList
                  data={dropdownList ? dropdownList : []}
                  keyExtractor={(item, index => index.toString())}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() => onDropdownItemPressed(item)}>
                      <Text
                        style={{
                          fontSize: 12,
                          padding: 6,
                          paddingHorizontal: 20,
                        }}>
                        {item?.Name}
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
        onPress={onSavePressed}
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
          SAVE
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

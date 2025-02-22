import * as React from 'react';
import {ComponentType} from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';

export type IconTypes = keyof typeof iconRegistry;

interface IconProps extends TouchableOpacityProps {
  /**
   * The name of the icon
   */
  icon: IconTypes;

  /**
   * An optional tint color for the icon
   */
  color?: string;

  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  size?: number;

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>;

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps['onPress'];
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Icon.md)
 */
export function Icon(props: IconProps) {
  const {
    icon,
    color,
    size,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props;

  const isPressable = !!WrapperProps.onPress;
  const Wrapper: ComponentType<TouchableOpacityProps> = WrapperProps?.onPress
    ? TouchableOpacity
    : View;

  return (
    <Wrapper
      accessibilityRole={isPressable ? 'imagebutton' : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}>
      <Image
        style={[
          $imageStyle,
          color && {tintColor: color},
          size && {width: size, height: size},
          $imageStyleOverride,
        ]}
        source={iconRegistry[icon]}
      />
    </Wrapper>
  );
}

export const iconRegistry = {
  back: require('../../assets/icons/back.png'),
  bell: require('../../assets/icons/bell.png'),
  caretLeft: require('../../assets/icons/caretLeft.png'),
  caretRight: require('../../assets/icons/caretRight.png'),
  check: require('../../assets/icons/check.png'),
  clap: require('../../assets/icons/clap.png'),
  community: require('../../assets/icons/community.png'),
  components: require('../../assets/icons/components.png'),
  debug: require('../../assets/icons/debug.png'),
  github: require('../../assets/icons/github.png'),
  heart: require('../../assets/icons/heart.png'),
  hidden: require('../../assets/icons/hidden.png'),
  ladybug: require('../../assets/icons/ladybug.png'),
  lock: require('../../assets/icons/lock.png'),
  menu: require('../../assets/icons/menu.png'),
  more: require('../../assets/icons/more.png'),
  pin: require('../../assets/icons/pin.png'),
  podcast: require('../../assets/icons/podcast.png'),
  settings: require('../../assets/icons/settings.png'),
  slack: require('../../assets/icons/slack.png'),
  view: require('../../assets/icons/view.png'),
  x: require('../../assets/icons/x.png'),

  checkin: require('../../assets/icons/checkin.png'),
  vitals: require('../../assets/icons/vitals.png'),
  vitals_blue: require('../../assets/icons/vitals_blue.png'),
  prescription: require('../../assets/icons/prescription.png'),
  pharmacy: require('../../assets/icons/pharmacy.png'),
  checkout: require('../../assets/icons/checkout.png'),
  sync: require('../../assets/icons/sync.png'),
  unsync: require('../../assets/icons/unsync.png'),

  home: require('../../assets/icons/home.png'),
  home_blue: require('../../assets/icons/home_blue.png'),
  search: require('../../assets/icons/search.png'),
  search_blue: require('../../assets/icons/search_blue.png'),
  queue: require('../../assets/icons/queue.png'),
  queue_blue: require('../../assets/icons/queue_blue.png'),
  status: require('../../assets/icons/status.png'),
  status_blue: require('../../assets/icons/status_blue.png'),

  button_search: require('../../assets/icons/search_c.png'),
  button_add: require('../../assets/icons/add.png'),
  button_queue: require('../../assets/icons/queue_c.png'),
  button_status: require('../../assets/icons/status_c.png'),
  button_services: require('../../assets/icons/services_c.png'),
  button_logout: require('../../assets/icons/logout.png'),
  button_soap: require('../../assets/icons/soapIcon.png'),
  button_face: require('../../assets/icons/faceSheetIcon.png'),
  button_vitals: require('../../assets/icons/vitalsIcon.png'),
  button_allergies: require('../../assets/icons/allergiesIcon.png'),
  button_diagnosis: require('../../assets/icons/diagnosisIcon.png'),
  button_exam: require('../../assets/icons/physicalExamIcon.png'),

  patientHistoryIcon: require('../../assets/icons/historyIcon.png'),
  surgicalHistoryIcon: require('../../assets/icons/surgicalHistoryIcon.png'),
  investigationIcon: require('../../assets/icons/investigationIcon.png'),
  medicationsIcon: require('../../assets/icons/medicationIcon.png'),
  followUpIcon: require('../../assets/icons/followUpIcon.png'),
  referralIcon: require('../../assets/icons/referralsIcon.png'),
  blueAddIcon: require('../../assets/icons/blueAddIcon.png'),
  closeIcon: require('../../assets/icons/closeIcon.png'),
  downIcon: require('../../assets/icons/downIcon.png'),
  userIcon: require('../../assets/icons/userIcon.png'),
  syncDone: require('../../assets/icons/syncDone.png'),
  checkIcon: require('../../assets/icons/checkIcon.png'),
  searchIcon: require('../../assets/icons/searchIcon.png'),
  addNote: require('../../assets/icons/addNote.png'),
  editIcon: require('../../assets/icons/editIcon.png'),
  deleteIcon: require('../../assets/icons/deleteIcon.png'),
  calendarIcon: require('../../assets/icons/calendarIcon.png'),

  bmiIcon: require('../../assets/icons/VitalsIcons/bmiIcon.png'),
  bpDia: require('../../assets/icons/VitalsIcons/bpDia.png'),
  bpSysIcon: require('../../assets/icons/VitalsIcons/bpSysIcon.png'),
  heightIcon: require('../../assets/icons/VitalsIcons/heightIcon.png'),
  pulseIcon: require('../../assets/icons/VitalsIcons/pulseIcon.png'),
  sp02Icon: require('../../assets/icons/VitalsIcons/sp02Icon.png'),
  tempIcon: require('../../assets/icons/VitalsIcons/tempIcon.png'),
  waistCircumIcon: require('../../assets/icons/VitalsIcons/waistCircumIcon.png'),
  weightIcon: require('../../assets/icons/VitalsIcons/weightIcon.png'),

  eyeIcon: require('../../assets/icons/eye.png'),
  faceSheetHeartIcon: require('../../assets/icons/heartIcon.png'),
  faceSheetaddIcon: require('../../assets/icons/addIcon.png'),
  faceSheetAllergyIcon: require('../../assets/icons/allergiesIcon2.png'),

  heart_icon: require('../../assets/icons/heart_icon.png'),
  profile: require('../../assets/icons/profile.png'),

  button_vitals_history: require('../../assets/icons/vitals_history.png'),
  vitals_history: require('../../assets/icons/vitals_history_c.png'),
  vitals_history_blue: require('../../assets/icons/vitals_history_c_blue.png'),
  new_icon: require('../../assets/icons/new.png'),
};

const $imageStyle: ImageStyle = {
  resizeMode: 'contain',
};

import {StyleSheet} from "react-native"

export const styles = StyleSheet.create({
    flex: {
      flex: 1,
    },
    PagerView: {
      flex: 1,
    },
    container: {
      flexDirection: 'row',
      backgroundColor: '#63a4ff',
    },
    progressContainer: { flex: 0.1, backgroundColor: '#63a4ff' },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      padding: 20,
    },
    text: {
      fontSize: 30,
    },
    separator: {
      paddingVertical: 16,
      paddingHorizontal: 10,
    },
    touchableTitle: {
      textAlign: 'center',
      color: '#000',
    },
    touchableTitleActive: {
      color: '#fff',
    },
    dotsContainer: {
    //   flex: 1,
      justifyContent: 'space-evenly',
      borderColor: 'green'
    },
    dotContainer: {
      justifyContent: 'center',
      alignSelf: 'center',
    },
    contentSlider: {
      flex: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    dots: {
      flex: 1,
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 310,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      margin: 5,
    },
  });
  
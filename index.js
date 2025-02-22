/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './app/app.tsx';
import {name as appName} from './app.json';
import RNBootSplash from 'react-native-bootsplash';

function IgniteApp() {
  return <App hideSplashScreen={RNBootSplash.hide} />;
}

AppRegistry.registerComponent(appName, () => IgniteApp);

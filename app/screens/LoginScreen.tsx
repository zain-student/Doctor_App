import {observer} from 'mobx-react-lite';
import React, {
  FC,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ToastAndroid,
  TextInput,
  TextStyle,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import {
  Button,
  Icon,
  Screen,
  Text,
  TextField,
  TextFieldAccessoryProps,
} from '../components';
import {useStores} from '../models';
import {AppStackScreenProps} from '../navigators';
import {colors, spacing} from '../theme';
import {sha256, sha256Bytes} from 'react-native-sha256';
import Loading from 'app/components/Loading';
import {UserContext, mmkvStorage} from 'app/utils/UserContext';

interface LoginScreenProps extends AppStackScreenProps<'Login'> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(
  _props,
) {
  const authPasswordInput = useRef<TextInput>();

  const userContext = useContext(UserContext);
  const [authPassword, setAuthPassword] = useState('');
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const {
    authenticationStore: {
      appIsOnline,
      loginUser,
      authEmail,
      isAuthenticated,
      setAuthEmail,
      setAuthToken,
      distributeAuthToken,
      validationError,
      authToken,
    },
  } = useStores();

  const {userStore} = useStores();

  const [users, setUsers] = useState(userStore.usersForList);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    // if (appIsOnline() !== 'offline') {
    //   (async function load() {
    //     setIsLoading(true);
    //     await userStore.fetchUsers();
    //     setIsLoading(false);
    //   })();
    // }
  }, []);

  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    // setAuthEmail('ignite@infinite.red');
    // setAuthPassword('ign1teIsAwes0m3');
    setAuthEmail('Shameer');
    setAuthPassword('Shameer@123456');
  }, []);

  const error = isSubmitted ? validationError : '';
  const {navigation} = _props;

  async function login() {
    setIsSubmitted(true);
    // setAttemptsCount(attemptsCount + 1)

    if (validationError) return;

    // Make a request to your server to get an authentication token.
    // If successful, reset the fields and set the token.

    // setIsSubmitted(false)
    // setAuthPassword("")
    // setAuthEmail("")

    // We'll mock this with a fake token.
    // setAuthToken(String(Date.now()))
    // setAuthToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwYTFmOWUyZi04OTY4LTQ2ZTAtOTc3ZS0yNWMzZTRkNDJiOWIiLCJ2YWxpZCI6IjEiLCJ1c2VyaWQiOiI1NiIsIm5hbWUiOiJtayB5b3VuYXMiLCJleHAiOjE2OTQ4MzIyMTQsImlzcyI6Imh0dHBzOi8vZW1yYXBpLnRlY2htZWRvbG9neS5jb20vIiwiYXVkIjoiaHR0cHM6Ly9lbXJhcGkudGVjaG1lZG9sb2d5LmNvbS8ifQ.yG04bB94So2sIPiiKOnEg0IvU9rgxdLCqH9PTptyGik')

    // console.log('-=-=-=-=-=-=-=', authEmail+ " ,  " + authPassword)
    // console.log('-=-=-=-=-=-=-=', authToken)
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZjZmMDM0MC05MmQyLTQyNTYtODcwNS1kMjYyN2ZiNGE4MDciLCJ2YWxpZCI6IjEiLCJ1c2VyaWQiOiI1NiIsIm5hbWUiOiJtayB5b3VuYXMiLCJleHAiOjE2OTUxMDA3NDYsImlzcyI6Imh0dHBzOi8vZW1yYXBpLnRlY2htZWRvbG9neS5jb20vIiwiYXVkIjoiaHR0cHM6Ly9lbXJhcGkudGVjaG1lZG9sb2d5LmNvbS8ifQ.cvW3XpbRWgD2871RZC-G7g1dp9Bnyq6NlsLjpLba978'

    // setAuthToken(token);
    // distributeAuthToken(token);

    console.log('-=-=-=-=app is online...', appIsOnline());
    if (appIsOnline() == '1') {
      (async function load() {
        setIsLoading(true);
        await loginUser(authEmail, authPassword);
        userContext.updateIsLoggedIn(true);
        global.refetchPatients = true;
        setIsLoading(false);
      })();
    } else {
      var userToLogin = users.filter(item => {
        return item.UserName == authEmail;
      });
      console.log('user to login........', userToLogin);
      if (userToLogin.length > 0) {
        var searchedUser = userToLogin.length > 0 ? userToLogin[0] : {};
        if (authEmail !== null || '') {
          var data = authPassword;
          var salt = authEmail.toLowerCase();
          data = data + salt;
          var convertedString;
          console.log('combination.....', data);

          const encoder = new TextEncoder();
          const encodedData = encoder.encode(data);
          const hasher = new SubtleCrypto();
          const digest = await hasher.digest({name: 'SHA-256'}, encodedData);
          const hashedData = new Uint8Array(digest);

          const sb = new StringBuilder();
          for (const byte of hashedData) {
            sb.append(byte.toString(16).padStart(2, '0'));
          }

          return sb.toString();
          // sha256(data).then( hash => {
          //   convertedString = hash
          //   if(convertedString === userToLogin[0].UserPassword){
          //       const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZjZmMDM0MC05MmQyLTQyNTYtODcwNS1kMjYyN2ZiNGE4MDciLCJ2YWxpZCI6IjEiLCJ1c2VyaWQiOiI1NiIsIm5hbWUiOiJtayB5b3VuYXMiLCJleHAiOjE2OTUxMDA3NDYsImlzcyI6Imh0dHBzOi8vZW1yYXBpLnRlY2htZWRvbG9neS5jb20vIiwiYXVkIjoiaHR0cHM6Ly9lbXJhcGkudGVjaG1lZG9sb2d5LmNvbS8ifQ.cvW3XpbRWgD2871RZC-G7g1dp9Bnyq6NlsLjpLba978'
          //   setAuthToken(token);
          //   distributeAuthToken(token);
          //       navigation.navigate("Home")
          //     }else{
          //       ToastAndroid.show('Wrong Password....', ToastAndroid.SHORT)
          //     }
          // })
        }
      } else {
        ToastAndroid.show('User Not Found....', ToastAndroid.SHORT);
      }
    }

    if (isAuthenticated) navigation.navigate('Home');
  }

  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? 'view' : 'hidden'}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        );
      },
    [isAuthPasswordHidden],
  );

  useEffect(() => {
    return () => {
      setAuthPassword('');
      setAuthEmail('');
    };
  }, []);

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={['top', 'bottom']}>
      <Loading isLoading={isLoading} />
      <Text
        testID="login-heading"
        tx="loginScreen.signIn"
        preset="heading"
        style={$signIn}
      />
      {/* <Text tx="loginScreen.enterDetails" preset="subheading" style={$enterDetails} /> */}
      {attemptsCount > 2 && (
        <Text tx="loginScreen.hint" size="sm" weight="light" style={$hint} />
      )}

      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="loginScreen.emailFieldLabel"
        placeholderTx="loginScreen.emailFieldPlaceholder"
        helper={error}
        status={error ? 'error' : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="loginScreen.passwordFieldLabel"
        placeholderTx="loginScreen.passwordFieldPlaceholder"
        onSubmitEditing={login}
        RightAccessory={PasswordRightAccessory}
      />

      <Button
        testID="login-button"
        tx="loginScreen.tapToSignIn"
        style={$tapButton}
        preset="reversed"
        onPress={login}
      />
    </Screen>
  );
});

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
};

const $signIn: TextStyle = {
  marginBottom: spacing.sm,
  color: colors.themeText,
};

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
};

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
};

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
};

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
  backgroundColor: colors.themeText,
};

// @demo remove-file

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  Portal,
  PortalView,
  addPortal,
  register,
  subscribe,
} from '@ionic/portals-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  EmitterSubscription,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const KEY = '';

const PORTAL: Portal = {name: 'debug', startDir: 'debug'};

const LoadingView = () => (
  <View style={[styles.flex, styles.debug]}>
    <Text>Loading....</Text>
  </View>
);

const App = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const [loading, setLoading] = useState<boolean>(true);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const subRef = useRef<EmitterSubscription | null>(null);

  const printData = (data: any) => {
    console.log('Message data', data);
    console.log(`Message stringified ${JSON.stringify(data)}`);
    console.log(`data === null ? ${data === JSON.parse(data)}`);
    console.log(`!data ? ${!JSON.parse(data)}`);
  };

  useEffect(() => {
    register(KEY)
      .then(() => addPortal(PORTAL))
      .then(() => setLoading(false))
      .then(() => {
        subRef.current = subscribe('debug', ({data}) => printData(data));
      });
    return () => {
      subRef.current?.remove();
    };
  }, []);

  return (
    <SafeAreaView style={[backgroundStyle, styles.flex]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      {loading ? (
        <LoadingView />
      ) : (
        <PortalView style={styles.flex} portal={PORTAL} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
  debug: {backgroundColor: 'red'},
});

export default App;

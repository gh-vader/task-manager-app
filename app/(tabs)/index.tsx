import React, { useState } from 'react';
import { View } from 'react-native';
import HomeScreen from '../../src/screens/HomeScreen';
import { SplashScreen } from '../../src/components/SplashScreen';

export default function Main() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      {!showSplash && <HomeScreen />}
    </View>
  );
}

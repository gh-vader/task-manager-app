import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

const splashImg = require('../../assets/splash.png');

export const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const opacity = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 1200); // 1.2秒表示

    return () => clearTimeout(timer);
  }, [onFinish, opacity]);

  return (
    <Animated.View style={[styles.container, { opacity, position: 'absolute', zIndex: 10, width: '100%', height: '100%' }]}>
      <View style={styles.inner}>
        <Image source={splashImg} style={styles.image} resizeMode="contain" />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFE5D9',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  inner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 220,
    height: 220,
  },
});
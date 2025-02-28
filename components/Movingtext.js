import React, { useRef, useEffect } from 'react';
import { View, Animated, Text, StyleSheet, Dimensions } from 'react-native';

const MovingText = ({ text, speed = 50, style }) => {
  const screenWidth = Dimensions.get('window').width;
  const animatedValue = useRef(new Animated.Value(screenWidth)).current;

  useEffect(() => {
    const animate = () => {
      animatedValue.setValue(screenWidth);
      Animated.timing(animatedValue, {
        toValue: -screenWidth,
        duration: (screenWidth * 2) * (1000 / speed),
        useNativeDriver: true,
      }).start(() => animate());
    };
    animate();
  }, [animatedValue, screenWidth, speed]);

  return (
    <View style={styles.container}>
      <Animated.Text
        numberOfLines={1} // Force single line
        style={[
          styles.text,
          style,
          { transform: [{ translateX: animatedValue }] },
          { width: screenWidth * 2 } // Ensure the text has enough width to not wrap
        ]}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  text: {
    fontSize: 20,
    // Ensure the text doesn't wrap:
    flexWrap: 'nowrap',
  },
});

export default MovingText;

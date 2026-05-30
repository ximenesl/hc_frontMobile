import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const CircularProgressBar = ({ approvedHours, requiredHours }) => {
  const fill = requiredHours > 0 ? Math.min((approvedHours / requiredHours) * 100, 100) : 0;

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={140}
        width={10}
        fill={fill}
        tintColor="#f2911b"
        backgroundColor="#f0f4f8"
        rotation={0}
        lineCap="round"
      >
        {() => (
          <View style={styles.textContainer}>
            <Text style={styles.circleHoursText}>{approvedHours}</Text>
            <Text style={styles.circleTotalText}>/ {requiredHours} h</Text>
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    height: 140,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleHoursText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#004587',
  },
  circleTotalText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    marginTop: 2,
  },
});

export default CircularProgressBar;


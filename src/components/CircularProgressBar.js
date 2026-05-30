import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const CircularProgressBar = ({ approvedHours, requiredHours }) => {
  const isProgressed = approvedHours > 0;

  return (
    <View style={styles.circleOuter}>
      <View style={[styles.circleInner, { borderColor: isProgressed ? '#f2911b' : '#e0e0e0' }]}>
        <Text style={styles.circleHoursText}>{approvedHours}</Text>
        <Text style={styles.circleTotalText}>/ {requiredHours} h</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  circleOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    borderWidth: 10,
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

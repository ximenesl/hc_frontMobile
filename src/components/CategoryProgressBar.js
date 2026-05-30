import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const CategoryProgressBar = ({ name, hours, limit }) => {
  const ratio = limit > 0 ? Math.min(hours / limit, 1) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.hours}>{hours}h / {limit}h</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${ratio * 100}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    width: '100%',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  hours: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#004587',
    borderRadius: 4,
  },
});

export default CategoryProgressBar;

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

const CustomButton = ({ title, onPress, loading, disabled, type = 'primary', style }) => {
  const getButtonStyle = () => {
    if (disabled || loading) return styles.disabled;
    return type === 'primary' ? styles.primary : styles.secondary;
  };

  const getTextStyle = () => {
    return type === 'primary' ? styles.primaryText : styles.secondaryText;
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={type === 'primary' ? '#fff' : '#004587'} />
      ) : (
        <Text style={[styles.buttonText, getTextStyle()]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primary: {
    backgroundColor: '#004587',
  },
  secondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#333',
  },
});

export default CustomButton;

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const StatusCard = ({ status, count }) => {
  const getCardStyle = () => {
    switch (status) {
      case 'PENDENTE':
        return [styles.card, styles.pendingBorder];
      case 'APROVADO':
        return [styles.card, styles.approvedBorder];
      case 'REJEITADO':
        return [styles.card, styles.rejectedBorder];
      default:
        return styles.card;
    }
  };

  const getTextStyle = () => {
    switch (status) {
      case 'PENDENTE':
        return styles.pendingText;
      case 'APROVADO':
        return styles.approvedText;
      case 'REJEITADO':
        return styles.rejectedText;
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'PENDENTE':
        return 'Pendentes';
      case 'APROVADO':
        return 'Aprovados';
      case 'REJEITADO':
        return 'Rejeitados';
      default:
        return '';
    }
  };

  return (
    <View style={getCardStyle()}>
      <Text style={[styles.count, getTextStyle()]}>{count}</Text>
      <Text style={styles.label}>{getLabel()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  count: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  pendingBorder: {
    borderTopWidth: 4,
    borderTopColor: '#f2911b',
  },
  pendingText: {
    color: '#f2911b',
  },
  approvedBorder: {
    borderTopWidth: 4,
    borderTopColor: '#28a745',
  },
  approvedText: {
    color: '#28a745',
  },
  rejectedBorder: {
    borderTopWidth: 4,
    borderTopColor: '#dc3545',
  },
  rejectedText: {
    color: '#dc3545',
  },
});

export default StatusCard;

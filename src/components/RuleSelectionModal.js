import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';

const RuleSelectionModal = ({ visible, rules, selectedRuleId, onSelectRule, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Selecione a Categoria/Regra</Text>
          <ScrollView style={styles.modalScroll}>
            {rules.map((rule) => {
              const isSelected = selectedRuleId === rule.id;
              return (
                <TouchableOpacity
                  key={rule.id}
                  style={[styles.ruleItem, isSelected && styles.ruleItemActive]}
                  onPress={() => onSelectRule(rule)}
                >
                  <Text style={[styles.ruleItemType, isSelected && styles.ruleItemActiveText]}>
                    {rule.type || rule.tipo}
                  </Text>
                  <Text style={[styles.ruleItemDesc, isSelected && styles.ruleItemActiveText]}>
                    {rule.descricao}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalScroll: {
    flexGrow: 0,
  },
  ruleItem: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 8,
  },
  ruleItemActive: {
    borderColor: '#004587',
    backgroundColor: '#f0f4f8',
  },
  ruleItemType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#eb8216',
    marginBottom: 4,
  },
  ruleItemDesc: {
    fontSize: 14,
    color: '#444',
  },
  ruleItemActiveText: {
    color: '#004587',
  },
  modalCloseButton: {
    marginTop: 16,
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RuleSelectionModal;

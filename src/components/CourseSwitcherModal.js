import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';

const CourseSwitcherModal = ({ visible, courses, activeCourseId, onSelectCourse, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Selecione o Curso</Text>
          {courses?.map((c) => {
            const isActive = c.id === activeCourseId;
            return (
              <TouchableOpacity
                key={c.id}
                style={[styles.modalItem, isActive && styles.modalItemActive]}
                onPress={() => onSelectCourse(c.id)}
              >
                <Text style={[styles.modalItemText, isActive && styles.modalItemTextActive]}>
                  {c.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Cancelar</Text>
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
    maxWidth: 320,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  modalItem: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 8,
    alignItems: 'center',
  },
  modalItemActive: {
    borderColor: '#004587',
    backgroundColor: '#f0f4f8',
  },
  modalItemText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  modalItemTextActive: {
    color: '#004587',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: 12,
    paddingVertical: 10,
  },
  modalCloseButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CourseSwitcherModal;

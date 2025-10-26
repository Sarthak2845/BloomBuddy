import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Switch,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
// import * as Notifications from 'expo-notifications'; // Removed due to Expo Go limitations
import Colors from '../constants/Colors';
import { getUserPlants } from '@/lib/services/plantService';

const { width } = Dimensions.get('window');

interface WateringReminder {
  id: string;
  plantName: string;
  plantId: string;
  frequency: number; // days
  nextWatering: Date;
  isActive: boolean;
  notificationId?: string;
}

export default function RemindersScreen() {
  const router = useRouter();
  const [reminders, setReminders] = useState<WateringReminder[]>([]);
  const [plants, setPlants] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<any>(null);
  const [frequency, setFrequency] = useState('3');
  const [nextWatering, setNextWatering] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadData();
    requestNotificationPermissions();
  }, []);

  const requestNotificationPermissions = async () => {
    // Notifications disabled in Expo Go - would work in production build
    console.log('Notifications would be requested in production build');
  };

  const loadData = async () => {
    try {
      // Load real user plants from Firestore
      const userPlants = await getUserPlants();
      setPlants(userPlants);
      
      // Load saved reminders (for now using demo data, but structure is ready for real storage)
      const savedReminders: WateringReminder[] = [];
      setReminders(savedReminders);
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to empty arrays
      setPlants([]);
      setReminders([]);
    }
  };

  const scheduleNotification = async (reminder: WateringReminder) => {
    try {
      // In production build, this would schedule actual notifications
      console.log(`Would schedule notification for ${reminder.plantName} on ${reminder.nextWatering}`);
      return `mock_notification_${Date.now()}`;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  };

  const addReminder = async () => {
    if (!selectedPlant) return;

    const newReminder: WateringReminder = {
      id: Date.now().toString(),
      plantName: selectedPlant.common_names?.[0] || selectedPlant.scientific_name,
      plantId: selectedPlant.id!,
      frequency: parseInt(frequency),
      nextWatering,
      isActive: true,
    };

    const notificationId = await scheduleNotification(newReminder);
    if (notificationId) {
      newReminder.notificationId = notificationId;
    }

    setReminders([...reminders, newReminder]);
    setShowAddModal(false);
    setSelectedPlant(null);
    setFrequency('3');
    setNextWatering(new Date());
  };

  const toggleReminder = async (id: string) => {
    const updatedReminders = reminders.map(reminder => {
      if (reminder.id === id) {
        const updated = { ...reminder, isActive: !reminder.isActive };
        
        if (updated.isActive) {
          // Reschedule notification
          scheduleNotification(updated);
        } else if (updated.notificationId) {
          // Cancel notification - would work in production build
          console.log(`Would cancel notification ${updated.notificationId}`);
        }
        
        return updated;
      }
      return reminder;
    });
    setReminders(updatedReminders);
  };

  const deleteReminder = (id: string) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this watering reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const reminder = reminders.find(r => r.id === id);
            if (reminder?.notificationId) {
              console.log(`Would cancel notification ${reminder.notificationId}`);
            }
            setReminders(reminders.filter(r => r.id !== id));
          }
        }
      ]
    );
  };

  const markAsWatered = (id: string) => {
    const updatedReminders = reminders.map(reminder => {
      if (reminder.id === id) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + reminder.frequency);
        
        const updated = { ...reminder, nextWatering: nextDate };
        
        // Reschedule notification
        if (updated.isActive) {
          scheduleNotification(updated);
        }
        
        return updated;
      }
      return reminder;
    });
    setReminders(updatedReminders);
  };

  const getDaysUntilWatering = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (days: number) => {
    if (days < 0) return Colors.error;
    if (days === 0) return Colors.warning;
    if (days <= 2) return Colors.accent;
    return Colors.success;
  };

  const getStatusText = (days: number) => {
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Water today!';
    if (days === 1) return 'Water tomorrow';
    return `Water in ${days} days`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      {/* Header */}
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Watering Reminders</Text>
            <Text style={styles.headerSubtitle}>Never forget to water your plants</Text>
          </View>

          <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addButton}>
            <Ionicons name="add" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {reminders.length === 0 ? (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            style={styles.emptyState}
          >
            <View style={styles.emptyIcon}>
              <Ionicons name="water-outline" size={60} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No Reminders Yet</Text>
            <Text style={styles.emptySubtitle}>
              Add watering reminders for your plants to keep them healthy and thriving.
            </Text>
            
            <TouchableOpacity style={styles.addFirstButton} onPress={() => setShowAddModal(true)}>
              <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.buttonGradient}>
                <Ionicons name="add-outline" size={20} color={Colors.white} />
                <Text style={styles.buttonText}>Add First Reminder</Text>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>
        ) : (
          <View style={styles.remindersList}>
            {reminders.map((reminder, index) => {
              const daysUntil = getDaysUntilWatering(reminder.nextWatering);
              const statusColor = getStatusColor(daysUntil);
              const statusText = getStatusText(daysUntil);

              return (
                <MotiView
                  key={reminder.id}
                  from={{ opacity: 0, translateX: -50 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: 'spring', damping: 15, delay: index * 100 }}
                  style={styles.reminderCard}
                >
                  <View style={styles.reminderHeader}>
                    <View style={styles.plantInfo}>
                      <Text style={styles.plantName}>{reminder.plantName}</Text>
                      <Text style={styles.frequency}>Every {reminder.frequency} days</Text>
                    </View>
                    
                    <Switch
                      value={reminder.isActive}
                      onValueChange={() => toggleReminder(reminder.id)}
                      trackColor={{ false: Colors.lightGray, true: Colors.primaryLight }}
                      thumbColor={reminder.isActive ? Colors.primary : Colors.gray}
                    />
                  </View>

                  <View style={styles.statusContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                      <Ionicons name="water" size={16} color={Colors.white} />
                      <Text style={styles.statusText}>{statusText}</Text>
                    </View>
                    
                    <Text style={styles.nextDate}>
                      Next: {reminder.nextWatering.toLocaleDateString()}
                    </Text>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => markAsWatered(reminder.id)}
                    >
                      <Ionicons name="checkmark-circle-outline" size={20} color={Colors.success} />
                      <Text style={[styles.actionText, { color: Colors.success }]}>Watered</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => deleteReminder(reminder.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color={Colors.error} />
                      <Text style={[styles.actionText, { color: Colors.error }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </MotiView>
              );
            })}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Add Reminder Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Watering Reminder</Text>
            
            <Text style={styles.inputLabel}>Select Plant</Text>
            <ScrollView style={styles.plantSelector} showsVerticalScrollIndicator={false}>
              {plants.length === 0 ? (
                <Text style={styles.noPlants}>No plants found. Add some plants first!</Text>
              ) : (
                plants.map((plant) => (
                  <TouchableOpacity
                    key={plant.id}
                    style={[
                      styles.plantOption,
                      selectedPlant?.id === plant.id && styles.selectedPlant
                    ]}
                    onPress={() => setSelectedPlant(plant)}
                  >
                    <Text style={styles.plantOptionName}>
                      {plant.common_names?.[0] || plant.scientific_name}
                    </Text>
                    <Text style={styles.plantOptionScientific}>{plant.scientific_name}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>

            <Text style={styles.inputLabel}>Watering Frequency (days)</Text>
            <TextInput
              style={styles.input}
              value={frequency}
              onChangeText={setFrequency}
              keyboardType="numeric"
              placeholder="3"
            />

            <Text style={styles.inputLabel}>Next Watering Date</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>{nextWatering.toLocaleDateString()}</Text>
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={nextWatering}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setNextWatering(selectedDate);
                  }
                }}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.addReminderButton, !selectedPlant && styles.disabledButton]}
                onPress={addReminder}
                disabled={!selectedPlant}
              >
                <LinearGradient
                  colors={!selectedPlant ? [Colors.gray, Colors.gray] : [Colors.primary, Colors.primaryLight]}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Add Reminder</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  addFirstButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  remindersList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  reminderCard: {
    backgroundColor: Colors.card,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  plantInfo: {
    flex: 1,
  },
  plantName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  frequency: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  nextDate: {
    fontSize: 14,
    color: Colors.textLight,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 25,
    width: width - 40,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
  },
  plantSelector: {
    maxHeight: 120,
    marginBottom: 20,
  },
  plantOption: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: Colors.lightGray,
  },
  selectedPlant: {
    backgroundColor: Colors.primaryLight,
  },
  plantOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  plantOptionScientific: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 20,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
  },
  dateText: {
    fontSize: 16,
    color: Colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  addReminderButton: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.6,
  },
  noPlants: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: 100,
  },
});
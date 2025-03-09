import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Trash2, CreditCard as Edit } from 'lucide-react-native';

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
}

export default function EntriesScreen() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const entriesData = await AsyncStorage.getItem('diaryEntries');
      if (entriesData) {
        setEntries(JSON.parse(entriesData).reverse());
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load diary entries');
    }
  };

  const deleteEntry = async (id: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedEntries = entries.filter(entry => entry.id !== id);
              await AsyncStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
              setEntries(updatedEntries);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete entry');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: DiaryEntry }) => (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.entryTitle}>{item.title}</Text>
      <Text style={styles.entryContent}>{item.content}</Text>
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/new-entry', params: { entry: JSON.stringify(item) } })}
          style={[styles.actionButton, styles.editButton]}>
          <Edit size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => deleteEntry(item.id)} 
          style={[styles.actionButton, styles.deleteButton]}>
          <Trash2 size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>DEAR DIARY</Text>
        <TouchableOpacity
          style={styles.newEntryButton}
          onPress={() => router.push('/new-entry')}>
          <Text style={styles.newEntryButtonText}>New Entry</Text>
        </TouchableOpacity>
      </View>
      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No entries yet. Start writing your thoughts!</Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => router.push('/new-entry')}>
            <Text style={styles.emptyStateButtonText}>Create First Entry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={entries}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  header: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#1e293b',
    letterSpacing: 1,
  },
  newEntryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  newEntryButtonText: {
    color: '#ffffff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  listContainer: {
    padding: 20,
  },
  entryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  entryHeader: {
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter_400Regular',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  editButton: {
    backgroundColor: '#6366f1',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  entryTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#1e293b',
    marginBottom: 8,
  },
  entryContent: {
    fontSize: 16,
    color: '#475569',
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#64748b',
    fontFamily: 'Inter_400Regular',
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
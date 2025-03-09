import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { Save, ArrowLeft } from 'lucide-react-native';

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
}

export default function NewEntryScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.entry) {
      const entryData = JSON.parse(params.entry as string) as DiaryEntry;
      setTitle(entryData.title);
      setContent(entryData.content);
      setIsEditing(true);
      setEditingId(entryData.id);
    }
  }, [params.entry]);

  const saveEntry = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    try {
      const existingEntries = await AsyncStorage.getItem('diaryEntries');
      let entries: DiaryEntry[] = existingEntries ? JSON.parse(existingEntries) : [];

      if (isEditing && editingId) {
        entries = entries.map(entry =>
          entry.id === editingId
            ? { ...entry, title, content, date: new Date().toISOString() }
            : entry
        );
        Alert.alert('Success', 'Entry updated successfully!');
      } else {
        const newEntry: DiaryEntry = {
          id: Date.now().toString(),
          title,
          content,
          date: new Date().toISOString(),
        };
        entries.push(newEntry);
        Alert.alert('Success', 'Entry posted successfully!');
      }

      await AsyncStorage.setItem('diaryEntries', JSON.stringify(entries));
      router.push('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to save entry');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{isEditing ? 'Edit Entry' : 'New Entry'}</Text>
        <TouchableOpacity onPress={saveEntry} style={styles.saveButton}>
          <Save size={20} color="#ffffff" />
          <Text style={styles.saveButtonText}>{isEditing ? 'Update' : 'Post'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.form}>
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#94a3b8"
        />
        <TextInput
          style={styles.contentInput}
          placeholder="Write your thoughts..."
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          placeholderTextColor="#94a3b8"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#1e293b',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  titleInput: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#1e293b',
    marginBottom: 20,
    padding: 0,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#475569',
    lineHeight: 24,
    minHeight: 200,
    padding: 0,
  },
});
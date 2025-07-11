import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Task } from '../types';

type TaskWithImage = Task & { imageUri?: string };

const initialTasks: TaskWithImage[] = [
  { id: '1', title: '買い物', completed: false, detail: '牛乳と卵を買う', imageUri: undefined },
  { id: '2', title: '掃除', completed: false, detail: 'リビングの掃除をする', imageUri: undefined },
  { id: '3', title: '勉強', completed: true, detail: 'React Nativeの勉強をする', imageUri: undefined },
  { id: '4', title: '運動', completed: false, detail: '', imageUri: undefined },
];

const HomeScreen: React.FC = () => {
  const [tasks, setTasks] = useState<TaskWithImage[]>(initialTasks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [editingDetail, setEditingDetail] = useState<string>('');
  const [editingImage, setEditingImage] = useState<string | undefined>(undefined);

  const startEdit = (id: string, title: string, detail: string, imageUri?: string) => {
    setEditingId(id);
    setEditingText(title);
    setEditingDetail(detail || '');
    setEditingImage(imageUri);
  };

  const saveEdit = (id: string) => {
    if (editingText.trim() === '') return;
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, title: editingText, detail: editingDetail, imageUri: editingImage } : task
    ));
    setEditingId(null);
    setEditingText('');
    setEditingDetail('');
    setEditingImage(undefined);
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingText('');
      setEditingDetail('');
      setEditingImage(undefined);
    }
  };

  // 新規タスク追加
  const addTask = () => {
    const newId = (Math.max(0, ...tasks.map(t => Number(t.id))) + 1).toString();
    setTasks([{ id: newId, title: '新しいタスク', completed: false, detail: '' }, ...tasks]);
    setEditingId(newId);
    setEditingText('新しいタスク');
    setEditingDetail('');
    setEditingImage(undefined);
  };

  // カメラで画像を撮影して添付
  const pickImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('カメラの許可が必要です');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setEditingImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              {editingId === item.id ? (
                <View style={{ flex: 1 }}>
                  <TextInput
                    style={styles.input}
                    value={editingText}
                    onChangeText={setEditingText}
                    autoFocus
                    placeholder="タスク名を入力"
                    onSubmitEditing={() => saveEdit(item.id)}
                  />
                  <TextInput
                    style={styles.detailInput}
                    value={editingDetail}
                    onChangeText={setEditingDetail}
                    placeholder="タスクの内容を入力"
                    multiline
                  />
                  {editingImage ? (
                    <Image source={{ uri: editingImage }} style={styles.image} />
                  ) : null}
                  <TouchableOpacity style={styles.cameraButton} onPress={pickImageFromCamera}>
                    <Text style={styles.cameraButtonText}>カメラで撮影して画像を添付</Text>
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', marginTop: 4 }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#4CAF50',
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 4,
                        marginRight: 8,
                      }}
                      onPress={() => saveEdit(item.id)}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>保存</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#aaa',
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 4,
                      }}
                      onPress={() => {
                        if (item.title === '') {
                          deleteTask(item.id);
                        } else {
                          setEditingId(null);
                          setEditingText('');
                          setEditingDetail('');
                          setEditingImage(undefined);
                        }
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>キャンセル</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.titleText, item.completed ? styles.completed : undefined]}>
                      {item.title ? item.title : '（タイトルなし）'}
                    </Text>
                    {item.detail ? (
                      <Text style={styles.detailText}>{item.detail}</Text>
                    ) : null}
                    {item.imageUri ? (
                      <Image source={{ uri: item.imageUri }} style={styles.image} />
                    ) : null}
                  </View>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => startEdit(item.id, item.title, item.detail || '', item.imageUri)}
                  >
                    <Text style={styles.editButtonText}>編集</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => toggleComplete(item.id)}
                  >
                    <Text style={styles.completeButtonText}>
                      {item.completed ? '未完了' : '完了'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteTask(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>削除</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
          inverted
        />
      </View>
      <TouchableOpacity
        style={{backgroundColor: '#f7ca88', padding: 14,borderRadius: 8, alignItems: 'center', marginTop:16}}
        onPress={addTask}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>タスク追加</Text>
      </TouchableOpacity>
      <View style={{ pointerEvents: 'none' }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', opacity:20 },
  taskItem: { flexDirection: 'row', alignItems: 'flex-start', padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  completed: { textDecorationLine: 'line-through', color: '#aaa' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4, marginBottom: 4 },
  detailInput: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4, minHeight: 40, marginBottom: 4 },
  titleText: { fontSize: 16, fontWeight: 'bold' },
  detailText: { fontSize: 14, color: '#555', marginTop: 2 },
  image: { width: 100, height: 100, marginTop: 8, borderRadius: 8 },
  cameraButton: { marginTop: 8, backgroundColor: '#888', padding: 8, borderRadius: 4, alignItems: 'center' },
  cameraButtonText: { color: '#fff' },
  editButton: { marginLeft: 8, backgroundColor: '#FF9800', padding: 6, borderRadius: 4, alignSelf: 'center' },
  editButtonText: { color: '#fff' },
  completeButton: { marginLeft: 8, backgroundColor: '#f57542', padding: 6, borderRadius: 4, alignSelf: 'center' },
  completeButtonText: { color: '#fff' },
  deleteButton: { marginLeft: 8, backgroundColor: '#F44336', padding: 6, borderRadius: 4, alignSelf: 'center' },
  deleteButtonText: { color: '#fff' }
});

export default HomeScreen;
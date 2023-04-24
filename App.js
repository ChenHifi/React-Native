import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function App() {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [doneList, setDoneList] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);

  //créer une tâche
  const addTask = () => {
    setTaskList([...taskList, { title: task, done: false }]);
    setTask('');
  };

  //supprimer une tâche
  const deleteTask = (index) => {
    Alert.alert(
      'Supprimer',
      'Voulez-vous supprimer définitivement cette tâche de votre historique ?',
      [
        {
          text: 'Retour',
          style: 'retour',
        },
        {
          text: 'Supprimer',
          onPress: () => {
            const newDoneList = [...doneList];
            newDoneList.splice(index, 1);
            setDoneList(newDoneList);
          },
        },
        {
          text: 'Récupérer',
          onPress: () => {
            const taskToMove = doneList[index];
            const newTaskList = [...taskList, taskToMove];
            const newDoneList = doneList.filter((item) => item.title !== taskToMove.title);
            setTaskList(newTaskList);
            setDoneList(newDoneList);
            setCompletedCount(completedCount - 1);
          },
        },
      ],
      { cancelable: true }
    );
  };

  // bascule l'état d'une tâche met à jour les listes correspondantes.
  const toggleTask = (index) => {
    if (index < 0 || index >= taskList.length) {
      return;
    }
  
    const newTaskList = [...taskList];
    const task = newTaskList[index];
    task.done = !task.done;
    if (task.done) {
      setDoneList([...doneList, task]);
      setCompletedCount(completedCount + 1);
      newTaskList.splice(index, 1);
      setTaskList(newTaskList);
    } else {
      setTaskList(newTaskList);
      setDoneList(doneList.filter((item) => item.title !== task.title));
      setCompletedCount(completedCount - 1);
    }
  };

  //barre de navigation 
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Créer une tâche">
          {() => (
            <View style={styles.container}>
              <Text style={styles.title}>A Faire</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Nouvelle Tâche"
                  value={task}
                  onChangeText={setTask}
                />
                <TouchableOpacity style={styles.addButton} onPress={addTask}>
              <Text style={styles.addButtonText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.taskList}>
            {taskList.map((task, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.task, task.done && styles.doneTask]}
                onPress={() => toggleTask(index)}
                onLongPress={() => deleteTask(index)}
              >
                <Text style={styles.taskText}>{task.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <StatusBar style="auto" />
        </View>
      )}
    </Tab.Screen>
    <Tab.Screen name="Tâches Complétées">
      {() => (
        <View style={styles.container}>
          <Text style={styles.title}>Tâches Complétées</Text>
          <Text style={styles.completedCount}>{completedCount} tâches complétées</Text>
          <View style={styles.taskList}>
            {doneList.map((task, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.task, styles.doneTask]}
                onPress={() => deleteTask(index)}
              >
                <Text style={styles.taskText}>{task.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <StatusBar style="auto" />
        </View>
      )}
    </Tab.Screen>
  </Tab.Navigator>
</NavigationContainer>
);
}

//style de l'application 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#0080ff',
    borderRadius: 4,
    padding: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  taskList: {
    width: '100%',
    paddingHorizontal: 20,
  },
  task: {
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  doneTask: {
    backgroundColor: '#d9d9d9',
  },
  taskText: {
    fontSize: 16,
  },
  completedCount: {
    marginBottom: 10,
  },
});

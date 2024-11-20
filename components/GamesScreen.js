import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Image, Modal, TouchableOpacity, FlatList, TextInput, Button } from 'react-native';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { firestore } from "../firebaseConfig"


export default function GamesScreen() {
  const [gameTitle, setGameTitle] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [gameImageUrl, setGameImageUrl] = useState("");
  const [games, setGames] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        console.log(firestore);
        const gamesCollection = collection(firestore, "games");
        const gamesSnapshot = await getDocs(gamesCollection);
        const gamesList = gamesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGames(gamesList);
      } catch (error) {
        console.error("Error loading games: ", error);
      }
    };
    fetchGames();
  }, []);

  const handleAddGame = async () => {
    if (gameTitle != "" && gameDescription != "" && gameImageUrl != "") {
      const newGame = {
        title: gameTitle,
        description: gameDescription,
        imageUrl: gameImageUrl
      };
      const docRef = await addDoc(collection(firestore, "games"), newGame);
      setGames([...games, { id: docRef.id, ...newGame }]);
      setGameTitle("");
      setGameDescription("");
      setGameImageUrl("");
      Alert.alert("Igrica dodana u bazu podataka.")
    } else {
      Alert.alert("Morate unijeti sva polja.");
    }
  };

  const renderGameItem = ({ item }) => (
    <View style={styles.gameItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.gameImage} />
      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle}>{item.title}</Text>
        <Text style={styles.gameDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dobrodošli u sekciju Igrice!</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Dodaj Igru</Text>
      </TouchableOpacity>

      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={renderGameItem}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Dodaj Igru</Text>
            <TextInput
              placeholder="Naslov"
              style={styles.input}
              value={gameTitle}
              onChangeText={setGameTitle}
            />
            <TextInput
              placeholder="Opis"
              style={styles.input}
              value={gameDescription}
              onChangeText={setGameDescription}
              multiline
            />
            <TextInput
              placeholder="URL slike"
              style={styles.input}
              value={gameImageUrl}
              onChangeText={setGameImageUrl}
            />
            <Button title="Dodaj" onPress={handleAddGame} />
            <Button title="Zatvori" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  text: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  addButton: { backgroundColor: 'navy', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 20 },
  addButtonText: { color: 'white', fontSize: 16 },
  gameItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 },
  gameImage: { width: 60, height: 60, borderRadius: 5, marginRight: 10 },
  gameInfo: { flex: 1 },
  gameTitle: { fontSize: 18, fontWeight: 'bold' },
  gameDescription: { fontSize: 14, color: '#555' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 }
});

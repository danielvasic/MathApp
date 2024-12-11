import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { auth, firestore } from "../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";



const GameOneScreen = () => {
    const [numbers, setNumbers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sum, setSum] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [message, setMessage] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const [userPoints, setUserPoints] = useState(0);

    useEffect(() => {
        const fetchUserPoints = async () => {
            try {
                const userId = auth.currentUser.uid;
                const userDocRef = doc(firestore, "users", userId);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setUserPoints(userDoc.data().points || 0);
                } else {
                    console.error("User document does not exist");
                }
            } catch (error) {
                console.error("Error fetching user points:", error);
            }
        };

        fetchUserPoints();
    }, []);

    const startGame = () => {
        setGameStarted(true);
        generateRandomNumbers();
    };

    useEffect(() => {
        if (currentIndex < numbers.length) {
            const timer = setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
            }, 800);
            return () => clearTimeout(timer);
        } else {
            setShowInput(true);
        }
    }, [currentIndex, numbers]);

    const generateRandomNumbers = () => {
        const nums = [];
        let previousNum = null;
        for (let i = 0; i < 10; i++) {
            let newNum;
            do {
                newNum = Math.floor(Math.random() * 10);
            } while (newNum === previousNum);
            nums.push(newNum);
            previousNum = newNum;
        }
        setNumbers(nums);
        setSum(nums.reduce((acc, num) => acc + num, 0));
        setCurrentIndex(0);
        setShowInput(false);
        setUserInput('');
        setMessage('');
    };

    const handleInputChange = (text) => {
        setUserInput(text);
    };

    const handleSubmit = () => {
        const userSum = parseInt(userInput, 10);
        if (userSum === sum) {
            setMessage('Točan odgovor, bravo samo tako nastavi!');
            updateUserPoints(5); // Add 5 points for correct answer
        } else {
            setMessage('Netočan odgovor, pokušaj ponovo!');
            updateUserPoints(-7); // Deduct 7 points for incorrect answer
        }
    };


    const updateUserPoints = async (pointsChange) => {
        try {
            const userId = auth.currentUser.uid; // Get the current user ID
            const userDocRef = doc(firestore, "users", userId);
            
            // Fetch the current user document to get the existing points
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const currentPoints = userDoc.data().points || 0; // Default to 0 if points don't exist
                const newPoints = currentPoints + pointsChange;
                // Update the points in the local state
                setUserPoints(newPoints);
                // Update the points in Firestore
                await updateDoc(userDocRef, { points: newPoints });

                console.log(`User points updated to: ${newPoints}`);
            } else {
                console.error("User document does not exist");
            }
        } catch (error) {
            console.error("Error updating user points:", error);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.pointsText}>Vaši bodovi: {userPoints}</Text>
            {!gameStarted ? (
                <TouchableOpacity onPress={startGame} style={styles.startButton}>
                    <Text style={styles.startText}>Započni igricu</Text>
                </TouchableOpacity>
            ) : currentIndex < numbers.length ? (
                <Text style={styles.number}>{numbers[currentIndex]}</Text>
            ) : showInput ? (
                <View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder='Unesite zbroj brojeva'
                            style={styles.input}
                            keyboardType="numeric"
                            value={userInput}
                            onChangeText={handleInputChange}
                        />
                        <TouchableOpacity onPress={handleSubmit} style={styles.iconButton}>
                            <Icon name="checkmark-circle-outline" size={30} color="green" />
                        </TouchableOpacity>
                    </View>
                    {message ? <Text style={styles.message}>{message}</Text> : null}
                    <TouchableOpacity onPress={generateRandomNumbers} style={styles.restartButton}>
                        <Icon name="refresh-outline" size={30} color="blue" />
                        <Text style={styles.restartText}>Restart</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pointsText: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    number: {
        fontSize: 96,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 0,
        textAlign: 'center',
        flex: 1,
    },
    iconButton: {
        marginLeft: 10,
    },
    message: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    restartButton: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    restartText: {
        marginLeft: 5,
        fontSize: 18,
        color: 'blue',
    },
    startButton: {
        padding: 10,
        backgroundColor: 'green',
        borderRadius: 5,
    },
    startText: {
        color: 'white',
        fontSize: 18,
    },
});

export default GameOneScreen;
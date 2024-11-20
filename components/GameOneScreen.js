import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const GameOneScreen = () => {
    const [numbers, setNumbers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sum, setSum] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [message, setMessage] = useState('');
    const [gameStarted, setGameStarted] = useState(false);

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
        } else {
            setMessage('Netočan odgovor, pokušaj ponovo!');
        }
    };

    return (
        <View style={styles.container}>
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
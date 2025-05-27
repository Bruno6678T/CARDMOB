import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, TextInput, FlatList } from 'react-native';

import ScrollViewExample from './components/ScrollViewExample';

export default function App() {
  
  const baseUrl = 'http://10.81.205.50:3000'
  
  const getItems = () => {
    const response = fetch(`${baseUrl}/items`);
    console.log(response.body)
  }

  return (
    <View style={styles.container}>
      <Button onPress={getItems} title="Buscar">
        buscar dados
      </Button>
      <ScrollViewExample />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 600,
    marginTop: 150,
  }
  
});
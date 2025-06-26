import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, TextInput, FlatList, Alert, ActivityIndicator } from 'react-native';

// Indicar o endereço do backend. SUBSTITUA 'SEU_IP_AQUI' PELO IP DA SUA MÁQUINA.
const BASE_URL = 'http://10.81.205.35:3000'; // Mantenha a porta 3000 se for a padrão do json-server

export default function App() {
  const [comprasList, setComprasList] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(''); // Quantidade como string para o TextInput

  const [editItemId, setEditItemId] = useState(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemQuantity, setEditItemQuantity] = useState('');

  const [loading, setLoading] = useState(false);

  // Buscar todos os itens da lista de compras.
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/compras`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // console.log('Dados recebidos do backend:', JSON.stringify(data)); // debug
      setComprasList(data);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
      Alert.alert("Erro", "Não foi possível buscar os itens da lista de compras. Verifique o console para mais detalhes e se o backend está rodando no IP/porta corretos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // CREATE - Adicionar um novo item à lista de compras
  const addItem = async () => {
    if (itemName.trim() === '' || itemQuantity.trim() === '') {
      Alert.alert("Atenção", "Nome do item e quantidade são obrigatórios.");
      return;
    }
    // Validação simples para garantir que a quantidade é um número
    const quantity = parseInt(itemQuantity.trim(), 10);
    if (isNaN(quantity) || quantity <= 0) {
        Alert.alert("Atenção", "A quantidade deve ser um número maior que zero.");
        return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/compras`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item: itemName.trim(), quantidade: quantity }),
      });
      if (response.ok) {
        await fetchItems(); // Rebusca os itens para atualizar a lista
        setItemName('');
        setItemQuantity('');
      } else {
        console.error('Falha ao adicionar item:', response.status);
        Alert.alert("Erro", `Falha ao adicionar item. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      Alert.alert("Erro", "Ocorreu um erro ao adicionar o item.");
    } finally {
      setLoading(false);
    }
  };

  // Prepara para edição
  const startEditItem = (item) => {
    setEditItemId(item.id);
    setEditItemName(item.item);
    setEditItemQuantity(String(item.quantidade)); // Converte para string para o TextInput
  };

  // UPDATE - Atualizar um item existente
  const updateItem = async () => {
    if (editItemName.trim() === '' || editItemQuantity.trim() === '') {
        Alert.alert("Atenção", "Nome do item e quantidade são obrigatórios para atualização.");
        return;
    }
    const quantity = parseInt(editItemQuantity.trim(), 10);
    if (isNaN(quantity) || quantity <= 0) {
        Alert.alert("Atenção", "A quantidade deve ser um número maior que zero para atualização.");
        return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/compras/${editItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item: editItemName.trim(), quantidade: quantity }),
      });
      if (response.ok) {
        await fetchItems();
        setEditItemId(null);
        setEditItemName('');
        setEditItemQuantity('');
      } else {
        console.error('Falha ao atualizar item:', response.status);
        Alert.alert("Erro", `Falha ao atualizar item. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      Alert.alert("Erro", "Ocorreu um erro ao atualizar o item.");
    } finally {
      setLoading(false);
    }
  };

  // DELETE - Remover um item da lista
  const deleteItem = async (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja excluir este item?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await fetch(`${BASE_URL}/compras/${id}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                await fetchItems();
              } else {
                console.error('Falha ao excluir item:', response.status);
                Alert.alert("Erro", `Falha ao excluir item. Status: ${response.status}`);
              }
            } catch (error) {
              console.error('Erro ao excluir item:', error);
              Alert.alert("Erro", "Ocorreu um erro ao excluir o item.");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

 // READ -> Renderiza cada item da lista de compras ou o formulário de edição
 const renderItem = ({ item: compraItem }) => { // Renomeado 'item' para 'compraItem' para clareza
  if (compraItem.id === editItemId) {
    // Item está sendo editado
    return (
      <View style={styles.itemContainer}>
        <TextInput
          style={[styles.input, styles.editInput]}
          placeholder="Nome do Item"
          onChangeText={setEditItemName}
          value={editItemName}
          autoFocus
        />
        <TextInput
          style={[styles.input, styles.editInput, styles.quantityInputEdit]}
          placeholder="Qtde"
          onChangeText={setEditItemQuantity}
          value={editItemQuantity}
          keyboardType="numeric"
        />
        <View style={styles.buttonGroup}>
          <Button title="Salvar" onPress={updateItem} color="#4CAF50" />
          <View style={styles.buttonSpacer} />
          <Button title="Cancelar" onPress={() => setEditItemId(null)} color="#f44336" />
        </View>
      </View>
    );
  } else {
    // Exibição normal do item
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemNameText}>{compraItem.item}</Text>
          <Text style={styles.itemQuantityText}>Qtde: {compraItem.quantidade}</Text>
        </View>
        <View style={styles.buttonGroup}>
          <Button title="Editar" onPress={() => startEditItem(compraItem)} color="#2196F3" />
          <View style={styles.buttonSpacer} />
          <Button title="Excluir" onPress={() => deleteItem(compraItem.id)} color="#f44336" />
        </View>
      </View>
    );
  }
};

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.mainTitle}>Lista de Compras App</Text>

      {/* Seção de Inputs para adicionar novo item */}
      <View style={styles.addFormContainer}>
        <TextInput
          style={[styles.input, styles.nameInput]}
          value={itemName}
          onChangeText={setItemName}
          placeholder='Nome do Item'
        />
        <TextInput
          style={[styles.input, styles.quantityInput]}
          value={itemQuantity}
          onChangeText={setItemQuantity}
          placeholder='Qtde'
          keyboardType="numeric"
        />
        <Button
          title='Adicionar Item'
          onPress={addItem}
          disabled={loading}
          color="#007BFF"
        />
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />}

      <FlatList
        data={comprasList}
        renderItem={renderItem}
        keyExtractor={compra => compra.id ? compra.id.toString() : Math.random().toString()} // Chave robusta
        style={styles.list}
        ListEmptyComponent={<Text style={styles.emptyListText}>Nenhum item na lista ainda.</Text>}
      />

      {/* Elementos extras solicitados */}
      <Text style={styles.extraText}>teste</Text>
      <Image
        source={{ uri: "https://picsum.photos/200" }}
        style={styles.extraImage}
      />
    </View>
  );
}
  
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      marginTop: 60,
    },
    text: {
      fontSize: 24,
    },
    buttonContainer: {
      flexDirection: 'row',
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    list: {
      marginTop: 20,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
      padding: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 5,
    },
    itemText: {
      flex: 1,
      marginRight: 10,
    },
    buttons: {
      flexDirection: 'row',
    },
    editInput: {
      flex: 1,
      marginRight: 10,
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 10,
    }
  });
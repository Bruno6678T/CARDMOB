import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Image,
  Button, 
  TextInput, 
  FlatList, 
  Alert, 
  ActivityIndicator, 
  TouchableOpacity,
  StatusBar
} from 'react-native';

// Indicar o endereço do backend. SUBSTITUA 'SEU_IP_AQUI' PELO IP DA SUA MÁQUINA.
// Exemplo no emulador Android: 'http://10.0.2.2:3000'
// Exemplo no dispositivo físico: 'http://192.168.1.10:3000'
const BASE_URL = 'http://10.81.205.35:5000';

export default function App() {
  // --- Estados para a lista e formulários ---
  const [productsList, setProductsList] = useState([]);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const [editProductId, setEditProductId] = useState(null);
  const [editProductName, setEditProductName] = useState('');
  const [editProductDescription, setEditProductDescription] = useState('');
  const [editProductPrice, setEditProductPrice] = useState('');

  const [loading, setLoading] = useState(false);

  // --- (v1) READ: Buscar todos os produtos do backend ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/catalog?page=1`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.catalog)
      setProductsList(data.catalog);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      Alert.alert("Erro", "Não foi possível carregar os produtos. Verifique o console e se o backend está rodando no IP/porta corretos.");
    } finally {
      setLoading(false);
    }
  };

  // Carrega os produtos ao iniciar o app
  useEffect(() => {
    fetchProducts();
  }, []);

  // --- (v1) CREATE: Adicionar um novo produto ---
  const addProduct = async () => {
    if (productName.trim() === '' || productPrice.trim() === '') {
      Alert.alert("Atenção", "Nome do produto e Preço são obrigatórios.");
      return;
    }
    const price = parseFloat(productPrice.trim().replace(',', '.'));
    if (isNaN(price) || price < 0) {
      Alert.alert("Atenção", "O preço deve ser um número válido.");
      return;
    }

    setLoading(true);
    const newProduct = {
      name: productName.trim(),
      description: productDescription.trim(),
      price: price,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/catalog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (response.status === 201) {
        await fetchProducts(); // Rebusca os produtos para atualizar a lista
        setProductName('');
        setProductDescription('');
        setProductPrice('');
      } else {
        throw new Error(`Falha ao adicionar produto. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      Alert.alert("Erro", `Ocorreu um erro ao adicionar o produto: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Funções de Edição ---
  // Prepara o formulário de edição com os dados do produto selecionado
  const startEditProduct = (product) => {
    setEditProductId(product.id);
    setEditProductName(product.name);
    setEditProductDescription(product.description || '');
    setEditProductPrice(String(product.price));
  };

  // Cancela a edição
  const cancelEdit = () => {
    setEditProductId(null);
  };

 // --- (v2) UPDATE: Atualizar um produto existente (usando PATCH) ---
 const updateProduct = async () => {
  if (editProductName.trim() === '' || editProductPrice.trim() === '') {
    Alert.alert("Atenção", "Nome e Preço são obrigatórios para atualização.");
    return;
  }
  const price = parseFloat(editProductPrice.trim().replace(',', '.'));
  if (isNaN(price) || price < 0) {
    Alert.alert("Atenção", "O preço para atualização deve ser um número válido.");
    return;
  }

  setLoading(true);
  const updatedProduct = {
    name: editProductName.trim(),
    description: editProductDescription.trim(),
    price: price,
  };

  try {
    const response = await fetch(`${BASE_URL}/api/catalog/${editProductId}`, {
      method: 'PATCH', // REQUISITO: Usar PATCH para atualização
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    });
    if (response.ok) {
      await fetchProducts();
      cancelEdit(); // Limpa os campos de edição
    } else {
      throw new Error(`Falha ao atualizar produto. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    Alert.alert("Erro", `Ocorreu um erro ao atualizar o produto: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  // --- (v2) DELETE: Remover um produto da lista ---
  const deleteProduct = async (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await fetch(`${BASE_URL}/api/catalog/${id}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                await fetchProducts();
              } else {
                throw new Error(`Falha ao excluir produto. Status: ${response.status}`);
              }
            } catch (error) {
              console.error('Erro ao excluir produto:', error);
              Alert.alert("Erro", `Ocorreu um erro ao excluir o produto: ${error.message}`);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // --- Renderização de cada item da lista ---
  const renderItem = ({ item: product }) => {
    // Se o item está sendo editado, mostra o formulário de edição
    if (product.id === editProductId) {
      return (
        <View style={styles.itemContainer}>
          <Text style={styles.editTitle}>Editando Produto</Text>
          <TextInput style={styles.input} placeholder="Nome do Produto" onChangeText={setEditProductName} value={editProductName} />
          <TextInput style={styles.input} placeholder="Descrição" onChangeText={setEditProductDescription} value={editProductDescription} />
          <TextInput style={styles.input} placeholder="Preço" onChangeText={setEditProductPrice} value={editProductPrice} keyboardType="numeric" />
          <View style={styles.buttonGroup}>
            <Button title="Salvar" onPress={updateProduct} color="#4CAF50" />
            <View style={styles.buttonSpacer} />
            <Button title="Cancelar" onPress={cancelEdit} color="#f44336" />
          </View>
        </View>
      );
    }
    // Senão, mostra a visualização normal do item
    return (
      <View style={styles.itemContainer}>
        {/* Adicionado o componente Image */}
        {product.image ? (
          <Image 
            source={{ uri: product.image }} 
            style={styles.productImage} 
            // Fallback para caso a imagem não carregue
            onError={() => console.warn(`Imagem não encontrada para o produto: ${product.name}`)}
          />
        ) : null}
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemNameText}>{product.name}</Text>
          <Text style={styles.itemDescriptionText}>{product.description}</Text>
          <Text style={styles.itemPriceText}>R$ {Number(product.price).toFixed(2)}</Text>
        </View>
        <View style={styles.buttonGroup}>
          <Button title="Editar" onPress={() => startEditProduct(product)} color="#2196F3" />
          <View style={styles.buttonSpacer} />
          <Button title="Excluir" onPress={() => deleteProduct(product.id)} color="#f44336" />
        </View>
      </View>
    );
  };

  // --- JSX Principal do Componente ---
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.mainTitle}>Catálogo de Produtos</Text>

      {/* Formulário para adicionar novo produto */}
      <View style={styles.addFormContainer}>
        <TextInput style={styles.input} value={productName} onChangeText={setProductName} placeholder='Nome do Produto' />
        <TextInput style={styles.input} value={productDescription} onChangeText={setProductDescription} placeholder='Descrição' />
        <TextInput style={styles.input} value={productPrice} onChangeText={setProductPrice} placeholder='Preço (ex: 49.99)' keyboardType="numeric" />
        <TouchableOpacity style={styles.addButton} onPress={addProduct} disabled={loading}>
            <Text style={styles.addButtonText}>Adicionar Produto</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />}

      <FlatList
        data={productsList}
        renderItem={renderItem}
        keyExtractor={product => product.id ? product.id.toString() : Math.random().toString()}
        style={styles.list}
        ListEmptyComponent={<Text style={styles.emptyListText}>Nenhum produto cadastrado.</Text>}
      />
  </View>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#f5f5f5',
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  addFormContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#fafafa',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingIndicator: {
    marginVertical: 15,
  },
  list: {
    marginTop: 10,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  productImage: { // Estilo para a imagem do produto
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#eee', // Cor de fundo enquanto a imagem carrega
  },
  itemTextContainer: {
    marginBottom: 10,
  },
  itemNameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDescriptionText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  itemPriceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  buttonSpacer: {
    width: 10,
  },
  editTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

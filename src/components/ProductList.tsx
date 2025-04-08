import React, { useState } from "react";
import ProductCard from "./ProductCard";

interface Product {
    id: number;
    name: string;
    price: number;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([
        { id: 1, name: 'Notebook', price: 2500.00 },
        { id: 2, name: 'Smartphone', price: 1500.00 },
        { id: 3, name: 'Tablet', price: 1200.00 }
    ]);
    const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({ name: '', price: 0 });

    const handleAddToCart = (product: Product) => {
        alert(`Produto ${product.name} adicionado ao carrinho!`);
    };

    const handleDelete = (id: number) => {
        setProducts(products.filter(product => product.id !== id));
    };

    const handleAddProduct = () => {
        if (newProduct.name && newProduct.price > 0) {
            setProducts([...products, {...newProduct, id: Date.now() }]);
            setNewProduct({ name: '', price: 0 });
        }
    };
    
    return (
        <div>
            <h2>Lista de Produtos</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {products.map(product => (
                    <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onDelete={handleDelete}
                    />
                ))}
            </div>
            
            <div style={{ marginTop: '24px' }}>
                <h3>Adicionar Novo Produto</h3>
                <input
                type="text"
                placeholder="Nome do produto"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
                <input
                type="number"
                placeholder="Preço"
                value={newProduct.price || ''}
                onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                style={{ marginLeft: '8px' }}
                />
                <button onClick={handleAddProduct} style={{ marginLeft: '8px' }}>
                    Adicionar Produto
                </button>
            </div>
        </div>
    );
};

export default ProductList;
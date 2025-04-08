import React from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
}

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onDelete: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onDelete }) => {
    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            margin: '8px',
            width: '200px'
        }}>
            <h3>{product.name}</h3>
            <p>Preço: R${product.price.toFixed(2)}</p>
            <button onClick={() => onAddToCart(product)}>Adicionar ao Carrinho</button>
            <button onClick={() => onDelete(product.id)} style={{ marginLeft: '8px', backgroundColor: '#ff4444'}}>
                Remover
            </button>
        </div>
    );
};

export default ProductCard;
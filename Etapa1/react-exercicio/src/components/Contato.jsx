import React from 'react';

const Contato = ({ contato, onDelete, onEdit }) => {
    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '5px'}}>
            <h3>{contato.nome}</h3>
            <p>Telefone: {contato.telefone}</p>
            <button onClick={() => onEdit(contato.id)}>Editar</button>
            <button onClick={() => onDelete(contato.id)}>Excluir</button>
        </div>
    );
};

export default Contato;
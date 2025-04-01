import React, { useState } from 'react';
import Contato from './Contato';

const ListaContatos = () => {
    const [contatos, setContatos] = useState([
        { id: 1, nome: 'João Silva', telefone: '(11) 9999-9999'},
        { id: 2, nome: 'Maria Souza', telefone: '(11) 8888-8888'}
    ]);

    const [novoContato, setNovoContato] = useState({ nome: '', telefone: '' });
    const [editando, setEditando] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNovoContato({ ...novoContato, [name]: value });
    };

    const adicionarContato = () => {
        if (novoContato.nome.trim() === '' || novoContato.telefone.trim() === '') return;

        if (editando) {
            setContatos(contatos.map(contato =>
                contato.id === editando ? novoContato : contato
            ));
            setEditando(null);
        } else {
            setContatos([...contatos, { ...novoContato, id: Date.now() }]);
        }

        setNovoContato({ nome: '', telefone: '' });
    };

    const editarContato = (id) => {
        const contato = contatos.find(c => c.id === id);
        setNovoContato({ nome: contato.nome, telefone: contato.telefone });
        setEditando(id);
    };

    const excluirContato = (id) => {
        setContatos(contatos.filter(contato => contato.id !== id));
    };

    return (
        <div>
            <h2>Lista de Contatos</h2>

            <div>
            <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={novoContato.nome}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="telefone"
                placeholder="Telefone"
                value={novoContato.telefone}
                onChange={handleInputChange}
            />
            <button onClick={adicionarContato}>
                {editando ? 'Atualizar' : 'Adicionar'}
            </button>
        </div>

    
    {contatos.map(contato => (
        <Contato
            key={contato.id}
            contato={contato}
            onDelete={excluirContato}
            onEdit={editarContato}
            />
        ))}
    </div>
    )
}

export default ListaContatos;
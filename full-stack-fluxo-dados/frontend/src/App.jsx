import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [nome, setNome] = useState('');
    const [foto, setFoto] = useState(null);
    const [curriculo, setCurriculo] = useState(null);
    const [perfis, setPerfis] = useState([]);
    
    // Estado adicional para o Desafio 2 (Preview Visual)
    const [fotoPreview, setFotoPreview] = useState('');

    const carregarPerfis = async () => {
        try {
            const response = await axios.get('http://localhost:3001/perfis');
            setPerfis(response.data);
        } catch (error) {
            console.error('Erro ao sincronizar e carregar perfis:', error);
        }
    };

    const ver_error = async () => {
        try {
            const error = await axios.get('http://localhost:3001/error');
            if (error.data.error) {
                alert(`Erro registrado: ${error.data.error}`);
            } else {
                alert(error.data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        carregarPerfis();
    }, []);

    // Função que gerencia a troca da foto e gera o preview temporário (Desafio 2)
    const handleFotoChange = (e) => {
        const arquivo = e.target.files[0];
        if (arquivo) {
            setFoto(arquivo);
            // URL.createObjectURL gera um link temporário apontando para a memória local
            setFotoPreview(URL.createObjectURL(arquivo));
        } else {
            setFoto(null);
            setFotoPreview('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nome', nome);
        if (foto) formData.append('foto', foto);
        if (curriculo) formData.append('curriculo', curriculo);

        try {
            const response = await axios.post('http://localhost:3001/perfil', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            alert('Perfil criado e persistido com absoluto sucesso!');
            
            // Sucesso: Reseta os estados e limpa a tela de forma correta
            setNome('');
            setFoto(null);
            setCurriculo(null);
            setFotoPreview(''); // Remove o preview da tela imediatamente

            // Limpa fisicamente os inputs de arquivos do DOM para que fiquem vazios
            document.getElementById('input-foto').value = '';
            document.getElementById('input-curriculo').value = '';

            carregarPerfis();
        } catch (error) {
            console.error(error);
            // Se o backend retornou um erro estruturado de validação de tamanho/tipo
            if (error.response && error.response.data && error.response.data.error) {
                alert(`Erro de Validação: ${error.response.data.error}`);
            } else {
                alert('Ocorreu um erro ao enviar os arquivos.');
            }
            ver_error();
        }
    };

    // Função para deletar fisicamente e logicamente o perfil (Desafio 3)
    const handleDeletarPerfil = async (id) => {
        if (!window.confirm("Deseja realmente excluir este perfil e apagar definitivamente os arquivos do servidor?")) {
            return;
        }

        try {
            await axios.delete(`http://localhost:3001/perfil/${id}`);
            alert('Perfil e mídias associadas foram destruídos com sucesso!');
            carregarPerfis(); // Atualiza a lista na tela
        } catch (error) {
            console.error(error);
            alert('Erro ao tentar remover o perfil do sistema.');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' }}>Criar Perfil Profissional</div>

            <form onSubmit={handleSubmit} style={{ display: 'block', maxWidth: '400px', marginBottom: '30px' }}>
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="text"
                        placeholder="Nome Completo do Profissional"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>Foto de Perfil (Imagem JPEG/PNG, max 2MB):</label>
                    <input
                        id="input-foto"
                        type="file"
                        accept="image/jpeg, image/png"
                        onChange={handleFotoChange}
                    />
                </div>

                {/* Bloco condicional do Preview Técnico (Desafio 2) */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>Preview da Imagem:</label>
                    {fotoPreview ? (
                        <img 
                            src={fotoPreview} 
                            alt="preview" 
                            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #1e3a8a', marginTop: '5px' }} 
                        />
                    ) : (
                        <div style={{ width: '120px', height: '120px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#9ca3af', borderRadius: '8px', border: '1px dashed #d1d5db', marginTop: '5px' }}>
                            Nenhuma foto
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>Currículo Impresso (Apenas PDF, max 2MB):</label>
                    <input
                        id="input-curriculo"
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setCurriculo(e.target.files[0])}
                    />
                </div>

                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Salvar Perfil Completo
                </button>
            </form>

            <hr />

            <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '20px', marginBottom: '15px' }}>Perfis Cadastrados no Banco</div>
            <div style={{ display: 'block' }}>
                {perfis.map(perfil => (
                    <div key={perfil.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>{perfil.nome}</div>
                            {perfil.foto_url && (
                                <img
                                    src={`http://localhost:3001${perfil.foto_url}`}
                                    alt={perfil.nome}
                                    style={{ width: '120px', height: '120px', objectFit: 'cover', display: 'block', marginBottom: '10px', borderRadius: '50%' }}
                                />
                            )}
                            {perfil.curriculo_url && (
                                <a
                                    href={`http://localhost:3001${perfil.curriculo_url}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: '#0056b3', textDecoration: 'underline', display: 'inline-block' }}
                                >
                                    Visualizar Currículo Cadastrado (PDF)
                                </a>
                            )}
                        </div>

                        {/* Botão de Exclusão Física Integrado (Desafio 3) */}
                        <button
                            onClick={() => handleDeletarPerfil(perfil.id)}
                            style={{ padding: '8px 15px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', height: 'fit-content' }}
                        >
                            Excluir Perfil
                        </button>
                    </div>
                ))}
                {perfis.length === 0 && <p style={{ color: '#6b7280' }}>Nenhum perfil cadastrado.</p>}
            </div>
        </div>
    );
}

export default App;

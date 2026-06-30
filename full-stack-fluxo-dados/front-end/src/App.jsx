import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [nome, setNome] = useState('');
    const [foto, setFoto] = useState(null);
    const [curriculo, setCurriculo] = useState(null);
    const [perfis, setPerfis] = useState([]);

    const carregarPerfis = async () => {
        try {
            const response = await axios.get('http://localhost:3001/perfis');
            setPerfis(response.data);
        } catch (error) {
            console.error('Erro ao sincronizar e carregar perfis:', error);
        }
    };

    useEffect(() => {
        carregarPerfis();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Instanciação obrigatória e crucial do FormData para empacotamento assíncrono
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('foto', foto);
        formData.append('curriculo', curriculo);

        try {
            await axios.post('http://localhost:3001/perfil', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Perfil criado e persistido com absoluto sucesso!');
            setNome('');
            carregarPerfis();
        } catch (error) {
            console.error(error);
            alert('Ocorreu um erro ao enviar os arquivos.');
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
                    <label style={{ display: 'block', fontWeight: 'bold' }}>Foto de Perfil (Imagem):</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFoto(e.target.files[0])}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>Currículo Impresso (PDF):</label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setCurriculo(e.target.files[0])}
                    />
                </div>

                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '5px' }}>Salvar Perfil Completo</button>
            </form>

            <hr />

            <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '20px', marginBottom: '15px' }}>Perfis Cadastrados no Banco</div>
            <div style={{ display: 'block' }}>
                {perfis.map(perfil => (
                    <div key={perfil.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '6px' }}>
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
                ))}
            </div>
        </div>
     );
}

export default App;
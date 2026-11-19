import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");

  // Estados do formulário de cadastro
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");

  // Estados para edição direta na tabela
  const [editandoId, setEditandoId] = useState(null);
  const [editNome, setEditNome] = useState("");
  const [editTelefone, setEditTelefone] = useState("");

  const [mensagem, setMensagem] = useState("");

  const carregarClientes = async (termo = "") => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/clientes?busca=${encodeURIComponent(termo)}`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setClientes(data);
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  useEffect(() => {
    carregarClientes(busca);
  }, [busca]);

  const handleCadastrar = async (e) => {
    e.preventDefault();
    setMensagem("");

    try {
      const response = await fetch("http://localhost:3001/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, cpf, telefone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensagem(data.message || data.error || "Erro ao cadastrar cliente.");
        return;
      }

      setMensagem(data.message || "Cliente cadastrado com sucesso!");
      setNome("");
      setCpf("");
      setTelefone("");
      carregarClientes(busca);
    } catch (error) {
      setMensagem("Erro de conexão ao cadastrar cliente.");
    }
  };

  const iniciarEdicao = (cliente) => {
    setEditandoId(cliente.id);
    setEditNome(cliente.nome);
    setEditTelefone(cliente.telefone);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditNome("");
    setEditTelefone("");
  };

  const salvarEdicao = async (id) => {
    setMensagem("");
    try {
      const response = await fetch(`http://localhost:3001/api/clientes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome: editNome, telefone: editTelefone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensagem(data.message || data.error || "Erro ao atualizar cliente.");
        return;
      }

      setMensagem(data.message || "Cliente atualizado com sucesso.");
      setEditandoId(null);
      carregarClientes(busca);
    } catch (error) {
      setMensagem("Erro ao atualizar cliente.");
    }
  };

  const handleExcluir = async (id) => {
    setMensagem("");
    try {
      const response = await fetch(`http://localhost:3001/api/clientes/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setMensagem(data.message || data.error || "Erro ao excluir cliente.");
        return;
      }

      setMensagem(data.message || "Cliente deletado com sucesso.");
      carregarClientes(busca);
    } catch (error) {
      setMensagem("Erro ao excluir cliente.");
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Gerenciamento de Clientes</h1>

      {mensagem && <p><strong>{mensagem}</strong></p>}

      <h2>Cadastrar Novo Cliente</h2>
      <form onSubmit={handleCadastrar}>
        <div>
          <label>Nome: </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label>CPF: </label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label>Telefone: </label>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit">Cadastrar Cliente</button>
      </form>

      <hr />

      <h2>Busca e Listagem de Clientes</h2>
      <div>
        <label>Buscar por nome: </label>
        <input
          type="text"
          placeholder="Digite para filtrar..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>
      <br />

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length === 0 ? (
            <tr>
              <td colSpan="4">Nenhum cliente encontrado.</td>
            </tr>
          ) : (
            clientes.map((cliente, index) => (
              <tr key={cliente.id ?? index}>
                <td>{cliente.id}</td>
                <td>
                  {editandoId === cliente.id ? (
                    <input
                      type="text"
                      value={editNome}
                      onChange={(e) => setEditNome(e.target.value)}
                    />
                  ) : (
                    cliente.nome
                  )}
                </td>
                <td>
                  {editandoId === cliente.id ? (
                    <input
                      type="text"
                      value={editTelefone}
                      onChange={(e) => setEditTelefone(e.target.value)}
                    />
                  ) : (
                    cliente.telefone
                  )}
                </td>
                <td>
                  {editandoId === cliente.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => salvarEdicao(cliente.id)}
                      >
                        Salvar
                      </button>{" "}
                      <button type="button" onClick={cancelarEdicao}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => iniciarEdicao(cliente)}
                      >
                        Editar
                      </button>{" "}
                      <button
                        type="button"
                        onClick={() => handleExcluir(cliente.id)}
                      >
                        Excluir
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}


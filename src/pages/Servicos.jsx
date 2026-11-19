import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";

export default function Servicos() {
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);

  const [clienteId, setClienteId] = useState("");
  const [tipoCorte, setTipoCorte] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [mensagem, setMensagem] = useState("");

  const carregarClientes = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/clientes");
      const data = await response.json();
      if (Array.isArray(data)) {
        setClientes(data);
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  };

  const carregarServicos = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/servicos");
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setServicos(data);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    }
  };

  useEffect(() => {
    carregarClientes();
    carregarServicos();
  }, []);

  const handleCadastrar = async (e) => {
    e.preventDefault();
    setMensagem("");

    try {
      const response = await fetch("http://localhost:3001/api/servicos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cliente_id: Number(clienteId),
          tipo_corte: tipoCorte,
          observacoes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensagem(data.message || data.error || "Erro ao cadastrar serviço.");
        return;
      }

      setMensagem(data.message || `Serviço cadastrado com sucesso (ID: ${data.id})!`);
      setClienteId("");
      setTipoCorte("");
      setObservacoes("");
      carregarServicos();
    } catch (error) {
      setMensagem("Erro de conexão ao cadastrar serviço.");
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Gerenciamento de Serviços do Cliente</h1>

      {mensagem && <p><strong>{mensagem}</strong></p>}

      <h2>Cadastrar Serviço Vinculado ao Cliente</h2>
      <form onSubmit={handleCadastrar}>
        <div>
          <label>Cliente: </label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            required
          >
            <option value="">Selecione um cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.id} - {cliente.nome} ({cliente.telefone})
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label>Tipo de Corte: </label>
          <input
            type="text"
            value={tipoCorte}
            onChange={(e) => setTipoCorte(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label>Observações: </label>
          <input
            type="text"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
        </div>
        <br />
        <button type="submit">Cadastrar Serviço</button>
      </form>

      <hr />

      <h2>Serviços Cadastrados</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente Vinculado</th>
            <th>Tipo de Corte</th>
            <th>Observações</th>
          </tr>
        </thead>
        <tbody>
          {servicos.length === 0 ? (
            <tr>
              <td colSpan="4">Nenhum serviço listado.</td>
            </tr>
          ) : (
            servicos.map((servico) => (
              <tr key={servico.id}>
                <td>{servico.id}</td>
                <td>{servico.cliente_nome}</td>
                <td>{servico.tipo_corte}</td>
                <td>{servico.observacoes}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}


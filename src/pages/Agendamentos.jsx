import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicos, setServicos] = useState([]);

  // Estados do formulário de novo agendamento
  const [dataHora, setDataHora] = useState("");
  const [servicoId, setServicoId] = useState("");

  // Estado para controlar a nova data em cada linha da tabela (mapeado por id do agendamento)
  const [novasDatas, setNovasDatas] = useState({});

  const [mensagem, setMensagem] = useState("");

  const usuarioSalvo = localStorage.getItem("usuario");
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

  const carregarAgendamentos = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/agendamentos");
      const data = await response.json();
      if (Array.isArray(data)) {
        setAgendamentos(data);
      }
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
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
    carregarAgendamentos();
    carregarServicos();
  }, []);

  const handleCadastrar = async (e) => {
    e.preventDefault();
    setMensagem("");

    if (!usuario || !usuario.id) {
      setMensagem("Usuário não identificado no localStorage. Faça login novamente.");
      return;
    }

    try {
      const dataFormatada = dataHora.replace("T", " ");
      const response = await fetch("http://localhost:3001/api/agendamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data_hora: dataFormatada,
          servico_id: Number(servicoId),
          usuario_id: Number(usuario.id),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensagem(data.message || data.error || "Erro ao criar agendamento.");
        return;
      }

      setMensagem(data.message || "Agendamento criado com sucesso!");
      setDataHora("");
      setServicoId("");
      carregarAgendamentos();
    } catch (error) {
      setMensagem("Erro de conexão ao criar agendamento.");
    }
  };

  const handleAtualizarData = async (id) => {
    setMensagem("");
    const novaData = novasDatas[id];

    if (!novaData) {
      setMensagem("Selecione uma nova data e hora antes de atualizar.");
      return;
    }

    try {
      const dataFormatada = novaData.replace("T", " ");
      const response = await fetch(
        `http://localhost:3001/api/agendamentos/${id}/data`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data_hora: dataFormatada }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMensagem(data.message || data.error || "Erro ao atualizar data.");
        return;
      }

      setMensagem(data.message || "Data do agendamento atualizada com sucesso!");
      carregarAgendamentos();
    } catch (error) {
      setMensagem("Erro de conexão ao atualizar data.");
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Gerenciamento de Agendamentos</h1>

      {mensagem && <p><strong>{mensagem}</strong></p>}

      <h2>Novo Agendamento</h2>
      <form onSubmit={handleCadastrar}>
        <div>
          <label>Data e Hora: </label>
          <input
            type="datetime-local"
            value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label>Serviço Vinculado: </label>
          <select
            value={servicoId}
            onChange={(e) => setServicoId(e.target.value)}
            required
          >
            <option value="">Selecione um serviço</option>
            {servicos.map((servico) => (
              <option key={servico.id} value={servico.id}>
                ID {servico.id} - {servico.tipo_corte} (Cliente: {servico.cliente_nome})
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label>Profissional (Usuário Logado): </label>
          <span>
            {usuario ? `${usuario.nome} (ID: ${usuario.id})` : "Não autenticado"}
          </span>
        </div>
        <br />
        <button type="submit">Criar Agendamento</button>
      </form>

      <hr />

      <h2>Listagem Cronológica de Agendamentos</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Data / Hora</th>
            <th>Cliente</th>
            <th>Tipo de Corte (Serviço)</th>
            <th>Barbeiro (Profissional)</th>
            <th>Alterar Data / Hora</th>
          </tr>
        </thead>
        <tbody>
          {agendamentos.length === 0 ? (
            <tr>
              <td colSpan="6">Nenhum agendamento encontrado.</td>
            </tr>
          ) : (
            agendamentos.map((ag) => (
              <tr key={ag.id}>
                <td>{ag.id}</td>
                <td>{new Date(ag.data_hora).toLocaleString("pt-BR")}</td>
                <td>{ag.cliente_nome}</td>
                <td>{ag.tipo_corte}</td>
                <td>{ag.barbeiro_nome}</td>
                <td>
                  <input
                    type="datetime-local"
                    value={novasDatas[ag.id] || ""}
                    onChange={(e) =>
                      setNovasDatas({ ...novasDatas, [ag.id]: e.target.value })
                    }
                  />{" "}
                  <button
                    type="button"
                    onClick={() => handleAtualizarData(ag.id)}
                  >
                    Atualizar Data
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}


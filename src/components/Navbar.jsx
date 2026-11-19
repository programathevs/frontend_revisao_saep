import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const usuarioSalvo = localStorage.getItem("usuario");
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav>
      <div>
        <strong>Usuário logado: </strong>
        <span>{usuario ? usuario.nome : "Visitante"}</span>
        {" | "}
        <Link to="/dashboard">Início (Dashboard)</Link>
        {" | "}
        <Link to="/clientes">Clientes</Link>
        {" | "}
        <Link to="/servicos">Serviços</Link>
        {" | "}
        <Link to="/agendamentos">Agendamentos</Link>
        {" | "}
        <button type="button" onClick={handleLogout}>
          Sair do Sistema
        </button>
      </div>
      <hr />
    </nav>
  );
}


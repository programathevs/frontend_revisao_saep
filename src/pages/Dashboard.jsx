import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

export default function Dashboard() {
  const usuarioSalvo = localStorage.getItem("usuario");
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

  return (
    <div>
      <Navbar />
      <h1>Módulo Principal - Dashboard</h1>
      <p>
        Bem-vindo(a), <strong>{usuario ? usuario.nome : "Usuário"}</strong>!
      </p>
      <hr />
      <h2>Funcionalidades do Sistema</h2>
      <ul>
        <li>
          <Link to="/clientes">Gerenciamento de Clientes</Link>
        </li>
        <li>
          <Link to="/servicos">Gerenciamento de Serviços</Link>
        </li>
        <li>
          <Link to="/agendamentos">Gerenciamento de Agendamentos</Link>
        </li>
      </ul>
    </div>
  );
}


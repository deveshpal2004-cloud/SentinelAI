import { FaShieldAlt } from "react-icons/fa";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <FaShieldAlt className="logo-icon" />
        <div>
          <h1>SentinelAI</h1>
          <p>AI Multi-Agent Emergency Response System</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
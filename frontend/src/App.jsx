import Header from "./components/Header";
import EmergencyForm from "./components/EmergencyForm";
import ChatBot from "./components/ChatBot";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Header />

      <EmergencyForm />

      <ChatBot />
    </div>
  );
}

export default App;
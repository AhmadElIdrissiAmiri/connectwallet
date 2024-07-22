import './App.css';
import { HashRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import WalletConnectHome from "./Components/WalletConnectHome";


function App() {
  return (
    <HashRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/WalletConnectHome" />} />
          <Route path="/WalletConnectHome/*" element={<WalletConnectHome />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;

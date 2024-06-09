import logo from './logo.svg';
import './App.css';
import Invoice from './Components/Invoice';
import Login from './Components/Login';
import Content from './Components/Content';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom'; 
import Dashboard from './Components/Dashboard';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Content" element={<Content />} />
          <Route path="/Invoice" element={<Invoice />}></Route>
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

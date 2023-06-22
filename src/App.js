import './App.css';
import { Routes, Route } from "react-router-dom";
import Mapa from './components/Map'
import Edit from './components/Edit'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/home' element={<Mapa/>} />
        <Route path='/home/:id' element={<Edit/>} />
      </Routes>
    </div>
  );
}

export default App;

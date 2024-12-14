import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GamePage from "./components/GamePage"
import Game from "./components/Game"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Game t={"home"}/>}/>
        <Route path="/game/:uuid" element={<GamePage />} />
        <Route path="/game" element={<Game t={"game"}/>} />
        {/* Ostatní routy */}
      </Routes>
    </Router>
  );
}

export default App;

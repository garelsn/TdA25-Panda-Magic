import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GamePage from "./components/GamePage"
import Game from "./components/Game"
import Home from "./components/Home"
import Search from "./components/Search";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/game/:uuid" element={<GamePage />} />
        <Route path="/game" element={<Game t={"game"}/>} />
        <Route path="/search" element={<Search/>} />
        {/* Ostatní routy */}
      </Routes>
    </Router>
  );
}

export default App;

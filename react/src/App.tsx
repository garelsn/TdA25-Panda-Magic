import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GamePageEdit from "./components/Game/GamePageEdit"
import GamePagePlay from "./components/Game/GamePagePlay"
import FirstGame from "./components/Game/FirstGame"
import Home from "./components/Home/Home"
import Search from "./components/Search/Search";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/game/edit/:uuid" element={<GamePageEdit />} />
        <Route path="/game/:uuid" element={<GamePagePlay />} />
        <Route path="/game" element={<FirstGame/>} />
        <Route path="/search" element={<Search/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/profile" element={<Profile/>}/>
        {/* Ostatní routy */}
      </Routes>
    </Router>
  );
}

export default App;

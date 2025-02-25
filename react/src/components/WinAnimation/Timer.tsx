// Upravíme komponentu FirstGame
import { useState, useEffect } from "react";
// ... ostatní importy

function FirstGame() {
  // ... existující stavy
  const [timerX, setTimerX] = useState(60);
  const [timerO, setTimerO] = useState(60);

  // Formátovač času
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Efekt pro časovač
  useEffect(() => {
    if (isGameOver || !gameId) return;

    const interval = setInterval(() => {
      if (currentPlayer === 'X') {
        setTimerX(prev => {
          if (prev <= 1) {
            socket?.emit('game_over', { game_id: gameId, winner: 'O' });
            return 0;
          }
          return prev - 1;
        });
      } else {
        setTimerO(prev => {
          if (prev <= 1) {
            socket?.emit('game_over', { game_id: gameId, winner: 'X' });
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPlayer, isGameOver, gameId, socket]);

  // Reset časovačů při nové hře
  useEffect(() => {
    if (!showWinModal) {
      setTimerX(60);
      setTimerO(60);
    }
  }, [showWinModal]);

  // Upravený playerIndicator s časovači
  const playerIndicator = (
    <div className="flex items-center gap-4">
      <div className="flex items-center">
        <img src="./X_cervene.svg" className="w-6 h-6 mr-2" />
        <span className="font-mono">{formatTime(timerX)}</span>
      </div>
      <div className="flex items-center">
        <img src="./O_modre.svg" className="w-6 h-6 mr-2" />
        <span className="font-mono">{formatTime(timerO)}</span>
      </div>
    </div>
  );

  // ... zbytek komponenty
}
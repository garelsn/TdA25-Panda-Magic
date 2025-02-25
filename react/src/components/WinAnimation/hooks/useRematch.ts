import { useState, useEffect } from "react";

const useRematch = (socket: any, gameId: string, player: "X" | "O") => {
  const [rematchRequested, setRematchRequested] = useState(false);
  const [opponentWantsRematch, setOpponentWantsRematch] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on("rematch_requested", () => {
      setOpponentWantsRematch(true);
    });

    socket.on("game_started", () => {
      setRematchRequested(false);
      setOpponentWantsRematch(false);
    });
  }, [socket]);

  const requestRematch = () => {
    setRematchRequested(true);
    socket.emit("rematch_request", { game_id: gameId, player });
  };

  return { rematchRequested, opponentWantsRematch, requestRematch };
};

export default useRematch;

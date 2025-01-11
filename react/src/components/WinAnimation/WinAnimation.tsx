import Confetti from "react-confetti";
import { useState } from "react";
type BoardProps = {
  board: string[][];
};

const WinAnimation: React.FC<BoardProps> = ({ board }) => {
  // Define the type for windowSize
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  // Explicitly define windowSize with types for width and height
  const [windowSize, setWindowSize] = useState <{ width: number | undefined, height: number | undefined }> ({ //typescript nonsence that has to be here for some reason
    width: undefined,
    height: undefined
  });

  function handleWindowSizeChange() {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  function fireConfetti() {
    // set event handler
    window.onresize = () => { handleWindowSizeChange(); }

    setIsConfettiActive(true);

    setTimeout(() => {
      setIsConfettiActive(false); 
    }, 6500);

    // remove event handler (setTimout shold be async)
    setTimeout(() => {
      window.onresize = null;  // Remove the resize listener after confetti animation ends for performance reasons of course
    }, 6500);
  }

  return (
    <div className="">
      {isConfettiActive && <Confetti width={windowSize.width} height={windowSize.height} />}
      <button
        onClick={fireConfetti}
        className="bg-white w-24 h-12"
      >
        Výhra
      </button>
    </div>
  );
}

export default WinAnimation;

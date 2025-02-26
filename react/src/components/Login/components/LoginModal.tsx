import React, { useState, useRef, useEffect } from "react";
import Login from "../Login";
import Register from "../../Register/Register";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  
  // Create refs to store form submission functions
  const loginSubmitRef = useRef<() => void>(() => {});
  const registerSubmitRef = useRef<() => void>(() => {});

  // Function to manually submit the active form
  const handleCustomSubmit = () => {
    if (activeTab === "login") {
      loginSubmitRef.current();
    } else {
      registerSubmitRef.current();
    }
  };
  
  // Close modal when success state changes to true
  useEffect(() => {
    if (loginSuccess || registerSuccess) {
      const timer = setTimeout(() => {
        onClose();
        // Reset success states
        setLoginSuccess(false);
        setRegisterSuccess(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [loginSuccess, registerSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="p-6 rounded-lg shadow-lg w-[480px] h-[550px] relative"
        style={{
          background: "linear-gradient(to bottom, #141E34 15%, #375694 85%)",
        }}
      >
        <button
          className="absolute top-2 right-2 text-3xl text-white font-bold"
          onClick={onClose}
        >
          X
        </button>

        <h1 className="text-4xl text-white font-bold text-center mb-4">
          {activeTab === "login" ? "Přihlášení" : "Registrace"}
        </h1>

        <div className={activeTab === "login" ? "login-container" : "hidden"}>
          <Login 
            onSubmitRef={(submitFn) => (loginSubmitRef.current = submitFn)} 
            onSuccess={() => setLoginSuccess(true)}
          />
        </div>

        <div className={activeTab === "register" ? "register-container" : "hidden"}>
          <Register 
            onSubmitRef={(submitFn) => (registerSubmitRef.current = submitFn)} 
            onSuccess={() => setRegisterSuccess(true)}
          />
        </div>

        <div className="flex justify-around mt-4">
          {/* Main action button */}
          <button
            onClick={handleCustomSubmit}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white border-2 border-black rounded-[30px] px-6 py-2 font-semibold text-[16px] md:text-[18px] transition-transform duration-200 hover:scale-105 shadow-lg"
          >
            {activeTab === "login" ? "PŘIHLÁSIT" : "REGISTROVAT"}
          </button>

          {/* Tab switch button */}
          <button
            className="bg-[#D9D9D9] text-black border-2 border-black rounded-[30px] px-6 py-2 font-semibold text-[16px] md:text-[18px] transition-transform duration-200 hover:scale-105"
            onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
          >
            {activeTab === "login" ? "REGISTROVAT" : "PŘIHLÁSIT"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
import React, { useState } from "react";
import Login from "../Login";
import Register from "../../Register/Register";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  if (!isOpen) return null;

  // Funkce pro ruční odeslání formuláře
  const handleCustomSubmit = () => {
    const form = document.querySelector(".login-modal-container form") as HTMLFormElement;
    if (form) {
      form.submit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <style>
        {`
          .login-modal-container form button[type="submit"] {
            display: none;
          }
          .login-modal-container form input[type="text"],
          .login-modal-container form input[type="password"] {
            display: block;
            margin: 0 auto 1rem auto;
            width: 80%;
            height: 40px;
            border: 2px solid #000;
            border-radius: 9999px;
            background-color: #d9d9d9;
            padding: 0 1rem;
          }
        `}
      </style>

      <div
        className="p-6 rounded-lg shadow-lg w-[480px] h-[480px] relative"
        style={{
          background: "linear-gradient(to bottom, #141E34 15%, #375694 85%)",
        }}
      >
        <button className="absolute top-2 right-2 text-3xl text-white font-bold" onClick={onClose}>
          X
        </button>

        <h1 className="text-4xl text-white font-bold text-center mb-4">
          {activeTab === "login" ? "Přihlášení" : "Registrace"}
        </h1>

        <div className="login-modal-container">
          {activeTab === "login" ? <Login /> : <Register />}
        </div>

        <div className="flex justify-around mt-4">
          {activeTab === "login" ? (
            // ✅ Přihlášení - tlačítko stejné jako na hlavní stránce
            <button
              onClick={handleCustomSubmit}
              className="bg-gradient-to-r  from-green-500 to-green-700 text-white border-2 border-black rounded-[30px] px-6 py-2 font-semibold text-[16px] md:text-[18px] transition-transform duration-200 hover:scale-105 shadow-lg"
            >
              PŘIHLÁSIT
            </button>
          ) : (
            // ✅ Registrace - tlačítko registrace stejné jako na hlavní stránce
            <button
              onClick={handleCustomSubmit}
              className="bg-gradient-to-r from-green-500 to-green-700 text-white border-2 border-black rounded-[30px] px-6 py-2 font-semibold text-[16px] md:text-[18px] transition-transform duration-200 hover:scale-105 shadow-lg"
            >
              REGISTROVAT
            </button>
          )}

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

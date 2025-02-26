import { useState, useEffect } from "react";

interface LoginProps {
  onSubmitRef?: (submitFn: () => void) => void;
  onSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onSubmitRef, onSuccess }) => {
  const [formData, setFormData] = useState({ username_or_email: "", password: "" });
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: ""
  });

  const socketUrl = process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:5000'
    : window.location.origin;

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    if (e) e.preventDefault();
    setNotification({ show: false, type: "", message: "" });

    try {
      const response = await fetch(`${socketUrl}/api/v1/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Přihlášení se nezdařilo.");

      localStorage.setItem("token", data.token);

      setNotification({
        show: true,
        type: "success",
        message: "Přihlášení úspěšné!"
      });

      // Reset form after successful login
      setFormData({ username_or_email: "", password: "" });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 1500);

    } catch (err: any) {
      setNotification({
        show: true,
        type: "error",
        message: err.message
      });
    }
  };

  // Register the submit function to the parent component
  useEffect(() => {
    if (onSubmitRef) {
      onSubmitRef(() => handleSubmit(null));
    }
  }, [formData, onSubmitRef]);

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex flex-col items-center mt-14">
        <label className="text-white font-medium mb-1 mt-3">Uživatelské jméno nebo e-mail</label>
        <input
          type="text"
          name="username_or_email"
          value={formData.username_or_email}
          className="w-80 h-10 border-2 border-black rounded-full bg-gray-300 px-4 mb-4"
          onChange={handleChange}
          required
        />

        <label className="text-white font-medium mb-1">Heslo</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          className="w-80 h-10 border-2 border-black rounded-full bg-gray-300 px-4"
          onChange={handleChange}
          required
        />

        {/* Odkaz na obnovu hesla */}
        <div className="w-[80%] text-right mt-1 mb-4">
          <a href="/reset-password" className="text-white text-sm hover:underline">
            Zapomněli jste heslo?
          </a>
        </div>

        <button type="submit" className="hidden">Přihlásit se</button>
      </form>

      {/* Notification - Same style as in Register component */}
      {notification.show && (
        <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 py-3 px-6 rounded-lg shadow-lg ${
          notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        } text-center max-w-xs md:max-w-md z-50 border border-black`}>
          <p>{notification.message}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
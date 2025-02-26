import { useState, useEffect } from "react";

interface RegisterProps {
  onSubmitRef?: (submitFn: () => void) => void;
  onSuccess?: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSubmitRef, onSuccess }) => {
    const [formData, setFormData] = useState({ 
        username: "", 
        email: "", 
        password: "", 
        confirm_password: "",
        elo: 0 // Default elo value as specified
    });
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

        if (formData.password !== formData.confirm_password) {
            setNotification({
                show: true,
                type: "error",
                message: "Hesla se neshodují."
            });
            return;
        }

        try {
            // Create payload without confirm_password
            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                elo: formData.elo
            };

            const response = await fetch(`${socketUrl}/api/v1/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Registrace se nezdařila.");

            setNotification({
                show: true,
                type: "success",
                message: "Registrace úspěšná!"
            });
            
            // Reset form after successful registration
            setFormData({ 
                username: "", 
                email: "", 
                password: "", 
                confirm_password: "",
                elo: 0
            });
            
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
                <label className="text-white font-medium mb-1 mt-1">Zadejte uživatelské jméno</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-80 h-10 border-2 border-black rounded-full bg-gray-300 px-4 mb-4"
                />

                <label className="text-white font-medium mb-1">Zadejte e-mail</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-80 h-10 border-2 border-black rounded-full bg-gray-300 px-4 mb-4"
                />

                <label className="text-white font-medium mb-1">Zadejte heslo</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-80 h-10 border-2 border-black rounded-full bg-gray-300 px-4 mb-4"
                />

                <label className="text-white font-medium mb-1">Zopakujte heslo</label>
                <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    className="w-80 h-10 border-2 border-black rounded-full bg-gray-300 px-4 mb-4"
                />

                <button
                    type="submit"
                    className="hidden"
                >
                    REGISTROVAT
                </button>
            </form>
            
            {/* Notification */}
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

export default Register;
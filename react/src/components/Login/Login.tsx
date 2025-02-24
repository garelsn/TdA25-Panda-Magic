import { useState } from "react";

const Login = () => {
    const [formData, setFormData] = useState({ username_or_email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://127.0.0.1:5000/api/v1/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            localStorage.setItem("token", data.token);
            alert("Přihlášení úspěšné!");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <label className="text-white font-medium mb-1 mt-3">Uživatelské jméno nebo e-mail</label>
                <input
                    type="text"
                    name="username_or_email"
                    className="w-[80%] h-10 border-2 border-black rounded-full bg-[#D9D9D9] px-4 mb-4"
                    onChange={handleChange}
                    required
                />

                <label className="text-white font-medium mb-1">Heslo</label>
                <input
                    type="password"
                    name="password"
                    className="w-[80%] h-10 border-2 border-black rounded-full bg-[#D9D9D9] px-4"
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
        </div>
    );
};

export default Login;

import { useState } from "react";

const Register = () => {
    const [formData, setFormData] = useState({ username_or_email: "", password: "", confirm_password: "" });
    const [error, setError] = useState("");

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirm_password) {
            setError("Hesla se neshodují.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/api/v1/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            alert("Registrace úspěšná!");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            {error && <p className="text-red-500 text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <label className="text-white text-lg mb-1 mt-6">Zadejte uživatelské jméno/e-mail</label>
                <input
                    type="text"
                    name="username_or_email"
                    placeholder=""
                    onChange={handleChange}
                    required
                    className="w-80 h-10 border-2 border-black rounded-full bg-gray-300 px-4 mb-3"
                />

                <label className="text-white text-lg mb-1">Zadejte heslo</label>
                <input
                    type="password"
                    name="password"
                    placeholder=""
                    onChange={handleChange}
                    required
                    className="w-80 h-10 border-2 border-black rounded-full bg-gray-300 px-4 mb-3"
                />

                <label className="text-white text-lg mb-1">Zopakujte heslo</label>
                <input
                    type="password"
                    name="confirm_password"
                    placeholder=""
                    onChange={handleChange}
                    required
                    className="w-80 h-10 border-2 border-black rounded-full bg-gray-300 px-4 mb-4"
                />

                <button
                    type="submit"
                    className="bg-[#D9D9D9] text-black border-2 border-black rounded-[30px] px-6 py-2 font-semibold text-[16px] md:text-[18px] transition-transform duration-200 hover:scale-105"
                >
                    REGISTROVAT
                </button>
            </form>
        </div>
    );
};

export default Register;

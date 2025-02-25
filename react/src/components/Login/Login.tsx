import { useState } from "react";

const Login = () => {
    const [formData, setFormData] = useState({ username_or_email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e:any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const socketUrl = process.env.NODE_ENV === 'development' 
    ? 'http://127.0.0.1:5000' 
    : '';

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(`${socketUrl}/api/v1/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            localStorage.setItem("token", data.token);
            alert("Přihlášení úspěšné!");
        } catch (err:any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Přihlášení</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="username_or_email" placeholder="Uživatelské jméno nebo email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Heslo" onChange={handleChange} required />
                <button type="submit">Přihlásit se</button>
            </form>
        </div>
    );
};

export default Login;

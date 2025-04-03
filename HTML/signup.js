import { useState } from "react";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSignup = async () => {
        try {
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            setMessage(data.message);

            if (response.ok) {
                localStorage.setItem("pendingEmail", email); // store for verification step
                window.location.href = "/verify";
            }
        } catch (error) {
            setMessage("Signup failed.");
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <input 
                type="email" 
                placeholder="WCU Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button onClick={handleSignup}>Sign Up</button>
            <p>{message}</p>
        </div>
    );
}
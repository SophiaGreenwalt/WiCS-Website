import { useState, useEffect } from "react";

export default function VerifyEmail() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const savedEmail = localStorage.getItem("pendingEmail");
        if (savedEmail) {
            setEmail(savedEmail);
        }
    }, []);

    const handleVerify = async () => {
        try {
            const response = await fetch("http://localhost:5000/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, verificationCode: code }),
            });

            const data = await response.json();
            setMessage(data.message);

            if (response.ok) {
                localStorage.removeItem("pendingEmail");
                window.location.href = "/login"; // or your dashboard
            }
        } catch (error) {
            setMessage("Verification failed. Try again.");
        }
    };

    return (
        <div>
            <h2>Verify Email</h2>
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="Verification Code" 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
            />
            <button onClick={handleVerify}>Verify</button>
            <p>{message}</p>
        </div>
    );
}
import React, { useState } from "react";

const RegisterPage = () => {
    const [hashedPassword, setHashedPassword] = useState(""); // Stan na przechowanie hasła

    async function generate(event) {
        event.preventDefault(); // Zapobiega przeładowaniu strony

        const formData = new FormData(event.target); // Pobieranie wartości z formularza
        const password = formData.get("password"); // Pobranie hasła z inputu

        try {
            const response = await fetch("http://localhost:5000/generate-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }), // Wysłanie hasła w body requestu
            });

            if (!response.ok) {
                throw new Error("Błąd podczas generowania hasła");
            }

            const data = await response.json();
            setHashedPassword(data.hashedPassword); // Ustaw shaśowane hasło w stanie
        } catch (error) {
            console.error("Błąd:", error);
            alert("Nie udało się wygenerować hasła");
        }
    }

    return (
        <div>
            <h1>Rejestracja</h1>
            <form onSubmit={generate}>
                <label>
                    Podaj hasło:
                    <input name="password" type="text" required />
                </label>
                <button type="submit">Generuj hasło</button>
            </form>
            {hashedPassword && (
                <p>
                    <strong>Shaśowane hasło:</strong> {hashedPassword}
                </p>
            )}
        </div>
    );
};

export default RegisterPage;
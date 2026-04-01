"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");

    async function login() {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin,
            },
        });

        if (error) {
            setMsg("Erro ao enviar link.");
        } else {
            setMsg("✅ Link de login enviado para seu e‑mail.");
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
                <h1 className="text-xl font-bold text-center">Login Admin</h1>

                <input
                    type="email"
                    placeholder="Seu e‑mail"
                    className="w-full border p-2 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    onClick={login}
                    className="w-full bg-purple-600 text-white py-2 rounded font-semibold"
                >
                    Entrar
                </button>

                {msg && <p className="text-sm text-center">{msg}</p>}
            </div>
        </main>
    );
}
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import api from '../api/api'
import axios from 'axios';

function Code() {
    const email = localStorage.getItem("email");  
    const baseURL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [code, setCode] = useState('');
    const [error, setError] = useState(null);

    const getCode = (e) => {
        setCode(e.target.value);
        setError(null);
    };

    const handleSubmit = async () => {
        if (!email) {
            setError("Email не найден. Пройдите шаг заново.");
            return navigate("/signin");
        }

        try {
            const res = await api.post(`/email/verify-code`, {
                email,
                code
            });

            if (res.data?.token) {
                localStorage.setItem("token", res.data.token);
                localStorage.removeItem("email");
                navigate("/");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Неверный код");
        }
    };

    const submitOnEnter = async (e) => {
        if (e.key === "Enter") handleSubmit();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f1320]">
            <div className="bg-[#141827] p-10 rounded-2xl w-[350px] shadow-xl text-white">
                <h1 className="text-3xl font-bold text-center mb-4">Enter Code</h1>

                <input
                    maxLength={6}
                    type="text"
                    value={code}
                    onChange={getCode}
                    onKeyDown={submitOnEnter}
                    className="w-full px-3 py-2 rounded bg-[#1b2033] outline-none mb-4"
                    placeholder="Введите код"
                />

                {error && (
                    <p className="text-red-500 text-sm mb-4 border border-red-500 p-2 rounded">
                        {error}
                    </p>
                )}

                <button
                    onClick={handleSubmit}
                    className="w-full bg-white text-black py-2 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition"
                >
                    Verify
                </button>
            </div>
        </div>
    );
}

export default Code;

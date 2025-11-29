import { Email } from "@mui/icons-material";
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Code({onSetVerify, email}){
    const baseURL = import.meta.env.VITE_API_URL;
    const [code, setCode]= useState(null);
    const [token, setToken]=useState(null);

    useEffect(() => {
        if (token) {
            console.log('Token has been successfully updated in state:', token);
        }
    }, [token]);

    const getCode=(e)=>{
        setCode(e.target.value)
    }
    const handleSubmission = async () => {
        const fullUrl = `${baseURL}/verify-code`;
        const res = await axios.post(fullUrl, { email: email, code: code });
        console.log('Response Data (The new token):', res.data);

            if (res.data && res.data.token) {
                localStorage.setItem('authToken', res.data.token);
                onSetVerify(true);
            } else {
            }
        }
    return(
        <div className="min-h-screen flex items-center justify-center bg-[#0f1320]">
            <div className="bg-[#141827] p-10 rounded-2xl w-[350px] shadow-xl text-white">
                <h1 className="text-3xl font-bold text-center mb-1">Code</h1>
                <p className="mb-1">Code</p>
                <input maxLength={6} type="text" value={code} onChange={getCode} className="w-full px-3 py-2 rounded bg-[#1b2033] outline-none mb-4"/>
                <button onClick={handleSubmission}  className="w-full bg-white text-black py-2 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition">Sign in</button>
            </div>
        </div>
    )
}
export default Code;
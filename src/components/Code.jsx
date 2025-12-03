import { Email } from "@mui/icons-material";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";


function Code(){
    const baseURL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [code, setCode]= useState(null);
    const email = localStorage.getItem("email");

    const getCode=(e)=>{
        setCode(e.target.value)
    }
        const handleSubmit = async () => {
            const res = await axios.post(`${baseURL}/email/verify-code`, {
                email,
                code
            });

            if (res.data?.token) {
                localStorage.setItem("token", res.data.token);
                localStorage.removeItem("email");

                navigate("/");
        }


    const submitOnEnter= async(e)=>{
        if(e.key==="Enter"){
            handleSubmit()
        }
    }
    return(
        <div className="min-h-screen flex items-center justify-center bg-[#0f1320]">
            <div className="bg-[#141827] p-10 rounded-2xl w-[350px] shadow-xl text-white">
                <h1 className="text-3xl font-bold text-center mb-1">Code</h1>
                <p className="mb-1">Code</p>
                <input maxLength={6} type="text" value={code} onChange={getCode} onKeyDown={(e) => submitOnEnter(e)} className="w-full px-3 py-2 rounded bg-[#1b2033] outline-none mb-4"/>
                <button onClick={handleSubmission}  className="w-full bg-white text-black py-2 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition">Sign in</button>
            </div>
        </div>
    )
}
}
export default Code;
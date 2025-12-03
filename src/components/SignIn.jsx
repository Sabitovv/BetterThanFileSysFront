import { useState } from "react";
import axios from 'axios';

function SignIn({ onSign }) {
    const baseURL = import.meta.env.VITE_API_URL;
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null); 
    const getEmail = (e) => {   
        setEmail(e.target.value);
        setError(null); 
    }

    const handleSign = async () => {
        setError(null); 
        if (!email) {
            return;
        }

        const fullUrl = `${baseURL}/email/code`;

        try {
            console.log(fullUrl)
            const res = await axios.post(fullUrl, { email: email });
            onSign(true,email);

        } catch (err) {
            console.error("API Request Failed:", err);
            
            if (err.response) {
                const serverMessage = err.response.data?.message || err.response.data || `Ошибка сервера: ${err.response.status}`;
                setError(serverMessage);

            } else if (err.request) {
                setError("Сетевая ошибка. Проверьте CORS на бэкенде или убедитесь, что сервер запущен.");
                console.error("Likely CORS or Network Error. Check backend server and CORS settings.");
            
            } else {
                setError("Неизвестная ошибка: проверьте конфигурацию клиента.");
            }
        }
    }
    const submitOnEnter= async(e)=>{
        if(e.key==="Enter"){
            handleSign()
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f1320]">
            <div className="bg-[#141827] p-10 rounded-2xl w-[350px] shadow-xl text-white">
                <h1 className="text-3xl font-bold text-center mb-1">SignIn</h1>
                <p className="text-center text-gray-400 mb-8">Log in to your account <br /></p>
                <div className="Email">
                    <p className="mb-1">Email</p>
                    <input 
                        type="email" 
                        placeholder="abcd@gmai.com" 
                        value={email} 
                        onChange={getEmail} 
                        onKeyDown={(e) => submitOnEnter(e)}
                        className="w-full px-3 py-2 rounded bg-[#1b2033] outline-none mb-4"
                    />
                </div>
                
                {error && (
                    <p className="text-red-500 text-sm mb-4 border border-red-500 p-2 rounded">
                        {error}
                    </p>
                )}

                <button 
                    className="w-full bg-white text-black py-2 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition" 
                    onClick={handleSign}
                >
                    Sign in
                </button>
            </div>
        </div>
    )
}
export default SignIn;
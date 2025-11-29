import axios from 'axios';
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import api from '../../api/api';

function Modal({ isOpen, onClose, onCreate }) {
    if (!isOpen) return null;
    
    const [name, setName]= useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [parentId,setParentId]= useState(0)

    const getName = (e) => {
        setName(e.target.value); 
    }

    const handleCreate = async () => {
        if (!name.trim()) return;
        setIsLoading(true);

        try {
            const nextParentId = parentId + 1;
            const endpoint = `/file/folder`;
            const res = await api.post(endpoint,{name: name, parentId: nextParentId}) 
            setParentId(nextParentId);
            console.log(res)
            if (onCreate) {
                onCreate(name);
            }
            
            setName('');
            onClose();   
        } catch (error) {
            console.error("Ошибка при создании папки:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4" 
            onClick={onClose}
        >
            <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm"></div>
            <div 
                className="bg-[#141827] p-6 rounded-xl w-full max-w-[350px] shadow-2xl text-white z-50 transform transition-all"
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Add Folder</h1>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white transition"
                        aria-label="Закрыть"
                    >
                        <CloseIcon sx={{ fontSize: '24px' }} />
                    </button>
                </div>
                <p className="mb-1 text-sm text-gray-400"></p>
                <input 
                    type="text" 
                    value={name} 
                    onChange={getName} 
                    placeholder='folder...' 
                    className="w-full px-3 py-2 rounded bg-[#1b2033] outline-none border border-transparent focus:border-amber-500 mb-4"
                />
                
                <button 
                    disabled={!name.trim() || isLoading} 
                    onClick={handleCreate} 
                    className={`
                        w-full py-2 rounded-lg font-semibold transition 
                        ${name.trim() && !isLoading 
                            ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                            : 'bg-gray-600 text-gray-400 opacity-50 cursor-not-allowed'
                        }
                    `}
                >
                    {isLoading ? 'Creating...' : 'ADD'}
                </button>
                
            </div>
        </div>
    )
}
export default Modal;
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import api from '../../api/api'

// Добавляем currentParentId в пропсы
function Modal({ isOpen, onClose, onCreate, currentParentId }) { 
    if (!isOpen) return null;
    
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getName = (e) => {
        setName(e.target.value); 
    }

    const handleCreate = async () => {
        if (!name.trim()) return;
        setIsLoading(true);

        try {
            const payload = {
                name: name,
                parentId: currentParentId
            };
            const res = await api.post(`/files/folder`, payload);
            if (onCreate) {
                onCreate(res.data);
            }
            
            setName('');
            onClose();   
        } catch (error) {
            console.error("Ошибка при создании папки:", error);
            alert("Не удалось создать папку");
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
                    <h1 className="text-2xl font-bold">New Folder</h1>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <CloseIcon sx={{ fontSize: '24px' }} />
                    </button>
                </div>
                
                <p className="text-xs text-gray-500 mb-2">Creating in folder ID: {currentParentId}</p>

                <input 
                    type="text" 
                    value={name} 
                    onChange={getName} 
                    placeholder='Folder name...' 
                    autoFocus
                    className="w-full px-3 py-2 rounded bg-[#1b2033] outline-none border border-transparent focus:border-amber-500 mb-4 text-white"
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
                    {isLoading ? 'Creating...' : 'CREATE'}
                </button>
            </div>
        </div>
    )
}
export default Modal;
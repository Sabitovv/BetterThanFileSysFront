import React from 'react';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import Modal from './Modal'
import { useState } from 'react';
import axios from 'axios';
function AddFile(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState([
        { id: '1', name: 'Главная' },
    ]);
    const folderContent = {
        '1': [
            { id: '101', name: 'Документы проекта', type: 'folder', date: '2025-10-20' },
            { id: '102', name: 'Спецификация.pdf', type: 'file', date: '2025-11-25' },
            { id: '103', name: 'Фотоотчет_01', type: 'folder', date: '2025-11-24' },
        ],
        '101': [
            { id: '201', name: 'Смета.xlsx', type: 'file', date: '2025-11-01' },
            { id: '202', name: 'Архив Q4', type: 'folder', date: '2025-11-26' },
        ],
        '103': [
            { id: '301', name: 'Photo_1.jpg', type: 'file', date: '2025-11-25' },
            { id: '302', name: 'Photo_2.jpg', type: 'file', date: '2025-11-25' },
        ],
    };
    const [items, setItems] = useState(folderContent['1']);


    const handleSubmission = async () => {
        const res = await axios.post(fullUrl,{name: name, parentId: parentId}) 
    }


    const OpenCLose=()=>{
        setIsModalOpen(!isModalOpen)
    }

    const loadFolderContent = (folderId) => {
        const newContent = folderContent[folderId] || [];
        setItems(newContent);
    };

    const OpenFolders=(id,name,type)=>{
        if (type === 'folder') {
            setCurrentPath(prevPath => [
                ...prevPath, 
                { id: String(id), name: name }
            ])
            loadFolderContent(String(id));
        }
        return
    }

    const toggleModal = () => { 
        setIsModalOpen(prev => !prev);
    }
    const navigateToPath = (index) => {
        const newPath = currentPath.slice(0, index + 1);
        setCurrentPath(newPath);

        const newFolderId = newPath[newPath.length - 1].id;
        loadFolderContent(newFolderId);
    };
    
    return(
        <>
            {isModalOpen && <Modal isOpen={isModalOpen} onClose={toggleModal}/>}
            <div className="bg-[#0f1320] min-h-screen">  
                <div className="flex justify-between items-center p-4 bg-gray-800 shadow-lg border-b border-amber-700/50">
                    <h1 className="text-white text-3xl font-extrabold tracking-wider">
                        <span className="text-amber-400">Fail</span>
                    </h1>
                    <button 
                    onClick={OpenCLose}
                    className="  flex items-center space-x-2 cursor-pointer   p-2   rounded-lg   bg-amber-600   hover:bg-amber-700   transition-colors   duration-200  shadow-md"
                    aria-label="Создать новую папку"
                    >
                        <CreateNewFolderIcon 
                            className="text-white" 
                            sx={{ fontSize: '32px' }} 
                        />
                        <span className="hidden sm:inline text-white font-semibold">
                            Создать папку
                        </span>
                    </button>
                </div>
                <div className="p-4 relative min-h-screen bg-gray-900 text-gray-200">
                <div className="space-y-2">
                    <div className="flex items-center text-2xl font-bold mb-5">
                        {currentPath.map((item, index) => {
                            const isLast = index === currentPath.length - 1;
                            return (
                                <React.Fragment key={item.id}>
                                    <button
                                        onClick={() => !isLast && navigateToPath(index)}
                                        className={`
                                            ${isLast ? 'text-white' : 'text-gray-400 hover:text-amber-400'} 
                                            transition-colors cursor-pointer
                                        `}
                                        disabled={isLast}
                                    >
                                        {item.name}
                                    </button>
                                    {!isLast && (
                                        <ChevronRightIcon className="text-gray-500 mx-1" sx={{ fontSize: '18px' }}/>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                    <div className="flex text-sm font-semibold text-gray-400 border-b border-gray-700 pb-2 mb-2">
                        <div className="w-1/2">Имя</div>
                        <div className="w-1/4 hidden sm:block">Автор</div>
                        <div className="w-1/4">Дата изменения</div>
                    </div>

                    {items.map((item) => (
                    <div 
                        onClick={()=>OpenFolders(item.id, item.name, item.type)}
                        key={item.id} 
                        className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                        <div className="w-1/2 flex items-center space-x-3 font-medium">
                                {item.type === 'folder' ? (
                                <FolderIcon className="text-amber-500" sx={{ fontSize: '24px' }} />
                                ) : (
                                <InsertDriveFileIcon className="text-blue-400" sx={{ fontSize: '24px' }} />
                                )}
                                <span>{item.name}</span>
                            </div>
                            <div className="w-1/4 hidden sm:block text-sm text-gray-400 capitalize">
                                {item.type}
                            </div>
                            <div className="w-1/4 text-sm text-gray-400">
                            {item.date}
                            </div>
                    </div>
                    ))}

                </div>

                <input 
                    type="file" 
                    id="file-upload" 
                    style={{ display: 'none' }} 
                    multiple 
                />
                    <label htmlFor="file-upload">
                    <div 
                        className="
                        fixed bottom-6 right-6 
                        w-14 h-14 
                        rounded-full 
                        bg-amber-600 
                        hover:bg-amber-700 
                        flex items-center justify-center 
                        shadow-xl 
                        cursor-pointer 
                        transition-all 
                        duration-300
                        "
                        title="Загрузить файл(ы)"
                    >
                    <AddIcon className="text-white" sx={{ fontSize: '32px' }}/>
                    </div>
                </label>
                </div>
            </div>
        </>
    )
}
export default AddFile
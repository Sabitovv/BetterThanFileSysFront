        import React, { useEffect, useState } from 'react';
        import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
        import FolderIcon from '@mui/icons-material/Folder';
        import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
        import ChevronRightIcon from '@mui/icons-material/ChevronRight';
        import AddIcon from '@mui/icons-material/Add';
        import DeleteIcon from '@mui/icons-material/Delete';
        import ModeIcon from '@mui/icons-material/Mode';
        import Modal from './Modal';
        import api from '../../api/api';
        import { useNavigate } from "react-router-dom";

        function AddFile() {

            const navigate = useNavigate();

            const handleLogout = () => {
                localStorage.removeItem("token");
                localStorage.removeItem("email");
            
                navigate("/signin");
            };

            const [selectedId, setSelectedId] = useState(null);
            const [clipboardItem, setClipboardItem] = useState(null);

            const [updateId, setUpdateID]=useState(null)

            
            const MAX_FILE_FILE = 3 * 1024 * 1024
            const [isModalOpen, setIsModalOpen] = useState(false);
            
            const [currentPath, setCurrentPath] = useState([
                { id: 0, name: 'Главная' }, 
            ]);
            
            const [items, setItems] = useState([]);
            const [isLoading, setIsLoading] = useState(false);
            const [isUploading, setIsUploading] = useState(false); 

            const currentFolderId = currentPath[currentPath.length - 1].id;

            const loadFolderContent = async (parentId) => {
                setIsLoading(true);
                try {
                    const res = await api.get(`/files`, {
                        params: { parentId },
                        headers: {
                            "Cache-Control": "no-cache, no-store, must-revalidate",
                            "Pragma": "no-cache",
                            "Expires": "0"
                        }
                    });

                    setItems(res.data);
                } catch (error) {
                    console.error("Ошибка загрузки файлов:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            useEffect(() => {
                loadFolderContent(currentFolderId);
            }, [currentFolderId]);

            const downloadFile = async (id, fileName) => {
                try {
                    const response = await api.get(`/files/download/${id}`, {
                        responseType: 'blob'
                    });

                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', fileName);
                    
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    
                    window.URL.revokeObjectURL(url);
                } catch (error) {
                    console.error("Ошибка скачивания файла:", error);
                    alert("Не удалось скачать файл");
                }
            };

            const handleItemClick = (item) => {
                if (item.folder) {
                    setCurrentPath(prevPath => [
                        ...prevPath, 
                        { id: item.id, name: item.name }
                    ]);
                } else {
                    downloadFile(item.id, item.name);
                }
            }

            const handleFileUpload = async (e) => {
                const files = Array.from(e.target.files);
                if (!files.length) return;
                setIsUploading(true);

                const oversizedFiles = files.filter(file => file.size > MAX_FILE_FILE);

                if (oversizedFiles.length > 0) {
                    alert(
                        `Ошибка: Файлы превышают лимит в 3 МБ. Следующие файлы слишком большие:\n` +
                        oversizedFiles.map(file => `- ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} МБ)`).join('\n')
                    );
                    e.target.value = '';
                    return;
                }

                setIsUploading(true);

                try {
                    const uploadPromises = files.map(async (file) => {
                        const formData = new FormData();
                        formData.append('file', file); 

                        const response = await api.post('/files/upload', formData, {
                            params: { parentId: currentFolderId },
                            headers: { 'Content-Type': 'multipart/form-data' },
                        });
                        return response.data;
                    });

                    const newFiles = await Promise.all(uploadPromises);
                    setItems(prev => [...prev, ...newFiles]);

                } catch (error) {
                    console.error("Ошибка при загрузке файла:", error);
                } finally {
                    setIsUploading(false);
                    e.target.value = '';
                }
            };

            const navigateToPath = (index) => {
                const newPath = currentPath.slice(0, index + 1);
                setCurrentPath(newPath);
            };

            const isOnCreate = (newItem) => setItems(prev => [...prev, newItem]);
            const toggleModal = () => setIsModalOpen(!isModalOpen);


            const handleDelete=async(index)=>{
                await api.delete(`/files/${index}`)
                setItems(prev=> prev.filter(item=>item.id !=index))
            }

            /* Update */
            const getUpdateName = (e, id) => {
                const newName = e.target.value;
                setItems(prev =>
                    prev.map(it =>
                        it.id === id ? { ...it, name: newName } : it
                    )
                );
            };

            const handleUpdateName = async (id, newName) => {
                try {
                    const current = items.find(it => it.id === id);
                    if (!current) return;
                    await api.patch(`/files/${id}/rename`, { newName: newName });
                    loadFolderContent(currentFolderId);
                
                    setItems(prev =>
                        prev.map(it =>
                            it.id === id ? { ...it, name: newName } : it
                        )
                    );
                } catch (err) {
                    console.error("Ошибка при обновлении имени", err);
                    alert("Не удалось сохранить имя");
                }
            };

            const saveOnEnter = async (e, id) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const newName = e.target.value.trim();
                    await handleUpdateName(id, newName);

                    setUpdateID(null);
                }
            
                if (e.key === "Escape") {
                    e.preventDefault();
                    e.stopPropagation();
                    setUpdateID(null);
                }
            };

            const saveOnBlur = async (e, id) => {
                const current = items.find(it => it.id === id);
                const newName = current?.name ?? "";

                if (!newName.trim()) {
                    setUpdateID(null);
                    return;
                }
            
                if (current) {
                    await handleUpdateName(id, newName);
                }
                setUpdateID(null);
            };

            /*Click*/
            const handleSingleClick = (e, item) => {
                e.stopPropagation();
                setSelectedId(item.id);
            };

            const handleDoubleClick = (e, item) => {
                e.stopPropagation();
                handleItemClick(item); 
            };

            /*COPY PASS*/
            useEffect(() => {
                const handleKeyDown = async (e) => {
                    if (e.ctrlKey && e.key === 'c') {
                        if (selectedId == null) return;
                    
                        const item = items.find(i => i.id === selectedId);
                        if (!item) return;
                    
                        setClipboardItem(item); 
                    }
                    if (e.ctrlKey && e.key === 'v') {
                        if (!clipboardItem) return;
                    
                        try {
                            await api.patch(
                                `/files/${clipboardItem.id}/move`,
                                { newParentId: currentFolderId });
                            loadFolderContent(currentFolderId);
                        } catch (err) {
                            console.error("Ошибка вставки", err);
                        }
                    }
                };
            
                window.addEventListener("keydown", handleKeyDown);
                return () => window.removeEventListener("keydown", handleKeyDown);
            }, [selectedId, clipboardItem, items, currentFolderId]);




            return (
                <>
                    {isModalOpen && (
                        <Modal 
                            isOpen={isModalOpen} 
                            onClose={toggleModal} 
                            onCreate={isOnCreate} 
                            currentParentId={currentFolderId} 
                        />
                    )}
                    
                    <div className="bg-[#0f1320] min-h-screen">
                        <div className="flex justify-between items-center p-4 bg-gray-800 shadow-lg border-b border-amber-700/50">
                            <h1 className="text-white text-3xl font-extrabold tracking-wider">
                                <span className="text-amber-400">File Manager</span>
                            </h1>
                            <button onClick={toggleModal} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg bg-amber-600 hover:bg-amber-700 transition-colors shadow-md">
                                <CreateNewFolderIcon className="text-white" sx={{ fontSize: '32px' }} />
                                <span className="hidden sm:inline text-white font-semibold">Создать папку</span>
                            </button>

                        </div>

                        <div className="p-4 relative min-h-screen bg-gray-900 text-gray-200">
                            <div className="space-y-2">
                                <div className="flex items-center text-2xl font-bold mb-5">
                                    {currentPath.map((item, index) => {
                                        const isLast = index === currentPath.length - 1;
                                        return (
                                            <React.Fragment key={item.id}>
                                                <button onClick={() => !isLast && navigateToPath(index)} className={`${isLast ? 'text-white' : 'text-gray-400 hover:text-amber-400'} transition-colors`} disabled={isLast}>
                                                    {item.name}
                                                </button>
                                                {!isLast && <ChevronRightIcon className="text-gray-500 mx-1" sx={{ fontSize: '18px' }} />}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>

                                <div className="flex text-sm font-semibold text-gray-400 border-b border-gray-700 pb-2 mb-2">
                                    <div className="w-1/2">Имя</div>
                                    <div className="w-1/4 hidden sm:block">Автор</div>
                                    <div className="w-1/4">Размер</div>
                                </div>

                                {isLoading ? (
                                    <div className="text-center py-4">Загрузка...</div>
                                ) : items.length === 0 ? (
                                    <div className="text-center py-4 text-gray-500">Папка пуста</div>
                                ) : (
                                    items.map((item) => (
                                        <div 
                                            onClick={(e) => handleSingleClick(e, item)}
                                            onDoubleClick={(e) => handleDoubleClick(e, item)}
                                            key={item.id} 
                                            className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group"
                                        >
                                            <div className="w-1/2 flex items-center space-x-3 font-medium">
                                                {item.folder ? (
                                                    <FolderIcon className="text-amber-500" sx={{ fontSize: '24px' }} />
                                                ) : (
                                                    <InsertDriveFileIcon className="text-blue-400" sx={{ fontSize: '24px' }} />
                                                )}
                                                {updateId === item.id ? (
                                                    <input
                                                        type="text"
                                                        value={item.name}
                                                        onChange={(e) => getUpdateName(e, item.id)}
                                                        onKeyDown={(e) => saveOnEnter(e, item.id)}
                                                        onBlur={(e) => saveOnBlur(e, item.id)}
                                                        onClick={(e)=>{
                                                            e.stopPropagation()
                                                        }}
                                                        autoFocus
                                                        className="w-full px-3 py-2 rounded bg-[#1b2033] outline-none border border-transparent focus:border-amber-500 mb-4 text-white"
                                                    />
                                                ) : (
                                                        <span className="truncate">{item.name}</span>
                                                    )}
                                            </div>
                                            <div className="w-1/4 hidden sm:block text-sm text-gray-400">
                                                {item.user?.email}
                                            </div>
                                            <div className="w-1/4 text-sm text-gray-400">
                                                {item.folder ? '-' : (item.size ? `${(item.size / 1024).toFixed(1)} KB` : '0 KB')}
                                            </div>
                                            <div className='flex gap-5'>
                                                <button className='cursor-pointer' onClick={(e)=>{
                                                    e.stopPropagation()
                                                    handleDelete(item.id)}}>
                                                    <DeleteIcon/>
                                                </button>
                                                <button
                                                    className='cursor-pointer'
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setUpdateID(item.id)
                                                    }}
                                                >
                                                    <ModeIcon/>
                                                </button>
                                            </div>

                                        </div>
                                    ))
                                )}
                            </div>
                            <div></div>
                            <input type="file" id="file-upload" style={{ display: 'none' }} multiple onChange={handleFileUpload} />
                            <button
                                onClick={handleLogout}
                                className="fixed bottom-6 right-24 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-md transition-all duration-300"
                            >
                                Logout
                            </button>

                            <label htmlFor="file-upload">
                                <div className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl cursor-pointer transition-all duration-300 ${isUploading ? 'bg-gray-500 animate-pulse' : 'bg-amber-600 hover:bg-amber-700'}`}>
                                    {isUploading ? <span className="text-white text-xs">...</span> : <AddIcon className="text-white" sx={{ fontSize: '32px' }}/>}
                                </div>
                                
                            </label>
                        </div>
                    </div>
                </>
            )
        }

        export default AddFile;
import React, { useEffect, useState } from 'react';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import Modal from './Modal';
import api from '../../api/api'; 

function AddFile() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Начальный ID = 0 (корневая папка)
    const [currentPath, setCurrentPath] = useState([
        { id: 0, name: 'Главная' }, 
    ]);
    
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // Состояние для отображения процесса загрузки файла
    const [isUploading, setIsUploading] = useState(false); 

    const currentFolderId = currentPath[currentPath.length - 1].id;

    // --- Загрузка списка файлов (как в предыдущем ответе) ---
    const loadFolderContent = async (parentId) => {
        setIsLoading(true);
        try {
            const res = await api.get(`/files?parentId=${parentId}`);
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

    // --- ЛОГИКА ЗАГРУЗКИ ФАЙЛА (НОВОЕ) ---
    const handleFileUpload = async (e) => {
        // Получаем файлы из инпута
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setIsUploading(true);

        try {
            // Поскольку API принимает один файл за раз, но input multiple,
            // мы проходимся по всем выбранным файлам и отправляем их параллельно.
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                // Ключ 'file' обязателен согласно вашей документации API
                formData.append('file', file); 

                // Отправляем POST запрос
                // URL: /files/upload?parentId=...
                const response = await api.post('/files/upload', formData, {
                    params: {
                        parentId: currentFolderId
                    },
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                return response.data;
            });

            // Ждем завершения всех загрузок
            const newFiles = await Promise.all(uploadPromises);

            // Обновляем список файлов на экране, добавляя новые
            setItems(prev => [...prev, ...newFiles]);

        } catch (error) {
            console.error("Ошибка при загрузке файла:", error);
            alert("Ошибка при загрузке файла");
        } finally {
            setIsUploading(false);
            // Сбрасываем значение инпута, чтобы можно было загрузить тот же файл повторно при необходимости
            e.target.value = '';
        }
    };

    // --- Остальная логика (модалка, навигация) ---
    const isOnCreate = (newItem) => {
        setItems(prev => [...prev, newItem]);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    }

    const openFolder = (item) => {
        if (item.folder) {
            setCurrentPath(prevPath => [...prevPath, { id: item.id, name: item.name }]);
        }
    }

    const navigateToPath = (index) => {
        const newPath = currentPath.slice(0, index + 1);
        setCurrentPath(newPath);
    };

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
                {/* Хедер */}
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
                    {/* Хлебные крошки */}
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

                        {/* Заголовки таблицы */}
                        <div className="flex text-sm font-semibold text-gray-400 border-b border-gray-700 pb-2 mb-2">
                            <div className="w-1/2">Имя</div>
                            <div className="w-1/4 hidden sm:block">Автор</div>
                            <div className="w-1/4">Размер</div>
                        </div>

                        {/* Список файлов */}
                        {isLoading ? (
                            <div className="text-center py-4">Загрузка...</div>
                        ) : (
                            items.map((item) => (
                                <div onClick={() => openFolder(item)} key={item.id} className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                                    <div className="w-1/2 flex items-center space-x-3 font-medium">
                                        {item.folder ? (
                                            <FolderIcon className="text-amber-500" sx={{ fontSize: '24px' }} />
                                        ) : (
                                            <InsertDriveFileIcon className="text-blue-400" sx={{ fontSize: '24px' }} />
                                        )}
                                        <span className="truncate">{item.name}</span>
                                    </div>
                                    <div className="w-1/4 hidden sm:block text-sm text-gray-400">
                                        {item.user?.email}
                                    </div>
                                    <div className="w-1/4 text-sm text-gray-400">
                                        {item.folder ? '-' : (item.size ? `${(item.size / 1024).toFixed(1)} KB` : '0 KB')}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* --- КНОПКА ЗАГРУЗКИ --- */}
                    <input 
                        type="file" 
                        id="file-upload" 
                        style={{ display: 'none' }} 
                        multiple 
                        onChange={handleFileUpload} // <--- ПРИВЯЗАЛИ ФУНКЦИЮ СЮДА
                    />
                    <label htmlFor="file-upload">
                        <div 
                            className={`
                                fixed bottom-6 right-6 w-14 h-14 rounded-full 
                                flex items-center justify-center shadow-xl 
                                cursor-pointer transition-all duration-300
                                ${isUploading ? 'bg-gray-500 animate-pulse cursor-wait' : 'bg-amber-600 hover:bg-amber-700'}
                            `}
                            title="Загрузить файл(ы)"
                        >
                            {/* Меняем иконку, если идет загрузка */}
                            {isUploading ? (
                                <span className="text-white font-bold text-xs">...</span>
                            ) : (
                                <AddIcon className="text-white" sx={{ fontSize: '32px' }}/>
                            )}
                        </div>
                    </label>
                </div>
            </div>
        </>
    )
}
export default AddFile
import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import api from '../api';
import { useDispatch } from 'react-redux';
import { fetchAircrafts } from '../store/aircraftSlice';
import '../assets/styles/TaskUpload.css';

const TaskUpload = ({ aircraftId }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);


    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setUploadStatus(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus({ message: 'Файл не выбран', success: false });
            return;
        }

        try {
            const workbook = await handleExcelFile(selectedFile);
            const tasks = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            const transformedTasks = tasks.map((task) => ({
                name: task['Наименование работ'],
                manpower: Number(task['Трудоемкость']),
                completed: false
            }));
             for(const task of transformedTasks) {
               await  api.post(`/aircrafts/${aircraftId}/tasks`, task)
            }
            setUploadStatus({ message: 'Работы добавлены', success: true });
             dispatch(fetchAircrafts());
             if (fileInputRef.current) {
                fileInputRef.current.value = '';
                setSelectedFile(null);
             }
        } catch (error) {
            console.error('Error uploading tasks:', error);
            setUploadStatus({ message: 'Ошибка загрузки задач', success: false });
        }
    };

    const handleExcelFile = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const binaryString = e.target.result;
                    const workbook = XLSX.read(binaryString, { type: 'binary' });
                    resolve(workbook);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsBinaryString(file);
        });
    };

    return (
        <div className="task-upload-container">
            <label>
                Загрузить заявку в формате Excel:
                <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} ref={fileInputRef} />
            </label>
            <button className='btn' onClick={handleUpload}>Загрузить работы</button>
            {uploadStatus && (
                <div className="upload-status" style={{ color: uploadStatus.success ? 'green' : 'red' }}>
                    {uploadStatus.message}
                </div>
            )}
        </div>
    );
};

export default TaskUpload;
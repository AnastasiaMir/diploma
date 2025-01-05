import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import api from '../api';
import { useDispatch } from 'react-redux';
import { fetchTasks } from '../store/taskSlice';
import '../assets/styles/TaskUpload.css';

const TaskUpload = ({ taskId }) => {
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
            setUploadStatus({ message: 'No file selected', success: false });
            return;
        }

        try {
            const workbook = await handleExcelFile(selectedFile);
            const subtasks = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            const transformedSubtasks = subtasks.map((subtask) => ({
                name: subtask['Наименование задачи'],
                manpower: Number(subtask['Трудоемкость']),
                completed: false
            }));
             for(const subtask of transformedSubtasks) {
               await  api.post(`/api/tasks/${taskId}/subtasks`, subtask)
            }
            setUploadStatus({ message: 'Subtasks uploaded successfully', success: true });
             dispatch(fetchTasks());
             if (fileInputRef.current) {
                fileInputRef.current.value = '';
                setSelectedFile(null);
             }
        } catch (error) {
            console.error('Error uploading subtasks:', error);
            setUploadStatus({ message: 'Error uploading subtasks', success: false });
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
                Upload Excel file:
                <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} ref={fileInputRef} />
            </label>
            <button className='btn' onClick={handleUpload}>Upload Subtasks</button>
            {uploadStatus && (
                <div className="upload-status" style={{ color: uploadStatus.success ? 'green' : 'red' }}>
                    {uploadStatus.message}
                </div>
            )}
        </div>
    );
};

export default TaskUpload;
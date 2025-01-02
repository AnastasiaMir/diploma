import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as XLSX from 'xlsx';
import { createSubtask } from "../store/subtaskSlice";
import '../assets/styles/TaskUpload.css';

function TaskUpload({ task, onTaskUploaded }) {
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();


   const handleFileChange = (e) => {
         const selectedFile = e.target.files[0];
       setFile(selectedFile);
      };

     const handleUpload = async () => {
        if (!file || !task) {
            alert('Выберите una tarea y un archivo');
             return;
        }
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                 for (const row of jsonData) {
                     const newSubtask = {
                        name: row['Наименование задачи'] || '',
                        manpower: row['Трудоемкость'] || 0,
                        task_id: task.id,
                        completed: false
                    };
                      await dispatch(createSubtask(newSubtask));
                }
                alert('Подзадачи успешно загружены!');
                setFile(null)
                onTaskUploaded();
            };
              reader.readAsArrayBuffer(file);
        } catch (error) {
           console.error("Error", error);
            alert("Error ");
        }
    };
     return (
        <div className="task-upload-container">
            <h2>Загрузить подзадачи</h2>
            <div className="input-container">
                 <input type="file" onChange={handleFileChange} accept=".xlsx,.xls" />
            </div>
            <button onClick={handleUpload}>Загрузить</button>
        </div>
    );
}

export default TaskUpload;
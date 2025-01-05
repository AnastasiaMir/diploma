import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubtasks, updateSubtask, deleteSubtask } from '../store/subtaskSlice';
import { selectSubtasksByTaskId } from '../store/subtaskSelectors';
import PropTypes from 'prop-types';
import '../assets/styles/TaskDetails.css';

const TaskDetails =({ task }) => {
    const dispatch = useDispatch();
    const subtasks = useSelector((state) => selectSubtasksByTaskId(state, task.id));
    const loading = useSelector((state) => state.subtasks.loading);
    const error = useSelector((state) => state.subtasks.error);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [taskWithTotal, setTaskWithTotal] = useState({...task, totalManpower: 0})
    const [aggregatedData, setAggregatedData] = useState({
        totalManpower: 0,
        earliestStartDate: null,
        latestFinishDate: null,
    });
    useEffect(() => {
        dispatch(fetchSubtasks(task.id));
    }, [dispatch, task.id]);

    useEffect(() => {
        if (subtasks && subtasks.length > 0) {
            const totalManpower = subtasks.reduce((sum, subtask) => sum + (subtask.manpower ? parseFloat(subtask.manpower) : 0), 0);
            const earliestStartDate = subtasks.reduce((min, subtask) => {
                if (!subtask.start_date) return min;
                const date = new Date(subtask.start_date);
                return min ? (date < min ? date : min) : date;
            }, null);
            const latestFinishDate = subtasks.reduce((max, subtask) => {
                if (!subtask.finish_date) return max;
                const date = new Date(subtask.finish_date);
                return max ? (date > max ? date : max) : date;
            }, null);
             setAggregatedData({
                    totalManpower,
                    earliestStartDate,
                    latestFinishDate,
                });
              setTaskWithTotal(prevState => ({...prevState, totalManpower: totalManpower}))
        } else {
             setAggregatedData({
                    totalManpower: 0,
                    earliestStartDate: null,
                    latestFinishDate: null,
                });
                setTaskWithTotal(prevState => ({...prevState, totalManpower: 0}))
        }


    }, [subtasks, task]);
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus({ type: 'error', message: 'Please select a file.' });
            return;
        }
        setIsLoading(true);
        setUploadStatus(null);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch(`/subtasks/upload/${task.id}`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setUploadStatus({ type: 'success', message: data.message });
                dispatch(fetchSubtasks(task.id));
            } else {
                setUploadStatus({ type: 'error', message: data.message || 'Error uploading the file' });
            }
        } catch (error) {
            console.error(error);
            setUploadStatus({ type: 'error', message: 'An error occurred during upload.' });
        } finally {
            setIsLoading(false);
        }
    };

     const handleUpdateSubtask = async (subtask, completed) => {
        dispatch(updateSubtask({ taskId: task.id, id: subtask.id, updatedSubtask: { ...subtask, completed: completed } }));
    };

    const handleDeleteSubtask = (id) => {
        dispatch(deleteSubtask({ taskId: task.id, id: id }));
    };


  return (
        <div className="subtasks-container">
               {error && <p className='error-message'>Error: {error}</p>}
           {loading && <p>Loading</p>}
                <table className="subtasks-table">
                   <thead>
                   <tr>
                        <th>Наименование подзадачи</th>
                       <th>сумма нормочасов</th>
                       <th>ВЫПОЛНЕНО</th>
                        <th></th>
                     </tr>
                  </thead>
                   <tbody>
                       {subtasks.map((subtask) => (
                        <tr key={subtask.id}>
                           <td>{subtask.name}</td>
                            <td>{subtask.manpower}</td>
                            <td>
                             {" "}
                               <input
                                  type="checkbox"
                                  checked={subtask.completed}
                                   onChange={() =>
                                      handleUpdateSubtask(subtask, !subtask.completed)
                                  }
                              />
                          </td>
                         <td>
                           <button onClick={() => handleDeleteSubtask(subtask.id)} className='delete-icon'>Удалить</button>
                         </td>
                         </tr>
                         ))}
                    </tbody>
                </table>
            <div className="upload-section">
                <h3>Upload subtasks from excel</h3>
                <div>
                   <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} disabled={isLoading} />
                    <button onClick={handleUpload} disabled={isLoading}>
                        {isLoading ? 'Uploading...' : 'Upload Subtasks'}
                     </button>
                   {uploadStatus && (
                         <div className={uploadStatus.type === 'success' ? 'success-message' : 'error-message'}>
                             {uploadStatus.message}
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
}

TaskDetails.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
          start_date: PropTypes.string,
        finish_date: PropTypes.string,
    }).isRequired,
    onClose: PropTypes.func,
};

export default TaskDetails;
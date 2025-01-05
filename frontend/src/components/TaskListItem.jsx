import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
// import SubtaskList from '@/components/SubtaskList';
import { format, differenceInDays } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { deleteTask } from "../store/taskSlice";

const TaskListItem = ({ task }) => {
    const dispatch = useDispatch();
    const [showSubtasks, setShowSubtasks] = useState(false)

    const toggleSubtasks = () => {
       setShowSubtasks(!showSubtasks)
    }
   const totalManpower = useMemo(() => {
       if (!task?.subtasks || !Array.isArray(task.subtasks) || task.subtasks.length === 0) {
            return 0;
        }
        return task.subtasks.reduce((sum, subtask) => sum + subtask.manpower, 0);
    }, [task?.subtasks]);

    const daysLeft = useMemo(() => {
        const finishDate = new Date(task.finish_date);
        const today = new Date();
        return differenceInDays(finishDate, today);
    }, [task.finish_date]);
    const handleTaskDelete = () => {
        dispatch(deleteTask(task.id))
    }
    const handleTaskEdit = () => {
        console.log('Edit task', task.id)
    }

    return (
        <tr>
            <td>{task.name}</td>
            <td>{format(new Date(task.start_date), 'dd.MM.yyyy')}</td>
            <td>{format(new Date(task.finish_date), 'dd.MM.yyyy')}</td>
             <td>{totalManpower}</td>
            <td>{daysLeft}</td>
            <td><input type="checkbox" disabled={true} /></td>
            <td>
                <span onClick={handleTaskDelete} style={{cursor: 'pointer'}}><FontAwesomeIcon icon={faTrash} /></span>
                <span onClick={handleTaskEdit} style={{cursor: 'pointer'}}><FontAwesomeIcon icon={faEdit} /></span>
            </td>
           {/*<td><button onClick={toggleSubtasks}>{showSubtasks ? 'Скрыть подзадачи': 'Показать подзадачи'}</button>*/}
           {/*     {showSubtasks &&  <SubtaskList taskId={task.id} />}</td>*/}
        </tr>
    );
};
export default TaskListItem;
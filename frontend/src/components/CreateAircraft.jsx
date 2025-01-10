import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAircraft } from "../store/aircraftSlice";
import '../assets/styles/CreateAircraft.css';

const CreateAircraft = () => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
    const [dateError, setDateError] = useState('');
  const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.aircrafts)


  const handleSubmit = async (e) => {
    e.preventDefault();
       if (startDate && finishDate && new Date(startDate) > new Date(finishDate)) {
         setDateError('Дата окончания не может быть раньше даты начала');
          return;
        }
    try{
          await dispatch(addAircraft({ name: name, start_date: startDate, finish_date: finishDate, completed: false }));
          setName('');
          setStartDate('');
          setFinishDate('');
        setDateError('');
     }
     catch(err) {
          console.error('Error creating aircraft', err)
      }
  };

  return (
      <div className="create-ac-container">
           {error && <p className="error-message">{error}</p>}
            {loading ? 'Loading...' : null}
            {dateError && <p className="error-message">{dateError}</p>}
          <form onSubmit={handleSubmit}>
              <div>
                 <label htmlFor="name">Бортовой номер ВС:</label>
                 <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required/>
             </div>
            <div>
               <label htmlFor="startDate">Дата начала:</label>
               <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required/>
             </div>
             <div>
              <label htmlFor="finishDate">Дата окончания:</label>
               <input type="date" id="finishDate" value={finishDate} onChange={(e) => setFinishDate(e.target.value)} required/>
            </div>
            <button className='btn' type="submit" disabled={loading}>Добавить</button>
          </form>
      </div>

  );
}

export default CreateAircraft;
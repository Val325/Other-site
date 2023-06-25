import './App.css';
import { useState } from 'react';
import Form from './components/form.js'

function App() {
  const [isShowForm, setForm] = useState(false); 
  
  function handleClick() {
    setForm(!isShowForm);
  } 
  return (
    <div className="App">
      <header>
        React Forum
      </header>
      <div className="Content">
         <button className="ShowForm" onClick={handleClick}>Show form</button>
          Rendering form {isShowForm ? 'yes' : 'no'}
          {isShowForm ? <Form /> : 'no'}
      </div>
    </div>
  );
}

export default App;

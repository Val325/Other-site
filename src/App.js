import './App.css';
import { useEffect,  useState } from 'react';
import Form from './components/form.js'
import Post from './components/post.js'

function App() {
  const [isShowForm, setForm] = useState(false); 
  const [posts, setPosts] = useState({});

  function handleClick() {
    setForm(!isShowForm);
  }
  
  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then(res => res.json())
      .then(
        (result) => {
	  console.log("frontend: ", result)
          setPosts(result) 
        },
        (error) => {
          console.log("catch a error!") 
        }
      )
  }, [])
  
  return (
    <div className="App">
      <header>
        React Forum
      </header>
      <div className="Content">
         <button className="ShowForm" onClick={handleClick}>Show form</button>
          {isShowForm ? <Form /> : ''}
         <div>
          {Object.entries(posts).map(([key, value]) => {
            return (
              <div className="Post">
                id:{key} | {value}
              </div>
            );
          })}
        </div>
      </div> 
    </div>
  );
}

export default App;

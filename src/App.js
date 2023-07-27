import './App.css';
import { useEffect,  useState } from 'react';
import Form from './components/form.js'
import Post from './components/post.js'
import Header from './components/header.js'
import { Link } from "react-router-dom";
function App() {
  const [isShowForm, setForm] = useState(false); 
  const [posts, setPosts] = useState({});
  const [user, setUser] = useState('');
  function handleClick() {
    setForm(!isShowForm);
  }
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/posts")
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
    fetch("http://127.0.0.1:8000/session")
      .then(res => res.json())
      .then(
        (result) => {
	      console.log("frontend: ", result)
          
          setUser(result.user.user) 
        },
        (error) => {
          console.log("catch a error!") 
        }
      )

  }, [])
  
  return (
    <div className="App">
    <header>
        <Header user={user} />
    </header>
      <div className="Content">
         <button className="ShowForm" onClick={handleClick}>Show form</button>
          {isShowForm ? <Form /> : ''}
         <div>
          {Object.entries(posts).map(([key, value]) => {
            return (
              <div className="Post">
                id:{key} | {value.text} <br />
		{ value.url_image &&
		<a href={require("./uploads/" + String(value.url_image))}>
		<img src={require("./uploads/" + String(value.url_image))} width="200" height="200" />
		</a>
		}
		    <Link className="DelLink" to={"/post/" + String(value.id)}>
		       <input type="button" className="ShowPost" value="Show post" />
		    </Link>
              </div>
            );
          })}
        </div>
      </div> 
    </div>
  );
}

export default App;

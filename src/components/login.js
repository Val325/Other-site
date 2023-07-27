import '../App.css';
import { useEffect,  useState } from 'react';
import Form from './form.js'
import Post from './post.js'
import { Link } from "react-router-dom";

function Login() {
  const [isShowForm, setForm] = useState(false); 
  const [login, setLogin] = useState({});
  const [password, setPassword] = useState({});

  function handleSubmit() {
      // send to server
      
      
      fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        credentials: "include",
        headers: {         
            "content-type": "application/json",   
        },
        body:JSON.stringify({
            "login":login,
            "Password":password,
        }) 
      });
  }
  
  return (
    <div className="App">
      <header>
        React Forum
      </header>
      <div className="Content">
        <div className="Form">
            Login
            <form method="post" action={"http://127.0.0.1:8000/login"} > 
                <label for="textPost">Your login:</label><br />
                <input type="text" onChange={e => setLogin(e.target.value)} /><br /><br />
                <label for="textPost">Your password:</label><br />
                <input type="password" onChange={e => setPassword(e.target.value)} /><br /><br />
	            <input type="button" className="ShowForm" value="Send" onClick={handleSubmit} />
            </form> 
        </div> 
      </div> 
    </div>
  );
}

export default Login;

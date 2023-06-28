import '../App.css';
import { useState } from 'react';
import { Post } from './post.js';

function Form() {
  const [isSent, setIsSent] = useState(false);
  const [msg, setMsg] = useState('');
  const [Posts, setPosts] = useState([{}]);
  function handleSubmit() {
      // send to server
	
      fetch('http://127.0.0.1:8000/', {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
             text: msg,
             
           }
         })
      });

      setPosts([...Posts,{"text":msg}]) 
  } 
  return (
    <div className="Form">
      <form method="post" action="http://127.0.0.1:8000/"> 
        <label for="textPost">Text</label><br />
        <input type="text" onChange={e => setMsg(e.target.value)} value={msg} /><br /><br />
	<input type="button" className="ShowForm" value="Send" onClick={handleSubmit} />
      </form>
      
    </div>
  );
}

export default Form;

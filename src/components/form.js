import '../App.css';
import { useState } from 'react';
import { Post } from './post.js';

function Form() {
  const [isSent, setIsSent] = useState(false);
  const [msg, setMsg] = useState('');
  const [Posts, setPosts] = useState([{}]);
  function handleSubmit() {
      // send to server
      setPosts([...Posts,{"text":msg}]) 
  } 
  return (
    <div className="Form">
      <form> 
        <label for="textPost">Text</label><br />
        <input type="text" onChange={e => setMsg(e.target.value)} value={msg} /><br /><br />
	<input type="button" value="Send" onClick={handleSubmit} />
      </form>
      <div>
	  {Posts.map(post => <Post text={post.text}/>)}
      </div>
    </div>
  );
}

export default Form;

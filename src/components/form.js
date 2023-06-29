import '../App.css';
import { useState } from 'react';
import { Post } from './post.js';

function Form() {
  const [isSent, setIsSent] = useState(false);
  const [msg, setMsg] = useState('');
  const [Posts, setPosts] = useState([{}]);
  const [image, setImage] = useState({ data: '' });

  function handleSubmit() {
      // send to server
      setPosts([...Posts,{"text":msg}]) 
      const formData = new FormData();
      formData.append('image', image);
      formData.append('text', msg);
      
      fetch('http://127.0.0.1:8000/', {
        method: 'POST',
	
        body:formData 
      });

      //setPosts([...Posts,{"text":msg}]) 
  }



  return (
    <div className="Form">
      <form method="post" action="http://127.0.0.1:8000/" encType="multipart/form-data"> 
        <label for="textPost">Text</label><br />
        <input type="text" onChange={e => setMsg(e.target.value)} value={msg} /><br /><br />
	<input type="file" name="image" onChange={e => setImage(e.target.files[0])} /><br />
	<input type="button" className="ShowForm" value="Send" onClick={handleSubmit} />
      </form>
      
    </div>
  );
}

export default Form;

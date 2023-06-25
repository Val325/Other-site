import '../App.css';
import { useState } from 'react';

export function Post({text}) {  
  return (
    <div className="Post">
	<p>
	  {text}
	</p> 
    </div>
  );
}

//export default Post;

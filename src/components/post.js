import '../App.css';
import { useState } from 'react';

export function Post({data}) {  
  return (
    <div className="Post">
	<p>
	  {data}
	</p> 
    </div>
  );
}

export default Post;

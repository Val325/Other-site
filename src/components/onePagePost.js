import '../App.css';
import { useEffect,  useState } from 'react';
import {useParams} from 'react-router-dom';
function OnePost() {
  const params = useParams();
  const [post, setPost] = useState({});

  useEffect(() => { 
    console.log("params: ", params.postId)
    fetch("http://127.0.0.1:8000/api/posts")
      .then(res => res.json())
      .then(
        (result) => {
	  console.log("frontend: ", result)
          setPost(result)
	  console.log("setPost: ", post)
        },
        (error) => {
          console.log("catch a error!") 
        }
      )
  }, []) 

  return (
    <div className="App">
      <div className="Content">
       <div className="Post">
	  id:{post[params.postId]?.id} | text:{post[params.postId]?.text} <br />
	  { post[params.postId]?.url_image &&
	    <a href={require("../uploads/" + String(post[params.postId]?.url_image))}>
		<img src={require("../uploads/" + String(post[params.postId]?.url_image))} width="200" height="200" />
	    </a>
	  } 
	</div>
       </div>
    </div>
           
  );
}

export default OnePost;


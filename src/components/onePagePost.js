import '../App.css';
import { useEffect,  useState } from 'react';
import {useParams} from 'react-router-dom';
import { Link } from "react-router-dom";
import {FormPost} from './form.js'

function OnePost() {
  const params = useParams();
  const [post, setPost] = useState({});
  const [isShowForm, setForm] = useState(false); 
  const [posts, setPosts] = useState({});

  function handleClick() {
    setForm(!isShowForm);
  }

  useEffect(() => { 
    console.log("params: ", params.postId)

    fetch("http://127.0.0.1:8000/api/posts/")
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

   fetch("http://127.0.0.1:8000/api/posts/" + String(params.postId))
      .then(res => res.json())
      .then(
        (result) => {
	  console.log("frontend: ", result[params.postId])
          setPosts(result)
	  console.log("setPost: ", post)
        },
        (error) => {
          console.log("catch a error!") 
        }
      )

  }, []) 

  return (
    <div className="App">
      <header>
        React Forum Post
      </header>
	
      <div className="Content">
	<button className="ShowForm" onClick={handleClick}>Show form</button>
	{isShowForm ? <FormPost id={params.postId} /> : ''}
       <div className="Post">
	  id:{post[params.postId]?.id} | text:{post[params.postId]?.text} <br />
	  { post[params.postId]?.url_image &&
	    <a href={require("../uploads/" + String(post[params.postId]?.url_image))}>
		<img src={require("../uploads/" + String(post[params.postId]?.url_image))} width="200" height="200" />
	    </a>
	  }
	  <Link className="DelLink" to={"/"}>
	     <input type="button" className="ShowPost" value="Back" />
	  </Link>
	</div>
	<div>
          {posts && Object.entries(posts).map(([key, value]) => {
            if (value !== null && key !== null) {
            return (
              <div className="Post">
                id:{key} | {value.text} <br />
		{ value.url_image &&
		<a href={require("../uploads/" + String(value.url_image))}>
		<img src={require("../uploads/" + String(value.url_image))} width="200" height="200" />
		</a>
		} 
              </div>
            );
          }})}
        </div>
       </div>
    </div>
           
  );
}

export default OnePost;


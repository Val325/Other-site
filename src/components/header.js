import '../App.css';
import { useState } from 'react';
import { Link } from "react-router-dom";

export function Header({user}) {  
  return (
    <>
            <div className="LinkMenu" >React Forum user:{user}</div>
      {user === null && 
         
            <>
                <Link className="LinkMenu"  to={"/login"}>
		            <div >login</div> 
		        </Link> 
                <Link className="LinkMenu" to={"/registration"}>
		            <div  >registration</div> 
		        </Link>
            </>
        }
      </>
  );
}

export default Header;

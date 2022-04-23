import React, { useContext, useEffect, useRef, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Context from '../context/Context';
import Button from './Button'
import {AiFillTags} from "react-icons/ai";
import {MdCancel} from "react-icons/md";
export default function Comments() {
  let { userdetails, authtoken, eachblog,postvalue } = useContext(Context)
  let [comments, setcomments] = useState([])
  let [tag,settag] = useState(null)

  let btnref = useRef()
  const AllComment = () => {
    fetch(`http://localhost:8000/api/v1/GetComments/${postvalue}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        
      }
    }).then(async (res) => {
      let data = await res.json()
      console.log(data);
      setcomments(data)
    }).catch(async (err) => {
      let error = await err
      
    })
  }

  useEffect(() => {
    
      AllComment()
    

  }, [])
  
  let AddComment = (e) =>{
    e.preventDefault()
    if(tag){
      fetch('http://localhost:8000/api/v1/PostComment/',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + authtoken.access
      },
      body:JSON.stringify({
        comment:e.target.comment.value,
        user:userdetails.payload.username,
        Blog:eachblog.blog_id,
        parent:tag
        
      })
    }).then(async (res)=>{
      let data = await res.json()
      console.log(data)
      setcomments(comments.concat(data))
    }).catch((err)=>{
      
    })
    }
    else{
      fetch('http://localhost:8000/api/v1/PostComment/',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization':'Bearer ' + authtoken.access
          
        },
        body:JSON.stringify({
          comment:e.target.comment.value,
          user:userdetails.payload.username,
          Blog:eachblog.blog_id
         
          
        })
      }).then(async (res)=>{
        let data = await res.json()
        console.log(data)
        setcomments(comments.concat(data))
      }).catch((err)=>{
        
      })      
    }
    
  }
  return (
    <div>
      <h2 className='mx-3 '>Comments</h2>

      <div className='container my-3 border-2 border-red-500 py-2'>
        <h4 className="my-2">add comment</h4>
        <hr />
        <h6 id="tag_person"></h6>
        <div className='my-2 mx-2'>
          <form onSubmit={AddComment}>
          <textarea className='p-2 outline-none rounded-md my-2 bg-gradient-to-tr from-rose-500 to-purple-500 bg-opacity-50 text-white w-full' type="text" name="comment" id="comment" placeholder="Type Your Comment" />
          <Button disabled={!authtoken} className="bg-blue-500 text-white focus:ring-[7px] focus:ring-blue-500 focus:ring-opacity-50 focus:transition-all focus:fade-in-out transition-all fade-in-out hover:bg-blue-600" >{authtoken?"Send":"Login To Comment"}</Button>
          </form>
        </div>
        <hr />
        
        {comments.map((com) => {
          return (
            <div class="md:grid grid-cols-[100px_200px_auto_330px_50px] md:my-auto my-3" key={com.sno}>
              <div className=" my-2 "><Avatar
                alt="Remy Sharp"
                src={com.profile_image}
                sx={{ width: 56, height: 56 }}
                className="hover:animate-pulse"

              /></div>
              <div className=" text-start my-auto break-all"><b>{com.user}</b> </div>
              <div className=" my-auto "><p className="my-auto break-all">{com.parent_name?(
                <>
                <b>Replied to {com.parent_name}</b>
                
                </>
              ):(
                null
              )} {com.comment}</p></div>
              <div className='md:ml-auto my-auto'>{com.datestamp} {com.timestamp}</div>
              <input className='hidden' id={com.sno} type="text"  value={com.sno}/>
              {userdetails?(
                userdetails.payload.username!==com.user?(
                
                  <div  className='my-auto md:mx-2 '><AiFillTags id={`${com.sno}icon`}   onClick={function changecolour(e){
                    
                    if(document.getElementById(`${com.sno}icon`).style.backgroundColor==="yellow"){
                      document.getElementById(`${com.sno}icon`).style.backgroundColor="transparent"
                      document.getElementById('tag_person').innerHTML = ""
                      
                      settag(null)
                    }
                    else{
                      document.getElementById(`${com.sno}icon`).style.backgroundColor="yellow"
                      document.getElementById('tag_person').innerHTML = 'Tagged ' + com.user
                      
                      
                      settag(document.getElementById(com.sno).value)
                      
                    }
  
                    
                    
                    
                    
                  }}/></div>
                  
                ):(
                  <div className='my-auto md:mx-2'><MdCancel id="close"/></div>
                )
              ):(
                null
              )}
              
              
              
            </div>
          )
        })}


      </div>
    </div>
  )
}

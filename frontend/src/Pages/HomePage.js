
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import Context from '../context/Context'

export default function HomePage() {
  let {authtoken,setuserdetails,ModalisOpen,setModalisOpen} = useContext(Context)
  
  const GetUser = async () =>{
    
    let response = await fetch('http://localhost:8000/api/v1/getuser/',{
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + authtoken.access 
      }
    })
    let data = await response.json()
    
    localStorage.setItem('user_details',JSON.stringify(data))

    setuserdetails(data)
  }

  useEffect(()=>{
    if(authtoken){
      GetUser()
      
    }
    
  },[])
  localStorage.removeItem('eachblog')
  return (
    <div id="HomePage" className='bg-[url("assets/images/home1.jpg")] h-screen bg-cover bg-center bg-no-repeat' >
      
    </div>
  )
}

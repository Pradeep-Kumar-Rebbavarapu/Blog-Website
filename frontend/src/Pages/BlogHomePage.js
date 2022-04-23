import React from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import bloghome1 from '../assets/images/bloghome1.jpg'
import Context from '../context/Context'
export default function BlogHomePage() {
    let navigate = useNavigate()
    let { allblogs, setallblogs, authtoken,GetAllBlogs } = useContext(Context)
    
    console.log('blog home page')
    return (
        <>
        <div className="grid md:grid-cols-2 py-16 z-[-1] bg-gray-700 text-white">
            <div className="container-fluid my-3  transition-all fade-in-out">
                <div className="border-2 rounded-tr-full rounded-bl-full  p-4 bg-white bg-opacity-50">
                <div className="border-2 rounded-tl-full bg-white bg-opacity-50 rounded-br-full p-4">
                <img className="h-[600px] w-[600px] mx-auto my-auto rounded-tr-full border-2 border-black  rounded-bl-full" src={bloghome1} alt="" />
                </div>
                </div>
            </div>
            <div className="container-fluid text-center my-auto">
                <div>
                    <h1>On The Way,Down to Our Blogs</h1>
                    <h4>Do Have A Look</h4>
                </div>
                <hr/>
                <div className='border-2 p-2 rounded-full'>
                    <h3>Wanna Make a Blog</h3>
                    <button onClick={()=>{
                        if(authtoken){
                            navigate('/Addblog')
                        }
                        else{
                            navigate('/Login')
                        }
                        
                        }} className='p-1 border-2 rounded-md hover:bg-white hover:text-black hover:transition-all hover:fade-in-out transition-all fade-in-out animate-pulse hover:animate-none'>Create A Blog</button>
                </div>
            </div>
        </div>
        </>
    )
}

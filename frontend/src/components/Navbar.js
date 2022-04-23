import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { FcHome, FcAbout, FcBusinessContact } from "react-icons/fc";
import { FaBloggerB,FaSearch } from 'react-icons/fa'
import { RiLoginBoxFill,RiLogoutBoxFill } from 'react-icons/ri'
import { IoPersonAdd, IoPersonAddSharp } from 'react-icons/io5'
import { AiFillHome, AiFillContacts } from 'react-icons/ai'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import logo from '../assets/images/logo.webp'
import { useContext } from 'react';
import Context from '../context/Context'
import Alert from './Alert';
export default function Navbar() {
    let {authtoken,setauthtoken,setuserdetails,userdetails} = useContext(Context)
    let navigate = useNavigate()
    let logout = (e) =>{
        e.preventDefault()
        localStorage.clear()
        setauthtoken(null)
        setuserdetails(null)
        navigate('/Login')
    }
    return (
        <div>
            <div id="navbar" className="bg-black  position-fixed w-full bg-opacity-50 z-10">
                <div className='flex'>
                <div className='mr-3 ml-2 my-auto'>
                    <img className='w-9 h-9 rounded-full' src={logo} />
                </div>
                <ul className='flex py-3 my-auto'>

                    <Tippy content={<h6 className='m-0 p-0 '>Home</h6>} className=''>
                    <li className='mx-2 '><Link to="/"><AiFillHome className='w-6 h-6 hover:border-b-2 border-white transition-all fade-in-out hover:transition-all hover:fade-in-out hover:scale-125' color="white" /></Link></li>
                    </Tippy>

                    <Tippy content={<h6 className='m-0 p-0'>Blog</h6>} className=''>
                    <li className='mx-2 '><Link to="/Blog"><FaBloggerB className='w-6 h-6 hover:border-b-2 border-white transition-all fade-in-out hover:transition-all hover:fade-in-out hover:scale-125' color="white" /></Link></li>
                    </Tippy>
                    
                    <Tippy  content={<h6 className='m-0 p-0'>Login</h6>} className=''>
                    <li  className={`mx-2 ${authtoken?"hidden":""}`}><Link to="/Login"><RiLoginBoxFill className='w-6 h-6 hover:border-b-2 border-white transition-all fade-in-out hover:transition-all hover:fade-in-out hover:scale-125' color="white" /></Link></li></Tippy>

                    <Tippy content={<h6 className='m-0 p-0'>Signup</h6>} className=''>
                    <li className='mx-2 '><Link to="/Signup"><IoPersonAddSharp className='w-6 h-6 hover:border-b-2 border-white transition-all fade-in-out hover:transition-all hover:fade-in-out hover:scale-125' color="white" /></Link></li></Tippy>

                    <Tippy content={<h6 className='m-0 p-0'>Contact Us</h6>} className=''>
                    <li className='mx-2 '><Link to="/Contact"><AiFillContacts className='w-6 h-6 hover:border-b-2 border-white transition-all fade-in-out hover:transition-all hover:fade-in-out hover:scale-125' color="white" /></Link></li></Tippy>

                    <Tippy content={<h6 className='m-0 p-0'>Search</h6>} className=''>
                    <li className='mx-2 '><Link to="/Search"><FaSearch className='w-6 h-6 hover:border-b-2 border-white transition-all fade-in-out hover:transition-all hover:fade-in-out hover:scale-125' color="white" /></Link></li></Tippy>
                    

                {authtoken?(
                    <Tippy content={<h6 className='m-0 p-0'>Logout</h6>} className=''>
                    <li className='mx-2 '><Link to="/Contact"><RiLogoutBoxFill className='w-6 h-6 hover:border-b-2 border-white transition-all fade-in-out hover:transition-all hover:fade-in-out hover:scale-125' onClick={logout} color="white" /></Link></li></Tippy>
                ):(
                    null
                )}
                    
                    
                    {/* <Tippy content={<h6 className='m-0 p-0'>About Us</h6>} className=''>
                    <li className='mx-2 '><Link to="/"><FcAbout className='w-6 h-6 hover:border-b-2 border-white transition-all fade-in-out hover:transition-all hover:fade-in-out hover:scale-125' color="white" /></Link></li></Tippy> */}

                </ul>
                <div className='my-auto flex ml-auto mr-3'>
                    <h6 className='mx-2 my-auto text-white'>{userdetails?userdetails.payload.email:""}</h6>
                    {userdetails?(
                        <img className='h-10 w-10 rounded-full' src={userdetails.payload.base64} alt=""/>
                    ):(
                        null
                    )}
                    
                </div>
                </div>
                <div>
                        <Alert/>
                </div>
                
            </div>
            
        </div>
        
    )
}

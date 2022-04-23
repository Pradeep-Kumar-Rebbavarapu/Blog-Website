import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Comments from '../components/Comments';
import Context from '../context/Context';

export default function BlogPost() {
    let {postvalue,setpostvalue,authtoken,eachblog,GetEachBlog} = useContext(Context)
    
    let location = useLocation()
    
      useEffect(()=>{
        GetEachBlog()
      },[])
    

      
    console.log('blog post page')
    
    return (
        <div>
            <section className="text-gray-600 body-font">
                <div className="flex py-24 items-center justify-center flex-col">
                    <img className="object-cover object-center rounded" alt="hero" src={eachblog?eachblog.image:""}/>
                        <div className="text-center  w-full">
                            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">{eachblog?eachblog.title:""}</h1>
                            <p className="leading-relaxed container-fluid">{eachblog?eachblog.desc:""}</p>
                            <div className="flex justify-center">
                                <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">{eachblog?eachblog.datestamp:""}</button>
                                <button className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">{eachblog?eachblog.timestamp:""}</button>
                            </div>
                        </div>
                </div>
            </section>
            <Comments/>
        </div>
    )
}



import { createContext } from "react";
import * as Yup from 'yup'
import { Formik, Form ,Field} from 'formik'
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
let Context = createContext()

export default Context

export const ContextProvider = ({children}) =>{
    let [Signupbase64, setSignupbase64] = useState(null)
    let [Loginbase64, setLoginbase64] = useState(null)
    let [loading,setloading] = useState(false)
    let [authtoken,setauthtoken] = useState(localStorage.getItem('authtoken')?JSON.parse(localStorage.getItem('authtoken')):null)

    let [userdetails,setuserdetails] = useState(localStorage.getItem('user_details')?JSON.parse(localStorage.getItem('user_details')):null)
    let [ModalisOpen,setModalisOpen] = useState(false)

    let [allblogs,setallblogs] = useState([])

    let [userblogs,setuserblogs] = useState([])

    let [postvalue,setpostvalue] = useState(localStorage.getItem('postvalue')?localStorage.getItem('postvalue'):null)

    let [eachblog, seteachblog] = useState(localStorage.getItem('eachblog')?JSON.parse(localStorage.getItem('eachblog')):null)

    let [nexturl,setnexturl] = useState('http://localhost:8000/api/v1/GetAllBlogs/')
    let [usernexturl,setusernexturl] = useState()

    let navigate = useNavigate()


    let [alert,setalert] = useState({class:"hidden",message:""})

    let [email,setemail] = useState(localStorage.getItem('email')?localStorage.getItem('email'):null)

    let location = useLocation()
    const GetUserBlogs = async () =>{
        let response = await fetch('http://localhost:8000/api/v1/GetUserBlogs/',{
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer ' + authtoken.access
          }
        })
        let data = await response.json()
        console.log('get user blogs')
        setuserblogs(data)
      }
      
      const GetEachBlog = async () =>{
        let response = await fetch(`http://localhost:8000/api/v1/GetEachBlog/${postvalue}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
            
          }
        })
        let data = await response.json()
        console.log('get each blog')
        seteachblog(data)
        
      }


      
        if (location.pathname === "/verifyotp") {
          localStorage.setItem('email', email)
        }
        else {
          localStorage.removeItem('email')
        }
      
      

      
    const ContextData = {
        Signupbase64:Signupbase64,
        setSignupbase64:setSignupbase64,
        loading:loading,
        setloading:setloading,
        Loginbase64:Loginbase64,
        setLoginbase64:setLoginbase64,
        authtoken:authtoken,
        setauthtoken:setauthtoken,
        ModalisOpen:ModalisOpen,
        setModalisOpen:setModalisOpen,
        userdetails:userdetails,
        setuserdetails:setuserdetails,
        allblogs:allblogs,
        setallblogs:setallblogs,
        userblogs:userblogs,
        setuserblogs:setuserblogs,
        GetUserBlogs:GetUserBlogs,
        postvalue:postvalue,
        setpostvalue:setpostvalue,
        eachblog:eachblog,
        seteachblog:seteachblog,
        GetEachBlog:GetEachBlog,
        nexturl:nexturl,
        setnexturl:setnexturl,
        alert:alert,
        setalert:setalert,
        email:email,
        setemail:setemail,
    }
    return(
        <Context.Provider value={ContextData}>
            {children}
        </Context.Provider>
    )
}
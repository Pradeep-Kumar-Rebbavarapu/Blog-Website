import React from 'react'
import { useContext } from 'react'
import Context from '../context/Context'
import FaceRecognition from './FaceRecognition'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import Input from '../components/Input'
import Button from '../components/Button'
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';
import { Navigate, useNavigate } from 'react-router-dom'
import { Alert } from '@mui/material'
Modal.setAppElement('#root')
export default function LoginPage() {
  let { Loginbase64,setauthtoken,setloading,loading ,ModalisOpen,setModalisOpen,authtoken,setuserdetails,setalert} = useContext(Context)


  let navigate = useNavigate()
  
  const initialValues = {
    email: '',
    password: '',
    username: '',
  }
  const validate = (values) => {
    let errors = {}
    if (isNaN(values.password)) {
      errors.password = 'Password Must be A Mix Of Alphabets and Numbers'
    }
   
    return errors
  }
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid Email Format').required('Required'),
    password: Yup.string().required('Required'),
    username: Yup.string().required('Required')
  })
  const onSubmit = (values) => {
    
    Login(values)
  }
  const Login = async (values) => {
    try{
      setloading(true)
    let response = await fetch('http://localhost:8000/api/v1/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email":values.email,
        "username":values.username,
        "password":values.password,
        "base64":Loginbase64
      })
    })
    let data = await response.json()
    if(response.status===200){
      localStorage.setItem('authtoken',JSON.stringify(data))
      setauthtoken(data)
      navigate('/')
    }
    else{
      setalert({class:'bg-red-500',message:"Login Unsuccesful please recheck Your Credentials Or Signup Once More"})
    }
    setloading(false)
    setModalisOpen(true)
    }
    catch(err){
      setalert({class:'bg-red-500',message:err})
    }
    
    
  }

  localStorage.removeItem('eachblog')
  
  if(loading){
    return <h1>Loading...</h1>
  }
  return (
    <div className='py-16 bg-[url("assets/images/login2.jpg")] bg-cover bg-no-repeat bg-center'>
      <div className='grid md:grid-cols-2 '>
        <div className=''>
          <FaceRecognition h1color="text-white"/>
        </div>
        <div className='container-fluid'>
        <h1 className=' mt-3 text-center text-white border-2 border-black ring-[7px] ring-white ring-opacity-50 w-fit p-3 rounded-md bg-black md:ring-black md:ring-opacity-70 bg-opacity-50'>Login Here</h1>
          <Formik onSubmit={onSubmit} validationSchema={validationSchema} initialValues={initialValues}>
            {
              formik =>{
             
                return(
                  <Form>
                  <Input type="email" placeholder="email" name="email" className="focus:ring-[7px]" />
                  <Input type="text" placeholder="username" name="username" className="focus:ring-[7px]" />
                  <Input type="password" placeholder="password" name="password" className="focus:ring-[7px]" />
                  <Button disabled={Loginbase64===null?true:false || !formik.isValid || !formik.dirty} className="my-3 focus:ring-black   border-4 border-black bg-black text-white" type="submit" >Login</Button>
                </Form>
                )
              }
              
                
            }
          </Formik>
          
          <form action="" onSubmit={Login}>

            
          </form>
        </div>
      </div>


    </div>
  )
}

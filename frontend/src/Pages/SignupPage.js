import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import Context from '../context/Context'
import * as Yup from 'yup'
import { Formik, Form } from 'formik'
import FaceRecognition from './FaceRecognition'
import Input from '../components/Input'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from '../components/Button'
import Divider from '@mui/material/Divider';
import { Navigate, useNavigate } from 'react-router-dom'
export default function SignupPage() {
  const [profilepic, setprofilepic] = useState(null)
  let { Signupbase64, loading, setloading,setalert,setSignupbase64,email,setemail } = useContext(Context)
  let navigate = useNavigate()
  const initialValues = {
    email: '',
    password: '',
    username: '',
    first_name: '',
    last_name: '',
    mobile: '',
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
    password: Yup.string().required('Required').min(5, 'Too Short!').matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Password Must Contain atleast 5 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
    username: Yup.string().required('Required').min(5, 'Too Short!'),
    first_name: Yup.string().required('Required').min(5, 'Too Short!'),
    last_name: Yup.string().required('Required').min(5, 'Too Short!'),
    mobile: Yup.string().required('Required').max('12', 'Enter Valid Phone Number'),
  })

  
  const onSubmit = (values) => {

    Signup(values)
  }

  const Signup = async (values) => {
    try {
      setloading(true)
      let response = await fetch('http://localhost:8000/api/v1/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "email": values.email,
          "password": values.password,
          "username": values.username,
          "first_name": values.first_name,
          "last_name": values.last_name,
          "mobile": values.mobile,
          "base64": Signupbase64
        })
      })
      let data = await response.json()
      console.log('data',data);
      if(response.status===200){
        setalert({class:"bg-green-500",message:"Signed Up Succesfully"})
        setemail(data.email)
        navigate('/verifyotp')
      }
      else{
        if(Signupbase64==null){
          setalert({class:"bg-red-500",message:"Photo not taken Please Signin once More"})
          
        }
        else if(data.username){
          setalert({class:"bg-red-500",message:`username : ${data.username}`})
          
        }
        else if(data.password){
          setalert({class:"bg-red-500",message:`password : ${data.password}`})
          
        }
        else if(data.email){
          setalert({class:"bg-red-500",message:`email : ${data.email}`})
          
        }
        else if(data.errors){
          setalert({class:"bg-red-500",message:data.errors})
          
        }
        else{
          setalert({class:"bg-red-500",message:"could not signup please recheck Your Credentials"})
          
        }
        setSignupbase64(null)
        
        
      }
      setloading(false)
    }
    catch(e){
      console.log(e)
    }
    
  }
  if (loading) {
    return <h3>Loading...</h3>
  }
  return (

    <div className=' bg-[url("assets/images/signup3.jpg")] bg-center bg-cover bg-no-repeat h-full border-2 border-red-500'>
      <div className='md:grid grid-cols-2 pt-16'>

        <div className='mx-3'>
          <h1 className=' mt-3 text-center text-white border-2 border-black ring-[7px] ring-white ring-opacity-50 w-fit p-3 rounded-md bg-black md:ring-black md:ring-opacity-70 bg-opacity-50'>Signup Here</h1>
          <Formik onSubmit={onSubmit} initialValues={initialValues} validationSchema={validationSchema || validate} validateOnChange validateOnBlur>
            {
              formik =>
              
                <Form>
                  {console.log(formik)}
                  <Input className="focus:ring-rose-600 focus:ring-[7px]" type="text" name="username" placeholder="username" label="Username" />
                  <Input className="focus:ring-rose-600 focus:ring-[7px]" type="text" name="first_name" placeholder="first_name" label="First Name" />
                  <Input className="focus:ring-rose-600 focus:ring-[7px]" type="text" name="last_name" placeholder="last_name" label="Last Name" />
                  <Input className="focus:ring-rose-600 focus:ring-[7px]" type="phone" name="mobile" placeholder="mobile" label="Mobile Number" />
                  <Input className="focus:ring-rose-600 focus:ring-[7px]" type="email" name="email" placeholder="email" label="Email" />
                  <Input className="focus:ring-rose-600 focus:ring-[7px]" type="password" name="password" placeholder="password" label="Password" />
                  <Button disabled={Signupbase64!=null?false:true || !formik.dirty || !formik.isValid} className="my-3 focus:ring-black   border-4 border-black bg-black text-white" type="submit">SignUp</Button>
                </Form>
            }


          </Formik>

        </div>
        <div>
          <FaceRecognition h1color="text-white" />
        </div>
      </div>





    </div>
  )
}

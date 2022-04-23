import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import Context from '../context/Context'

export default function VerifyOtpPage() {
    let {email,setalert} = useContext(Context)
    let location = useLocation()
    let navigate = useNavigate()

    let [otp,setotp] = useState(null)
    const verifyotp = async (e) =>{
        e.preventDefault()
        let response = await fetch('http://localhost:8000/api/v1/verify_otp/',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
              "email":email,
              "otp":otp
            })
        })
        let data = await response.json()
        console.log(data);
        if(response.status===200){
          setalert({class:'bg-green-500 text-black',message:data.message})
          navigate('/')
        }
        else{
          setalert({class:'bg-cyan-500 text-black',message:data.errors})
        }

    }


    
    const resendotp = async (e) =>{
        e.preventDefault()
        let response = await fetch('http://localhost:8000/api/v1/verify_otp/',{
            method:'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
              "email":email,
              "otp":otp
            })
        })
        let data = await response.json()
        console.log(data)
        if(response.status===200){
          setalert({class:'bg-green-500 text-black',message:data.message})
        }
        else{
          setalert({class:'bg-cyan-500 text-black',message:data.errors})
        }
        
    }
  return (
    <div className='py-20 container'>
        <h1>Verify Your Otp</h1>
      <form action="" >
          <input className='w-full border-2  focus:ring-black rounded-md p-1 focus:ring-[7px] outline-none transition-all fade-in-out focus:ring-opacity-50 focus:transition-all focus:fade-in-out' type="Phone" name="otp" id="otp" placeholder="otp" label="otp" onChange={(e)=>{
            setotp(e.target.value)
          }} />
          <div className="flex justify-center">
          <Button className="mx-2 border-2 bg-red-500 my-2 text-white hover:bg-red-600"  onClick={verifyotp}>Verify Otp</Button>
          <Button className="mx-2 border-2 bg-red-500 my-2 text-white hover:bg-red-600" onClick={resendotp}>Resend Otp</Button>
          </div>
      </form>
    </div>
  )
}

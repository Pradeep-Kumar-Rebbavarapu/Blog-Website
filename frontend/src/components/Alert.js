import React, { useContext } from 'react'
import Context from '../context/Context'

export default function Alert() {
    let {alert,setalert} = useContext(Context)
  return (
      <>
    <div className={`${alert.class} p-1 m-2 bg-opacity-100`}>
      {alert.message}
      <button className='ml-auto' onClick={()=>{
        setalert({class:"hidden",message:"hello"})
    }}>close</button>
    </div>
    
    </>
  )
}

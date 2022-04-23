import React from 'react'

export default function Button(props) {
  let {id,type,className,children,...rest} = props
  return (
    <div className='flex justify-center'>
      <button id={id} className={` p-2   focus:ring-[6px] focus:ring-rose-500 focus:ring-opacity-50 focus:transition-all focus:fade-in-out fade-in-out transition-all rounded-md ${className}` } type={type} {...rest}>{children}</button>
    </div>
  )
}

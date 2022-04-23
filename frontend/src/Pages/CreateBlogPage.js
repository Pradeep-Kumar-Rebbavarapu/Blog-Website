import React from 'react'
import { Formik, Form, Field } from 'formik'
import { useContext } from 'react'
import Context from '../context/Context'
import { useEffect } from 'react'
import { useState } from 'react'
import Input from '../components/Input'
import * as Yup from 'yup'
import TextArea from '../components/TextArea'
import Button from '../components/Button'
import Blog from '../components/Blog'
export default function CreateBlogPage() {
  let { userdetails,allblogs,authtoken,setallblogs,GetUserBlogs,setuserblogs,userblogs } = useContext(Context)
  let [blogimage, setblogimage] = useState(null)
  
  const initialValues = {
    title: "",
    desc: "",
    user: userdetails.payload.username

  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Required').min(5, 'Title Should Contain Atleast 5 Characters'),
    desc: Yup.string().required('Required')

  })

  const onSubmit = (values) => {
    AddBlog(values)
  }

  const AddBlog = async (values) =>{
    let formData = new FormData()
    formData.append('title',values.title)
    formData.append('desc',values.desc)
    formData.append('user',userdetails.payload.username)
    formData.append('image',blogimage[0])
    let response = await fetch('http://localhost:8000/api/v1/AddBlogs/',{
      method:'POST',
      headers:{
        'Authorization':'Bearer ' + authtoken.access
      },
      body:formData
    })
    let data = await response.json()
    console.log('addblog')
    setallblogs(allblogs.concat(data))
    setuserblogs(userblogs.concat(data))
    GetUserBlogs()
    window.location.reload()
  }



  

  useEffect(()=>{
    if(authtoken){
      GetUserBlogs()
      console.log('useEffect of create blog page')
    }
    
  },[])
  return (
    <div className="">
      
      <div className=' px-3 pb-3 pt-20 bg-stone-800  '>
      <h1 className="text-center text-white">Add A Blog</h1>
      
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          {
            formik =>
              <Form>
                <Input type="text" name="title" ringcolor="ring-rose-500" label="Title" className="focus:ring-[7px] focus:ring-white focus:ring-opacity-50 " labelcolor="text-white" />
                <TextArea name="desc" label="Description" ringcolor="ring-white" labelcolor="text-white"/>
                <div className="my-3 text-white">
                  <input type="file"  aria-label="file example" name="blogimage" label="Image" className="text-white h-fit border-2 w-full rounded-md p-1 form-control" required onChange={e=>setblogimage(e.target.files)}/>
                  <div className="invalid-feedback">Example invalid form file feedback</div>
                </div>
                <Button className="text-black border-2 bg-gray-50 focus:ring-[7px] focus:ring-white focus:ring-opacity-50 hover:bg-gray-300" type="submit" >Add</Button>
              </Form>
              
          }

        </Formik>
      </div>
      <h1 className='text-center my-3'>Your Blogs</h1>
      <Blog blogs={userblogs} btn1="UPDATE" btn2="DELETE"/>
    </div>
  )
}

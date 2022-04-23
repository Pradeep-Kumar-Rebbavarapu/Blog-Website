import React, { useContext, useState } from 'react'
import {Formik,Form} from 'formik'
import * as Yup from 'yup'
import Input from '../components/Input'
import Context from '../context/Context'
import Button from '../components/Button'
import Blog from '../components/Blog'
export default function SearchPage() {
    let {authtoken} = useContext(Context)
    let  [searchedblogs,setsearchedblogs] = useState([])
    const search = async (values) =>{
        try{
            let response = await fetch(`http://localhost:8000/api/v1/FilterBlogs/?search=${values.search}`,{
            method:'GET',
            headers:{
                'Content-Type':'applicaiton/json'
                
            }
        })
        let data = await response.json()
        console.log(data);
        console.log('search page')
        if(data.length===0){
            document.getElementById('statement').innerHTML = "No Blogs Found With the Query " + values.search
            
        }
        else{
            document.getElementById('statement').innerHTML =""
            
        }
        setsearchedblogs(data)
        }
        catch(err){
            console.log(err);
        }
        
    }


    const initialValues = {
        search : ""
    }

    const validationSchema = Yup.object({
        search : Yup.string().required('Required').min(5,'atleats 5 characters required')
    })

    const onSubmit = (values) =>{
        
        search(values)
    }
  return (
    <div className='py-20 '>
        <div className='container'>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} validateOnChange validateOnBlur>
            {
                formik=>
                <Form>
                    <Input type="text" name="search" label="search" ringcolor="ring-black" className="focus:ring-[7px]"/>
                    <Button type="submit" className="bg-black focus:ring-[7px] focus:ring-black focus:ring-opacity-50 text-white my-3">Search</Button>
                </Form>
            }
        </Formik>
        </div>
        <h1 id="statement"></h1>
       <Blog blogs = {searchedblogs} btn1="SHARE" btn2="READ MORE"/>
    </div>
  )
}

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from 'react-modal';
import { AiFillCloseSquare } from 'react-icons/ai'
import { useState } from 'react';
import { useContext } from 'react';
import Context from '../context/Context'
import { useEffect } from 'react';
import { Paper } from '@mui/material';
import * as Yup from 'yup'
import { Formik, Form } from 'formik'
import Input from './Input';
import TextArea from './TextArea';
import { useRef } from 'react';

import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
function Blog(props) {
  let [updateblogimage, setupdateblogimage] = useState(null)

  let blog_ref = useRef(null)

  let location = useLocation()
  let navigate = useNavigate()
  let [updatevalue, setupdatevalue] = useState(null)
  

  let { allblogs, setallblogs, authtoken, GetUserBlogs, eachblog, seteachblog, GetEachBlog, setpostvalue,GetAllBlogs,nexturl } = useContext(Context)

  const [modalIsOpen, setmodalIsOpen] = React.useState(false);


  const DeleteBlog = async (e) => {
    e.preventDefault()
    let response = await fetch(`http://localhost:8000/api/v1/DeleteBlog/${e.target.value}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authtoken.access
      }
    })
    let data = await response.json()
    console.log('delete blog api');
    GetUserBlogs()
  }
  
  const UpdateBlog = async (e) => {
    
    e.preventDefault()
    let formData = new FormData()
    formData.append('title', e.target.title.value)
    formData.append('desc', e.target.desc.value)
    formData.append('image', updateblogimage[0])
    let response = await fetch(`http://localhost:8000/api/v1/UpdateBlog/${updatevalue}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + authtoken.access
      },
      body: formData
    })
    let data = await response.json()
    console.log('update blog api');
    GetUserBlogs()
    setmodalIsOpen(false)
  }


  useEffect(() => {
    localStorage.removeItem('postvalue')
    console.log('blog')
  }, [])

  
  return (
    <div className=''>
      
      <div className="grid  xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
      
        {props.blogs.map((blog) => {
          return (
            <div key={blog.blog_id}>
              <Paper elevation={3} className="w-fit h-fit my-3 mx-auto" >
                <Card className="" sx={{ maxWidth: 345 }}>
                  <CardMedia className="h-[300px] w-[500px]"
                    component="img"
                    alt="green iguana"
                    height="140"
                    image={blog.image}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {blog.desc}
                    </Typography>

                  </CardContent>
                  <footer className="blockquote-footer m-1">{blog.user}</footer>
                  <CardActions>
                    <input type="text" className='w-[50px]' value={blog.blog_id} readOnly/>

                    <Button value={blog.blog_id} size="small"  onClick={(e) => {
                      if (location.pathname == "/Addblog") {
                        setmodalIsOpen(true)
                        setupdatevalue(e.target.value)
                      }
                      else {

                        navigate('/BlogPost')

                      }
                    }}>{props.btn1}</Button>



                    <Button size="small" value={blog.blog_id} onClick={e => {
                      if (location.pathname == '/Addblog') {
                        DeleteBlog(e)
                        
                      }
                      else {
                        setpostvalue(e.target.value)
                        localStorage.setItem('postvalue',e.target.value)
                        navigate('/BlogPost')

                      }
                    }}>{props.btn2}</Button>

                  </CardActions>
                  <div className="card-footer text-muted">
                    {blog.datestamp}
                  </div>
                  <div className="card-footer text-muted">
                    {blog.timestamp}
                  </div>
                </Card>

              </Paper>






            </div>
          )
        })}
        
      </div>
      
      
      <div>
        <Modal style={{ content: { 'margin': '100px 50px' } }} isOpen={modalIsOpen} onRequestClose={() => setmodalIsOpen(false)}>
          <AiFillCloseSquare className="cursor-pointer" onClick={() => setmodalIsOpen(false)} />
          <h1 className="text-center my-3">Update blog</h1>
          <div >
            <form onSubmit={UpdateBlog}>
              <label className="mb-3" for="title"><h4>Title</h4></label>
              <div >
                <input type="text" style={{ 'width': '100%', 'border-radius': '7px', 'backgroundColor': 'gray', 'outline': 'none' }} className="border-2 border-black w-full p-1 rounded-[7px] bg-gray-600 outline-none text-white" name="title" id="title" />
              </div >
              <label className="mt-3" for="title"><h4>Description</h4></label>
              <div >
                <textarea type="text" style={{ 'width': '100%', 'border-radius': '7px', 'backgroundColor': 'gray', 'outline': 'none' }} className="border-2 border-black w-full outline-none p-1 rounded-[7px] bg-gray-600 text-white" name="desc" id="desc" />
              </div >
              <label className="mt-3" for="blogimage"><h4>Image</h4></label>
              <div className=" text-black">
                <input type="file" aria-label="file example" name="blogimage" label="Image" className="text-black h-fit border-2 w-full rounded-md p-1 border-black form-control" required onChange={e => setupdateblogimage(e.target.files)} />
                <div className="invalid-feedback">Example invalid form file feedback</div>
              </div>
              <Button style={{ "border-radius": '7px' }} name="updatebtn" className="text-white border-2 bg-black focus:ring-[7px] focus:ring-white focus:ring-opacity-50 rounded-md my-3 hover:bg-gray-300" type="submit" >Update</Button>
            </form>
          </div>
        </Modal>
      </div>
    </div>

  );
}


export default React.memo(Blog)
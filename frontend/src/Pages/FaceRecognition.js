import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Context from '../context/Context';

export default function FaceRecognition(props) {
    let location = useLocation()
    let navigate = useNavigate()
    let { Signupbase64, setSignupbase64,Loginbase64,setLoginbase64 } = useContext(Context)
    var width = 700;
    var height = 0;
    var streaming = false;
    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null
    

    let startup = () => {
        video = document.getElementById('video')
        canvas = document.getElementById('canvas')
        photo = document.getElementById('photo')
        startbutton = document.getElementById('startbutton')
        if(location.pathname==="/Signup" || location.pathname==="/Login"){
            navigator.mediaDevices.getUserMedia({
            
                video: true,
                audio: false
                
            }).then((stream) => {
                // window.location.reload()
                video.srcObject = stream
                video.play()
                
                
            })
                .catch((err) => {
                    // window.location.reload()
                    
                    ;
                    var data = canvas.toDataURL(null);
                    photo.setAttribute('src', null)
                })
        }
        
        if (video) {
            video.addEventListener('canplay', function (ev) {
                if (!streaming) {
                    height = video.videoHeight / (video.videoWidth / width);
                }
                if (isNaN(height)) {
                    height = width / (4 / 3)
                }
                video.setAttribute('width', width)
                video.setAttribute('height', height)
                canvas.setAttribute('height', height)
                canvas.setAttribute('width', width)
                streaming = true

            }, false)
        }

        if (startbutton) {
            startbutton.addEventListener('click', (e) => {
                takepicture();
                
                e.preventDefault()
            }, false)
        }

        clearphoto()
    }




    function clearphoto() {
        var context = canvas.getContext('2d')
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        var data = canvas.toDataURL(null);
        photo.setAttribute('src', null)

    }

    useEffect(() => {
        startup()
    }, [])


    



    let takepicture = () => {
        var context = canvas.getContext('2d');
        document.getElementById('output').style.display = 'block'
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height)

            var data = canvas.toDataURL('image/png');
            photo.setAttribute('src', data);
            document.getElementById('base64').value = canvas.toDataURL()
            if(location.pathname==='/Signup'){
                setSignupbase64(canvas.toDataURL())
            }
            else if(location.pathname==='/Login'){
                setLoginbase64(canvas.toDataURL())
            }
            
            
        }
        else {
            clearphoto()
        }
    }
    
    return (
        <div className='container  h-full'>
            
            <h1 className='mx-3 mt-3 text-center text-white border-2 border-black ring-[7px] ring-white ring-opacity-50 w-fit p-3 rounded-md bg-black md:ring-black md:ring-opacity-70 bg-opacity-50'>Take Your Photo</h1>
            <div className='my-5'>
                <div className="row mx-auto ">
                    <div className="camera">
                        <video className=' rounded-md ring-[7px] ring-opacity-50 ring-black border-2 border-black' id="video" >Video stream not available</video>
                    </div>
                    <div>
                        <Button id="startbutton" className="my-3 bg-gray-50 text-black md:bg-gray-white md:text-white hover:bg-gray-300 focus:ring-[7px] focus:ring-opacity-50 focus:ring-white">Take Photo</Button>
                    </div>
                    <textarea className='hidden' id="s"></textarea>
                    <canvas className='hidden' id="canvas"></canvas>
                    <div id="output" className="output hidden">
                        <img className='rounded-md ring-[7px] ring-opacity-50 ring-black border-2 border-black' src="" alt="the screen capture will apear in this box " id="photo" />
                    </div>
                    <div className="text-center hidden">
                        <form action="/" method="post">
                            <input type="text" id="base64" name="imageurl"/>
                                <button className="btn btn-primary" type="submit">Submit</button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}




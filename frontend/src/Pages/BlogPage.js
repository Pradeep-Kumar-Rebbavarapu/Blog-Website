import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import Blog from '../components/Blog'
import Context from '../context/Context'
import BlogHomePage from './BlogHomePage'
import InfiniteScroll from 'react-infinite-scroll-component';
function BlogPage() {
    let { allblogs, nexturl, setallblogs, setnexturl } = useContext(Context)
    const GetAllBlogs = async () => {
        let response = await fetch(nexturl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        let data = await response.json()
        console.log('get all blogs')
        setallblogs(allblogs.concat(data.results))
        setnexturl(data.next)
    }



    useEffect(() => {
        GetAllBlogs()
        console.log('useEffect of blogpage')
    }, [])

    const fetchMoreData = () => {
        GetAllBlogs()
        console.log('fetch more data')
    }
    console.log('blog page')
    return (
        <>
            <div className=''>
                <BlogHomePage />
                <br />
                <h1 className='text-center'>Make Us Proud With These Blogs</h1>
                <br />
                <div className="container-fluid">
                    <InfiniteScroll
                        dataLength={allblogs.length}
                        next={fetchMoreData}
                        hasMore={nexturl !== null}
                        loader={<h4>Loading...</h4>}
                    >
                        <Blog blogs={allblogs} btn1="SHARE" btn2="READ MORE" />
                    </InfiniteScroll>
                </div>
            </div>
        </>
    )
}


export default React.memo(BlogPage)
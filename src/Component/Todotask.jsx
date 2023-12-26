import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Todotask = () => {
    const[input,setInput] = useState('')
    const[dataarr,setDataarr] =  useState([])
    // const DataArr = []

    useEffect(()=>{
        (async function(){
            try{
                const Res = await axios.get("https://jsonplaceholder.typicode.com/users/1/todos")
                const ApiData = Res.data
                setDataarr(ApiData);
            }
            catch(err){
                console.log("Api Error" , err);
            }
        })()
    },[])
   
    // add task
    const handleChange=(e)=>{
        e.preventDefault()
        if(input === ''){
            toast.warn('Invalid Entery', {
                position: "top-center",})
        }
        else{
            const obj = {
                userId:1,
                id:dataarr.length+1,
                title:input,
                completed:false
              }
            const newDataArr = [...dataarr,obj]
           
            setDataarr(newDataArr)
            setInput('')
        }
    }
    // console.log(dataarr);

    // remove
    const removeHandle = (id)=>{
        setDataarr(dataarr.filter(e=>e.id !== id))
        console.log(id);
    }
    // edit
    const[pop,setPop] = useState(true)
    const[editinput,setEditinput] = useState('')
    const[editval,setEditval]=useState({
        id:'' ,
        title:''
    })
    const editHandle = (id,title)=>{
        window.scroll(0,0)
        setPop(false)
        setEditinput(title)
        setEditval({
            id:id ,
            title:title
        })
    }
    const EditformChange = (e)=>{
        e.preventDefault();
        setPop(!pop)
        setDataarr(
            dataarr.map(item=>{
                if(item.id === editval.id){
                  item.title = editinput
                }
                return item
            }) 
        )   
    }

    // check
    const checkHandle= (id)=>{
        setDataarr(
            dataarr.map(item=>{
                if(item.id === id){
                  item.completed = true
                }
                return item
            }) 
        ) 
        console.log(dataarr);
    }

    // dropfilter
    const[dropval,setDropval]=useState('All')
    const handledrop = (e)=>{
      setDropval(e.target.value)
    }

    const FillterList = dataarr.filter(item=>{
        // const string = toString(item.completed)
        if(dropval == 'All')
        {
          return true
        }
        else if(dropval == "true"){
            return item.completed === true
        }
      })
// console.log(FillterList);

  return (
    <div className="flex flex-col  items-center px-2 ">
        <h1 className="text-white text-3xl  mb-4 lg:text-[2.8rem] lg:mb-8">ToDo List</h1>
        <div className=" border-2 bg-white m-h-96 py-5 px-1 lg:w-[45%] xl:w-[60%]">
        <div className="flex justify-between lg:justify-around">
        {
            pop ? 
            <form onSubmit={handleChange}>
                <input className="pl-1 capitalize border-2  border-cyan-700 outline-none h-9 lg:w-[28rem] lg:h-[3rem] lg:text-[1.2rem] input"  placeholder='Enter Your Value' value={input} onChange={(e)=>setInput(e.target.value)} />
                <button className="border-2 py-1 px-6 text-lg bg-cyan-800 text-white inbtn lg:h-[3.2rem]" type='submit'>Add</button>
           </form>
           :
           <form onSubmit={EditformChange}>
                  <input className=" pl-1 border-2 border-cyan-700 outline-none h-9 w-[50%] lg:w-[28rem] lg:h-[3rem] lg:text-[1.4rem] editinp" value={editinput} onChange={(e)=>setEditinput(e.target.value)}/>
                  <button className="border-2 py-1.5 px-4 text-[100%] bg-cyan-800 text-white lg:pt-3.5 lg:pb-2.5  editcancel " onClick={()=>setPop(true)}>Cancel</button>
                  <button className="border-2 py-1.5 px-4 text-[100%] bg-cyan-800 text-white lg:pt-3.5 lg:pb-2.5 editbtn " type='submit'>Edit</button>
           </form>
        }
        <select className="border-2 border-cyan-700 outline-none text-lg h-9 w-[20%] lg:w-[15%] lg:h-[2.8rem] lg:text-[1.3rem] bg-white" name="list" onChange={handledrop} >
          <option  value="All" >All</option>
          <option value="true">Completed</option>
        </select>
        </div>

        <div className="mt-4">
            {
                dropval == "All" 
                ?
                dataarr && dataarr.map((data,index)=>{
                    return(
                    <div key={index} className="flex lg:justify-between border-2 border-cyan-700 px-1 py-2 text-[18px] mb-2 relative">
                        <input className={data.completed == true ? " accent-cyan-700 lg:w-[1.2rem] ":" accent-slate-50 mark lg:w-[1.2rem] "} type='checkbox' onClick={()=>checkHandle(data.id)} checked  />
                            <h4 className={data.completed == true ? "pl-1 line-through text-cyan-800 text-lg lg:text-2xl w-[86%] hcss" : "pl-1 text-lg lg:text-2xl w-[86%] hcss "}>{data.title.slice(0,34)}</h4>
                            <div className="lg:pt-2">
                            <button onClick={data.completed == true ? ()=>toast.warn("Cant be edit") : ()=>editHandle(data.id,data.title)}><FaRegEdit className=" lg:text-[1.3rem]"/></button>
                            <button onClick={()=>removeHandle(data.id)} ><MdDeleteOutline className="lg:text-[1.3rem]"/></button>
                            </div>
                    </div>
                    )
                })
                :
                FillterList.map((data,index)=>{
                    return(
                        <div className="flex border-2 border-cyan-700 px-1 py-2 text-[18px] mb-2" key={index}>
                            <h4 className="lg:text-[1.4rem]">{data.title}</h4>
                        </div>
                    )
                })
            }
        </div>

        </div>
        <ToastContainer />
    </div>
  )
}

export default Todotask
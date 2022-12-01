import React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { sendJSONData } from '../Tools/Toolkit';
import { ComponentProps, Course, Technology } from "./../Tools/data.model";

const Tech = ({ technologies, courses, setLoading, setReload }:ComponentProps) => {

    

    // get the id route parameter passed to this component
    let { id } = useParams<{id:string}>();
    const navigate = useNavigate();
    console.log('Here', id);
    // find the technology we want to display based off of id
    // let technology:(Technology | undefined) = technologies.find(item => {
    //     return (item._id === id)
    // });
   
    let technology:(Technology | undefined) = technologies.find(item => item._id === id);
    //submit url
    const SUBMIT_SCRIPT = (id) ? `http://localhost/post/technologies/${id}` : `http://localhost/post/technologies/null`;

    //state variables for form 
    const [_id, setId] = React.useState<string>(technology?._id || "");
    const [name, setName] = React.useState<string>(technology?.name || "");
    const [description, setDescription] = React.useState<string>(technology?.description || "");
    const [difficulty, setDifficulty] = React.useState<number>(technology?.difficulty || 1);
    const [selectedCourses, setSelectedCourses] = React.useState<Course[]>(technology?.courses || []);
    
    const onSubmitResponse = () => {        
        //onresponse reset and hide the comments
        setReload(true);
        backToList();
    };

    const onError = (message:string) => console.log("*** Error has occured during ajax call: " + message);

    function addTechnology(){
        console.log('here it is---', selectedCourses);
        let reqJSON:any = {
            "name": name,
            "description": description,
            "difficulty": difficulty,
            "courses": selectedCourses
        };
        console.log(reqJSON);
        //show loader
        setLoading(true);
        // send the JSON data to the Web API!
        sendJSONData(SUBMIT_SCRIPT, JSON.stringify(reqJSON), onSubmitResponse, onError);
    }

    function backToList(){
        navigate('/list', {replace: true});
    }

    function addCoursesToList(e:any, course:Course){
        let selected: Course[] = Object.assign([], selectedCourses);
        let index = selected.findIndex(item => item.code === course.code);
        if(e.target.checked){            
            selected.push(course);
            setSelectedCourses(selected);
        }else{
            selected.splice(index, 1)
            setSelectedCourses(selected);
        }       
    }



    // ---------------------------------- render to the DOM
    return(
        <div className="p-4">
          <div className="mb-[3px] mt-2.5 text-base">Name:</div>
          <div>
              <input id="inputName" 
                    className="rounded-md border-2 border-solid border-[#e6e6e6] shadow-sm shadow-[#e6e6e6] text-black bg-[#e6e6e6] py-1.5 px-3 max-w-xs max-h-[32px] focus:outline-none"
                    maxLength={50} type="text" 
                    value={name} onChange={(e:any) => setName(e.target.value)} />
          </div>
          <div className="mb-[3px] mt-2.5 text-base">Description:</div>
          <div>
              <textarea id="inputDesc" 
              className="w-52 h-40 rounded-md border-2 border-solid border-[#e6e6e6] shadow-sm shadow-[#e6e6e6] text-black bg-[#e6e6e6] py-1.5 px-3 focus:outline-none" 
              maxLength={200} value={description} onChange={(e:any) => setDescription(e.target.value)}></textarea>
          </div>
          <div className="mb-[3px] mt-2.5 text-base">Difficulty:</div>
          <div>
               <input id="inputName" 
                    className="rounded-md border-2 border-solid border-[#e6e6e6] shadow-sm shadow-[#e6e6e6] text-black bg-[#e6e6e6] py-1.5 px-3 max-w-xs max-h-[32px] focus:outline-none"
                    type="number" min="1" max="10"
                    value={difficulty} onChange={(e:any) => setDifficulty(e.target.value)} />
          </div>
          <div className="mb-[3px] mt-2.5 text-base">Used in courses:</div>
            {courses.map((data:Course, n:number) =>                     
                <div className='pl-4 pt-1'>
                 <input type="checkbox" name="courses" value={data.code} onChange={(e:any) => addCoursesToList(e,data)} checked={(selectedCourses.findIndex(item=> item.code === data.code)) >= 0}/>
                 <label className='pl-2'>{data.name}</label>
                </div>
            )}
          <div className="mt-2.5">
              <button className={`border-none py-1.5 px-2 text-sm align-center text-xs decoration-0 rounded-sm mr-[3px] ${(name && description && difficulty) ? 'bg-[#428bca] hover:bg-[#245682]' : 'bg-[#C0C0C0]'} text-[#fff] focus:outline-none`} onClick={addTechnology}>Ok</button>
              <button className="border-none py-1.5 px-2 text-sm align-center text-xs decoration-0 rounded-sm mr-[3px] bg-[#C0C0C0] text-[#fff] focus:outline-none hover:bg-[#245682]" onClick={backToList}>Cancel</button>
          </div>
        </div>
    );
}

export default Tech;

function useCallback(arg0: () => any, arg1: any[]) {
    throw new Error('Function not implemented.');
}

import React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { sendJSONData } from '../Tools/Toolkit';
import { ComponentProps, Course, Technology } from "../Tools/data.model";

const Crse = ({ technologies, courses, setLoading, setReload }:ComponentProps) => {

    

    // get the id route parameter passed to this component
    let { id } = useParams<{id:string}>();
    const navigate = useNavigate();
   
    let course:(Course | undefined) = courses.find(item => item['_id'] === id);
    //submit url
    const SUBMIT_SCRIPT = (id) ? `/post/courses/${id}` : `/post/courses/null`;
    

    //state variables for form 
    const [name, setName] = React.useState<string>(course?.name || "");
    const [code, setCode] = React.useState<string>(course?.code || "");
    const [errorMsg, setErrorMsg] = React.useState<string>("");
    
    const onSubmitResponse = () => {        
        //onresponse reset and hide the comments
        setReload(true);
        backToList();
    };

    const onError = (message:string) => console.log("*** Error has occured during ajax call: " + message);

    function addCourse(){
        if(!id && courses.findIndex(c => c.code === code) >= 0){
            setErrorMsg("Failed to save! Course code is already existing.");
            return;
        }
        let reqJSON:any = {
            "name": name,
            "code": code
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

    // ---------------------------------- render to the DOM
    return(
        <div className="p-4">
            <div className="py-4 text-teal-500 font-bold text-xl">{(id)? 'Edit Course:': 'Add New Course:'}</div> 
          <div className="mb-[3px] mt-2.5 text-base">Course Code:</div>
          <div>
              <input id="inputCode" 
                    className="uppercase rounded-md border-2 border-solid border-[#e6e6e6] shadow-sm shadow-[#e6e6e6] 
                    text-black bg-white py-1.5 px-3 max-w-xs max-h-[34px] focus:outline-none
                    disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
                    maxLength={50} type="text" disabled={(id)? true : false}
                    
                    value={code} onChange={(e:any) => setCode(e.target.value)} />
          </div>
          <div className="mb-[3px] mt-2.5 text-base">Course Name:</div>
          <div>
          <input id="inputName" 
                    className="rounded-md border-2 border-solid border-[#e6e6e6] shadow-sm shadow-[#e6e6e6] text-black bg-white py-1.5 px-3 max-w-xs max-h-[34px] focus:outline-none"
                    maxLength={100} type="text" 
                    value={name} onChange={(e:any) => setName(e.target.value)} />
          </div>    
          <div className="mb-[3px] mt-2.5 text-red-600">{errorMsg}</div>      
          <div className="mt-3">
              <button className={`border-none py-1.5 px-2 text-sm align-center text-xs decoration-0 rounded-sm mr-[3px] ${(name && code) ? 'bg-[#14B8A6] hover:bg-[#245682]' : 'bg-[#C0C0C0]'} text-[#fff] focus:outline-none`} onClick={addCourse}>Ok</button>
              <button className="border-none py-1.5 px-2 text-sm align-center text-xs decoration-0 rounded-sm mr-[3px] bg-[#C0C0C0] text-[#fff] focus:outline-none hover:bg-[#14B8A6]" onClick={backToList}>Cancel</button>
          </div>
        </div>
    );
}

export default Crse;

function useCallback(arg0: () => any, arg1: any[]) {
    throw new Error('Function not implemented.');
}

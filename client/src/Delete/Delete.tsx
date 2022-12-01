import React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { deleteJSONData, sendJSONData } from '../Tools/Toolkit';
import { ComponentProps, Course, Technology } from "../Tools/data.model";

const Delete = ({ technologies, courses, setLoading, setReload }:ComponentProps) => {

    

    // get the id route parameter passed to this component
    let { id } = useParams<{id:string}>();
    let { entity } = useParams<{entity:string}>();
    const navigate = useNavigate();
    console.log('Here', id);
    //submit url
    const DELETE_SCRIPT = `http://localhost/delete/${entity}/`;
    
    const onDeleteResponse = () => {        
        //onresponse reset and hide the comments
        setReload(true);
        backToList();
    };

    const onError = (message:string) => console.log("*** Error has occured during ajax call: " + message);

    function deleteData(){        
        let reqJSON:any = {
            "_id": id
        };
        console.log(reqJSON);
        //show loader
        setLoading(true);
        // send the JSON data to the Web API!
        deleteJSONData(DELETE_SCRIPT, JSON.stringify(reqJSON), onDeleteResponse, onError);
    }

    function backToList(){
        navigate('/list', {replace: true});
    }

    // ---------------------------------- render to the DOM
    return(
        <div className="p-4">
           <div className="mt-2.5">
             Are you sure you want to delete the following {(entity=='technologies')? 'technology?': 'course?'}
           </div>
          <div className="mt-2.5">
              <button className="border-none py-1.5 px-2 text-sm align-center text-xs decoration-0 rounded-sm mr-[3px]" onClick={deleteData}>Ok</button>
              <button className="border-none py-1.5 px-2 text-sm align-center text-xs decoration-0 rounded-sm mr-[3px] bg-[#C0C0C0] text-[#fff] focus:outline-none hover:bg-[#245682]" onClick={backToList}>Cancel</button>
          </div>
        </div>
    );
}

export default Delete;

function useCallback(arg0: () => any, arg1: any[]) {
    throw new Error('Function not implemented.');
}

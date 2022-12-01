import React from 'react';
import { Link } from "react-router-dom";
import { ComponentProps, Course, Technology } from "./../Tools/data.model";

const List = ({ technologies, courses }:ComponentProps) => {

    // ---------------------------------- render to the DOM
    return(
        <div className="flex flex-wrap">
            <div className="flex grow-[.25] flex-col flex-nowrap pr-5">
                <div className="py-4 text-teal-500 font-bold">Technologies</div> 
                <div className="ml-8 pl-2.5 py-0.5 border-l-[6px] border-solid border-teal-500">
                <Link to="/tech/" className="text-slate-500 font-bold hover:underline">
                  <i className="py-4 fa-solid fa-plus text-slate-500 text-xl"></i>
                </Link>  
               
                </div>
                {technologies.map((data:Technology, n:number) =>                     
                    <div key={n} className="ml-8 pl-2.5 py-0.5 border-l-[6px] border-solid border-teal-500">
                        <Link to={`/tech/${data._id}`} className="text-slate-500 font-bold hover:underline">
                         <i className="pr-2 fa-solid fa-pencil text-slate-500 text-xl"></i>
                        </Link>
                        <Link to={`/delete/technologies/${data._id}`} className="text-accent font-bold hover:underline">
                         <i className="pr-2 fa-solid fa-trash text-slate-500 text-xl"></i>
                        </Link>
                        <span className='text-slate-500 font-bold text-lg'>{data.name}</span>
                    </div>
                )}

            </div>
            <div className="flex grow flex-col flex-nowrap pr-5">
                <div className="py-4 text-teal-500 font-bold">Courses:</div>
                <div className="ml-8 pl-2.5 py-0.5 border-l-[6px] border-solid border-teal-500">
                <Link to="/tech" className="text-slate-500 font-bold hover:underline">
                  <i className="py-4 fa-solid fa-plus text-slate-500 text-xl"></i>
                </Link>  
                </div>
                {courses.map((data:Course, n:number) =>                     
                    <div key={n} className="ml-8 pl-2.5 py-0.5 border-l-[6px] border-solid border-teal-500">
                        <Link to={`/tech/${data.code}`} className="text-slate-500 font-bold hover:underline">
                         <i className="pr-2 fa-solid fa-pencil text-slate-500 text-xl"></i>
                        </Link>
                        <Link to={`/tech/${data.code}`} className="text-accent font-bold hover:underline">
                         <i className="pr-2 fa-solid fa-trash text-slate-500 text-xl"></i>
                        </Link>
                        <span className='text-slate-500 font-bold text-lg'>{data.name}</span>
                    </div>
                )}

            </div>
        </div>
    );
}

export default List;
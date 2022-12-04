import "./../node_modules/@fortawesome/fontawesome-free/css/fontawesome.css"; 
import "./../node_modules/@fortawesome/fontawesome-free/css/solid.css"; 
import React from 'react';
import { Route, Routes } from "react-router-dom";
import { getJSONData } from "./Tools/Toolkit";
import { Course, JSONData, Technology } from "./Tools/data.model";

import List from "./List/List";
import Tech from "./Tech/Tech";
import Error from "./Error/Error";
import Delete from "./Delete/Delete";
import Crse from "./Crse/Crse";
import LoadingOverlay from "./LoadingOverlay/LoadingOverlay";

const RETRIEVE_SCRIPT:string = "/get";

function App() {

  // ---------------------------------------------- event handlers
  const onResponse = (result:JSONData) => {
    setTechnologies(result.technologies);
    setCourses(result.courses);
    console.log(result.technologies);
    console.log(result.courses);
    setLoading(false);
    setReload(false);
  };

  const onError = () => console.log("*** Error has occured during AJAX data transmission");

  
  // ---------------------------------------------- lifecycle hooks
  React.useEffect(() => {
    getJSONData(RETRIEVE_SCRIPT, onResponse, onError);
  }, []);

  // --------------------------------------------- state setup
  const [technologies, setTechnologies] = React.useState<Technology[]>([]);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true); 
  const [reload, setReload] = React.useState<boolean>(false); 

  //if reload, read from api

  if(reload){
    getJSONData(RETRIEVE_SCRIPT, onResponse, onError);
   }


  return (
    <div className="overflow-y-auto min-h-screen p-5 bg-[#e6e6e6]">
      <LoadingOverlay bgColor="#14B8A9" spinnerColor="#FFFFFF" enabled={loading} />

      <div className="font-bold text-2xl pb-2.5 text-slate-600">_Technology Roster: Course Admin</div>

      {(technologies.length > 0) ?
      <Routes>
        <Route
          path="/"
          element={<List technologies={technologies} courses={courses} setLoading={setLoading} setReload={setReload}/>}
        />

        <Route
          path="/list"
          element={<List technologies={technologies} courses={courses} setLoading={setLoading} setReload={setReload}/>}
        />

        <Route
          path="/tech/:id"
          element={<Tech technologies={technologies} courses={courses} setLoading={setLoading} setReload={setReload}/>}
        />

        <Route
          path="/tech"
          element={<Tech technologies={technologies} courses={courses} setLoading={setLoading} setReload={setReload}/>}
        />

        <Route
          path="/course"
          element={<Crse technologies={technologies} courses={courses} setLoading={setLoading} setReload={setReload}/>}
        />

        <Route
          path="/course/:id"
          element={<Crse technologies={technologies} courses={courses} setLoading={setLoading} setReload={setReload}/>}
        />        

        <Route
          path="/delete/:entity/:id"
          element={<Delete technologies={technologies} courses={courses} setLoading={setLoading} setReload={setReload}/>}
        />

        <Route
          path="/*"
          element={<Error />}
        />
      </Routes>
      : <div>There are no technologies in the database :(</div>}

      <div className="mt-10 mb-2.5">Web App powered by <span className="text-teal-500 font-bold">MERN Stack</span></div>
    </div>
  );
}

export default App;

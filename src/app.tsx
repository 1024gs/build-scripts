import React, { useEffect } from "../vendors/react/react.js";
import Navbar from "./components/navbar/navbar";

const App = () => {

  useEffect(()=> {
    console.log('Hello world')
  }, [])
  return (
    <div className="app">
      <Navbar brand="My app" />
      <div className="container">
        <br />
        <div className="row">
          <div className="col-sm-12">
            <h1>Hello World!</h1>
          </div>
        </div>
        <br />
      </div>
    </div>
  );
};

export default App;

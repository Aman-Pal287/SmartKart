import { Route, Routes } from "react-router-dom";
// import Home from "./pages/Home";
import { useEffect, useRef, useState } from "react";

const App = () => {
  // useEffect(() => {
  //   const handleKeyDown = (e) => {
  //     if (e.key === "ArrowRight") {
  //       console.log("Right arrow key pressed!");
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);
  let ref = useRef(0);

  function handleClick() {
    console.log( ref.current);
    
    ref.current = ref.current + 1;
    alert("You clicked " + ref.current + " times!");
  }

  return <button  onClick={handleClick}>Click me!</button>;
};

export default App;

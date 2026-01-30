import {useEffect} from "react";
import {injectAuthHeader} from "./api/calls/axios.ts";
import * as React from "react";
import {AppBar, Box, Container, IconButton, Toolbar, Typography, MenuIcon, Menu, MenuItem, Button} from "@mui/material";
import {BrowserRouter} from "react-router-dom";

function App() {
  // const [count, setCount] = React.useState(0);
  //
  // function increment(){
  //   setCount(count + 1);
  // }
  //
  // function decrement(){
  //   setCount(count -1)
  // }

  return (
      <Homepage>
        <Counter fetchMethod={() => subscriptionApiCalls.getAll()} title={"Records"}/>

        {/*<Typography variant="h5" sx={{ mb: 2 }}>*/}
        {/*  Current Count: {count}*/}
        {/*</Typography>*/}
        {/*<Stack direction="row" spacing={2} justifyContent="center">*/}
        {/*  <Button variant={"contained"} onClick={increment}>Increase</Button>*/}
        {/*  <Button variant={"outlined"} onClick={decrement}>Decrease</Button>*/}
        {/*</Stack>*/}
      </Homepage>
  );
}

// return (
//   <BrowserRouter>
//     <NavigationBar />
//
//     <Routes>
//       <Route path="/" element={
//         <Homepage>
//           <Counter fetchMethod={() => subscriptionApiCalls.getAll()} title={"Records"}/>
//         </Homepage>
//       } />
//
//       <Route path="/profile" element={<UserProfile />} />
//       <Route path="/services" element={"<ServicesPage />"} />
//       <Route path="/contact" element={"<ContactPage />"} />
//     </Routes>
//   </BrowserRouter>
// );
}
export default App;

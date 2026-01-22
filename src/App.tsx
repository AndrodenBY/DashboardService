import {Homepage} from "./ui/Homepage.tsx";
import Counter from "./modules/Counter.tsx";
import {subscriptionApiCalls} from "./api/calls/subscriptionApiCalls.ts";


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

export default App;

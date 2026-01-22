import {useEffect, useState} from 'react';
import {Card, CardContent, Typography} from "@mui/material";

interface CounterProps {
  fetchMethod: () => Promise<unknown[]>;
  title: string;
}

function Counter({fetchMethod, title}: Readonly<CounterProps>) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchMethod()
      .then(data => {
        setCount(data.length);
      });
  }, [fetchMethod]);

  return (
    <Card sx={{ width: '100%', variant: 'outlined' }}>
    <CardContent>
      <Typography variant="h6" component="div">
        {title}: {count}
      </Typography>
    </CardContent>
  </Card>
  );
}

export default Counter;

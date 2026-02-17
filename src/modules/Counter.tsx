import {useEffect, useState} from 'react';
import {alpha, Box, Card, Stack, Typography, useTheme} from "@mui/material";

interface CounterProps {
  fetchMethod: () => Promise<unknown[]>;
  title: string;
}

function Counter({ fetchMethod, title }: Readonly<CounterProps>) {
  const [count, setCount] = useState<number>(0);
  const theme = useTheme();

  useEffect(() => {
    let isMounted = true;
    fetchMethod()
      .then(data => {
        if (isMounted) setCount(data.length);
      })
      .catch(err => console.error(`Counter fetch error:`, err));

    return () => { isMounted = false; };
  }, [fetchMethod]);

  return (
    <Card
      variant="outlined"
      sx={{
        px: 3,
        py: 2,
        borderRadius: 4,
        bgcolor: alpha(theme.palette.primary.main, 0.01),
        display: 'inline-block',
        minWidth: 'fit-content'
      }}
    >
      <Stack
        direction="row"
        spacing={3}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 1,
            whiteSpace: 'nowrap'
          }}
        >
          {title}:
        </Typography>

        <Box sx={{ display: 'flex' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: 'primary.main',
              lineHeight: 1
            }}
          >
            {count}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}

export default Counter;

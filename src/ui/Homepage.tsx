import {NavigationBar} from "../components/NavigationBar.tsx";
import {Box, Container, Typography} from "@mui/material";
import type {ReactNode} from "react";
import {BrowserRouter} from "react-router-dom";

interface HomepageProps {
  children?: ReactNode;
}

export function Homepage({children}: Readonly<HomepageProps>) {
  return (
    <>
      <BrowserRouter>
        <NavigationBar />
      </BrowserRouter>
      <Container maxWidth="md">
        <Box
          sx={{
            my:4,
            textAlign: "center",
            bgcolor: "background.default",
            padding: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider"
          }}>
          <Typography variant="h3" component="h1" color="textPrimary" gutterBottom>
            Hello There
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Integer sagittis leo risus, nec interdum augue tristique id.
            Suspendisse tempus arcu nisi, vel iaculis odio congue at.
            Phasellus cursus ligula nec lacus vehicula ornare.
            Praesent turpis tellus, malesuada iaculis diam sed, mollis tincidunt magna.
            Nullam turpis lectus, cursus nec congue at, sodales ac ante.
            Aenean et felis vitae magna sagittis blandit.
            Ut malesuada, dui nec tempus porta, lectus sapien consectetur ligula, et molestie ipsum ex vitae leo.
            Phasellus at libero blandit, rutrum neque et, pharetra felis. In facilisis vulputate nulla vel tristique.
            Proin faucibus rutrum neque et condimentum.
            Sed orci lacus, tempor in nunc ut, fringilla commodo massa.
            Mauris fringilla massa magna, sed vulputate quam malesuada in.
            Nullam suscipit lacus eget lorem tincidunt, vitae posuere nunc finibus.
            Cras mollis porta imperdiet.
            Fusce lorem est, ornare at cursus id, molestie cursus ipsum.
            Fusce condimentum vulputate luctus.
          </Typography>
        </Box>

        <Box sx={{ my: 3 }}>
          {children}
        </Box>
      </Container>
    </>
  );
}

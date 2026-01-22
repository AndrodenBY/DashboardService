import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  SwipeableDrawer,
  Toolbar,
  Typography
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import {Link, NavLink} from "react-router-dom";
import {type KeyboardEvent, type MouseEvent, useState} from "react";

type Anchor = 'top';

export function NavigationBar() {
  const [state, setState] = useState({
    top: false,
  });

  const navItems = [
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' }
  ];

  const toggleDrawer = (anchor: Anchor, open: boolean) =>
    (event: KeyboardEvent | MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as KeyboardEvent).key === 'Tab' || (event as KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 'auto' }}
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={NavLink} to={item.path}>
              <ListItemText primary={item.label} sx={{ textAlign: 'center' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <MuiAppBar position="static" sx={{ borderRadius: '10px' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer('top', true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            SubsTracker
          </Typography>

          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navItems.map((item) => (
              <Button key={item.label} component={NavLink} to={item.path} color="inherit">
                {item.label}
              </Button>
            ))}
          </Stack>

          <Button color="inherit">Login</Button>
        </Toolbar>
      </MuiAppBar>

      <SwipeableDrawer
        anchor="top"
        open={state['top']}
        onClose={toggleDrawer('top', false)}
        onOpen={toggleDrawer('top', true)}
      >
        {list('top')}
      </SwipeableDrawer>
    </Container>
  );
}

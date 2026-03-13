import {
  Box,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Typography
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import {Link, NavLink} from "react-router-dom";
import {useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import LogoutButton from "../ui/LogoutButton";
import LoginButton from "../ui/LoginButton";

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/' },
  { label: 'Profile', path: '/profile' },
];

export function NavigationBar() {
  const { isAuthenticated } = useAuth0();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <MuiAppBar position="static" sx={{ borderRadius: '10px' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton color="inherit" onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            SubsTracker
          </Typography>

          {isAuthenticated ? <LogoutButton /> : <LoginButton />}
        </Toolbar>
      </MuiAppBar>

      <SwipeableDrawer
        anchor="top"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        onOpen={handleDrawerOpen}
      >
        <Box sx={{ width: 'auto' }} onClick={handleDrawerClose}>
          <List>
            {NAV_ITEMS.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton component={NavLink} to={item.path}>
                  <ListItemText primary={item.label} sx={{ textAlign: 'center' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </SwipeableDrawer>
    </Container>
  );
}

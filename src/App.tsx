import {useAuth0} from "@auth0/auth0-react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {NavigationBar} from "./components/NavigationBar.tsx";
import {Homepage} from "./pages/Homepage.tsx";
import {UserProfile} from "./pages/UserProfile.tsx";
import {ProtectedRoute} from "./components/ProtectedRoute.tsx";
import LoginButton from "./ui/LoginButton";
import {Box, Container, Typography} from "@mui/material";
import {CurrentUserProvider} from "./contexts/CurrentUserContext.tsx";

function App() {
  const { isAuthenticated, isLoading, error } = useAuth0();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Syncing Authentication...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h4" color="error">Oops!</Typography>
        <Typography>{error.message}</Typography>
      </Container>
    );
  }

  return (
    <BrowserRouter>
      <CurrentUserProvider>
      <NavigationBar />

      <Routes>
        <Route path="/" element={
          isAuthenticated ? (
            <ProtectedRoute>
              <Homepage>
                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                  Welcome to your dashboard. Start managing your subscriptions below.
                </Typography>
              </Homepage>
            </ProtectedRoute>
          ) : (
            <Container sx={{ textAlign: 'center', mt: 10 }}>
              <Typography variant="h4" gutterBottom>Welcome to SubsTracker</Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>Please log in to manage your subscriptions.</Typography>
              <LoginButton />
            </Container>
          )
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </CurrentUserProvider>
    </BrowserRouter>
  );
}

export default App;

import {useAuth0} from "@auth0/auth0-react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {NavigationBar} from "./components/NavigationBar.tsx";
import {Homepage} from "./pages/Homepage.tsx";
import {UserProfile} from "./pages/UserProfile.tsx";
import {Box, Container, Typography} from "@mui/material";
import {userApiCalls} from "./api/calls/userApiCalls.ts";
import {useEffect} from "react";

function App() {
  const { isAuthenticated, isLoading, error } = useAuth0();

  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const syncUser = async () => {
      if (isAuthenticated && user) {
        try {
          if (!user?.sub || !user?.email) {
            console.error("Missing required user data");

            return;
          }

          const token = await getAccessTokenSilently();

          await userApiCalls.create({
            auth0Id: user.sub,
            email: user.email,
            firstName: user.name ?? "NoName",
          }, token);

          const userData = await userApiCalls.getByAuth0Id(token);
          console.log("Бэкенд ответил:", userData);
        } catch (error) {
          console.error("Sync error:", error);
        }
      }
    };

    syncUser();
  }, [isAuthenticated, user, getAccessTokenSilently]);

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
        <Typography variant="h4" color="error">The error has occurred when loading a user. Look at the error type below </Typography>
        <Typography>{error.message}</Typography>
      </Container>
    );
  }

  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={
          isAuthenticated ? (
              <Homepage>
                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                  Welcome to your dashboard. Start managing your subscriptions below.
                </Typography>
              </Homepage>
          ) : (
            <Container sx={{ textAlign: 'center', mt: 10 }}>
              <Typography variant="h4" gutterBottom>Welcome to SubsTracker</Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>Please log in to manage your subscriptions.</Typography>
            </Container>
          )
        } />
        <Route path="/profile" element={
            <UserProfile />
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

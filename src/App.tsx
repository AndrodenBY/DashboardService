import {useAuth0} from "@auth0/auth0-react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {NavigationBar} from "./components/NavigationBar.tsx";
import {Homepage} from "./pages/Homepage.tsx";
import {UserProfile} from "./pages/UserProfile.tsx";
import {Box, CircularProgress, Container, Typography} from "@mui/material";
import {useEffect} from "react";
import {EditUserPage} from "./pages/EditUserPage.tsx";
import {ManageSubscriptionPage} from "./pages/ManageSubscriptionPage.tsx";
import {useUser} from "./modules/useUser.ts"
import {SubscriptionDetails} from "./pages/SubscriptionDetails.tsx"

function App() {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    error,
    loginWithRedirect
  } = useAuth0();

  const { isSyncing } = useUser();

  useEffect(() => {
    const handleRetry = async () => {
      if (error && error.message === "Invalid state") {
        console.warn("Detected Invalid State. Attempting seamless retry...");
        const retryCount = parseInt(sessionStorage.getItem("auth_retries") || "0");

        if (retryCount < 2) {
          sessionStorage.setItem("auth_retries", (retryCount + 1).toString());
          try {
            await loginWithRedirect();
          } catch (loginError) {
            console.error("Failed to redirect for retry:", loginError);
          }
        }
      } else if (isAuthenticated) {
        sessionStorage.removeItem("auth_retries");
      }
    };

    void handleRetry();
  }, [error, isAuthenticated, loginWithRedirect]);

  if (isAuthLoading || (isAuthenticated && isSyncing)) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <CircularProgress sx={{ mb: 2 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h4" color="error">Authentication Error</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>{error.message}</Typography>
      </Container>
    );
  }

  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={
          isAuthenticated ? (
            <Homepage />
          ) : (
            <Container sx={{ textAlign: 'center', mt: 10 }}>
              <Typography variant="h4" gutterBottom>Welcome to SubsTracker</Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                Please log in to manage your subscriptions.
              </Typography>
            </Container>
          )
        } />

        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile/edit" element={<EditUserPage />} />
        <Route path="/subscriptions/add" element={<ManageSubscriptionPage />} />
        <Route path="/subscriptions/edit/:id" element={<ManageSubscriptionPage />} />
        <Route path="/subscriptions/:id" element={<SubscriptionDetails />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

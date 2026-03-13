import {useAuth0} from "@auth0/auth0-react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {NavigationBar} from "./components/NavigationBar.tsx";
import {Homepage} from "./pages/Homepage.tsx";
import {Box, CircularProgress, Container, Typography} from "@mui/material";
import {lazy, type ReactNode, Suspense, useEffect} from "react";
import {useUser} from "./modules/useUser.ts";

const UserProfile = lazy(() => import("./pages/UserProfile.tsx").then(m => ({ default: m.UserProfile })));
const EditUserPage = lazy(() => import("./pages/EditUserPage.tsx").then(m => ({ default: m.EditUserPage })));
const ManageSubscriptionPage = lazy(() => import("./pages/ManageSubscriptionPage.tsx").then(m => ({ default: m.ManageSubscriptionPage })));
const SubscriptionDetails = lazy(() => import("./pages/SubscriptionDetails.tsx").then(m => ({ default: m.SubscriptionDetails })));

const ProtectedRoute = ({ children, isAllowed }: { children: ReactNode; isAllowed: boolean }) => {
  return isAllowed ? <>{children}</> : <Navigate to="/" replace />;
};

const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <CircularProgress />
  </Box>
);


function App() {
  const { isAuthenticated, isLoading: isAuthLoading, error, loginWithRedirect } = useAuth0();
  const { isSyncing } = useUser();

  useEffect(() => {
    const handleRetry = async () => {
      if (error?.message === "Invalid state") {
        const retryCount = parseInt(sessionStorage.getItem("auth_retries") || "0");
        if (retryCount < 2) {
          sessionStorage.setItem("auth_retries", (retryCount + 1).toString());
          try { await loginWithRedirect(); } catch (e) { console.error(e); }
        }
      } else if (isAuthenticated) {
        sessionStorage.removeItem("auth_retries");
      }
    };
    void handleRetry();
  }, [error, isAuthenticated, loginWithRedirect]);

  if (isAuthLoading || (isAuthenticated && isSyncing)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <BrowserRouter>
      <NavigationBar />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={
            isAuthenticated ? <Homepage /> : (
              <Container sx={{ textAlign: 'center', mt: 10 }}>
                <Typography variant="h4" gutterBottom>Welcome to SubsTracker</Typography>
                <Typography variant="body1">Please log in to manage your subscriptions.</Typography>
              </Container>
            )
          } />

          <Route path="/profile" element={
            <ProtectedRoute isAllowed={isAuthenticated}>
              <UserProfile />
            </ProtectedRoute>
          } />

          <Route path="/profile/edit" element={
            <ProtectedRoute isAllowed={isAuthenticated}>
              <EditUserPage />
            </ProtectedRoute>
          } />

          <Route path="/subscriptions/add" element={
            <ProtectedRoute isAllowed={isAuthenticated}>
              <ManageSubscriptionPage />
            </ProtectedRoute>
          } />

          <Route path="/subscriptions/edit/:id" element={
            <ProtectedRoute isAllowed={isAuthenticated}>
              <ManageSubscriptionPage />
            </ProtectedRoute>
          } />

          <Route path="/subscriptions/:id" element={
            <ProtectedRoute isAllowed={isAuthenticated}>
              <SubscriptionDetails />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

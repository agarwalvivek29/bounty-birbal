import React, { useState, useEffect } from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  setIdToken,
  setAuthToken,
  setWalletAddress,
  logout,
} from "../store/auth/authslice";
import {
  authenticateUser,
  setPin,
  createWallet,
  refreshToken,
  logoutUser,
  getUserDetails,
  getWallets,
  getSupportedNetworks,
  getSupportedTokens,
  getUserPortfolio,
  getUserPortfolioActivity,
  transferTokens,
  getOrdersHistory,
  executeRawTransaction,
} from "../services/apiService";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const App: React.FC = () => {
  const dispatch = useDispatch();
  const idToken = useSelector((state: RootState) => state.auth.idToken);
  const authToken = useSelector((state: RootState) => state.auth.authToken);
  console.log("authToken", authToken);
  const walletAddress = useSelector(
    (state: RootState) => state.auth.walletAddress
  );
  const [message, setMessage] = useState<string>("");

  const handleLoginSuccess = async (response: CredentialResponse) => {
    if (response.credential) {
      const idToken = response.credential;
      dispatch(setIdToken(idToken));
      try {
        const res = await authenticateUser(idToken);
        dispatch(setAuthToken(res.data.data.token));
        setMessage("User authenticated successfully");
      } catch (error) {
        console.error("Error authenticating user", error);
        setMessage("Authentication failed");
      }
    }
  };

  const handleSetPin = async () => {
    try {
      const res = await setPin(idToken!, authToken!, "123456");
      dispatch(setAuthToken(res.data.data.auth_token));
      setMessage("PIN set successfully");
    } catch (error) {
      console.error("Error setting PIN", error);
      setMessage("Setting PIN failed");
    }
  };

  const handleCreateWallet = async () => {
    try {
      const res = await createWallet(authToken!);
      dispatch(setWalletAddress(res.data.data.wallets[0].address));
      setMessage("Wallet created successfully");
    } catch (error) {
      console.error("Error creating wallet", error);
      setMessage("Wallet creation failed");
    }
  };

  const handleTransferToken = async () => {
    try {
      const data = {
        network_name: "APTOS TESTNET",
        token_address: "0x2f7b97837f2d14ba2ed3a4b2282e259126a9b848",
        quantity: "0.0001",
        recipient_address:
          "0x8ff71ae16c88d86f5ec4100951f37a50683e8cd23ca515894854fcfc4ab7399b",
      };
      await transferTokens(authToken!, data);
      setMessage("Token transferred successfully");
    } catch (error) {
      console.error("Error transferring token", error);
      setMessage("Token transfer failed");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser(authToken!);
      dispatch(logout());
      setMessage("Logged out successfully");
    } catch (error) {
      console.error("Error logging out", error);
      setMessage("Logout failed");
    }
  };

  const handleRefreshToken = async () => {
    try {
      const res = await refreshToken(
        authToken!,
        "REFRESH_TOKEN",
        "DEVICE_TOKEN"
      );
      dispatch(setAuthToken(res.data.data.auth_token));
      setMessage("Token refreshed successfully");
    } catch (error) {
      console.error("Error refreshing token", error);
      setMessage("Token refresh failed");
    }
  };

  const handleGetUserDetails = async () => {
    try {
      const res = await getUserDetails(authToken!);
      setMessage(`User email: ${res.data.data.email}`);
    } catch (error) {
      console.error("Error fetching user details", error);
      setMessage("Fetching user details failed");
    }
  };

  const handleGetWallets = async () => {
    try {
      const res = await getWallets(authToken!);
      setMessage(`Wallets: ${JSON.stringify(res.data.data.wallets)}`);
    } catch (error) {
      console.error("Error fetching wallets", error);
      setMessage("Fetching wallets failed");
    }
  };

  const handleGetSupportedNetworks = async () => {
    try {
      const res = await getSupportedNetworks(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2luZGN4X2lkIjoiNmY3OWU4NjktMTBjYS00OTFhLWJkYzUtZTlhNGRiNjIwMDk1IiwidXNlcl9pZCI6IjZmNzllODY5LTEwY2EtNDkxYS1iZGM1LWU5YTRkYjYyMDA5NSIsInNoYXJlZF9pZCI6bnVsbCwiZGN4X2NyZWF0ZWRfYXQiOm51bGwsInBvcnRmb2xpb0ZhY3RvciI6IjEiLCJhY2NUeXBlIjoid2ViMyIsImFjY291bnRfb3duZXJfaWQiOiJjNTcwMzA0Yi1hOTkwLTVkMGMtYTViZi1hYTI5ODk0ZjQ4MTciLCJzZXNzaW9uSWQiOiIzOGU5MTVjNC03MjJjLTQ1NTktYTExYy1lZTRhMTBhMjM1YTciLCJ1c2VyX2xvZ2luX3ZlbmRvcl9pZCI6ImY1OGEzOWU2LTlhNTctNGQ0Ny05ZmI5LWJkOWIzZjZhYzZhNiIsInMiOiJ3ZWIiLCJ1c2VyQWdlbnQiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTMxLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJzaXAiOiIxNTIuNTguMjMwLjYwIiwic2NpdHkiOiJCZW5nYWx1cnUiLCJzY291bnRyeSI6IklOIiwic3JlZ2lvbiI6IktBIiwibG9naW5fbWVkaXVtIjoiR19BVVRIIiwiaWF0IjoxNzMzNTk2MzExLCJleHAiOjE3MzQ0NjAzMTF9.hzjVq7sbUjKjPiEwxgbPhm5aRCpVVFvTevR29cp1q70"
      );
      setMessage(
        `Supported networks: ${JSON.stringify(res.data.data.network)}`
      );
    } catch (error) {
      console.error("Error fetching supported networks", error);
      setMessage("Fetching supported networks failed");
    }
  };

  const handleGetSupportedTokens = async () => {
    console.log("authToken", authToken);
    try {
      const res = await getSupportedTokens(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2luZGN4X2lkIjoiNmY3OWU4NjktMTBjYS00OTFhLWJkYzUtZTlhNGRiNjIwMDk1IiwidXNlcl9pZCI6IjZmNzllODY5LTEwY2EtNDkxYS1iZGM1LWU5YTRkYjYyMDA5NSIsInNoYXJlZF9pZCI6bnVsbCwiZGN4X2NyZWF0ZWRfYXQiOm51bGwsInBvcnRmb2xpb0ZhY3RvciI6IjEiLCJhY2NUeXBlIjoid2ViMyIsImFjY291bnRfb3duZXJfaWQiOiJjNTcwMzA0Yi1hOTkwLTVkMGMtYTViZi1hYTI5ODk0ZjQ4MTciLCJzZXNzaW9uSWQiOiIzOGU5MTVjNC03MjJjLTQ1NTktYTExYy1lZTRhMTBhMjM1YTciLCJ1c2VyX2xvZ2luX3ZlbmRvcl9pZCI6ImY1OGEzOWU2LTlhNTctNGQ0Ny05ZmI5LWJkOWIzZjZhYzZhNiIsInMiOiJ3ZWIiLCJ1c2VyQWdlbnQiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTMxLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJzaXAiOiIxNTIuNTguMjMwLjYwIiwic2NpdHkiOiJCZW5nYWx1cnUiLCJzY291bnRyeSI6IklOIiwic3JlZ2lvbiI6IktBIiwibG9naW5fbWVkaXVtIjoiR19BVVRIIiwiaWF0IjoxNzMzNTk2MzExLCJleHAiOjE3MzQ0NjAzMTF9.hzjVq7sbUjKjPiEwxgbPhm5aRCpVVFvTevR29cp1q70",
        1,
        10
      );
      setMessage(`Supported tokens: ${JSON.stringify(res.data.data.tokens)}`);
    } catch (error) {
      console.error("Error fetching supported tokens", error);
      setMessage("Fetching supported tokens failed");
    }
  };

  const handleGetUserPortfolio = async () => {
    try {
      const res = await getUserPortfolio(authToken!);
      setMessage(`User portfolio: ${JSON.stringify(res.data.data)}`);
    } catch (error) {
      console.error("Error fetching user portfolio", error);
      setMessage("Fetching user portfolio failed");
    }
  };

  const handleGetUserPortfolioActivity = async () => {
    try {
      const res = await getUserPortfolioActivity(authToken!, 10, 0);
      setMessage(
        `User portfolio activity: ${JSON.stringify(res.data.data.activity)}`
      );
    } catch (error) {
      console.error("Error fetching user portfolio activity", error);
      setMessage("Fetching user portfolio activity failed");
    }
  };

  const handleGetOrdersHistory = async () => {
    try {
      const res = await getOrdersHistory(
        authToken!,
        0,
        10,
        undefined,
        "SUCCESS"
      );
      setMessage(`Orders history: ${JSON.stringify(res.data.data.jobs)}`);
    } catch (error) {
      console.error("Error fetching orders history", error);
      setMessage("Fetching orders history failed");
    }
  };

  const handleExecuteRawTransaction = async () => {
    try {
      const data = {
        network_name: "POLYGON_TESTNET",
        transaction: {
          from: "0x0342A54DD44E8744FD185579Af57845Cb0ac6cB0",
          to: "0x80322ea18633A1f713e987d65Ae78AcCDAB6e55e",
          data: "0x",
          value: "0x10000",
        },
      };
      await executeRawTransaction(authToken!, data);
      setMessage("Raw transaction executed successfully");
    } catch (error) {
      console.error("Error executing raw transaction", error);
      setMessage("Executing raw transaction failed");
    }
  };

  useEffect(() => {
    if (idToken) localStorage.setItem("idToken", idToken);
    if (authToken) localStorage.setItem("authToken", authToken);
  }, [idToken, authToken, walletAddress]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ""}>
      <div className="min-h-screen flex flex-col">
        <nav className="bg-blue-500 p-4 py-6 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-white text-lg font-bold">Okto React App</div>
            <div>
              {!idToken ? (
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  text="signin_with"
                />
              ) : (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </nav>

        <main className="flex-1 flex items-center justify-center bg-gray-100">
          <div className="container mx-auto text-center">
            {!idToken ? (
              <div>
                <h1 className="text-4xl font-bold mb-4">Welcome to Okto App</h1>
                <p className="text-lg mb-4">
                  Please connect your Google account to get started.
                </p>
                <div className="flex justify-center my-5">
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    text="signin_with"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <button
                    onClick={handleSetPin}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                  >
                    Set PIN
                  </button>
                  <button
                    onClick={handleCreateWallet}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                  >
                    Create Wallet
                  </button>
                  <button
                    onClick={handleTransferToken}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                  >
                    Transfer Token
                  </button>
                  <button
                    onClick={handleRefreshToken}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                  >
                    Refresh Token
                  </button>
                  <button
                    onClick={handleGetUserDetails}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                  >
                    Get User Details
                  </button>
                  <button
                    onClick={handleGetWallets}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                  >
                    Get Wallets
                  </button>
                  <button
                    onClick={handleGetSupportedNetworks}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                  >
                    Supported Networks
                  </button>
                  <button
                    onClick={handleGetSupportedTokens}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                  >
                    Supported Tokens
                  </button>
                  <button
                    onClick={handleGetUserPortfolio}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                  >
                    User Portfolio
                  </button>
                  <button
                    onClick={handleGetUserPortfolioActivity}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                  >
                    Portfolio Activity
                  </button>
                  <button
                    onClick={handleGetOrdersHistory}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                  >
                    Orders History
                  </button>
                  <button
                    onClick={handleExecuteRawTransaction}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                  >
                    Raw Transaction
                  </button>
                </div>
                {/* {walletAddress && <p>Wallet Address: {walletAddress}</p>} */}
              </div>
            )}
            {message && <p>{message}</p>}
          </div>
        </main>
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;

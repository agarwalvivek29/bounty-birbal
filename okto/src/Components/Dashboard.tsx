/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  logout,
  setAuthToken,
  setIdToken as setIdTokenAction,
} from "../store/auth/authslice";
import { FaRegCircleUser } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import { LuLogOut } from "react-icons/lu";
import { addressList } from "../constants";
import { DashboardProps, Wallet } from "../interfaces";
import { OktoContextType, useOkto } from "okto-sdk-react";
import { setPin } from "../services/apiService";

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const dispatch = useDispatch();
  const idToken = useSelector((state: RootState) => state.auth.idToken);
  const authToken = useSelector((state: RootState) => state.auth.authToken);
  const wallets = useSelector(
    (state: RootState) => state.auth.walletAddress
  ) as Wallet[] | null;
  const [message, setMessage] = useState<string>("");
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { authenticate, logOut } = useOkto() as OktoContextType;

  const authenticateUser = async (token: string) => {
    try {
      const res = await authenticate(token, async (result, error) => {
        if (result) {
          let newAuthToken = result.auth_token;
          if (!newAuthToken) {
            const pinToken = result.token;
            await setPin(token, pinToken, "1234");
            const authRes = await authenticate(token, async (res, err) => {
              if (res) {
                newAuthToken = res.auth_token;
              }
            });
          }
          dispatch(setAuthToken(newAuthToken));

          setMessage("User authenticated successfully");
        }
        if (error) {
          console.error("Authentication error:", error);
          setMessage("Authentication failed");
        }
      });
    } catch (error) {
      console.error("Error authenticating user", error);
      setMessage("Authentication failed");
    }
  };

  useEffect(() => {
    if (idToken) {
      authenticateUser(idToken);
    }
  }, [idToken]);

  const handleLoginSuccess = async (response: CredentialResponse) => {
    if (response.credential) {
      const idToken = response.credential;
      dispatch(setIdTokenAction(idToken));
      authenticateUser(idToken);
    }
  };

  const filterWallets = (wallets: Wallet[] | null) => {
    const uniqueWallets: { [key: string]: Wallet } = {};
    wallets?.forEach((wallet) => {
      const networkName = wallet.network_name.split("_")[0];
      if (
        !uniqueWallets[networkName] ||
        (!wallet.network_name.includes("TESTNET") &&
          !wallet.network_name.includes("DEVNET"))
      ) {
        uniqueWallets[networkName] = wallet;
      }
    });
    return Object.values(uniqueWallets);
  };

  const filteredWallets = filterWallets(wallets);

  const handleLogout = async () => {
    try {
      await logOut();
      dispatch(logout());
      setMessage("Logged out successfully");
    } catch (error) {
      console.error("Error logging out", error);
      setMessage("Logout failed");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex">
      <main className="flex flex-col w-full">
        <header className="p-4 flex justify-between items-center pr-10 bg-white">
          <div className="pl-4">
            <p className="text-2xl pt-4 font-semibold">Disperse tokens</p>
            <p className="text-[#707070] pt-2">
              Disperse tokens directly to multiple users via Okto’s embedded
              wallet.{" "}
              <a className="text-[#5166EE]" href="https://sdk-docs.okto.tech/">
                Know more
              </a>
            </p>
          </div>
          <div className="relative">
            {idToken ? (
              <div>
                <FaRegCircleUser
                  className="w-7 h-7 cursor-pointer text-[#707070]"
                  onClick={() => setDropdownVisible(!dropdownVisible)}
                />
                {dropdownVisible && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-56 z-10 bg-white border border-gray-300 shadow-lg rounded-md"
                  >
                    <div className="px-4 py-2">
                      {filteredWallets.map((wallet) => {
                        const addressItem = addressList.find(
                          (item) => item.network_name === wallet.network_name
                        );
                        return (
                          <div
                            key={wallet.network_name}
                            className="flex justify-between items-center mt-2"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={addressItem?.imgSrc}
                                alt={addressItem?.name}
                                className="w-4 h-4"
                              />
                              <a
                                href={`${addressItem?.explorerUrl}${wallet.address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black"
                              >
                                {wallet.address.slice(0, 15)}...
                              </a>
                            </div>
                            <FiArrowUpRight className="text-xl" />
                          </div>
                        );
                      })}
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 text-left px-1 py-1 hover:bg-gray-100"
                      >
                        <LuLogOut />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => setMessage("Google login failed")}
                text="signin_with"
                theme="filled_black"
                shape="circle"
                size="large"
                type="standard"
              />
            )}
          </div>
        </header>
        <hr className="my-2 mx-8 h-2" />
        <section className="p-4">{children}</section>
      </main>
    </div>
  );
};

export default Dashboard;

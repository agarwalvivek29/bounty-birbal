/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { FaFileUpload, FaPlus } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { LuImport } from "react-icons/lu";
import Modal from "react-modal";
import { IoClose } from "react-icons/io5";
import {
  Address,
  DispurseProps,
  Network,
  OrderData,
  Token,
  Wallet,
} from "../interfaces";
import { SupportedChain, SupportedToken } from "../types";
import { chainImages, tokenImages } from "../constants";
import { OktoContextType, useOkto } from "okto-sdk-react";
import { addHistory, setWalletAddress } from "../store/auth/authslice";

const Dispurse: React.FC<DispurseProps> = ({ setActiveTab, setHistory }) => {
  const [selectedChain, setSelectedChain] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [supportedChains, setSupportedChains] = useState<Network[]>([]);
  const [supportedTokens, setSupportedTokens] = useState<Token[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const authToken = useSelector((state: RootState) => state.auth.authToken);
  const [maxFees, setMaxFees] = useState<string>("0");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  const [tokenBalances, setTokenBalances] = useState<{ [key: string]: string }>(
    {}
  );
  const [selectedTokenBalance, setSelectedTokenBalance] =
    useState<string>("0.00");
  const dispatch = useDispatch();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const {
    getSupportedNetworks,
    getSupportedTokens,
    transferTokens,
    getPortfolio,
    createWallet,
  } = useOkto() as OktoContextType;
  useEffect(() => {
    const fetchSupportedNetworks = async () => {
      try {
        const response = await getSupportedNetworks();
        const walletsResponse = await createWallet();
        const filteredWallets: Wallet[] = walletsResponse.wallets
          .filter(
            (wallet) =>
              !wallet.network_name.toLowerCase().includes("testnet") &&
              !wallet.network_name.toLowerCase().includes("devnet")
          )
          .map((wallet) => ({
            network_name: wallet.network_name,
            address: wallet.address,
          }));

        dispatch(setWalletAddress(walletsResponse.wallets));
        setWallets(walletsResponse.wallets);
        const userbalance = await getPortfolio();
        const balanceMap: { [key: string]: string } = {};
        userbalance?.tokens.forEach((token: any) => {
          const key = `${token.network_name}_${token.token_name}`;
          balanceMap[key] = parseFloat(token.quantity).toFixed(2);
        });
        setTokenBalances(balanceMap);
        const transformedNetworks: Network[] = response.network.map(
          (network) => ({
            ...network,
            network_name: network.network_name as SupportedChain,
          })
        );

        setSupportedChains(transformedNetworks);
      } catch (error) {
        console.error("Error fetching supported networks:", error);
        setSupportedChains([]);
      }
    };

    fetchSupportedNetworks();
  }, [getSupportedNetworks]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (selectedChain && selectedToken) {
        const key = `${selectedChain}_${selectedToken}`;
        const tokenBalance = tokenBalances[key] || "0.00";
        setSelectedTokenBalance(tokenBalance);
      }
    };

    fetchBalance();
  }, [selectedChain, selectedToken, tokenBalances]);

  useEffect(() => {
    const fetchSupportedTokens = async () => {
      try {
        const response = await getSupportedTokens();
        const transformedTokens: Token[] = response.tokens.map((token) => ({
          ...token,
          token_name: token.token_name as SupportedToken,
        }));
        setAllTokens(transformedTokens);
      } catch (error) {
        console.error("Error fetching supported tokens:", error);
      }
    };

    fetchSupportedTokens();
  }, [getSupportedTokens]);

  useEffect(() => {
    if (selectedChain) {
      console.log("alltokens", allTokens);
      console.log("selectedChain", selectedChain);
      const filteredTokens = allTokens.filter(
        (token) => token.network_name === selectedChain
      );
      console.log("filteredTokens", filteredTokens);
      setSupportedTokens(filteredTokens);
    }
  }, [selectedChain, allTokens]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    let file: File | null = null;
    if (e.type === "drop") {
      const dragEvent = e as React.DragEvent<HTMLDivElement>;
      if (dragEvent.dataTransfer && dragEvent.dataTransfer.files.length > 0) {
        file = dragEvent.dataTransfer.files[0];
      }
    } else {
      const changeEvent = e as React.ChangeEvent<HTMLInputElement>;
      if (changeEvent.target.files && changeEvent.target.files.length > 0) {
        file = changeEvent.target.files[0];
      }
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csv = event.target?.result;
        if (typeof csv === "string") {
          parseCSV(csv);
        }
      };
      reader.readAsText(file);
    }
  };

  const parseCSV = (csv: string) => {
    const lines = csv.split("\n");
    const result: Address[] = [];

    for (let i = 1; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(/,|\s+/);
      if (parts.length >= 3) {
        const id = parseInt(parts[0]);
        const address = parts[1];
        const amount = parts.slice(2).join(" ").trim();
        result.push({ id, address, amount });
      }
    }

    setAddresses(result);
    setIsImportModalOpen(false);
  };

  const handleAddAddress = () => {
    setAddresses([
      ...addresses,
      { id: addresses.length + 1, address: "", amount: "" },
    ]);
  };

  const handleAddressChange = (
    index: number,
    field: keyof Address,
    value: string
  ) => {
    const updatedAddresses = addresses.map((address, i) =>
      i === index ? { ...address, [field]: value } : address
    );
    setAddresses(updatedAddresses);
  };

  const handleSubmit = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmOrder = async () => {
    const token = allTokens.find(
      (token) =>
        token.token_name === selectedToken &&
        token.network_name === selectedChain
    );

    if (!token) {
      console.error(
        "Token address not found for the selected token and chain."
      );
      return;
    }

    const orderData: OrderData = {
      selectedChain,
      selectedToken,
      totalAmount,
      totalWallets: addresses.length,
      walletAddresses: addresses.map((addr) => ({
        address: addr.address,
        orderId: "",
        status: "Pending",
      })),
      maxFees,
      orderDate: new Date(),
    };

    setShowToast(true);
    setIsButtonDisabled(true);

    for (const addr of addresses) {
      try {
        const result: any = await transferTokens({
          network_name: selectedChain,
          token_address: token.token_address,
          recipient_address: addr.address,
          quantity: addr.amount,
        });

        if (result && result?.orderId) {
          orderData.walletAddresses = orderData.walletAddresses.map((wa) =>
            wa.address === addr.address
              ? { ...wa, orderId: result.orderId, status: "Success" }
              : wa
          );
        } else {
          orderData.walletAddresses = orderData.walletAddresses.map((wa) =>
            wa.address === addr.address
              ? { ...wa, status: "Failed", orderId: "N/A" }
              : wa
          );
        }
      } catch (error) {
        console.error("Transfer error", error);

        orderData.walletAddresses = orderData.walletAddresses.map((wa) =>
          wa.address === addr.address
            ? { ...wa, status: "Failed", orderId: "N/A" }
            : wa
        );
      }
    }

    dispatch(addHistory(orderData));
    setSelectedChain("");
    setSelectedToken("");
    setAddresses([]);

    setIsConfirmModalOpen(false);
    setTimeout(() => {
      setShowToast(false);
      setActiveTab("history");
      setIsButtonDisabled(false);
    }, 3000);
  };

  const totalAmount = addresses.reduce(
    (sum, address) => sum + parseFloat(address.amount || "0"),
    0
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileUpload(e);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <div className="mt-5">
        <div className="bg-[#F5F6FE] flex flex-col md:flex-row gap-4 p-4 py-5 rounded-md">
          <div className="flex-1">
            <p className="mb-2 text-gray-700">Chain</p>
            <div className="relative">
              {selectedChain ? (
                <img
                  src={chainImages[selectedChain as SupportedChain]}
                  alt={selectedChain}
                  className="absolute left-2 top-2 w-6 h-6"
                />
              ) : (
                <FaPlus className="absolute left-2 top-2 text-white bg-[#707070] p-1.5 text-2xl rounded-full" />
              )}
              <select
                className="w-full pl-8 p-2 border border-gray-300 rounded-md"
                value={selectedChain}
                onChange={(e) => {
                  const value = e.target.value as SupportedChain;
                  setSelectedChain(value);
                  setSelectedToken("");
                }}
              >
                <option value="" disabled>
                  Select Chain
                </option>
                {supportedChains.map((chain) => (
                  <option key={chain.chain_id} value={chain.network_name}>
                    {chain.network_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex-1">
            <p className={`mb-2 ${!selectedChain ? "text-gray-400" : ""}`}>
              Token
            </p>
            <div className="relative">
              {selectedToken ? (
                <img
                  src={tokenImages[selectedToken as SupportedToken]}
                  alt={selectedToken}
                  className="absolute left-2 top-2 w-6 h-6"
                />
              ) : (
                <FaPlus className="absolute left-2 top-2 text-white bg-[#707070] p-1.5 text-2xl rounded-full" />
              )}
              <select
                className={`w-full pl-8 p-2 border border-gray-300 rounded-md ${
                  !selectedChain ? "text-gray-400" : ""
                }`}
                value={selectedToken}
                onChange={(e) =>
                  setSelectedToken(e.target.value as SupportedToken)
                }
                disabled={!selectedChain}
              >
                <option value="" disabled>
                  Select Token
                </option>
                {supportedTokens.map((token) => (
                  <option key={token.token_address} value={token.token_name}>
                    {token.token_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {selectedToken && (
          <div className="flex mt-2  items-center gap-1 justify-end">
            <p>Balance:</p>
            <p className="text-sm text-[#707070]">
              {selectedTokenBalance} {selectedToken}
            </p>
          </div>
        )}
        <div className="flex mt-8 justify-between">
          <p className="font-semibold text-xl">Disperse to</p>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-full ${
                !selectedChain || !selectedToken || !authToken
                  ? "border-[#1616161F] flex items-center text-gray-400 gap-1 border px-4 py-2 rounded-full"
                  : "border-[#1616161F] flex items-center gap-1 border px-4 py-2 rounded-full"
              }`}
              disabled={!selectedChain || !selectedToken}
              onClick={() => setIsImportModalOpen(true)}
            >
              <LuImport /> Import CSV
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                !selectedChain || !selectedToken || !authToken
                  ? "border-[#1616161F] flex items-center text-gray-400 gap-1 border px-4 py-2 rounded-full"
                  : "border-[#1616161F] flex items-center gap-1 border px-4 py-2 rounded-full"
              }`}
              onClick={handleAddAddress}
              disabled={!selectedChain || !selectedToken}
            >
              <FiPlus /> <span> Add Send Address</span>
            </button>
          </div>
        </div>
        {addresses.length > 0 && (
          <div className="mt-6">
            <div className="table-container">
              <table className="custom-table">
                <thead className="text-left text-[#707070]">
                  <tr>
                    <th className="border font-normal border-gray-300 px-4 py-2">
                      #
                    </th>
                    <th className="border font-normal border-gray-300 px-4 py-2">
                      {selectedChain && <>{selectedChain} </>}Wallet Address
                    </th>
                    <th className="border font-normal w-40 border-gray-300 px-4 py-2">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {addresses.map((address, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">
                        {address.id}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          value={address.address}
                          onChange={(e) =>
                            handleAddressChange(
                              index,
                              "address",
                              e.target.value
                            )
                          }
                          className="w-full border-none bg-transparent p-0"
                          style={{ outline: "none", cursor: "text" }}
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className="flex">
                          <input
                            type="number"
                            value={address.amount}
                            onChange={(e) =>
                              handleAddressChange(
                                index,
                                "amount",
                                e.target.value
                              )
                            }
                            className="w-full border-none bg-transparent p-0"
                            style={{
                              outline: "none",
                              cursor: "text",
                              appearance: "textfield",
                            }}
                          />
                          {selectedToken && (
                            <span className="ml-2">{selectedToken}</span>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {addresses.length === 0 && (
          <div className="mt-20 text-center">
            <img
              src="./assets/box.svg"
              alt="Empty"
              className="mt-10 block mx-auto"
            />
            <p className="font-semibold my-3">No addresses added yet</p>
            <p className="text-[#707070]">Nothing to see here</p>
          </div>
        )}
      </div>
      {addresses.length > 0 && (
        <div className="fixed bottom-0 left-[35%]  w-[55%] bg-[#F5F6FE] p-4 shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex gap-10">
              <div>
                <p className="text-[#707070] text-[15px]">Disperse Amount:</p>
                <p>
                  {totalAmount} {selectedToken} / {selectedTokenBalance}{" "}
                  {selectedToken}
                </p>
              </div>
              <div>
                <p className="text-[#707070] text-[15px]">Total Wallets:</p>
                <p> {addresses.length} Wallets</p>
              </div>
            </div>
            <button
              className={`px-4 py-2 rounded-full ${
                !selectedChain ||
                !selectedToken ||
                addresses.length === 0 ||
                !totalAmount ||
                totalAmount > parseFloat(selectedTokenBalance) ||
                !authToken
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-black text-white"
              }`}
              onClick={handleSubmit}
              disabled={
                !selectedChain ||
                !selectedToken ||
                addresses.length === 0 ||
                !totalAmount ||
                totalAmount > parseFloat(selectedTokenBalance) ||
                !authToken
              }
            >
              Disperse
            </button>
          </div>
        </div>
      )}
      <Modal
        isOpen={isImportModalOpen}
        onRequestClose={() => setIsImportModalOpen(false)}
        contentLabel="Import CSV"
        className="flex items-center justify-center fixed inset-0 z-50 overflow-auto bg-smoke-light"
        overlayClassName="fixed inset-0 bg-black bg-opacity-80 transition-opacity"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg transform transition-all">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Import CSV
          </h2>
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-10 px-4 bg-gray-100 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <FaFileUpload className="text-6xl text-gray-500 mb-4" />
            <p className="text-lg text-gray-500">
              Drag and drop or click here to upload your CSV file
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <div className="flex justify-end w-full mt-6">
            <button
              onClick={() => setIsImportModalOpen(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isConfirmModalOpen}
        onRequestClose={() => setIsConfirmModalOpen(false)}
        contentLabel="Confirm Order"
        className="flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center"
      >
        <div className="bg-white px-6 py-4 rounded-2xl shadow-md w-[400px] max-w-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold ">Confirm Order</h2>
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="text-xl"
            >
              <IoClose />
            </button>
          </div>
          <hr className="my-2" />
          <div className="mb-4 my-2 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div>
                <p>Selected Chain:</p>
                <p className="text-sm text-[#707070]">{selectedChain}</p>
              </div>
              {selectedChain && (
                <img
                  src={chainImages[selectedChain as SupportedChain]}
                  alt={selectedChain}
                  className=" w-6 h-6"
                />
              )}
            </div>
            <div>
              <p>From Wallet Address:</p>
              <p className="text-sm overflow-auto text-[#707070]">
                {wallets.find((wallet) => wallet.network_name === selectedChain)
                  ?.address || "N/A"}
              </p>
            </div>
            <div className="w-full flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <p>Total Wallets Sending To:</p>
                <p>{addresses.length}</p>
              </div>
              <div className="flex justify-between items-center">
                <p>Total Amount:</p>
                <p>
                  {totalAmount} {selectedToken}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p>Sender Balance:</p>
                <p>
                  {selectedTokenBalance} {selectedToken}
                </p>
              </div>
            </div>
          </div>
          <hr className="my-2" />
          <button
            className="bg-black mt-2 text-white px-4 py-2 rounded-full w-full"
            onClick={confirmOrder}
            disabled={
              isButtonDisabled ||
              !selectedChain ||
              !selectedToken ||
              !authToken ||
              totalAmount === 0
            }
          >
            Confirm Order
          </button>
        </div>
      </Modal>
      {showToast && (
        <div className="fixed bottom-10 right-4 border-[#1616161F] border flex h-14 w-[400px] items-center px-5 py-3 gap-4 rounded-lg bg-white shadow-lg">
          <span className="text-black border-2 border-black font-bold text-sm  px-1 rounded-full">
            &#x2713;
          </span>
          <p>Tokens disperse initiated</p>
        </div>
      )}
    </div>
  );
};

export default Dispurse;

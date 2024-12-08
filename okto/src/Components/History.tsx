/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { LuInfo } from "react-icons/lu";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { HistoryProps, WalletAddressData } from "../interfaces";
import { OktoContextType, useOkto } from "okto-sdk-react";
import { explorerLinks } from "../constants";
import { FiArrowUpRight } from "react-icons/fi";

const History: React.FC<HistoryProps> = ({ history }) => {
  const [visibleIndices, setVisibleIndices] = useState<number[]>([]);
  const [orderStates, setOrderStates] = useState<{ [key: string]: any }>({});
  const { orderHistory } = useOkto() as OktoContextType;

  const toggleVisibility = (index: number) => {
    setVisibleIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const fetchOrderHistory = async (orderId: string, address: string) => {
    try {
      const response = await orderHistory({
        offset: 0,
        limit: 1,
        order_id: orderId,
      });
      if (response.jobs.length > 0) {
        const order = response.jobs[0];
        setOrderStates((prev) => ({
          ...prev,
          [address]: {
            status: order.status,
            transaction_hash: order.transaction_hash,
            network_name: order.network_name,
          },
        }));
      } else {
        setOrderStates((prev) => ({
          ...prev,
          [address]: { status: "Failed", transaction_hash: "-" },
        }));
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
      setOrderStates((prev) => ({
        ...prev,
        [address]: { status: "Failed", transaction_hash: "-" },
      }));
    }
  };

  useEffect(() => {
    history.forEach((item) => {
      item.walletAddresses.forEach((wa) => {
        if (wa.orderId && wa.orderId !== "N/A") {
          fetchOrderHistory(wa.orderId, wa.address);
        } else {
          setOrderStates((prev) => ({
            ...prev,
            [wa.address]: { status: wa.status, transaction_hash: "-" },
          }));
        }
      });
    });
  }, [history]);

  const sortedHistory = [...history].sort((a, b) => {
    const dateA = new Date(a.orderDate).getTime();
    const dateB = new Date(b.orderDate).getTime();
    return dateB - dateA;
  });
  const getExplorerUrl = (network_name: string, transaction_hash: string) => {
    const network = explorerLinks.find(
      (network) => network.network_name === network_name
    );
    if (network) {
      return `${network.explorerUrl}${transaction_hash}${
        network.networkSuffix || ""
      }`;
    }
    return null;
  };

  return (
    <div className="mt-5">
      {sortedHistory.length === 0 ? (
        <div>
          <div className="border-[#1616161F] border flex items-center px-5 py-3 gap-3 rounded-lg">
            <LuInfo className="text-2xl" />
            <p className="">For previous sessions check explorer.</p>
          </div>
          <div className="mt-20 text-center">
            <img
              src="./assets/history.svg"
              alt="Empty"
              className="mt-10 block mx-auto"
            />
            <p className="font-semibold my-3">No History here</p>
            <p className="text-[#707070]">Check explorer</p>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="border-[#1616161F] border flex items-center px-5 py-3 gap-3 rounded-lg">
            <LuInfo className="text-2xl" />
            <div>
              <p className="">Heads up!</p>
              <p className="text-[#161616] text-sm">
                Data history will be deleted after refreshing the session.
              </p>
            </div>
          </div>
          {sortedHistory.map((item, index) => (
            <div key={index} className="mt-8">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleVisibility(index)}
              >
                <div>
                  <p className="text-lg font-normal">
                    {item.selectedToken} on {item.selectedChain} Chain
                  </p>
                </div>
                <div className="flex items-center gap-10">
                  <p className="text-[#707070] text-sm">
                    Amount: {item.totalAmount}
                  </p>
                  <p className="text-[#707070] text-sm">
                    Wallet: {item.totalWallets}
                  </p>
                  <span>
                    {visibleIndices.includes(index) ? (
                      <FaChevronUp className="text-xl" />
                    ) : (
                      <FaChevronDown className="text-xl" />
                    )}
                  </span>
                </div>
              </div>
              {visibleIndices.includes(index) && (
                <table className="custom-table mt-4 w-full border-collapse">
                  <thead className="text-left text-[#707070]">
                    <tr>
                      <th className="border font-normal border-gray-300 px-4 py-2">
                        #
                      </th>
                      <th className="border font-normal border-gray-300 px-4 py-2">
                        {item.selectedChain} Wallet Address
                      </th>
                      <th className="border font-normal border-gray-300 px-4 py-2">
                        State
                      </th>
                      <th className="border font-normal border-gray-300 px-4 py-2">
                        Hash
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.walletAddresses.map(
                      (address: WalletAddressData, idx) => (
                        <tr key={idx}>
                          <td className="border border-gray-300 px-4 py-2">
                            {idx + 1}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {address.address}
                          </td>
                          <td
                            className={`border border-gray-300 px-4 py-2 ${
                              orderStates[address.address]?.status === "SUCCESS"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {orderStates[address.address]?.status || "Pending"}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {orderStates[address.address]?.transaction_hash &&
                            orderStates[address.address]?.transaction_hash !==
                              "-" ? (
                              <a
                                href={
                                  getExplorerUrl(
                                    orderStates[address.address]?.network_name,
                                    orderStates[address.address]
                                      ?.transaction_hash
                                  ) || "#"
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className=" "
                              >
                                <FiArrowUpRight className="text-xl" />{" "}
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;

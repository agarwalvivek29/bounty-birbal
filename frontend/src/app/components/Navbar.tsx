"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton, lightTheme, useActiveAccount } from "thirdweb/react";
import { client } from "../client";
import { FaGithub, FaChevronDown } from "react-icons/fa"; // Import ChevronDown for dropdown
import styles from "./Navbar.module.css";

const Navbar = () => {
    const account = useActiveAccount();
    const [showGithubModal, setShowGithubModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility

    useEffect(() => {
        if (account) {
            // Show the modal when the wallet is connected
            console.log("account: ",account)
            setShowGithubModal(true);
        }
    }, [account]);

    const closeModal = () => {
        setShowGithubModal(false);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown); // Toggle dropdown on click
    };

    return (
        <div className={`bg-black mx-auto max-w-10xl px-2 sm:px-6 lg:px-8 shadow-md ${styles.navbar}`}>
            <div className="relative flex h-16 items-center justify-between">
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="flex flex-shrink-0 items-center">
                        <div className="flex items-center space-x-1">
                            <FaGithub className="text-violet-300" style={{ fontSize: "2rem" }} /> {/* Increased size of GitHub Icon */}
                            <h1 className="font-bold" style={{ fontSize: "2rem" }}>
                                <span className={styles.textGradient}>Bounty</span>
                                <span className={styles.textGradient2}>Dispenser</span>
                            </h1>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:block">
                        <div className="relative flex items-center space-x-4"> {/* Add space for the "Issue" button */}
                            {account && (
                                <>
                                    <button
                                        style={{ border: "solid 3px #7c3aed" }}
                                        onClick={toggleDropdown}
                                        className="rounded-md px-3 py-2 text-lg font-medium text-violet-700 hover:text-white transition duration-200 ease-in-out flex items-center"
                                    >
                                        Dashboard <FaChevronDown className="ml-2" /> {/* Add dropdown arrow */}
                                    </button>

                                    <Link href="/bounties"> {/* Link to /issues */}
                                        <button className="rounded-md px-3 py-2 text-lg font-medium text-violet-700 hover:text-white transition duration-200 ease-in-out">
                                            Bounties
                                        </button>
                                    </Link>
                                </>
                            )}

                            {showDropdown && (
                                <div className="absolute mt-2 w-48 rounded-md shadow-lg bg-gray-950 ring-1 ring-black ring-opacity-5">
                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                        <Link href="/manager">
                                            <p className="block px-4 py-2 text-sm text-white-700 hover:bg-gray-100 hover:text-violet-700" role="menuitem">
                                                Manager
                                            </p>
                                        </Link>
                                        <Link href="/contributer">
                                            <p className="block px-4 py-2 text-sm text-white-700 hover:bg-gray-100 hover:text-violet-700" role="menuitem">
                                                Contributor
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <Link href="/api/auth/signin">
                        <button className="flex items-center px-4 py-3 mx-1 bg-violet-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-violet-700 transition duration-200 ease-in-out">
                            <FaGithub className="mr-2 text-white" style={{ fontSize: "1.5rem" }} />
                            Github Signin
                        </button>
                    </Link>
                    <ConnectButton
                        client={client}
                        theme={lightTheme()}
                        detailsButton={{
                            style: {
                                maxHeight: "50px"
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Navbar;

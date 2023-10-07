import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Login from "../../components/Login";
import Head from "next/head";
import AddProduct from "../../components/AddProduct";
import NavigationBar from "../../components/NavigationBar";

const Home: NextPage = () => {
  const [user, setUser] = useState("");

  useEffect(() => {
    const listenStorageChange = () => {
      if (typeof window !== "undefined") {
        setUser(localStorage.getItem("username"));
      }
    };
    window.addEventListener("login", listenStorageChange);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUser(localStorage.getItem("username"));
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Talasulod Admin</title>
        <link rel="icon" href="/k-snacks-logo.jpeg" />
      </Head>

      <main>
        {user == "miajowel" ? (
          <>
            <NavigationBar />
            <AddProduct />
          </>
        ) : (
          <Login />
        )}
      </main>
    </div>
  );
};

export default Home;

import Head from "next/head";
import Order from "../components/Order";
import NavigationBar from "../components/NavigationBar";
import Login from "../components/Login";
import { useEffect, useState } from "react";

const Home = () => {
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
            <Order />
          </>
        ) : (
          <Login />
        )}
      </main>
    </div>
  );
};

export default Home;

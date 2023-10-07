import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDatabase,
  faSignOut,
  faAdd,
} from "@fortawesome/free-solid-svg-icons";
import { Container, Navbar } from "react-bootstrap";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";

export default function NavigationBar() {
  const [orders] = useCollection(db.collection("orders"));
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [paidRevenue, setPaidRevenue] = useState(0);

  useEffect(() => {
    let total = 0;
    let paid = 0;

    orders?.docs.forEach((item) => {
      total += item.data().totalPrice;
      paid += item.data().partialPayment;
    });

    setTotalRevenue(total);
    setPaidRevenue(paid);
  }, [orders]);
  const logout = (e) => {
    localStorage.removeItem("username");
    window.dispatchEvent(new Event("login"));
  };

  return (
    <Navbar bg="dark" expand="lg" className="bg-dark py-4 fixed-top text-white">
      <Container>
        <div className="row">
          <div className="col-12">
            <Link
              href="/"
              className="navbar-brand d-flex align-items-center justify-content-between order-lg-0"
            >
              <span id="brand-name">Talasulod Admin</span>
            </Link>
          </div>
          <div className="col-12">
            <span className="me-3">Total Expenses:</span>
            <span>321,000</span>
          </div>

          <div className="col-12">
            <span className="me-4">Total Revenue:</span>
            <span>{totalRevenue.toLocaleString()}</span>
          </div>

          <div className="col-12">
            <span style={{ marginRight: "28px" }}>Paid Revenue:</span>
            <span className="text-warning fw-bold">
              {paidRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="nav-btns order-lg-2">
          <>
            <Link
              href="/products"
              className="btn position-relative"
              type="button"
            >
              <FontAwesomeIcon icon={faAdd} height={20} />
              <span className="nav-btn-label"> ADD PRODUCT </span>
            </Link>
            <Link
              href="/"
              className="btn position-relative"
              type="button"
              onClick={logout}
            >
              <FontAwesomeIcon icon={faSignOut} height={20} />
              <span className="nav-btn-label"> LOGOUT</span>
            </Link>
          </>
        </div>
      </Container>
    </Navbar>
  );
}

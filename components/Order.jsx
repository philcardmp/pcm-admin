import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import Link from "next/link";
import { Modal, Button } from "react-bootstrap";

export default function Food() {
  const [showModal, setShowModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [payment, setPayment] = useState(0);
  const [orders] = useCollection(
    db.collection("orders").orderBy("timestamp", "desc")
  );

  const deleteConfirmation = (item) => {
    setShowModal(true);
    setActiveOrder(item);
  };

  const closeModal = () => {
    db.collection("orders").doc(activeOrder.id).delete();
    setShowModal(false);
  };

  const updatePartialPayment = (item) => {
    db.collection("orders")
      .doc(item.id)
      .update({
        ...item.data(),
        partialPayment:
          parseInt(payment) + parseInt(item.data().partialPayment),
      });
  };

  const renderCollectionList = () => {
    return orders?.docs.map((item) => (
      <div className="col-md-6 col-lg-4 p-5" key={item.id}>
        <div className="position-relative">
          <Link href={`/order/${item.id}`}>
            <div className="d-flex align-items-center justify-content-center w-100 h-100 mb-3">
              <h2 className="text-capitalize my-1 fw-bold">
                {item.data().user}
              </h2>
            </div>
          </Link>

          <div
            className={`${
              item.data().partialPayment / item.data().totalPrice >= 1
                ? "bg-info"
                : "bg-danger"
            } w-100 text-center`}
          >
            <h3>
              {((item.data().partialPayment / item.data().totalPrice) * 100)
                .toFixed(2)
                .replace(/\.00$/, "")
                .replace(/(\.\d)0$/, "$1")}
              %
            </h3>
          </div>
          <div className="row">
            <div className="col-12">
              <span className="me-5">
                Payment: {parseInt(item.data().partialPayment).toLocaleString()}
              </span>
              <span>
                Balance:
                {parseInt(
                  item.data().totalPrice - item.data().partialPayment
                ).toLocaleString()}
              </span>
            </div>
            <span className="fw-bold">
              Total: {parseInt(item.data().totalPrice).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="text-center">
          <button
            className="btn btn-danger mt-3 me-3"
            onClick={() => deleteConfirmation(item)}
          >
            DELETE
          </button>
          <div className="d-flex align-items-center py-3">
            <label htmlFor={`partialPayment-${item.id}`} className="me-3">
              Partial Payment:
            </label>
            <input
              id={`partialPayment-${item.id}`}
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="form-control w-50 m-2"
            />
            <button onClick={() => updatePartialPayment(item)}>ADD</button>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <section id="collection" className="py-5">
      <div className="container">
        <div className="title text-center pt-2">
          <h2 className="position-relative d-inline-block pt-5">Orders</h2>
        </div>

        <div className="row g-0">
          <div className="collection-list row mt-4 gx-0 gy-3">
            {renderCollectionList()}
          </div>
        </div>
      </div>

      <Modal show={showModal}>
        <Modal.Header>
          <Modal.Title className="text-dark">Delete Order!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-dark">
          Are you sure you want to delete this order?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={() => closeModal()}>DELETE</Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}

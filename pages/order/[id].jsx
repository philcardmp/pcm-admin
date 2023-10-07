import { useEffect, useState } from "react";
import Image from "next/image";
import Login from "../../components/Login";
import Head from "next/head";
import NavigationBar from "../../components/NavigationBar";
import {
  Col,
  Container,
  Form,
  ListGroup,
  Row,
  Modal,
  Button,
} from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { db } from "../../firebase";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";

export default function Cart() {
  const [total, setTotal] = useState(0);
  const [timestamp, setTimestamp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const [products, setProducts] = useState([]);
  const [facebook, setFacebook] = useState("");
  const [user, setUser] = useState("");
  const [orders] = useCollection(
    db.collection("orders").orderBy("timestamp", "desc")
  );

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

  useEffect(() => {
    console.log("orders", orders);
    setLoading(true);
    setTimeout(() => {
      orders?.docs.map((data) => {
        if (data.id === id) {
          setProducts(data.data().order);
          setFacebook(data.data().user);
          setTotal(data.data().totalPrice);
          setTimestamp(data.data().timestamp);
        }
      });
      setLoading(false);
    }, 800);
  }, [orders]);

  const closeModal = (e) => {
    e.preventDefault();
    setShowModal(false);
    window.location.reload();
  };

  const markDone = (e) => {
    e.preventDefault();
    db.collection("orders").doc(id).update({
      user: facebook,
      order: products,
      status: "done",
      totalPrice: total,
      timestamp: timestamp,
    });
    router.back();
  };

  const renderLoading = () => {
    return (
      <>
        <div className="col-md-6">
          <Skeleton height={400} />
        </div>
        <div className="col-md-6" style={{ lineHeight: 2 }}>
          <Skeleton height={50} width={300} />
          <Skeleton height={75} />
          <Skeleton height={25} width={150} />
          <Skeleton height={50} />
          <Skeleton height={150} />
        </div>
      </>
    );
  };

  const renderOrders = () => {
    return (
      <div>
        <NavigationBar />
        <Container fluid style={{ marginTop: "200px" }}>
          <Row style={{ marginTop: "20px" }}>
            <Col xs={12} md={6}>
              <ListGroup>
                {products?.map((product) => (
                  <ListGroup.Item key={product.id}>
                    <div className="cartContainer">
                      <div className="cartImage">
                        <Image
                          src={product.postImage}
                          alt={product.productName}
                          width="100"
                          height="100"
                        />
                      </div>
                      <div className="cartProdName">
                        <h4 className="prodName">{product.productName}</h4>
                        <p className="prodPrice">Price: ₱{product.price}</p>
                        <p className="prodDelivery">{product.description}</p>
                      </div>
                      <div
                        className="px-2"
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        <p>QTY:</p>
                        <Form.Select
                          aria-label="QTY"
                          style={{ marginLeft: "10px", width: "69px" }}
                          defaultValue={product.quantity}
                        >
                          <option value={product.quantity}>
                            {product.quantity}
                          </option>
                        </Form.Select>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col xs={12} md={6} style={{ margin: "0px" }}>
              <div className="Cart-total">
                <hr />
                <div>
                  {products?.map((product) => (
                    <div
                      key={product.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>
                        {product.productName} (
                        {product.quantity ? product.quantity : 1})
                      </p>
                      <p>
                        ₱{" "}
                        {product.price *
                          (product.quantity ? product.quantity : 1)}
                      </p>
                    </div>
                  ))}
                </div>
                <hr />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p style={{ fontWeight: "bold" }}>Order Total:</p>
                  <p className="fs-2 fw-bold lead">
                    ₱ {Math.ceil(total).toLocaleString()}
                  </p>
                </div>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Control
                    type="text"
                    size="sm"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    autoComplete="username"
                  ></Form.Control>
                </Form.Group>
                <button
                  className="btn btn-primary mt-5"
                  disabled={products.length < 1}
                  onClick={markDone}
                >
                  MARK DONE
                </button>
                <Modal show={showModal}>
                  <Modal.Header>
                    <Modal.Title className="text-dark">
                      Congratulation!
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="text-dark">
                    Successful Checkout! Please wait for our message on your
                    facebook account.
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={closeModal}>Close</Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  };

  return (
    <div>
      <Head>
        <title>Talasulod Admin</title>
        <link rel="icon" href="/k-snacks-logo.jpeg" />
      </Head>

      <main>
        {user == "miajowel" ? (
          <>{loading ? renderLoading() : renderOrders()}</>
        ) : (
          <Login />
        )}
      </main>
    </div>
  );
}

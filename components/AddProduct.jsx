import React, { useRef, useState } from "react";
import Image from "next/image";
import { Form } from "react-bootstrap";
import firebase from "firebase/compat/app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faTrash,
  faStar,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { db, storage } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";

export default function AdminProducts() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [filter, setFilter] = useState("");
  const [team, setTeam] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const filePickerRef = useRef(null);
  const [imageToPost, setImageToPost] = useState(null);
  const [productList] = useCollection(
    db.collection("products").orderBy("timestamp", "desc")
  );

  // Validation
  const [invalidName, setInvalidName] = useState(false);
  const [invalidPrice, setInvalidPrice] = useState(false);
  const [invalidQuantity, setInvalidQuantity] = useState(false);
  const [invalidDescription, setInvalidDescription] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkIfValid()) {
      const requestBody = {
        productName: productName,
        price: price,
        quantity: quantity,
        firstName: firstName,
        lastName: lastName,
        filter: filter,
        team: team,
        description: description,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };

      db.collection("products")
        .add(requestBody)
        .then((doc) => {
          if (imageToPost) {
            const uploadTask = storage
              .ref(`products/${doc.id}`)
              .putString(imageToPost, "data_url");

            removeImage();

            uploadTask.on(
              "state_change",
              null,
              (error) => console.error(error),
              () => {
                // When the upload completes
                storage
                  .ref("products")
                  .child(doc.id)
                  .getDownloadURL()
                  .then((url) => {
                    db.collection("products")
                      .doc(doc.id)
                      .set({ postImage: url }, { merge: true });
                  });
              }
            );
          }
        });
    }

    cancelEdit(e);
  };

  const submitEdit = (e) => {
    e.preventDefault();
    if (checkIfValid()) {
      const requestBody = {
        productName: productName,
        price: price,
        quantity: quantity,
        filter: filter,
        description: description,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };

      db.collection("products")
        .doc(editId)
        .update(requestBody)
        .then(() => {
          if (imageToPost) {
            const uploadTask = storage
              .ref(`products/${editId}`)
              .putString(imageToPost, "data_url");

            removeImage();

            uploadTask.on(
              "state_change",
              null,
              (error) => console.error(error),
              () => {
                // When the upload completes
                storage
                  .ref("products")
                  .child(editId)
                  .getDownloadURL()
                  .then((url) => {
                    db.collection("products")
                      .doc(editId)
                      .set({ postImage: url }, { merge: true });
                  });
              }
            );
          }
        });
    }

    cancelEdit(e);
  };

  const cancelEdit = (e) => {
    e.preventDefault();

    // Set to default
    setPrice(null);
    setQuantity(null);
    setProductName("");
    setFirstName("");
    setLastName("");
    setFilter("");
    setTeam("");
    setDescription("");
    setEditId(null);
    setImageToPost(null);
  };

  const editProduct = (product) => {
    // Set to edit product
    setProductName(product.data().productName);
    setPrice(product.data().price);
    setQuantity(product.data().quantity);
    setFirstName(product.data().firstName);
    setLastName(product.data().lastName);
    setFilter(product.data().filter);
    setTeam(product.data().team);
    setDescription(product.data().description);
    setImageToPost(product.data().postImage);
    setEditId(product.id);
  };

  const deleteProduct = (id) => {
    // Delete from db
    db.collection("products").doc(id).delete();

    // Delete from storage
    storage.ref("products").child(id).delete();
  };

  const updateProduct = (product) => {
    db.collection("products")
      .doc(product.id)
      .update({
        ...product.data,
      });
  };

  const checkIfValid = () => {
    let isValid = true;

    // Check if productName is valid
    if (productName.match("^$|^.*@.*..*$")) {
      setInvalidName(true);
      isValid = false;
    } else {
      setInvalidName(false);
    }

    // Check if price has value
    if (price.match("^$|^.*@.*..*$") || isNaN(price) || price <= 0) {
      setInvalidPrice(true);
      isValid = false;
    } else {
      setInvalidPrice(false);
    }

    // Check if quantity has value
    if (quantity.match("^$|^.*@.*..*$") || isNaN(quantity) || quantity <= 0) {
      setInvalidQuantity(true);
      isValid = false;
    } else {
      setInvalidQuantity(false);
    }

    // Check if firstName is valid
    if (firstName.match("^$|^.*@.*..*$")) {
      setInvalidName(true);
      isValid = false;
    } else {
      setInvalidName(false);
    }

    // Check if lastName is valid
    if (lastName.match("^$|^.*@.*..*$")) {
      setInvalidName(true);
      isValid = false;
    } else {
      setInvalidName(false);
    }

    // Check if description has an input
    if (description.match("^$|^.*@.*..*$")) {
      setInvalidDescription(true);
      isValid = false;
    } else {
      setInvalidDescription(false);
    }

    return isValid;
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readEvent) => {
      setImageToPost(readEvent.target.result);
    };
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
    setTeam(e.target.options[e.target.selectedIndex].text);
  };

  const removeImage = () => {
    setImageToPost(null);
  };

  const renderForm = () => {
    return (
      <Form onSubmit={handleSubmit} className="row">
        {/* PRODUCT NAME */}
        <Form.Group controlId="formProductName" className="w-50">
          <Form.Control
            type="text"
            size="sm"
            placeholder="Enter Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            isInvalid={invalidName}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please input a product name
          </Form.Control.Feedback>
        </Form.Group>

        {/* PRODUCT PRICE */}
        <Form.Group controlId="formPrice" className="w-25">
          <Form.Control
            type="text"
            size="sm"
            placeholder="Enter Product Price"
            value={price ? price.toString() : ""}
            onChange={(e) => setPrice(e.target.value)}
            isInvalid={invalidPrice}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Price must be a number
          </Form.Control.Feedback>
        </Form.Group>

        {/* PRODUCT QUANTITY */}
        <Form.Group controlId="formQuantity" className="w-25">
          <Form.Control
            type="text"
            size="sm"
            placeholder="Enter Product Quantity"
            value={quantity ? quantity.toString() : ""}
            onChange={(e) => setQuantity(e.target.value)}
            isInvalid={invalidQuantity}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Quantity must be a number
          </Form.Control.Feedback>
        </Form.Group>

        {/* FIRSTNAME */}
        <Form.Group controlId="formFirstName" className="w-25">
          <Form.Control
            type="text"
            size="sm"
            placeholder="Enter Player's First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            isInvalid={invalidName}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Price must be a number
          </Form.Control.Feedback>
        </Form.Group>

        {/* LASTNAME */}
        <Form.Group controlId="formQuantity" className="w-25">
          <Form.Control
            type="text"
            size="sm"
            placeholder="Enter Player's Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            isInvalid={invalidName}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Quantity must be a number
          </Form.Control.Feedback>
        </Form.Group>

        {/* FILTER */}
        <Form.Group controlId="formFilter" className="w-50">
          <Form.Select
            aria-label="Default select example"
            onChange={handleFilter}
            value={filter}
          >
            <option value="ATL">Atlanta Hawks</option>
            <option value="BKN">Brooklyn Nets</option>
            <option value="BOS">Boston Celtics</option>
            <option value="CHA">Charlotte Hornets</option>
            <option value="CHI">Chicago Bulls</option>
            <option value="CLE">Cleveland Cavaliers</option>
            <option value="DAL">Dallas Mavericks</option>
            <option value="DEN">Denver Nuggets</option>
            <option value="DET">Detroit Pistons</option>
            <option value="GSW">Golden State Warriors</option>
            <option value="HOU">Houston Rockets</option>
            <option value="IND">Indiana Pacers</option>
            <option value="LAC">Los Angeles Clippers</option>
            <option value="LAL">Los Angeles Lakers</option>
            <option value="MEM">Memphis Grizzlies</option>
            <option value="MIA">Miami Heat</option>
            <option value="MIL">Milwaukee Bucks</option>
            <option value="MIN">Minnesota Timberwolves</option>
            <option value="NOP">New Orleans Pelicans</option>
            <option value="NYK">New York Knicks</option>
            <option value="OKC">Oklahoma City Thunder</option>
            <option value="ORL">Orlando Magic</option>
            <option value="PHI">Philadelphia 76ers</option>
            <option value="PHX">Phoenix Suns</option>
            <option value="POR">Portland Trail Blazers</option>
            <option value="SAC">Sacramento Kings</option>
            <option value="SAS">San Antonio Spurs</option>
            <option value="TOR">Toronto Raptors</option>
            <option value="UTA">Utah Jazz</option>
            <option value="WAS">Washington Wizards</option>
          </Form.Select>
        </Form.Group>

        {/* DESCRIPTION */}
        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Control
            as="textarea"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            isInvalid={invalidDescription}
          />
          <Form.Control.Feedback type="invalid">
            Please input a product description
          </Form.Control.Feedback>
        </Form.Group>

        {/* IMAGE */}
        <Form.Group className="mb-3" controlId="formImage">
          {imageToPost ? (
            <div>
              <Image
                className="img-thumbnail"
                height="300"
                width="300"
                src={imageToPost}
                alt="post"
              />
              <button
                className="text-danger fw-bold cursor-pointer"
                role="button"
                onClick={removeImage}
              >
                Remove
              </button>
            </div>
          ) : (
            <div
              onClick={() => filePickerRef.current.click()}
              className="inputIcon"
            >
              <FontAwesomeIcon icon={faCamera} height={20} />
              <p className="text-xs sm:text-sm xl:text-base hidden md:block">
                Photo/Video
              </p>
              <input
                ref={filePickerRef}
                onChange={addImageToPost}
                type="file"
                hidden
              />
            </div>
          )}
        </Form.Group>

        {!editId && (
          <div className="col-12 d-flex flex-wrap justify-content-center">
            <button
              className="bg-primary text-center text-white w-50"
              onClick={handleSubmit}
            >
              Upload
            </button>
          </div>
        )}
        {editId && (
          <div className="col-12 d-flex flex-wrap justify-content-center">
            <button
              className="bg-primary text-center text-white w-50"
              onClick={submitEdit}
            >
              Submit Edit
            </button>
            <button
              className="bg-danger text-center text-white w-50"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>
        )}
      </Form>
    );
  };

  const renderProducts = () => {
    return (
      <>
        {productList?.docs.map((product) => (
          <React.Fragment key={product.id}>
            <div className="col-md-4 my-4">
              <div className="card text-center d-flex align-items-center justify-content-center py-2">
                <h6 className="pt-2 fw-bold">
                  P{`${parseInt(product.data().price).toLocaleString()}`}
                </h6>
                <Image
                  src={product.data().postImage}
                  alt={product.data().productName}
                  width="320"
                  height="400"
                />
                <h6 className="pt-2 fw-bold">{product.data().productName}</h6>
                <h6 className="text-secondary">{product.data().filter}</h6>
                <div className="d-flex justify-content-around">
                  <h6
                    onClick={() => deleteProduct(product.id)}
                    role="button"
                    className="text-danger me-3"
                  >
                    DELETE
                    <FontAwesomeIcon icon={faTrash} height={20} color="red" />
                  </h6>
                  <h6
                    onClick={() => editProduct(product)}
                    role="button"
                    className="text-primary"
                  >
                    EDIT
                    <FontAwesomeIcon icon={faEdit} height={20} color="blue" />
                  </h6>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <button
                    onClick={() => updateProduct(product, "sale")}
                    role="button"
                  >
                    sale
                  </button>
                  <button
                    onClick={() => updateProduct(product, "reserved")}
                    role="button"
                  >
                    reserved
                  </button>
                  <button
                    onClick={() => updateProduct(product, "sold")}
                    role="button"
                  >
                    sold
                  </button>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </>
    );
  };

  if (editId) {
    return (
      <section id="collection" className="py-5">
        <div className="container">
          <div className="title text-center pt-2">
            <h2 className="position-relative d-inline-block pt-5">
              EDIT PRODUCT
            </h2>
          </div>
          <hr />
          {renderForm()}
        </div>
      </section>
    );
  } else {
    return (
      <section id="collection" className="py-5">
        <div className="container pt-5">
          <div className="title text-center pt-5">
            <h2 className="position-relative d-inline-block pt-5">
              ADD PRODUCT
            </h2>
          </div>
          <hr />
          {renderForm()}
          <hr />
          <div className="container">
            <div className="row justify-content-center pb-5 mb-5">
              <h4 className="text-danger text-center">CARDS</h4>
              {renderProducts()}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

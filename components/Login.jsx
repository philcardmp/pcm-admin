import { useState } from "react";
import { Button, Form } from "react-bootstrap";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Validation
  const [invalidUser, setInvalidUser] = useState(false);

  const checkIfValid = () => {
    let isValid = false;

    // Check if user exist
    if (username === "miajowel" && password === "5jan") {
      setInvalidUser(false);
      isValid = true;
    } else {
      setInvalidUser(true);
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkIfValid()) {
      localStorage.setItem("username", username);
      window.dispatchEvent(new Event("login"));
    }
  };

  return (
    <div className="d-flex justify-content-center text-dark">
      <Form className="formContainer" onSubmit={handleSubmit}>
        <h2>LOGIN</h2>

        <Form.Group className="mb-4" controlId="formEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            size="sm"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            isInvalid={invalidUser}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Invalid User
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            size="sm"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={invalidUser}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Invalid User
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="button">
          Submit
        </Button>
      </Form>
    </div>
  );
}

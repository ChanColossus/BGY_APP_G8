import React, { Fragment, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { authenticate, getUser } from "../../utils/helpers";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `http://localhost:4001/api/v1/login`,
        { email, password },
        config
      );

      console.log(data);
      authenticate(data, () => {
        // Redirect to the desired URL after successful login
        navigate("/admin/dashboard");
      });
    } catch (error) {
      console.error("Invalid user or password", error);
    }
  };

  return (
    <Fragment>
      <div className="body" style={{ backgroundColor: "white", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Container className="container-fluid" style={{ paddingTop: "0px" }}>
          <Row className="justify-content-center">
            <Col md="6">
              <Form style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", borderRadius: "20px", padding: "30px", background: "linear-gradient(to right, #85a9db, #00d2ff)" }}>
                <h1 className="mb-3" style={{ color: "#333333", fontWeight: "bold", textAlign: "center", fontSize: "2rem" }}>Login</h1>
                <FormGroup>
                  <Label for="email_field" style={{ color: "#333333", fontWeight: "bold" }}>Email</Label>
                  <Input
                    type="email"
                    id="email_field"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ fontSize: "1rem" }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="password_field" style={{ color: "#333333", fontWeight: "bold" }}>Password</Label>
                  <Input
                    type="password"
                    id="password_field"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ fontSize: "1rem" }}
                  />
                </FormGroup>
                <Button onClick={login} className="buttonforLogin" style={{ fontWeight: "bold", fontSize: "1rem", color: "#ffffff", backgroundColor: "#007bff", marginBottom: "20px" }}>LOGIN</Button>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Link to="/password/forgot" style={{ color: "#333333", fontWeight: "bold", fontSize: "0.8rem" }}>Forgot Password?</Link>
                  <Link to="/auth/register" style={{ color: "#333333", fontWeight: "bold", fontSize: "0.8rem" }}>Register</Link>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

export default Login;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  overflow: hidden;
`;

const Card = styled.div`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 420px;
  animation: fadeIn 0.6s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h2`
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  text-align: center;
  margin-bottom: 32px;
  font-size: 15px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #cbd5e1;
  font-size: 14px;
  font-weight: 500;
  margin-left: 4px;
`;

const Input = styled.input`
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.5);
  color: #fff;
  font-size: 15px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }

  &::placeholder {
    color: #475569;
  }
`;

const Button = styled.button`
  padding: 14px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 12px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  margin-top: 24px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;

  a {
    color: #818cf8;
    text-decoration: none;
    font-weight: 500;
    margin-left: 5px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, guestLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Welcome Back</Title>
        <Subtitle>Enter your details to access the board</Subtitle>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          <Button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                await guestLogin();
                navigate("/");
              } catch (error) {
                console.error(error);
                alert("Guest login failed");
              } finally {
                setLoading(false);
              }
            }}
            style={{
              background: "rgba(255,255,255,0.1)",
              marginTop: "8px",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            Login as Guest (Viewer)
          </Button>
        </Form>
        <Footer>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Footer>
      </Card>
    </Container>
  );
};

export default Login;

import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
    
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #2196f3 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Animated background elements */}
      <div style={{
        position: "absolute",
        top: "15%",
        right: "10%",
        width: "180px",
        height: "180px",
        background: "radial-gradient(circle, rgba(33,150,243,0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 7s ease-in-out infinite"
      }}></div>
      <div style={{
        position: "absolute",
        bottom: "25%",
        left: "12%",
        width: "120px",
        height: "120px",
        background: "radial-gradient(circle, rgba(33,150,243,0.08) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 9s ease-in-out infinite reverse"
      }}></div>
      <div style={{
        position: "absolute",
        top: "40%",
        left: "70%",
        width: "90px",
        height: "90px",
        background: "radial-gradient(circle, rgba(33,150,243,0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 6s ease-in-out infinite"
      }}></div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-25px) rotate(180deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes slideIn {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.3); }
            50% { box-shadow: 0 0 30px rgba(255,215,0,0.6); }
          }
        `}
      </style>

      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
        <div className="w-100" style={{ maxWidth: "950px" }}>
          <Card style={{
            borderRadius: "25px",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,215,0,0.1)",
            border: "none",
            background: "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)",
            backdropFilter: "blur(20px)",
            transform: "translateY(0px)",
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            animation: "slideIn 0.8s ease-out",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.01)";
            e.currentTarget.style.boxShadow = "0 35px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,215,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px) scale(1)";
            e.currentTarget.style.boxShadow = "0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,215,0,0.1)";
          }}
          >
            {/* Card shine effect */}
            <div style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,215,0,0.08), transparent)",
              transition: "left 0.6s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.left = "100%"}
            onMouseLeave={(e) => setTimeout(() => e.currentTarget.style.left = "-100%", 600)}
            ></div>

            <Card.Body style={{ padding: "50px", position: "relative", zIndex: 2 }}>
              <div className="text-center mb-5">
                <div style={{
                  width: "80px",
                  height: "80px",
                  background: "linear-gradient(45deg, #2196f3, #1976d2)",
                  borderRadius: "50%",
                  margin: "0 auto 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 30px rgba(33,150,243,0.3)",
                  animation: "pulse 2s ease-in-out infinite"
                }}>
                  <span style={{ fontSize: "36px", color: "#ffffff", fontWeight: "bold" }}>S</span>
                </div>
                <h2 style={{
                  color: "#000000",
                  fontWeight: "800",
                  fontSize: "28px",
                  marginBottom: "10px",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
                }}>Welcome Back</h2>
                <p style={{ color: "#666", fontSize: "16px", marginBottom: "30px" }}>Sign in to your ScholarGuide account</p>
              </div>

              {error && (
                <Alert variant="danger" style={{
                  borderRadius: "15px",
                  border: "none",
                  background: "linear-gradient(45deg, #ff4757, #ff3838)",
                  color: "white",
                  boxShadow: "0 8px 25px rgba(255,71,87,0.3)",
                  animation: "slideIn 0.5s ease-out",
                  marginBottom: "25px"
                }}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label style={{
                    color: "#333",
                    fontWeight: "700",
                    fontSize: "14px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "8px"
                  }}>Email Address</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      style={{
                        borderRadius: "15px",
                        border: "2px solid transparent",
                        background: "linear-gradient(white, white) padding-box, linear-gradient(45deg, #2196f3, #1976d2) border-box",
                        padding: "15px 20px",
                        fontSize: "16px",
                        fontWeight: "500",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 15px rgba(33,150,243,0.1)",
                        outline: "none"
                      }}
                      onFocus={(e) => {
                        e.target.style.boxShadow = "0 0 0 3px rgba(33,150,243,0.3), 0 8px 25px rgba(33,150,243,0.2)";
                        e.target.style.transform = "translateY(-2px)";
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = "0 4px 15px rgba(33,150,243,0.1)";
                        e.target.style.transform = "translateY(0px)";
                      }}
                    />
                    <div style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#FFD700",
                      fontSize: "18px"
                    }}>✉</div>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label style={{
                    color: "#333",
                    fontWeight: "700",
                    fontSize: "14px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "8px"
                  }}>Password</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      style={{
                        borderRadius: "15px",
                        border: "2px solid transparent",
                        background: "linear-gradient(white, white) padding-box, linear-gradient(45deg, #2196f3, #1976d2) border-box",
                        padding: "15px 20px",
                        fontSize: "16px",
                        fontWeight: "500",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 15px rgba(33,150,243,0.1)",
                        outline: "none"
                      }}
                      onFocus={(e) => {
                        e.target.style.boxShadow = "0 0 0 3px rgba(33,150,243,0.3), 0 8px 25px rgba(33,150,243,0.2)";
                        e.target.style.transform = "translateY(-2px)";
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = "0 4px 15px rgba(33,150,243,0.1)";
                        e.target.style.transform = "translateY(0px)";
                      }}
                    />
                    <div style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#FFD700",
                      fontSize: "18px"
                    }}>🔒</div>
                  </div>
                </Form.Group>

                <Button
                  disabled={loading}
                  className="w-100"
                  type="submit"
                  style={{
                    background: "linear-gradient(45deg, #FFD700, #FFA500)",
                    border: "none",
                    borderRadius: "25px",
                    padding: "15px",
                    fontSize: "18px",
                    fontWeight: "800",
                    color: "#000000",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    boxShadow: "0 8px 25px rgba(255,215,0,0.4)",
                    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    transform: "translateY(0)",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-3px) scale(1.02)";
                    e.target.style.boxShadow = "0 15px 35px rgba(255,215,0,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0) scale(1)";
                    e.target.style.boxShadow = "0 8px 25px rgba(255,215,0,0.4)";
                  }}
                >
                  <span style={{ position: "relative", zIndex: 2 }}>
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Logging In...
                      </>
                    ) : (
                      '🚀 Log In'
                    )}
                  </span>
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    transition: "left 0.5s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.left = "100%"}
                  onMouseLeave={(e) => setTimeout(() => e.currentTarget.style.left = "-100%", 500)}
                  ></div>
                </Button>
              </Form>

              <div className="text-center mt-4">
                <Link to="/forgot-password" style={{
                  color: "#FFD700",
                  textDecoration: "none",
                  fontWeight: "700",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  transition: "all 0.3s ease",
                  position: "relative"
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#FFA500";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#FFD700";
                  e.target.style.transform = "scale(1)";
                }}
                >Forgot Password?</Link>
              </div>
            </Card.Body>
          </Card>

          <div className="w-100 text-center mt-4">
            <span style={{
              color: "#ccc",
              fontWeight: "600",
              fontSize: "16px"
            }}>New to ScholarGuide? </span>
            <Link to="/register" style={{
              color: "#FFD700",
              textDecoration: "none",
              fontWeight: "800",
              fontSize: "16px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              transition: "all 0.3s ease",
              position: "relative"
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#FFA500";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#FFD700";
              e.target.style.transform = "scale(1)";
            }}
            >Join Now ✨</Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Login;
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  font-family: 'Inter', sans-serif;
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-bottom: 32px;
  font-size: 14px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  color: #fff;
  font-size: 16px;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #4a90e2;
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  border: none;
  border-radius: 8px;
  padding: 14px 20px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 12px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #357abd 0%, #2a5f91 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(74, 144, 226, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LoadingSpinner = styled.div`
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 2px solid #fff;
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill in all fields',
        icon: 'error',
        confirmButtonColor: '#4a90e2',
        background: '#2d2d2d',
        color: '#fff',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call the login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Set session storage for authentication
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        sessionStorage.setItem('adminUsername', data.user.username);
        sessionStorage.setItem('adminId', data.user.id.toString());
        
        Swal.fire({
          title: 'Success!',
          text: 'Login successful',
          icon: 'success',
          confirmButtonColor: '#4a90e2',
          background: '#2d2d2d',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false,
        });

        // Redirect to admin dashboard
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1500);
      } else {
        Swal.fire({
          title: 'Access Denied!',
          text: data.error || 'Invalid username or password',
          icon: 'error',
          confirmButtonColor: '#4a90e2',
          background: '#2d2d2d',
          color: '#fff',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred during login. Please try again.',
        icon: 'error',
        confirmButtonColor: '#4a90e2',
        background: '#2d2d2d',
        color: '#fff',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>LAPIS</Title>
        <Subtitle>Admin Access Only</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              disabled={isLoading}
              autoComplete="username"
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </InputGroup>

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <LoadingContainer>
                <LoadingSpinner />
                Logging in...
              </LoadingContainer>
            ) : (
              'Login'
            )}
          </LoginButton>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
}
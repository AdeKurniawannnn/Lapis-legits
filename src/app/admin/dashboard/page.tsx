'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  max-width: 1200px;
  margin: 0 auto 40px auto;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 32px;
  font-weight: 700;
`;

const LogoutButton = styled.button`
  background: #dc3545;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
  }
`;

const WelcomeCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const WelcomeText = styled.h2`
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const WelcomeSubtext = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  line-height: 1.6;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 40px auto 0 auto;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: ${props => props.onClick ? 'pointer' : 'default'};

  &:hover {
    ${props => props.onClick && `
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(74, 144, 226, 0.2);
      border-color: rgba(74, 144, 226, 0.3);
    `}
  }
`;

const FeatureCard = styled(StatCard)`
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.1) 0%, rgba(53, 122, 189, 0.1) 100%);
  border: 1px solid rgba(74, 144, 226, 0.3);
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, rgba(74, 144, 226, 0.2) 0%, rgba(53, 122, 189, 0.2) 100%);
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(74, 144, 226, 0.3);
  }
`;

const StatValue = styled.div`
  color: #4a90e2;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
`;

const FeatureIcon = styled.div`
  color: #4a90e2;
  font-size: 48px;
  margin-bottom: 12px;
`;

const FeatureTitle = styled.div`
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const FeatureDescription = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.4;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
`;

const Spinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid #4a90e2;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUsername, setAdminUsername] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn');
      const username = sessionStorage.getItem('adminUsername');
      
      if (isLoggedIn === 'true' && username) {
        setIsAuthenticated(true);
        setAdminUsername(username);
      } else {
        setIsAuthenticated(false);
        router.replace('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    sessionStorage.removeItem('adminUsername');
    router.replace('/login');
  };

  const handleEmailBlast = () => {
    router.push('/admin/email-blast');
  };

  if (isAuthenticated === null) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  if (!isAuthenticated) {
    return null; // Router will redirect
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <LogoutButton onClick={handleLogout}>
          Logout
        </LogoutButton>
      </Header>

      <WelcomeCard>
        <WelcomeText>Welcome back, {adminUsername}!</WelcomeText>
        <WelcomeSubtext>
          You have successfully accessed the LAPIS admin dashboard. 
          This is a secure area where you can manage your video production portfolio, 
          services, and website content.
        </WelcomeSubtext>
      </WelcomeCard>

      <StatsGrid>
        <StatCard>
          <StatValue>24</StatValue>
          <StatLabel>Portfolio Projects</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>5</StatValue>
          <StatLabel>Service Categories</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>12</StatValue>
          <StatLabel>Awards Won</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>98%</StatValue>
          <StatLabel>Client Satisfaction</StatLabel>
        </StatCard>

        <FeatureCard onClick={handleEmailBlast}>
          <FeatureIcon>📧</FeatureIcon>
          <FeatureTitle>Email Blast</FeatureTitle>
          <FeatureDescription>
            Send marketing emails to your clients and prospects
          </FeatureDescription>
        </FeatureCard>
      </StatsGrid>
    </DashboardContainer>
  );
}
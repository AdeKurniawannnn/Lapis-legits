'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import { createClient } from '@supabase/supabase-js';

// Use service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Company {
  id: number;
  nama_perusahaan: string;
  email: string;
}

const EmailBlastContainer = styled.div`
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

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px 20px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const EmailForm = styled.form`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormGroupFull = styled(FormGroup)`
  grid-column: 1 / -1;
`;

const Label = styled.label`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
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

const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  color: #fff;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  min-height: 120px;
  resize: vertical;
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

const EmailEditor = styled(TextArea)`
  min-height: 300px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PreviewButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 14px 24px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #357abd 0%, #2a5f91 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(74, 144, 226, 0.4);
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

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: rgba(74, 144, 226, 0.1);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`;

const StatNumber = styled.div`
  color: #4a90e2;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 500;
`;

const CompaniesSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 30px;
  max-width: 1200px;
  margin: 30px auto 0 auto;
`;

const SectionTitle = styled.h2`
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TableContainer = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: rgba(74, 144, 226, 0.1);
`;

const TableHeaderCell = styled.th`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(74, 144, 226, 0.05);
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const TableCell = styled.td`
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  padding: 16px 20px;
`;

const EmailCell = styled(TableCell)`
  color: #4a90e2;
  cursor: pointer;
  
  &:hover {
    color: #357abd;
    text-decoration: underline;
  }
`;

const NoDataMessage = styled.div`
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 40px 20px;
  font-style: italic;
`;

const RefreshButton = styled.button`
  background: rgba(74, 144, 226, 0.2);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 8px;
  padding: 8px 16px;
  color: #4a90e2;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: auto;

  &:hover {
    background: rgba(74, 144, 226, 0.3);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function EmailBlastPage() {
  const [subject, setSubject] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('LAPIS Team');
  const [emailContent, setEmailContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const router = useRouter();

  // Fetch companies data from Supabase
  const fetchCompanies = async () => {
    setIsLoadingCompanies(true);
    try {
      console.log('Fetching companies data...');
      const { data, error } = await supabaseAdmin
        .from('companies')
        .select('*')
        .order('nama_perusahaan', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        // Show error to user
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load companies data',
          icon: 'error',
          confirmButtonColor: '#4a90e2',
          background: '#2d2d2d',
          color: '#fff',
        });
      } else {
        console.log('Companies data:', data);
        setCompanies(data || []);
      }
    } catch (error) {
      console.error('Fetch companies error:', error);
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  // Load companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleBack = () => {
    router.push('/admin/dashboard');
  };

  const handleEmailClick = (email: string) => {
    setRecipientEmail(email);
    // Scroll to form
    document.querySelector('#recipientEmail')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };

  const handlePreview = () => {
    if (!subject || !emailContent) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please fill in subject and email content to preview',
        icon: 'warning',
        confirmButtonColor: '#4a90e2',
        background: '#2d2d2d',
        color: '#fff',
      });
      return;
    }

    Swal.fire({
      title: 'Email Preview',
      html: `
        <div style="text-align: left; color: #333;">
          <p><strong>From:</strong> ${senderName}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="margin: 15px 0;">
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
            ${emailContent.replace(/\n/g, '<br>')}
          </div>
        </div>
      `,
      confirmButtonColor: '#4a90e2',
      background: '#2d2d2d',
      color: '#fff',
      width: '600px',
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!subject || !recipientEmail || !emailContent) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please fill in all required fields',
        icon: 'error',
        confirmButtonColor: '#4a90e2',
        background: '#2d2d2d',
        color: '#fff',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: recipientEmail,
          subject,
          content: emailContent,
          senderName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: 'Email Sent!',
          text: 'Your email has been sent successfully',
          icon: 'success',
          confirmButtonColor: '#4a90e2',
          background: '#2d2d2d',
          color: '#fff',
        });
        
        // Reset form
        setSubject('');
        setRecipientEmail('');
        setEmailContent('');
      } else {
        Swal.fire({
          title: 'Failed to Send',
          text: data.error || 'Something went wrong',
          icon: 'error',
          confirmButtonColor: '#4a90e2',
          background: '#2d2d2d',
          color: '#fff',
        });
      }
    } catch (error) {
      console.error('Email send error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while sending email',
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
    <EmailBlastContainer>
      <Header>
        <Title>📧 Email Blast</Title>
        <BackButton onClick={handleBack}>
          ← Back to Dashboard
        </BackButton>
      </Header>

      <StatsRow>
        <StatCard>
          <StatNumber>0</StatNumber>
          <StatLabel>Emails Sent Today</StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber>0</StatNumber>
          <StatLabel>Total Recipients</StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber>0%</StatNumber>
          <StatLabel>Open Rate</StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber>0%</StatNumber>
          <StatLabel>Click Rate</StatLabel>
        </StatCard>
      </StatsRow>

      <EmailForm onSubmit={handleSubmit}>
        <FormGrid>
          <FormGroup>
            <Label htmlFor="senderName">Sender Name</Label>
            <Input
              type="text"
              id="senderName"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Your name or company"
              disabled={isLoading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="recipientEmail">Recipient Email *</Label>
            <Input
              type="email"
              id="recipientEmail"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="recipient@example.com"
              required
              disabled={isLoading}
            />
          </FormGroup>
        </FormGrid>

        <FormGroupFull>
          <Label htmlFor="subject">Email Subject *</Label>
          <Input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter your email subject"
            required
            disabled={isLoading}
          />
        </FormGroupFull>

        <FormGroupFull>
          <Label htmlFor="emailContent">Email Content *</Label>
          <EmailEditor
            id="emailContent"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            placeholder="Write your email content here..."
            required
            disabled={isLoading}
          />
        </FormGroupFull>

        <ButtonGroup>
          <PreviewButton type="button" onClick={handlePreview} disabled={isLoading}>
            👁️ Preview Email
          </PreviewButton>
          
          <SendButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <LoadingContainer>
                <LoadingSpinner />
                Sending...
              </LoadingContainer>
            ) : (
              '📤 Send Email'
            )}
          </SendButton>
        </ButtonGroup>
      </EmailForm>

      {/* Companies Table */}
      <CompaniesSection>
        <SectionTitle>
          🏢 Companies Database
          <RefreshButton 
            onClick={fetchCompanies} 
            disabled={isLoadingCompanies}
          >
            {isLoadingCompanies ? '⟳' : '↻'} Refresh
          </RefreshButton>
        </SectionTitle>

        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>No</TableHeaderCell>
                <TableHeaderCell>Nama Usaha</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {isLoadingCompanies ? (
                <tr>
                  <TableCell colSpan={4}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <LoadingSpinner />
                      Loading companies...
                    </div>
                  </TableCell>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <TableCell colSpan={4}>
                    <NoDataMessage>
                      No companies found. Create a "companies" table in Supabase with "nama_perusahaan" and "email" fields.
                    </NoDataMessage>
                  </TableCell>
                </tr>
              ) : (
                companies.map((company, index) => (
                  <TableRow key={company.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{company.nama_perusahaan}</TableCell>
                    <EmailCell onClick={() => handleEmailClick(company.email)}>
                      {company.email}
                    </EmailCell>
                    <TableCell>
                      <PreviewButton
                        type="button"
                        onClick={() => handleEmailClick(company.email)}
                        style={{ 
                          padding: '6px 12px', 
                          fontSize: '12px',
                          background: 'rgba(74, 144, 226, 0.2)',
                          border: '1px solid rgba(74, 144, 226, 0.3)'
                        }}
                      >
                        Select
                      </PreviewButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {companies.length > 0 && (
          <div style={{ 
            marginTop: '16px', 
            color: 'rgba(255, 255, 255, 0.6)', 
            fontSize: '14px',
            textAlign: 'center'
          }}>
            Total: {companies.length} companies • Click email to auto-fill recipient field
          </div>
        )}
      </CompaniesSection>
    </EmailBlastContainer>
  );
}
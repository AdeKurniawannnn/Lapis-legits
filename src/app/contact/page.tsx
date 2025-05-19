'use client';
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import { supabase } from '@/lib/supabase';
import Swal from 'sweetalert2';

const Container = styled.div`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem 2rem 1rem;
  background: #111111;
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #fff;
`;

const Description = styled(motion.p)`
  font-size: 1.2rem;
  color: #bdbdbd;
  margin-bottom: 2.5rem;
  text-align: center;
  max-width: 500px;
`;

const Form = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  background: #181818;
  padding: 2rem 2.5rem;
  border-radius: 1.2rem;
  box-shadow: 0 4px 32px rgba(34,34,59,0.08);
  min-width: 320px;
  max-width: 400px;
  width: 100%;
`;

const Input = styled.input`
  padding: 0.9rem 1rem;
  border: 1px solid #333;
  background: #222;
  color: #fff;
  border-radius: 0.7rem;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border-color: #fff;
  }
`;

const Textarea = styled.textarea`
  padding: 0.9rem 1rem;
  border: 1px solid #333;
  background: #222;
  color: #fff;
  border-radius: 0.7rem;
  font-size: 1rem;
  min-height: 100px;
  outline: none;
  resize: vertical;
  transition: border 0.2s;
  &:focus {
    border-color: #fff;
  }
`;

const Button = styled(motion.button)`
  background: linear-gradient(90deg, #22223b 60%, #4a4e69 100%);
  color: #fff;
  font-weight: 700;
  padding: 0.9rem 0;
  border: none;
  border-radius: 0.7rem;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(34,34,59,0.08);
  transition: background 0.2s;
  &:hover {
    background: linear-gradient(90deg, #4a4e69 60%, #22223b 100%);
  }
`;

const InfoBox = styled(motion.div)`
  margin-top: 2.5rem;
  background: #181818;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(34,34,59,0.07);
  padding: 1.5rem 2rem;
  text-align: center;
  color: #fff;
  font-size: 1.05rem;
`;

export default function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const { error } = await supabase
        .from('Contact_Midas_Website') // pakai nama tabel persis
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.message,
            created_at: new Date().toISOString()
          }
        ]);
  
      if (error) throw error;
  
      Swal.fire({
        icon: 'success',
        title: '<span style="color:#fff;">Success!</span>',
        html: '<p style="color:#ccc; font-size: 1rem;">Thank you! Your message has been sent.</p>',
        background: '#1a1a1a',
        confirmButtonColor: '#8f5fff',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'dark-swal',
        }
      });      
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: '<span style="color:#fff;">Failed!</span>',
        html: '<p style="color:#ccc; font-size: 1rem;">Sorry, something went wrong. Please try again.</p>',
        background: '#1a1a1a',
        confirmButtonColor: '#8f5fff',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'dark-swal',
        }
      });      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Sidebar isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <Header />
      <Container>
        <Title initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          Work With Us
        </Title>
        <Description initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.7 }}>
          Have a project in mind, a creative idea, or looking to collaborate? Fill out the form below or contact us directly. We'll get back to you as soon as possible!
        </Description>
        <Form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          onSubmit={handleSubmit}
        >
          <Input 
            type="text" 
            name="name" 
            placeholder="Your Name" 
            required 
            value={formData.name}
            onChange={handleChange}
          />
          <Input 
            type="email" 
            name="email" 
            placeholder="Email" 
            required 
            value={formData.email}
            onChange={handleChange}
          />
          <Textarea 
            name="message" 
            placeholder="Your Message" 
            required 
            value={formData.message}
            onChange={handleChange}
          />
          <Button 
            type="submit" 
            whileTap={{ scale: 0.97 }}
            disabled={isLoading}
          >
            {isLoading ? 'Mengirim...' : 'Send Message'}
          </Button>
        </Form>
        <InfoBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }}>
          <div><b>Email:</b> lapisvisualsinfo@gmail.com</div>
        </InfoBox>
      </Container>
      <Footer />
    </>
  );
} 
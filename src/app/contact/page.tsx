'use client';
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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
  return (
    <>
      <Header />
      <Container>
        <Title initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          Hubungi Kami
        </Title>
        <Description initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.7 }}>
          Ada pertanyaan, ide proyek, atau ingin bekerja sama? Silakan isi form di bawah ini atau hubungi kami langsung. Kami akan membalas secepat mungkin!
        </Description>
        <Form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          onSubmit={e => { e.preventDefault(); alert('Terima kasih! Pesan Anda telah dikirim.'); }}
        >
          <Input type="text" name="name" placeholder="Nama Anda" required />
          <Input type="email" name="email" placeholder="Email" required />
          <Textarea name="message" placeholder="Pesan Anda" required />
          <Button type="submit" whileTap={{ scale: 0.97 }}>Kirim Pesan</Button>
        </Form>
        <InfoBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }}>
          <div><b>Email:</b> info@lapisvisuals.com</div>
          <div><b>Telepon:</b> +62 812-3456-7890</div>
          <div><b>Alamat:</b> Jl. Contoh No. 123, Jakarta</div>
        </InfoBox>
      </Container>
      <Footer />
    </>
  );
} 
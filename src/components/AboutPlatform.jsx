import React from 'react';
import { motion } from 'framer-motion';

const AboutPlatform = () => {
  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
      <motion.h1 
        className="text-5xl font-extrabold text-center text-gray-800 mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        About Us
      </motion.h1>
      <motion.p 
        className="text-lg text-gray-700 leading-relaxed text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Welcome to our platform, where learning is accessible, engaging, and tailored to your needs. Our mission is to create a world where knowledge is shared freely and easily, allowing you to unlock new skills and opportunities.
      </motion.p>

      <div className="flex flex-col lg:flex-row justify-between items-center mt-8">
        <motion.div 
          className="lg:w-1/2 mb-6 lg:mb-0 p-4"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Our Vision</h2>
          <p className="text-gray-600 text-lg">
            We believe that education is the key to a brighter future. By offering a diverse range of courses, we aim to empower individuals to achieve their personal and professional goals.
          </p>
        </motion.div>
        
        <motion.div 
          className="lg:w-1/2 p-4"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Our Commitment</h2>
          <p className="text-gray-600 text-lg">
            We are dedicated to providing high-quality, up-to-date courses that cater to different learning styles. Whether you're looking to advance your career or explore a new hobby, we have something for you.
          </p>
        </motion.div>
      </div>

      <motion.div 
        className="mt-12 text-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h3 className="text-3xl font-semibold text-gray-800 mb-4">Join us and start learning today!</h3>
        <p className="text-gray-600 text-lg">
          Whether you're an individual looking to grow or a company seeking to upskill your employees, we offer courses that fit your needs. Together, let's build a community of lifelong learners.
        </p>
      </motion.div>
    </div>
  );
};

export default AboutPlatform;

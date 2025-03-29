import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Float, OrbitControls, PerspectiveCamera, Stats, useGLTF } from '@react-three/drei';
import Navbar from './navbar';

const FrontPage = () => {
  const { scene } = useGLTF("hammer.glb");

  return (
    <div style={{ 
      height: '100vh', 
      background: 'linear-gradient(135deg, #121212, #2c3e50)', // Gradient background for depth
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      {/* Navbar */}
      <Navbar/>
  
      {/* Content */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
        {/* Hero Body Text */}
        <div style={{ flex: 1, color: 'white', paddingRight: '2rem', marginTop: '-5%', marginLeft: '5%', animation: 'fadeIn 1s ease-out' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1rem', color: "#ecf0f1", animation: 'slideInLeft 1s ease-out' }}>
            Welcome to Car Damage Report Generation
          </h1>
          <p style={{ fontSize: '2rem', lineHeight: '1.6', marginBottom: '1rem', color: "#ecf0f1", animation: 'slideInLeft 1s ease-out' }}>
            Explore a unique 3D showcase of tools and models. This hammer model is just the beginning of a collection
            designed to inspire creators, builders, and designers.
          </p>
          <button style={{
            padding: '1rem 2rem',
            backgroundColor: '#f39c12',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.2rem',
            transition: 'background-color 0.3s ease, transform 0.3s ease',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            animation: 'fadeIn 1.5s ease-out',
          }}
          onMouseEnter={(e) => { 
            e.target.style.backgroundColor = '#e67e22'; 
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => { 
            e.target.style.backgroundColor = '#f39c12'; 
            e.target.style.transform = 'scale(1)';
          }}>
            Try Now!
          </button>
        </div>

     
        {/* 3D Canvas */}
        <div style={{ width: '50%', height: '100%' }}>
          <Canvas style={{ width: '100%', height: '100%', background: 'transparent' }}>
            <ambientLight intensity={1} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight intensity={2} />
            <Float>        
              <primitive object={scene} rotation={[Math.PI / 2, 0, 0]} />
            </Float>
            <PerspectiveCamera makeDefault position={[0, 0, 3]} />
            <OrbitControls enableRotate enableZoom={false} rotateSpeed={2} />
            <Stats />
          </Canvas>
        </div>
      </div>

      {/* CSS for animations */}
      <style>
        {`
          @keyframes slideInLeft {
            0% { transform: translateX(-100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }

          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default FrontPage;

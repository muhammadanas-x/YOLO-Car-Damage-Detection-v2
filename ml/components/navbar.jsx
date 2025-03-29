// Navbar.js
import React from 'react';

const Navbar = () => (
  <nav
    style={{
      height: '10%',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      color: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    }}
  >
    <h1
      style={{
        fontSize: '1.8rem',
        fontWeight: 'bold',
        margin: 0,
        color: '#f39c12',
        position: 'absolute',
        left: '2rem',
      }}
    >
      CrashSentry
    </h1>
    <ul
      style={{
        display: 'flex',
        listStyle: 'none',
        gap: '3rem',
        margin: 0,
        padding: 0,
        justifyContent: 'center',
        flex: 1,
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      <a
        href='./'
        style={{
          cursor: 'pointer',
          fontSize: '1.1rem',
          color: 'white',
          transition: 'color 0.3s ease, transform 0.3s ease, opacity 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.color = '#f39c12';
          e.target.style.transform = 'scale(1.1)';
          e.target.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.target.style.color = 'white';
          e.target.style.transform = 'scale(1)';
          e.target.style.opacity = '0.9';
        }}
      >
        Home
      </a>
      <a
        style={{
          cursor: 'pointer',
          fontSize: '1.1rem',
          color: 'white',
          transition: 'color 0.3s ease, transform 0.3s ease, opacity 0.3s ease',
        }}
        href="/experiment"
        onMouseEnter={(e) => {
          e.target.style.color = '#f39c12';
          e.target.style.transform = 'scale(1.1)';
          e.target.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.target.style.color = 'white';
          e.target.style.transform = 'scale(1)';
          e.target.style.opacity = '0.9';
        }}
      >
        Experiment
      </a>
      <a
        href='/3Dexperiment'
        style={{
          cursor: 'pointer',
          fontSize: '1.1rem',
          color: 'white',
          transition: 'color 0.3s ease, transform 0.3s ease, opacity 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.color = '#f39c12';
          e.target.style.transform = 'scale(1.1)';
          e.target.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.target.style.color = 'white';
          e.target.style.transform = 'scale(1)';
          e.target.style.opacity = '0.9';
        }}
      >
        3D Experiment Visualization
      </a>
    </ul>
  </nav>
);

export default Navbar;
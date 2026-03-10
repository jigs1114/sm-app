// app/login/page.tsx
'use client';
import LoginForm from '@/app/components/LoginForm';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.shiftKey && e.key === 'C') || (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handlePasswordSubmit = () => {
    const correctPassword = 'urPassword';
    
    if (password !== correctPassword) {
      window.location.href = '';
    } else {
      setShowPassword(true);
    }
  };

  if (showPassword) {
    return <LoginForm />;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-lg"
        onContextMenu={(e) => {
          e.preventDefault();
          return false;
        }}
      >
        <h2 className="text-xl font-bold mb-4">Password Required</h2>
        <p className="text-gray-700 mb-4">
          Please enter the password to enter this page:
        </p>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handlePasswordSubmit();
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            return false;
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <button
          onClick={handlePasswordSubmit}
          onContextMenu={(e) => {
            e.preventDefault();
            return false;
          }}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

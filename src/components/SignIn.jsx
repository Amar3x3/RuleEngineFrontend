import React, { useState } from 'react';
import axios from 'axios';

const SignIn = ({ setUserEmail }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://ruleenginebackend-1qwp.onrender.com/api/rule/signin', null, {
        params: { email }
      });

      // Set the user email in the parent state
      setUserEmail(email);
      setError('');
      console.log(response.data);  // Optional: Handle successful sign-in response
    } catch (err) {
      setError('Sign in failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Sign In / Log in</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SignIn;

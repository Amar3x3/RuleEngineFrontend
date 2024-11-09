import React, { useState } from 'react';
import axios from 'axios';

const SignIn = ({ setUserEmail }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    console.log("sign")
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/rule/signin`, null, {
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

    <div className='bg-gradient-to-r from-rose-100 to-teal-100 flex justify-center align-middle min-h-full min-w-full outer-cont-full'>
      <img src="" alt="" />

      <div class="flex flex-col justify-center px-6 py-12 lg:px-8 sign-in-container shadow-2xl">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <p className='mt-10 text-center text-xl font-bold leading-9 tracking-tight  font-sans ...'>Backend is on free tier so it might take time usually 30 seconds to respond, please be patient</p>
          <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-sky-500  font-sans ...">Sign in to your account</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          
            <div>

              <form onSubmit={handleSignIn}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                
              </form>
            </div>

            <div>
              
            </div>
          


        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SignIn;

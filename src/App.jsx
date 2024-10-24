import React, { useState } from 'react';
import SignIn from './components/SignIn';
import RuleSidebar from './components/RuleSidebar';

function App() {
  const [userEmail, setUserEmail] = useState('');

  return (
    <div className="App">
      {userEmail ? (
        <RuleSidebar userEmail={userEmail} />
      ) : (
        <SignIn setUserEmail={setUserEmail} />
      )}
    </div>
  );
}

export default App;

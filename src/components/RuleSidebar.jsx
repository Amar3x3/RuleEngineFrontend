import React, { useState, useEffect } from 'react';
import axios from 'axios';
import deleteImg from '../assets/delete.png';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';

const RuleSidebar = ({ userEmail }) => {
  const [rules, setRules] = useState([]);
  const [rule, setRule] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userDataJson, setUserDataJson] = useState('');
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [ast, setAst] = useState(null);  // AST is initialized as null

  // Fetch rules when the userEmail changes
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get('https://ruleenginebackend-1qwp.onrender.com/api/rule/getAll', {
          params: { email: userEmail }
        });
        setRules(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch rules.');
        setSuccess('')
        setTimeout(() => {
          setError('');
        }, 3000);
        
        console.error(err);
      }
    };

    if (userEmail) {
      fetchRules();
    }
  }, [userEmail, rules, rule, ast, userDataJson]);

  const evaluateRule = async () => {
    try {
      // Parse userDataJson string into a JavaScript object
      const parsedUserData = JSON.parse(userDataJson);

      // Make POST request to backend for rule evaluation
      const res = await axios.post('https://ruleenginebackend-1qwp.onrender.com/api/rule/evaluate',
        {
          rule: rule,             // Send rule string
          userData: parsedUserData // Send parsed user data as an object
        },
        {
          params: { email: userEmail },  // Send email as query parameter
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Get the evaluation result from the response
      setEvaluationResult(res.data.result);
      setAst(res.data.ast);
      setSuccess('Rule Evaluated Succesfully')
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
      // Set AST from response
      console.log(res.data.ast.__proto__)
      setError('');
    } catch (err) {
      if (err instanceof SyntaxError) {
        setSuccess('')
        setError('Invalid JSON format in the user data.');
        setTimeout(() => {
          setError('');
        }, 7000);
      } else {
        setSuccess('')
        setError('Failed to evaluate the rule.');
        setTimeout(() => {
          setError('');
        }, 7000);
      }
      console.error(err);
    }
  };

  const addRule = async () => {
    try {
      const res = await axios.post('https://ruleenginebackend-1qwp.onrender.com/api/rule',
        {
          rule: rule,
        },
        {
          params: { email: userEmail }, // Include email in query params
          headers: {
            'Content-Type': 'application/json'
          }
        });

      // Update rule list after adding a new rule
      setRules([...rules, { ruleString: rule }]);
      setAst(res);
     
      setRule(''); // Reset input field
      setError('');
      setSuccess('Rule Added Succesfully')

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to add rule.');
      setTimeout(() => {
        setError('');
      }, 3000);
      setSuccess('');
      console.error(err);
    }
  };

  const deleteRule = async (ruleId) => {
    try {
      await axios.delete(`https://ruleenginebackend-1qwp.onrender.com/api/rule/${ruleId}`, {
        params: { email: userEmail }
      });

      // Update rule list after deleting
      setRules(rules.filter((rule) => rule.id !== ruleId));
      setError('');
    } catch (err) {
      setError('Failed to delete rule.');
      console.error(err);
    }
  };

  const addRuleToEvaluation = (ruleString) => {
    setRule(ruleString);
  };

  return (
    <>
      

      <div className="sidebar bg-gradient-to-r from-rose-100 to-teal-100 outer-cont-full">

      <div className="abs-top-alerts">
      {error ? <div class="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
        <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span class="sr-only">Info</span>
        <div>
          {error}
        </div>
      </div> : ''}
     
     {success ?  <div class="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800" role="alert">
        <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span class="sr-only">Info</span>
        <div>
         {success}
        </div>
      </div> : ''}
      </div>

        <div className='rules-cont'>
          <h2 className='font-sans ... text-3xl font-bold'>Your Rules</h2>
          <table class="pure-table shadow-2xl">
            <thead>
              <tr>
                <th class="border border-slate-300 ... font-sans ...">Rule</th>
                <th class="border border-slate-300 ... font-sans ...">Delete</th>
                <th class="border border-slate-300 ... font-sans ...">Evaluate</th>

              </tr>
            </thead>

            {rules.length === 0 ? (
              <p>No rules found.</p>
            ) : (
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id}>
                    <td className='font-sans ...'> {rule.ruleString}</td>
                    <td className='font-sans ...'>
                      <div>
                        <button className='btn delete text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800' onClick={() => deleteRule(rule.id)}>
                          <img src={deleteImg} alt="Delete" />
                        </button>
                      </div>
                    </td>
                    <td className='font-sans ...'>
                      <div>
                        <button onClick={() => addRuleToEvaluation(rule.ruleString)} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                          Evaluate
                          <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                          </svg>
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}


          </table>

          <div>
            <h3 className='font-sans ... text-3xl font-bold'>Add New Rule</h3>
            <input
              type="text"
              placeholder={`${rule ? rule : 'Enter new rule'}`}
              value={rule}
              onChange={(e) => setRule(e.target.value)}
              className='font-sans ..."'
            />
            <button className=' text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800' onClick={addRule}>Add Rule</button>
          </div>

          <div className="evaluate-container">
            <div>
              <h3 className='font-sans ... text-3xl font-bold'>User Data (as JSON)</h3>
              <textarea
                placeholder='Enter user data in JSON format (e.g., {"age": 32, "department": "Sales"})'
                value={userDataJson}
                onChange={(e) => setUserDataJson(e.target.value)}
                rows="6"
                style={{ width: '100%' }}
                className='font-sans ... flex align-middle justify-center p-8'
              />
            </div>

            {/* Button to evaluate the rule */}
            <button className=' text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800' onClick={evaluateRule}>Evaluate Rule</button>

            {/* Show evaluation result */}
            {evaluationResult !== null && (
              <div>
                <h4>Evaluation Result: {evaluationResult ? 'True' : 'False'}</h4>
              </div>
            )}
          </div>

        </div>

        {/* Display the AST in a readable format */}
        <div className="ast-container shadow-2xl">
          <h3 className='font-sans ... text-3xl font-bold m-3'>Abstract Syntax Tree (AST)</h3>
          {ast ? (
            
              
  < JSONPretty data={ast}></JSONPretty> 
  // <JSONViewer json={ast} />
               // Pretty print AST with 2-space indentation
          ) : (
            <p>No AST available</p>
          )}
        </div>

      </div>
    </>
  );
};

export default RuleSidebar;

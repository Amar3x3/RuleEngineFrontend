import React, { useState, useEffect } from 'react';
import axios from 'axios';
import deleteImg from '../assets/delete.png';
import '../index.css';

const RuleSidebar = ({ userEmail }) => {
  const [rules, setRules] = useState([]);
  const [rule, setRule] = useState('');
  const [error, setError] = useState('');
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
      } catch (err) {
        setError('Failed to fetch rules.');
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
        // Set AST from response
        console.log(res.data.ast.__proto__)
      setError('');
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format in the user data.');
      } else {
        setError('Failed to evaluate the rule.');
      }
      console.error(err);
    }
  };

  const addRule = async () => {
    try {
      const res = await axios.post('https://ruleenginebackend-1qwp.onrender.com/api/rule/', 
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
    } catch (err) {
      setError('Failed to add rule.');
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
    <div className="sidebar">
      <h2>Your Rules</h2>
      {rules.length === 0 ? (
        <p>No rules found.</p>
      ) : (
        <ul>
          {rules.map((rule) => (
            <li key={rule.id}>
              {rule.ruleString}
              <button className='btn delete' onClick={() => deleteRule(rule.id)}>
                <img src={deleteImg} alt="Delete" />
              </button>
              <button className='btn check' onClick={() => addRuleToEvaluation(rule.ruleString)}>Evaluate</button>
            </li>
          ))}
        </ul>
      )}
      <div>
        <h3>Add New Rule</h3>
        <input
          type="text"
          placeholder={`${rule ? rule : 'Enter new rule'}`}
          value={rule}
          onChange={(e) => setRule(e.target.value)}
        />
        <button onClick={addRule}>Add Rule</button>
      </div>

      <div className="evaluate-container">
        <div>
          <h3>User Data (as JSON)</h3>
          <textarea
            placeholder='Enter user data in JSON format (e.g., {"age": 32, "department": "Sales"})'
            value={userDataJson}
            onChange={(e) => setUserDataJson(e.target.value)}
            rows="6"
            style={{ width: '100%' }}
          />
        </div>

        {/* Button to evaluate the rule */}
        <button onClick={evaluateRule}>Evaluate Rule</button>

        {/* Show evaluation result */}
        {evaluationResult !== null && (
          <div>
            <h4>Evaluation Result: {evaluationResult ? 'True' : 'False'}</h4>
          </div>
        )}
      </div>

      {/* Display the AST in a readable format */}
      <div className="ast-container">
        <h3>Abstract Syntax Tree (AST)</h3>
        {ast ? (
          <pre>{JSON.stringify(ast, null, 2)}</pre>  // Pretty print AST with 2-space indentation
        ) : (
          <p>No AST available</p>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default RuleSidebar;

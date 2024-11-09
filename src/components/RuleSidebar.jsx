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
  const [combinedResult, setCombinedResult] = useState(null);
  const [selectedRules, setSelectedRules] = useState([]);
  const [ast, setAst] = useState(null);
  const [combineOperator, setCombineOperator] = useState('AND');


  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/rule/getAll`, {
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
  }, [userEmail, rules, rule, ast, userDataJson, combineOperator, selectedRules]);

  const evaluateRule = async () => {
    try {

      const parsedUserData = JSON.parse(userDataJson);

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/rule/evaluate`,
        {
          rule: rule,
          userData: parsedUserData
        },
        {
          params: { email: userEmail },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setEvaluationResult(res.data.result);
      setCombinedResult('');
      setAst(res.data.ast);
      alert("Rule Evaluated Succesfully");
      setTimeout(() => {
        setSuccess('');
      }, 3000);


      console.log(res.data.ast.__proto__)
      setError('');
    } catch (err) {
      if (err instanceof SyntaxError) {

        setError('Invalid JSON format in the user data.');
        alert('Invalid JSON format in the user data.')

      } else {

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
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/rule`,
        {
          rule: rule,
        },
        {
          params: { email: userEmail },
          headers: {
            'Content-Type': 'application/json'
          }
        });


      setRules([...rules, { ruleString: rule }]);
      setAst(res.data);

      setRule('');
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
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/rule/${ruleId}`, {
        params: { email: userEmail }
      });


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


  const toggleRuleSelection = (ruleId) => {
    setSelectedRules((prevSelectedRules) =>
      prevSelectedRules.includes(ruleId)
        ? prevSelectedRules.filter((id) => id !== ruleId)
        : [...prevSelectedRules, ruleId]
    );
  };


  const combineRules = async () => {
    try {
      const selectedRuleStrings = rules
        .filter((rule) => selectedRules.includes(rule.id))
        .map((rule) => rule.ruleString);

      if (!userDataJson) alert("fill the user data too for evaluation")
      const parsedUserData = JSON.parse(userDataJson);

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/rule/combine`, {
        rules: selectedRuleStrings,
        userData: parsedUserData,
        operator:combineOperator
      });

      setCombinedResult(response.data.result);
      setAst(response.data.ast)
      alert("Rules Combined and Evaluated Succesfully")
      setError('');
      setEvaluationResult('')
    } catch (err) {
      setError('Failed to combine or evaluate rules.');
      console.error(err);
    }
  };

  return (
    <>


      <div className="sidebar bg-gradient-to-r from-rose-100 to-teal-100 outer-cont-full">



        <div className='rules-cont'>
          <h2 className='font-sans ... text-3xl font-bold'>Your Rules</h2>
          <table class="pure-table shadow-2xl">
            <thead>
              <tr>
                <th class="border border-slate-300 ... font-sans ...">Rule</th>
                <th class="border border-slate-300 ... font-sans ...">Delete</th>
                <th class="border border-slate-300 ... font-sans ...">Evaluate</th>
                <th class="border border-slate-300 ... font-sans ...">Selected</th>
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

                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRules.includes(rule.id)}
                        onChange={() => toggleRuleSelection(rule.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            )}


          </table>

          <div>
            <h3 className='font-sans ... text-3xl font-bold'> Rule </h3>
            <input
              type="text"
              placeholder={`${rule ? rule : "Enter new rule      e.g. (age > 22 AND gender = 'Male') "}`}
              value={rule}
              onChange={(e) => setRule(e.target.value)}
              className='font-sans ..."'
            />
            <button className=' text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800' onClick={addRule}>Add Rule</button>
          </div>

          <div className="evaluate-container ">
            <div className='userdata-container'>
              <h3 className='font-sans ... text-3xl font-bold'>User Data (as JSON)</h3>
              <textarea
                placeholder='Enter user data in JSON format (e.g., {"age": 32, "department": "Sales"})'
                value={userDataJson}
                onChange={(e) => setUserDataJson(e.target.value)}
                rows="6"
                style={{ width: '100%' }}
                className='font-sans ... flex align-middle justify-center p-8 shadow-2xl'
              />
              {evaluationResult !== null && (
                <div className='abs-result-cont'>
                  <h4>{evaluationResult ? <div className='result-true'>True</div> : <div className='result-false'>False</div>}</h4>
                </div>
              )}
              {combinedResult !== null && (
                <div className='abs-result-cont'>
                  <h4> {combinedResult ? <div className='result-true'>True</div> : <div className='result-false'>False</div>}</h4>
                </div>
              )}

            </div>


            <button className='mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800' onClick={evaluateRule}>Evaluate Rule</button>

            <button
              className='mt-2 ml-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              onClick={combineRules}>Combine and Evaluate Selected Rules</button>

            
              <label>Select Combine Operator</label>
              <select value={combineOperator} onChange={(e) => setCombineOperator(e.target.value)}>
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            



          </div>

        </div>

        {/* AST in a readable format */}
        <div className="ast-container shadow-2xl">
          <h3 className='font-sans ... text-3xl font-bold m-3'>Abstract Syntax Tree (AST)</h3>
          {ast ? (


            < JSONPretty data={ast}></JSONPretty>

          ) : (
            <p>No AST available</p>
          )}
        </div>

      </div>
    </>
  );
};

export default RuleSidebar;

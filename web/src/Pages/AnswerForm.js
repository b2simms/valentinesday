import './AnswerForm.css';
import React, { useState, useEffect } from 'react';
import { Button, Link, TextField } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
// import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FuzzySet from 'fuzzyset.js';
import CircularIntegration from './CircleIntegration';

function AnswerForm() {

  const [completedCount, setCompletedCount] = useState(0);
  const [answers, setAnswers] = useState({});


  const item = {
    type: "vpn",
    link: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/AWS_Simple_Icons_Virtual_Private_Cloud.svg/1280px-AWS_Simple_Icons_Virtual_Private_Cloud.svg.png",
    text: "See the AWS private virtual cloud.",
    // individual, group (add groupId to answers to validation them together)
    validationBy: "individual",
    answers: [
      {
        label: "Host Identify",
        value: "cloud",
        validationType: "strict"
      },
      {
        label: "Test Identify",
        value: "test"
      },
      {
        label: "Host person",
        value: "mandell"
      }
    ]
  };

  useEffect(() => {
    console.log('run ONCE.');
  }, []);

  const checkAnswer = (expected, key) => {
    console.log(`checkAnswer`);
    const actual = answers[key];
    console.log(`actual: ${actual}`);
    console.log(`expected: ${expected}`);
    // fuzzy check
    const fs = FuzzySet([expected], false);
    const res = fs.get(actual);
    console.log(res);
    if (res && res[0] && res[0][0] > 0.70) {
      console.log('VALID');
    }
    // strip whitespace
  };


  const handleChange = (e, key) => {
    answers[key] = e.target.value;
    setAnswers(answers);
  };


  const renderInputs = pNodes => {
  }

  return (
    <div className="App">
      <h1>{item.type}</h1>
      <p>{item.text}</p>
      <p>
        <Link href={item.link} rel="noreferrer" target="_blank" underline="none">
          <Button color="info" style={{ backgroundColor: "orange" }} endIcon={<OpenInNewIcon />}>Puzzle Link</Button>
        </Link>
      </p>
      <div className='Answers'>
        {item && item.answers && item.answers.map((item, index) =>
          <div className='spacer' key={item.label + '_' + index}>
            <TextField
              required
              label={item.label}
              defaultValue=''
              onChange={(e) => handleChange(e, item.label + '_' + index)}
              placeholder={item.value}
            />
            <CircularIntegration></CircularIntegration>
            <Button color="warning" onClick={() => checkAnswer(item.value, item.label + '_' + index)}>Check</Button>
          </div>
        )}
      </div>
      <p>
        <CheckCircleOutlineIcon color="success" style={{ height: "100px", width: "100px" }}></CheckCircleOutlineIcon>
      </p>
    </div>
  );
}

export default AnswerForm;

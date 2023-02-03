import './AnswerForm.css';
import React, { useState, useEffect } from 'react';
import { Button, Link } from '@mui/material';
import ExtensionIcon from '@mui/icons-material/Extension';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { green } from '@mui/material/colors';
import FuzzySet from 'fuzzyset.js';
import AnswerField from './AnswerField';

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

  const handleClickShowPassword = () => {
    console.log('handleClickShowPassword');
  }

  const handleMouseDownPassword = () => {
    console.log('handleMouseDownPassword');
  }


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
      <p>Open the puzzle link and fill in the answer{item.answers.length > 1 && `s`} below.</p>
      <div className='Answers'>
        {item && item.answers && item.answers.map((item, index) =>
          <div className='spacer' key={item.label + '_' + index}>
            {/* <TextField
              required
              label={item.label}
              defaultValue=''
              onChange={(e) => handleChange(e, item.label + '_' + index)}
              placeholder={item.value}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            /> */}
            <AnswerField></AnswerField>
            <Button color="warning" onClick={() => checkAnswer(item.value, item.label + '_' + index)}>Check</Button>
          </div>
        )}
      </div>
      <p>
        <ExtensionIcon style={{ height: "100px", width: "100px", color: green[500] }}></ExtensionIcon>
      </p>
    </div>
  );
}

export default AnswerForm;

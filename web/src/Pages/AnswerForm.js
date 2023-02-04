import './AnswerForm.css';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Link } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { green, grey } from '@mui/material/colors';
import FuzzySet from 'fuzzyset.js';
import AnswerField from './AnswerField';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';

function AnswerForm() {

  const answerRef = useRef('');
  const [answers, setAnswers] = useState([]);
  const [allCorrect, setAllCorrect] = useState(false);

  const item = {
    type: "vpn",
    link: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/AWS_Simple_Icons_Virtual_Private_Cloud.svg/1280px-AWS_Simple_Icons_Virtual_Private_Cloud.svg.png",
    text: "See the AWS private virtual cloud.",
    // individual, group (add groupId to answers to validation them together)
    validationBy: "individual",
    answers: [
      {
        label: "Host Identify",
        value: "aaaa",
        validationType: "strict"
      },
      {
        label: "Test Identify",
        value: "-1"
      }
    ]
  };

  useEffect(() => {
    setAnswers(item?.answers?.map(i => false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    answerRef.current = answers;
  }, [answers]);

  const checkAnswer = (expected, inputActual, isStrict) => {
    const actual = inputActual?.trim() + '';
    if (!actual || actual.length === 0) {
      return false;
    }
    if (isStrict) {
      return expected === actual;
    }
    // fuzzy check
    const fs = FuzzySet([expected], false);
    const res = fs.get(actual);
    if (res && res[0] && res[0][0] > 0.70) {
      return true;
    }
    return false;
  };

  const notifyAnswer = (key, guess) => {
    const obj = item?.answers[key];
    // check that answer
    const res = checkAnswer(obj?.value, guess, obj?.validationType === 'strict');
    // create new array and use ref to get most current
    const newAnswers = [...answerRef.current];
    newAnswers[key] = res ? res : false;
    setAnswers(newAnswers);
    // set correct
    const isCorrect = newAnswers.reduce((r, acc) => r && acc, true);
    setAllCorrect(isCorrect)
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
            <AnswerField
              label={item.label}
              answerKey={index}
              notifyAnswer={notifyAnswer}
              correct={answers[index]}
            ></AnswerField>
          </div>
        )}
      </div>
      <p>
        {allCorrect ? <LockOpenIcon style={{ height: "100px", width: "100px", color: green[500] }} /> : <LockIcon style={{ height: "100px", width: "100px", color: grey[800] }} />}
      </p>
    </div>
  );
}

export default AnswerForm;

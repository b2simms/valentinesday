import './AnswerForm.css';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Link } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { green, grey } from '@mui/material/colors';
import FuzzySet from 'fuzzyset.js';
import AnswerField from './AnswerField';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function AnswerForm() {

  const answerRef = useRef('');
  const [puzzle, setPuzzle] = useState({});
  const [answers, setAnswers] = useState([]);
  const [allCorrect, setAllCorrect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const puzzleMapStr = localStorage.getItem('PUZZLE_PATH_JSON');
    if (!puzzleMapStr) {
      navigate('/');
      return;
    }
    const localCount = localStorage.getItem('PUZZLE_COMPLETED_COUNT');
    if (!localCount) {
      navigate('/');
      return;
    }
    // extract string
    const puzzleMap = JSON.parse(puzzleMapStr);
    let localCountNum = typeof localCount === 'string' ? parseInt(localCount) : localCount;
    setPuzzle(puzzleMap?.puzzles[localCountNum]);

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
    const obj = puzzle?.answers[key];
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

  const backButton = () => navigate('/');

  return (
    <div className="App">
      <div onClick={backButton}><ArrowBackIosIcon /></div>
      <h1>{puzzle.type}</h1>
      <p>{puzzle.text}</p>
      <p>
        <Link href={puzzle.link} rel="noreferrer" target="_blank" underline="none">
          <Button color="info" style={{ backgroundColor: "orange" }} endIcon={<OpenInNewIcon />}>Puzzle Link</Button>
        </Link>
      </p>
      <p>Open the puzzle link and fill in the answer{puzzle?.answers?.length > 1 && `s`} below.</p>
      <div className='Answers'>
        {puzzle?.answers?.map((item, index) =>
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

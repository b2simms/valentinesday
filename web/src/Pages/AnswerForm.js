import './AnswerForm.css';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Link } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { green, grey, red } from '@mui/material/colors';
import FuzzySet from 'fuzzyset.js';
import AnswerField from './AnswerField';
import SingleNumberField from './SingleNumberField';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CelebrationIcon from '@mui/icons-material/Celebration';
import Grid from '@mui/material/Grid';

const SINGLE_BOX_WIDTH_PX = 55;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  'flex-direction': 'column',
  'text-align': 'center',
};

function AnswerForm() {

  const guessRef = useRef('');
  const [puzzle, setPuzzle] = useState({});
  const [guesses, setGuesses] = useState([]);
  const [allCorrect, setAllCorrect] = useState(false);
  const [allGuessed, setAllGuesses] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

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
    setGuesses(puzzle?.answers?.map((i) => {
      return {
        guess: '',
        correct: false
      }
    }));
    if (puzzle?.answers?.length === 0) {
      setAllCorrect(true);
    }
  }, [puzzle]);

  useEffect(() => {
    guessRef.current = guesses;
  }, [guesses]);

  const onPuzzleCompleteClick = () => {
    let localCount = localStorage.getItem('PUZZLE_COMPLETED_COUNT');
    localCount = typeof localCount === 'string' ? parseInt(localCount) : localCount;
    localStorage.setItem('PUZZLE_COMPLETED_COUNT', localCount + 1);
    navigate('/');
  };

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
    const newGuesses = [...guessRef.current];
    newGuesses[key] = {
      guess,
      correct: res ? res : false
    }
    setGuesses(newGuesses);
    // set correct
    const isIncorrect = newGuesses.find(e => e.correct === false) ? true : false;
    setAllCorrect(!isIncorrect);
    // set guesses
    const isMissingGuess = newGuesses.find(e => e.guess === '') ? true : false;
    setAllGuesses(!isMissingGuess);
  }

  const renderAnswers = (answrs) => {
    if (!answrs || answrs.length === 0) {
      return ``;
    }
    const htmlAnswers = [];
    // render by type
    if (puzzle?.type === 'sudoku') {
      return <Grid container
        spacing={{ xs: 0, sm: 0, md: 0 }}
        columns={{ xs: 12, sm: 12, md: 12 }}
        style={{ margin: 'auto', width: `${3 * SINGLE_BOX_WIDTH_PX}px` }}>
        {answrs.map((_, index) => (
          <Grid item xs={4} sm={4} md={4} key={index}>
            <SingleNumberField
              answerKey={index}
              notifyAnswer={notifyAnswer}
              width={SINGLE_BOX_WIDTH_PX}
            />
          </Grid>
        ))}
      </Grid>
    } else {
      for (let i = 0; i < answrs.length; i++) {
        const item = answrs[i];
        htmlAnswers.push(
          <div className='spacer' key={item.label + '_' + i}>
            <AnswerField
              label={item.label}
              answerKey={i}
              notifyAnswer={notifyAnswer}
              correct={guesses && guesses[i]?.correct}
            />
          </div>);
      }
      return htmlAnswers;
    }
  }

  const renderCorrect = () => {
    if (allCorrect) {
      return <LockOpenIcon
        className='LockActiveGreen'
        onClick={openModal}
        style={{ height: "100px", width: "100px", color: green[500], cursor: 'pointer' }} />
    } else if (allGuessed) {
      return <LockIcon className='LockActiveRed' style={{ height: "100px", width: "100px", color: red[800] }} />
    } else {
      return <LockIcon style={{ height: "100px", width: "100px", color: grey[800] }} />
    }
  }

  const backButton = () => navigate('/');

  const jumpLink = puzzle?.link?.indexOf("http") === 0 ? puzzle.link : window.location.href.replace('/form', '') + puzzle.link;

  return (
    <div className="App">
      <Button onClick={backButton} style={{ cursor: 'pointer', margin: '24px', color: "#B51A3A" }}><ArrowBackIosIcon />Back</Button>
      <h1>{puzzle.type}</h1>
      <p>Open the puzzle link and follow the instructions below</p>
      <p>
        <Link href={jumpLink} rel="noreferrer" target="_blank" underline="none">
          <Button color="info" style={{ backgroundColor: "#B51A3A", color: 'white' }} endIcon={<OpenInNewIcon />}>Puzzle Link</Button>
        </Link>
      </p>
      <p>
        Instructions: {puzzle.text}
      </p>
      <div className='Answers'>
        {puzzle && renderAnswers(puzzle.answers)}
      </div>
      <p>
        {renderCorrect()}
      </p>
      <Modal
        open={open}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1>Puzzle Complete!!!</h1>
          <div>
            <CelebrationIcon color='primary' />
            <CelebrationIcon color='secondary' />
            <CelebrationIcon color='primary' />
            <CelebrationIcon color='secondary' />
            <CelebrationIcon color='primary' />
            <CelebrationIcon color='secondary' />
            <CelebrationIcon color='primary' />
            <CelebrationIcon color='secondary' />
          </div>
          <Button onClick={onPuzzleCompleteClick}>OK</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default AnswerForm;

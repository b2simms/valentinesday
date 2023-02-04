import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import { green, red } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function AnswerField({
    label,
    answerKey,
    notifyAnswer,
    correct
}) {
    const [showLoading, setShowLoading] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const timer = React.useRef(-1);

    const buttonSx = {
        ...(correct && {
            bgcolor: green[500]
        }),
        ...(!correct && {
            bgcolor: red[500]
        })
    };

    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    const handleTextChange = (e) => {
        clearTimeout(timer.current);
        setLoading(true);
        setIsLoaded(false);
        setShowLoading(false);
        if (e?.target?.value?.length === 0) {
            notifyAnswer(answerKey, null);
            return;
        }
        setShowLoading(true);
        timer.current = window.setTimeout(() => {
            setLoading(false);
            setIsLoaded(true);
            notifyAnswer(answerKey, e.target.value);
        }, 2000);
    };

    const id = `inputlabel_${Math.random(10000)}`;

    return (
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <OutlinedInput
                id={id}
                required
                label={label}
                defaultValue=''
                onChange={(e) => handleTextChange(e)}
                placeholder={label}
                endAdornment={
                    <InputAdornment position="end">
                        {showLoading ?
                            <div>
                                {loading ? <CircularProgress size={32} /> : ``}
                                {isLoaded ? <Avatar
                                    aria-label="save"
                                    color="primary"
                                    size='small'
                                    sx={buttonSx}
                                >
                                    {correct ? <CheckIcon /> : <CloseIcon />}
                                </Avatar> : ``}
                            </div> : ``}
                    </InputAdornment>
                }
            />
        </FormControl>
    );
}
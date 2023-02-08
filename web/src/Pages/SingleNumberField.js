import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

export default function SingleNumberField({
    answerKey,
    notifyAnswer,
    width
}) {
    const [value, setValue] = useState(null);
    const [lastValidValue, setLastValidValue] = useState(null);

    const onChange = (e) => {
        const re = /^[1-9\b]+$/;

        // check if blank
        if (e.target.value === '') {
            setValue('');
            setLastValidValue('');
            notifyAnswer(answerKey, '');
            return;
        }
        // check if valid input
        if (re.test(e.target.value)) {
            const singleNumber = e.target.value[e.target.value.length - 1];
            setValue(singleNumber);
            setLastValidValue(singleNumber);
            notifyAnswer(answerKey, singleNumber);
        } else {
            const currentValue = lastValidValue ? lastValidValue : '';
            setValue(currentValue);
            notifyAnswer(answerKey, currentValue);
        }
    }

    return (
        <TextField
            onChange={onChange}
            value={value}
            style={{ width: `${width}px` }}
        />
    );
}
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

export default function SingleNumberField({
    answerKey,
    notifyAnswer
}) {
    const [value, setValue] = useState(null);
    const [lastValidValue, setLastValidValue] = useState(null);

    const onChange = (e) => {
        const re = /^[1-9\b]+$/;

        // if value is not blank, then test the regex
        if (e.target.value === '' || re.test(e.target.value)) {
            const singleNumber = e.target.value[e.target.value.length - 1];
            setValue(singleNumber);
            setLastValidValue(singleNumber);
        } else {
            setValue(lastValidValue ? lastValidValue : '');
        }
    }

    return (
        <TextField
            name="maxNodeSelectedCount"
            onChange={onChange}
            value={value}
            InputProps={{ inputProps: { min: 1, max: 9 } }}
        />
    );
}
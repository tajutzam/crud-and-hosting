import React, {useState} from 'react';

function CounterAppCounter() {
    const [countDisplay, setCountDisplay] = useState(0);
    const incrementClick = () => {setCountDisplay(countDisplay + 1)};
    const decrementClick = () => {setCountDisplay(countDisplay - 1)};
    
    return(
        <div>
            <p>{countDisplay}</p>
            <button onClick={incrementClick}>Increment</button>
            <button onClick={decrementClick}>Decrement</button>
        </div>
    )
}

export default CounterAppCounter
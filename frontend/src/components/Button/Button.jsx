import styles from './Button.module.css'

function Button(){

    let count = 0;
    const handleClick = (name) => {

        count ++;
        if(count < 3){
            console.log(`You have clicked me ${count} times!`);
        }
        else if (count < 6) {
            console.log(`You have clicked me ${count} times! Better stop soon!`);
        }
        else {
            console.log(`${name}, Stop clicking me!`);
        }
    }

    return(
        <button onClick={() => handleClick("Bro")} className={styles.button}>
            Click me
        </button>
    )
}

export default Button
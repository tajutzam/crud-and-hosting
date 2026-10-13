import { Link } from 'react-router-dom';
import styles from './Button/Button.module.css';

function NavButton({ to, children, ...props }) {
  return (
        <Link to={to} className={styles.button} {...props}>
          {children}
        </Link>
  );
}

export default NavButton

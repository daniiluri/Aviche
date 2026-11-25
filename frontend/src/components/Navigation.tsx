import {useRef} from "react";
import {Link, NavLink} from "react-router";
import styles from "./Navigation.module.css";

export default function Navigation({showCreateAccount = true}: {showCreateAccount?: boolean}) {
    const signInDialog = useRef<HTMLDialogElement>(null);

    function handleOpenSignIn() {
        signInDialog.current?.showModal();
    }

    return (
        <>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <NavLink className={styles.homeLink} to="/" end>
                        <span className={styles.homeMark} aria-hidden="true" />
                        Home
                    </NavLink>
                    <button type="button" className={styles.loginButton} onClick={handleOpenSignIn}>
                        Log in
                    </button>
                    {showCreateAccount && (
                        <Link className={styles.primaryLink} to="/register">Create Account</Link>
                    )}
                </nav>
            </header>

            <dialog className={styles.dialog} ref={signInDialog} aria-labelledby="sign-in-title">
                <h2 id="sign-in-title">Log in</h2>
                <form className={styles.fields}>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" autoComplete="username" />

                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" autoComplete="current-password" />
                </form>
                <form className={styles.dialogActions} method="dialog">
                    <button className={styles.closeButton} type="submit">Close</button>
                </form>
            </dialog>
        </>
    );
}

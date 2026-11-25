import envelope from "../assets/account-envelope.webp";
import Navigation from "../components/Navigation";
import styles from "./HomePage.module.css";

export default function HomePage() {
    return (
        <div className={styles.page}>
            <title>Account</title>
            <Navigation />
            <main className={styles.hero}>
                <div>
                    <h1 className={styles.title}>Your account starts here.</h1>
                    <p className={styles.description}>Create an account with your email, or log in to continue.</p>
                </div>
                <img className={styles.artwork} src={envelope} alt="" width={1254} height={1254} />
            </main>
        </div>
    );
}

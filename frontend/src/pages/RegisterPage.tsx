import {type ChangeEvent, type SubmitEvent, useRef, useState} from "react";
import Navigation from "../components/Navigation";
import styles from "./RegisterPage.module.css";

const minimumPasswordLength = 8;

const submissionMessages = {
    idle: "",
    pending: "Submitting registration…",
    success: "If you can continue with this address, we’ll email you the next steps.",
    error: "We couldn’t submit your registration. Please try again.",
};

function getTextField(fields: FormData, name: string): string {
    const value = fields.get(name);
    if (typeof value !== "string") throw new Error(`Expected "${name}" to be a text field.`);
    return value;
}

function getConfirmationError(fields: FormData): string | null {
    const password = getTextField(fields, "password");
    const confirmation = getTextField(fields, "confirm_password");

    if (confirmation === "") return "Confirm your password.";
    if (confirmation !== password) return "Passwords do not match.";
    return null;
}

export default function RegisterPage() {
    const [submissionStatus, setSubmissionStatus] = useState<keyof typeof submissionMessages>("idle");
    const [confirmationError, setConfirmationError] = useState<string | null>();
    const confirmationInput = useRef<HTMLInputElement>(null);
    const isPending = submissionStatus === "pending";

    function handleChange(event: ChangeEvent<HTMLFormElement>) {
        if (submissionStatus === "error" || submissionStatus === "success") {
            setSubmissionStatus("idle");
        }

        if (confirmationError !== undefined) {
            setConfirmationError(getConfirmationError(new FormData(event.currentTarget)));
        }
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isPending) return;

        const form = event.currentTarget;
        const fields = new FormData(form);
        const error = getConfirmationError(fields);
        setConfirmationError(error);

        if (error !== null) {
            confirmationInput.current?.focus();
            return;
        }

        const email = getTextField(fields, "email");
        const password = getTextField(fields, "password");
        setSubmissionStatus("pending");

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) throw new Error(`Registration failed with HTTP ${response.status}.`);
        } catch {
            setSubmissionStatus("error");
            return;
        }

        form.reset();
        setConfirmationError(undefined);
        setSubmissionStatus("success");
    }

    return (
        <div className={styles.page}>
            <title>Create your account | Account</title>
            <Navigation showCreateAccount={false}/>
            <main className={styles.main}>
                <div className={styles.card}>
                    <h1 id="register-title" className={styles.title}>Create your account</h1>
                    <form
                        className={styles.form}
                        method="post"
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                    >
                        <fieldset className={styles.fields} disabled={isPending}>
                            <div className={styles.field}>
                                <label htmlFor="register-email">Email address</label>
                                <input id="register-email" name="email" type="email" autoComplete="email" required/>
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="register-password">Password</label>
                                <input
                                    id="register-password"
                                    name="password"
                                    type="password"
                                    minLength={minimumPasswordLength}
                                    autoComplete="new-password"
                                    aria-describedby="register-password-hint"
                                    required
                                />
                                <p id="register-password-hint" className={styles.hint}>
                                    Use at least {minimumPasswordLength} characters.
                                </p>
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="register-confirm-password">Confirm password</label>
                                <input
                                    ref={confirmationInput}
                                    id="register-confirm-password"
                                    name="confirm_password"
                                    type="password"
                                    autoComplete="new-password"
                                    aria-describedby="confirm-password-error"
                                    aria-invalid={Boolean(confirmationError)}
                                    onBlur={event => {
                                        const input = event.currentTarget;
                                        if (input.matches(":disabled")) return;

                                        const form = input.form;
                                        if (!form) throw new Error("Expected the input to be inside the form.");

                                        setConfirmationError(getConfirmationError(new FormData(form)));
                                    }}
                                    required
                                />
                                <p id="confirm-password-error" className={styles.error} aria-live="polite">
                                    {confirmationError}
                                </p>
                            </div>
                            <button className={styles.submit} type="submit">Create account</button>
                        </fieldset>
                        <p className={styles.status} role="status">
                            {submissionMessages[submissionStatus]}
                        </p>
                    </form>
                </div>
            </main>
        </div>
    );
}

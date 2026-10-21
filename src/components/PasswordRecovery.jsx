import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function PasswordRecovery() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setMessage("Authentication is unavailable.");
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setReady(Boolean(data.session));
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          mounted &&
          (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN")
        ) {
          setReady(Boolean(session));
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function submit(event) {
    event.preventDefault();

    if (password.length < 12) {
      setMessage("Use at least 12 characters.");
      return;
    }

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    setBusy(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    await supabase.auth.signOut();
    setReady(false);
    setMessage("Password updated successfully. You can now sign in.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f4ea] px-5 py-12">
      <section className="w-full max-w-md rounded-3xl border border-[#dfd1b4] bg-white p-8 shadow-xl">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-[#a87918]">
          Velavaa Shanmugaa
        </p>

        <h1 className="mt-5 text-center font-serif text-3xl">
          Reset Password
        </h1>

        {ready ? (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <input
              type="password"
              autoComplete="new-password"
              placeholder="New password (12+ characters)"
              aria-label="New password"
              className="w-full rounded-xl border p-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              autoComplete="new-password"
              placeholder="Confirm password"
              aria-label="Confirm password"
              className="w-full rounded-xl border p-4"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            <button
              disabled={busy}
              className="w-full rounded-xl bg-[#211b14] p-4 text-white disabled:opacity-50"
            >
              {busy ? "Updating..." : "Set New Password"}
            </button>
          </form>
        ) : (
          <p className="mt-6 text-center text-sm leading-7 text-[#756b5b]">
            Open the password-reset link from your email.
            If it has expired, request another link from the login page.
          </p>
        )}

        {message && (
          <p role="status" className="mt-5 text-center text-sm">
            {message}
          </p>
        )}

        <a href="/" className="mt-7 block text-center text-sm underline">
          Return to Store
        </a>
      </section>
    </main>
  );
}

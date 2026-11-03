"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/toast";

type Mode = "login" | "register";

interface FieldState {
  value: string;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Shared login / registration form. Everything is local state — submit only
 * validates the shape of the input, confirms with a toast and forwards to the
 * dashboard. Swap `handleSubmit` for a real mutation when a backend lands.
 */
export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const isLogin = mode === "login";

  const [name, setName] = React.useState<FieldState>({ value: "" });
  const [email, setEmail] = React.useState<FieldState>({ value: "" });
  const [password, setPassword] = React.useState<FieldState>({ value: "" });
  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [terms, setTerms] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  function validate(): boolean {
    let ok = true;

    if (!isLogin && name.value.trim().length < 2) {
      setName((f) => ({ ...f, error: "Tell us what to call you." }));
      ok = false;
    }

    if (!EMAIL_RE.test(email.value.trim())) {
      setEmail((f) => ({
        ...f,
        error: "Enter a valid email address.",
      }));
      ok = false;
    }

    if (password.value.length < 8) {
      setPassword((f) => ({
        ...f,
        error: "Use at least 8 characters.",
      }));
      ok = false;
    }

    if (!isLogin && !terms) {
      toast.add({
        type: "warning",
        title: "Accept the terms first",
        description: "Please agree to the terms and privacy policy to continue.",
      });
      ok = false;
    }

    return ok;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    // Simulated request — no network, no credentials stored anywhere.
    window.setTimeout(() => {
      setSubmitting(false);
      toast.add({
        type: "success",
        title: isLogin ? "Welcome back" : "Account created",
        description: isLogin
          ? "You're signed in to the demo dashboard."
          : "Your demo account is ready — let's find you a studio.",
      });
      router.push("/dashboard");
    }, 550);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* ---------- Name (register only) ---------- */}
      {!isLogin && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="auth-name">Full name</Label>
          <div className="relative">
            <UserIcon
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="auth-name"
              type="text"
              autoComplete="name"
              value={name.value}
              onChange={(e) =>
                setName({ value: e.target.value, error: undefined })
              }
              placeholder="Alex Rivera"
              aria-invalid={name.error ? true : undefined}
              className="h-11 rounded-lg bg-card pl-9"
            />
          </div>
          {name.error && (
            <p className="text-sm text-destructive">{name.error}</p>
          )}
        </div>
      )}

      {/* ---------- Email ---------- */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="auth-email">Email address</Label>
        <div className="relative">
          <MailIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email.value}
            onChange={(e) => setEmail({ value: e.target.value, error: undefined })}
            placeholder="you@studio.com"
            aria-invalid={email.error ? true : undefined}
            className="h-11 rounded-lg bg-card pl-9"
          />
        </div>
        {email.error && <p className="text-sm text-destructive">{email.error}</p>}
      </div>

      {/* ---------- Password ---------- */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="auth-password">Password</Label>
          {isLogin && (
            <button
              type="button"
              onClick={() =>
                toast.add({
                  type: "info",
                  title: "Password reset is demo-only",
                  description: "No emails are sent from this frontend build.",
                })
              }
              className="text-xs text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Forgot password?
            </button>
          )}
        </div>
        <div className="relative">
          <LockIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="auth-password"
            type={showPassword ? "text" : "password"}
            autoComplete={isLogin ? "current-password" : "new-password"}
            value={password.value}
            onChange={(e) =>
              setPassword({ value: e.target.value, error: undefined })
            }
            placeholder="••••••••"
            aria-invalid={password.error ? true : undefined}
            className="h-11 rounded-lg bg-card pr-11 pl-9"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-1/2 right-2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {showPassword ? (
              <EyeOffIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </button>
        </div>
        {password.error && (
          <p className="text-sm text-destructive">{password.error}</p>
        )}
        {!isLogin && (
          <p className="text-xs text-muted-foreground">
            At least 8 characters. This is a demo — nothing is stored.
          </p>
        )}
      </div>

      {/* ---------- Options ---------- */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {isLogin ? (
          <label
            htmlFor="auth-remember"
            className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground select-none"
          >
            <Checkbox
              id="auth-remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(Boolean(checked))}
              className="size-4"
            />
            Keep me signed in
          </label>
        ) : (
          <label
            htmlFor="auth-terms"
            className="inline-flex max-w-full cursor-pointer items-start gap-2.5 text-sm text-muted-foreground select-none"
          >
            <Checkbox
              id="auth-terms"
              checked={terms}
              onCheckedChange={(checked) => setTerms(Boolean(checked))}
              className="mt-0.5 size-4"
            />
            <span>
              I agree to the{" "}
              <span className="text-foreground">terms</span> and{" "}
              <span className="text-foreground">privacy policy</span>.
            </span>
          </label>
        )}
      </div>

      {/* ---------- Submit ---------- */}
      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="h-12 w-full rounded-full text-[15px]"
      >
        {submitting
          ? isLogin
            ? "Signing in…"
            : "Creating account…"
          : isLogin
            ? "Log in"
            : "Create account"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Demo build — any valid-looking email and an 8-character password will
        work.
      </p>

      <div
        className={cn(
          "flex items-center gap-3 text-[11px] tracking-wider text-muted-foreground uppercase",
        )}
        aria-hidden
      >
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-12 w-full rounded-full text-[15px]"
        onClick={() =>
          toast.add({
            type: "info",
            title: "Single sign-on is demo-only",
            description: "Social login isn't connected in this frontend build.",
          })
        }
      >
        Continue with Google
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Prefer to look around first?{" "}
        <Link
          href="/studios"
          className="text-foreground outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Explore studios
        </Link>
      </p>
    </form>
  );
}

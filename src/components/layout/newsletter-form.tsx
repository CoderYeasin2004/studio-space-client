"use client";

import * as React from "react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

/**
 * Newsletter signup — visual only. Validates the shape of the address and
 * confirms with a toast; swap the handler for your API later.
 */
export function NewsletterForm() {
  const [email, setEmail] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.add({
        type: "warning",
        title: "Check that address",
        description: "Enter a valid email so we know where to send it.",
      });
      return;
    }

    toast.add({
      type: "success",
      title: "You're on the list",
      description: `First dispatch lands in ${value}.`,
    });
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <Input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@studio.com"
        autoComplete="email"
        className="h-11 flex-1 rounded-full bg-card px-5"
      />
      <Button
        type="submit"
        size="lg"
        aria-label="Subscribe"
        className="h-11 size-11 shrink-0 rounded-full p-0"
      >
        <ArrowRightIcon className="size-4" />
      </Button>
    </form>
  );
}

import type { Metadata } from "next";
import { ProfileForm } from "@/components/dashboard/profile-form";

export const metadata: Metadata = {
  title: "Profile settings — StudioSpace",
};

/** Account settings: identity, notification preferences and security. */
export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-7">
      <div>
        <span className="eyebrow text-primary">Account</span>
        <h2 className="mt-2.5 font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
          Profile settings
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Keep your details current so hosts know who they&apos;re handing the
          keys to.
        </p>
      </div>

      <ProfileForm />
    </div>
  );
}

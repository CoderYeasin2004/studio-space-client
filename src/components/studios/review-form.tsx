"use client";

import * as React from "react";
import { StarIcon } from "lucide-react";
import { submitStudioReview, fetchStudioReviews, checkReviewEligibility, type Review } from "@/lib/api/studios";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  studioId: string;
  onReviewAdded: () => void;
}

export const ReviewForm = ({ studioId, onReviewAdded }: ReviewFormProps) => {
  const router = useRouter();
  const [author, setAuthor] = React.useState("");
  const [rating, setRating] = React.useState<number | undefined>(undefined);
  const [text, setText] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [eligibility, setEligibility] = React.useState<{ canReview: boolean; reason?: string } | null>(null);

  React.useEffect(() => {
    const loadEligibility = async () => {
      const result = await checkReviewEligibility(studioId);
      setEligibility(result);
    };
    loadEligibility();
  }, [studioId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!author || !rating || !text) {
      toast.add({
        type: "error",
        title: "Incomplete review",
        description: "Please fill in all fields.",
      });
      return;
    }

    if (!eligibility?.canReview) {
      toast.add({
        type: "error",
        title: "Review not eligible",
        description: eligibility?.reason || "You can only review studios after a completed booking.",
      });
      return;
    }

    if (submitting) return;

    setSubmitting(true);

    try {
      const success = await submitStudioReview(studioId, {
        author,
        rating: rating!,
        text,
      });

      if (success) {
        setAuthor("");
        setRating(undefined);
        setText("");
        toast.add({
          type: "success",
          title: "Review submitted",
          description: "Thank you for your review!",
        });
        onReviewAdded();
        router.refresh();
      } else {
        toast.add({
          type: "error",
          title: "Review failed",
          description: "Could not submit your review. Please try again.",
        });
      }
    } catch {
      toast.add({
        type: "error",
        title: "Review failed",
        description: "Could not submit your review. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-muted-foreground">
          Your name
        </label>
        <Input
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-muted-foreground">
          Rating
        </label>
        <Select
          value={rating?.toString() ?? ""}
          onValueChange={(v) => setRating(v ? parseInt(v, 10) : undefined)}
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <SelectItem key={r} value={r.toString()}>
              {r} star{r === 1 ? "" : "s"}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-muted-foreground">
          Your review
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your experience…"
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring/50"
        />
      </div>

      <Button type="submit" disabled={submitting || !author || !rating || !text || !eligibility?.canReview} className="w-full">
        {submitting ? "Submitting…" : "Submit Review"}
      </Button>
    </form>
  );
};

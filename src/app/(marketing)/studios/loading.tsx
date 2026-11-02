import { ExploreSkeleton } from "@/components/studios/explore-skeleton";

/** Route-level loading state while /studios first renders. */
export default function Loading() {
  return <ExploreSkeleton includeHeader />;
}

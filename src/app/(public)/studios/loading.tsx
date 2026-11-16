import { ExploreSkeleton } from "@/components/studios/explore-skeleton";

/** Route-level loading state while /studios first renders. */
const Loading = () => {
  return <ExploreSkeleton includeHeader />;
};

export default Loading;

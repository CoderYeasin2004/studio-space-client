import type { Studio } from "@/types/studio";
import { fetchStudios } from "@/lib/api/studios";
import { FavoritesView } from "@/components/dashboard/favorites-view";

export const instant = false;

async function getStudios(): Promise<Studio[]> {
  const raw = await fetchStudios();
  return raw.map((s) => {
    const studio = s as Record<string, unknown>;
    return {
      ...studio,
      id: String(
        studio._id ?? studio.id ?? ""
      ),
    } as unknown as Studio;
  });
}

export default async function FavoritesPage() {
  const allStudios = await getStudios();

  return <FavoritesView allStudios={allStudios} />;
}

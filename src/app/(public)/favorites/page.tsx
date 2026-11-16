import type { IStudio } from "@/types/studio";
import { fetchStudios } from "@/lib/api/studios";
import { FavoritesView } from "@/components/dashboard/favorites-view";
import { connection } from "next/server";

export const instant = false;

async function getStudios(): Promise<IStudio[]> {
  const raw = await fetchStudios();
  return raw.map((s) => {
    const studio = s as Record<string, unknown>;
    return {
      ...studio,
      id: String(
        studio._id ?? studio.id ?? ""
      ),
    } as unknown as IStudio;
  });
}

export default async function FavoritesPage() {
  await connection();

  const allStudios = await getStudios();

  return <FavoritesView allStudios={allStudios} />;
}
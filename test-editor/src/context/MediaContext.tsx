import { createContext, useContext, useState } from "react";
import type { IndexedMedia } from "../functions/mediaIndexer";

const MediaContext = createContext<{
  media: IndexedMedia | null;
  setMedia: (m: IndexedMedia) => void;
} | null>(null);

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [media, setMedia] = useState<IndexedMedia | null>(null);

  return (
    <MediaContext.Provider value={{ media, setMedia }}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error("useMedia must be inside MediaProvider");
  return ctx;
}

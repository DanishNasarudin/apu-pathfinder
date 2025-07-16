import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "APU Pathfinder",
    short_name: "APU Pathfinder",
    description:
      "Find your Asia Pacific University (APU) classroom through interactive map. Developed by Danish Nasarudin.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/icon.webp",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

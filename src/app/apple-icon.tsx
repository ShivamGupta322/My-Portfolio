import { monogram } from "@/lib/monogram";

/** Home-screen icon on iPhone/iPad (iOS rounds the corners itself). */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return monogram(size.width, 0);
}

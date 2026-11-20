import { renderShareImage } from "@/components/v3/og/render";

export const alt =
  "Versa, agência de social media, tráfego pago e sites em Rio Branco, Acre.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderShareImage();
}

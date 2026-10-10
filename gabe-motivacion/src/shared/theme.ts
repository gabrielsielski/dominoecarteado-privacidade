import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Montserrat variable (OFL) incluida en public/ para renderizar sin internet.
export const fontFamily = "Montserrat";
loadFont({
  family: fontFamily,
  url: staticFile("fonts/Montserrat.woff2"),
  weight: "100 900",
});

export const colors = {
  bg: "#0b0b0f",
  text: "#f5f5f7",
  muted: "#8a8a99",
  gold: "#ffc53d",
  red: "#ff4d4f",
  green: "#3ddc84",
};

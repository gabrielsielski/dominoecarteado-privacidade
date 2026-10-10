import { Composition, Folder } from "remotion";
import { LaRegla } from "./LaRegla/LaRegla";
import { TOTAL_FRAMES } from "./LaRegla/timing";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Gabe-Motivacion">
      <Composition
        id="LaReglaDel1"
        component={LaRegla}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
    </Folder>
  );
};

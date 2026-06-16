import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine as FullEngine } from "@tsparticles/engine";
import type { Engine as ParticlesEngine } from "tsparticles-engine";

const ParticlesBg = () => {
  const particlesInit = async (main: ParticlesEngine) => {
    await loadFull(main as unknown as FullEngine);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: { color: "#0A192F" },
        particles: {
          number: { value: 60 },
          size: { value: 2 },
          move: { enable: true, speed: 1 },
          links: { enable: true, color: "#FFD700" },
        },
      }}
    />
  );
};

export default ParticlesBg;

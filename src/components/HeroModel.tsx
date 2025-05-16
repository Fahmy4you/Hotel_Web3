"use client"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useMediaQuery } from "react-responsive";
import { HotelModel } from './HotelModel';

const HeroModel = () => {
    const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });
    const enableZoom = useMediaQuery({ query: '(max-width: 1200px)' });
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    let position: [x: number, y: number, z: number] = [0.5,-4.3,0];
    let scale = 0.48;

    if(isMobile) {
      position = [-0.35, -2.8, 0];
      scale = 0.36;
    } else if(isTablet) {
      position = [0, -3, 0];
      scale = 0.4;
    }

  return (
    <Canvas camera={{ position: [0,0,15], fov: 45}}>
        <ambientLight intensity={0.2} color="#1a140" />
        <directionalLight position={[5, 5, 5]} intensity={5}/>

        <OrbitControls
            enablePan={false}
            enableZoom={!enableZoom}
            maxDistance={20}
            minDistance={5}
            minPolarAngle={Math.PI / 5}
            maxPolarAngle={Math.PI / 2}

        />

        <group scale={scale} rotation={[Math.PI / 125, 330, 0]} position={position}>

          <HotelModel/>
        </group>

    </Canvas>
  )
}

export default HeroModel

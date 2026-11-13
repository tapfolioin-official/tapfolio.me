"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, ContactShadows } from "@react-three/drei";
import StudioEnvironment from "@/components/canvas/StudioEnvironment";
import { CanvasErrorBoundary } from "@/components/canvas/CanvasErrorBoundary";
import * as THREE from "three";
import { drawCardFront, drawCardBack } from "@/utils/cardCanvas";
import { RotateCw } from "lucide-react";

export interface ConfiguratorState {
  name: string;
  role: string;
  company: string;
  color: string;
  material: "pvc" | "metal";
  finish: "glossy" | "matte" | "brushed";
  logoUrl: string | null;
  qrPosition?: "front" | "back" | "hidden";
}

function ConfigCardMesh({ 
  config, 
  autoRotate, 
  targetRotation 
}: { 
  config: ConfiguratorState; 
  autoRotate: boolean;
  targetRotation: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  
  const [frontTexture, setFrontTexture] = useState<THREE.CanvasTexture | null>(null);
  const [backTexture, setBackTexture] = useState<THREE.CanvasTexture | null>(null);

  // Re-generate textures whenever config changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    let logoImg: HTMLImageElement | null = null;
    
    const renderTextures = () => {
      // Front Texture
      const frontCanvas = document.createElement("canvas");
      frontCanvas.width = 1024;
      frontCanvas.height = 646;
      drawCardFront(
        frontCanvas, 
        config.name || "Alex Sterling", 
        config.role || "CEO & Founder", 
        config.company || "TAPFOLIO", 
        config.color || "#0a0a0a", 
        config.material || "pvc", 
        config.finish || "matte", 
        logoImg
      );
      const fTex = new THREE.CanvasTexture(frontCanvas);
      fTex.colorSpace = THREE.SRGBColorSpace;
      fTex.anisotropy = 16;
      fTex.needsUpdate = true;
      setFrontTexture(fTex);

      // Back Texture
      const backCanvas = document.createElement("canvas");
      backCanvas.width = 1024;
      backCanvas.height = 646;
      drawCardBack(
        backCanvas, 
        config.color || "#0a0a0a", 
        config.material || "pvc", 
        config.finish || "matte", 
        config.name || "Alex Sterling"
      );
      const bTex = new THREE.CanvasTexture(backCanvas);
      bTex.colorSpace = THREE.SRGBColorSpace;
      bTex.anisotropy = 16;
      bTex.needsUpdate = true;
      setBackTexture(bTex);
    };

    if (config.logoUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = config.logoUrl;
      img.onload = () => {
        logoImg = img;
        renderTextures();
      };
      img.onerror = () => {
        renderTextures();
      };
    } else {
      renderTextures();
    }
  }, [
    config.name, 
    config.role, 
    config.company, 
    config.color, 
    config.material, 
    config.finish, 
    config.logoUrl
  ]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (autoRotate) {
      meshRef.current.rotation.y += delta * 0.7;
    } else {
      // Smoothly interpolate towards target rotation
      meshRef.current.rotation.y = THREE.MathUtils.damp(
        meshRef.current.rotation.y, 
        targetRotation, 
        6, 
        delta
      );
    }
  });

  // Calculate material properties
  const roughness = config.finish === "glossy" ? 0.08 : config.finish === "matte" ? 0.7 : 0.35;
  const metalness = config.material === "metal" ? 0.85 : 0.1;

  return (
    <group ref={meshRef} scale={1.05}>
      {/* Front Face */}
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[3.375, 2.125]} />
        {frontTexture && (
          <meshStandardMaterial 
            map={frontTexture} 
            roughness={roughness} 
            metalness={metalness} 
          />
        )}
      </mesh>
      
      {/* Core (Edges) */}
      <mesh>
        <boxGeometry args={[3.375, 2.125, 0.022]} />
        <meshStandardMaterial 
          color={config.material === "metal" ? "#1a1a1a" : "#050505"} 
          roughness={0.9} 
        />
      </mesh>

      {/* Back Face */}
      <mesh position={[0, 0, -0.012]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[3.375, 2.125]} />
        {backTexture && (
          <meshStandardMaterial 
            map={backTexture} 
            roughness={roughness} 
            metalness={metalness} 
          />
        )}
      </mesh>
    </group>
  );
}

export default function Configurator3DCanvas({ config }: { config: ConfiguratorState }) {
  const [mounted, setMounted] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [targetRotation, setTargetRotation] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <div className="w-64 h-40 rounded-2xl border border-gray-200 bg-white/80 flex flex-col justify-between p-6 animate-pulse shadow-sm">
          <span className="text-xs font-bold text-gray-400">Tapfolio</span>
          <span className="text-sm font-bold text-gray-900">{config.name || "Loading Card..."}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[380px] sm:min-h-[440px] relative cursor-grab active:cursor-grabbing">
      {/* View controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-gray-200/80 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
        <button
          type="button"
          onClick={() => { setAutoRotate(false); setTargetRotation(0); }}
          className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
            !autoRotate && targetRotation === 0 ? "bg-gray-950 text-white font-bold shadow-sm" : "hover:text-gray-950"
          }`}
        >
          Front
        </button>
        <button
          type="button"
          onClick={() => { setAutoRotate(false); setTargetRotation(Math.PI); }}
          className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
            !autoRotate && targetRotation === Math.PI ? "bg-gray-950 text-white font-bold shadow-sm" : "hover:text-gray-950"
          }`}
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setAutoRotate(prev => !prev)}
          className={`px-3 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer ${
            autoRotate ? "bg-blue-600 text-white font-bold shadow-sm" : "hover:text-gray-950 text-gray-600"
          }`}
        >
          <RotateCw size={12} className={autoRotate ? "animate-spin" : ""} /> Spin
        </button>
      </div>

      <CanvasErrorBoundary>
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
            Loading 3D Canvas...
          </div>
        }>
          <Canvas 
            camera={{ position: [0, 0, 4.5], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <directionalLight position={[-5, -5, -5]} intensity={0.5} />
            <StudioEnvironment />
            
            <Float speed={autoRotate ? 0 : 2} rotationIntensity={autoRotate ? 0 : 0.4} floatIntensity={autoRotate ? 0 : 0.8}>
              <ConfigCardMesh 
                config={config} 
                autoRotate={autoRotate} 
                targetRotation={targetRotation} 
              />
            </Float>
            
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
            />
          </Canvas>
        </Suspense>
      </CanvasErrorBoundary>
    </div>
  );
}



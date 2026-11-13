"use client";

import React from "react";
import { Environment, Lightformer } from "@react-three/drei";

/**
 * High-performance, self-contained local studio lighting environment.
 * Generates specular highlights and reflection maps locally on the GPU via FBO.
 * Does NOT rely on external CDN presets (e.g. raw.githack.com) to prevent fetch 403 errors and CSP blocks.
 */
export default function StudioEnvironment() {
  return (
    <Environment resolution={256}>
      <group rotation={[-Math.PI / 3, 0, 1]}>
        <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
        <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
        <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
        <Lightformer form="rect" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
      </group>
    </Environment>
  );
}


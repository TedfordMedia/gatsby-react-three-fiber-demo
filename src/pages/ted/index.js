import React, { useState, useRef, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Canvas, extend, useThree, useRender } from "react-three-fiber"
import { useSpring, a } from "react-spring/three"

import "../style.css"

extend({ OrbitControls })

const SpaceShip = () => {
    var xxx = function (){
        console.log('aaa')
    }
  const [model, setModel] = useState()

  useEffect(() => {
    new GLTFLoader().load("/Flamingo.glb", setModel)
  })
 
  return model ? <primitive object={model.scene} scale={[.03, .03, .03]} /> : null
}

const Controls = () => {
  const orbitRef = useRef()
  const { camera, gl } = useThree()

  useRender(() => {
    orbitRef.current.update()
  })

  return (
    <orbitControls
      autoRotate
      maxPolarAngle={Math.PI / 3}
      minPolarAngle={Math.PI / 3}
      args={[camera, gl.domElement]}
      ref={orbitRef}
    />
  )
}

const Plane = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
    <planeBufferGeometry attach="geometry" args={[100, 100]} />
    <meshPhysicalMaterial attach="material" color="white" />
  </mesh>
)

const Box = () => {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  const props = useSpring({
    scale: active ? [3.5, 3.5, 3.5] : [1, 1, 1],
    color: hovered ? "blue" : "red",
  })

  return (
    <a.mesh
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setActive(!active)}
      scale={props.scale}
      castShadow
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <a.meshPhysicalMaterial attach="material" color={props.color} />
    </a.mesh>
  )
}

export default () => {
  const isBrowser = typeof window !== "undefined"

  return (
    <>
      <h1>Ted1</h1>
      {isBrowser && (
        <Canvas
          camera={{ position: [0, 0, 5] }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true
            gl.shadowMap.type = THREE.PCFSoftShadowMap
          }}
        >
          <ambientLight intensity={0.5} />
          <spotLight position={[15, 20, 5]} penumbra={1} castShadow />
          <fog attach="fog" args={["black", 10, 25]} />
          <Controls />
          {/* <Box /> */}
          {/* <Plane /> */}
          <SpaceShip />
        </Canvas>
      )}
    </>
  )
}

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { NoiseGenerator } from './PerlinNoise';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createBuilding } from './SkyscraperBuilder';

export interface Segment {
    length: number,
    height: number,
    width: number
}

const Base = (props: JSX.IntrinsicElements['mesh']) => {
    const ref = useRef<THREE.Mesh>(null!);

    return (
        <mesh 
            {...props}
            ref={ref}
            position={[0,0,0]}
        >
            <boxGeometry
                args={[1, 0.1, 1]}
            />
            <meshStandardMaterial
                metalness={1}
                roughness={0.4}
                color={new THREE.Color(0xffffff)}
            />
        </mesh>
    )
}

const Skyscraper = (props: JSX.IntrinsicElements['mesh']) => {
    const mesh = useRef<THREE.Mesh>(null!);
    const numSegments = Number(Math.random()*3+3);
    let segments: Segment[] = createBuilding('spike-up', 'blue');

    let meshes: JSX.Element[] = [];
    let currentHeight = 0;
    let keyCounter = 0;
    segments.forEach((segment: Segment) => {
        const height = currentHeight + segment.height/2
        meshes.push(
            <mesh
                {...props}
                ref={mesh}
                position={[0, height, 0]}
                key={keyCounter}
            >
                <boxGeometry args={[segment.length, segment.height, segment.length]} />
                <meshStandardMaterial color={new THREE.Color(Math.floor(Math.random()*16777215))} />
            </mesh>
        )
        keyCounter++;
        currentHeight = height + segment.height/2;
    });

    return (
        <mesh
            {...props}
            ref={mesh}
        >
            {meshes}
        </mesh>
    );
}

function CameraController () {
    const {camera, gl } = useThree();
    useEffect(() => {
        const controls = new OrbitControls(camera, gl.domElement);
        controls.target = new THREE.Vector3(0,0,0);
        controls.minDistance = 2;
        controls.maxDistance = 5;
        return () => {
            controls.dispose();
        };
    }, [camera, gl])

    return null;
}

export const SkyscraperViewer = () => {
    const [render, rerender] = useState(false);
    
    return (
        <div>
            <Canvas style={{
                height: '500px',
                borderStyle: 'dotted'
            }}>
                <CameraController />
                <ambientLight />
                <pointLight position={[10,10,10]} />
                <Base />
                <Skyscraper />
            </Canvas>
            <button onClick={() => {rerender(!render)}}>Reset view</button>
        </div>
    )
}
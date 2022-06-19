import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { NoiseGenerator } from './PerlinNoise';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const basePlateLength = 5;
const subdivisions = 25;
const gen = new NoiseGenerator();


function Box (props: JSX.IntrinsicElements['mesh']) {
    const mesh = useRef<THREE.Mesh>(null!);

    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);


    useFrame((state, delta) => (mesh.current.rotation.x += 0.01));

    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}
        >
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    );
}

function CityBase (props: JSX.IntrinsicElements['mesh']) {
    const mesh = useRef<THREE.Mesh>(null!);

    return (
        <mesh
            {...props}
            ref={mesh}
            position={[0,0,0]}
        >
            <boxGeometry args={[basePlateLength,0.25,basePlateLength]} />
            <meshStandardMaterial color={'dimgray'} />
        </mesh>
    );
}

function Buildings (props: JSX.IntrinsicElements['mesh']) {
    const heightMap: number[][] = gen.generate(6, 5);
    const mesh = useRef<THREE.Mesh>(null!);
    const buildings = [];
    let counter = 0;
    const hue = Math.random()*360;
    for (let i = 1; i < subdivisions; i++) {
        for (let j = 1; j < subdivisions; j++) {
            const x = i*(basePlateLength/subdivisions)-(basePlateLength/2);
            const y = 0.25;
            const z = j*(basePlateLength/subdivisions)-(basePlateLength/2);
            const height: number = Math.pow(heightMap[i][j]*2, 2);
            const width = basePlateLength/(subdivisions*1.5)
            const saturation = Math.floor(heightMap[i][j]*100);

            const color = new THREE.Color(`hsl(${hue}, ${saturation}%, 50%)`);
            buildings.push(
                <mesh
                    {...props}
                    ref={mesh}
                    position={[x,y,z]}
                    key={counter}
                >
                        <boxGeometry args={[width, height, width]} />
                        <meshStandardMaterial
                            color={color}
                            metalness={1}
                            roughness={0.5}
                            emissive={color}
                            emissiveIntensity={saturation/100}
                        />
                </mesh>
            );
            counter++;
        }
    }
    return (
        <mesh
            {...props}
            ref={mesh}
        >
            {buildings}
        </mesh>

    )
}

function City (props: JSX.IntrinsicElements['mesh']) {
    const mesh = useRef<THREE.Mesh>(null!);
    useFrame((state, delta) => {
        //mesh.current.rotation.y += 0.0025;
    })

    return (
        <mesh
            {...props}
            ref={mesh}
        >
            <CityBase />
            <Buildings />
        </mesh>
    )
}

function CameraController () {
    const {camera, gl } = useThree();
    useEffect(() => {
        const controls = new OrbitControls(camera, gl.domElement);
        controls.target = new THREE.Vector3(0,0,0);
        controls.minDistance = 3;
        controls.maxDistance = 20;
        return () => {
            controls.dispose();
        };
    }, [camera, gl])

    return null;
}

export const ModelViewer = () => {
    const [render, rerender] = useState(false);

    return (
        <div>
            <Canvas style={{height: '500px'}}>
                <ambientLight />
                <pointLight position={[5,5,5]} />
                <pointLight position={[-5,5,-5]} />
                <pointLight position={[-5,5,5]} />
                <pointLight position={[5,5,-5]} />
                <City />
                <CameraController />
            </Canvas>
            <button onClick={() => {rerender(!render)}}
                style={{borderRadius: '0.65em'}}>New noise</button>
        </div>
    );
}
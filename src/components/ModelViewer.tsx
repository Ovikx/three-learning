import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { NoiseGenerator } from './PerlinNoise';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const basePlateLength = 5;
const subdivisions = 25;
const gen = new NoiseGenerator();
const heightMap: number[][] = gen.generate(6, 6);

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
    const mesh = useRef<THREE.Mesh>(null!);
    const buildings = [];
    let counter = 0;
    for (let i = 1; i < subdivisions; i++) {
        for (let j = 1; j < subdivisions; j++) {
            const x = i*(basePlateLength/subdivisions)-(basePlateLength/2);
            const y = 0.25;
            const z = j*(basePlateLength/subdivisions)-(basePlateLength/2);
            const height: number = Math.pow(heightMap[i][j]*2, 2);
            const width = basePlateLength/(subdivisions*1.5)

            buildings.push(
                <mesh
                    {...props}
                    ref={mesh}
                    position={[x,y,z]}
                    key={counter}
                >
                        <boxGeometry args={[width, height, width]} />
                        <meshStandardMaterial
                            color={new THREE.Color(0xfcba03)}
                            metalness={1}
                            roughness={0.3}
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
    return (
        <Canvas style={{height: '500px'}}>
            <ambientLight />
            <pointLight position={[10,10,10]} />
            <City />
            <CameraController />
        </Canvas>
    );
}
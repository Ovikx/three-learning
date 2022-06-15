import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const basePlateLength = 5;
const subdivisions = 25;

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
            const height = Math.random()*2;
            const width = basePlateLength/(subdivisions*1.5)

            buildings.push(
                <mesh
                    {...props}
                    ref={mesh}
                    position={[x,y,z]}
                    key={counter}
                >
                        <boxGeometry args={[width, height, width]} />
                </mesh>
            );
            counter++;
            console.log(`added mesh at: ${x}, ${y}, ${z}`);
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
        mesh.current.rotation.y += 0.0025;
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

function Camera () {
    useFrame(({camera}) => {
        camera.position.y = 2
        camera.setRotationFromAxisAngle(new THREE.Vector3(1,0,0), -0.3);
    });
    return null;
}

export const ModelViewer = () => {
    return (
        <Canvas style={{height: '500px'}}>
            <ambientLight />
            <pointLight position={[10,10,10]} />
            <City />
            <Camera />
        </Canvas>
    );
}
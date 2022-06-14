import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

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

function City (props: JSX.IntrinsicElements['mesh']) {
    const mesh = useRef<THREE.Mesh>(null!);
    useFrame((state, delta) => mesh.current.rotation.y += 0.0025);

    return (
        <mesh
            {...props}
            ref={mesh}
        >
            <boxGeometry args={[5,0.25,5]} />
            <meshStandardMaterial color={'dimgray'} />
        </mesh>
    );
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
            <City position={[0,0,0]} />
            <Camera />
        </Canvas>
    );
}
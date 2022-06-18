import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Segment } from './SkyscraperViewer';

export function createBuilding (buildType: string, colorPallete: string): Segment[] {
    let segments: Segment[] = [];

    switch (buildType) {
        // 
        case 'spike-up': {
            const numSegments = Math.random()*3 + 3;
            let currentLength = Math.random()*0.1+3;
            let baseDecrement = 0.9 * currentLength / numSegments;

            for (let i = 0; i < numSegments; i++) {
                const length = currentLength - baseDecrement;
                const height = Math.random()*3 + 0.5;
                segments.push(
                    {
                        length: length,
                        height: height,
                        width: length
                    }
                );
                currentLength = length;
            }
        }
    }

    return segments;
}
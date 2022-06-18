import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Segment } from './SkyscraperViewer';

export function createBuilding (buildType: string, colorPallete: string): Segment[] {
    let segments: Segment[] = [];

    const randRange = (max: number, min: number): number => {
        return Math.random() * (max-min) + min;
    }

    switch (buildType) {
        case 'spike-up': {
            const numSegments = Math.floor(randRange(3,7));
            let currentLength = randRange(0.3,0.4);
            let baseDecrement = 0.9 * currentLength / numSegments;

            for (let i = 0; i < numSegments; i++) {
                const length = currentLength - baseDecrement;
                const height = randRange(0.3, 0.5);
                segments.push(
                    {
                        length: length,
                        height: height,
                        width: length
                    }
                );
                currentLength = length;
            }
            break;
        }

        case 'ribbed': {
            const numSegments = Math.floor(randRange(6,10));
            const lengths: number[] = [randRange(0.3, 0.5), randRange(0.25,0.3)];

            for (let i = 0; i < numSegments; i++) {
                const height = randRange(0.1, 0.15);
                const length = lengths[i%2];
                segments.push(
                    {
                        length: length,
                        height: height,
                        width: length
                    }
                );
            }
            const antennaLength = randRange(0.01, 0.02);
            const antennaHeight = randRange(0.3, 0.7);
            segments.push({
                length: antennaLength,
                height: antennaHeight,
                width: antennaLength
            });

            break;
        }
    }

    return segments;
}
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { TextureLoader, Mesh, Group } from "three";
import * as THREE from "three";

import img1 from "~/assets/landing_page/frame_images/img1.jpg";
import img2 from "~/assets/landing_page/frame_images/img2.jpg";
import img3 from "~/assets/landing_page/frame_images/img3.jpg";
import img4 from "~/assets/landing_page/frame_images/img4.jpg";
import img5 from "~/assets/landing_page/frame_images/img5.jpg";
import img6 from "~/assets/landing_page/frame_images/img6.jpg";
import img7 from "~/assets/landing_page/frame_images/img7.jpg";
import img8 from "~/assets/landing_page/frame_images/img8.jpg";

type PictureFrameProps = {
    imageSize: [number, number];
    frameThickness: number;
    frameDepth: number;
    frameColor: string;
};

function PictureFrame({
    imageSize,
    frameThickness,
    frameDepth,
    frameColor,
}: PictureFrameProps) {
    const frameWidth = imageSize[0] + frameThickness;
    const frameHeight = imageSize[1] + frameThickness;
    const frameMaterial = new THREE.MeshStandardMaterial({
        color: frameColor,
        metalness: 2,
    });

    return (
        <>
            {/* Top frame piece */}
            <mesh position={[0, imageSize[1] / 2 + frameThickness / 2, 0]}>
                <boxGeometry
                    args={[
                        frameWidth + frameThickness,
                        frameThickness,
                        frameDepth,
                    ]}
                />
                <primitive object={frameMaterial} attach="material" />
            </mesh>

            {/* Bottom frame piece */}
            <mesh position={[0, -imageSize[1] / 2 - frameThickness / 2, 0]}>
                <boxGeometry
                    args={[
                        frameWidth + frameThickness,
                        frameThickness,
                        frameDepth,
                    ]}
                />
                <primitive object={frameMaterial} attach="material" />
            </mesh>

            {/* Left frame piece */}
            <mesh position={[-imageSize[0] / 2 - frameThickness / 2, 0, 0]}>
                <boxGeometry args={[frameThickness, frameHeight, frameDepth]} />
                <primitive object={frameMaterial} attach="material" />
            </mesh>

            {/* Right frame piece */}
            <mesh position={[imageSize[0] / 2 + frameThickness / 2, 0, 0]}>
                <boxGeometry args={[frameThickness, frameHeight, frameDepth]} />
                <primitive object={frameMaterial} attach="material" />
            </mesh>
        </>
    );
}

const images = [img1, img2, img3, img4, img5, img6, img7, img8];
function FlippingSquare() {
    const imgMeshRef = useRef<Mesh>(null);
    const frameMeshRef = useRef<Group>(null);
    const { viewport } = useThree();

    const [scrollY, setScrollY] = useState(0);
    const imgSize: [number, number] = [2, 2];

    // Update scrollY on scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scaling = Math.min(1, viewport.width / 3);
    const deg90 = Math.PI / 2;
    const rotationYValue = scrollY * 0.006 + deg90;

    const textures = useLoader(TextureLoader, images);
    const imgIndex =
        Math.floor((rotationYValue - deg90) / (deg90 * 2)) % images.length;
    // current image
    const texture = textures[Math.max(imgIndex, 0)];

    const calculatedRotation: [number, number, number] = [
        0.1,
        rotationYValue,
        -1.3 + scrollY * 0.003,
    ];
    const calculatedPosition: [number, number, number] = [
        Math.cos(scrollY * 0.004) * 0.35 * scaling,
        Math.min(-10 + scrollY * 0.03, 0),
        Math.max(15 - scrollY * 0.045, 0),
    ];

    return (
        <>
            {/* image mesh */}
            <mesh
                ref={imgMeshRef}
                scale={scaling}
                rotation={calculatedRotation}
                position={calculatedPosition}
            >
                <planeGeometry args={imgSize} />
                <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
            </mesh>

            {/* frame mesh */}
            <group
                ref={frameMeshRef}
                scale={scaling}
                rotation={calculatedRotation}
                position={calculatedPosition}
            >
                <PictureFrame
                    imageSize={imgSize}
                    frameThickness={0.08}
                    frameDepth={0.2}
                    frameColor={"#595959"}
                />
            </group>
        </>
    );
}

export default function ThreeCanvas() {
    const [mounted, setMounted] = useState(false);

    // Wait for the component to mount, prevent SSR warning of undefined document
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    return (
        <Canvas
            className="pointer-events-none inset-0 z-10"
            style={{
                position: "fixed",
            }}
            camera={{ fov: 40, position: [0, 0, -5] }}
        >
            <ambientLight intensity={1.2} />
            <directionalLight
                color={"#fff"}
                position={[3, 5, -10]}
                intensity={1.8}
            />
            <FlippingSquare />
        </Canvas>
    );
}

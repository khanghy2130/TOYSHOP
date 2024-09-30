import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TextureLoader, Mesh, Group } from "three";
import * as THREE from "three";

import img1 from "~/assets/landing_page_products_images/img1.jpg";
import img2 from "~/assets/landing_page_products_images/img2.jpg";
import img3 from "~/assets/landing_page_products_images/img3.jpg";
import img4 from "~/assets/landing_page_products_images/img4.jpg";

type PictureFrameProps = {
    imageSize: [number, number, number];
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
        roughness: 0,
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

function FlippingSquare() {
    const imgSize: [number, number, number] = [3, 3, 0.1];
    const images = [img1, img2, img3, img4];
    const [imgIndex, setImgIndex] = useState<number>(0);
    const imgMeshRef = useRef<Mesh>(null);
    const frameMeshRef = useRef<Group>(null);
    const texture = useLoader(TextureLoader, images[imgIndex]);
    const { viewport } = useThree();
    let scaling = Math.min(1, viewport.width / 5);

    let rotation = Math.PI / 2;

    useFrame(() => {
        if (!imgMeshRef.current || !frameMeshRef.current) return;
        // Rotate the square frame
        rotation += 0.02;
        imgMeshRef.current.rotation.y = rotation;
        frameMeshRef.current.rotation.y = rotation;

        // Change the image when the frame completes a flip (180 degrees)
        if (Math.abs(rotation % ((Math.PI / 2) * 3)) < 0.05) {
            setImgIndex((imgIndex + 1) % images.length); // Loop through the images
        }
    });

    return (
        <>
            {/* image mesh */}
            <mesh ref={imgMeshRef} scale={scaling}>
                <boxGeometry args={imgSize} />
                <meshBasicMaterial map={texture} />
            </mesh>

            {/* frame mesh */}
            <group ref={frameMeshRef} scale={scaling}>
                <PictureFrame
                    imageSize={imgSize}
                    frameThickness={0.2}
                    frameDepth={0.4}
                    frameColor={"#fc36b0"}
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

    return createPortal(
        <Canvas
            className="left-0 top-0 -z-10 h-full w-full"
            style={{ position: "fixed" }}
        >
            <ambientLight intensity={0.1} />
            <directionalLight
                color={"#ffffff"}
                position={[0, 10, 10]}
                intensity={1.5}
            />
            <FlippingSquare />
        </Canvas>,
        document.body,
    );
}

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TextureLoader, Mesh } from "three";

import img1 from "~/assets/landing_page_products_images/img1.jpg";
import img2 from "~/assets/landing_page_products_images/img2.jpg";
import img3 from "~/assets/landing_page_products_images/img3.jpg";
import img4 from "~/assets/landing_page_products_images/img4.jpg";

function FlippingSquare() {
    const images = [img1, img2, img3, img4];
    const meshRef = useRef<Mesh>(null);
    const [index, setIndex] = useState(0);
    const texture = useLoader(TextureLoader, images[index]);

    let rotation = Math.PI / 2;

    useFrame(() => {
        if (!meshRef.current) return;
        // Rotate the square frame
        rotation += 0.02;
        meshRef.current.rotation.y = rotation;

        // Change the image when the frame completes a flip (180 degrees)
        if (Math.abs(rotation % ((Math.PI / 2) * 3)) < 0.05) {
            setIndex((index + 1) % images.length); // Loop through the images
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[3, 3, 0.01]} />
            <meshBasicMaterial map={texture} />
        </mesh>
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
            <ambientLight />
            <FlippingSquare />
        </Canvas>,
        document.body,
    );
}

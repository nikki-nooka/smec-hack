import React, { useRef, useEffect, lazy } from 'react';

const Globe = lazy(() => import('react-globe.gl'));

export const RotatingGlobe: React.FC = () => {
    const globeEl = useRef<any>(null);

    useEffect(() => {
        if (globeEl.current) {
            const controls = globeEl.current.controls();
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.4;
            controls.enableZoom = false;
        }
    }, []);

    return (
        <Globe
            ref={globeEl}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundColor="rgba(0,0,0,0)"
            enablePointerInteraction={false}
        />
    );
};

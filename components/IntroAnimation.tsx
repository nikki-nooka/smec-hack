import React, { useEffect, useState, useMemo } from 'react';

interface IntroAnimationProps {
    onComplete: () => void;
}

type AnimationStage = 'initial' | 'chaos' | 'conductor' | 'creation' | 'resonance' | 'legacy' | 'fading';

const earthTextureUrl = "https://raw.githubusercontent.com/turban/web-stuff/master/earth/earth-dark-specular.jpg";
const cloudTextureUrl = "https://raw.githubusercontent.com/turban/web-stuff/master/earth/clouds.png";
const starfieldBg = "radial-gradient(ellipse at center, rgba(10, 15, 30, 1) 0%, rgba(5, 8, 15, 1) 100%)";

const ChaosParticle: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute h-[2px] w-[50px] bg-gradient-to-r from-transparent to-red-500" style={style}></div>
);

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
    const [stage, setStage] = useState<AnimationStage>('initial');

    useEffect(() => {
        const timers = [
            setTimeout(() => setStage('chaos'), 100),
            setTimeout(() => setStage('conductor'), 1500),
            setTimeout(() => setStage('creation'), 3000),
            setTimeout(() => setStage('resonance'), 5000),
            setTimeout(() => setStage('legacy'), 6000),
            setTimeout(() => setStage('fading'), 7000),
            setTimeout(onComplete, 7800)
        ];
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    const chaosParticles = useMemo(() => {
        return Array.from({ length: 100 }).map((_, i) => ({
            id: i,
            style: {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `chaos-stream 3s linear ${Math.random() * 1.5}s infinite`,
            }
        }));
    }, []);

    const isVisible = (s: AnimationStage) => stage === s;
    const hasReached = (s: AnimationStage) => stage >= s;

    return (
        <div 
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-700 overflow-hidden ${stage === 'fading' ? 'opacity-0' : 'opacity-100'}`}
            style={{ background: starfieldBg }}
        >
            {/* Stage 1: Chaos */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${!hasReached('conductor') ? 'opacity-100' : 'opacity-0'}`}>
                {isVisible('chaos') && chaosParticles.map(p => <ChaosParticle key={p.id} style={p.style} />)}
            </div>

            {/* Stage 2 & 3: Conductor and Creation */}
            <div className={`
                absolute w-96 h-96 transition-all duration-1500 ease-in-out
                ${hasReached('legacy') ? 'scale-[0.25] -translate-y-24' : 'scale-100'}
            `}>
                {/* Conductor Orb */}
                <div className={`
                    absolute inset-0 rounded-full bg-blue-500
                    transition-all duration-1000
                    ${hasReached('creation') ? 'opacity-0 scale-150' : 'opacity-70 scale-100'}
                `} style={{
                    boxShadow: '0 0 50px 10px #3b82f6, inset 0 0 30px #fff',
                    animation: `conductor-pulse 2s infinite ease-in-out`
                }}></div>

                {/* Earth Layers */}
                <div className={`
                    absolute inset-0 transition-opacity duration-1500 delay-500
                    ${hasReached('creation') ? 'opacity-100' : 'opacity-0'}
                `}>
                    <div className="absolute inset-0 rounded-full" style={{
                        background: 'radial-gradient(circle at 30% 30%, rgba(150, 180, 255, 0.3), transparent 70%), #1c2e4a',
                        animation: 'slow-spin 120s linear infinite'
                    }}/>
                    <div className="absolute inset-0 rounded-full" style={{
                        backgroundImage: `url(${earthTextureUrl})`,
                        backgroundSize: 'cover',
                        mixBlendMode: 'overlay',
                        opacity: 0.7,
                        animation: 'slow-spin 80s linear infinite reverse',
                        maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
                        animationName: `earth-paint-reveal, slow-spin`,
                        animationDuration: `2s, 80s`,
                        animationTimingFunction: `ease-out, linear`,
                        animationIterationCount: `1, infinite`,
                        animationDirection: `normal, reverse`,
                        animationFillMode: 'forwards'
                    }}/>
                    <div className="absolute inset-0 rounded-full" style={{
                        backgroundImage: `url(${cloudTextureUrl})`,
                        backgroundSize: 'cover',
                        mixBlendMode: 'screen',
                        opacity: 0.3,
                        animation: 'cloud-drift 50s linear infinite',
                    }}/>
                    <div className="absolute inset-0 rounded-full" style={{
                        boxShadow: 'inset 0 0 80px 20px #05080f, 0 0 20px -5px #3b82f6',
                    }}/>
                </div>

                {/* Resonance Ring */}
                <div className={`
                    absolute inset-0 rounded-full border-blue-300
                    ${isVisible('resonance') ? 'opacity-100 animate-[aegis-resonance_1s_cubic-bezier(0.19,1,0.22,1)_forwards]' : 'opacity-0'}
                `}></div>
            </div>

            {/* Stage 5: Brand Reveal */}
            <div className={`
                absolute text-center
                transition-opacity duration-1000
                ${hasReached('legacy') ? 'opacity-100' : 'opacity-0'}
            `}>
                 <div style={{animation: `brand-materialize 1s ease-out forwards`}}>
                    <h1 
                        className="text-5xl md:text-6xl font-bold text-white tracking-tight" 
                        style={{ textShadow: '0 0 25px rgba(147, 197, 253, 0.7)' }}
                    >
                        GeoSick
                    </h1>
                    <p className="text-base md:text-lg text-blue-200 mt-2 tracking-wider">
                        AI-Powered Environmental Health Intelligence
                    </p>
                </div>
            </div>
        </div>
    );
};
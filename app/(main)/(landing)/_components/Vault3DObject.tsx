import { Suspense } from 'react';
import Spline from '@splinetool/react-spline/next';

export default function Vault3DObject() {
    return (
        <div className="aboslute aspect-square">
            <Suspense fallback={<div>Loading...</div>}>
                <Spline
                    scene="https://prod.spline.design/83XZaXzRG30dL4fJ/scene.splinecode"
                />
            </Suspense>
        </div>
    )
}
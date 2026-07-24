// import dynamic from "next/dynamic";
import { Suspense } from 'react';

// const Spline = dynamic(() => import('@splinetool/react-spline'),
//     { ssr: false, loading: () => <div>Loading...</div> }
// )

import Spline from '@splinetool/react-spline/next';

export default function Vault3DObject() {
    return (
        <div className="aboslute aspect-square">
            <Suspense fallback={<div>Loading...</div>}>
                <Spline
                    scene="https://prod.spline.design/83XZaXzRG30dL4fJ/scene.splinecode"
                // className="pointer-events-none w-full h-full"
                // onLoad={(spline) => {
                //     spline.setSize(1500, 1500);
                //     spline.setZoom(2);
                // }}
                />
            </Suspense>
        </div>
    )
}
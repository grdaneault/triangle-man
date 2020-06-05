import { useState, useEffect } from 'react';

// Hook
export default function useWindowSize(useInnerDimensions=true) {
    const boundingRect = document.getElementsByTagName("html")[0].getBoundingClientRect();

    function getSize() {
        return {
            width: useInnerDimensions ? window.innerWidth : boundingRect.width,
            height: useInnerDimensions ? window.innerHeight : boundingRect.height
        };
    }

    const [windowSize, setWindowSize] = useState(getSize);

    useEffect(() => {
        function handleResize() {
            setWindowSize(getSize());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [getSize]);

    return windowSize;
}

import {useState, useEffect, useCallback} from 'react';

// Hook
export default function useWindowSize(useInnerDimensions=true) {
    const boundingRect = document.getElementsByTagName("html")[0].getBoundingClientRect();

    const getSize = useCallback(() => ({
            width: useInnerDimensions ? window.innerWidth : boundingRect.width,
            height: useInnerDimensions ? window.innerHeight : boundingRect.height
    }), [boundingRect.height, boundingRect.width, useInnerDimensions]);


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

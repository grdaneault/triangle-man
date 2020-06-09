import {useEffect, useState} from 'react';

export default function useTimeDelay(ms) {
    const [hasTriggered, setTriggered] = useState(false);

    useEffect(
        () => {
            const timeout = setTimeout(() => setTriggered(true), ms);
            return () => clearTimeout(timeout);
        },
        [ms]
    );

    return [hasTriggered];
}
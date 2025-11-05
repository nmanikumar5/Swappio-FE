declare module 'nprogress' {
    const nprogress: {
        start: () => void;
        done: () => void;
        configure?: (opts: any) => void;
    };
    export default nprogress;
}
declare module 'nprogress/*';

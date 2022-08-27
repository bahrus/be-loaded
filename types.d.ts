import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface BeLoadedVirtualProps extends MinimalProxy<HTMLStyleElement>{
    CDNFallback: string;
    path: string;
    version: string;
    removeStyle: string | boolean;
}

export interface BeLoadedProps extends BeLoadedVirtualProps{
    proxy: HTMLStyleElement & BeLoadedVirtualProps;
}

export interface BeLoadedActions {

    intro(proxy: HTMLStyleElement & BeLoadedVirtualProps, target: HTMLStyleElement, beDecor: BeDecoratedProps): void;
    onPath(self: this): Promise<void>;
    
}




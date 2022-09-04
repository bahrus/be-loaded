import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface BeLoadedEndUserProps {
    CDNFallback?: string;
    path?: string;
    version?: string;
    removeStyle?: string | boolean;
}
export interface BeLoadedVirtualProps extends BeLoadedEndUserProps, MinimalProxy<HTMLStyleElement>{

}

export type Proxy = HTMLStyleElement & BeLoadedVirtualProps;

export interface ProxyProps extends BeLoadedVirtualProps{
    proxy: Proxy;
}

export interface Controller{
    proxy: Proxy;
}

export type PP = ProxyProps;


export interface BeLoadedActions {
    onPath(pp: PP): Promise<void>;
}




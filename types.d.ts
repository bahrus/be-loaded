import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface EndUserProps {
    CDNFallback?: string;
    path?: string;
    version?: string;
    removeStyle?: string | boolean;
}
export interface VirtualProps extends EndUserProps, MinimalProxy<HTMLStyleElement>{

}

export type Proxy = HTMLStyleElement & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export interface Controller{
    proxy: Proxy;
}

export type PP = ProxyProps;


export interface Actions {
    onPath(pp: PP): Promise<void>;
}




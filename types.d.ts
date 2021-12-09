import {BeDecoratedProps} from 'be-decorated/types';

export interface ILoadParams{
    preloadRef?: string;
    fallback?: string;
}

export interface BeLoadedVirtualProps extends ILoadParams{
    stylesheets: ILoadParams[];
}

export interface BeLoadedProps extends BeLoadedVirtualProps{
    proxy: HTMLStyleElement & BeLoadedVirtualProps;
}

export interface BeLoadedActions {
    onLoadParams(self: this): void;
    onStylesheets(self: this): void;
}


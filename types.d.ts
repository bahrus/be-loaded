import {BeDecoratedProps} from 'be-decorated/types';



export interface ILoadParams{
    // preloadRef?: string;
    // fallback?: string;
    // needsRedoing?: boolean;
    // ifMedia?: string;
    
}

export interface BeLoadedVirtualProps extends ILoadParams{
    // stylesheets: ILoadParams[];
    // removeStyle: string | boolean;
}

export interface BeLoadedProps extends BeLoadedVirtualProps{
    proxy: HTMLStyleElement & BeLoadedVirtualProps;
}

export interface BeLoadedActions {
    // onLoadParams(self: this): void;
    // onStylesheets(self: this): void;
    // intro(proxy: HTMLStyleElement & BeLoadedVirtualProps, target: HTMLStyleElement): void;
    
}

// export interface BeLoadedState {
// }

// export interface StylesheetImport{
//     default: StyleSheet;
// }


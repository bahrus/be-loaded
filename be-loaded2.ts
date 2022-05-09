import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeLoadedVirtualProps, BeLoadedActions, BeLoadedProps, ILoadParams} from './types';
import {register} from 'be-hive/register.js';

export class BeLoaded implements BeLoadedActions{

}

export interface BeLoaded extends BeLoadedProps{}

const tagName = 'be-loaded';

const ifWantsToBe = 'loaded';

const upgrade = 'style';

define<BeLoadedProps & BeDecoratedProps<BeLoadedProps, BeLoadedActions>, BeLoadedActions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            forceVisible: ['style'],
        },
        actions:{
        },
    },
    complexPropDefaults:{
        controller: BeLoaded,
    },
});

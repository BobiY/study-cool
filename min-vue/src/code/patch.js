import {h} from "../../node_modules/snabbdom/build/package/h";
import { init } from "../../node_modules/snabbdom/build/package/init";
import { classModule } from '../../node_modules/snabbdom/build/package/modules/class'
import { propsModule } from '../../node_modules/snabbdom/build/package/modules/props'
import { styleModule } from '../../node_modules/snabbdom/build/package/modules/style'
import { eventListenersModule } from '../../node_modules/snabbdom/build/package/modules/eventlisteners'
import { vModalModule } from "./v-modal";
import { attributesModule } from "../../node_modules/snabbdom/build/package/modules/attributes";

const patch = init([
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    vModalModule,
    attributesModule
])


export {h, patch}
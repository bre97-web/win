import Router from '@/router/index'
import '@/scripts/importStyles'
import '@/scripts/importMaterial'
import '@/typography/Typo'
import { registerGlobalComponents } from '@/scripts/registerGlobalComponents'
import { piniaInstance } from  '@/scripts/createPiniaInstance'
import { windowsInstance } from '@/scripts/createWindowsVueInstance'
import { windowScreenMaskInstance } from './window-screen-mask'
import { initFluentDesignBaseColor } from './components/fluent-ui/fluent-components'

/**
 * Core Instance
 */
windowsInstance
    .use(piniaInstance)
    .use(registerGlobalComponents)
    .use(Router)
    .mount('#window')

windowScreenMaskInstance.mount('#window-screen-mask')
    
initFluentDesignBaseColor()

/**
 * Listenning to 'shutdown' of system settings
*/
import { useSystemStore } from '@/store/SystemStore'
import ShutdownApp from '@/startup/shutdown'
import { watch } from 'vue'
const system = useSystemStore()

watch(() => system.needShutdown, () => {
    windowsInstance.unmount()
    windowScreenMaskInstance.unmount()
    
    ShutdownApp.mount('#window')
})
watch(() => system.isShutdown, () => {
    if(system.isShutdown) {
        setTimeout(() => {
            document.documentElement.style.backgroundColor = '#000'
            document.body.remove()
            ShutdownApp.unmount()
        }, 500)
    }
})

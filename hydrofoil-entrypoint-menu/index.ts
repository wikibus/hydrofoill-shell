import {computed, customElement, observe, property} from '@polymer/decorators'
import {html, PolymerElement} from '@polymer/polymer'
import {animationFrame} from '@polymer/polymer/lib/utils/async'
import {Debouncer} from '@polymer/polymer/lib/utils/debounce'
import {HydraResource} from 'alcaeus/types/Resources'
import {Helpers} from 'LdNavigation/ld-navigation'

import '@polymer/paper-item'
import '@polymer/paper-listbox'
import '@polymer/polymer/lib/elements/dom-repeat'
import 'paper-collapse-item/paper-collapse-item'

// @ts-ignore
import template from './template.html'

@customElement('hydrofoil-entrypoint-menu')
export default class extends PolymerElement {
    @property({ type: Object })
    public resource: HydraResource

    @property({ type: Object })
    public readonly entrypoint: HydraResource

    @property({ type: Boolean })
    public opened: boolean = false

    @property({ type: String })
    public homeLabel: string = 'Home'

    @computed('entrypoint')
    get links() {
        return this.entrypoint.apiDocumentation
            .getProperties(this.entrypoint.types[0])
            .filter((sp) => {
                return sp.property.types.indexOf('http://www.w3.org/ns/hydra/core#Link') !== -1
            })
    }

    @observe('links')
    private openWhenLoaded(newLinks, oldLinks) {
        Debouncer.debounce(null, animationFrame, () => {
            if (!oldLinks) {
                this.opened = true
            }
        })
    }

    private loadEntrypoint() {
        Helpers.fireNavigation(this, this.entrypoint.id)
    }

    private load(e: any) {
        Helpers.fireNavigation(this, this.entrypoint[e.target.link.property.id].id)
    }

    static get template() {
        return html([`${template}`] as any)
    }
}

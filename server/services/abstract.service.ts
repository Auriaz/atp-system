import type { EventHandlerRequest, H3Error, H3Event } from 'h3';
// import { joinURL } from "ufo";

export class AbstractService {
    event;
    constructor(event: H3Event<EventHandlerRequest>) {
        this.event = event
    }

    config() {
        return useRuntimeConfig()
    }

    // getPath(): string {
    //     const path = this.event.path

    //     return joinURL(this.getUrl(), path)
    // }
}
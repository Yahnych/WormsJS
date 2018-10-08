export abstract class BaseController {

    BASE_ROUTE: string

    constructor(namespace: string) {
        this.BASE_ROUTE = `/api/${namespace}`
    }
}
# YepApp Components

As mentions on the main [app doc](./app.md), components are used to break your application into
smaller, more cohesive, less coupled, and more manageable chunks.

Component's can range from either a slice of the application (a slice meaning across the layers (ui, app, domain, data), a specific function (push-notifications), to even a single module that plugins into another.

There are two groups of components: local and external. Both should be bundled as npm packages. The only difference is that external components live in another github repo.

Local components will have the npm namespace of `@app` (`@app/push-notifications` for example), whereas external components will use the `@yuzu` namespace (`@yuzu/auth`).

## Standard npm package structure

### Top level folders
- doc (markdown files)
- lib (source code)
- test
- node_modules

### Top level files
- package.json (with npm scripts for running githooks, lint, and tests)
- pre-commit and pre-push githook
- README.md
- jshint and gitignore configs
- index.js

### main module (entry point)
An npm packge can specify a main module, however the standard is to use the index.js module for this. Components use the index module to expose internal modules as well as an component class that can be used to bootstrap the component.

## Example index.js

```javascript
import PlaceOrder from "./lib/actions/PlaceOrder";
import OrderRepo from "./lib/repo/OrderRepoInStorage";
import StoreGateway from "./lib/gateways/StoreGateway";
import OrderError from "./lib/AuthError";

export default class OrderComponent {
    get metadata() { return { name: "@yuzu/auth" }; }
    bootstrap(spec) {
        spec.action(PlaceOrder)
            .creator("clientSession", ClientSession)
            .creator("orderRepo", OrderRepo)
            .creator("storeGateway", StoreGateway);
    }
}

export { OrderError };
```
The above contains exports for any modules that can be used by other components.
In addition, a default export class is used when for bootstrapping the component.

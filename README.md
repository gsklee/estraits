# es6-traits

I'll find some time to come up with a proper doc. Meanwhile, here's a short example:

**traits.js**
```javascript
import traits from 'es6-traits';
import React from 'react/addons';

export const {on, using} = traits();

export const autobind = {
  [Symbol.toStringTag]: 'autobind',

  constructor() {
    Object.getOwnPropertyNames(this.constructor.prototype)
          .filter(x => x.startsWith('on'))
          .map(x => this[x] = this[x].bind(this));
  }
};

export const purerender = Object.assign(React.addons.PureRenderMixin, {
  [Symbol.toStringTag]: 'purerender'
});
```

**some-component.js**
```javascript
import React from 'react';
import {on, using, autobind, purerender} from './traits';

export default class SomeComponent extends (on (React.Component), using (autobind, purerender)) {
  ...
}
```

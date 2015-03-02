import mixin from 'smart-mixin';

var cache = {},
    BaseClass;

export default function(registry, {
  naming = false,

  ruleset = {
    ReactComponent: {
      componentWillMount: 'MANY',
      componentDidMount: 'MANY',
      componentWillReceiveProps: 'MANY',
      shouldComponentUpdate: 'ONCE',
      componentWillUpdate: 'MANY',
      componentDidUpdate: 'MANY',
      componentWillUnmount: 'MANY',

      getInitialState: 'MANY_MERGED',
      getDefaultProps: 'MANY_MERGED'
    }
  }
} = {}) {
  return {
    on(baseclass) {
      BaseClass = baseclass;
    },

    using(descriptor) {
      const traits = descriptor[0].split(' '),
            traitsClassName = `${BaseClass.name}_with_${traits.join('_and_')}`;

      if (cache[traitsClassName]) {
        return cache[traitsClassName];
      } else {
        class TraitsClass extends BaseClass {
          constructor(...args) {
            super(...args);

            traits.map(x => {
              const {constructor, ...methods} = registry[x];

              'constructor' === constructor.name && constructor.call(this);

              return mixin(ruleset[BaseClass.name] ? Object.keys(ruleset[BaseClass.name])
                                                           .reduce((m, n) => {
                                                             m[n] = mixin[ruleset[BaseClass.name][n]];

                                                             return m;
                                                           }, {}) :
                           {})(this.constructor.prototype, methods);
            });
          }
        }

        naming && eval(`TraitsClass = (function (BaseClass) {
                          ${TraitsClass.toString().split('TraitsClass').join(traitsClassName)}
                          _inherits(${traitsClassName}, BaseClass);

                          return ${traitsClassName};
                        })(BaseClass);`);

        return cache[traitsClassName] = TraitsClass;
      }
    }
  };
}

import mixin from 'smart-mixin';

var cache = {},
    BaseClass;

export default function(registry, ruleset) {
  return {
    on(baseclass) {
      BaseClass = baseclass;
    },

    using(descriptor) {
      const traits = descriptor[0].split(' '),
            cacheName = `${BaseClass.name}+${traits.join('+')}`;

      if (cache[cacheName]) {
        return cache[cacheName];
      } else {
        return cache[cacheName] = class TraitsClass extends BaseClass {
          constructor(...args) {
            super(...args);

            traits.map(x => {
              const {constructor, ...methods} = registry[x];

              'constructor' === constructor.name && constructor.call(this);

              return mixin(ruleset ? Object.keys(ruleset).reduce((m, n) => {
                                                           m[n] = mixin[ruleset[n]];

                                                           return m;
                                                         }, {}) :
                     'ReactComponent' === BaseClass.name ? {
                                                             componentWillMount: mixin.MANY,
                                                             componentDidMount: mixin.MANY,
                                                             componentWillReceiveProps: mixin.MANY,
                                                             shouldComponentUpdate: mixin.ONCE,
                                                             componentWillUpdate: mixin.MANY,
                                                             componentDidUpdate: mixin.MANY,
                                                             componentWillUnmount: mixin.MANY,

                                                             getInitialState: mixin.MANY_MERGED,
                                                             getDefaultProps: mixin.MANY_MERGED
                                                           } :
                     {})(this.constructor.prototype, methods);
            });
          }
        };
      }
    }
  };
}

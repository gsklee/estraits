import mixin from 'smart-mixin';

var cache = {},
    BaseClass;

export default function(registry, {ruleset, naming = true} = {}) {
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

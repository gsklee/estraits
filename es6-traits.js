import mixin from 'smart-mixin';

export default function(registry, ruleset) {
  var resolver = ruleset && mixin(Object.keys(ruleset).reduce((m, n) => {
                                                        m[n] = mixin[ruleset[n]];

                                                        return m;
                                                      }, {}));

  return function(BaseClass) {
    if (!resolver) {
      resolver = mixin('ReactComponent' === BaseClass.name ? {
                                                               componentWillMount: mixin.MANY,
                                                               componentDidMount: mixin.MANY,
                                                               componentWillReceiveProps: mixin.MANY,
                                                               shouldComponentUpdate: mixin.ONCE,
                                                               componentWillUpdate: mixin.MANY,
                                                               componentDidUpdate: mixin.MANY,
                                                               componentWillUnmount: mixin.MANY,

                                                               getInitialState: mixin.MANY_MERGED,
                                                               getDefaultProps: mixin.MANY_MERGED
                                                             } : {
                                                             });
    }

    return function(descriptor) {
      const traits = descriptor[0].split(' ');

      return class TraitsClass extends BaseClass {
        constructor(...args) {
          super(...args);

          traits.map(x => {
            const {constructor, ...methods} = registry[x];

            'constructor' === constructor.name && constructor.call(this);

            return resolver(this.constructor.prototype, methods);
          });
        }
      }
    };
  };
}

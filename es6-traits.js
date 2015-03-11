import mixin from 'smart-mixin';

var cache = {},
    BaseClass;

export default function({
  ruleset = {},
  naming = false
} = {}) {
  ruleset = Object.keys(ruleset)
                  .reduce((mixinRuleset, classRuleset) => {
                    mixinRuleset[classRuleset] = Object.keys(ruleset[classRuleset])
                                                       .reduce((mixinClassRuleset, methodRule) => {
                                                         mixinClassRuleset[methodRule] = mixin[ruleset[classRuleset][methodRule]];

                                                         return mixinClassRuleset;
                                                       }, {});

                    return mixinRuleset;
                  }, {});

  Object.assign(ruleset, {
    ReactComponent: {
      componentWillMount: mixin.MANY,
      componentDidMount: mixin.MANY,
      componentWillReceiveProps: mixin.MANY,
      shouldComponentUpdate: mixin.ONCE,
      componentWillUpdate: mixin.MANY,
      componentDidUpdate: mixin.MANY,
      componentWillUnmount: mixin.MANY,

      getInitialState: mixin.MANY_MERGED,
      getDefaultProps: mixin.MANY_MERGED
    }
  });

  return {
    on(baseclass) {
      BaseClass = baseclass;
    },

    using(...traits) {
      const traitsClassName = `${BaseClass.name}_with_${traits.map(x => x.toString().slice(8, -1)).join('_and_').replace(' ', '_')}`;

      if (cache[traitsClassName]) {
        return cache[traitsClassName];
      } else {
        class TraitsClass extends BaseClass {
          constructor(...args) {
            super(...args);

            traits.map(({constructor, ...methods}) => {
              'constructor' === constructor.name && constructor.call(this);

              mixin(ruleset[BaseClass.name] || {})(this.constructor.prototype, methods);
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

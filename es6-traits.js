import mixin from 'smart-mixin';

export default function(registry) {
  return function(BaseClass) {
    const resolver = mixin({
      componentWillMount: mixin.MANY,
      componentDidMount: mixin.MANY,
      componentWillReceiveProps: mixin.MANY,
      shouldComponentUpdate: mixin.ONCE,
      componentWillUpdate: mixin.MANY,
      componentDidUpdate: mixin.MANY,
      componentWillUnmount: mixin.MANY,

      getInitialState: mixin.MANY_MERGED,
      getDefaultProps: mixin.MANY_MERGED
    });

    return function(descriptor) {
      const traits = descriptor[0].split(' ');

      return class TraitsClass extends BaseClass {
        constructor(...args) {
          super(...args);

          traits.map(x => resolver(this.constructor.prototype, registry[x]));
        }
      }
    };
  };
}

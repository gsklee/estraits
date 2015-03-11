"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var mixin = _interopRequire(require("smart-mixin"));

var objectMap = function (object, transformation) {
  return Object.keys(object).reduce(function (m, n) {
    m[n] = transformation(object[n]);

    return m;
  }, {});
};

var cache = {},
    BaseClass;

module.exports = function () {
  var _ref = arguments[0] === undefined ? {} : arguments[0];

  var _ref$ruleset = _ref.ruleset;
  var ruleset = _ref$ruleset === undefined ? {} : _ref$ruleset;
  var _ref$naming = _ref.naming;
  var naming = _ref$naming === undefined ? false : _ref$naming;

  ruleset = objectMap(ruleset, function (x) {
    return objectMap(x, function (y) {
      return mixin[y];
    });
  });

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
    on: function on(baseclass) {
      BaseClass = baseclass;
    },

    using: function using() {
      for (var _len = arguments.length, traits = Array(_len), _key = 0; _key < _len; _key++) {
        traits[_key] = arguments[_key];
      }

      var traitsClassName = "" + BaseClass.name + "_with_" + traits.map(function (x) {
        return x.toString().slice(8, -1);
      }).join("_and_").replace(" ", "_");

      if (cache[traitsClassName]) {
        return cache[traitsClassName];
      } else {
        var _ret = (function () {
          var TraitsClass = (function (_BaseClass) {
            function TraitsClass() {
              var _this3 = this;

              for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
              }

              _classCallCheck(this, TraitsClass);

              _BaseClass.call.apply(_BaseClass, [this].concat(args));

              traits.map(function (_ref2) {
                var constructor = _ref2.constructor;

                var methods = _objectWithoutProperties(_ref2, ["constructor"]);

                "constructor" === constructor.name && constructor.call(_this3);

                mixin(ruleset[BaseClass.name] || {})(_this3.constructor.prototype, methods);
              });
            }

            _inherits(TraitsClass, _BaseClass);

            return TraitsClass;
          })(BaseClass);

          naming && eval("TraitsClass = (function (BaseClass) {\n                          " + TraitsClass.toString().split("TraitsClass").join(traitsClassName) + "\n                          _inherits(" + traitsClassName + ", BaseClass);\n\n                          return " + traitsClassName + ";\n                        })(BaseClass);");

          return {
            v: cache[traitsClassName] = TraitsClass
          };
        })();

        if (typeof _ret === "object") {
          return _ret.v;
        }
      }
    }
  };
};
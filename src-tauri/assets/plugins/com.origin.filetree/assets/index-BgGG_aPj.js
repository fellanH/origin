(function () {
  const R = document.createElement("link").relList;
  if (R && R.supports && R.supports("modulepreload")) return;
  for (const N of document.querySelectorAll('link[rel="modulepreload"]')) m(N);
  new MutationObserver((N) => {
    for (const C of N)
      if (C.type === "childList")
        for (const Z of C.addedNodes)
          Z.tagName === "LINK" && Z.rel === "modulepreload" && m(Z);
  }).observe(document, { childList: !0, subtree: !0 });
  function G(N) {
    const C = {};
    return (
      N.integrity && (C.integrity = N.integrity),
      N.referrerPolicy && (C.referrerPolicy = N.referrerPolicy),
      N.crossOrigin === "use-credentials"
        ? (C.credentials = "include")
        : N.crossOrigin === "anonymous"
          ? (C.credentials = "omit")
          : (C.credentials = "same-origin"),
      C
    );
  }
  function m(N) {
    if (N.ep) return;
    N.ep = !0;
    const C = G(N);
    fetch(N.href, C);
  }
})();
var fi = { exports: {} },
  ze = {};
var Sv;
function Id() {
  if (Sv) return ze;
  Sv = 1;
  var T = Symbol.for("react.transitional.element"),
    R = Symbol.for("react.fragment");
  function G(m, N, C) {
    var Z = null;
    if (
      (C !== void 0 && (Z = "" + C),
      N.key !== void 0 && (Z = "" + N.key),
      "key" in N)
    ) {
      C = {};
      for (var tl in N) tl !== "key" && (C[tl] = N[tl]);
    } else C = N;
    return (
      (N = C.ref),
      { $$typeof: T, type: m, key: Z, ref: N !== void 0 ? N : null, props: C }
    );
  }
  return ((ze.Fragment = R), (ze.jsx = G), (ze.jsxs = G), ze);
}
var gv;
function Pd() {
  return (gv || ((gv = 1), (fi.exports = Id())), fi.exports);
}
var Xl = Pd(),
  ci = { exports: {} },
  j = {};
var rv;
function l1() {
  if (rv) return j;
  rv = 1;
  var T = Symbol.for("react.transitional.element"),
    R = Symbol.for("react.portal"),
    G = Symbol.for("react.fragment"),
    m = Symbol.for("react.strict_mode"),
    N = Symbol.for("react.profiler"),
    C = Symbol.for("react.consumer"),
    Z = Symbol.for("react.context"),
    tl = Symbol.for("react.forward_ref"),
    p = Symbol.for("react.suspense"),
    A = Symbol.for("react.memo"),
    k = Symbol.for("react.lazy"),
    B = Symbol.for("react.activity"),
    vl = Symbol.iterator;
  function ql(y) {
    return y === null || typeof y != "object"
      ? null
      : ((y = (vl && y[vl]) || y["@@iterator"]),
        typeof y == "function" ? y : null);
  }
  var F = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    ol = Object.assign,
    Dl = {};
  function kl(y, E, O) {
    ((this.props = y),
      (this.context = E),
      (this.refs = Dl),
      (this.updater = O || F));
  }
  ((kl.prototype.isReactComponent = {}),
    (kl.prototype.setState = function (y, E) {
      if (typeof y != "object" && typeof y != "function" && y != null)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables.",
        );
      this.updater.enqueueSetState(this, y, E, "setState");
    }),
    (kl.prototype.forceUpdate = function (y) {
      this.updater.enqueueForceUpdate(this, y, "forceUpdate");
    }));
  function $t() {}
  $t.prototype = kl.prototype;
  function Bl(y, E, O) {
    ((this.props = y),
      (this.context = E),
      (this.refs = Dl),
      (this.updater = O || F));
  }
  var it = (Bl.prototype = new $t());
  ((it.constructor = Bl), ol(it, kl.prototype), (it.isPureReactComponent = !0));
  var At = Array.isArray;
  function Ql() {}
  var W = { H: null, A: null, T: null, S: null },
    xl = Object.prototype.hasOwnProperty;
  function _t(y, E, O) {
    var D = O.ref;
    return {
      $$typeof: T,
      type: y,
      key: E,
      ref: D !== void 0 ? D : null,
      props: O,
    };
  }
  function xu(y, E) {
    return _t(y.type, E, y.props);
  }
  function Ot(y) {
    return typeof y == "object" && y !== null && y.$$typeof === T;
  }
  function Zl(y) {
    var E = { "=": "=0", ":": "=2" };
    return (
      "$" +
      y.replace(/[=:]/g, function (O) {
        return E[O];
      })
    );
  }
  var Eu = /\/+/g;
  function Nt(y, E) {
    return typeof y == "object" && y !== null && y.key != null
      ? Zl("" + y.key)
      : E.toString(36);
  }
  function bt(y) {
    switch (y.status) {
      case "fulfilled":
        return y.value;
      case "rejected":
        throw y.reason;
      default:
        switch (
          (typeof y.status == "string"
            ? y.then(Ql, Ql)
            : ((y.status = "pending"),
              y.then(
                function (E) {
                  y.status === "pending" &&
                    ((y.status = "fulfilled"), (y.value = E));
                },
                function (E) {
                  y.status === "pending" &&
                    ((y.status = "rejected"), (y.reason = E));
                },
              )),
          y.status)
        ) {
          case "fulfilled":
            return y.value;
          case "rejected":
            throw y.reason;
        }
    }
    throw y;
  }
  function r(y, E, O, D, X) {
    var V = typeof y;
    (V === "undefined" || V === "boolean") && (y = null);
    var ul = !1;
    if (y === null) ul = !0;
    else
      switch (V) {
        case "bigint":
        case "string":
        case "number":
          ul = !0;
          break;
        case "object":
          switch (y.$$typeof) {
            case T:
            case R:
              ul = !0;
              break;
            case k:
              return ((ul = y._init), r(ul(y._payload), E, O, D, X));
          }
      }
    if (ul)
      return (
        (X = X(y)),
        (ul = D === "" ? "." + Nt(y, 0) : D),
        At(X)
          ? ((O = ""),
            ul != null && (O = ul.replace(Eu, "$&/") + "/"),
            r(X, E, O, "", function (pa) {
              return pa;
            }))
          : X != null &&
            (Ot(X) &&
              (X = xu(
                X,
                O +
                  (X.key == null || (y && y.key === X.key)
                    ? ""
                    : ("" + X.key).replace(Eu, "$&/") + "/") +
                  ul,
              )),
            E.push(X)),
        1
      );
    ul = 0;
    var Gl = D === "" ? "." : D + ":";
    if (At(y))
      for (var rl = 0; rl < y.length; rl++)
        ((D = y[rl]), (V = Gl + Nt(D, rl)), (ul += r(D, E, O, V, X)));
    else if (((rl = ql(y)), typeof rl == "function"))
      for (y = rl.call(y), rl = 0; !(D = y.next()).done; )
        ((D = D.value), (V = Gl + Nt(D, rl++)), (ul += r(D, E, O, V, X)));
    else if (V === "object") {
      if (typeof y.then == "function") return r(bt(y), E, O, D, X);
      throw (
        (E = String(y)),
        Error(
          "Objects are not valid as a React child (found: " +
            (E === "[object Object]"
              ? "object with keys {" + Object.keys(y).join(", ") + "}"
              : E) +
            "). If you meant to render a collection of children, use an array instead.",
        )
      );
    }
    return ul;
  }
  function _(y, E, O) {
    if (y == null) return y;
    var D = [],
      X = 0;
    return (
      r(y, D, "", "", function (V) {
        return E.call(O, V, X++);
      }),
      D
    );
  }
  function Y(y) {
    if (y._status === -1) {
      var E = y._result;
      ((E = E()),
        E.then(
          function (O) {
            (y._status === 0 || y._status === -1) &&
              ((y._status = 1), (y._result = O));
          },
          function (O) {
            (y._status === 0 || y._status === -1) &&
              ((y._status = 2), (y._result = O));
          },
        ),
        y._status === -1 && ((y._status = 0), (y._result = E)));
    }
    if (y._status === 1) return y._result.default;
    throw y._result;
  }
  var nl =
      typeof reportError == "function"
        ? reportError
        : function (y) {
            if (
              typeof window == "object" &&
              typeof window.ErrorEvent == "function"
            ) {
              var E = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof y == "object" &&
                  y !== null &&
                  typeof y.message == "string"
                    ? String(y.message)
                    : String(y),
                error: y,
              });
              if (!window.dispatchEvent(E)) return;
            } else if (
              typeof process == "object" &&
              typeof process.emit == "function"
            ) {
              process.emit("uncaughtException", y);
              return;
            }
            console.error(y);
          },
    sl = {
      map: _,
      forEach: function (y, E, O) {
        _(
          y,
          function () {
            E.apply(this, arguments);
          },
          O,
        );
      },
      count: function (y) {
        var E = 0;
        return (
          _(y, function () {
            E++;
          }),
          E
        );
      },
      toArray: function (y) {
        return (
          _(y, function (E) {
            return E;
          }) || []
        );
      },
      only: function (y) {
        if (!Ot(y))
          throw Error(
            "React.Children.only expected to receive a single React element child.",
          );
        return y;
      },
    };
  return (
    (j.Activity = B),
    (j.Children = sl),
    (j.Component = kl),
    (j.Fragment = G),
    (j.Profiler = N),
    (j.PureComponent = Bl),
    (j.StrictMode = m),
    (j.Suspense = p),
    (j.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = W),
    (j.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (y) {
        return W.H.useMemoCache(y);
      },
    }),
    (j.cache = function (y) {
      return function () {
        return y.apply(null, arguments);
      };
    }),
    (j.cacheSignal = function () {
      return null;
    }),
    (j.cloneElement = function (y, E, O) {
      if (y == null)
        throw Error(
          "The argument must be a React element, but you passed " + y + ".",
        );
      var D = ol({}, y.props),
        X = y.key;
      if (E != null)
        for (V in (E.key !== void 0 && (X = "" + E.key), E))
          !xl.call(E, V) ||
            V === "key" ||
            V === "__self" ||
            V === "__source" ||
            (V === "ref" && E.ref === void 0) ||
            (D[V] = E[V]);
      var V = arguments.length - 2;
      if (V === 1) D.children = O;
      else if (1 < V) {
        for (var ul = Array(V), Gl = 0; Gl < V; Gl++)
          ul[Gl] = arguments[Gl + 2];
        D.children = ul;
      }
      return _t(y.type, X, D);
    }),
    (j.createContext = function (y) {
      return (
        (y = {
          $$typeof: Z,
          _currentValue: y,
          _currentValue2: y,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (y.Provider = y),
        (y.Consumer = { $$typeof: C, _context: y }),
        y
      );
    }),
    (j.createElement = function (y, E, O) {
      var D,
        X = {},
        V = null;
      if (E != null)
        for (D in (E.key !== void 0 && (V = "" + E.key), E))
          xl.call(E, D) &&
            D !== "key" &&
            D !== "__self" &&
            D !== "__source" &&
            (X[D] = E[D]);
      var ul = arguments.length - 2;
      if (ul === 1) X.children = O;
      else if (1 < ul) {
        for (var Gl = Array(ul), rl = 0; rl < ul; rl++)
          Gl[rl] = arguments[rl + 2];
        X.children = Gl;
      }
      if (y && y.defaultProps)
        for (D in ((ul = y.defaultProps), ul))
          X[D] === void 0 && (X[D] = ul[D]);
      return _t(y, V, X);
    }),
    (j.createRef = function () {
      return { current: null };
    }),
    (j.forwardRef = function (y) {
      return { $$typeof: tl, render: y };
    }),
    (j.isValidElement = Ot),
    (j.lazy = function (y) {
      return { $$typeof: k, _payload: { _status: -1, _result: y }, _init: Y };
    }),
    (j.memo = function (y, E) {
      return { $$typeof: A, type: y, compare: E === void 0 ? null : E };
    }),
    (j.startTransition = function (y) {
      var E = W.T,
        O = {};
      W.T = O;
      try {
        var D = y(),
          X = W.S;
        (X !== null && X(O, D),
          typeof D == "object" &&
            D !== null &&
            typeof D.then == "function" &&
            D.then(Ql, nl));
      } catch (V) {
        nl(V);
      } finally {
        (E !== null && O.types !== null && (E.types = O.types), (W.T = E));
      }
    }),
    (j.unstable_useCacheRefresh = function () {
      return W.H.useCacheRefresh();
    }),
    (j.use = function (y) {
      return W.H.use(y);
    }),
    (j.useActionState = function (y, E, O) {
      return W.H.useActionState(y, E, O);
    }),
    (j.useCallback = function (y, E) {
      return W.H.useCallback(y, E);
    }),
    (j.useContext = function (y) {
      return W.H.useContext(y);
    }),
    (j.useDebugValue = function () {}),
    (j.useDeferredValue = function (y, E) {
      return W.H.useDeferredValue(y, E);
    }),
    (j.useEffect = function (y, E) {
      return W.H.useEffect(y, E);
    }),
    (j.useEffectEvent = function (y) {
      return W.H.useEffectEvent(y);
    }),
    (j.useId = function () {
      return W.H.useId();
    }),
    (j.useImperativeHandle = function (y, E, O) {
      return W.H.useImperativeHandle(y, E, O);
    }),
    (j.useInsertionEffect = function (y, E) {
      return W.H.useInsertionEffect(y, E);
    }),
    (j.useLayoutEffect = function (y, E) {
      return W.H.useLayoutEffect(y, E);
    }),
    (j.useMemo = function (y, E) {
      return W.H.useMemo(y, E);
    }),
    (j.useOptimistic = function (y, E) {
      return W.H.useOptimistic(y, E);
    }),
    (j.useReducer = function (y, E, O) {
      return W.H.useReducer(y, E, O);
    }),
    (j.useRef = function (y) {
      return W.H.useRef(y);
    }),
    (j.useState = function (y) {
      return W.H.useState(y);
    }),
    (j.useSyncExternalStore = function (y, E, O) {
      return W.H.useSyncExternalStore(y, E, O);
    }),
    (j.useTransition = function () {
      return W.H.useTransition();
    }),
    (j.version = "19.2.4"),
    j
  );
}
var bv;
function hi() {
  return (bv || ((bv = 1), (ci.exports = l1())), ci.exports);
}
var Fl = hi(),
  ii = { exports: {} },
  Ee = {},
  si = { exports: {} },
  yi = {};
var zv;
function t1() {
  return (
    zv ||
      ((zv = 1),
      (function (T) {
        function R(r, _) {
          var Y = r.length;
          r.push(_);
          l: for (; 0 < Y; ) {
            var nl = (Y - 1) >>> 1,
              sl = r[nl];
            if (0 < N(sl, _)) ((r[nl] = _), (r[Y] = sl), (Y = nl));
            else break l;
          }
        }
        function G(r) {
          return r.length === 0 ? null : r[0];
        }
        function m(r) {
          if (r.length === 0) return null;
          var _ = r[0],
            Y = r.pop();
          if (Y !== _) {
            r[0] = Y;
            l: for (var nl = 0, sl = r.length, y = sl >>> 1; nl < y; ) {
              var E = 2 * (nl + 1) - 1,
                O = r[E],
                D = E + 1,
                X = r[D];
              if (0 > N(O, Y))
                D < sl && 0 > N(X, O)
                  ? ((r[nl] = X), (r[D] = Y), (nl = D))
                  : ((r[nl] = O), (r[E] = Y), (nl = E));
              else if (D < sl && 0 > N(X, Y))
                ((r[nl] = X), (r[D] = Y), (nl = D));
              else break l;
            }
          }
          return _;
        }
        function N(r, _) {
          var Y = r.sortIndex - _.sortIndex;
          return Y !== 0 ? Y : r.id - _.id;
        }
        if (
          ((T.unstable_now = void 0),
          typeof performance == "object" &&
            typeof performance.now == "function")
        ) {
          var C = performance;
          T.unstable_now = function () {
            return C.now();
          };
        } else {
          var Z = Date,
            tl = Z.now();
          T.unstable_now = function () {
            return Z.now() - tl;
          };
        }
        var p = [],
          A = [],
          k = 1,
          B = null,
          vl = 3,
          ql = !1,
          F = !1,
          ol = !1,
          Dl = !1,
          kl = typeof setTimeout == "function" ? setTimeout : null,
          $t = typeof clearTimeout == "function" ? clearTimeout : null,
          Bl = typeof setImmediate < "u" ? setImmediate : null;
        function it(r) {
          for (var _ = G(A); _ !== null; ) {
            if (_.callback === null) m(A);
            else if (_.startTime <= r)
              (m(A), (_.sortIndex = _.expirationTime), R(p, _));
            else break;
            _ = G(A);
          }
        }
        function At(r) {
          if (((ol = !1), it(r), !F))
            if (G(p) !== null) ((F = !0), Ql || ((Ql = !0), Zl()));
            else {
              var _ = G(A);
              _ !== null && bt(At, _.startTime - r);
            }
        }
        var Ql = !1,
          W = -1,
          xl = 5,
          _t = -1;
        function xu() {
          return Dl ? !0 : !(T.unstable_now() - _t < xl);
        }
        function Ot() {
          if (((Dl = !1), Ql)) {
            var r = T.unstable_now();
            _t = r;
            var _ = !0;
            try {
              l: {
                ((F = !1), ol && ((ol = !1), $t(W), (W = -1)), (ql = !0));
                var Y = vl;
                try {
                  t: {
                    for (
                      it(r), B = G(p);
                      B !== null && !(B.expirationTime > r && xu());
                    ) {
                      var nl = B.callback;
                      if (typeof nl == "function") {
                        ((B.callback = null), (vl = B.priorityLevel));
                        var sl = nl(B.expirationTime <= r);
                        if (((r = T.unstable_now()), typeof sl == "function")) {
                          ((B.callback = sl), it(r), (_ = !0));
                          break t;
                        }
                        (B === G(p) && m(p), it(r));
                      } else m(p);
                      B = G(p);
                    }
                    if (B !== null) _ = !0;
                    else {
                      var y = G(A);
                      (y !== null && bt(At, y.startTime - r), (_ = !1));
                    }
                  }
                  break l;
                } finally {
                  ((B = null), (vl = Y), (ql = !1));
                }
                _ = void 0;
              }
            } finally {
              _ ? Zl() : (Ql = !1);
            }
          }
        }
        var Zl;
        if (typeof Bl == "function")
          Zl = function () {
            Bl(Ot);
          };
        else if (typeof MessageChannel < "u") {
          var Eu = new MessageChannel(),
            Nt = Eu.port2;
          ((Eu.port1.onmessage = Ot),
            (Zl = function () {
              Nt.postMessage(null);
            }));
        } else
          Zl = function () {
            kl(Ot, 0);
          };
        function bt(r, _) {
          W = kl(function () {
            r(T.unstable_now());
          }, _);
        }
        ((T.unstable_IdlePriority = 5),
          (T.unstable_ImmediatePriority = 1),
          (T.unstable_LowPriority = 4),
          (T.unstable_NormalPriority = 3),
          (T.unstable_Profiling = null),
          (T.unstable_UserBlockingPriority = 2),
          (T.unstable_cancelCallback = function (r) {
            r.callback = null;
          }),
          (T.unstable_forceFrameRate = function (r) {
            0 > r || 125 < r
              ? console.error(
                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
                )
              : (xl = 0 < r ? Math.floor(1e3 / r) : 5);
          }),
          (T.unstable_getCurrentPriorityLevel = function () {
            return vl;
          }),
          (T.unstable_next = function (r) {
            switch (vl) {
              case 1:
              case 2:
              case 3:
                var _ = 3;
                break;
              default:
                _ = vl;
            }
            var Y = vl;
            vl = _;
            try {
              return r();
            } finally {
              vl = Y;
            }
          }),
          (T.unstable_requestPaint = function () {
            Dl = !0;
          }),
          (T.unstable_runWithPriority = function (r, _) {
            switch (r) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                r = 3;
            }
            var Y = vl;
            vl = r;
            try {
              return _();
            } finally {
              vl = Y;
            }
          }),
          (T.unstable_scheduleCallback = function (r, _, Y) {
            var nl = T.unstable_now();
            switch (
              (typeof Y == "object" && Y !== null
                ? ((Y = Y.delay),
                  (Y = typeof Y == "number" && 0 < Y ? nl + Y : nl))
                : (Y = nl),
              r)
            ) {
              case 1:
                var sl = -1;
                break;
              case 2:
                sl = 250;
                break;
              case 5:
                sl = 1073741823;
                break;
              case 4:
                sl = 1e4;
                break;
              default:
                sl = 5e3;
            }
            return (
              (sl = Y + sl),
              (r = {
                id: k++,
                callback: _,
                priorityLevel: r,
                startTime: Y,
                expirationTime: sl,
                sortIndex: -1,
              }),
              Y > nl
                ? ((r.sortIndex = Y),
                  R(A, r),
                  G(p) === null &&
                    r === G(A) &&
                    (ol ? ($t(W), (W = -1)) : (ol = !0), bt(At, Y - nl)))
                : ((r.sortIndex = sl),
                  R(p, r),
                  F || ql || ((F = !0), Ql || ((Ql = !0), Zl()))),
              r
            );
          }),
          (T.unstable_shouldYield = xu),
          (T.unstable_wrapCallback = function (r) {
            var _ = vl;
            return function () {
              var Y = vl;
              vl = _;
              try {
                return r.apply(this, arguments);
              } finally {
                vl = Y;
              }
            };
          }));
      })(yi)),
    yi
  );
}
var Ev;
function u1() {
  return (Ev || ((Ev = 1), (si.exports = t1())), si.exports);
}
var vi = { exports: {} },
  Yl = {};
var Tv;
function a1() {
  if (Tv) return Yl;
  Tv = 1;
  var T = hi();
  function R(p) {
    var A = "https://react.dev/errors/" + p;
    if (1 < arguments.length) {
      A += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var k = 2; k < arguments.length; k++)
        A += "&args[]=" + encodeURIComponent(arguments[k]);
    }
    return (
      "Minified React error #" +
      p +
      "; visit " +
      A +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function G() {}
  var m = {
      d: {
        f: G,
        r: function () {
          throw Error(R(522));
        },
        D: G,
        C: G,
        L: G,
        m: G,
        X: G,
        S: G,
        M: G,
      },
      p: 0,
      findDOMNode: null,
    },
    N = Symbol.for("react.portal");
  function C(p, A, k) {
    var B =
      3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: N,
      key: B == null ? null : "" + B,
      children: p,
      containerInfo: A,
      implementation: k,
    };
  }
  var Z = T.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function tl(p, A) {
    if (p === "font") return "";
    if (typeof A == "string") return A === "use-credentials" ? A : "";
  }
  return (
    (Yl.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = m),
    (Yl.createPortal = function (p, A) {
      var k =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!A || (A.nodeType !== 1 && A.nodeType !== 9 && A.nodeType !== 11))
        throw Error(R(299));
      return C(p, A, null, k);
    }),
    (Yl.flushSync = function (p) {
      var A = Z.T,
        k = m.p;
      try {
        if (((Z.T = null), (m.p = 2), p)) return p();
      } finally {
        ((Z.T = A), (m.p = k), m.d.f());
      }
    }),
    (Yl.preconnect = function (p, A) {
      typeof p == "string" &&
        (A
          ? ((A = A.crossOrigin),
            (A =
              typeof A == "string"
                ? A === "use-credentials"
                  ? A
                  : ""
                : void 0))
          : (A = null),
        m.d.C(p, A));
    }),
    (Yl.prefetchDNS = function (p) {
      typeof p == "string" && m.d.D(p);
    }),
    (Yl.preinit = function (p, A) {
      if (typeof p == "string" && A && typeof A.as == "string") {
        var k = A.as,
          B = tl(k, A.crossOrigin),
          vl = typeof A.integrity == "string" ? A.integrity : void 0,
          ql = typeof A.fetchPriority == "string" ? A.fetchPriority : void 0;
        k === "style"
          ? m.d.S(p, typeof A.precedence == "string" ? A.precedence : void 0, {
              crossOrigin: B,
              integrity: vl,
              fetchPriority: ql,
            })
          : k === "script" &&
            m.d.X(p, {
              crossOrigin: B,
              integrity: vl,
              fetchPriority: ql,
              nonce: typeof A.nonce == "string" ? A.nonce : void 0,
            });
      }
    }),
    (Yl.preinitModule = function (p, A) {
      if (typeof p == "string")
        if (typeof A == "object" && A !== null) {
          if (A.as == null || A.as === "script") {
            var k = tl(A.as, A.crossOrigin);
            m.d.M(p, {
              crossOrigin: k,
              integrity: typeof A.integrity == "string" ? A.integrity : void 0,
              nonce: typeof A.nonce == "string" ? A.nonce : void 0,
            });
          }
        } else A == null && m.d.M(p);
    }),
    (Yl.preload = function (p, A) {
      if (
        typeof p == "string" &&
        typeof A == "object" &&
        A !== null &&
        typeof A.as == "string"
      ) {
        var k = A.as,
          B = tl(k, A.crossOrigin);
        m.d.L(p, k, {
          crossOrigin: B,
          integrity: typeof A.integrity == "string" ? A.integrity : void 0,
          nonce: typeof A.nonce == "string" ? A.nonce : void 0,
          type: typeof A.type == "string" ? A.type : void 0,
          fetchPriority:
            typeof A.fetchPriority == "string" ? A.fetchPriority : void 0,
          referrerPolicy:
            typeof A.referrerPolicy == "string" ? A.referrerPolicy : void 0,
          imageSrcSet:
            typeof A.imageSrcSet == "string" ? A.imageSrcSet : void 0,
          imageSizes: typeof A.imageSizes == "string" ? A.imageSizes : void 0,
          media: typeof A.media == "string" ? A.media : void 0,
        });
      }
    }),
    (Yl.preloadModule = function (p, A) {
      if (typeof p == "string")
        if (A) {
          var k = tl(A.as, A.crossOrigin);
          m.d.m(p, {
            as: typeof A.as == "string" && A.as !== "script" ? A.as : void 0,
            crossOrigin: k,
            integrity: typeof A.integrity == "string" ? A.integrity : void 0,
          });
        } else m.d.m(p);
    }),
    (Yl.requestFormReset = function (p) {
      m.d.r(p);
    }),
    (Yl.unstable_batchedUpdates = function (p, A) {
      return p(A);
    }),
    (Yl.useFormState = function (p, A, k) {
      return Z.H.useFormState(p, A, k);
    }),
    (Yl.useFormStatus = function () {
      return Z.H.useHostTransitionStatus();
    }),
    (Yl.version = "19.2.4"),
    Yl
  );
}
var Av;
function e1() {
  if (Av) return vi.exports;
  Av = 1;
  function T() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(T);
      } catch (R) {
        console.error(R);
      }
  }
  return (T(), (vi.exports = a1()), vi.exports);
}
var _v;
function n1() {
  if (_v) return Ee;
  _v = 1;
  var T = u1(),
    R = hi(),
    G = e1();
  function m(l) {
    var t = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var u = 2; u < arguments.length; u++)
        t += "&args[]=" + encodeURIComponent(arguments[u]);
    }
    return (
      "Minified React error #" +
      l +
      "; visit " +
      t +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function N(l) {
    return !(!l || (l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11));
  }
  function C(l) {
    var t = l,
      u = l;
    if (l.alternate) for (; t.return; ) t = t.return;
    else {
      l = t;
      do ((t = l), (t.flags & 4098) !== 0 && (u = t.return), (l = t.return));
      while (l);
    }
    return t.tag === 3 ? u : null;
  }
  function Z(l) {
    if (l.tag === 13) {
      var t = l.memoizedState;
      if (
        (t === null && ((l = l.alternate), l !== null && (t = l.memoizedState)),
        t !== null)
      )
        return t.dehydrated;
    }
    return null;
  }
  function tl(l) {
    if (l.tag === 31) {
      var t = l.memoizedState;
      if (
        (t === null && ((l = l.alternate), l !== null && (t = l.memoizedState)),
        t !== null)
      )
        return t.dehydrated;
    }
    return null;
  }
  function p(l) {
    if (C(l) !== l) throw Error(m(188));
  }
  function A(l) {
    var t = l.alternate;
    if (!t) {
      if (((t = C(l)), t === null)) throw Error(m(188));
      return t !== l ? null : l;
    }
    for (var u = l, a = t; ; ) {
      var e = u.return;
      if (e === null) break;
      var n = e.alternate;
      if (n === null) {
        if (((a = e.return), a !== null)) {
          u = a;
          continue;
        }
        break;
      }
      if (e.child === n.child) {
        for (n = e.child; n; ) {
          if (n === u) return (p(e), l);
          if (n === a) return (p(e), t);
          n = n.sibling;
        }
        throw Error(m(188));
      }
      if (u.return !== a.return) ((u = e), (a = n));
      else {
        for (var f = !1, c = e.child; c; ) {
          if (c === u) {
            ((f = !0), (u = e), (a = n));
            break;
          }
          if (c === a) {
            ((f = !0), (a = e), (u = n));
            break;
          }
          c = c.sibling;
        }
        if (!f) {
          for (c = n.child; c; ) {
            if (c === u) {
              ((f = !0), (u = n), (a = e));
              break;
            }
            if (c === a) {
              ((f = !0), (a = n), (u = e));
              break;
            }
            c = c.sibling;
          }
          if (!f) throw Error(m(189));
        }
      }
      if (u.alternate !== a) throw Error(m(190));
    }
    if (u.tag !== 3) throw Error(m(188));
    return u.stateNode.current === u ? l : t;
  }
  function k(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l;
    for (l = l.child; l !== null; ) {
      if (((t = k(l)), t !== null)) return t;
      l = l.sibling;
    }
    return null;
  }
  var B = Object.assign,
    vl = Symbol.for("react.element"),
    ql = Symbol.for("react.transitional.element"),
    F = Symbol.for("react.portal"),
    ol = Symbol.for("react.fragment"),
    Dl = Symbol.for("react.strict_mode"),
    kl = Symbol.for("react.profiler"),
    $t = Symbol.for("react.consumer"),
    Bl = Symbol.for("react.context"),
    it = Symbol.for("react.forward_ref"),
    At = Symbol.for("react.suspense"),
    Ql = Symbol.for("react.suspense_list"),
    W = Symbol.for("react.memo"),
    xl = Symbol.for("react.lazy"),
    _t = Symbol.for("react.activity"),
    xu = Symbol.for("react.memo_cache_sentinel"),
    Ot = Symbol.iterator;
  function Zl(l) {
    return l === null || typeof l != "object"
      ? null
      : ((l = (Ot && l[Ot]) || l["@@iterator"]),
        typeof l == "function" ? l : null);
  }
  var Eu = Symbol.for("react.client.reference");
  function Nt(l) {
    if (l == null) return null;
    if (typeof l == "function")
      return l.$$typeof === Eu ? null : l.displayName || l.name || null;
    if (typeof l == "string") return l;
    switch (l) {
      case ol:
        return "Fragment";
      case kl:
        return "Profiler";
      case Dl:
        return "StrictMode";
      case At:
        return "Suspense";
      case Ql:
        return "SuspenseList";
      case _t:
        return "Activity";
    }
    if (typeof l == "object")
      switch (l.$$typeof) {
        case F:
          return "Portal";
        case Bl:
          return l.displayName || "Context";
        case $t:
          return (l._context.displayName || "Context") + ".Consumer";
        case it:
          var t = l.render;
          return (
            (l = l.displayName),
            l ||
              ((l = t.displayName || t.name || ""),
              (l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef")),
            l
          );
        case W:
          return (
            (t = l.displayName || null),
            t !== null ? t : Nt(l.type) || "Memo"
          );
        case xl:
          ((t = l._payload), (l = l._init));
          try {
            return Nt(l(t));
          } catch {}
      }
    return null;
  }
  var bt = Array.isArray,
    r = R.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    _ = G.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    Y = { pending: !1, data: null, method: null, action: null },
    nl = [],
    sl = -1;
  function y(l) {
    return { current: l };
  }
  function E(l) {
    0 > sl || ((l.current = nl[sl]), (nl[sl] = null), sl--);
  }
  function O(l, t) {
    (sl++, (nl[sl] = l.current), (l.current = t));
  }
  var D = y(null),
    X = y(null),
    V = y(null),
    ul = y(null);
  function Gl(l, t) {
    switch ((O(V, t), O(X, l), O(D, null), t.nodeType)) {
      case 9:
      case 11:
        l = (l = t.documentElement) && (l = l.namespaceURI) ? Xy(l) : 0;
        break;
      default:
        if (((l = t.tagName), (t = t.namespaceURI)))
          ((t = Xy(t)), (l = Qy(t, l)));
        else
          switch (l) {
            case "svg":
              l = 1;
              break;
            case "math":
              l = 2;
              break;
            default:
              l = 0;
          }
    }
    (E(D), O(D, l));
  }
  function rl() {
    (E(D), E(X), E(V));
  }
  function pa(l) {
    l.memoizedState !== null && O(ul, l);
    var t = D.current,
      u = Qy(t, l.type);
    t !== u && (O(X, l), O(D, u));
  }
  function Te(l) {
    (X.current === l && (E(D), E(X)),
      ul.current === l && (E(ul), (Se._currentValue = Y)));
  }
  var xn, oi;
  function Tu(l) {
    if (xn === void 0)
      try {
        throw Error();
      } catch (u) {
        var t = u.stack.trim().match(/\n( *(at )?)/);
        ((xn = (t && t[1]) || ""),
          (oi =
            -1 <
            u.stack.indexOf(`
    at`)
              ? " (<anonymous>)"
              : -1 < u.stack.indexOf("@")
                ? "@unknown:0:0"
                : ""));
      }
    return (
      `
` +
      xn +
      l +
      oi
    );
  }
  var Zn = !1;
  function Vn(l, t) {
    if (!l || Zn) return "";
    Zn = !0;
    var u = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function () {
          try {
            if (t) {
              var z = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(z.prototype, "props", {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == "object" && Reflect.construct)
              ) {
                try {
                  Reflect.construct(z, []);
                } catch (S) {
                  var o = S;
                }
                Reflect.construct(l, [], z);
              } else {
                try {
                  z.call();
                } catch (S) {
                  o = S;
                }
                l.call(z.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (S) {
                o = S;
              }
              (z = l()) &&
                typeof z.catch == "function" &&
                z.catch(function () {});
            }
          } catch (S) {
            if (S && o && typeof S.stack == "string") return [S.stack, o.stack];
          }
          return [null, null];
        },
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var e = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name",
      );
      e &&
        e.configurable &&
        Object.defineProperty(a.DetermineComponentFrameRoot, "name", {
          value: "DetermineComponentFrameRoot",
        });
      var n = a.DetermineComponentFrameRoot(),
        f = n[0],
        c = n[1];
      if (f && c) {
        var i = f.split(`
`),
          h = c.split(`
`);
        for (
          e = a = 0;
          a < i.length && !i[a].includes("DetermineComponentFrameRoot");
        )
          a++;
        for (; e < h.length && !h[e].includes("DetermineComponentFrameRoot"); )
          e++;
        if (a === i.length || e === h.length)
          for (
            a = i.length - 1, e = h.length - 1;
            1 <= a && 0 <= e && i[a] !== h[e];
          )
            e--;
        for (; 1 <= a && 0 <= e; a--, e--)
          if (i[a] !== h[e]) {
            if (a !== 1 || e !== 1)
              do
                if ((a--, e--, 0 > e || i[a] !== h[e])) {
                  var g =
                    `
` + i[a].replace(" at new ", " at ");
                  return (
                    l.displayName &&
                      g.includes("<anonymous>") &&
                      (g = g.replace("<anonymous>", l.displayName)),
                    g
                  );
                }
              while (1 <= a && 0 <= e);
            break;
          }
      }
    } finally {
      ((Zn = !1), (Error.prepareStackTrace = u));
    }
    return (u = l ? l.displayName || l.name : "") ? Tu(u) : "";
  }
  function Uv(l, t) {
    switch (l.tag) {
      case 26:
      case 27:
      case 5:
        return Tu(l.type);
      case 16:
        return Tu("Lazy");
      case 13:
        return l.child !== t && t !== null
          ? Tu("Suspense Fallback")
          : Tu("Suspense");
      case 19:
        return Tu("SuspenseList");
      case 0:
      case 15:
        return Vn(l.type, !1);
      case 11:
        return Vn(l.type.render, !1);
      case 1:
        return Vn(l.type, !0);
      case 31:
        return Tu("Activity");
      default:
        return "";
    }
  }
  function Si(l) {
    try {
      var t = "",
        u = null;
      do ((t += Uv(l, u)), (u = l), (l = l.return));
      while (l);
      return t;
    } catch (a) {
      return (
        `
Error generating stack: ` +
        a.message +
        `
` +
        a.stack
      );
    }
  }
  var Ln = Object.prototype.hasOwnProperty,
    Kn = T.unstable_scheduleCallback,
    Jn = T.unstable_cancelCallback,
    Nv = T.unstable_shouldYield,
    Hv = T.unstable_requestPaint,
    Il = T.unstable_now,
    Rv = T.unstable_getCurrentPriorityLevel,
    gi = T.unstable_ImmediatePriority,
    ri = T.unstable_UserBlockingPriority,
    Ae = T.unstable_NormalPriority,
    Cv = T.unstable_LowPriority,
    bi = T.unstable_IdlePriority,
    qv = T.log,
    Bv = T.unstable_setDisableYieldValue,
    Da = null,
    Pl = null;
  function Ft(l) {
    if (
      (typeof qv == "function" && Bv(l),
      Pl && typeof Pl.setStrictMode == "function")
    )
      try {
        Pl.setStrictMode(Da, l);
      } catch {}
  }
  var lt = Math.clz32 ? Math.clz32 : jv,
    Yv = Math.log,
    Gv = Math.LN2;
  function jv(l) {
    return ((l >>>= 0), l === 0 ? 32 : (31 - ((Yv(l) / Gv) | 0)) | 0);
  }
  var _e = 256,
    Oe = 262144,
    Me = 4194304;
  function Au(l) {
    var t = l & 42;
    if (t !== 0) return t;
    switch (l & -l) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return l & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return l & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return l & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return l;
    }
  }
  function pe(l, t, u) {
    var a = l.pendingLanes;
    if (a === 0) return 0;
    var e = 0,
      n = l.suspendedLanes,
      f = l.pingedLanes;
    l = l.warmLanes;
    var c = a & 134217727;
    return (
      c !== 0
        ? ((a = c & ~n),
          a !== 0
            ? (e = Au(a))
            : ((f &= c),
              f !== 0
                ? (e = Au(f))
                : u || ((u = c & ~l), u !== 0 && (e = Au(u)))))
        : ((c = a & ~n),
          c !== 0
            ? (e = Au(c))
            : f !== 0
              ? (e = Au(f))
              : u || ((u = a & ~l), u !== 0 && (e = Au(u)))),
      e === 0
        ? 0
        : t !== 0 &&
            t !== e &&
            (t & n) === 0 &&
            ((n = e & -e),
            (u = t & -t),
            n >= u || (n === 32 && (u & 4194048) !== 0))
          ? t
          : e
    );
  }
  function Ua(l, t) {
    return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & t) === 0;
  }
  function Xv(l, t) {
    switch (l) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function zi() {
    var l = Me;
    return ((Me <<= 1), (Me & 62914560) === 0 && (Me = 4194304), l);
  }
  function wn(l) {
    for (var t = [], u = 0; 31 > u; u++) t.push(l);
    return t;
  }
  function Na(l, t) {
    ((l.pendingLanes |= t),
      t !== 268435456 &&
        ((l.suspendedLanes = 0), (l.pingedLanes = 0), (l.warmLanes = 0)));
  }
  function Qv(l, t, u, a, e, n) {
    var f = l.pendingLanes;
    ((l.pendingLanes = u),
      (l.suspendedLanes = 0),
      (l.pingedLanes = 0),
      (l.warmLanes = 0),
      (l.expiredLanes &= u),
      (l.entangledLanes &= u),
      (l.errorRecoveryDisabledLanes &= u),
      (l.shellSuspendCounter = 0));
    var c = l.entanglements,
      i = l.expirationTimes,
      h = l.hiddenUpdates;
    for (u = f & ~u; 0 < u; ) {
      var g = 31 - lt(u),
        z = 1 << g;
      ((c[g] = 0), (i[g] = -1));
      var o = h[g];
      if (o !== null)
        for (h[g] = null, g = 0; g < o.length; g++) {
          var S = o[g];
          S !== null && (S.lane &= -536870913);
        }
      u &= ~z;
    }
    (a !== 0 && Ei(l, a, 0),
      n !== 0 && e === 0 && l.tag !== 0 && (l.suspendedLanes |= n & ~(f & ~t)));
  }
  function Ei(l, t, u) {
    ((l.pendingLanes |= t), (l.suspendedLanes &= ~t));
    var a = 31 - lt(t);
    ((l.entangledLanes |= t),
      (l.entanglements[a] = l.entanglements[a] | 1073741824 | (u & 261930)));
  }
  function Ti(l, t) {
    var u = (l.entangledLanes |= t);
    for (l = l.entanglements; u; ) {
      var a = 31 - lt(u),
        e = 1 << a;
      ((e & t) | (l[a] & t) && (l[a] |= t), (u &= ~e));
    }
  }
  function Ai(l, t) {
    var u = t & -t;
    return (
      (u = (u & 42) !== 0 ? 1 : Wn(u)),
      (u & (l.suspendedLanes | t)) !== 0 ? 0 : u
    );
  }
  function Wn(l) {
    switch (l) {
      case 2:
        l = 1;
        break;
      case 8:
        l = 4;
        break;
      case 32:
        l = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        l = 128;
        break;
      case 268435456:
        l = 134217728;
        break;
      default:
        l = 0;
    }
    return l;
  }
  function $n(l) {
    return (
      (l &= -l),
      2 < l ? (8 < l ? ((l & 134217727) !== 0 ? 32 : 268435456) : 8) : 2
    );
  }
  function _i() {
    var l = _.p;
    return l !== 0 ? l : ((l = window.event), l === void 0 ? 32 : sv(l.type));
  }
  function Oi(l, t) {
    var u = _.p;
    try {
      return ((_.p = l), t());
    } finally {
      _.p = u;
    }
  }
  var kt = Math.random().toString(36).slice(2),
    Ul = "__reactFiber$" + kt,
    Vl = "__reactProps$" + kt,
    Zu = "__reactContainer$" + kt,
    Fn = "__reactEvents$" + kt,
    xv = "__reactListeners$" + kt,
    Zv = "__reactHandles$" + kt,
    Mi = "__reactResources$" + kt,
    Ha = "__reactMarker$" + kt;
  function kn(l) {
    (delete l[Ul], delete l[Vl], delete l[Fn], delete l[xv], delete l[Zv]);
  }
  function Vu(l) {
    var t = l[Ul];
    if (t) return t;
    for (var u = l.parentNode; u; ) {
      if ((t = u[Zu] || u[Ul])) {
        if (
          ((u = t.alternate),
          t.child !== null || (u !== null && u.child !== null))
        )
          for (l = wy(l); l !== null; ) {
            if ((u = l[Ul])) return u;
            l = wy(l);
          }
        return t;
      }
      ((l = u), (u = l.parentNode));
    }
    return null;
  }
  function Lu(l) {
    if ((l = l[Ul] || l[Zu])) {
      var t = l.tag;
      if (
        t === 5 ||
        t === 6 ||
        t === 13 ||
        t === 31 ||
        t === 26 ||
        t === 27 ||
        t === 3
      )
        return l;
    }
    return null;
  }
  function Ra(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l.stateNode;
    throw Error(m(33));
  }
  function Ku(l) {
    var t = l[Mi];
    return (
      t ||
        (t = l[Mi] =
          { hoistableStyles: new Map(), hoistableScripts: new Map() }),
      t
    );
  }
  function Ml(l) {
    l[Ha] = !0;
  }
  var pi = new Set(),
    Di = {};
  function _u(l, t) {
    (Ju(l, t), Ju(l + "Capture", t));
  }
  function Ju(l, t) {
    for (Di[l] = t, l = 0; l < t.length; l++) pi.add(t[l]);
  }
  var Vv = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$",
    ),
    Ui = {},
    Ni = {};
  function Lv(l) {
    return Ln.call(Ni, l)
      ? !0
      : Ln.call(Ui, l)
        ? !1
        : Vv.test(l)
          ? (Ni[l] = !0)
          : ((Ui[l] = !0), !1);
  }
  function De(l, t, u) {
    if (Lv(t))
      if (u === null) l.removeAttribute(t);
      else {
        switch (typeof u) {
          case "undefined":
          case "function":
          case "symbol":
            l.removeAttribute(t);
            return;
          case "boolean":
            var a = t.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              l.removeAttribute(t);
              return;
            }
        }
        l.setAttribute(t, "" + u);
      }
  }
  function Ue(l, t, u) {
    if (u === null) l.removeAttribute(t);
    else {
      switch (typeof u) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(t);
          return;
      }
      l.setAttribute(t, "" + u);
    }
  }
  function Ht(l, t, u, a) {
    if (a === null) l.removeAttribute(u);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(u);
          return;
      }
      l.setAttributeNS(t, u, "" + a);
    }
  }
  function st(l) {
    switch (typeof l) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return l;
      case "object":
        return l;
      default:
        return "";
    }
  }
  function Hi(l) {
    var t = l.type;
    return (
      (l = l.nodeName) &&
      l.toLowerCase() === "input" &&
      (t === "checkbox" || t === "radio")
    );
  }
  function Kv(l, t, u) {
    var a = Object.getOwnPropertyDescriptor(l.constructor.prototype, t);
    if (
      !l.hasOwnProperty(t) &&
      typeof a < "u" &&
      typeof a.get == "function" &&
      typeof a.set == "function"
    ) {
      var e = a.get,
        n = a.set;
      return (
        Object.defineProperty(l, t, {
          configurable: !0,
          get: function () {
            return e.call(this);
          },
          set: function (f) {
            ((u = "" + f), n.call(this, f));
          },
        }),
        Object.defineProperty(l, t, { enumerable: a.enumerable }),
        {
          getValue: function () {
            return u;
          },
          setValue: function (f) {
            u = "" + f;
          },
          stopTracking: function () {
            ((l._valueTracker = null), delete l[t]);
          },
        }
      );
    }
  }
  function In(l) {
    if (!l._valueTracker) {
      var t = Hi(l) ? "checked" : "value";
      l._valueTracker = Kv(l, t, "" + l[t]);
    }
  }
  function Ri(l) {
    if (!l) return !1;
    var t = l._valueTracker;
    if (!t) return !0;
    var u = t.getValue(),
      a = "";
    return (
      l && (a = Hi(l) ? (l.checked ? "true" : "false") : l.value),
      (l = a),
      l !== u ? (t.setValue(l), !0) : !1
    );
  }
  function Ne(l) {
    if (
      ((l = l || (typeof document < "u" ? document : void 0)), typeof l > "u")
    )
      return null;
    try {
      return l.activeElement || l.body;
    } catch {
      return l.body;
    }
  }
  var Jv = /[\n"\\]/g;
  function yt(l) {
    return l.replace(Jv, function (t) {
      return "\\" + t.charCodeAt(0).toString(16) + " ";
    });
  }
  function Pn(l, t, u, a, e, n, f, c) {
    ((l.name = ""),
      f != null &&
      typeof f != "function" &&
      typeof f != "symbol" &&
      typeof f != "boolean"
        ? (l.type = f)
        : l.removeAttribute("type"),
      t != null
        ? f === "number"
          ? ((t === 0 && l.value === "") || l.value != t) &&
            (l.value = "" + st(t))
          : l.value !== "" + st(t) && (l.value = "" + st(t))
        : (f !== "submit" && f !== "reset") || l.removeAttribute("value"),
      t != null
        ? lf(l, f, st(t))
        : u != null
          ? lf(l, f, st(u))
          : a != null && l.removeAttribute("value"),
      e == null && n != null && (l.defaultChecked = !!n),
      e != null &&
        (l.checked = e && typeof e != "function" && typeof e != "symbol"),
      c != null &&
      typeof c != "function" &&
      typeof c != "symbol" &&
      typeof c != "boolean"
        ? (l.name = "" + st(c))
        : l.removeAttribute("name"));
  }
  function Ci(l, t, u, a, e, n, f, c) {
    if (
      (n != null &&
        typeof n != "function" &&
        typeof n != "symbol" &&
        typeof n != "boolean" &&
        (l.type = n),
      t != null || u != null)
    ) {
      if (!((n !== "submit" && n !== "reset") || t != null)) {
        In(l);
        return;
      }
      ((u = u != null ? "" + st(u) : ""),
        (t = t != null ? "" + st(t) : u),
        c || t === l.value || (l.value = t),
        (l.defaultValue = t));
    }
    ((a = a ?? e),
      (a = typeof a != "function" && typeof a != "symbol" && !!a),
      (l.checked = c ? l.checked : !!a),
      (l.defaultChecked = !!a),
      f != null &&
        typeof f != "function" &&
        typeof f != "symbol" &&
        typeof f != "boolean" &&
        (l.name = f),
      In(l));
  }
  function lf(l, t, u) {
    (t === "number" && Ne(l.ownerDocument) === l) ||
      l.defaultValue === "" + u ||
      (l.defaultValue = "" + u);
  }
  function wu(l, t, u, a) {
    if (((l = l.options), t)) {
      t = {};
      for (var e = 0; e < u.length; e++) t["$" + u[e]] = !0;
      for (u = 0; u < l.length; u++)
        ((e = t.hasOwnProperty("$" + l[u].value)),
          l[u].selected !== e && (l[u].selected = e),
          e && a && (l[u].defaultSelected = !0));
    } else {
      for (u = "" + st(u), t = null, e = 0; e < l.length; e++) {
        if (l[e].value === u) {
          ((l[e].selected = !0), a && (l[e].defaultSelected = !0));
          return;
        }
        t !== null || l[e].disabled || (t = l[e]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function qi(l, t, u) {
    if (
      t != null &&
      ((t = "" + st(t)), t !== l.value && (l.value = t), u == null)
    ) {
      l.defaultValue !== t && (l.defaultValue = t);
      return;
    }
    l.defaultValue = u != null ? "" + st(u) : "";
  }
  function Bi(l, t, u, a) {
    if (t == null) {
      if (a != null) {
        if (u != null) throw Error(m(92));
        if (bt(a)) {
          if (1 < a.length) throw Error(m(93));
          a = a[0];
        }
        u = a;
      }
      (u == null && (u = ""), (t = u));
    }
    ((u = st(t)),
      (l.defaultValue = u),
      (a = l.textContent),
      a === u && a !== "" && a !== null && (l.value = a),
      In(l));
  }
  function Wu(l, t) {
    if (t) {
      var u = l.firstChild;
      if (u && u === l.lastChild && u.nodeType === 3) {
        u.nodeValue = t;
        return;
      }
    }
    l.textContent = t;
  }
  var wv = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " ",
    ),
  );
  function Yi(l, t, u) {
    var a = t.indexOf("--") === 0;
    u == null || typeof u == "boolean" || u === ""
      ? a
        ? l.setProperty(t, "")
        : t === "float"
          ? (l.cssFloat = "")
          : (l[t] = "")
      : a
        ? l.setProperty(t, u)
        : typeof u != "number" || u === 0 || wv.has(t)
          ? t === "float"
            ? (l.cssFloat = u)
            : (l[t] = ("" + u).trim())
          : (l[t] = u + "px");
  }
  function Gi(l, t, u) {
    if (t != null && typeof t != "object") throw Error(m(62));
    if (((l = l.style), u != null)) {
      for (var a in u)
        !u.hasOwnProperty(a) ||
          (t != null && t.hasOwnProperty(a)) ||
          (a.indexOf("--") === 0
            ? l.setProperty(a, "")
            : a === "float"
              ? (l.cssFloat = "")
              : (l[a] = ""));
      for (var e in t)
        ((a = t[e]), t.hasOwnProperty(e) && u[e] !== a && Yi(l, e, a));
    } else for (var n in t) t.hasOwnProperty(n) && Yi(l, n, t[n]);
  }
  function tf(l) {
    if (l.indexOf("-") === -1) return !1;
    switch (l) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Wv = new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"],
    ]),
    $v =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function He(l) {
    return $v.test("" + l)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : l;
  }
  function Rt() {}
  var uf = null;
  function af(l) {
    return (
      (l = l.target || l.srcElement || window),
      l.correspondingUseElement && (l = l.correspondingUseElement),
      l.nodeType === 3 ? l.parentNode : l
    );
  }
  var $u = null,
    Fu = null;
  function ji(l) {
    var t = Lu(l);
    if (t && (l = t.stateNode)) {
      var u = l[Vl] || null;
      l: switch (((l = t.stateNode), t.type)) {
        case "input":
          if (
            (Pn(
              l,
              u.value,
              u.defaultValue,
              u.defaultValue,
              u.checked,
              u.defaultChecked,
              u.type,
              u.name,
            ),
            (t = u.name),
            u.type === "radio" && t != null)
          ) {
            for (u = l; u.parentNode; ) u = u.parentNode;
            for (
              u = u.querySelectorAll(
                'input[name="' + yt("" + t) + '"][type="radio"]',
              ),
                t = 0;
              t < u.length;
              t++
            ) {
              var a = u[t];
              if (a !== l && a.form === l.form) {
                var e = a[Vl] || null;
                if (!e) throw Error(m(90));
                Pn(
                  a,
                  e.value,
                  e.defaultValue,
                  e.defaultValue,
                  e.checked,
                  e.defaultChecked,
                  e.type,
                  e.name,
                );
              }
            }
            for (t = 0; t < u.length; t++)
              ((a = u[t]), a.form === l.form && Ri(a));
          }
          break l;
        case "textarea":
          qi(l, u.value, u.defaultValue);
          break l;
        case "select":
          ((t = u.value), t != null && wu(l, !!u.multiple, t, !1));
      }
    }
  }
  var ef = !1;
  function Xi(l, t, u) {
    if (ef) return l(t, u);
    ef = !0;
    try {
      var a = l(t);
      return a;
    } finally {
      if (
        ((ef = !1),
        ($u !== null || Fu !== null) &&
          (bn(), $u && ((t = $u), (l = Fu), (Fu = $u = null), ji(t), l)))
      )
        for (t = 0; t < l.length; t++) ji(l[t]);
    }
  }
  function Ca(l, t) {
    var u = l.stateNode;
    if (u === null) return null;
    var a = u[Vl] || null;
    if (a === null) return null;
    u = a[t];
    l: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        ((a = !a.disabled) ||
          ((l = l.type),
          (a = !(
            l === "button" ||
            l === "input" ||
            l === "select" ||
            l === "textarea"
          ))),
          (l = !a));
        break l;
      default:
        l = !1;
    }
    if (l) return null;
    if (u && typeof u != "function") throw Error(m(231, t, typeof u));
    return u;
  }
  var Ct = !(
      typeof window > "u" ||
      typeof window.document > "u" ||
      typeof window.document.createElement > "u"
    ),
    nf = !1;
  if (Ct)
    try {
      var qa = {};
      (Object.defineProperty(qa, "passive", {
        get: function () {
          nf = !0;
        },
      }),
        window.addEventListener("test", qa, qa),
        window.removeEventListener("test", qa, qa));
    } catch {
      nf = !1;
    }
  var It = null,
    ff = null,
    Re = null;
  function Qi() {
    if (Re) return Re;
    var l,
      t = ff,
      u = t.length,
      a,
      e = "value" in It ? It.value : It.textContent,
      n = e.length;
    for (l = 0; l < u && t[l] === e[l]; l++);
    var f = u - l;
    for (a = 1; a <= f && t[u - a] === e[n - a]; a++);
    return (Re = e.slice(l, 1 < a ? 1 - a : void 0));
  }
  function Ce(l) {
    var t = l.keyCode;
    return (
      "charCode" in l
        ? ((l = l.charCode), l === 0 && t === 13 && (l = 13))
        : (l = t),
      l === 10 && (l = 13),
      32 <= l || l === 13 ? l : 0
    );
  }
  function qe() {
    return !0;
  }
  function xi() {
    return !1;
  }
  function Ll(l) {
    function t(u, a, e, n, f) {
      ((this._reactName = u),
        (this._targetInst = e),
        (this.type = a),
        (this.nativeEvent = n),
        (this.target = f),
        (this.currentTarget = null));
      for (var c in l)
        l.hasOwnProperty(c) && ((u = l[c]), (this[c] = u ? u(n) : n[c]));
      return (
        (this.isDefaultPrevented = (
          n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1
        )
          ? qe
          : xi),
        (this.isPropagationStopped = xi),
        this
      );
    }
    return (
      B(t.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var u = this.nativeEvent;
          u &&
            (u.preventDefault
              ? u.preventDefault()
              : typeof u.returnValue != "unknown" && (u.returnValue = !1),
            (this.isDefaultPrevented = qe));
        },
        stopPropagation: function () {
          var u = this.nativeEvent;
          u &&
            (u.stopPropagation
              ? u.stopPropagation()
              : typeof u.cancelBubble != "unknown" && (u.cancelBubble = !0),
            (this.isPropagationStopped = qe));
        },
        persist: function () {},
        isPersistent: qe,
      }),
      t
    );
  }
  var Ou = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (l) {
        return l.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    Be = Ll(Ou),
    Ba = B({}, Ou, { view: 0, detail: 0 }),
    Fv = Ll(Ba),
    cf,
    sf,
    Ya,
    Ye = B({}, Ba, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: vf,
      button: 0,
      buttons: 0,
      relatedTarget: function (l) {
        return l.relatedTarget === void 0
          ? l.fromElement === l.srcElement
            ? l.toElement
            : l.fromElement
          : l.relatedTarget;
      },
      movementX: function (l) {
        return "movementX" in l
          ? l.movementX
          : (l !== Ya &&
              (Ya && l.type === "mousemove"
                ? ((cf = l.screenX - Ya.screenX), (sf = l.screenY - Ya.screenY))
                : (sf = cf = 0),
              (Ya = l)),
            cf);
      },
      movementY: function (l) {
        return "movementY" in l ? l.movementY : sf;
      },
    }),
    Zi = Ll(Ye),
    kv = B({}, Ye, { dataTransfer: 0 }),
    Iv = Ll(kv),
    Pv = B({}, Ba, { relatedTarget: 0 }),
    yf = Ll(Pv),
    lm = B({}, Ou, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    tm = Ll(lm),
    um = B({}, Ou, {
      clipboardData: function (l) {
        return "clipboardData" in l ? l.clipboardData : window.clipboardData;
      },
    }),
    am = Ll(um),
    em = B({}, Ou, { data: 0 }),
    Vi = Ll(em),
    nm = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    },
    fm = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    },
    cm = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey",
    };
  function im(l) {
    var t = this.nativeEvent;
    return t.getModifierState
      ? t.getModifierState(l)
      : (l = cm[l])
        ? !!t[l]
        : !1;
  }
  function vf() {
    return im;
  }
  var sm = B({}, Ba, {
      key: function (l) {
        if (l.key) {
          var t = nm[l.key] || l.key;
          if (t !== "Unidentified") return t;
        }
        return l.type === "keypress"
          ? ((l = Ce(l)), l === 13 ? "Enter" : String.fromCharCode(l))
          : l.type === "keydown" || l.type === "keyup"
            ? fm[l.keyCode] || "Unidentified"
            : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: vf,
      charCode: function (l) {
        return l.type === "keypress" ? Ce(l) : 0;
      },
      keyCode: function (l) {
        return l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
      },
      which: function (l) {
        return l.type === "keypress"
          ? Ce(l)
          : l.type === "keydown" || l.type === "keyup"
            ? l.keyCode
            : 0;
      },
    }),
    ym = Ll(sm),
    vm = B({}, Ye, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    Li = Ll(vm),
    mm = B({}, Ba, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: vf,
    }),
    dm = Ll(mm),
    hm = B({}, Ou, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    om = Ll(hm),
    Sm = B({}, Ye, {
      deltaX: function (l) {
        return "deltaX" in l
          ? l.deltaX
          : "wheelDeltaX" in l
            ? -l.wheelDeltaX
            : 0;
      },
      deltaY: function (l) {
        return "deltaY" in l
          ? l.deltaY
          : "wheelDeltaY" in l
            ? -l.wheelDeltaY
            : "wheelDelta" in l
              ? -l.wheelDelta
              : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    gm = Ll(Sm),
    rm = B({}, Ou, { newState: 0, oldState: 0 }),
    bm = Ll(rm),
    zm = [9, 13, 27, 32],
    mf = Ct && "CompositionEvent" in window,
    Ga = null;
  Ct && "documentMode" in document && (Ga = document.documentMode);
  var Em = Ct && "TextEvent" in window && !Ga,
    Ki = Ct && (!mf || (Ga && 8 < Ga && 11 >= Ga)),
    Ji = " ",
    wi = !1;
  function Wi(l, t) {
    switch (l) {
      case "keyup":
        return zm.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function $i(l) {
    return (
      (l = l.detail),
      typeof l == "object" && "data" in l ? l.data : null
    );
  }
  var ku = !1;
  function Tm(l, t) {
    switch (l) {
      case "compositionend":
        return $i(t);
      case "keypress":
        return t.which !== 32 ? null : ((wi = !0), Ji);
      case "textInput":
        return ((l = t.data), l === Ji && wi ? null : l);
      default:
        return null;
    }
  }
  function Am(l, t) {
    if (ku)
      return l === "compositionend" || (!mf && Wi(l, t))
        ? ((l = Qi()), (Re = ff = It = null), (ku = !1), l)
        : null;
    switch (l) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return Ki && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var _m = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function Fi(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t === "input" ? !!_m[l.type] : t === "textarea";
  }
  function ki(l, t, u, a) {
    ($u ? (Fu ? Fu.push(a) : (Fu = [a])) : ($u = a),
      (t = Mn(t, "onChange")),
      0 < t.length &&
        ((u = new Be("onChange", "change", null, u, a)),
        l.push({ event: u, listeners: t })));
  }
  var ja = null,
    Xa = null;
  function Om(l) {
    Cy(l, 0);
  }
  function Ge(l) {
    var t = Ra(l);
    if (Ri(t)) return l;
  }
  function Ii(l, t) {
    if (l === "change") return t;
  }
  var Pi = !1;
  if (Ct) {
    var df;
    if (Ct) {
      var hf = "oninput" in document;
      if (!hf) {
        var l0 = document.createElement("div");
        (l0.setAttribute("oninput", "return;"),
          (hf = typeof l0.oninput == "function"));
      }
      df = hf;
    } else df = !1;
    Pi = df && (!document.documentMode || 9 < document.documentMode);
  }
  function t0() {
    ja && (ja.detachEvent("onpropertychange", u0), (Xa = ja = null));
  }
  function u0(l) {
    if (l.propertyName === "value" && Ge(Xa)) {
      var t = [];
      (ki(t, Xa, l, af(l)), Xi(Om, t));
    }
  }
  function Mm(l, t, u) {
    l === "focusin"
      ? (t0(), (ja = t), (Xa = u), ja.attachEvent("onpropertychange", u0))
      : l === "focusout" && t0();
  }
  function pm(l) {
    if (l === "selectionchange" || l === "keyup" || l === "keydown")
      return Ge(Xa);
  }
  function Dm(l, t) {
    if (l === "click") return Ge(t);
  }
  function Um(l, t) {
    if (l === "input" || l === "change") return Ge(t);
  }
  function Nm(l, t) {
    return (l === t && (l !== 0 || 1 / l === 1 / t)) || (l !== l && t !== t);
  }
  var tt = typeof Object.is == "function" ? Object.is : Nm;
  function Qa(l, t) {
    if (tt(l, t)) return !0;
    if (
      typeof l != "object" ||
      l === null ||
      typeof t != "object" ||
      t === null
    )
      return !1;
    var u = Object.keys(l),
      a = Object.keys(t);
    if (u.length !== a.length) return !1;
    for (a = 0; a < u.length; a++) {
      var e = u[a];
      if (!Ln.call(t, e) || !tt(l[e], t[e])) return !1;
    }
    return !0;
  }
  function a0(l) {
    for (; l && l.firstChild; ) l = l.firstChild;
    return l;
  }
  function e0(l, t) {
    var u = a0(l);
    l = 0;
    for (var a; u; ) {
      if (u.nodeType === 3) {
        if (((a = l + u.textContent.length), l <= t && a >= t))
          return { node: u, offset: t - l };
        l = a;
      }
      l: {
        for (; u; ) {
          if (u.nextSibling) {
            u = u.nextSibling;
            break l;
          }
          u = u.parentNode;
        }
        u = void 0;
      }
      u = a0(u);
    }
  }
  function n0(l, t) {
    return l && t
      ? l === t
        ? !0
        : l && l.nodeType === 3
          ? !1
          : t && t.nodeType === 3
            ? n0(l, t.parentNode)
            : "contains" in l
              ? l.contains(t)
              : l.compareDocumentPosition
                ? !!(l.compareDocumentPosition(t) & 16)
                : !1
      : !1;
  }
  function f0(l) {
    l =
      l != null &&
      l.ownerDocument != null &&
      l.ownerDocument.defaultView != null
        ? l.ownerDocument.defaultView
        : window;
    for (var t = Ne(l.document); t instanceof l.HTMLIFrameElement; ) {
      try {
        var u = typeof t.contentWindow.location.href == "string";
      } catch {
        u = !1;
      }
      if (u) l = t.contentWindow;
      else break;
      t = Ne(l.document);
    }
    return t;
  }
  function of(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return (
      t &&
      ((t === "input" &&
        (l.type === "text" ||
          l.type === "search" ||
          l.type === "tel" ||
          l.type === "url" ||
          l.type === "password")) ||
        t === "textarea" ||
        l.contentEditable === "true")
    );
  }
  var Hm = Ct && "documentMode" in document && 11 >= document.documentMode,
    Iu = null,
    Sf = null,
    xa = null,
    gf = !1;
  function c0(l, t, u) {
    var a =
      u.window === u ? u.document : u.nodeType === 9 ? u : u.ownerDocument;
    gf ||
      Iu == null ||
      Iu !== Ne(a) ||
      ((a = Iu),
      "selectionStart" in a && of(a)
        ? (a = { start: a.selectionStart, end: a.selectionEnd })
        : ((a = (
            (a.ownerDocument && a.ownerDocument.defaultView) ||
            window
          ).getSelection()),
          (a = {
            anchorNode: a.anchorNode,
            anchorOffset: a.anchorOffset,
            focusNode: a.focusNode,
            focusOffset: a.focusOffset,
          })),
      (xa && Qa(xa, a)) ||
        ((xa = a),
        (a = Mn(Sf, "onSelect")),
        0 < a.length &&
          ((t = new Be("onSelect", "select", null, t, u)),
          l.push({ event: t, listeners: a }),
          (t.target = Iu))));
  }
  function Mu(l, t) {
    var u = {};
    return (
      (u[l.toLowerCase()] = t.toLowerCase()),
      (u["Webkit" + l] = "webkit" + t),
      (u["Moz" + l] = "moz" + t),
      u
    );
  }
  var Pu = {
      animationend: Mu("Animation", "AnimationEnd"),
      animationiteration: Mu("Animation", "AnimationIteration"),
      animationstart: Mu("Animation", "AnimationStart"),
      transitionrun: Mu("Transition", "TransitionRun"),
      transitionstart: Mu("Transition", "TransitionStart"),
      transitioncancel: Mu("Transition", "TransitionCancel"),
      transitionend: Mu("Transition", "TransitionEnd"),
    },
    rf = {},
    i0 = {};
  Ct &&
    ((i0 = document.createElement("div").style),
    "AnimationEvent" in window ||
      (delete Pu.animationend.animation,
      delete Pu.animationiteration.animation,
      delete Pu.animationstart.animation),
    "TransitionEvent" in window || delete Pu.transitionend.transition);
  function pu(l) {
    if (rf[l]) return rf[l];
    if (!Pu[l]) return l;
    var t = Pu[l],
      u;
    for (u in t) if (t.hasOwnProperty(u) && u in i0) return (rf[l] = t[u]);
    return l;
  }
  var s0 = pu("animationend"),
    y0 = pu("animationiteration"),
    v0 = pu("animationstart"),
    Rm = pu("transitionrun"),
    Cm = pu("transitionstart"),
    qm = pu("transitioncancel"),
    m0 = pu("transitionend"),
    d0 = new Map(),
    bf =
      "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " ",
      );
  bf.push("scrollEnd");
  function zt(l, t) {
    (d0.set(l, t), _u(t, [l]));
  }
  var je =
      typeof reportError == "function"
        ? reportError
        : function (l) {
            if (
              typeof window == "object" &&
              typeof window.ErrorEvent == "function"
            ) {
              var t = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof l == "object" &&
                  l !== null &&
                  typeof l.message == "string"
                    ? String(l.message)
                    : String(l),
                error: l,
              });
              if (!window.dispatchEvent(t)) return;
            } else if (
              typeof process == "object" &&
              typeof process.emit == "function"
            ) {
              process.emit("uncaughtException", l);
              return;
            }
            console.error(l);
          },
    vt = [],
    la = 0,
    zf = 0;
  function Xe() {
    for (var l = la, t = (zf = la = 0); t < l; ) {
      var u = vt[t];
      vt[t++] = null;
      var a = vt[t];
      vt[t++] = null;
      var e = vt[t];
      vt[t++] = null;
      var n = vt[t];
      if (((vt[t++] = null), a !== null && e !== null)) {
        var f = a.pending;
        (f === null ? (e.next = e) : ((e.next = f.next), (f.next = e)),
          (a.pending = e));
      }
      n !== 0 && h0(u, e, n);
    }
  }
  function Qe(l, t, u, a) {
    ((vt[la++] = l),
      (vt[la++] = t),
      (vt[la++] = u),
      (vt[la++] = a),
      (zf |= a),
      (l.lanes |= a),
      (l = l.alternate),
      l !== null && (l.lanes |= a));
  }
  function Ef(l, t, u, a) {
    return (Qe(l, t, u, a), xe(l));
  }
  function Du(l, t) {
    return (Qe(l, null, null, t), xe(l));
  }
  function h0(l, t, u) {
    l.lanes |= u;
    var a = l.alternate;
    a !== null && (a.lanes |= u);
    for (var e = !1, n = l.return; n !== null; )
      ((n.childLanes |= u),
        (a = n.alternate),
        a !== null && (a.childLanes |= u),
        n.tag === 22 &&
          ((l = n.stateNode), l === null || l._visibility & 1 || (e = !0)),
        (l = n),
        (n = n.return));
    return l.tag === 3
      ? ((n = l.stateNode),
        e &&
          t !== null &&
          ((e = 31 - lt(u)),
          (l = n.hiddenUpdates),
          (a = l[e]),
          a === null ? (l[e] = [t]) : a.push(t),
          (t.lane = u | 536870912)),
        n)
      : null;
  }
  function xe(l) {
    if (50 < se) throw ((se = 0), (Nc = null), Error(m(185)));
    for (var t = l.return; t !== null; ) ((l = t), (t = l.return));
    return l.tag === 3 ? l.stateNode : null;
  }
  var ta = {};
  function Bm(l, t, u, a) {
    ((this.tag = l),
      (this.key = u),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = t),
      (this.dependencies =
        this.memoizedState =
        this.updateQueue =
        this.memoizedProps =
          null),
      (this.mode = a),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function ut(l, t, u, a) {
    return new Bm(l, t, u, a);
  }
  function Tf(l) {
    return ((l = l.prototype), !(!l || !l.isReactComponent));
  }
  function qt(l, t) {
    var u = l.alternate;
    return (
      u === null
        ? ((u = ut(l.tag, t, l.key, l.mode)),
          (u.elementType = l.elementType),
          (u.type = l.type),
          (u.stateNode = l.stateNode),
          (u.alternate = l),
          (l.alternate = u))
        : ((u.pendingProps = t),
          (u.type = l.type),
          (u.flags = 0),
          (u.subtreeFlags = 0),
          (u.deletions = null)),
      (u.flags = l.flags & 65011712),
      (u.childLanes = l.childLanes),
      (u.lanes = l.lanes),
      (u.child = l.child),
      (u.memoizedProps = l.memoizedProps),
      (u.memoizedState = l.memoizedState),
      (u.updateQueue = l.updateQueue),
      (t = l.dependencies),
      (u.dependencies =
        t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
      (u.sibling = l.sibling),
      (u.index = l.index),
      (u.ref = l.ref),
      (u.refCleanup = l.refCleanup),
      u
    );
  }
  function o0(l, t) {
    l.flags &= 65011714;
    var u = l.alternate;
    return (
      u === null
        ? ((l.childLanes = 0),
          (l.lanes = t),
          (l.child = null),
          (l.subtreeFlags = 0),
          (l.memoizedProps = null),
          (l.memoizedState = null),
          (l.updateQueue = null),
          (l.dependencies = null),
          (l.stateNode = null))
        : ((l.childLanes = u.childLanes),
          (l.lanes = u.lanes),
          (l.child = u.child),
          (l.subtreeFlags = 0),
          (l.deletions = null),
          (l.memoizedProps = u.memoizedProps),
          (l.memoizedState = u.memoizedState),
          (l.updateQueue = u.updateQueue),
          (l.type = u.type),
          (t = u.dependencies),
          (l.dependencies =
            t === null
              ? null
              : { lanes: t.lanes, firstContext: t.firstContext })),
      l
    );
  }
  function Ze(l, t, u, a, e, n) {
    var f = 0;
    if (((a = l), typeof l == "function")) Tf(l) && (f = 1);
    else if (typeof l == "string")
      f = Qd(l, u, D.current)
        ? 26
        : l === "html" || l === "head" || l === "body"
          ? 27
          : 5;
    else
      l: switch (l) {
        case _t:
          return (
            (l = ut(31, u, t, e)),
            (l.elementType = _t),
            (l.lanes = n),
            l
          );
        case ol:
          return Uu(u.children, e, n, t);
        case Dl:
          ((f = 8), (e |= 24));
          break;
        case kl:
          return (
            (l = ut(12, u, t, e | 2)),
            (l.elementType = kl),
            (l.lanes = n),
            l
          );
        case At:
          return (
            (l = ut(13, u, t, e)),
            (l.elementType = At),
            (l.lanes = n),
            l
          );
        case Ql:
          return (
            (l = ut(19, u, t, e)),
            (l.elementType = Ql),
            (l.lanes = n),
            l
          );
        default:
          if (typeof l == "object" && l !== null)
            switch (l.$$typeof) {
              case Bl:
                f = 10;
                break l;
              case $t:
                f = 9;
                break l;
              case it:
                f = 11;
                break l;
              case W:
                f = 14;
                break l;
              case xl:
                ((f = 16), (a = null));
                break l;
            }
          ((f = 29),
            (u = Error(m(130, l === null ? "null" : typeof l, ""))),
            (a = null));
      }
    return (
      (t = ut(f, u, t, e)),
      (t.elementType = l),
      (t.type = a),
      (t.lanes = n),
      t
    );
  }
  function Uu(l, t, u, a) {
    return ((l = ut(7, l, a, t)), (l.lanes = u), l);
  }
  function Af(l, t, u) {
    return ((l = ut(6, l, null, t)), (l.lanes = u), l);
  }
  function S0(l) {
    var t = ut(18, null, null, 0);
    return ((t.stateNode = l), t);
  }
  function _f(l, t, u) {
    return (
      (t = ut(4, l.children !== null ? l.children : [], l.key, t)),
      (t.lanes = u),
      (t.stateNode = {
        containerInfo: l.containerInfo,
        pendingChildren: null,
        implementation: l.implementation,
      }),
      t
    );
  }
  var g0 = new WeakMap();
  function mt(l, t) {
    if (typeof l == "object" && l !== null) {
      var u = g0.get(l);
      return u !== void 0
        ? u
        : ((t = { value: l, source: t, stack: Si(t) }), g0.set(l, t), t);
    }
    return { value: l, source: t, stack: Si(t) };
  }
  var ua = [],
    aa = 0,
    Ve = null,
    Za = 0,
    dt = [],
    ht = 0,
    Pt = null,
    Mt = 1,
    pt = "";
  function Bt(l, t) {
    ((ua[aa++] = Za), (ua[aa++] = Ve), (Ve = l), (Za = t));
  }
  function r0(l, t, u) {
    ((dt[ht++] = Mt), (dt[ht++] = pt), (dt[ht++] = Pt), (Pt = l));
    var a = Mt;
    l = pt;
    var e = 32 - lt(a) - 1;
    ((a &= ~(1 << e)), (u += 1));
    var n = 32 - lt(t) + e;
    if (30 < n) {
      var f = e - (e % 5);
      ((n = (a & ((1 << f) - 1)).toString(32)),
        (a >>= f),
        (e -= f),
        (Mt = (1 << (32 - lt(t) + e)) | (u << e) | a),
        (pt = n + l));
    } else ((Mt = (1 << n) | (u << e) | a), (pt = l));
  }
  function Of(l) {
    l.return !== null && (Bt(l, 1), r0(l, 1, 0));
  }
  function Mf(l) {
    for (; l === Ve; )
      ((Ve = ua[--aa]), (ua[aa] = null), (Za = ua[--aa]), (ua[aa] = null));
    for (; l === Pt; )
      ((Pt = dt[--ht]),
        (dt[ht] = null),
        (pt = dt[--ht]),
        (dt[ht] = null),
        (Mt = dt[--ht]),
        (dt[ht] = null));
  }
  function b0(l, t) {
    ((dt[ht++] = Mt),
      (dt[ht++] = pt),
      (dt[ht++] = Pt),
      (Mt = t.id),
      (pt = t.overflow),
      (Pt = l));
  }
  var Nl = null,
    ml = null,
    $ = !1,
    lu = null,
    ot = !1,
    pf = Error(m(519));
  function tu(l) {
    var t = Error(
      m(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1]
          ? "text"
          : "HTML",
        "",
      ),
    );
    throw (Va(mt(t, l)), pf);
  }
  function z0(l) {
    var t = l.stateNode,
      u = l.type,
      a = l.memoizedProps;
    switch (((t[Ul] = l), (t[Vl] = a), u)) {
      case "dialog":
        (K("cancel", t), K("close", t));
        break;
      case "iframe":
      case "object":
      case "embed":
        K("load", t);
        break;
      case "video":
      case "audio":
        for (u = 0; u < ve.length; u++) K(ve[u], t);
        break;
      case "source":
        K("error", t);
        break;
      case "img":
      case "image":
      case "link":
        (K("error", t), K("load", t));
        break;
      case "details":
        K("toggle", t);
        break;
      case "input":
        (K("invalid", t),
          Ci(
            t,
            a.value,
            a.defaultValue,
            a.checked,
            a.defaultChecked,
            a.type,
            a.name,
            !0,
          ));
        break;
      case "select":
        K("invalid", t);
        break;
      case "textarea":
        (K("invalid", t), Bi(t, a.value, a.defaultValue, a.children));
    }
    ((u = a.children),
      (typeof u != "string" && typeof u != "number" && typeof u != "bigint") ||
      t.textContent === "" + u ||
      a.suppressHydrationWarning === !0 ||
      Gy(t.textContent, u)
        ? (a.popover != null && (K("beforetoggle", t), K("toggle", t)),
          a.onScroll != null && K("scroll", t),
          a.onScrollEnd != null && K("scrollend", t),
          a.onClick != null && (t.onclick = Rt),
          (t = !0))
        : (t = !1),
      t || tu(l, !0));
  }
  function E0(l) {
    for (Nl = l.return; Nl; )
      switch (Nl.tag) {
        case 5:
        case 31:
        case 13:
          ot = !1;
          return;
        case 27:
        case 3:
          ot = !0;
          return;
        default:
          Nl = Nl.return;
      }
  }
  function ea(l) {
    if (l !== Nl) return !1;
    if (!$) return (E0(l), ($ = !0), !1);
    var t = l.tag,
      u;
    if (
      ((u = t !== 3 && t !== 27) &&
        ((u = t === 5) &&
          ((u = l.type),
          (u =
            !(u !== "form" && u !== "button") || Kc(l.type, l.memoizedProps))),
        (u = !u)),
      u && ml && tu(l),
      E0(l),
      t === 13)
    ) {
      if (((l = l.memoizedState), (l = l !== null ? l.dehydrated : null), !l))
        throw Error(m(317));
      ml = Jy(l);
    } else if (t === 31) {
      if (((l = l.memoizedState), (l = l !== null ? l.dehydrated : null), !l))
        throw Error(m(317));
      ml = Jy(l);
    } else
      t === 27
        ? ((t = ml), ou(l.type) ? ((l = Fc), (Fc = null), (ml = l)) : (ml = t))
        : (ml = Nl ? gt(l.stateNode.nextSibling) : null);
    return !0;
  }
  function Nu() {
    ((ml = Nl = null), ($ = !1));
  }
  function Df() {
    var l = lu;
    return (
      l !== null &&
        (Wl === null ? (Wl = l) : Wl.push.apply(Wl, l), (lu = null)),
      l
    );
  }
  function Va(l) {
    lu === null ? (lu = [l]) : lu.push(l);
  }
  var Uf = y(null),
    Hu = null,
    Yt = null;
  function uu(l, t, u) {
    (O(Uf, t._currentValue), (t._currentValue = u));
  }
  function Gt(l) {
    ((l._currentValue = Uf.current), E(Uf));
  }
  function Nf(l, t, u) {
    for (; l !== null; ) {
      var a = l.alternate;
      if (
        ((l.childLanes & t) !== t
          ? ((l.childLanes |= t), a !== null && (a.childLanes |= t))
          : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t),
        l === u)
      )
        break;
      l = l.return;
    }
  }
  function Hf(l, t, u, a) {
    var e = l.child;
    for (e !== null && (e.return = l); e !== null; ) {
      var n = e.dependencies;
      if (n !== null) {
        var f = e.child;
        n = n.firstContext;
        l: for (; n !== null; ) {
          var c = n;
          n = e;
          for (var i = 0; i < t.length; i++)
            if (c.context === t[i]) {
              ((n.lanes |= u),
                (c = n.alternate),
                c !== null && (c.lanes |= u),
                Nf(n.return, u, l),
                a || (f = null));
              break l;
            }
          n = c.next;
        }
      } else if (e.tag === 18) {
        if (((f = e.return), f === null)) throw Error(m(341));
        ((f.lanes |= u),
          (n = f.alternate),
          n !== null && (n.lanes |= u),
          Nf(f, u, l),
          (f = null));
      } else f = e.child;
      if (f !== null) f.return = e;
      else
        for (f = e; f !== null; ) {
          if (f === l) {
            f = null;
            break;
          }
          if (((e = f.sibling), e !== null)) {
            ((e.return = f.return), (f = e));
            break;
          }
          f = f.return;
        }
      e = f;
    }
  }
  function na(l, t, u, a) {
    l = null;
    for (var e = t, n = !1; e !== null; ) {
      if (!n) {
        if ((e.flags & 524288) !== 0) n = !0;
        else if ((e.flags & 262144) !== 0) break;
      }
      if (e.tag === 10) {
        var f = e.alternate;
        if (f === null) throw Error(m(387));
        if (((f = f.memoizedProps), f !== null)) {
          var c = e.type;
          tt(e.pendingProps.value, f.value) ||
            (l !== null ? l.push(c) : (l = [c]));
        }
      } else if (e === ul.current) {
        if (((f = e.alternate), f === null)) throw Error(m(387));
        f.memoizedState.memoizedState !== e.memoizedState.memoizedState &&
          (l !== null ? l.push(Se) : (l = [Se]));
      }
      e = e.return;
    }
    (l !== null && Hf(t, l, u, a), (t.flags |= 262144));
  }
  function Le(l) {
    for (l = l.firstContext; l !== null; ) {
      if (!tt(l.context._currentValue, l.memoizedValue)) return !0;
      l = l.next;
    }
    return !1;
  }
  function Ru(l) {
    ((Hu = l),
      (Yt = null),
      (l = l.dependencies),
      l !== null && (l.firstContext = null));
  }
  function Hl(l) {
    return T0(Hu, l);
  }
  function Ke(l, t) {
    return (Hu === null && Ru(l), T0(l, t));
  }
  function T0(l, t) {
    var u = t._currentValue;
    if (((t = { context: t, memoizedValue: u, next: null }), Yt === null)) {
      if (l === null) throw Error(m(308));
      ((Yt = t),
        (l.dependencies = { lanes: 0, firstContext: t }),
        (l.flags |= 524288));
    } else Yt = Yt.next = t;
    return u;
  }
  var Ym =
      typeof AbortController < "u"
        ? AbortController
        : function () {
            var l = [],
              t = (this.signal = {
                aborted: !1,
                addEventListener: function (u, a) {
                  l.push(a);
                },
              });
            this.abort = function () {
              ((t.aborted = !0),
                l.forEach(function (u) {
                  return u();
                }));
            };
          },
    Gm = T.unstable_scheduleCallback,
    jm = T.unstable_NormalPriority,
    El = {
      $$typeof: Bl,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    };
  function Rf() {
    return { controller: new Ym(), data: new Map(), refCount: 0 };
  }
  function La(l) {
    (l.refCount--,
      l.refCount === 0 &&
        Gm(jm, function () {
          l.controller.abort();
        }));
  }
  var Ka = null,
    Cf = 0,
    fa = 0,
    ca = null;
  function Xm(l, t) {
    if (Ka === null) {
      var u = (Ka = []);
      ((Cf = 0),
        (fa = Yc()),
        (ca = {
          status: "pending",
          value: void 0,
          then: function (a) {
            u.push(a);
          },
        }));
    }
    return (Cf++, t.then(A0, A0), t);
  }
  function A0() {
    if (--Cf === 0 && Ka !== null) {
      ca !== null && (ca.status = "fulfilled");
      var l = Ka;
      ((Ka = null), (fa = 0), (ca = null));
      for (var t = 0; t < l.length; t++) (0, l[t])();
    }
  }
  function Qm(l, t) {
    var u = [],
      a = {
        status: "pending",
        value: null,
        reason: null,
        then: function (e) {
          u.push(e);
        },
      };
    return (
      l.then(
        function () {
          ((a.status = "fulfilled"), (a.value = t));
          for (var e = 0; e < u.length; e++) (0, u[e])(t);
        },
        function (e) {
          for (a.status = "rejected", a.reason = e, e = 0; e < u.length; e++)
            (0, u[e])(void 0);
        },
      ),
      a
    );
  }
  var _0 = r.S;
  r.S = function (l, t) {
    ((cy = Il()),
      typeof t == "object" &&
        t !== null &&
        typeof t.then == "function" &&
        Xm(l, t),
      _0 !== null && _0(l, t));
  };
  var Cu = y(null);
  function qf() {
    var l = Cu.current;
    return l !== null ? l : yl.pooledCache;
  }
  function Je(l, t) {
    t === null ? O(Cu, Cu.current) : O(Cu, t.pool);
  }
  function O0() {
    var l = qf();
    return l === null ? null : { parent: El._currentValue, pool: l };
  }
  var ia = Error(m(460)),
    Bf = Error(m(474)),
    we = Error(m(542)),
    We = { then: function () {} };
  function M0(l) {
    return ((l = l.status), l === "fulfilled" || l === "rejected");
  }
  function p0(l, t, u) {
    switch (
      ((u = l[u]),
      u === void 0 ? l.push(t) : u !== t && (t.then(Rt, Rt), (t = u)),
      t.status)
    ) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw ((l = t.reason), U0(l), l);
      default:
        if (typeof t.status == "string") t.then(Rt, Rt);
        else {
          if (((l = yl), l !== null && 100 < l.shellSuspendCounter))
            throw Error(m(482));
          ((l = t),
            (l.status = "pending"),
            l.then(
              function (a) {
                if (t.status === "pending") {
                  var e = t;
                  ((e.status = "fulfilled"), (e.value = a));
                }
              },
              function (a) {
                if (t.status === "pending") {
                  var e = t;
                  ((e.status = "rejected"), (e.reason = a));
                }
              },
            ));
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw ((l = t.reason), U0(l), l);
        }
        throw ((Bu = t), ia);
    }
  }
  function qu(l) {
    try {
      var t = l._init;
      return t(l._payload);
    } catch (u) {
      throw u !== null && typeof u == "object" && typeof u.then == "function"
        ? ((Bu = u), ia)
        : u;
    }
  }
  var Bu = null;
  function D0() {
    if (Bu === null) throw Error(m(459));
    var l = Bu;
    return ((Bu = null), l);
  }
  function U0(l) {
    if (l === ia || l === we) throw Error(m(483));
  }
  var sa = null,
    Ja = 0;
  function $e(l) {
    var t = Ja;
    return ((Ja += 1), sa === null && (sa = []), p0(sa, l, t));
  }
  function wa(l, t) {
    ((t = t.props.ref), (l.ref = t !== void 0 ? t : null));
  }
  function Fe(l, t) {
    throw t.$$typeof === vl
      ? Error(m(525))
      : ((l = Object.prototype.toString.call(t)),
        Error(
          m(
            31,
            l === "[object Object]"
              ? "object with keys {" + Object.keys(t).join(", ") + "}"
              : l,
          ),
        ));
  }
  function N0(l) {
    function t(v, s) {
      if (l) {
        var d = v.deletions;
        d === null ? ((v.deletions = [s]), (v.flags |= 16)) : d.push(s);
      }
    }
    function u(v, s) {
      if (!l) return null;
      for (; s !== null; ) (t(v, s), (s = s.sibling));
      return null;
    }
    function a(v) {
      for (var s = new Map(); v !== null; )
        (v.key !== null ? s.set(v.key, v) : s.set(v.index, v), (v = v.sibling));
      return s;
    }
    function e(v, s) {
      return ((v = qt(v, s)), (v.index = 0), (v.sibling = null), v);
    }
    function n(v, s, d) {
      return (
        (v.index = d),
        l
          ? ((d = v.alternate),
            d !== null
              ? ((d = d.index), d < s ? ((v.flags |= 67108866), s) : d)
              : ((v.flags |= 67108866), s))
          : ((v.flags |= 1048576), s)
      );
    }
    function f(v) {
      return (l && v.alternate === null && (v.flags |= 67108866), v);
    }
    function c(v, s, d, b) {
      return s === null || s.tag !== 6
        ? ((s = Af(d, v.mode, b)), (s.return = v), s)
        : ((s = e(s, d)), (s.return = v), s);
    }
    function i(v, s, d, b) {
      var H = d.type;
      return H === ol
        ? g(v, s, d.props.children, b, d.key)
        : s !== null &&
            (s.elementType === H ||
              (typeof H == "object" &&
                H !== null &&
                H.$$typeof === xl &&
                qu(H) === s.type))
          ? ((s = e(s, d.props)), wa(s, d), (s.return = v), s)
          : ((s = Ze(d.type, d.key, d.props, null, v.mode, b)),
            wa(s, d),
            (s.return = v),
            s);
    }
    function h(v, s, d, b) {
      return s === null ||
        s.tag !== 4 ||
        s.stateNode.containerInfo !== d.containerInfo ||
        s.stateNode.implementation !== d.implementation
        ? ((s = _f(d, v.mode, b)), (s.return = v), s)
        : ((s = e(s, d.children || [])), (s.return = v), s);
    }
    function g(v, s, d, b, H) {
      return s === null || s.tag !== 7
        ? ((s = Uu(d, v.mode, b, H)), (s.return = v), s)
        : ((s = e(s, d)), (s.return = v), s);
    }
    function z(v, s, d) {
      if (
        (typeof s == "string" && s !== "") ||
        typeof s == "number" ||
        typeof s == "bigint"
      )
        return ((s = Af("" + s, v.mode, d)), (s.return = v), s);
      if (typeof s == "object" && s !== null) {
        switch (s.$$typeof) {
          case ql:
            return (
              (d = Ze(s.type, s.key, s.props, null, v.mode, d)),
              wa(d, s),
              (d.return = v),
              d
            );
          case F:
            return ((s = _f(s, v.mode, d)), (s.return = v), s);
          case xl:
            return ((s = qu(s)), z(v, s, d));
        }
        if (bt(s) || Zl(s))
          return ((s = Uu(s, v.mode, d, null)), (s.return = v), s);
        if (typeof s.then == "function") return z(v, $e(s), d);
        if (s.$$typeof === Bl) return z(v, Ke(v, s), d);
        Fe(v, s);
      }
      return null;
    }
    function o(v, s, d, b) {
      var H = s !== null ? s.key : null;
      if (
        (typeof d == "string" && d !== "") ||
        typeof d == "number" ||
        typeof d == "bigint"
      )
        return H !== null ? null : c(v, s, "" + d, b);
      if (typeof d == "object" && d !== null) {
        switch (d.$$typeof) {
          case ql:
            return d.key === H ? i(v, s, d, b) : null;
          case F:
            return d.key === H ? h(v, s, d, b) : null;
          case xl:
            return ((d = qu(d)), o(v, s, d, b));
        }
        if (bt(d) || Zl(d)) return H !== null ? null : g(v, s, d, b, null);
        if (typeof d.then == "function") return o(v, s, $e(d), b);
        if (d.$$typeof === Bl) return o(v, s, Ke(v, d), b);
        Fe(v, d);
      }
      return null;
    }
    function S(v, s, d, b, H) {
      if (
        (typeof b == "string" && b !== "") ||
        typeof b == "number" ||
        typeof b == "bigint"
      )
        return ((v = v.get(d) || null), c(s, v, "" + b, H));
      if (typeof b == "object" && b !== null) {
        switch (b.$$typeof) {
          case ql:
            return (
              (v = v.get(b.key === null ? d : b.key) || null),
              i(s, v, b, H)
            );
          case F:
            return (
              (v = v.get(b.key === null ? d : b.key) || null),
              h(s, v, b, H)
            );
          case xl:
            return ((b = qu(b)), S(v, s, d, b, H));
        }
        if (bt(b) || Zl(b))
          return ((v = v.get(d) || null), g(s, v, b, H, null));
        if (typeof b.then == "function") return S(v, s, d, $e(b), H);
        if (b.$$typeof === Bl) return S(v, s, d, Ke(s, b), H);
        Fe(s, b);
      }
      return null;
    }
    function M(v, s, d, b) {
      for (
        var H = null, I = null, U = s, x = (s = 0), w = null;
        U !== null && x < d.length;
        x++
      ) {
        U.index > x ? ((w = U), (U = null)) : (w = U.sibling);
        var P = o(v, U, d[x], b);
        if (P === null) {
          U === null && (U = w);
          break;
        }
        (l && U && P.alternate === null && t(v, U),
          (s = n(P, s, x)),
          I === null ? (H = P) : (I.sibling = P),
          (I = P),
          (U = w));
      }
      if (x === d.length) return (u(v, U), $ && Bt(v, x), H);
      if (U === null) {
        for (; x < d.length; x++)
          ((U = z(v, d[x], b)),
            U !== null &&
              ((s = n(U, s, x)),
              I === null ? (H = U) : (I.sibling = U),
              (I = U)));
        return ($ && Bt(v, x), H);
      }
      for (U = a(U); x < d.length; x++)
        ((w = S(U, v, x, d[x], b)),
          w !== null &&
            (l && w.alternate !== null && U.delete(w.key === null ? x : w.key),
            (s = n(w, s, x)),
            I === null ? (H = w) : (I.sibling = w),
            (I = w)));
      return (
        l &&
          U.forEach(function (zu) {
            return t(v, zu);
          }),
        $ && Bt(v, x),
        H
      );
    }
    function q(v, s, d, b) {
      if (d == null) throw Error(m(151));
      for (
        var H = null, I = null, U = s, x = (s = 0), w = null, P = d.next();
        U !== null && !P.done;
        x++, P = d.next()
      ) {
        U.index > x ? ((w = U), (U = null)) : (w = U.sibling);
        var zu = o(v, U, P.value, b);
        if (zu === null) {
          U === null && (U = w);
          break;
        }
        (l && U && zu.alternate === null && t(v, U),
          (s = n(zu, s, x)),
          I === null ? (H = zu) : (I.sibling = zu),
          (I = zu),
          (U = w));
      }
      if (P.done) return (u(v, U), $ && Bt(v, x), H);
      if (U === null) {
        for (; !P.done; x++, P = d.next())
          ((P = z(v, P.value, b)),
            P !== null &&
              ((s = n(P, s, x)),
              I === null ? (H = P) : (I.sibling = P),
              (I = P)));
        return ($ && Bt(v, x), H);
      }
      for (U = a(U); !P.done; x++, P = d.next())
        ((P = S(U, v, x, P.value, b)),
          P !== null &&
            (l && P.alternate !== null && U.delete(P.key === null ? x : P.key),
            (s = n(P, s, x)),
            I === null ? (H = P) : (I.sibling = P),
            (I = P)));
      return (
        l &&
          U.forEach(function (kd) {
            return t(v, kd);
          }),
        $ && Bt(v, x),
        H
      );
    }
    function il(v, s, d, b) {
      if (
        (typeof d == "object" &&
          d !== null &&
          d.type === ol &&
          d.key === null &&
          (d = d.props.children),
        typeof d == "object" && d !== null)
      ) {
        switch (d.$$typeof) {
          case ql:
            l: {
              for (var H = d.key; s !== null; ) {
                if (s.key === H) {
                  if (((H = d.type), H === ol)) {
                    if (s.tag === 7) {
                      (u(v, s.sibling),
                        (b = e(s, d.props.children)),
                        (b.return = v),
                        (v = b));
                      break l;
                    }
                  } else if (
                    s.elementType === H ||
                    (typeof H == "object" &&
                      H !== null &&
                      H.$$typeof === xl &&
                      qu(H) === s.type)
                  ) {
                    (u(v, s.sibling),
                      (b = e(s, d.props)),
                      wa(b, d),
                      (b.return = v),
                      (v = b));
                    break l;
                  }
                  u(v, s);
                  break;
                } else t(v, s);
                s = s.sibling;
              }
              d.type === ol
                ? ((b = Uu(d.props.children, v.mode, b, d.key)),
                  (b.return = v),
                  (v = b))
                : ((b = Ze(d.type, d.key, d.props, null, v.mode, b)),
                  wa(b, d),
                  (b.return = v),
                  (v = b));
            }
            return f(v);
          case F:
            l: {
              for (H = d.key; s !== null; ) {
                if (s.key === H)
                  if (
                    s.tag === 4 &&
                    s.stateNode.containerInfo === d.containerInfo &&
                    s.stateNode.implementation === d.implementation
                  ) {
                    (u(v, s.sibling),
                      (b = e(s, d.children || [])),
                      (b.return = v),
                      (v = b));
                    break l;
                  } else {
                    u(v, s);
                    break;
                  }
                else t(v, s);
                s = s.sibling;
              }
              ((b = _f(d, v.mode, b)), (b.return = v), (v = b));
            }
            return f(v);
          case xl:
            return ((d = qu(d)), il(v, s, d, b));
        }
        if (bt(d)) return M(v, s, d, b);
        if (Zl(d)) {
          if (((H = Zl(d)), typeof H != "function")) throw Error(m(150));
          return ((d = H.call(d)), q(v, s, d, b));
        }
        if (typeof d.then == "function") return il(v, s, $e(d), b);
        if (d.$$typeof === Bl) return il(v, s, Ke(v, d), b);
        Fe(v, d);
      }
      return (typeof d == "string" && d !== "") ||
        typeof d == "number" ||
        typeof d == "bigint"
        ? ((d = "" + d),
          s !== null && s.tag === 6
            ? (u(v, s.sibling), (b = e(s, d)), (b.return = v), (v = b))
            : (u(v, s), (b = Af(d, v.mode, b)), (b.return = v), (v = b)),
          f(v))
        : u(v, s);
    }
    return function (v, s, d, b) {
      try {
        Ja = 0;
        var H = il(v, s, d, b);
        return ((sa = null), H);
      } catch (U) {
        if (U === ia || U === we) throw U;
        var I = ut(29, U, null, v.mode);
        return ((I.lanes = b), (I.return = v), I);
      }
    };
  }
  var Yu = N0(!0),
    H0 = N0(!1),
    au = !1;
  function Yf(l) {
    l.updateQueue = {
      baseState: l.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function Gf(l, t) {
    ((l = l.updateQueue),
      t.updateQueue === l &&
        (t.updateQueue = {
          baseState: l.baseState,
          firstBaseUpdate: l.firstBaseUpdate,
          lastBaseUpdate: l.lastBaseUpdate,
          shared: l.shared,
          callbacks: null,
        }));
  }
  function eu(l) {
    return { lane: l, tag: 0, payload: null, callback: null, next: null };
  }
  function nu(l, t, u) {
    var a = l.updateQueue;
    if (a === null) return null;
    if (((a = a.shared), (ll & 2) !== 0)) {
      var e = a.pending;
      return (
        e === null ? (t.next = t) : ((t.next = e.next), (e.next = t)),
        (a.pending = t),
        (t = xe(l)),
        h0(l, null, u),
        t
      );
    }
    return (Qe(l, a, t, u), xe(l));
  }
  function Wa(l, t, u) {
    if (
      ((t = t.updateQueue), t !== null && ((t = t.shared), (u & 4194048) !== 0))
    ) {
      var a = t.lanes;
      ((a &= l.pendingLanes), (u |= a), (t.lanes = u), Ti(l, u));
    }
  }
  function jf(l, t) {
    var u = l.updateQueue,
      a = l.alternate;
    if (a !== null && ((a = a.updateQueue), u === a)) {
      var e = null,
        n = null;
      if (((u = u.firstBaseUpdate), u !== null)) {
        do {
          var f = {
            lane: u.lane,
            tag: u.tag,
            payload: u.payload,
            callback: null,
            next: null,
          };
          (n === null ? (e = n = f) : (n = n.next = f), (u = u.next));
        } while (u !== null);
        n === null ? (e = n = t) : (n = n.next = t);
      } else e = n = t;
      ((u = {
        baseState: a.baseState,
        firstBaseUpdate: e,
        lastBaseUpdate: n,
        shared: a.shared,
        callbacks: a.callbacks,
      }),
        (l.updateQueue = u));
      return;
    }
    ((l = u.lastBaseUpdate),
      l === null ? (u.firstBaseUpdate = t) : (l.next = t),
      (u.lastBaseUpdate = t));
  }
  var Xf = !1;
  function $a() {
    if (Xf) {
      var l = ca;
      if (l !== null) throw l;
    }
  }
  function Fa(l, t, u, a) {
    Xf = !1;
    var e = l.updateQueue;
    au = !1;
    var n = e.firstBaseUpdate,
      f = e.lastBaseUpdate,
      c = e.shared.pending;
    if (c !== null) {
      e.shared.pending = null;
      var i = c,
        h = i.next;
      ((i.next = null), f === null ? (n = h) : (f.next = h), (f = i));
      var g = l.alternate;
      g !== null &&
        ((g = g.updateQueue),
        (c = g.lastBaseUpdate),
        c !== f &&
          (c === null ? (g.firstBaseUpdate = h) : (c.next = h),
          (g.lastBaseUpdate = i)));
    }
    if (n !== null) {
      var z = e.baseState;
      ((f = 0), (g = h = i = null), (c = n));
      do {
        var o = c.lane & -536870913,
          S = o !== c.lane;
        if (S ? (J & o) === o : (a & o) === o) {
          (o !== 0 && o === fa && (Xf = !0),
            g !== null &&
              (g = g.next =
                {
                  lane: 0,
                  tag: c.tag,
                  payload: c.payload,
                  callback: null,
                  next: null,
                }));
          l: {
            var M = l,
              q = c;
            o = t;
            var il = u;
            switch (q.tag) {
              case 1:
                if (((M = q.payload), typeof M == "function")) {
                  z = M.call(il, z, o);
                  break l;
                }
                z = M;
                break l;
              case 3:
                M.flags = (M.flags & -65537) | 128;
              case 0:
                if (
                  ((M = q.payload),
                  (o = typeof M == "function" ? M.call(il, z, o) : M),
                  o == null)
                )
                  break l;
                z = B({}, z, o);
                break l;
              case 2:
                au = !0;
            }
          }
          ((o = c.callback),
            o !== null &&
              ((l.flags |= 64),
              S && (l.flags |= 8192),
              (S = e.callbacks),
              S === null ? (e.callbacks = [o]) : S.push(o)));
        } else
          ((S = {
            lane: o,
            tag: c.tag,
            payload: c.payload,
            callback: c.callback,
            next: null,
          }),
            g === null ? ((h = g = S), (i = z)) : (g = g.next = S),
            (f |= o));
        if (((c = c.next), c === null)) {
          if (((c = e.shared.pending), c === null)) break;
          ((S = c),
            (c = S.next),
            (S.next = null),
            (e.lastBaseUpdate = S),
            (e.shared.pending = null));
        }
      } while (!0);
      (g === null && (i = z),
        (e.baseState = i),
        (e.firstBaseUpdate = h),
        (e.lastBaseUpdate = g),
        n === null && (e.shared.lanes = 0),
        (yu |= f),
        (l.lanes = f),
        (l.memoizedState = z));
    }
  }
  function R0(l, t) {
    if (typeof l != "function") throw Error(m(191, l));
    l.call(t);
  }
  function C0(l, t) {
    var u = l.callbacks;
    if (u !== null)
      for (l.callbacks = null, l = 0; l < u.length; l++) R0(u[l], t);
  }
  var ya = y(null),
    ke = y(0);
  function q0(l, t) {
    ((l = Jt), O(ke, l), O(ya, t), (Jt = l | t.baseLanes));
  }
  function Qf() {
    (O(ke, Jt), O(ya, ya.current));
  }
  function xf() {
    ((Jt = ke.current), E(ya), E(ke));
  }
  var at = y(null),
    St = null;
  function fu(l) {
    var t = l.alternate;
    (O(bl, bl.current & 1),
      O(at, l),
      St === null &&
        (t === null || ya.current !== null || t.memoizedState !== null) &&
        (St = l));
  }
  function Zf(l) {
    (O(bl, bl.current), O(at, l), St === null && (St = l));
  }
  function B0(l) {
    l.tag === 22
      ? (O(bl, bl.current), O(at, l), St === null && (St = l))
      : cu();
  }
  function cu() {
    (O(bl, bl.current), O(at, at.current));
  }
  function et(l) {
    (E(at), St === l && (St = null), E(bl));
  }
  var bl = y(0);
  function Ie(l) {
    for (var t = l; t !== null; ) {
      if (t.tag === 13) {
        var u = t.memoizedState;
        if (u !== null && ((u = u.dehydrated), u === null || Wc(u) || $c(u)))
          return t;
      } else if (
        t.tag === 19 &&
        (t.memoizedProps.revealOrder === "forwards" ||
          t.memoizedProps.revealOrder === "backwards" ||
          t.memoizedProps.revealOrder === "unstable_legacy-backwards" ||
          t.memoizedProps.revealOrder === "together")
      ) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        ((t.child.return = t), (t = t.child));
        continue;
      }
      if (t === l) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === l) return null;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
    return null;
  }
  var jt = 0,
    Q = null,
    fl = null,
    Tl = null,
    Pe = !1,
    va = !1,
    Gu = !1,
    ln = 0,
    ka = 0,
    ma = null,
    xm = 0;
  function Sl() {
    throw Error(m(321));
  }
  function Vf(l, t) {
    if (t === null) return !1;
    for (var u = 0; u < t.length && u < l.length; u++)
      if (!tt(l[u], t[u])) return !1;
    return !0;
  }
  function Lf(l, t, u, a, e, n) {
    return (
      (jt = n),
      (Q = t),
      (t.memoizedState = null),
      (t.updateQueue = null),
      (t.lanes = 0),
      (r.H = l === null || l.memoizedState === null ? rs : nc),
      (Gu = !1),
      (n = u(a, e)),
      (Gu = !1),
      va && (n = G0(t, u, a, e)),
      Y0(l),
      n
    );
  }
  function Y0(l) {
    r.H = le;
    var t = fl !== null && fl.next !== null;
    if (((jt = 0), (Tl = fl = Q = null), (Pe = !1), (ka = 0), (ma = null), t))
      throw Error(m(300));
    l === null ||
      Al ||
      ((l = l.dependencies), l !== null && Le(l) && (Al = !0));
  }
  function G0(l, t, u, a) {
    Q = l;
    var e = 0;
    do {
      if ((va && (ma = null), (ka = 0), (va = !1), 25 <= e))
        throw Error(m(301));
      if (((e += 1), (Tl = fl = null), l.updateQueue != null)) {
        var n = l.updateQueue;
        ((n.lastEffect = null),
          (n.events = null),
          (n.stores = null),
          n.memoCache != null && (n.memoCache.index = 0));
      }
      ((r.H = bs), (n = t(u, a)));
    } while (va);
    return n;
  }
  function Zm() {
    var l = r.H,
      t = l.useState()[0];
    return (
      (t = typeof t.then == "function" ? Ia(t) : t),
      (l = l.useState()[0]),
      (fl !== null ? fl.memoizedState : null) !== l && (Q.flags |= 1024),
      t
    );
  }
  function Kf() {
    var l = ln !== 0;
    return ((ln = 0), l);
  }
  function Jf(l, t, u) {
    ((t.updateQueue = l.updateQueue), (t.flags &= -2053), (l.lanes &= ~u));
  }
  function wf(l) {
    if (Pe) {
      for (l = l.memoizedState; l !== null; ) {
        var t = l.queue;
        (t !== null && (t.pending = null), (l = l.next));
      }
      Pe = !1;
    }
    ((jt = 0), (Tl = fl = Q = null), (va = !1), (ka = ln = 0), (ma = null));
  }
  function jl() {
    var l = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null,
    };
    return (Tl === null ? (Q.memoizedState = Tl = l) : (Tl = Tl.next = l), Tl);
  }
  function zl() {
    if (fl === null) {
      var l = Q.alternate;
      l = l !== null ? l.memoizedState : null;
    } else l = fl.next;
    var t = Tl === null ? Q.memoizedState : Tl.next;
    if (t !== null) ((Tl = t), (fl = l));
    else {
      if (l === null)
        throw Q.alternate === null ? Error(m(467)) : Error(m(310));
      ((fl = l),
        (l = {
          memoizedState: fl.memoizedState,
          baseState: fl.baseState,
          baseQueue: fl.baseQueue,
          queue: fl.queue,
          next: null,
        }),
        Tl === null ? (Q.memoizedState = Tl = l) : (Tl = Tl.next = l));
    }
    return Tl;
  }
  function tn() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Ia(l) {
    var t = ka;
    return (
      (ka += 1),
      ma === null && (ma = []),
      (l = p0(ma, l, t)),
      (t = Q),
      (Tl === null ? t.memoizedState : Tl.next) === null &&
        ((t = t.alternate),
        (r.H = t === null || t.memoizedState === null ? rs : nc)),
      l
    );
  }
  function un(l) {
    if (l !== null && typeof l == "object") {
      if (typeof l.then == "function") return Ia(l);
      if (l.$$typeof === Bl) return Hl(l);
    }
    throw Error(m(438, String(l)));
  }
  function Wf(l) {
    var t = null,
      u = Q.updateQueue;
    if ((u !== null && (t = u.memoCache), t == null)) {
      var a = Q.alternate;
      a !== null &&
        ((a = a.updateQueue),
        a !== null &&
          ((a = a.memoCache),
          a != null &&
            (t = {
              data: a.data.map(function (e) {
                return e.slice();
              }),
              index: 0,
            })));
    }
    if (
      (t == null && (t = { data: [], index: 0 }),
      u === null && ((u = tn()), (Q.updateQueue = u)),
      (u.memoCache = t),
      (u = t.data[t.index]),
      u === void 0)
    )
      for (u = t.data[t.index] = Array(l), a = 0; a < l; a++) u[a] = xu;
    return (t.index++, u);
  }
  function Xt(l, t) {
    return typeof t == "function" ? t(l) : t;
  }
  function an(l) {
    var t = zl();
    return $f(t, fl, l);
  }
  function $f(l, t, u) {
    var a = l.queue;
    if (a === null) throw Error(m(311));
    a.lastRenderedReducer = u;
    var e = l.baseQueue,
      n = a.pending;
    if (n !== null) {
      if (e !== null) {
        var f = e.next;
        ((e.next = n.next), (n.next = f));
      }
      ((t.baseQueue = e = n), (a.pending = null));
    }
    if (((n = l.baseState), e === null)) l.memoizedState = n;
    else {
      t = e.next;
      var c = (f = null),
        i = null,
        h = t,
        g = !1;
      do {
        var z = h.lane & -536870913;
        if (z !== h.lane ? (J & z) === z : (jt & z) === z) {
          var o = h.revertLane;
          if (o === 0)
            (i !== null &&
              (i = i.next =
                {
                  lane: 0,
                  revertLane: 0,
                  gesture: null,
                  action: h.action,
                  hasEagerState: h.hasEagerState,
                  eagerState: h.eagerState,
                  next: null,
                }),
              z === fa && (g = !0));
          else if ((jt & o) === o) {
            ((h = h.next), o === fa && (g = !0));
            continue;
          } else
            ((z = {
              lane: 0,
              revertLane: h.revertLane,
              gesture: null,
              action: h.action,
              hasEagerState: h.hasEagerState,
              eagerState: h.eagerState,
              next: null,
            }),
              i === null ? ((c = i = z), (f = n)) : (i = i.next = z),
              (Q.lanes |= o),
              (yu |= o));
          ((z = h.action),
            Gu && u(n, z),
            (n = h.hasEagerState ? h.eagerState : u(n, z)));
        } else
          ((o = {
            lane: z,
            revertLane: h.revertLane,
            gesture: h.gesture,
            action: h.action,
            hasEagerState: h.hasEagerState,
            eagerState: h.eagerState,
            next: null,
          }),
            i === null ? ((c = i = o), (f = n)) : (i = i.next = o),
            (Q.lanes |= z),
            (yu |= z));
        h = h.next;
      } while (h !== null && h !== t);
      if (
        (i === null ? (f = n) : (i.next = c),
        !tt(n, l.memoizedState) && ((Al = !0), g && ((u = ca), u !== null)))
      )
        throw u;
      ((l.memoizedState = n),
        (l.baseState = f),
        (l.baseQueue = i),
        (a.lastRenderedState = n));
    }
    return (e === null && (a.lanes = 0), [l.memoizedState, a.dispatch]);
  }
  function Ff(l) {
    var t = zl(),
      u = t.queue;
    if (u === null) throw Error(m(311));
    u.lastRenderedReducer = l;
    var a = u.dispatch,
      e = u.pending,
      n = t.memoizedState;
    if (e !== null) {
      u.pending = null;
      var f = (e = e.next);
      do ((n = l(n, f.action)), (f = f.next));
      while (f !== e);
      (tt(n, t.memoizedState) || (Al = !0),
        (t.memoizedState = n),
        t.baseQueue === null && (t.baseState = n),
        (u.lastRenderedState = n));
    }
    return [n, a];
  }
  function j0(l, t, u) {
    var a = Q,
      e = zl(),
      n = $;
    if (n) {
      if (u === void 0) throw Error(m(407));
      u = u();
    } else u = t();
    var f = !tt((fl || e).memoizedState, u);
    if (
      (f && ((e.memoizedState = u), (Al = !0)),
      (e = e.queue),
      Pf(x0.bind(null, a, e, l), [l]),
      e.getSnapshot !== t || f || (Tl !== null && Tl.memoizedState.tag & 1))
    ) {
      if (
        ((a.flags |= 2048),
        da(9, { destroy: void 0 }, Q0.bind(null, a, e, u, t), null),
        yl === null)
      )
        throw Error(m(349));
      n || (jt & 127) !== 0 || X0(a, t, u);
    }
    return u;
  }
  function X0(l, t, u) {
    ((l.flags |= 16384),
      (l = { getSnapshot: t, value: u }),
      (t = Q.updateQueue),
      t === null
        ? ((t = tn()), (Q.updateQueue = t), (t.stores = [l]))
        : ((u = t.stores), u === null ? (t.stores = [l]) : u.push(l)));
  }
  function Q0(l, t, u, a) {
    ((t.value = u), (t.getSnapshot = a), Z0(t) && V0(l));
  }
  function x0(l, t, u) {
    return u(function () {
      Z0(t) && V0(l);
    });
  }
  function Z0(l) {
    var t = l.getSnapshot;
    l = l.value;
    try {
      var u = t();
      return !tt(l, u);
    } catch {
      return !0;
    }
  }
  function V0(l) {
    var t = Du(l, 2);
    t !== null && $l(t, l, 2);
  }
  function kf(l) {
    var t = jl();
    if (typeof l == "function") {
      var u = l;
      if (((l = u()), Gu)) {
        Ft(!0);
        try {
          u();
        } finally {
          Ft(!1);
        }
      }
    }
    return (
      (t.memoizedState = t.baseState = l),
      (t.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Xt,
        lastRenderedState: l,
      }),
      t
    );
  }
  function L0(l, t, u, a) {
    return ((l.baseState = u), $f(l, fl, typeof a == "function" ? a : Xt));
  }
  function Vm(l, t, u, a, e) {
    if (fn(l)) throw Error(m(485));
    if (((l = t.action), l !== null)) {
      var n = {
        payload: e,
        action: l,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function (f) {
          n.listeners.push(f);
        },
      };
      (r.T !== null ? u(!0) : (n.isTransition = !1),
        a(n),
        (u = t.pending),
        u === null
          ? ((n.next = t.pending = n), K0(t, n))
          : ((n.next = u.next), (t.pending = u.next = n)));
    }
  }
  function K0(l, t) {
    var u = t.action,
      a = t.payload,
      e = l.state;
    if (t.isTransition) {
      var n = r.T,
        f = {};
      r.T = f;
      try {
        var c = u(e, a),
          i = r.S;
        (i !== null && i(f, c), J0(l, t, c));
      } catch (h) {
        If(l, t, h);
      } finally {
        (n !== null && f.types !== null && (n.types = f.types), (r.T = n));
      }
    } else
      try {
        ((n = u(e, a)), J0(l, t, n));
      } catch (h) {
        If(l, t, h);
      }
  }
  function J0(l, t, u) {
    u !== null && typeof u == "object" && typeof u.then == "function"
      ? u.then(
          function (a) {
            w0(l, t, a);
          },
          function (a) {
            return If(l, t, a);
          },
        )
      : w0(l, t, u);
  }
  function w0(l, t, u) {
    ((t.status = "fulfilled"),
      (t.value = u),
      W0(t),
      (l.state = u),
      (t = l.pending),
      t !== null &&
        ((u = t.next),
        u === t ? (l.pending = null) : ((u = u.next), (t.next = u), K0(l, u))));
  }
  function If(l, t, u) {
    var a = l.pending;
    if (((l.pending = null), a !== null)) {
      a = a.next;
      do ((t.status = "rejected"), (t.reason = u), W0(t), (t = t.next));
      while (t !== a);
    }
    l.action = null;
  }
  function W0(l) {
    l = l.listeners;
    for (var t = 0; t < l.length; t++) (0, l[t])();
  }
  function $0(l, t) {
    return t;
  }
  function F0(l, t) {
    if ($) {
      var u = yl.formState;
      if (u !== null) {
        l: {
          var a = Q;
          if ($) {
            if (ml) {
              t: {
                for (var e = ml, n = ot; e.nodeType !== 8; ) {
                  if (!n) {
                    e = null;
                    break t;
                  }
                  if (((e = gt(e.nextSibling)), e === null)) {
                    e = null;
                    break t;
                  }
                }
                ((n = e.data), (e = n === "F!" || n === "F" ? e : null));
              }
              if (e) {
                ((ml = gt(e.nextSibling)), (a = e.data === "F!"));
                break l;
              }
            }
            tu(a);
          }
          a = !1;
        }
        a && (t = u[0]);
      }
    }
    return (
      (u = jl()),
      (u.memoizedState = u.baseState = t),
      (a = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: $0,
        lastRenderedState: t,
      }),
      (u.queue = a),
      (u = os.bind(null, Q, a)),
      (a.dispatch = u),
      (a = kf(!1)),
      (n = ec.bind(null, Q, !1, a.queue)),
      (a = jl()),
      (e = { state: t, dispatch: null, action: l, pending: null }),
      (a.queue = e),
      (u = Vm.bind(null, Q, e, n, u)),
      (e.dispatch = u),
      (a.memoizedState = l),
      [t, u, !1]
    );
  }
  function k0(l) {
    var t = zl();
    return I0(t, fl, l);
  }
  function I0(l, t, u) {
    if (
      ((t = $f(l, t, $0)[0]),
      (l = an(Xt)[0]),
      typeof t == "object" && t !== null && typeof t.then == "function")
    )
      try {
        var a = Ia(t);
      } catch (f) {
        throw f === ia ? we : f;
      }
    else a = t;
    t = zl();
    var e = t.queue,
      n = e.dispatch;
    return (
      u !== t.memoizedState &&
        ((Q.flags |= 2048),
        da(9, { destroy: void 0 }, Lm.bind(null, e, u), null)),
      [a, n, l]
    );
  }
  function Lm(l, t) {
    l.action = t;
  }
  function P0(l) {
    var t = zl(),
      u = fl;
    if (u !== null) return I0(t, u, l);
    (zl(), (t = t.memoizedState), (u = zl()));
    var a = u.queue.dispatch;
    return ((u.memoizedState = l), [t, a, !1]);
  }
  function da(l, t, u, a) {
    return (
      (l = { tag: l, create: u, deps: a, inst: t, next: null }),
      (t = Q.updateQueue),
      t === null && ((t = tn()), (Q.updateQueue = t)),
      (u = t.lastEffect),
      u === null
        ? (t.lastEffect = l.next = l)
        : ((a = u.next), (u.next = l), (l.next = a), (t.lastEffect = l)),
      l
    );
  }
  function ls() {
    return zl().memoizedState;
  }
  function en(l, t, u, a) {
    var e = jl();
    ((Q.flags |= l),
      (e.memoizedState = da(
        1 | t,
        { destroy: void 0 },
        u,
        a === void 0 ? null : a,
      )));
  }
  function nn(l, t, u, a) {
    var e = zl();
    a = a === void 0 ? null : a;
    var n = e.memoizedState.inst;
    fl !== null && a !== null && Vf(a, fl.memoizedState.deps)
      ? (e.memoizedState = da(t, n, u, a))
      : ((Q.flags |= l), (e.memoizedState = da(1 | t, n, u, a)));
  }
  function ts(l, t) {
    en(8390656, 8, l, t);
  }
  function Pf(l, t) {
    nn(2048, 8, l, t);
  }
  function Km(l) {
    Q.flags |= 4;
    var t = Q.updateQueue;
    if (t === null) ((t = tn()), (Q.updateQueue = t), (t.events = [l]));
    else {
      var u = t.events;
      u === null ? (t.events = [l]) : u.push(l);
    }
  }
  function us(l) {
    var t = zl().memoizedState;
    return (
      Km({ ref: t, nextImpl: l }),
      function () {
        if ((ll & 2) !== 0) throw Error(m(440));
        return t.impl.apply(void 0, arguments);
      }
    );
  }
  function as(l, t) {
    return nn(4, 2, l, t);
  }
  function es(l, t) {
    return nn(4, 4, l, t);
  }
  function ns(l, t) {
    if (typeof t == "function") {
      l = l();
      var u = t(l);
      return function () {
        typeof u == "function" ? u() : t(null);
      };
    }
    if (t != null)
      return (
        (l = l()),
        (t.current = l),
        function () {
          t.current = null;
        }
      );
  }
  function fs(l, t, u) {
    ((u = u != null ? u.concat([l]) : null), nn(4, 4, ns.bind(null, t, l), u));
  }
  function lc() {}
  function cs(l, t) {
    var u = zl();
    t = t === void 0 ? null : t;
    var a = u.memoizedState;
    return t !== null && Vf(t, a[1]) ? a[0] : ((u.memoizedState = [l, t]), l);
  }
  function is(l, t) {
    var u = zl();
    t = t === void 0 ? null : t;
    var a = u.memoizedState;
    if (t !== null && Vf(t, a[1])) return a[0];
    if (((a = l()), Gu)) {
      Ft(!0);
      try {
        l();
      } finally {
        Ft(!1);
      }
    }
    return ((u.memoizedState = [a, t]), a);
  }
  function tc(l, t, u) {
    return u === void 0 || ((jt & 1073741824) !== 0 && (J & 261930) === 0)
      ? (l.memoizedState = t)
      : ((l.memoizedState = u), (l = sy()), (Q.lanes |= l), (yu |= l), u);
  }
  function ss(l, t, u, a) {
    return tt(u, t)
      ? u
      : ya.current !== null
        ? ((l = tc(l, u, a)), tt(l, t) || (Al = !0), l)
        : (jt & 42) === 0 || ((jt & 1073741824) !== 0 && (J & 261930) === 0)
          ? ((Al = !0), (l.memoizedState = u))
          : ((l = sy()), (Q.lanes |= l), (yu |= l), t);
  }
  function ys(l, t, u, a, e) {
    var n = _.p;
    _.p = n !== 0 && 8 > n ? n : 8;
    var f = r.T,
      c = {};
    ((r.T = c), ec(l, !1, t, u));
    try {
      var i = e(),
        h = r.S;
      if (
        (h !== null && h(c, i),
        i !== null && typeof i == "object" && typeof i.then == "function")
      ) {
        var g = Qm(i, a);
        Pa(l, t, g, ct(l));
      } else Pa(l, t, a, ct(l));
    } catch (z) {
      Pa(l, t, { then: function () {}, status: "rejected", reason: z }, ct());
    } finally {
      ((_.p = n),
        f !== null && c.types !== null && (f.types = c.types),
        (r.T = f));
    }
  }
  function Jm() {}
  function uc(l, t, u, a) {
    if (l.tag !== 5) throw Error(m(476));
    var e = vs(l).queue;
    ys(
      l,
      e,
      t,
      Y,
      u === null
        ? Jm
        : function () {
            return (ms(l), u(a));
          },
    );
  }
  function vs(l) {
    var t = l.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: Y,
      baseState: Y,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Xt,
        lastRenderedState: Y,
      },
      next: null,
    };
    var u = {};
    return (
      (t.next = {
        memoizedState: u,
        baseState: u,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Xt,
          lastRenderedState: u,
        },
        next: null,
      }),
      (l.memoizedState = t),
      (l = l.alternate),
      l !== null && (l.memoizedState = t),
      t
    );
  }
  function ms(l) {
    var t = vs(l);
    (t.next === null && (t = l.alternate.memoizedState),
      Pa(l, t.next.queue, {}, ct()));
  }
  function ac() {
    return Hl(Se);
  }
  function ds() {
    return zl().memoizedState;
  }
  function hs() {
    return zl().memoizedState;
  }
  function wm(l) {
    for (var t = l.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var u = ct();
          l = eu(u);
          var a = nu(t, l, u);
          (a !== null && ($l(a, t, u), Wa(a, t, u)),
            (t = { cache: Rf() }),
            (l.payload = t));
          return;
      }
      t = t.return;
    }
  }
  function Wm(l, t, u) {
    var a = ct();
    ((u = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: u,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
      fn(l)
        ? Ss(t, u)
        : ((u = Ef(l, t, u, a)), u !== null && ($l(u, l, a), gs(u, t, a))));
  }
  function os(l, t, u) {
    var a = ct();
    Pa(l, t, u, a);
  }
  function Pa(l, t, u, a) {
    var e = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: u,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    };
    if (fn(l)) Ss(t, e);
    else {
      var n = l.alternate;
      if (
        l.lanes === 0 &&
        (n === null || n.lanes === 0) &&
        ((n = t.lastRenderedReducer), n !== null)
      )
        try {
          var f = t.lastRenderedState,
            c = n(f, u);
          if (((e.hasEagerState = !0), (e.eagerState = c), tt(c, f)))
            return (Qe(l, t, e, 0), yl === null && Xe(), !1);
        } catch {}
      if (((u = Ef(l, t, e, a)), u !== null))
        return ($l(u, l, a), gs(u, t, a), !0);
    }
    return !1;
  }
  function ec(l, t, u, a) {
    if (
      ((a = {
        lane: 2,
        revertLane: Yc(),
        gesture: null,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      fn(l))
    ) {
      if (t) throw Error(m(479));
    } else ((t = Ef(l, u, a, 2)), t !== null && $l(t, l, 2));
  }
  function fn(l) {
    var t = l.alternate;
    return l === Q || (t !== null && t === Q);
  }
  function Ss(l, t) {
    va = Pe = !0;
    var u = l.pending;
    (u === null ? (t.next = t) : ((t.next = u.next), (u.next = t)),
      (l.pending = t));
  }
  function gs(l, t, u) {
    if ((u & 4194048) !== 0) {
      var a = t.lanes;
      ((a &= l.pendingLanes), (u |= a), (t.lanes = u), Ti(l, u));
    }
  }
  var le = {
    readContext: Hl,
    use: un,
    useCallback: Sl,
    useContext: Sl,
    useEffect: Sl,
    useImperativeHandle: Sl,
    useLayoutEffect: Sl,
    useInsertionEffect: Sl,
    useMemo: Sl,
    useReducer: Sl,
    useRef: Sl,
    useState: Sl,
    useDebugValue: Sl,
    useDeferredValue: Sl,
    useTransition: Sl,
    useSyncExternalStore: Sl,
    useId: Sl,
    useHostTransitionStatus: Sl,
    useFormState: Sl,
    useActionState: Sl,
    useOptimistic: Sl,
    useMemoCache: Sl,
    useCacheRefresh: Sl,
  };
  le.useEffectEvent = Sl;
  var rs = {
      readContext: Hl,
      use: un,
      useCallback: function (l, t) {
        return ((jl().memoizedState = [l, t === void 0 ? null : t]), l);
      },
      useContext: Hl,
      useEffect: ts,
      useImperativeHandle: function (l, t, u) {
        ((u = u != null ? u.concat([l]) : null),
          en(4194308, 4, ns.bind(null, t, l), u));
      },
      useLayoutEffect: function (l, t) {
        return en(4194308, 4, l, t);
      },
      useInsertionEffect: function (l, t) {
        en(4, 2, l, t);
      },
      useMemo: function (l, t) {
        var u = jl();
        t = t === void 0 ? null : t;
        var a = l();
        if (Gu) {
          Ft(!0);
          try {
            l();
          } finally {
            Ft(!1);
          }
        }
        return ((u.memoizedState = [a, t]), a);
      },
      useReducer: function (l, t, u) {
        var a = jl();
        if (u !== void 0) {
          var e = u(t);
          if (Gu) {
            Ft(!0);
            try {
              u(t);
            } finally {
              Ft(!1);
            }
          }
        } else e = t;
        return (
          (a.memoizedState = a.baseState = e),
          (l = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: l,
            lastRenderedState: e,
          }),
          (a.queue = l),
          (l = l.dispatch = Wm.bind(null, Q, l)),
          [a.memoizedState, l]
        );
      },
      useRef: function (l) {
        var t = jl();
        return ((l = { current: l }), (t.memoizedState = l));
      },
      useState: function (l) {
        l = kf(l);
        var t = l.queue,
          u = os.bind(null, Q, t);
        return ((t.dispatch = u), [l.memoizedState, u]);
      },
      useDebugValue: lc,
      useDeferredValue: function (l, t) {
        var u = jl();
        return tc(u, l, t);
      },
      useTransition: function () {
        var l = kf(!1);
        return (
          (l = ys.bind(null, Q, l.queue, !0, !1)),
          (jl().memoizedState = l),
          [!1, l]
        );
      },
      useSyncExternalStore: function (l, t, u) {
        var a = Q,
          e = jl();
        if ($) {
          if (u === void 0) throw Error(m(407));
          u = u();
        } else {
          if (((u = t()), yl === null)) throw Error(m(349));
          (J & 127) !== 0 || X0(a, t, u);
        }
        e.memoizedState = u;
        var n = { value: u, getSnapshot: t };
        return (
          (e.queue = n),
          ts(x0.bind(null, a, n, l), [l]),
          (a.flags |= 2048),
          da(9, { destroy: void 0 }, Q0.bind(null, a, n, u, t), null),
          u
        );
      },
      useId: function () {
        var l = jl(),
          t = yl.identifierPrefix;
        if ($) {
          var u = pt,
            a = Mt;
          ((u = (a & ~(1 << (32 - lt(a) - 1))).toString(32) + u),
            (t = "_" + t + "R_" + u),
            (u = ln++),
            0 < u && (t += "H" + u.toString(32)),
            (t += "_"));
        } else ((u = xm++), (t = "_" + t + "r_" + u.toString(32) + "_"));
        return (l.memoizedState = t);
      },
      useHostTransitionStatus: ac,
      useFormState: F0,
      useActionState: F0,
      useOptimistic: function (l) {
        var t = jl();
        t.memoizedState = t.baseState = l;
        var u = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null,
        };
        return (
          (t.queue = u),
          (t = ec.bind(null, Q, !0, u)),
          (u.dispatch = t),
          [l, t]
        );
      },
      useMemoCache: Wf,
      useCacheRefresh: function () {
        return (jl().memoizedState = wm.bind(null, Q));
      },
      useEffectEvent: function (l) {
        var t = jl(),
          u = { impl: l };
        return (
          (t.memoizedState = u),
          function () {
            if ((ll & 2) !== 0) throw Error(m(440));
            return u.impl.apply(void 0, arguments);
          }
        );
      },
    },
    nc = {
      readContext: Hl,
      use: un,
      useCallback: cs,
      useContext: Hl,
      useEffect: Pf,
      useImperativeHandle: fs,
      useInsertionEffect: as,
      useLayoutEffect: es,
      useMemo: is,
      useReducer: an,
      useRef: ls,
      useState: function () {
        return an(Xt);
      },
      useDebugValue: lc,
      useDeferredValue: function (l, t) {
        var u = zl();
        return ss(u, fl.memoizedState, l, t);
      },
      useTransition: function () {
        var l = an(Xt)[0],
          t = zl().memoizedState;
        return [typeof l == "boolean" ? l : Ia(l), t];
      },
      useSyncExternalStore: j0,
      useId: ds,
      useHostTransitionStatus: ac,
      useFormState: k0,
      useActionState: k0,
      useOptimistic: function (l, t) {
        var u = zl();
        return L0(u, fl, l, t);
      },
      useMemoCache: Wf,
      useCacheRefresh: hs,
    };
  nc.useEffectEvent = us;
  var bs = {
    readContext: Hl,
    use: un,
    useCallback: cs,
    useContext: Hl,
    useEffect: Pf,
    useImperativeHandle: fs,
    useInsertionEffect: as,
    useLayoutEffect: es,
    useMemo: is,
    useReducer: Ff,
    useRef: ls,
    useState: function () {
      return Ff(Xt);
    },
    useDebugValue: lc,
    useDeferredValue: function (l, t) {
      var u = zl();
      return fl === null ? tc(u, l, t) : ss(u, fl.memoizedState, l, t);
    },
    useTransition: function () {
      var l = Ff(Xt)[0],
        t = zl().memoizedState;
      return [typeof l == "boolean" ? l : Ia(l), t];
    },
    useSyncExternalStore: j0,
    useId: ds,
    useHostTransitionStatus: ac,
    useFormState: P0,
    useActionState: P0,
    useOptimistic: function (l, t) {
      var u = zl();
      return fl !== null
        ? L0(u, fl, l, t)
        : ((u.baseState = l), [l, u.queue.dispatch]);
    },
    useMemoCache: Wf,
    useCacheRefresh: hs,
  };
  bs.useEffectEvent = us;
  function fc(l, t, u, a) {
    ((t = l.memoizedState),
      (u = u(a, t)),
      (u = u == null ? t : B({}, t, u)),
      (l.memoizedState = u),
      l.lanes === 0 && (l.updateQueue.baseState = u));
  }
  var cc = {
    enqueueSetState: function (l, t, u) {
      l = l._reactInternals;
      var a = ct(),
        e = eu(a);
      ((e.payload = t),
        u != null && (e.callback = u),
        (t = nu(l, e, a)),
        t !== null && ($l(t, l, a), Wa(t, l, a)));
    },
    enqueueReplaceState: function (l, t, u) {
      l = l._reactInternals;
      var a = ct(),
        e = eu(a);
      ((e.tag = 1),
        (e.payload = t),
        u != null && (e.callback = u),
        (t = nu(l, e, a)),
        t !== null && ($l(t, l, a), Wa(t, l, a)));
    },
    enqueueForceUpdate: function (l, t) {
      l = l._reactInternals;
      var u = ct(),
        a = eu(u);
      ((a.tag = 2),
        t != null && (a.callback = t),
        (t = nu(l, a, u)),
        t !== null && ($l(t, l, u), Wa(t, l, u)));
    },
  };
  function zs(l, t, u, a, e, n, f) {
    return (
      (l = l.stateNode),
      typeof l.shouldComponentUpdate == "function"
        ? l.shouldComponentUpdate(a, n, f)
        : t.prototype && t.prototype.isPureReactComponent
          ? !Qa(u, a) || !Qa(e, n)
          : !0
    );
  }
  function Es(l, t, u, a) {
    ((l = t.state),
      typeof t.componentWillReceiveProps == "function" &&
        t.componentWillReceiveProps(u, a),
      typeof t.UNSAFE_componentWillReceiveProps == "function" &&
        t.UNSAFE_componentWillReceiveProps(u, a),
      t.state !== l && cc.enqueueReplaceState(t, t.state, null));
  }
  function ju(l, t) {
    var u = t;
    if ("ref" in t) {
      u = {};
      for (var a in t) a !== "ref" && (u[a] = t[a]);
    }
    if ((l = l.defaultProps)) {
      u === t && (u = B({}, u));
      for (var e in l) u[e] === void 0 && (u[e] = l[e]);
    }
    return u;
  }
  function Ts(l) {
    je(l);
  }
  function As(l) {
    console.error(l);
  }
  function _s(l) {
    je(l);
  }
  function cn(l, t) {
    try {
      var u = l.onUncaughtError;
      u(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function () {
        throw a;
      });
    }
  }
  function Os(l, t, u) {
    try {
      var a = l.onCaughtError;
      a(u.value, {
        componentStack: u.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null,
      });
    } catch (e) {
      setTimeout(function () {
        throw e;
      });
    }
  }
  function ic(l, t, u) {
    return (
      (u = eu(u)),
      (u.tag = 3),
      (u.payload = { element: null }),
      (u.callback = function () {
        cn(l, t);
      }),
      u
    );
  }
  function Ms(l) {
    return ((l = eu(l)), (l.tag = 3), l);
  }
  function ps(l, t, u, a) {
    var e = u.type.getDerivedStateFromError;
    if (typeof e == "function") {
      var n = a.value;
      ((l.payload = function () {
        return e(n);
      }),
        (l.callback = function () {
          Os(t, u, a);
        }));
    }
    var f = u.stateNode;
    f !== null &&
      typeof f.componentDidCatch == "function" &&
      (l.callback = function () {
        (Os(t, u, a),
          typeof e != "function" &&
            (vu === null ? (vu = new Set([this])) : vu.add(this)));
        var c = a.stack;
        this.componentDidCatch(a.value, {
          componentStack: c !== null ? c : "",
        });
      });
  }
  function $m(l, t, u, a, e) {
    if (
      ((u.flags |= 32768),
      a !== null && typeof a == "object" && typeof a.then == "function")
    ) {
      if (
        ((t = u.alternate),
        t !== null && na(t, u, e, !0),
        (u = at.current),
        u !== null)
      ) {
        switch (u.tag) {
          case 31:
          case 13:
            return (
              St === null ? zn() : u.alternate === null && gl === 0 && (gl = 3),
              (u.flags &= -257),
              (u.flags |= 65536),
              (u.lanes = e),
              a === We
                ? (u.flags |= 16384)
                : ((t = u.updateQueue),
                  t === null ? (u.updateQueue = new Set([a])) : t.add(a),
                  Cc(l, a, e)),
              !1
            );
          case 22:
            return (
              (u.flags |= 65536),
              a === We
                ? (u.flags |= 16384)
                : ((t = u.updateQueue),
                  t === null
                    ? ((t = {
                        transitions: null,
                        markerInstances: null,
                        retryQueue: new Set([a]),
                      }),
                      (u.updateQueue = t))
                    : ((u = t.retryQueue),
                      u === null ? (t.retryQueue = new Set([a])) : u.add(a)),
                  Cc(l, a, e)),
              !1
            );
        }
        throw Error(m(435, u.tag));
      }
      return (Cc(l, a, e), zn(), !1);
    }
    if ($)
      return (
        (t = at.current),
        t !== null
          ? ((t.flags & 65536) === 0 && (t.flags |= 256),
            (t.flags |= 65536),
            (t.lanes = e),
            a !== pf && ((l = Error(m(422), { cause: a })), Va(mt(l, u))))
          : (a !== pf && ((t = Error(m(423), { cause: a })), Va(mt(t, u))),
            (l = l.current.alternate),
            (l.flags |= 65536),
            (e &= -e),
            (l.lanes |= e),
            (a = mt(a, u)),
            (e = ic(l.stateNode, a, e)),
            jf(l, e),
            gl !== 4 && (gl = 2)),
        !1
      );
    var n = Error(m(520), { cause: a });
    if (
      ((n = mt(n, u)),
      ie === null ? (ie = [n]) : ie.push(n),
      gl !== 4 && (gl = 2),
      t === null)
    )
      return !0;
    ((a = mt(a, u)), (u = t));
    do {
      switch (u.tag) {
        case 3:
          return (
            (u.flags |= 65536),
            (l = e & -e),
            (u.lanes |= l),
            (l = ic(u.stateNode, a, l)),
            jf(u, l),
            !1
          );
        case 1:
          if (
            ((t = u.type),
            (n = u.stateNode),
            (u.flags & 128) === 0 &&
              (typeof t.getDerivedStateFromError == "function" ||
                (n !== null &&
                  typeof n.componentDidCatch == "function" &&
                  (vu === null || !vu.has(n)))))
          )
            return (
              (u.flags |= 65536),
              (e &= -e),
              (u.lanes |= e),
              (e = Ms(e)),
              ps(e, l, u, a),
              jf(u, e),
              !1
            );
      }
      u = u.return;
    } while (u !== null);
    return !1;
  }
  var sc = Error(m(461)),
    Al = !1;
  function Rl(l, t, u, a) {
    t.child = l === null ? H0(t, null, u, a) : Yu(t, l.child, u, a);
  }
  function Ds(l, t, u, a, e) {
    u = u.render;
    var n = t.ref;
    if ("ref" in a) {
      var f = {};
      for (var c in a) c !== "ref" && (f[c] = a[c]);
    } else f = a;
    return (
      Ru(t),
      (a = Lf(l, t, u, f, n, e)),
      (c = Kf()),
      l !== null && !Al
        ? (Jf(l, t, e), Qt(l, t, e))
        : ($ && c && Of(t), (t.flags |= 1), Rl(l, t, a, e), t.child)
    );
  }
  function Us(l, t, u, a, e) {
    if (l === null) {
      var n = u.type;
      return typeof n == "function" &&
        !Tf(n) &&
        n.defaultProps === void 0 &&
        u.compare === null
        ? ((t.tag = 15), (t.type = n), Ns(l, t, n, a, e))
        : ((l = Ze(u.type, null, a, t, t.mode, e)),
          (l.ref = t.ref),
          (l.return = t),
          (t.child = l));
    }
    if (((n = l.child), !gc(l, e))) {
      var f = n.memoizedProps;
      if (
        ((u = u.compare), (u = u !== null ? u : Qa), u(f, a) && l.ref === t.ref)
      )
        return Qt(l, t, e);
    }
    return (
      (t.flags |= 1),
      (l = qt(n, a)),
      (l.ref = t.ref),
      (l.return = t),
      (t.child = l)
    );
  }
  function Ns(l, t, u, a, e) {
    if (l !== null) {
      var n = l.memoizedProps;
      if (Qa(n, a) && l.ref === t.ref)
        if (((Al = !1), (t.pendingProps = a = n), gc(l, e)))
          (l.flags & 131072) !== 0 && (Al = !0);
        else return ((t.lanes = l.lanes), Qt(l, t, e));
    }
    return yc(l, t, u, a, e);
  }
  function Hs(l, t, u, a) {
    var e = a.children,
      n = l !== null ? l.memoizedState : null;
    if (
      (l === null &&
        t.stateNode === null &&
        (t.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      a.mode === "hidden")
    ) {
      if ((t.flags & 128) !== 0) {
        if (((n = n !== null ? n.baseLanes | u : u), l !== null)) {
          for (a = t.child = l.child, e = 0; a !== null; )
            ((e = e | a.lanes | a.childLanes), (a = a.sibling));
          a = e & ~n;
        } else ((a = 0), (t.child = null));
        return Rs(l, t, n, u, a);
      }
      if ((u & 536870912) !== 0)
        ((t.memoizedState = { baseLanes: 0, cachePool: null }),
          l !== null && Je(t, n !== null ? n.cachePool : null),
          n !== null ? q0(t, n) : Qf(),
          B0(t));
      else
        return (
          (a = t.lanes = 536870912),
          Rs(l, t, n !== null ? n.baseLanes | u : u, u, a)
        );
    } else
      n !== null
        ? (Je(t, n.cachePool), q0(t, n), cu(), (t.memoizedState = null))
        : (l !== null && Je(t, null), Qf(), cu());
    return (Rl(l, t, e, u), t.child);
  }
  function te(l, t) {
    return (
      (l !== null && l.tag === 22) ||
        t.stateNode !== null ||
        (t.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      t.sibling
    );
  }
  function Rs(l, t, u, a, e) {
    var n = qf();
    return (
      (n = n === null ? null : { parent: El._currentValue, pool: n }),
      (t.memoizedState = { baseLanes: u, cachePool: n }),
      l !== null && Je(t, null),
      Qf(),
      B0(t),
      l !== null && na(l, t, a, !0),
      (t.childLanes = e),
      null
    );
  }
  function sn(l, t) {
    return (
      (t = vn({ mode: t.mode, children: t.children }, l.mode)),
      (t.ref = l.ref),
      (l.child = t),
      (t.return = l),
      t
    );
  }
  function Cs(l, t, u) {
    return (
      Yu(t, l.child, null, u),
      (l = sn(t, t.pendingProps)),
      (l.flags |= 2),
      et(t),
      (t.memoizedState = null),
      l
    );
  }
  function Fm(l, t, u) {
    var a = t.pendingProps,
      e = (t.flags & 128) !== 0;
    if (((t.flags &= -129), l === null)) {
      if ($) {
        if (a.mode === "hidden")
          return ((l = sn(t, a)), (t.lanes = 536870912), te(null, l));
        if (
          (Zf(t),
          (l = ml)
            ? ((l = Ky(l, ot)),
              (l = l !== null && l.data === "&" ? l : null),
              l !== null &&
                ((t.memoizedState = {
                  dehydrated: l,
                  treeContext: Pt !== null ? { id: Mt, overflow: pt } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (u = S0(l)),
                (u.return = t),
                (t.child = u),
                (Nl = t),
                (ml = null)))
            : (l = null),
          l === null)
        )
          throw tu(t);
        return ((t.lanes = 536870912), null);
      }
      return sn(t, a);
    }
    var n = l.memoizedState;
    if (n !== null) {
      var f = n.dehydrated;
      if ((Zf(t), e))
        if (t.flags & 256) ((t.flags &= -257), (t = Cs(l, t, u)));
        else if (t.memoizedState !== null)
          ((t.child = l.child), (t.flags |= 128), (t = null));
        else throw Error(m(558));
      else if (
        (Al || na(l, t, u, !1), (e = (u & l.childLanes) !== 0), Al || e)
      ) {
        if (
          ((a = yl),
          a !== null && ((f = Ai(a, u)), f !== 0 && f !== n.retryLane))
        )
          throw ((n.retryLane = f), Du(l, f), $l(a, l, f), sc);
        (zn(), (t = Cs(l, t, u)));
      } else
        ((l = n.treeContext),
          (ml = gt(f.nextSibling)),
          (Nl = t),
          ($ = !0),
          (lu = null),
          (ot = !1),
          l !== null && b0(t, l),
          (t = sn(t, a)),
          (t.flags |= 4096));
      return t;
    }
    return (
      (l = qt(l.child, { mode: a.mode, children: a.children })),
      (l.ref = t.ref),
      (t.child = l),
      (l.return = t),
      l
    );
  }
  function yn(l, t) {
    var u = t.ref;
    if (u === null) l !== null && l.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof u != "function" && typeof u != "object") throw Error(m(284));
      (l === null || l.ref !== u) && (t.flags |= 4194816);
    }
  }
  function yc(l, t, u, a, e) {
    return (
      Ru(t),
      (u = Lf(l, t, u, a, void 0, e)),
      (a = Kf()),
      l !== null && !Al
        ? (Jf(l, t, e), Qt(l, t, e))
        : ($ && a && Of(t), (t.flags |= 1), Rl(l, t, u, e), t.child)
    );
  }
  function qs(l, t, u, a, e, n) {
    return (
      Ru(t),
      (t.updateQueue = null),
      (u = G0(t, a, u, e)),
      Y0(l),
      (a = Kf()),
      l !== null && !Al
        ? (Jf(l, t, n), Qt(l, t, n))
        : ($ && a && Of(t), (t.flags |= 1), Rl(l, t, u, n), t.child)
    );
  }
  function Bs(l, t, u, a, e) {
    if ((Ru(t), t.stateNode === null)) {
      var n = ta,
        f = u.contextType;
      (typeof f == "object" && f !== null && (n = Hl(f)),
        (n = new u(a, n)),
        (t.memoizedState =
          n.state !== null && n.state !== void 0 ? n.state : null),
        (n.updater = cc),
        (t.stateNode = n),
        (n._reactInternals = t),
        (n = t.stateNode),
        (n.props = a),
        (n.state = t.memoizedState),
        (n.refs = {}),
        Yf(t),
        (f = u.contextType),
        (n.context = typeof f == "object" && f !== null ? Hl(f) : ta),
        (n.state = t.memoizedState),
        (f = u.getDerivedStateFromProps),
        typeof f == "function" && (fc(t, u, f, a), (n.state = t.memoizedState)),
        typeof u.getDerivedStateFromProps == "function" ||
          typeof n.getSnapshotBeforeUpdate == "function" ||
          (typeof n.UNSAFE_componentWillMount != "function" &&
            typeof n.componentWillMount != "function") ||
          ((f = n.state),
          typeof n.componentWillMount == "function" && n.componentWillMount(),
          typeof n.UNSAFE_componentWillMount == "function" &&
            n.UNSAFE_componentWillMount(),
          f !== n.state && cc.enqueueReplaceState(n, n.state, null),
          Fa(t, a, n, e),
          $a(),
          (n.state = t.memoizedState)),
        typeof n.componentDidMount == "function" && (t.flags |= 4194308),
        (a = !0));
    } else if (l === null) {
      n = t.stateNode;
      var c = t.memoizedProps,
        i = ju(u, c);
      n.props = i;
      var h = n.context,
        g = u.contextType;
      ((f = ta), typeof g == "object" && g !== null && (f = Hl(g)));
      var z = u.getDerivedStateFromProps;
      ((g =
        typeof z == "function" ||
        typeof n.getSnapshotBeforeUpdate == "function"),
        (c = t.pendingProps !== c),
        g ||
          (typeof n.UNSAFE_componentWillReceiveProps != "function" &&
            typeof n.componentWillReceiveProps != "function") ||
          ((c || h !== f) && Es(t, n, a, f)),
        (au = !1));
      var o = t.memoizedState;
      ((n.state = o),
        Fa(t, a, n, e),
        $a(),
        (h = t.memoizedState),
        c || o !== h || au
          ? (typeof z == "function" && (fc(t, u, z, a), (h = t.memoizedState)),
            (i = au || zs(t, u, i, a, o, h, f))
              ? (g ||
                  (typeof n.UNSAFE_componentWillMount != "function" &&
                    typeof n.componentWillMount != "function") ||
                  (typeof n.componentWillMount == "function" &&
                    n.componentWillMount(),
                  typeof n.UNSAFE_componentWillMount == "function" &&
                    n.UNSAFE_componentWillMount()),
                typeof n.componentDidMount == "function" &&
                  (t.flags |= 4194308))
              : (typeof n.componentDidMount == "function" &&
                  (t.flags |= 4194308),
                (t.memoizedProps = a),
                (t.memoizedState = h)),
            (n.props = a),
            (n.state = h),
            (n.context = f),
            (a = i))
          : (typeof n.componentDidMount == "function" && (t.flags |= 4194308),
            (a = !1)));
    } else {
      ((n = t.stateNode),
        Gf(l, t),
        (f = t.memoizedProps),
        (g = ju(u, f)),
        (n.props = g),
        (z = t.pendingProps),
        (o = n.context),
        (h = u.contextType),
        (i = ta),
        typeof h == "object" && h !== null && (i = Hl(h)),
        (c = u.getDerivedStateFromProps),
        (h =
          typeof c == "function" ||
          typeof n.getSnapshotBeforeUpdate == "function") ||
          (typeof n.UNSAFE_componentWillReceiveProps != "function" &&
            typeof n.componentWillReceiveProps != "function") ||
          ((f !== z || o !== i) && Es(t, n, a, i)),
        (au = !1),
        (o = t.memoizedState),
        (n.state = o),
        Fa(t, a, n, e),
        $a());
      var S = t.memoizedState;
      f !== z ||
      o !== S ||
      au ||
      (l !== null && l.dependencies !== null && Le(l.dependencies))
        ? (typeof c == "function" && (fc(t, u, c, a), (S = t.memoizedState)),
          (g =
            au ||
            zs(t, u, g, a, o, S, i) ||
            (l !== null && l.dependencies !== null && Le(l.dependencies)))
            ? (h ||
                (typeof n.UNSAFE_componentWillUpdate != "function" &&
                  typeof n.componentWillUpdate != "function") ||
                (typeof n.componentWillUpdate == "function" &&
                  n.componentWillUpdate(a, S, i),
                typeof n.UNSAFE_componentWillUpdate == "function" &&
                  n.UNSAFE_componentWillUpdate(a, S, i)),
              typeof n.componentDidUpdate == "function" && (t.flags |= 4),
              typeof n.getSnapshotBeforeUpdate == "function" &&
                (t.flags |= 1024))
            : (typeof n.componentDidUpdate != "function" ||
                (f === l.memoizedProps && o === l.memoizedState) ||
                (t.flags |= 4),
              typeof n.getSnapshotBeforeUpdate != "function" ||
                (f === l.memoizedProps && o === l.memoizedState) ||
                (t.flags |= 1024),
              (t.memoizedProps = a),
              (t.memoizedState = S)),
          (n.props = a),
          (n.state = S),
          (n.context = i),
          (a = g))
        : (typeof n.componentDidUpdate != "function" ||
            (f === l.memoizedProps && o === l.memoizedState) ||
            (t.flags |= 4),
          typeof n.getSnapshotBeforeUpdate != "function" ||
            (f === l.memoizedProps && o === l.memoizedState) ||
            (t.flags |= 1024),
          (a = !1));
    }
    return (
      (n = a),
      yn(l, t),
      (a = (t.flags & 128) !== 0),
      n || a
        ? ((n = t.stateNode),
          (u =
            a && typeof u.getDerivedStateFromError != "function"
              ? null
              : n.render()),
          (t.flags |= 1),
          l !== null && a
            ? ((t.child = Yu(t, l.child, null, e)),
              (t.child = Yu(t, null, u, e)))
            : Rl(l, t, u, e),
          (t.memoizedState = n.state),
          (l = t.child))
        : (l = Qt(l, t, e)),
      l
    );
  }
  function Ys(l, t, u, a) {
    return (Nu(), (t.flags |= 256), Rl(l, t, u, a), t.child);
  }
  var vc = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null,
  };
  function mc(l) {
    return { baseLanes: l, cachePool: O0() };
  }
  function dc(l, t, u) {
    return ((l = l !== null ? l.childLanes & ~u : 0), t && (l |= ft), l);
  }
  function Gs(l, t, u) {
    var a = t.pendingProps,
      e = !1,
      n = (t.flags & 128) !== 0,
      f;
    if (
      ((f = n) ||
        (f =
          l !== null && l.memoizedState === null ? !1 : (bl.current & 2) !== 0),
      f && ((e = !0), (t.flags &= -129)),
      (f = (t.flags & 32) !== 0),
      (t.flags &= -33),
      l === null)
    ) {
      if ($) {
        if (
          (e ? fu(t) : cu(),
          (l = ml)
            ? ((l = Ky(l, ot)),
              (l = l !== null && l.data !== "&" ? l : null),
              l !== null &&
                ((t.memoizedState = {
                  dehydrated: l,
                  treeContext: Pt !== null ? { id: Mt, overflow: pt } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (u = S0(l)),
                (u.return = t),
                (t.child = u),
                (Nl = t),
                (ml = null)))
            : (l = null),
          l === null)
        )
          throw tu(t);
        return ($c(l) ? (t.lanes = 32) : (t.lanes = 536870912), null);
      }
      var c = a.children;
      return (
        (a = a.fallback),
        e
          ? (cu(),
            (e = t.mode),
            (c = vn({ mode: "hidden", children: c }, e)),
            (a = Uu(a, e, u, null)),
            (c.return = t),
            (a.return = t),
            (c.sibling = a),
            (t.child = c),
            (a = t.child),
            (a.memoizedState = mc(u)),
            (a.childLanes = dc(l, f, u)),
            (t.memoizedState = vc),
            te(null, a))
          : (fu(t), hc(t, c))
      );
    }
    var i = l.memoizedState;
    if (i !== null && ((c = i.dehydrated), c !== null)) {
      if (n)
        t.flags & 256
          ? (fu(t), (t.flags &= -257), (t = oc(l, t, u)))
          : t.memoizedState !== null
            ? (cu(), (t.child = l.child), (t.flags |= 128), (t = null))
            : (cu(),
              (c = a.fallback),
              (e = t.mode),
              (a = vn({ mode: "visible", children: a.children }, e)),
              (c = Uu(c, e, u, null)),
              (c.flags |= 2),
              (a.return = t),
              (c.return = t),
              (a.sibling = c),
              (t.child = a),
              Yu(t, l.child, null, u),
              (a = t.child),
              (a.memoizedState = mc(u)),
              (a.childLanes = dc(l, f, u)),
              (t.memoizedState = vc),
              (t = te(null, a)));
      else if ((fu(t), $c(c))) {
        if (((f = c.nextSibling && c.nextSibling.dataset), f)) var h = f.dgst;
        ((f = h),
          (a = Error(m(419))),
          (a.stack = ""),
          (a.digest = f),
          Va({ value: a, source: null, stack: null }),
          (t = oc(l, t, u)));
      } else if (
        (Al || na(l, t, u, !1), (f = (u & l.childLanes) !== 0), Al || f)
      ) {
        if (
          ((f = yl),
          f !== null && ((a = Ai(f, u)), a !== 0 && a !== i.retryLane))
        )
          throw ((i.retryLane = a), Du(l, a), $l(f, l, a), sc);
        (Wc(c) || zn(), (t = oc(l, t, u)));
      } else
        Wc(c)
          ? ((t.flags |= 192), (t.child = l.child), (t = null))
          : ((l = i.treeContext),
            (ml = gt(c.nextSibling)),
            (Nl = t),
            ($ = !0),
            (lu = null),
            (ot = !1),
            l !== null && b0(t, l),
            (t = hc(t, a.children)),
            (t.flags |= 4096));
      return t;
    }
    return e
      ? (cu(),
        (c = a.fallback),
        (e = t.mode),
        (i = l.child),
        (h = i.sibling),
        (a = qt(i, { mode: "hidden", children: a.children })),
        (a.subtreeFlags = i.subtreeFlags & 65011712),
        h !== null ? (c = qt(h, c)) : ((c = Uu(c, e, u, null)), (c.flags |= 2)),
        (c.return = t),
        (a.return = t),
        (a.sibling = c),
        (t.child = a),
        te(null, a),
        (a = t.child),
        (c = l.child.memoizedState),
        c === null
          ? (c = mc(u))
          : ((e = c.cachePool),
            e !== null
              ? ((i = El._currentValue),
                (e = e.parent !== i ? { parent: i, pool: i } : e))
              : (e = O0()),
            (c = { baseLanes: c.baseLanes | u, cachePool: e })),
        (a.memoizedState = c),
        (a.childLanes = dc(l, f, u)),
        (t.memoizedState = vc),
        te(l.child, a))
      : (fu(t),
        (u = l.child),
        (l = u.sibling),
        (u = qt(u, { mode: "visible", children: a.children })),
        (u.return = t),
        (u.sibling = null),
        l !== null &&
          ((f = t.deletions),
          f === null ? ((t.deletions = [l]), (t.flags |= 16)) : f.push(l)),
        (t.child = u),
        (t.memoizedState = null),
        u);
  }
  function hc(l, t) {
    return (
      (t = vn({ mode: "visible", children: t }, l.mode)),
      (t.return = l),
      (l.child = t)
    );
  }
  function vn(l, t) {
    return ((l = ut(22, l, null, t)), (l.lanes = 0), l);
  }
  function oc(l, t, u) {
    return (
      Yu(t, l.child, null, u),
      (l = hc(t, t.pendingProps.children)),
      (l.flags |= 2),
      (t.memoizedState = null),
      l
    );
  }
  function js(l, t, u) {
    l.lanes |= t;
    var a = l.alternate;
    (a !== null && (a.lanes |= t), Nf(l.return, t, u));
  }
  function Sc(l, t, u, a, e, n) {
    var f = l.memoizedState;
    f === null
      ? (l.memoizedState = {
          isBackwards: t,
          rendering: null,
          renderingStartTime: 0,
          last: a,
          tail: u,
          tailMode: e,
          treeForkCount: n,
        })
      : ((f.isBackwards = t),
        (f.rendering = null),
        (f.renderingStartTime = 0),
        (f.last = a),
        (f.tail = u),
        (f.tailMode = e),
        (f.treeForkCount = n));
  }
  function Xs(l, t, u) {
    var a = t.pendingProps,
      e = a.revealOrder,
      n = a.tail;
    a = a.children;
    var f = bl.current,
      c = (f & 2) !== 0;
    if (
      (c ? ((f = (f & 1) | 2), (t.flags |= 128)) : (f &= 1),
      O(bl, f),
      Rl(l, t, a, u),
      (a = $ ? Za : 0),
      !c && l !== null && (l.flags & 128) !== 0)
    )
      l: for (l = t.child; l !== null; ) {
        if (l.tag === 13) l.memoizedState !== null && js(l, u, t);
        else if (l.tag === 19) js(l, u, t);
        else if (l.child !== null) {
          ((l.child.return = l), (l = l.child));
          continue;
        }
        if (l === t) break l;
        for (; l.sibling === null; ) {
          if (l.return === null || l.return === t) break l;
          l = l.return;
        }
        ((l.sibling.return = l.return), (l = l.sibling));
      }
    switch (e) {
      case "forwards":
        for (u = t.child, e = null; u !== null; )
          ((l = u.alternate),
            l !== null && Ie(l) === null && (e = u),
            (u = u.sibling));
        ((u = e),
          u === null
            ? ((e = t.child), (t.child = null))
            : ((e = u.sibling), (u.sibling = null)),
          Sc(t, !1, e, u, n, a));
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (u = null, e = t.child, t.child = null; e !== null; ) {
          if (((l = e.alternate), l !== null && Ie(l) === null)) {
            t.child = e;
            break;
          }
          ((l = e.sibling), (e.sibling = u), (u = e), (e = l));
        }
        Sc(t, !0, u, null, n, a);
        break;
      case "together":
        Sc(t, !1, null, null, void 0, a);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Qt(l, t, u) {
    if (
      (l !== null && (t.dependencies = l.dependencies),
      (yu |= t.lanes),
      (u & t.childLanes) === 0)
    )
      if (l !== null) {
        if ((na(l, t, u, !1), (u & t.childLanes) === 0)) return null;
      } else return null;
    if (l !== null && t.child !== l.child) throw Error(m(153));
    if (t.child !== null) {
      for (
        l = t.child, u = qt(l, l.pendingProps), t.child = u, u.return = t;
        l.sibling !== null;
      )
        ((l = l.sibling),
          (u = u.sibling = qt(l, l.pendingProps)),
          (u.return = t));
      u.sibling = null;
    }
    return t.child;
  }
  function gc(l, t) {
    return (l.lanes & t) !== 0
      ? !0
      : ((l = l.dependencies), !!(l !== null && Le(l)));
  }
  function km(l, t, u) {
    switch (t.tag) {
      case 3:
        (Gl(t, t.stateNode.containerInfo),
          uu(t, El, l.memoizedState.cache),
          Nu());
        break;
      case 27:
      case 5:
        pa(t);
        break;
      case 4:
        Gl(t, t.stateNode.containerInfo);
        break;
      case 10:
        uu(t, t.type, t.memoizedProps.value);
        break;
      case 31:
        if (t.memoizedState !== null) return ((t.flags |= 128), Zf(t), null);
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null
            ? (fu(t), (t.flags |= 128), null)
            : (u & t.child.childLanes) !== 0
              ? Gs(l, t, u)
              : (fu(t), (l = Qt(l, t, u)), l !== null ? l.sibling : null);
        fu(t);
        break;
      case 19:
        var e = (l.flags & 128) !== 0;
        if (
          ((a = (u & t.childLanes) !== 0),
          a || (na(l, t, u, !1), (a = (u & t.childLanes) !== 0)),
          e)
        ) {
          if (a) return Xs(l, t, u);
          t.flags |= 128;
        }
        if (
          ((e = t.memoizedState),
          e !== null &&
            ((e.rendering = null), (e.tail = null), (e.lastEffect = null)),
          O(bl, bl.current),
          a)
        )
          break;
        return null;
      case 22:
        return ((t.lanes = 0), Hs(l, t, u, t.pendingProps));
      case 24:
        uu(t, El, l.memoizedState.cache);
    }
    return Qt(l, t, u);
  }
  function Qs(l, t, u) {
    if (l !== null)
      if (l.memoizedProps !== t.pendingProps) Al = !0;
      else {
        if (!gc(l, u) && (t.flags & 128) === 0) return ((Al = !1), km(l, t, u));
        Al = (l.flags & 131072) !== 0;
      }
    else ((Al = !1), $ && (t.flags & 1048576) !== 0 && r0(t, Za, t.index));
    switch (((t.lanes = 0), t.tag)) {
      case 16:
        l: {
          var a = t.pendingProps;
          if (((l = qu(t.elementType)), (t.type = l), typeof l == "function"))
            Tf(l)
              ? ((a = ju(l, a)), (t.tag = 1), (t = Bs(null, t, l, a, u)))
              : ((t.tag = 0), (t = yc(null, t, l, a, u)));
          else {
            if (l != null) {
              var e = l.$$typeof;
              if (e === it) {
                ((t.tag = 11), (t = Ds(null, t, l, a, u)));
                break l;
              } else if (e === W) {
                ((t.tag = 14), (t = Us(null, t, l, a, u)));
                break l;
              }
            }
            throw ((t = Nt(l) || l), Error(m(306, t, "")));
          }
        }
        return t;
      case 0:
        return yc(l, t, t.type, t.pendingProps, u);
      case 1:
        return ((a = t.type), (e = ju(a, t.pendingProps)), Bs(l, t, a, e, u));
      case 3:
        l: {
          if ((Gl(t, t.stateNode.containerInfo), l === null))
            throw Error(m(387));
          a = t.pendingProps;
          var n = t.memoizedState;
          ((e = n.element), Gf(l, t), Fa(t, a, null, u));
          var f = t.memoizedState;
          if (
            ((a = f.cache),
            uu(t, El, a),
            a !== n.cache && Hf(t, [El], u, !0),
            $a(),
            (a = f.element),
            n.isDehydrated)
          )
            if (
              ((n = { element: a, isDehydrated: !1, cache: f.cache }),
              (t.updateQueue.baseState = n),
              (t.memoizedState = n),
              t.flags & 256)
            ) {
              t = Ys(l, t, a, u);
              break l;
            } else if (a !== e) {
              ((e = mt(Error(m(424)), t)), Va(e), (t = Ys(l, t, a, u)));
              break l;
            } else
              for (
                l = t.stateNode.containerInfo,
                  l.nodeType === 9
                    ? (l = l.body)
                    : (l = l.nodeName === "HTML" ? l.ownerDocument.body : l),
                  ml = gt(l.firstChild),
                  Nl = t,
                  $ = !0,
                  lu = null,
                  ot = !0,
                  u = H0(t, null, a, u),
                  t.child = u;
                u;
              )
                ((u.flags = (u.flags & -3) | 4096), (u = u.sibling));
          else {
            if ((Nu(), a === e)) {
              t = Qt(l, t, u);
              break l;
            }
            Rl(l, t, a, u);
          }
          t = t.child;
        }
        return t;
      case 26:
        return (
          yn(l, t),
          l === null
            ? (u = ky(t.type, null, t.pendingProps, null))
              ? (t.memoizedState = u)
              : $ ||
                ((u = t.type),
                (l = t.pendingProps),
                (a = pn(V.current).createElement(u)),
                (a[Ul] = t),
                (a[Vl] = l),
                Cl(a, u, l),
                Ml(a),
                (t.stateNode = a))
            : (t.memoizedState = ky(
                t.type,
                l.memoizedProps,
                t.pendingProps,
                l.memoizedState,
              )),
          null
        );
      case 27:
        return (
          pa(t),
          l === null &&
            $ &&
            ((a = t.stateNode = Wy(t.type, t.pendingProps, V.current)),
            (Nl = t),
            (ot = !0),
            (e = ml),
            ou(t.type) ? ((Fc = e), (ml = gt(a.firstChild))) : (ml = e)),
          Rl(l, t, t.pendingProps.children, u),
          yn(l, t),
          l === null && (t.flags |= 4194304),
          t.child
        );
      case 5:
        return (
          l === null &&
            $ &&
            ((e = a = ml) &&
              ((a = pd(a, t.type, t.pendingProps, ot)),
              a !== null
                ? ((t.stateNode = a),
                  (Nl = t),
                  (ml = gt(a.firstChild)),
                  (ot = !1),
                  (e = !0))
                : (e = !1)),
            e || tu(t)),
          pa(t),
          (e = t.type),
          (n = t.pendingProps),
          (f = l !== null ? l.memoizedProps : null),
          (a = n.children),
          Kc(e, n) ? (a = null) : f !== null && Kc(e, f) && (t.flags |= 32),
          t.memoizedState !== null &&
            ((e = Lf(l, t, Zm, null, null, u)), (Se._currentValue = e)),
          yn(l, t),
          Rl(l, t, a, u),
          t.child
        );
      case 6:
        return (
          l === null &&
            $ &&
            ((l = u = ml) &&
              ((u = Dd(u, t.pendingProps, ot)),
              u !== null
                ? ((t.stateNode = u), (Nl = t), (ml = null), (l = !0))
                : (l = !1)),
            l || tu(t)),
          null
        );
      case 13:
        return Gs(l, t, u);
      case 4:
        return (
          Gl(t, t.stateNode.containerInfo),
          (a = t.pendingProps),
          l === null ? (t.child = Yu(t, null, a, u)) : Rl(l, t, a, u),
          t.child
        );
      case 11:
        return Ds(l, t, t.type, t.pendingProps, u);
      case 7:
        return (Rl(l, t, t.pendingProps, u), t.child);
      case 8:
        return (Rl(l, t, t.pendingProps.children, u), t.child);
      case 12:
        return (Rl(l, t, t.pendingProps.children, u), t.child);
      case 10:
        return (
          (a = t.pendingProps),
          uu(t, t.type, a.value),
          Rl(l, t, a.children, u),
          t.child
        );
      case 9:
        return (
          (e = t.type._context),
          (a = t.pendingProps.children),
          Ru(t),
          (e = Hl(e)),
          (a = a(e)),
          (t.flags |= 1),
          Rl(l, t, a, u),
          t.child
        );
      case 14:
        return Us(l, t, t.type, t.pendingProps, u);
      case 15:
        return Ns(l, t, t.type, t.pendingProps, u);
      case 19:
        return Xs(l, t, u);
      case 31:
        return Fm(l, t, u);
      case 22:
        return Hs(l, t, u, t.pendingProps);
      case 24:
        return (
          Ru(t),
          (a = Hl(El)),
          l === null
            ? ((e = qf()),
              e === null &&
                ((e = yl),
                (n = Rf()),
                (e.pooledCache = n),
                n.refCount++,
                n !== null && (e.pooledCacheLanes |= u),
                (e = n)),
              (t.memoizedState = { parent: a, cache: e }),
              Yf(t),
              uu(t, El, e))
            : ((l.lanes & u) !== 0 && (Gf(l, t), Fa(t, null, null, u), $a()),
              (e = l.memoizedState),
              (n = t.memoizedState),
              e.parent !== a
                ? ((e = { parent: a, cache: a }),
                  (t.memoizedState = e),
                  t.lanes === 0 &&
                    (t.memoizedState = t.updateQueue.baseState = e),
                  uu(t, El, a))
                : ((a = n.cache),
                  uu(t, El, a),
                  a !== e.cache && Hf(t, [El], u, !0))),
          Rl(l, t, t.pendingProps.children, u),
          t.child
        );
      case 29:
        throw t.pendingProps;
    }
    throw Error(m(156, t.tag));
  }
  function xt(l) {
    l.flags |= 4;
  }
  function rc(l, t, u, a, e) {
    if (((t = (l.mode & 32) !== 0) && (t = !1), t)) {
      if (((l.flags |= 16777216), (e & 335544128) === e))
        if (l.stateNode.complete) l.flags |= 8192;
        else if (dy()) l.flags |= 8192;
        else throw ((Bu = We), Bf);
    } else l.flags &= -16777217;
  }
  function xs(l, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      l.flags &= -16777217;
    else if (((l.flags |= 16777216), !uv(t)))
      if (dy()) l.flags |= 8192;
      else throw ((Bu = We), Bf);
  }
  function mn(l, t) {
    (t !== null && (l.flags |= 4),
      l.flags & 16384 &&
        ((t = l.tag !== 22 ? zi() : 536870912), (l.lanes |= t), (ga |= t)));
  }
  function ue(l, t) {
    if (!$)
      switch (l.tailMode) {
        case "hidden":
          t = l.tail;
          for (var u = null; t !== null; )
            (t.alternate !== null && (u = t), (t = t.sibling));
          u === null ? (l.tail = null) : (u.sibling = null);
          break;
        case "collapsed":
          u = l.tail;
          for (var a = null; u !== null; )
            (u.alternate !== null && (a = u), (u = u.sibling));
          a === null
            ? t || l.tail === null
              ? (l.tail = null)
              : (l.tail.sibling = null)
            : (a.sibling = null);
      }
  }
  function dl(l) {
    var t = l.alternate !== null && l.alternate.child === l.child,
      u = 0,
      a = 0;
    if (t)
      for (var e = l.child; e !== null; )
        ((u |= e.lanes | e.childLanes),
          (a |= e.subtreeFlags & 65011712),
          (a |= e.flags & 65011712),
          (e.return = l),
          (e = e.sibling));
    else
      for (e = l.child; e !== null; )
        ((u |= e.lanes | e.childLanes),
          (a |= e.subtreeFlags),
          (a |= e.flags),
          (e.return = l),
          (e = e.sibling));
    return ((l.subtreeFlags |= a), (l.childLanes = u), t);
  }
  function Im(l, t, u) {
    var a = t.pendingProps;
    switch ((Mf(t), t.tag)) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (dl(t), null);
      case 1:
        return (dl(t), null);
      case 3:
        return (
          (u = t.stateNode),
          (a = null),
          l !== null && (a = l.memoizedState.cache),
          t.memoizedState.cache !== a && (t.flags |= 2048),
          Gt(El),
          rl(),
          u.pendingContext &&
            ((u.context = u.pendingContext), (u.pendingContext = null)),
          (l === null || l.child === null) &&
            (ea(t)
              ? xt(t)
              : l === null ||
                (l.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
                ((t.flags |= 1024), Df())),
          dl(t),
          null
        );
      case 26:
        var e = t.type,
          n = t.memoizedState;
        return (
          l === null
            ? (xt(t),
              n !== null ? (dl(t), xs(t, n)) : (dl(t), rc(t, e, null, a, u)))
            : n
              ? n !== l.memoizedState
                ? (xt(t), dl(t), xs(t, n))
                : (dl(t), (t.flags &= -16777217))
              : ((l = l.memoizedProps),
                l !== a && xt(t),
                dl(t),
                rc(t, e, l, a, u)),
          null
        );
      case 27:
        if (
          (Te(t),
          (u = V.current),
          (e = t.type),
          l !== null && t.stateNode != null)
        )
          l.memoizedProps !== a && xt(t);
        else {
          if (!a) {
            if (t.stateNode === null) throw Error(m(166));
            return (dl(t), null);
          }
          ((l = D.current),
            ea(t) ? z0(t) : ((l = Wy(e, a, u)), (t.stateNode = l), xt(t)));
        }
        return (dl(t), null);
      case 5:
        if ((Te(t), (e = t.type), l !== null && t.stateNode != null))
          l.memoizedProps !== a && xt(t);
        else {
          if (!a) {
            if (t.stateNode === null) throw Error(m(166));
            return (dl(t), null);
          }
          if (((n = D.current), ea(t))) z0(t);
          else {
            var f = pn(V.current);
            switch (n) {
              case 1:
                n = f.createElementNS("http://www.w3.org/2000/svg", e);
                break;
              case 2:
                n = f.createElementNS("http://www.w3.org/1998/Math/MathML", e);
                break;
              default:
                switch (e) {
                  case "svg":
                    n = f.createElementNS("http://www.w3.org/2000/svg", e);
                    break;
                  case "math":
                    n = f.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      e,
                    );
                    break;
                  case "script":
                    ((n = f.createElement("div")),
                      (n.innerHTML = "<script><\/script>"),
                      (n = n.removeChild(n.firstChild)));
                    break;
                  case "select":
                    ((n =
                      typeof a.is == "string"
                        ? f.createElement("select", { is: a.is })
                        : f.createElement("select")),
                      a.multiple
                        ? (n.multiple = !0)
                        : a.size && (n.size = a.size));
                    break;
                  default:
                    n =
                      typeof a.is == "string"
                        ? f.createElement(e, { is: a.is })
                        : f.createElement(e);
                }
            }
            ((n[Ul] = t), (n[Vl] = a));
            l: for (f = t.child; f !== null; ) {
              if (f.tag === 5 || f.tag === 6) n.appendChild(f.stateNode);
              else if (f.tag !== 4 && f.tag !== 27 && f.child !== null) {
                ((f.child.return = f), (f = f.child));
                continue;
              }
              if (f === t) break l;
              for (; f.sibling === null; ) {
                if (f.return === null || f.return === t) break l;
                f = f.return;
              }
              ((f.sibling.return = f.return), (f = f.sibling));
            }
            t.stateNode = n;
            l: switch ((Cl(n, e, a), e)) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break l;
              case "img":
                a = !0;
                break l;
              default:
                a = !1;
            }
            a && xt(t);
          }
        }
        return (
          dl(t),
          rc(t, t.type, l === null ? null : l.memoizedProps, t.pendingProps, u),
          null
        );
      case 6:
        if (l && t.stateNode != null) l.memoizedProps !== a && xt(t);
        else {
          if (typeof a != "string" && t.stateNode === null) throw Error(m(166));
          if (((l = V.current), ea(t))) {
            if (
              ((l = t.stateNode),
              (u = t.memoizedProps),
              (a = null),
              (e = Nl),
              e !== null)
            )
              switch (e.tag) {
                case 27:
                case 5:
                  a = e.memoizedProps;
              }
            ((l[Ul] = t),
              (l = !!(
                l.nodeValue === u ||
                (a !== null && a.suppressHydrationWarning === !0) ||
                Gy(l.nodeValue, u)
              )),
              l || tu(t, !0));
          } else
            ((l = pn(l).createTextNode(a)), (l[Ul] = t), (t.stateNode = l));
        }
        return (dl(t), null);
      case 31:
        if (((u = t.memoizedState), l === null || l.memoizedState !== null)) {
          if (((a = ea(t)), u !== null)) {
            if (l === null) {
              if (!a) throw Error(m(318));
              if (
                ((l = t.memoizedState),
                (l = l !== null ? l.dehydrated : null),
                !l)
              )
                throw Error(m(557));
              l[Ul] = t;
            } else
              (Nu(),
                (t.flags & 128) === 0 && (t.memoizedState = null),
                (t.flags |= 4));
            (dl(t), (l = !1));
          } else
            ((u = Df()),
              l !== null &&
                l.memoizedState !== null &&
                (l.memoizedState.hydrationErrors = u),
              (l = !0));
          if (!l) return t.flags & 256 ? (et(t), t) : (et(t), null);
          if ((t.flags & 128) !== 0) throw Error(m(558));
        }
        return (dl(t), null);
      case 13:
        if (
          ((a = t.memoizedState),
          l === null ||
            (l.memoizedState !== null && l.memoizedState.dehydrated !== null))
        ) {
          if (((e = ea(t)), a !== null && a.dehydrated !== null)) {
            if (l === null) {
              if (!e) throw Error(m(318));
              if (
                ((e = t.memoizedState),
                (e = e !== null ? e.dehydrated : null),
                !e)
              )
                throw Error(m(317));
              e[Ul] = t;
            } else
              (Nu(),
                (t.flags & 128) === 0 && (t.memoizedState = null),
                (t.flags |= 4));
            (dl(t), (e = !1));
          } else
            ((e = Df()),
              l !== null &&
                l.memoizedState !== null &&
                (l.memoizedState.hydrationErrors = e),
              (e = !0));
          if (!e) return t.flags & 256 ? (et(t), t) : (et(t), null);
        }
        return (
          et(t),
          (t.flags & 128) !== 0
            ? ((t.lanes = u), t)
            : ((u = a !== null),
              (l = l !== null && l.memoizedState !== null),
              u &&
                ((a = t.child),
                (e = null),
                a.alternate !== null &&
                  a.alternate.memoizedState !== null &&
                  a.alternate.memoizedState.cachePool !== null &&
                  (e = a.alternate.memoizedState.cachePool.pool),
                (n = null),
                a.memoizedState !== null &&
                  a.memoizedState.cachePool !== null &&
                  (n = a.memoizedState.cachePool.pool),
                n !== e && (a.flags |= 2048)),
              u !== l && u && (t.child.flags |= 8192),
              mn(t, t.updateQueue),
              dl(t),
              null)
        );
      case 4:
        return (rl(), l === null && Qc(t.stateNode.containerInfo), dl(t), null);
      case 10:
        return (Gt(t.type), dl(t), null);
      case 19:
        if ((E(bl), (a = t.memoizedState), a === null)) return (dl(t), null);
        if (((e = (t.flags & 128) !== 0), (n = a.rendering), n === null))
          if (e) ue(a, !1);
          else {
            if (gl !== 0 || (l !== null && (l.flags & 128) !== 0))
              for (l = t.child; l !== null; ) {
                if (((n = Ie(l)), n !== null)) {
                  for (
                    t.flags |= 128,
                      ue(a, !1),
                      l = n.updateQueue,
                      t.updateQueue = l,
                      mn(t, l),
                      t.subtreeFlags = 0,
                      l = u,
                      u = t.child;
                    u !== null;
                  )
                    (o0(u, l), (u = u.sibling));
                  return (
                    O(bl, (bl.current & 1) | 2),
                    $ && Bt(t, a.treeForkCount),
                    t.child
                  );
                }
                l = l.sibling;
              }
            a.tail !== null &&
              Il() > gn &&
              ((t.flags |= 128), (e = !0), ue(a, !1), (t.lanes = 4194304));
          }
        else {
          if (!e)
            if (((l = Ie(n)), l !== null)) {
              if (
                ((t.flags |= 128),
                (e = !0),
                (l = l.updateQueue),
                (t.updateQueue = l),
                mn(t, l),
                ue(a, !0),
                a.tail === null &&
                  a.tailMode === "hidden" &&
                  !n.alternate &&
                  !$)
              )
                return (dl(t), null);
            } else
              2 * Il() - a.renderingStartTime > gn &&
                u !== 536870912 &&
                ((t.flags |= 128), (e = !0), ue(a, !1), (t.lanes = 4194304));
          a.isBackwards
            ? ((n.sibling = t.child), (t.child = n))
            : ((l = a.last),
              l !== null ? (l.sibling = n) : (t.child = n),
              (a.last = n));
        }
        return a.tail !== null
          ? ((l = a.tail),
            (a.rendering = l),
            (a.tail = l.sibling),
            (a.renderingStartTime = Il()),
            (l.sibling = null),
            (u = bl.current),
            O(bl, e ? (u & 1) | 2 : u & 1),
            $ && Bt(t, a.treeForkCount),
            l)
          : (dl(t), null);
      case 22:
      case 23:
        return (
          et(t),
          xf(),
          (a = t.memoizedState !== null),
          l !== null
            ? (l.memoizedState !== null) !== a && (t.flags |= 8192)
            : a && (t.flags |= 8192),
          a
            ? (u & 536870912) !== 0 &&
              (t.flags & 128) === 0 &&
              (dl(t), t.subtreeFlags & 6 && (t.flags |= 8192))
            : dl(t),
          (u = t.updateQueue),
          u !== null && mn(t, u.retryQueue),
          (u = null),
          l !== null &&
            l.memoizedState !== null &&
            l.memoizedState.cachePool !== null &&
            (u = l.memoizedState.cachePool.pool),
          (a = null),
          t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (a = t.memoizedState.cachePool.pool),
          a !== u && (t.flags |= 2048),
          l !== null && E(Cu),
          null
        );
      case 24:
        return (
          (u = null),
          l !== null && (u = l.memoizedState.cache),
          t.memoizedState.cache !== u && (t.flags |= 2048),
          Gt(El),
          dl(t),
          null
        );
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(m(156, t.tag));
  }
  function Pm(l, t) {
    switch ((Mf(t), t.tag)) {
      case 1:
        return (
          (l = t.flags),
          l & 65536 ? ((t.flags = (l & -65537) | 128), t) : null
        );
      case 3:
        return (
          Gt(El),
          rl(),
          (l = t.flags),
          (l & 65536) !== 0 && (l & 128) === 0
            ? ((t.flags = (l & -65537) | 128), t)
            : null
        );
      case 26:
      case 27:
      case 5:
        return (Te(t), null);
      case 31:
        if (t.memoizedState !== null) {
          if ((et(t), t.alternate === null)) throw Error(m(340));
          Nu();
        }
        return (
          (l = t.flags),
          l & 65536 ? ((t.flags = (l & -65537) | 128), t) : null
        );
      case 13:
        if (
          (et(t), (l = t.memoizedState), l !== null && l.dehydrated !== null)
        ) {
          if (t.alternate === null) throw Error(m(340));
          Nu();
        }
        return (
          (l = t.flags),
          l & 65536 ? ((t.flags = (l & -65537) | 128), t) : null
        );
      case 19:
        return (E(bl), null);
      case 4:
        return (rl(), null);
      case 10:
        return (Gt(t.type), null);
      case 22:
      case 23:
        return (
          et(t),
          xf(),
          l !== null && E(Cu),
          (l = t.flags),
          l & 65536 ? ((t.flags = (l & -65537) | 128), t) : null
        );
      case 24:
        return (Gt(El), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Zs(l, t) {
    switch ((Mf(t), t.tag)) {
      case 3:
        (Gt(El), rl());
        break;
      case 26:
      case 27:
      case 5:
        Te(t);
        break;
      case 4:
        rl();
        break;
      case 31:
        t.memoizedState !== null && et(t);
        break;
      case 13:
        et(t);
        break;
      case 19:
        E(bl);
        break;
      case 10:
        Gt(t.type);
        break;
      case 22:
      case 23:
        (et(t), xf(), l !== null && E(Cu));
        break;
      case 24:
        Gt(El);
    }
  }
  function ae(l, t) {
    try {
      var u = t.updateQueue,
        a = u !== null ? u.lastEffect : null;
      if (a !== null) {
        var e = a.next;
        u = e;
        do {
          if ((u.tag & l) === l) {
            a = void 0;
            var n = u.create,
              f = u.inst;
            ((a = n()), (f.destroy = a));
          }
          u = u.next;
        } while (u !== e);
      }
    } catch (c) {
      el(t, t.return, c);
    }
  }
  function iu(l, t, u) {
    try {
      var a = t.updateQueue,
        e = a !== null ? a.lastEffect : null;
      if (e !== null) {
        var n = e.next;
        a = n;
        do {
          if ((a.tag & l) === l) {
            var f = a.inst,
              c = f.destroy;
            if (c !== void 0) {
              ((f.destroy = void 0), (e = t));
              var i = u,
                h = c;
              try {
                h();
              } catch (g) {
                el(e, i, g);
              }
            }
          }
          a = a.next;
        } while (a !== n);
      }
    } catch (g) {
      el(t, t.return, g);
    }
  }
  function Vs(l) {
    var t = l.updateQueue;
    if (t !== null) {
      var u = l.stateNode;
      try {
        C0(t, u);
      } catch (a) {
        el(l, l.return, a);
      }
    }
  }
  function Ls(l, t, u) {
    ((u.props = ju(l.type, l.memoizedProps)), (u.state = l.memoizedState));
    try {
      u.componentWillUnmount();
    } catch (a) {
      el(l, t, a);
    }
  }
  function ee(l, t) {
    try {
      var u = l.ref;
      if (u !== null) {
        switch (l.tag) {
          case 26:
          case 27:
          case 5:
            var a = l.stateNode;
            break;
          case 30:
            a = l.stateNode;
            break;
          default:
            a = l.stateNode;
        }
        typeof u == "function" ? (l.refCleanup = u(a)) : (u.current = a);
      }
    } catch (e) {
      el(l, t, e);
    }
  }
  function Dt(l, t) {
    var u = l.ref,
      a = l.refCleanup;
    if (u !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (e) {
          el(l, t, e);
        } finally {
          ((l.refCleanup = null),
            (l = l.alternate),
            l != null && (l.refCleanup = null));
        }
      else if (typeof u == "function")
        try {
          u(null);
        } catch (e) {
          el(l, t, e);
        }
      else u.current = null;
  }
  function Ks(l) {
    var t = l.type,
      u = l.memoizedProps,
      a = l.stateNode;
    try {
      l: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          u.autoFocus && a.focus();
          break l;
        case "img":
          u.src ? (a.src = u.src) : u.srcSet && (a.srcset = u.srcSet);
      }
    } catch (e) {
      el(l, l.return, e);
    }
  }
  function bc(l, t, u) {
    try {
      var a = l.stateNode;
      (Ed(a, l.type, u, t), (a[Vl] = t));
    } catch (e) {
      el(l, l.return, e);
    }
  }
  function Js(l) {
    return (
      l.tag === 5 ||
      l.tag === 3 ||
      l.tag === 26 ||
      (l.tag === 27 && ou(l.type)) ||
      l.tag === 4
    );
  }
  function zc(l) {
    l: for (;;) {
      for (; l.sibling === null; ) {
        if (l.return === null || Js(l.return)) return null;
        l = l.return;
      }
      for (
        l.sibling.return = l.return, l = l.sibling;
        l.tag !== 5 && l.tag !== 6 && l.tag !== 18;
      ) {
        if (
          (l.tag === 27 && ou(l.type)) ||
          l.flags & 2 ||
          l.child === null ||
          l.tag === 4
        )
          continue l;
        ((l.child.return = l), (l = l.child));
      }
      if (!(l.flags & 2)) return l.stateNode;
    }
  }
  function Ec(l, t, u) {
    var a = l.tag;
    if (a === 5 || a === 6)
      ((l = l.stateNode),
        t
          ? (u.nodeType === 9
              ? u.body
              : u.nodeName === "HTML"
                ? u.ownerDocument.body
                : u
            ).insertBefore(l, t)
          : ((t =
              u.nodeType === 9
                ? u.body
                : u.nodeName === "HTML"
                  ? u.ownerDocument.body
                  : u),
            t.appendChild(l),
            (u = u._reactRootContainer),
            u != null || t.onclick !== null || (t.onclick = Rt)));
    else if (
      a !== 4 &&
      (a === 27 && ou(l.type) && ((u = l.stateNode), (t = null)),
      (l = l.child),
      l !== null)
    )
      for (Ec(l, t, u), l = l.sibling; l !== null; )
        (Ec(l, t, u), (l = l.sibling));
  }
  function dn(l, t, u) {
    var a = l.tag;
    if (a === 5 || a === 6)
      ((l = l.stateNode), t ? u.insertBefore(l, t) : u.appendChild(l));
    else if (
      a !== 4 &&
      (a === 27 && ou(l.type) && (u = l.stateNode), (l = l.child), l !== null)
    )
      for (dn(l, t, u), l = l.sibling; l !== null; )
        (dn(l, t, u), (l = l.sibling));
  }
  function ws(l) {
    var t = l.stateNode,
      u = l.memoizedProps;
    try {
      for (var a = l.type, e = t.attributes; e.length; )
        t.removeAttributeNode(e[0]);
      (Cl(t, a, u), (t[Ul] = l), (t[Vl] = u));
    } catch (n) {
      el(l, l.return, n);
    }
  }
  var Zt = !1,
    _l = !1,
    Tc = !1,
    Ws = typeof WeakSet == "function" ? WeakSet : Set,
    pl = null;
  function ld(l, t) {
    if (((l = l.containerInfo), (Vc = qn), (l = f0(l)), of(l))) {
      if ("selectionStart" in l)
        var u = { start: l.selectionStart, end: l.selectionEnd };
      else
        l: {
          u = ((u = l.ownerDocument) && u.defaultView) || window;
          var a = u.getSelection && u.getSelection();
          if (a && a.rangeCount !== 0) {
            u = a.anchorNode;
            var e = a.anchorOffset,
              n = a.focusNode;
            a = a.focusOffset;
            try {
              (u.nodeType, n.nodeType);
            } catch {
              u = null;
              break l;
            }
            var f = 0,
              c = -1,
              i = -1,
              h = 0,
              g = 0,
              z = l,
              o = null;
            t: for (;;) {
              for (
                var S;
                z !== u || (e !== 0 && z.nodeType !== 3) || (c = f + e),
                  z !== n || (a !== 0 && z.nodeType !== 3) || (i = f + a),
                  z.nodeType === 3 && (f += z.nodeValue.length),
                  (S = z.firstChild) !== null;
              )
                ((o = z), (z = S));
              for (;;) {
                if (z === l) break t;
                if (
                  (o === u && ++h === e && (c = f),
                  o === n && ++g === a && (i = f),
                  (S = z.nextSibling) !== null)
                )
                  break;
                ((z = o), (o = z.parentNode));
              }
              z = S;
            }
            u = c === -1 || i === -1 ? null : { start: c, end: i };
          } else u = null;
        }
      u = u || { start: 0, end: 0 };
    } else u = null;
    for (
      Lc = { focusedElem: l, selectionRange: u }, qn = !1, pl = t;
      pl !== null;
    )
      if (
        ((t = pl), (l = t.child), (t.subtreeFlags & 1028) !== 0 && l !== null)
      )
        ((l.return = t), (pl = l));
      else
        for (; pl !== null; ) {
          switch (((t = pl), (n = t.alternate), (l = t.flags), t.tag)) {
            case 0:
              if (
                (l & 4) !== 0 &&
                ((l = t.updateQueue),
                (l = l !== null ? l.events : null),
                l !== null)
              )
                for (u = 0; u < l.length; u++)
                  ((e = l[u]), (e.ref.impl = e.nextImpl));
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((l & 1024) !== 0 && n !== null) {
                ((l = void 0),
                  (u = t),
                  (e = n.memoizedProps),
                  (n = n.memoizedState),
                  (a = u.stateNode));
                try {
                  var M = ju(u.type, e);
                  ((l = a.getSnapshotBeforeUpdate(M, n)),
                    (a.__reactInternalSnapshotBeforeUpdate = l));
                } catch (q) {
                  el(u, u.return, q);
                }
              }
              break;
            case 3:
              if ((l & 1024) !== 0) {
                if (
                  ((l = t.stateNode.containerInfo), (u = l.nodeType), u === 9)
                )
                  wc(l);
                else if (u === 1)
                  switch (l.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      wc(l);
                      break;
                    default:
                      l.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((l & 1024) !== 0) throw Error(m(163));
          }
          if (((l = t.sibling), l !== null)) {
            ((l.return = t.return), (pl = l));
            break;
          }
          pl = t.return;
        }
  }
  function $s(l, t, u) {
    var a = u.flags;
    switch (u.tag) {
      case 0:
      case 11:
      case 15:
        (Lt(l, u), a & 4 && ae(5, u));
        break;
      case 1:
        if ((Lt(l, u), a & 4))
          if (((l = u.stateNode), t === null))
            try {
              l.componentDidMount();
            } catch (f) {
              el(u, u.return, f);
            }
          else {
            var e = ju(u.type, t.memoizedProps);
            t = t.memoizedState;
            try {
              l.componentDidUpdate(e, t, l.__reactInternalSnapshotBeforeUpdate);
            } catch (f) {
              el(u, u.return, f);
            }
          }
        (a & 64 && Vs(u), a & 512 && ee(u, u.return));
        break;
      case 3:
        if ((Lt(l, u), a & 64 && ((l = u.updateQueue), l !== null))) {
          if (((t = null), u.child !== null))
            switch (u.child.tag) {
              case 27:
              case 5:
                t = u.child.stateNode;
                break;
              case 1:
                t = u.child.stateNode;
            }
          try {
            C0(l, t);
          } catch (f) {
            el(u, u.return, f);
          }
        }
        break;
      case 27:
        t === null && a & 4 && ws(u);
      case 26:
      case 5:
        (Lt(l, u), t === null && a & 4 && Ks(u), a & 512 && ee(u, u.return));
        break;
      case 12:
        Lt(l, u);
        break;
      case 31:
        (Lt(l, u), a & 4 && Is(l, u));
        break;
      case 13:
        (Lt(l, u),
          a & 4 && Ps(l, u),
          a & 64 &&
            ((l = u.memoizedState),
            l !== null &&
              ((l = l.dehydrated),
              l !== null && ((u = sd.bind(null, u)), Ud(l, u)))));
        break;
      case 22:
        if (((a = u.memoizedState !== null || Zt), !a)) {
          ((t = (t !== null && t.memoizedState !== null) || _l), (e = Zt));
          var n = _l;
          ((Zt = a),
            (_l = t) && !n ? Kt(l, u, (u.subtreeFlags & 8772) !== 0) : Lt(l, u),
            (Zt = e),
            (_l = n));
        }
        break;
      case 30:
        break;
      default:
        Lt(l, u);
    }
  }
  function Fs(l) {
    var t = l.alternate;
    (t !== null && ((l.alternate = null), Fs(t)),
      (l.child = null),
      (l.deletions = null),
      (l.sibling = null),
      l.tag === 5 && ((t = l.stateNode), t !== null && kn(t)),
      (l.stateNode = null),
      (l.return = null),
      (l.dependencies = null),
      (l.memoizedProps = null),
      (l.memoizedState = null),
      (l.pendingProps = null),
      (l.stateNode = null),
      (l.updateQueue = null));
  }
  var hl = null,
    Kl = !1;
  function Vt(l, t, u) {
    for (u = u.child; u !== null; ) (ks(l, t, u), (u = u.sibling));
  }
  function ks(l, t, u) {
    if (Pl && typeof Pl.onCommitFiberUnmount == "function")
      try {
        Pl.onCommitFiberUnmount(Da, u);
      } catch {}
    switch (u.tag) {
      case 26:
        (_l || Dt(u, t),
          Vt(l, t, u),
          u.memoizedState
            ? u.memoizedState.count--
            : u.stateNode && ((u = u.stateNode), u.parentNode.removeChild(u)));
        break;
      case 27:
        _l || Dt(u, t);
        var a = hl,
          e = Kl;
        (ou(u.type) && ((hl = u.stateNode), (Kl = !1)),
          Vt(l, t, u),
          de(u.stateNode),
          (hl = a),
          (Kl = e));
        break;
      case 5:
        _l || Dt(u, t);
      case 6:
        if (
          ((a = hl),
          (e = Kl),
          (hl = null),
          Vt(l, t, u),
          (hl = a),
          (Kl = e),
          hl !== null)
        )
          if (Kl)
            try {
              (hl.nodeType === 9
                ? hl.body
                : hl.nodeName === "HTML"
                  ? hl.ownerDocument.body
                  : hl
              ).removeChild(u.stateNode);
            } catch (n) {
              el(u, t, n);
            }
          else
            try {
              hl.removeChild(u.stateNode);
            } catch (n) {
              el(u, t, n);
            }
        break;
      case 18:
        hl !== null &&
          (Kl
            ? ((l = hl),
              Vy(
                l.nodeType === 9
                  ? l.body
                  : l.nodeName === "HTML"
                    ? l.ownerDocument.body
                    : l,
                u.stateNode,
              ),
              Oa(l))
            : Vy(hl, u.stateNode));
        break;
      case 4:
        ((a = hl),
          (e = Kl),
          (hl = u.stateNode.containerInfo),
          (Kl = !0),
          Vt(l, t, u),
          (hl = a),
          (Kl = e));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        (iu(2, u, t), _l || iu(4, u, t), Vt(l, t, u));
        break;
      case 1:
        (_l ||
          (Dt(u, t),
          (a = u.stateNode),
          typeof a.componentWillUnmount == "function" && Ls(u, t, a)),
          Vt(l, t, u));
        break;
      case 21:
        Vt(l, t, u);
        break;
      case 22:
        ((_l = (a = _l) || u.memoizedState !== null), Vt(l, t, u), (_l = a));
        break;
      default:
        Vt(l, t, u);
    }
  }
  function Is(l, t) {
    if (
      t.memoizedState === null &&
      ((l = t.alternate), l !== null && ((l = l.memoizedState), l !== null))
    ) {
      l = l.dehydrated;
      try {
        Oa(l);
      } catch (u) {
        el(t, t.return, u);
      }
    }
  }
  function Ps(l, t) {
    if (
      t.memoizedState === null &&
      ((l = t.alternate),
      l !== null &&
        ((l = l.memoizedState), l !== null && ((l = l.dehydrated), l !== null)))
    )
      try {
        Oa(l);
      } catch (u) {
        el(t, t.return, u);
      }
  }
  function td(l) {
    switch (l.tag) {
      case 31:
      case 13:
      case 19:
        var t = l.stateNode;
        return (t === null && (t = l.stateNode = new Ws()), t);
      case 22:
        return (
          (l = l.stateNode),
          (t = l._retryCache),
          t === null && (t = l._retryCache = new Ws()),
          t
        );
      default:
        throw Error(m(435, l.tag));
    }
  }
  function hn(l, t) {
    var u = td(l);
    t.forEach(function (a) {
      if (!u.has(a)) {
        u.add(a);
        var e = yd.bind(null, l, a);
        a.then(e, e);
      }
    });
  }
  function Jl(l, t) {
    var u = t.deletions;
    if (u !== null)
      for (var a = 0; a < u.length; a++) {
        var e = u[a],
          n = l,
          f = t,
          c = f;
        l: for (; c !== null; ) {
          switch (c.tag) {
            case 27:
              if (ou(c.type)) {
                ((hl = c.stateNode), (Kl = !1));
                break l;
              }
              break;
            case 5:
              ((hl = c.stateNode), (Kl = !1));
              break l;
            case 3:
            case 4:
              ((hl = c.stateNode.containerInfo), (Kl = !0));
              break l;
          }
          c = c.return;
        }
        if (hl === null) throw Error(m(160));
        (ks(n, f, e),
          (hl = null),
          (Kl = !1),
          (n = e.alternate),
          n !== null && (n.return = null),
          (e.return = null));
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; ) (ly(t, l), (t = t.sibling));
  }
  var Et = null;
  function ly(l, t) {
    var u = l.alternate,
      a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        (Jl(t, l),
          wl(l),
          a & 4 && (iu(3, l, l.return), ae(3, l), iu(5, l, l.return)));
        break;
      case 1:
        (Jl(t, l),
          wl(l),
          a & 512 && (_l || u === null || Dt(u, u.return)),
          a & 64 &&
            Zt &&
            ((l = l.updateQueue),
            l !== null &&
              ((a = l.callbacks),
              a !== null &&
                ((u = l.shared.hiddenCallbacks),
                (l.shared.hiddenCallbacks = u === null ? a : u.concat(a))))));
        break;
      case 26:
        var e = Et;
        if (
          (Jl(t, l),
          wl(l),
          a & 512 && (_l || u === null || Dt(u, u.return)),
          a & 4)
        ) {
          var n = u !== null ? u.memoizedState : null;
          if (((a = l.memoizedState), u === null))
            if (a === null)
              if (l.stateNode === null) {
                l: {
                  ((a = l.type),
                    (u = l.memoizedProps),
                    (e = e.ownerDocument || e));
                  t: switch (a) {
                    case "title":
                      ((n = e.getElementsByTagName("title")[0]),
                        (!n ||
                          n[Ha] ||
                          n[Ul] ||
                          n.namespaceURI === "http://www.w3.org/2000/svg" ||
                          n.hasAttribute("itemprop")) &&
                          ((n = e.createElement(a)),
                          e.head.insertBefore(
                            n,
                            e.querySelector("head > title"),
                          )),
                        Cl(n, a, u),
                        (n[Ul] = l),
                        Ml(n),
                        (a = n));
                      break l;
                    case "link":
                      var f = lv("link", "href", e).get(a + (u.href || ""));
                      if (f) {
                        for (var c = 0; c < f.length; c++)
                          if (
                            ((n = f[c]),
                            n.getAttribute("href") ===
                              (u.href == null || u.href === ""
                                ? null
                                : u.href) &&
                              n.getAttribute("rel") ===
                                (u.rel == null ? null : u.rel) &&
                              n.getAttribute("title") ===
                                (u.title == null ? null : u.title) &&
                              n.getAttribute("crossorigin") ===
                                (u.crossOrigin == null ? null : u.crossOrigin))
                          ) {
                            f.splice(c, 1);
                            break t;
                          }
                      }
                      ((n = e.createElement(a)),
                        Cl(n, a, u),
                        e.head.appendChild(n));
                      break;
                    case "meta":
                      if (
                        (f = lv("meta", "content", e).get(
                          a + (u.content || ""),
                        ))
                      ) {
                        for (c = 0; c < f.length; c++)
                          if (
                            ((n = f[c]),
                            n.getAttribute("content") ===
                              (u.content == null ? null : "" + u.content) &&
                              n.getAttribute("name") ===
                                (u.name == null ? null : u.name) &&
                              n.getAttribute("property") ===
                                (u.property == null ? null : u.property) &&
                              n.getAttribute("http-equiv") ===
                                (u.httpEquiv == null ? null : u.httpEquiv) &&
                              n.getAttribute("charset") ===
                                (u.charSet == null ? null : u.charSet))
                          ) {
                            f.splice(c, 1);
                            break t;
                          }
                      }
                      ((n = e.createElement(a)),
                        Cl(n, a, u),
                        e.head.appendChild(n));
                      break;
                    default:
                      throw Error(m(468, a));
                  }
                  ((n[Ul] = l), Ml(n), (a = n));
                }
                l.stateNode = a;
              } else tv(e, l.type, l.stateNode);
            else l.stateNode = Py(e, a, l.memoizedProps);
          else
            n !== a
              ? (n === null
                  ? u.stateNode !== null &&
                    ((u = u.stateNode), u.parentNode.removeChild(u))
                  : n.count--,
                a === null
                  ? tv(e, l.type, l.stateNode)
                  : Py(e, a, l.memoizedProps))
              : a === null &&
                l.stateNode !== null &&
                bc(l, l.memoizedProps, u.memoizedProps);
        }
        break;
      case 27:
        (Jl(t, l),
          wl(l),
          a & 512 && (_l || u === null || Dt(u, u.return)),
          u !== null && a & 4 && bc(l, l.memoizedProps, u.memoizedProps));
        break;
      case 5:
        if (
          (Jl(t, l),
          wl(l),
          a & 512 && (_l || u === null || Dt(u, u.return)),
          l.flags & 32)
        ) {
          e = l.stateNode;
          try {
            Wu(e, "");
          } catch (M) {
            el(l, l.return, M);
          }
        }
        (a & 4 &&
          l.stateNode != null &&
          ((e = l.memoizedProps), bc(l, e, u !== null ? u.memoizedProps : e)),
          a & 1024 && (Tc = !0));
        break;
      case 6:
        if ((Jl(t, l), wl(l), a & 4)) {
          if (l.stateNode === null) throw Error(m(162));
          ((a = l.memoizedProps), (u = l.stateNode));
          try {
            u.nodeValue = a;
          } catch (M) {
            el(l, l.return, M);
          }
        }
        break;
      case 3:
        if (
          ((Nn = null),
          (e = Et),
          (Et = Dn(t.containerInfo)),
          Jl(t, l),
          (Et = e),
          wl(l),
          a & 4 && u !== null && u.memoizedState.isDehydrated)
        )
          try {
            Oa(t.containerInfo);
          } catch (M) {
            el(l, l.return, M);
          }
        Tc && ((Tc = !1), ty(l));
        break;
      case 4:
        ((a = Et),
          (Et = Dn(l.stateNode.containerInfo)),
          Jl(t, l),
          wl(l),
          (Et = a));
        break;
      case 12:
        (Jl(t, l), wl(l));
        break;
      case 31:
        (Jl(t, l),
          wl(l),
          a & 4 &&
            ((a = l.updateQueue),
            a !== null && ((l.updateQueue = null), hn(l, a))));
        break;
      case 13:
        (Jl(t, l),
          wl(l),
          l.child.flags & 8192 &&
            (l.memoizedState !== null) !=
              (u !== null && u.memoizedState !== null) &&
            (Sn = Il()),
          a & 4 &&
            ((a = l.updateQueue),
            a !== null && ((l.updateQueue = null), hn(l, a))));
        break;
      case 22:
        e = l.memoizedState !== null;
        var i = u !== null && u.memoizedState !== null,
          h = Zt,
          g = _l;
        if (
          ((Zt = h || e),
          (_l = g || i),
          Jl(t, l),
          (_l = g),
          (Zt = h),
          wl(l),
          a & 8192)
        )
          l: for (
            t = l.stateNode,
              t._visibility = e ? t._visibility & -2 : t._visibility | 1,
              e && (u === null || i || Zt || _l || Xu(l)),
              u = null,
              t = l;
            ;
          ) {
            if (t.tag === 5 || t.tag === 26) {
              if (u === null) {
                i = u = t;
                try {
                  if (((n = i.stateNode), e))
                    ((f = n.style),
                      typeof f.setProperty == "function"
                        ? f.setProperty("display", "none", "important")
                        : (f.display = "none"));
                  else {
                    c = i.stateNode;
                    var z = i.memoizedProps.style,
                      o =
                        z != null && z.hasOwnProperty("display")
                          ? z.display
                          : null;
                    c.style.display =
                      o == null || typeof o == "boolean" ? "" : ("" + o).trim();
                  }
                } catch (M) {
                  el(i, i.return, M);
                }
              }
            } else if (t.tag === 6) {
              if (u === null) {
                i = t;
                try {
                  i.stateNode.nodeValue = e ? "" : i.memoizedProps;
                } catch (M) {
                  el(i, i.return, M);
                }
              }
            } else if (t.tag === 18) {
              if (u === null) {
                i = t;
                try {
                  var S = i.stateNode;
                  e ? Ly(S, !0) : Ly(i.stateNode, !1);
                } catch (M) {
                  el(i, i.return, M);
                }
              }
            } else if (
              ((t.tag !== 22 && t.tag !== 23) ||
                t.memoizedState === null ||
                t === l) &&
              t.child !== null
            ) {
              ((t.child.return = t), (t = t.child));
              continue;
            }
            if (t === l) break l;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === l) break l;
              (u === t && (u = null), (t = t.return));
            }
            (u === t && (u = null),
              (t.sibling.return = t.return),
              (t = t.sibling));
          }
        a & 4 &&
          ((a = l.updateQueue),
          a !== null &&
            ((u = a.retryQueue),
            u !== null && ((a.retryQueue = null), hn(l, u))));
        break;
      case 19:
        (Jl(t, l),
          wl(l),
          a & 4 &&
            ((a = l.updateQueue),
            a !== null && ((l.updateQueue = null), hn(l, a))));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        (Jl(t, l), wl(l));
    }
  }
  function wl(l) {
    var t = l.flags;
    if (t & 2) {
      try {
        for (var u, a = l.return; a !== null; ) {
          if (Js(a)) {
            u = a;
            break;
          }
          a = a.return;
        }
        if (u == null) throw Error(m(160));
        switch (u.tag) {
          case 27:
            var e = u.stateNode,
              n = zc(l);
            dn(l, n, e);
            break;
          case 5:
            var f = u.stateNode;
            u.flags & 32 && (Wu(f, ""), (u.flags &= -33));
            var c = zc(l);
            dn(l, c, f);
            break;
          case 3:
          case 4:
            var i = u.stateNode.containerInfo,
              h = zc(l);
            Ec(l, h, i);
            break;
          default:
            throw Error(m(161));
        }
      } catch (g) {
        el(l, l.return, g);
      }
      l.flags &= -3;
    }
    t & 4096 && (l.flags &= -4097);
  }
  function ty(l) {
    if (l.subtreeFlags & 1024)
      for (l = l.child; l !== null; ) {
        var t = l;
        (ty(t),
          t.tag === 5 && t.flags & 1024 && t.stateNode.reset(),
          (l = l.sibling));
      }
  }
  function Lt(l, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; ) ($s(l, t.alternate, t), (t = t.sibling));
  }
  function Xu(l) {
    for (l = l.child; l !== null; ) {
      var t = l;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (iu(4, t, t.return), Xu(t));
          break;
        case 1:
          Dt(t, t.return);
          var u = t.stateNode;
          (typeof u.componentWillUnmount == "function" && Ls(t, t.return, u),
            Xu(t));
          break;
        case 27:
          de(t.stateNode);
        case 26:
        case 5:
          (Dt(t, t.return), Xu(t));
          break;
        case 22:
          t.memoizedState === null && Xu(t);
          break;
        case 30:
          Xu(t);
          break;
        default:
          Xu(t);
      }
      l = l.sibling;
    }
  }
  function Kt(l, t, u) {
    for (u = u && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate,
        e = l,
        n = t,
        f = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          (Kt(e, n, u), ae(4, n));
          break;
        case 1:
          if (
            (Kt(e, n, u),
            (a = n),
            (e = a.stateNode),
            typeof e.componentDidMount == "function")
          )
            try {
              e.componentDidMount();
            } catch (h) {
              el(a, a.return, h);
            }
          if (((a = n), (e = a.updateQueue), e !== null)) {
            var c = a.stateNode;
            try {
              var i = e.shared.hiddenCallbacks;
              if (i !== null)
                for (e.shared.hiddenCallbacks = null, e = 0; e < i.length; e++)
                  R0(i[e], c);
            } catch (h) {
              el(a, a.return, h);
            }
          }
          (u && f & 64 && Vs(n), ee(n, n.return));
          break;
        case 27:
          ws(n);
        case 26:
        case 5:
          (Kt(e, n, u), u && a === null && f & 4 && Ks(n), ee(n, n.return));
          break;
        case 12:
          Kt(e, n, u);
          break;
        case 31:
          (Kt(e, n, u), u && f & 4 && Is(e, n));
          break;
        case 13:
          (Kt(e, n, u), u && f & 4 && Ps(e, n));
          break;
        case 22:
          (n.memoizedState === null && Kt(e, n, u), ee(n, n.return));
          break;
        case 30:
          break;
        default:
          Kt(e, n, u);
      }
      t = t.sibling;
    }
  }
  function Ac(l, t) {
    var u = null;
    (l !== null &&
      l.memoizedState !== null &&
      l.memoizedState.cachePool !== null &&
      (u = l.memoizedState.cachePool.pool),
      (l = null),
      t.memoizedState !== null &&
        t.memoizedState.cachePool !== null &&
        (l = t.memoizedState.cachePool.pool),
      l !== u && (l != null && l.refCount++, u != null && La(u)));
  }
  function _c(l, t) {
    ((l = null),
      t.alternate !== null && (l = t.alternate.memoizedState.cache),
      (t = t.memoizedState.cache),
      t !== l && (t.refCount++, l != null && La(l)));
  }
  function Tt(l, t, u, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) (uy(l, t, u, a), (t = t.sibling));
  }
  function uy(l, t, u, a) {
    var e = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (Tt(l, t, u, a), e & 2048 && ae(9, t));
        break;
      case 1:
        Tt(l, t, u, a);
        break;
      case 3:
        (Tt(l, t, u, a),
          e & 2048 &&
            ((l = null),
            t.alternate !== null && (l = t.alternate.memoizedState.cache),
            (t = t.memoizedState.cache),
            t !== l && (t.refCount++, l != null && La(l))));
        break;
      case 12:
        if (e & 2048) {
          (Tt(l, t, u, a), (l = t.stateNode));
          try {
            var n = t.memoizedProps,
              f = n.id,
              c = n.onPostCommit;
            typeof c == "function" &&
              c(
                f,
                t.alternate === null ? "mount" : "update",
                l.passiveEffectDuration,
                -0,
              );
          } catch (i) {
            el(t, t.return, i);
          }
        } else Tt(l, t, u, a);
        break;
      case 31:
        Tt(l, t, u, a);
        break;
      case 13:
        Tt(l, t, u, a);
        break;
      case 23:
        break;
      case 22:
        ((n = t.stateNode),
          (f = t.alternate),
          t.memoizedState !== null
            ? n._visibility & 2
              ? Tt(l, t, u, a)
              : ne(l, t)
            : n._visibility & 2
              ? Tt(l, t, u, a)
              : ((n._visibility |= 2),
                ha(l, t, u, a, (t.subtreeFlags & 10256) !== 0 || !1)),
          e & 2048 && Ac(f, t));
        break;
      case 24:
        (Tt(l, t, u, a), e & 2048 && _c(t.alternate, t));
        break;
      default:
        Tt(l, t, u, a);
    }
  }
  function ha(l, t, u, a, e) {
    for (
      e = e && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child;
      t !== null;
    ) {
      var n = l,
        f = t,
        c = u,
        i = a,
        h = f.flags;
      switch (f.tag) {
        case 0:
        case 11:
        case 15:
          (ha(n, f, c, i, e), ae(8, f));
          break;
        case 23:
          break;
        case 22:
          var g = f.stateNode;
          (f.memoizedState !== null
            ? g._visibility & 2
              ? ha(n, f, c, i, e)
              : ne(n, f)
            : ((g._visibility |= 2), ha(n, f, c, i, e)),
            e && h & 2048 && Ac(f.alternate, f));
          break;
        case 24:
          (ha(n, f, c, i, e), e && h & 2048 && _c(f.alternate, f));
          break;
        default:
          ha(n, f, c, i, e);
      }
      t = t.sibling;
    }
  }
  function ne(l, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var u = l,
          a = t,
          e = a.flags;
        switch (a.tag) {
          case 22:
            (ne(u, a), e & 2048 && Ac(a.alternate, a));
            break;
          case 24:
            (ne(u, a), e & 2048 && _c(a.alternate, a));
            break;
          default:
            ne(u, a);
        }
        t = t.sibling;
      }
  }
  var fe = 8192;
  function oa(l, t, u) {
    if (l.subtreeFlags & fe)
      for (l = l.child; l !== null; ) (ay(l, t, u), (l = l.sibling));
  }
  function ay(l, t, u) {
    switch (l.tag) {
      case 26:
        (oa(l, t, u),
          l.flags & fe &&
            l.memoizedState !== null &&
            xd(u, Et, l.memoizedState, l.memoizedProps));
        break;
      case 5:
        oa(l, t, u);
        break;
      case 3:
      case 4:
        var a = Et;
        ((Et = Dn(l.stateNode.containerInfo)), oa(l, t, u), (Et = a));
        break;
      case 22:
        l.memoizedState === null &&
          ((a = l.alternate),
          a !== null && a.memoizedState !== null
            ? ((a = fe), (fe = 16777216), oa(l, t, u), (fe = a))
            : oa(l, t, u));
        break;
      default:
        oa(l, t, u);
    }
  }
  function ey(l) {
    var t = l.alternate;
    if (t !== null && ((l = t.child), l !== null)) {
      t.child = null;
      do ((t = l.sibling), (l.sibling = null), (l = t));
      while (l !== null);
    }
  }
  function ce(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var u = 0; u < t.length; u++) {
          var a = t[u];
          ((pl = a), fy(a, l));
        }
      ey(l);
    }
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; ) (ny(l), (l = l.sibling));
  }
  function ny(l) {
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        (ce(l), l.flags & 2048 && iu(9, l, l.return));
        break;
      case 3:
        ce(l);
        break;
      case 12:
        ce(l);
        break;
      case 22:
        var t = l.stateNode;
        l.memoizedState !== null &&
        t._visibility & 2 &&
        (l.return === null || l.return.tag !== 13)
          ? ((t._visibility &= -3), on(l))
          : ce(l);
        break;
      default:
        ce(l);
    }
  }
  function on(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var u = 0; u < t.length; u++) {
          var a = t[u];
          ((pl = a), fy(a, l));
        }
      ey(l);
    }
    for (l = l.child; l !== null; ) {
      switch (((t = l), t.tag)) {
        case 0:
        case 11:
        case 15:
          (iu(8, t, t.return), on(t));
          break;
        case 22:
          ((u = t.stateNode),
            u._visibility & 2 && ((u._visibility &= -3), on(t)));
          break;
        default:
          on(t);
      }
      l = l.sibling;
    }
  }
  function fy(l, t) {
    for (; pl !== null; ) {
      var u = pl;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          iu(8, u, t);
          break;
        case 23:
        case 22:
          if (u.memoizedState !== null && u.memoizedState.cachePool !== null) {
            var a = u.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          La(u.memoizedState.cache);
      }
      if (((a = u.child), a !== null)) ((a.return = u), (pl = a));
      else
        l: for (u = l; pl !== null; ) {
          a = pl;
          var e = a.sibling,
            n = a.return;
          if ((Fs(a), a === u)) {
            pl = null;
            break l;
          }
          if (e !== null) {
            ((e.return = n), (pl = e));
            break l;
          }
          pl = n;
        }
    }
  }
  var ud = {
      getCacheForType: function (l) {
        var t = Hl(El),
          u = t.data.get(l);
        return (u === void 0 && ((u = l()), t.data.set(l, u)), u);
      },
      cacheSignal: function () {
        return Hl(El).controller.signal;
      },
    },
    ad = typeof WeakMap == "function" ? WeakMap : Map,
    ll = 0,
    yl = null,
    L = null,
    J = 0,
    al = 0,
    nt = null,
    su = !1,
    Sa = !1,
    Oc = !1,
    Jt = 0,
    gl = 0,
    yu = 0,
    Qu = 0,
    Mc = 0,
    ft = 0,
    ga = 0,
    ie = null,
    Wl = null,
    pc = !1,
    Sn = 0,
    cy = 0,
    gn = 1 / 0,
    rn = null,
    vu = null,
    Ol = 0,
    mu = null,
    ra = null,
    wt = 0,
    Dc = 0,
    Uc = null,
    iy = null,
    se = 0,
    Nc = null;
  function ct() {
    return (ll & 2) !== 0 && J !== 0 ? J & -J : r.T !== null ? Yc() : _i();
  }
  function sy() {
    if (ft === 0)
      if ((J & 536870912) === 0 || $) {
        var l = Oe;
        ((Oe <<= 1), (Oe & 3932160) === 0 && (Oe = 262144), (ft = l));
      } else ft = 536870912;
    return ((l = at.current), l !== null && (l.flags |= 32), ft);
  }
  function $l(l, t, u) {
    (((l === yl && (al === 2 || al === 9)) || l.cancelPendingCommit !== null) &&
      (ba(l, 0), du(l, J, ft, !1)),
      Na(l, u),
      ((ll & 2) === 0 || l !== yl) &&
        (l === yl &&
          ((ll & 2) === 0 && (Qu |= u), gl === 4 && du(l, J, ft, !1)),
        Ut(l)));
  }
  function yy(l, t, u) {
    if ((ll & 6) !== 0) throw Error(m(327));
    var a = (!u && (t & 127) === 0 && (t & l.expiredLanes) === 0) || Ua(l, t),
      e = a ? fd(l, t) : Rc(l, t, !0),
      n = a;
    do {
      if (e === 0) {
        Sa && !a && du(l, t, 0, !1);
        break;
      } else {
        if (((u = l.current.alternate), n && !ed(u))) {
          ((e = Rc(l, t, !1)), (n = !1));
          continue;
        }
        if (e === 2) {
          if (((n = t), l.errorRecoveryDisabledLanes & n)) var f = 0;
          else
            ((f = l.pendingLanes & -536870913),
              (f = f !== 0 ? f : f & 536870912 ? 536870912 : 0));
          if (f !== 0) {
            t = f;
            l: {
              var c = l;
              e = ie;
              var i = c.current.memoizedState.isDehydrated;
              if ((i && (ba(c, f).flags |= 256), (f = Rc(c, f, !1)), f !== 2)) {
                if (Oc && !i) {
                  ((c.errorRecoveryDisabledLanes |= n), (Qu |= n), (e = 4));
                  break l;
                }
                ((n = Wl),
                  (Wl = e),
                  n !== null &&
                    (Wl === null ? (Wl = n) : Wl.push.apply(Wl, n)));
              }
              e = f;
            }
            if (((n = !1), e !== 2)) continue;
          }
        }
        if (e === 1) {
          (ba(l, 0), du(l, t, 0, !0));
          break;
        }
        l: {
          switch (((a = l), (n = e), n)) {
            case 0:
            case 1:
              throw Error(m(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              du(a, t, ft, !su);
              break l;
            case 2:
              Wl = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(m(329));
          }
          if ((t & 62914560) === t && ((e = Sn + 300 - Il()), 10 < e)) {
            if ((du(a, t, ft, !su), pe(a, 0, !0) !== 0)) break l;
            ((wt = t),
              (a.timeoutHandle = xy(
                vy.bind(
                  null,
                  a,
                  u,
                  Wl,
                  rn,
                  pc,
                  t,
                  ft,
                  Qu,
                  ga,
                  su,
                  n,
                  "Throttled",
                  -0,
                  0,
                ),
                e,
              )));
            break l;
          }
          vy(a, u, Wl, rn, pc, t, ft, Qu, ga, su, n, null, -0, 0);
        }
      }
      break;
    } while (!0);
    Ut(l);
  }
  function vy(l, t, u, a, e, n, f, c, i, h, g, z, o, S) {
    if (
      ((l.timeoutHandle = -1),
      (z = t.subtreeFlags),
      z & 8192 || (z & 16785408) === 16785408)
    ) {
      ((z = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Rt,
      }),
        ay(t, n, z));
      var M =
        (n & 62914560) === n ? Sn - Il() : (n & 4194048) === n ? cy - Il() : 0;
      if (((M = Zd(z, M)), M !== null)) {
        ((wt = n),
          (l.cancelPendingCommit = M(
            by.bind(null, l, t, n, u, a, e, f, c, i, g, z, null, o, S),
          )),
          du(l, n, f, !h));
        return;
      }
    }
    by(l, t, n, u, a, e, f, c, i);
  }
  function ed(l) {
    for (var t = l; ; ) {
      var u = t.tag;
      if (
        (u === 0 || u === 11 || u === 15) &&
        t.flags & 16384 &&
        ((u = t.updateQueue), u !== null && ((u = u.stores), u !== null))
      )
        for (var a = 0; a < u.length; a++) {
          var e = u[a],
            n = e.getSnapshot;
          e = e.value;
          try {
            if (!tt(n(), e)) return !1;
          } catch {
            return !1;
          }
        }
      if (((u = t.child), t.subtreeFlags & 16384 && u !== null))
        ((u.return = t), (t = u));
      else {
        if (t === l) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === l) return !0;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
    }
    return !0;
  }
  function du(l, t, u, a) {
    ((t &= ~Mc),
      (t &= ~Qu),
      (l.suspendedLanes |= t),
      (l.pingedLanes &= ~t),
      a && (l.warmLanes |= t),
      (a = l.expirationTimes));
    for (var e = t; 0 < e; ) {
      var n = 31 - lt(e),
        f = 1 << n;
      ((a[n] = -1), (e &= ~f));
    }
    u !== 0 && Ei(l, u, t);
  }
  function bn() {
    return (ll & 6) === 0 ? (ye(0), !1) : !0;
  }
  function Hc() {
    if (L !== null) {
      if (al === 0) var l = L.return;
      else ((l = L), (Yt = Hu = null), wf(l), (sa = null), (Ja = 0), (l = L));
      for (; l !== null; ) (Zs(l.alternate, l), (l = l.return));
      L = null;
    }
  }
  function ba(l, t) {
    var u = l.timeoutHandle;
    (u !== -1 && ((l.timeoutHandle = -1), _d(u)),
      (u = l.cancelPendingCommit),
      u !== null && ((l.cancelPendingCommit = null), u()),
      (wt = 0),
      Hc(),
      (yl = l),
      (L = u = qt(l.current, null)),
      (J = t),
      (al = 0),
      (nt = null),
      (su = !1),
      (Sa = Ua(l, t)),
      (Oc = !1),
      (ga = ft = Mc = Qu = yu = gl = 0),
      (Wl = ie = null),
      (pc = !1),
      (t & 8) !== 0 && (t |= t & 32));
    var a = l.entangledLanes;
    if (a !== 0)
      for (l = l.entanglements, a &= t; 0 < a; ) {
        var e = 31 - lt(a),
          n = 1 << e;
        ((t |= l[e]), (a &= ~n));
      }
    return ((Jt = t), Xe(), u);
  }
  function my(l, t) {
    ((Q = null),
      (r.H = le),
      t === ia || t === we
        ? ((t = D0()), (al = 3))
        : t === Bf
          ? ((t = D0()), (al = 4))
          : (al =
              t === sc
                ? 8
                : t !== null &&
                    typeof t == "object" &&
                    typeof t.then == "function"
                  ? 6
                  : 1),
      (nt = t),
      L === null && ((gl = 1), cn(l, mt(t, l.current))));
  }
  function dy() {
    var l = at.current;
    return l === null
      ? !0
      : (J & 4194048) === J
        ? St === null
        : (J & 62914560) === J || (J & 536870912) !== 0
          ? l === St
          : !1;
  }
  function hy() {
    var l = r.H;
    return ((r.H = le), l === null ? le : l);
  }
  function oy() {
    var l = r.A;
    return ((r.A = ud), l);
  }
  function zn() {
    ((gl = 4),
      su || ((J & 4194048) !== J && at.current !== null) || (Sa = !0),
      ((yu & 134217727) === 0 && (Qu & 134217727) === 0) ||
        yl === null ||
        du(yl, J, ft, !1));
  }
  function Rc(l, t, u) {
    var a = ll;
    ll |= 2;
    var e = hy(),
      n = oy();
    ((yl !== l || J !== t) && ((rn = null), ba(l, t)), (t = !1));
    var f = gl;
    l: do
      try {
        if (al !== 0 && L !== null) {
          var c = L,
            i = nt;
          switch (al) {
            case 8:
              (Hc(), (f = 6));
              break l;
            case 3:
            case 2:
            case 9:
            case 6:
              at.current === null && (t = !0);
              var h = al;
              if (((al = 0), (nt = null), za(l, c, i, h), u && Sa)) {
                f = 0;
                break l;
              }
              break;
            default:
              ((h = al), (al = 0), (nt = null), za(l, c, i, h));
          }
        }
        (nd(), (f = gl));
        break;
      } catch (g) {
        my(l, g);
      }
    while (!0);
    return (
      t && l.shellSuspendCounter++,
      (Yt = Hu = null),
      (ll = a),
      (r.H = e),
      (r.A = n),
      L === null && ((yl = null), (J = 0), Xe()),
      f
    );
  }
  function nd() {
    for (; L !== null; ) Sy(L);
  }
  function fd(l, t) {
    var u = ll;
    ll |= 2;
    var a = hy(),
      e = oy();
    yl !== l || J !== t
      ? ((rn = null), (gn = Il() + 500), ba(l, t))
      : (Sa = Ua(l, t));
    l: do
      try {
        if (al !== 0 && L !== null) {
          t = L;
          var n = nt;
          t: switch (al) {
            case 1:
              ((al = 0), (nt = null), za(l, t, n, 1));
              break;
            case 2:
            case 9:
              if (M0(n)) {
                ((al = 0), (nt = null), gy(t));
                break;
              }
              ((t = function () {
                ((al !== 2 && al !== 9) || yl !== l || (al = 7), Ut(l));
              }),
                n.then(t, t));
              break l;
            case 3:
              al = 7;
              break l;
            case 4:
              al = 5;
              break l;
            case 7:
              M0(n)
                ? ((al = 0), (nt = null), gy(t))
                : ((al = 0), (nt = null), za(l, t, n, 7));
              break;
            case 5:
              var f = null;
              switch (L.tag) {
                case 26:
                  f = L.memoizedState;
                case 5:
                case 27:
                  var c = L;
                  if (f ? uv(f) : c.stateNode.complete) {
                    ((al = 0), (nt = null));
                    var i = c.sibling;
                    if (i !== null) L = i;
                    else {
                      var h = c.return;
                      h !== null ? ((L = h), En(h)) : (L = null);
                    }
                    break t;
                  }
              }
              ((al = 0), (nt = null), za(l, t, n, 5));
              break;
            case 6:
              ((al = 0), (nt = null), za(l, t, n, 6));
              break;
            case 8:
              (Hc(), (gl = 6));
              break l;
            default:
              throw Error(m(462));
          }
        }
        cd();
        break;
      } catch (g) {
        my(l, g);
      }
    while (!0);
    return (
      (Yt = Hu = null),
      (r.H = a),
      (r.A = e),
      (ll = u),
      L !== null ? 0 : ((yl = null), (J = 0), Xe(), gl)
    );
  }
  function cd() {
    for (; L !== null && !Nv(); ) Sy(L);
  }
  function Sy(l) {
    var t = Qs(l.alternate, l, Jt);
    ((l.memoizedProps = l.pendingProps), t === null ? En(l) : (L = t));
  }
  function gy(l) {
    var t = l,
      u = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = qs(u, t, t.pendingProps, t.type, void 0, J);
        break;
      case 11:
        t = qs(u, t, t.pendingProps, t.type.render, t.ref, J);
        break;
      case 5:
        wf(t);
      default:
        (Zs(u, t), (t = L = o0(t, Jt)), (t = Qs(u, t, Jt)));
    }
    ((l.memoizedProps = l.pendingProps), t === null ? En(l) : (L = t));
  }
  function za(l, t, u, a) {
    ((Yt = Hu = null), wf(t), (sa = null), (Ja = 0));
    var e = t.return;
    try {
      if ($m(l, e, t, u, J)) {
        ((gl = 1), cn(l, mt(u, l.current)), (L = null));
        return;
      }
    } catch (n) {
      if (e !== null) throw ((L = e), n);
      ((gl = 1), cn(l, mt(u, l.current)), (L = null));
      return;
    }
    t.flags & 32768
      ? ($ || a === 1
          ? (l = !0)
          : Sa || (J & 536870912) !== 0
            ? (l = !1)
            : ((su = l = !0),
              (a === 2 || a === 9 || a === 3 || a === 6) &&
                ((a = at.current),
                a !== null && a.tag === 13 && (a.flags |= 16384))),
        ry(t, l))
      : En(t);
  }
  function En(l) {
    var t = l;
    do {
      if ((t.flags & 32768) !== 0) {
        ry(t, su);
        return;
      }
      l = t.return;
      var u = Im(t.alternate, t, Jt);
      if (u !== null) {
        L = u;
        return;
      }
      if (((t = t.sibling), t !== null)) {
        L = t;
        return;
      }
      L = t = l;
    } while (t !== null);
    gl === 0 && (gl = 5);
  }
  function ry(l, t) {
    do {
      var u = Pm(l.alternate, l);
      if (u !== null) {
        ((u.flags &= 32767), (L = u));
        return;
      }
      if (
        ((u = l.return),
        u !== null &&
          ((u.flags |= 32768), (u.subtreeFlags = 0), (u.deletions = null)),
        !t && ((l = l.sibling), l !== null))
      ) {
        L = l;
        return;
      }
      L = l = u;
    } while (l !== null);
    ((gl = 6), (L = null));
  }
  function by(l, t, u, a, e, n, f, c, i) {
    l.cancelPendingCommit = null;
    do Tn();
    while (Ol !== 0);
    if ((ll & 6) !== 0) throw Error(m(327));
    if (t !== null) {
      if (t === l.current) throw Error(m(177));
      if (
        ((n = t.lanes | t.childLanes),
        (n |= zf),
        Qv(l, u, n, f, c, i),
        l === yl && ((L = yl = null), (J = 0)),
        (ra = t),
        (mu = l),
        (wt = u),
        (Dc = n),
        (Uc = e),
        (iy = a),
        (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
          ? ((l.callbackNode = null),
            (l.callbackPriority = 0),
            vd(Ae, function () {
              return (_y(), null);
            }))
          : ((l.callbackNode = null), (l.callbackPriority = 0)),
        (a = (t.flags & 13878) !== 0),
        (t.subtreeFlags & 13878) !== 0 || a)
      ) {
        ((a = r.T), (r.T = null), (e = _.p), (_.p = 2), (f = ll), (ll |= 4));
        try {
          ld(l, t, u);
        } finally {
          ((ll = f), (_.p = e), (r.T = a));
        }
      }
      ((Ol = 1), zy(), Ey(), Ty());
    }
  }
  function zy() {
    if (Ol === 1) {
      Ol = 0;
      var l = mu,
        t = ra,
        u = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || u) {
        ((u = r.T), (r.T = null));
        var a = _.p;
        _.p = 2;
        var e = ll;
        ll |= 4;
        try {
          ly(t, l);
          var n = Lc,
            f = f0(l.containerInfo),
            c = n.focusedElem,
            i = n.selectionRange;
          if (
            f !== c &&
            c &&
            c.ownerDocument &&
            n0(c.ownerDocument.documentElement, c)
          ) {
            if (i !== null && of(c)) {
              var h = i.start,
                g = i.end;
              if ((g === void 0 && (g = h), "selectionStart" in c))
                ((c.selectionStart = h),
                  (c.selectionEnd = Math.min(g, c.value.length)));
              else {
                var z = c.ownerDocument || document,
                  o = (z && z.defaultView) || window;
                if (o.getSelection) {
                  var S = o.getSelection(),
                    M = c.textContent.length,
                    q = Math.min(i.start, M),
                    il = i.end === void 0 ? q : Math.min(i.end, M);
                  !S.extend && q > il && ((f = il), (il = q), (q = f));
                  var v = e0(c, q),
                    s = e0(c, il);
                  if (
                    v &&
                    s &&
                    (S.rangeCount !== 1 ||
                      S.anchorNode !== v.node ||
                      S.anchorOffset !== v.offset ||
                      S.focusNode !== s.node ||
                      S.focusOffset !== s.offset)
                  ) {
                    var d = z.createRange();
                    (d.setStart(v.node, v.offset),
                      S.removeAllRanges(),
                      q > il
                        ? (S.addRange(d), S.extend(s.node, s.offset))
                        : (d.setEnd(s.node, s.offset), S.addRange(d)));
                  }
                }
              }
            }
            for (z = [], S = c; (S = S.parentNode); )
              S.nodeType === 1 &&
                z.push({ element: S, left: S.scrollLeft, top: S.scrollTop });
            for (
              typeof c.focus == "function" && c.focus(), c = 0;
              c < z.length;
              c++
            ) {
              var b = z[c];
              ((b.element.scrollLeft = b.left), (b.element.scrollTop = b.top));
            }
          }
          ((qn = !!Vc), (Lc = Vc = null));
        } finally {
          ((ll = e), (_.p = a), (r.T = u));
        }
      }
      ((l.current = t), (Ol = 2));
    }
  }
  function Ey() {
    if (Ol === 2) {
      Ol = 0;
      var l = mu,
        t = ra,
        u = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || u) {
        ((u = r.T), (r.T = null));
        var a = _.p;
        _.p = 2;
        var e = ll;
        ll |= 4;
        try {
          $s(l, t.alternate, t);
        } finally {
          ((ll = e), (_.p = a), (r.T = u));
        }
      }
      Ol = 3;
    }
  }
  function Ty() {
    if (Ol === 4 || Ol === 3) {
      ((Ol = 0), Hv());
      var l = mu,
        t = ra,
        u = wt,
        a = iy;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
        ? (Ol = 5)
        : ((Ol = 0), (ra = mu = null), Ay(l, l.pendingLanes));
      var e = l.pendingLanes;
      if (
        (e === 0 && (vu = null),
        $n(u),
        (t = t.stateNode),
        Pl && typeof Pl.onCommitFiberRoot == "function")
      )
        try {
          Pl.onCommitFiberRoot(Da, t, void 0, (t.current.flags & 128) === 128);
        } catch {}
      if (a !== null) {
        ((t = r.T), (e = _.p), (_.p = 2), (r.T = null));
        try {
          for (var n = l.onRecoverableError, f = 0; f < a.length; f++) {
            var c = a[f];
            n(c.value, { componentStack: c.stack });
          }
        } finally {
          ((r.T = t), (_.p = e));
        }
      }
      ((wt & 3) !== 0 && Tn(),
        Ut(l),
        (e = l.pendingLanes),
        (u & 261930) !== 0 && (e & 42) !== 0
          ? l === Nc
            ? se++
            : ((se = 0), (Nc = l))
          : (se = 0),
        ye(0));
    }
  }
  function Ay(l, t) {
    (l.pooledCacheLanes &= t) === 0 &&
      ((t = l.pooledCache), t != null && ((l.pooledCache = null), La(t)));
  }
  function Tn() {
    return (zy(), Ey(), Ty(), _y());
  }
  function _y() {
    if (Ol !== 5) return !1;
    var l = mu,
      t = Dc;
    Dc = 0;
    var u = $n(wt),
      a = r.T,
      e = _.p;
    try {
      ((_.p = 32 > u ? 32 : u), (r.T = null), (u = Uc), (Uc = null));
      var n = mu,
        f = wt;
      if (((Ol = 0), (ra = mu = null), (wt = 0), (ll & 6) !== 0))
        throw Error(m(331));
      var c = ll;
      if (
        ((ll |= 4),
        ny(n.current),
        uy(n, n.current, f, u),
        (ll = c),
        ye(0, !1),
        Pl && typeof Pl.onPostCommitFiberRoot == "function")
      )
        try {
          Pl.onPostCommitFiberRoot(Da, n);
        } catch {}
      return !0;
    } finally {
      ((_.p = e), (r.T = a), Ay(l, t));
    }
  }
  function Oy(l, t, u) {
    ((t = mt(u, t)),
      (t = ic(l.stateNode, t, 2)),
      (l = nu(l, t, 2)),
      l !== null && (Na(l, 2), Ut(l)));
  }
  function el(l, t, u) {
    if (l.tag === 3) Oy(l, l, u);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Oy(t, l, u);
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (
            typeof t.type.getDerivedStateFromError == "function" ||
            (typeof a.componentDidCatch == "function" &&
              (vu === null || !vu.has(a)))
          ) {
            ((l = mt(u, l)),
              (u = Ms(2)),
              (a = nu(t, u, 2)),
              a !== null && (ps(u, a, t, l), Na(a, 2), Ut(a)));
            break;
          }
        }
        t = t.return;
      }
  }
  function Cc(l, t, u) {
    var a = l.pingCache;
    if (a === null) {
      a = l.pingCache = new ad();
      var e = new Set();
      a.set(t, e);
    } else ((e = a.get(t)), e === void 0 && ((e = new Set()), a.set(t, e)));
    e.has(u) ||
      ((Oc = !0), e.add(u), (l = id.bind(null, l, t, u)), t.then(l, l));
  }
  function id(l, t, u) {
    var a = l.pingCache;
    (a !== null && a.delete(t),
      (l.pingedLanes |= l.suspendedLanes & u),
      (l.warmLanes &= ~u),
      yl === l &&
        (J & u) === u &&
        (gl === 4 || (gl === 3 && (J & 62914560) === J && 300 > Il() - Sn)
          ? (ll & 2) === 0 && ba(l, 0)
          : (Mc |= u),
        ga === J && (ga = 0)),
      Ut(l));
  }
  function My(l, t) {
    (t === 0 && (t = zi()), (l = Du(l, t)), l !== null && (Na(l, t), Ut(l)));
  }
  function sd(l) {
    var t = l.memoizedState,
      u = 0;
    (t !== null && (u = t.retryLane), My(l, u));
  }
  function yd(l, t) {
    var u = 0;
    switch (l.tag) {
      case 31:
      case 13:
        var a = l.stateNode,
          e = l.memoizedState;
        e !== null && (u = e.retryLane);
        break;
      case 19:
        a = l.stateNode;
        break;
      case 22:
        a = l.stateNode._retryCache;
        break;
      default:
        throw Error(m(314));
    }
    (a !== null && a.delete(t), My(l, u));
  }
  function vd(l, t) {
    return Kn(l, t);
  }
  var An = null,
    Ea = null,
    qc = !1,
    _n = !1,
    Bc = !1,
    hu = 0;
  function Ut(l) {
    (l !== Ea &&
      l.next === null &&
      (Ea === null ? (An = Ea = l) : (Ea = Ea.next = l)),
      (_n = !0),
      qc || ((qc = !0), dd()));
  }
  function ye(l, t) {
    if (!Bc && _n) {
      Bc = !0;
      do
        for (var u = !1, a = An; a !== null; ) {
          if (l !== 0) {
            var e = a.pendingLanes;
            if (e === 0) var n = 0;
            else {
              var f = a.suspendedLanes,
                c = a.pingedLanes;
              ((n = (1 << (31 - lt(42 | l) + 1)) - 1),
                (n &= e & ~(f & ~c)),
                (n = n & 201326741 ? (n & 201326741) | 1 : n ? n | 2 : 0));
            }
            n !== 0 && ((u = !0), Ny(a, n));
          } else
            ((n = J),
              (n = pe(
                a,
                a === yl ? n : 0,
                a.cancelPendingCommit !== null || a.timeoutHandle !== -1,
              )),
              (n & 3) === 0 || Ua(a, n) || ((u = !0), Ny(a, n)));
          a = a.next;
        }
      while (u);
      Bc = !1;
    }
  }
  function md() {
    py();
  }
  function py() {
    _n = qc = !1;
    var l = 0;
    hu !== 0 && Ad() && (l = hu);
    for (var t = Il(), u = null, a = An; a !== null; ) {
      var e = a.next,
        n = Dy(a, t);
      (n === 0
        ? ((a.next = null),
          u === null ? (An = e) : (u.next = e),
          e === null && (Ea = u))
        : ((u = a), (l !== 0 || (n & 3) !== 0) && (_n = !0)),
        (a = e));
    }
    ((Ol !== 0 && Ol !== 5) || ye(l), hu !== 0 && (hu = 0));
  }
  function Dy(l, t) {
    for (
      var u = l.suspendedLanes,
        a = l.pingedLanes,
        e = l.expirationTimes,
        n = l.pendingLanes & -62914561;
      0 < n;
    ) {
      var f = 31 - lt(n),
        c = 1 << f,
        i = e[f];
      (i === -1
        ? ((c & u) === 0 || (c & a) !== 0) && (e[f] = Xv(c, t))
        : i <= t && (l.expiredLanes |= c),
        (n &= ~c));
    }
    if (
      ((t = yl),
      (u = J),
      (u = pe(
        l,
        l === t ? u : 0,
        l.cancelPendingCommit !== null || l.timeoutHandle !== -1,
      )),
      (a = l.callbackNode),
      u === 0 ||
        (l === t && (al === 2 || al === 9)) ||
        l.cancelPendingCommit !== null)
    )
      return (
        a !== null && a !== null && Jn(a),
        (l.callbackNode = null),
        (l.callbackPriority = 0)
      );
    if ((u & 3) === 0 || Ua(l, u)) {
      if (((t = u & -u), t === l.callbackPriority)) return t;
      switch ((a !== null && Jn(a), $n(u))) {
        case 2:
        case 8:
          u = ri;
          break;
        case 32:
          u = Ae;
          break;
        case 268435456:
          u = bi;
          break;
        default:
          u = Ae;
      }
      return (
        (a = Uy.bind(null, l)),
        (u = Kn(u, a)),
        (l.callbackPriority = t),
        (l.callbackNode = u),
        t
      );
    }
    return (
      a !== null && a !== null && Jn(a),
      (l.callbackPriority = 2),
      (l.callbackNode = null),
      2
    );
  }
  function Uy(l, t) {
    if (Ol !== 0 && Ol !== 5)
      return ((l.callbackNode = null), (l.callbackPriority = 0), null);
    var u = l.callbackNode;
    if (Tn() && l.callbackNode !== u) return null;
    var a = J;
    return (
      (a = pe(
        l,
        l === yl ? a : 0,
        l.cancelPendingCommit !== null || l.timeoutHandle !== -1,
      )),
      a === 0
        ? null
        : (yy(l, a, t),
          Dy(l, Il()),
          l.callbackNode != null && l.callbackNode === u
            ? Uy.bind(null, l)
            : null)
    );
  }
  function Ny(l, t) {
    if (Tn()) return null;
    yy(l, t, !0);
  }
  function dd() {
    Od(function () {
      (ll & 6) !== 0 ? Kn(gi, md) : py();
    });
  }
  function Yc() {
    if (hu === 0) {
      var l = fa;
      (l === 0 && ((l = _e), (_e <<= 1), (_e & 261888) === 0 && (_e = 256)),
        (hu = l));
    }
    return hu;
  }
  function Hy(l) {
    return l == null || typeof l == "symbol" || typeof l == "boolean"
      ? null
      : typeof l == "function"
        ? l
        : He("" + l);
  }
  function Ry(l, t) {
    var u = t.ownerDocument.createElement("input");
    return (
      (u.name = t.name),
      (u.value = t.value),
      l.id && u.setAttribute("form", l.id),
      t.parentNode.insertBefore(u, t),
      (l = new FormData(l)),
      u.parentNode.removeChild(u),
      l
    );
  }
  function hd(l, t, u, a, e) {
    if (t === "submit" && u && u.stateNode === e) {
      var n = Hy((e[Vl] || null).action),
        f = a.submitter;
      f &&
        ((t = (t = f[Vl] || null)
          ? Hy(t.formAction)
          : f.getAttribute("formAction")),
        t !== null && ((n = t), (f = null)));
      var c = new Be("action", "action", null, a, e);
      l.push({
        event: c,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (a.defaultPrevented) {
                if (hu !== 0) {
                  var i = f ? Ry(e, f) : new FormData(e);
                  uc(
                    u,
                    { pending: !0, data: i, method: e.method, action: n },
                    null,
                    i,
                  );
                }
              } else
                typeof n == "function" &&
                  (c.preventDefault(),
                  (i = f ? Ry(e, f) : new FormData(e)),
                  uc(
                    u,
                    { pending: !0, data: i, method: e.method, action: n },
                    n,
                    i,
                  ));
            },
            currentTarget: e,
          },
        ],
      });
    }
  }
  for (var Gc = 0; Gc < bf.length; Gc++) {
    var jc = bf[Gc],
      od = jc.toLowerCase(),
      Sd = jc[0].toUpperCase() + jc.slice(1);
    zt(od, "on" + Sd);
  }
  (zt(s0, "onAnimationEnd"),
    zt(y0, "onAnimationIteration"),
    zt(v0, "onAnimationStart"),
    zt("dblclick", "onDoubleClick"),
    zt("focusin", "onFocus"),
    zt("focusout", "onBlur"),
    zt(Rm, "onTransitionRun"),
    zt(Cm, "onTransitionStart"),
    zt(qm, "onTransitionCancel"),
    zt(m0, "onTransitionEnd"),
    Ju("onMouseEnter", ["mouseout", "mouseover"]),
    Ju("onMouseLeave", ["mouseout", "mouseover"]),
    Ju("onPointerEnter", ["pointerout", "pointerover"]),
    Ju("onPointerLeave", ["pointerout", "pointerover"]),
    _u(
      "onChange",
      "change click focusin focusout input keydown keyup selectionchange".split(
        " ",
      ),
    ),
    _u(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " ",
      ),
    ),
    _u("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    _u(
      "onCompositionEnd",
      "compositionend focusout keydown keypress keyup mousedown".split(" "),
    ),
    _u(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" "),
    ),
    _u(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
    ));
  var ve =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " ",
      ),
    gd = new Set(
      "beforetoggle cancel close invalid load scroll scrollend toggle"
        .split(" ")
        .concat(ve),
    );
  function Cy(l, t) {
    t = (t & 4) !== 0;
    for (var u = 0; u < l.length; u++) {
      var a = l[u],
        e = a.event;
      a = a.listeners;
      l: {
        var n = void 0;
        if (t)
          for (var f = a.length - 1; 0 <= f; f--) {
            var c = a[f],
              i = c.instance,
              h = c.currentTarget;
            if (((c = c.listener), i !== n && e.isPropagationStopped()))
              break l;
            ((n = c), (e.currentTarget = h));
            try {
              n(e);
            } catch (g) {
              je(g);
            }
            ((e.currentTarget = null), (n = i));
          }
        else
          for (f = 0; f < a.length; f++) {
            if (
              ((c = a[f]),
              (i = c.instance),
              (h = c.currentTarget),
              (c = c.listener),
              i !== n && e.isPropagationStopped())
            )
              break l;
            ((n = c), (e.currentTarget = h));
            try {
              n(e);
            } catch (g) {
              je(g);
            }
            ((e.currentTarget = null), (n = i));
          }
      }
    }
  }
  function K(l, t) {
    var u = t[Fn];
    u === void 0 && (u = t[Fn] = new Set());
    var a = l + "__bubble";
    u.has(a) || (qy(t, l, 2, !1), u.add(a));
  }
  function Xc(l, t, u) {
    var a = 0;
    (t && (a |= 4), qy(u, l, a, t));
  }
  var On = "_reactListening" + Math.random().toString(36).slice(2);
  function Qc(l) {
    if (!l[On]) {
      ((l[On] = !0),
        pi.forEach(function (u) {
          u !== "selectionchange" && (gd.has(u) || Xc(u, !1, l), Xc(u, !0, l));
        }));
      var t = l.nodeType === 9 ? l : l.ownerDocument;
      t === null || t[On] || ((t[On] = !0), Xc("selectionchange", !1, t));
    }
  }
  function qy(l, t, u, a) {
    switch (sv(t)) {
      case 2:
        var e = Kd;
        break;
      case 8:
        e = Jd;
        break;
      default:
        e = ti;
    }
    ((u = e.bind(null, t, u, l)),
      (e = void 0),
      !nf ||
        (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
        (e = !0),
      a
        ? e !== void 0
          ? l.addEventListener(t, u, { capture: !0, passive: e })
          : l.addEventListener(t, u, !0)
        : e !== void 0
          ? l.addEventListener(t, u, { passive: e })
          : l.addEventListener(t, u, !1));
  }
  function xc(l, t, u, a, e) {
    var n = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      l: for (;;) {
        if (a === null) return;
        var f = a.tag;
        if (f === 3 || f === 4) {
          var c = a.stateNode.containerInfo;
          if (c === e) break;
          if (f === 4)
            for (f = a.return; f !== null; ) {
              var i = f.tag;
              if ((i === 3 || i === 4) && f.stateNode.containerInfo === e)
                return;
              f = f.return;
            }
          for (; c !== null; ) {
            if (((f = Vu(c)), f === null)) return;
            if (((i = f.tag), i === 5 || i === 6 || i === 26 || i === 27)) {
              a = n = f;
              continue l;
            }
            c = c.parentNode;
          }
        }
        a = a.return;
      }
    Xi(function () {
      var h = n,
        g = af(u),
        z = [];
      l: {
        var o = d0.get(l);
        if (o !== void 0) {
          var S = Be,
            M = l;
          switch (l) {
            case "keypress":
              if (Ce(u) === 0) break l;
            case "keydown":
            case "keyup":
              S = ym;
              break;
            case "focusin":
              ((M = "focus"), (S = yf));
              break;
            case "focusout":
              ((M = "blur"), (S = yf));
              break;
            case "beforeblur":
            case "afterblur":
              S = yf;
              break;
            case "click":
              if (u.button === 2) break l;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              S = Zi;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              S = Iv;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              S = dm;
              break;
            case s0:
            case y0:
            case v0:
              S = tm;
              break;
            case m0:
              S = om;
              break;
            case "scroll":
            case "scrollend":
              S = Fv;
              break;
            case "wheel":
              S = gm;
              break;
            case "copy":
            case "cut":
            case "paste":
              S = am;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              S = Li;
              break;
            case "toggle":
            case "beforetoggle":
              S = bm;
          }
          var q = (t & 4) !== 0,
            il = !q && (l === "scroll" || l === "scrollend"),
            v = q ? (o !== null ? o + "Capture" : null) : o;
          q = [];
          for (var s = h, d; s !== null; ) {
            var b = s;
            if (
              ((d = b.stateNode),
              (b = b.tag),
              (b !== 5 && b !== 26 && b !== 27) ||
                d === null ||
                v === null ||
                ((b = Ca(s, v)), b != null && q.push(me(s, b, d))),
              il)
            )
              break;
            s = s.return;
          }
          0 < q.length &&
            ((o = new S(o, M, null, u, g)), z.push({ event: o, listeners: q }));
        }
      }
      if ((t & 7) === 0) {
        l: {
          if (
            ((o = l === "mouseover" || l === "pointerover"),
            (S = l === "mouseout" || l === "pointerout"),
            o &&
              u !== uf &&
              (M = u.relatedTarget || u.fromElement) &&
              (Vu(M) || M[Zu]))
          )
            break l;
          if (
            (S || o) &&
            ((o =
              g.window === g
                ? g
                : (o = g.ownerDocument)
                  ? o.defaultView || o.parentWindow
                  : window),
            S
              ? ((M = u.relatedTarget || u.toElement),
                (S = h),
                (M = M ? Vu(M) : null),
                M !== null &&
                  ((il = C(M)),
                  (q = M.tag),
                  M !== il || (q !== 5 && q !== 27 && q !== 6)) &&
                  (M = null))
              : ((S = null), (M = h)),
            S !== M)
          ) {
            if (
              ((q = Zi),
              (b = "onMouseLeave"),
              (v = "onMouseEnter"),
              (s = "mouse"),
              (l === "pointerout" || l === "pointerover") &&
                ((q = Li),
                (b = "onPointerLeave"),
                (v = "onPointerEnter"),
                (s = "pointer")),
              (il = S == null ? o : Ra(S)),
              (d = M == null ? o : Ra(M)),
              (o = new q(b, s + "leave", S, u, g)),
              (o.target = il),
              (o.relatedTarget = d),
              (b = null),
              Vu(g) === h &&
                ((q = new q(v, s + "enter", M, u, g)),
                (q.target = d),
                (q.relatedTarget = il),
                (b = q)),
              (il = b),
              S && M)
            )
              t: {
                for (q = rd, v = S, s = M, d = 0, b = v; b; b = q(b)) d++;
                b = 0;
                for (var H = s; H; H = q(H)) b++;
                for (; 0 < d - b; ) ((v = q(v)), d--);
                for (; 0 < b - d; ) ((s = q(s)), b--);
                for (; d--; ) {
                  if (v === s || (s !== null && v === s.alternate)) {
                    q = v;
                    break t;
                  }
                  ((v = q(v)), (s = q(s)));
                }
                q = null;
              }
            else q = null;
            (S !== null && By(z, o, S, q, !1),
              M !== null && il !== null && By(z, il, M, q, !0));
          }
        }
        l: {
          if (
            ((o = h ? Ra(h) : window),
            (S = o.nodeName && o.nodeName.toLowerCase()),
            S === "select" || (S === "input" && o.type === "file"))
          )
            var I = Ii;
          else if (Fi(o))
            if (Pi) I = Um;
            else {
              I = pm;
              var U = Mm;
            }
          else
            ((S = o.nodeName),
              !S ||
              S.toLowerCase() !== "input" ||
              (o.type !== "checkbox" && o.type !== "radio")
                ? h && tf(h.elementType) && (I = Ii)
                : (I = Dm));
          if (I && (I = I(l, h))) {
            ki(z, I, u, g);
            break l;
          }
          (U && U(l, o, h),
            l === "focusout" &&
              h &&
              o.type === "number" &&
              h.memoizedProps.value != null &&
              lf(o, "number", o.value));
        }
        switch (((U = h ? Ra(h) : window), l)) {
          case "focusin":
            (Fi(U) || U.contentEditable === "true") &&
              ((Iu = U), (Sf = h), (xa = null));
            break;
          case "focusout":
            xa = Sf = Iu = null;
            break;
          case "mousedown":
            gf = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ((gf = !1), c0(z, u, g));
            break;
          case "selectionchange":
            if (Hm) break;
          case "keydown":
          case "keyup":
            c0(z, u, g);
        }
        var x;
        if (mf)
          l: {
            switch (l) {
              case "compositionstart":
                var w = "onCompositionStart";
                break l;
              case "compositionend":
                w = "onCompositionEnd";
                break l;
              case "compositionupdate":
                w = "onCompositionUpdate";
                break l;
            }
            w = void 0;
          }
        else
          ku
            ? Wi(l, u) && (w = "onCompositionEnd")
            : l === "keydown" &&
              u.keyCode === 229 &&
              (w = "onCompositionStart");
        (w &&
          (Ki &&
            u.locale !== "ko" &&
            (ku || w !== "onCompositionStart"
              ? w === "onCompositionEnd" && ku && (x = Qi())
              : ((It = g),
                (ff = "value" in It ? It.value : It.textContent),
                (ku = !0))),
          (U = Mn(h, w)),
          0 < U.length &&
            ((w = new Vi(w, l, null, u, g)),
            z.push({ event: w, listeners: U }),
            x ? (w.data = x) : ((x = $i(u)), x !== null && (w.data = x)))),
          (x = Em ? Tm(l, u) : Am(l, u)) &&
            ((w = Mn(h, "onBeforeInput")),
            0 < w.length &&
              ((U = new Vi("onBeforeInput", "beforeinput", null, u, g)),
              z.push({ event: U, listeners: w }),
              (U.data = x))),
          hd(z, l, h, u, g));
      }
      Cy(z, t);
    });
  }
  function me(l, t, u) {
    return { instance: l, listener: t, currentTarget: u };
  }
  function Mn(l, t) {
    for (var u = t + "Capture", a = []; l !== null; ) {
      var e = l,
        n = e.stateNode;
      if (
        ((e = e.tag),
        (e !== 5 && e !== 26 && e !== 27) ||
          n === null ||
          ((e = Ca(l, u)),
          e != null && a.unshift(me(l, e, n)),
          (e = Ca(l, t)),
          e != null && a.push(me(l, e, n))),
        l.tag === 3)
      )
        return a;
      l = l.return;
    }
    return [];
  }
  function rd(l) {
    if (l === null) return null;
    do l = l.return;
    while (l && l.tag !== 5 && l.tag !== 27);
    return l || null;
  }
  function By(l, t, u, a, e) {
    for (var n = t._reactName, f = []; u !== null && u !== a; ) {
      var c = u,
        i = c.alternate,
        h = c.stateNode;
      if (((c = c.tag), i !== null && i === a)) break;
      ((c !== 5 && c !== 26 && c !== 27) ||
        h === null ||
        ((i = h),
        e
          ? ((h = Ca(u, n)), h != null && f.unshift(me(u, h, i)))
          : e || ((h = Ca(u, n)), h != null && f.push(me(u, h, i)))),
        (u = u.return));
    }
    f.length !== 0 && l.push({ event: t, listeners: f });
  }
  var bd = /\r\n?/g,
    zd = /\u0000|\uFFFD/g;
  function Yy(l) {
    return (typeof l == "string" ? l : "" + l)
      .replace(
        bd,
        `
`,
      )
      .replace(zd, "");
  }
  function Gy(l, t) {
    return ((t = Yy(t)), Yy(l) === t);
  }
  function cl(l, t, u, a, e, n) {
    switch (u) {
      case "children":
        typeof a == "string"
          ? t === "body" || (t === "textarea" && a === "") || Wu(l, a)
          : (typeof a == "number" || typeof a == "bigint") &&
            t !== "body" &&
            Wu(l, "" + a);
        break;
      case "className":
        Ue(l, "class", a);
        break;
      case "tabIndex":
        Ue(l, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Ue(l, u, a);
        break;
      case "style":
        Gi(l, a, n);
        break;
      case "data":
        if (t !== "object") {
          Ue(l, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (t !== "a" || u !== "href")) {
          l.removeAttribute(u);
          break;
        }
        if (
          a == null ||
          typeof a == "function" ||
          typeof a == "symbol" ||
          typeof a == "boolean"
        ) {
          l.removeAttribute(u);
          break;
        }
        ((a = He("" + a)), l.setAttribute(u, a));
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          l.setAttribute(
            u,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
          );
          break;
        } else
          typeof n == "function" &&
            (u === "formAction"
              ? (t !== "input" && cl(l, t, "name", e.name, e, null),
                cl(l, t, "formEncType", e.formEncType, e, null),
                cl(l, t, "formMethod", e.formMethod, e, null),
                cl(l, t, "formTarget", e.formTarget, e, null))
              : (cl(l, t, "encType", e.encType, e, null),
                cl(l, t, "method", e.method, e, null),
                cl(l, t, "target", e.target, e, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          l.removeAttribute(u);
          break;
        }
        ((a = He("" + a)), l.setAttribute(u, a));
        break;
      case "onClick":
        a != null && (l.onclick = Rt);
        break;
      case "onScroll":
        a != null && K("scroll", l);
        break;
      case "onScrollEnd":
        a != null && K("scrollend", l);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a)) throw Error(m(61));
          if (((u = a.__html), u != null)) {
            if (e.children != null) throw Error(m(60));
            l.innerHTML = u;
          }
        }
        break;
      case "multiple":
        l.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        l.muted = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (
          a == null ||
          typeof a == "function" ||
          typeof a == "boolean" ||
          typeof a == "symbol"
        ) {
          l.removeAttribute("xlink:href");
          break;
        }
        ((u = He("" + a)),
          l.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", u));
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        a != null && typeof a != "function" && typeof a != "symbol"
          ? l.setAttribute(u, "" + a)
          : l.removeAttribute(u);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        a && typeof a != "function" && typeof a != "symbol"
          ? l.setAttribute(u, "")
          : l.removeAttribute(u);
        break;
      case "capture":
      case "download":
        a === !0
          ? l.setAttribute(u, "")
          : a !== !1 &&
              a != null &&
              typeof a != "function" &&
              typeof a != "symbol"
            ? l.setAttribute(u, a)
            : l.removeAttribute(u);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null &&
        typeof a != "function" &&
        typeof a != "symbol" &&
        !isNaN(a) &&
        1 <= a
          ? l.setAttribute(u, a)
          : l.removeAttribute(u);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a)
          ? l.removeAttribute(u)
          : l.setAttribute(u, a);
        break;
      case "popover":
        (K("beforetoggle", l), K("toggle", l), De(l, "popover", a));
        break;
      case "xlinkActuate":
        Ht(l, "http://www.w3.org/1999/xlink", "xlink:actuate", a);
        break;
      case "xlinkArcrole":
        Ht(l, "http://www.w3.org/1999/xlink", "xlink:arcrole", a);
        break;
      case "xlinkRole":
        Ht(l, "http://www.w3.org/1999/xlink", "xlink:role", a);
        break;
      case "xlinkShow":
        Ht(l, "http://www.w3.org/1999/xlink", "xlink:show", a);
        break;
      case "xlinkTitle":
        Ht(l, "http://www.w3.org/1999/xlink", "xlink:title", a);
        break;
      case "xlinkType":
        Ht(l, "http://www.w3.org/1999/xlink", "xlink:type", a);
        break;
      case "xmlBase":
        Ht(l, "http://www.w3.org/XML/1998/namespace", "xml:base", a);
        break;
      case "xmlLang":
        Ht(l, "http://www.w3.org/XML/1998/namespace", "xml:lang", a);
        break;
      case "xmlSpace":
        Ht(l, "http://www.w3.org/XML/1998/namespace", "xml:space", a);
        break;
      case "is":
        De(l, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < u.length) ||
          (u[0] !== "o" && u[0] !== "O") ||
          (u[1] !== "n" && u[1] !== "N")) &&
          ((u = Wv.get(u) || u), De(l, u, a));
    }
  }
  function Zc(l, t, u, a, e, n) {
    switch (u) {
      case "style":
        Gi(l, a, n);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a)) throw Error(m(61));
          if (((u = a.__html), u != null)) {
            if (e.children != null) throw Error(m(60));
            l.innerHTML = u;
          }
        }
        break;
      case "children":
        typeof a == "string"
          ? Wu(l, a)
          : (typeof a == "number" || typeof a == "bigint") && Wu(l, "" + a);
        break;
      case "onScroll":
        a != null && K("scroll", l);
        break;
      case "onScrollEnd":
        a != null && K("scrollend", l);
        break;
      case "onClick":
        a != null && (l.onclick = Rt);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!Di.hasOwnProperty(u))
          l: {
            if (
              u[0] === "o" &&
              u[1] === "n" &&
              ((e = u.endsWith("Capture")),
              (t = u.slice(2, e ? u.length - 7 : void 0)),
              (n = l[Vl] || null),
              (n = n != null ? n[u] : null),
              typeof n == "function" && l.removeEventListener(t, n, e),
              typeof a == "function")
            ) {
              (typeof n != "function" &&
                n !== null &&
                (u in l
                  ? (l[u] = null)
                  : l.hasAttribute(u) && l.removeAttribute(u)),
                l.addEventListener(t, a, e));
              break l;
            }
            u in l
              ? (l[u] = a)
              : a === !0
                ? l.setAttribute(u, "")
                : De(l, u, a);
          }
    }
  }
  function Cl(l, t, u) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        (K("error", l), K("load", l));
        var a = !1,
          e = !1,
          n;
        for (n in u)
          if (u.hasOwnProperty(n)) {
            var f = u[n];
            if (f != null)
              switch (n) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  e = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(m(137, t));
                default:
                  cl(l, t, n, f, u, null);
              }
          }
        (e && cl(l, t, "srcSet", u.srcSet, u, null),
          a && cl(l, t, "src", u.src, u, null));
        return;
      case "input":
        K("invalid", l);
        var c = (n = f = e = null),
          i = null,
          h = null;
        for (a in u)
          if (u.hasOwnProperty(a)) {
            var g = u[a];
            if (g != null)
              switch (a) {
                case "name":
                  e = g;
                  break;
                case "type":
                  f = g;
                  break;
                case "checked":
                  i = g;
                  break;
                case "defaultChecked":
                  h = g;
                  break;
                case "value":
                  n = g;
                  break;
                case "defaultValue":
                  c = g;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (g != null) throw Error(m(137, t));
                  break;
                default:
                  cl(l, t, a, g, u, null);
              }
          }
        Ci(l, n, c, i, h, f, e, !1);
        return;
      case "select":
        (K("invalid", l), (a = f = n = null));
        for (e in u)
          if (u.hasOwnProperty(e) && ((c = u[e]), c != null))
            switch (e) {
              case "value":
                n = c;
                break;
              case "defaultValue":
                f = c;
                break;
              case "multiple":
                a = c;
              default:
                cl(l, t, e, c, u, null);
            }
        ((t = n),
          (u = f),
          (l.multiple = !!a),
          t != null ? wu(l, !!a, t, !1) : u != null && wu(l, !!a, u, !0));
        return;
      case "textarea":
        (K("invalid", l), (n = e = a = null));
        for (f in u)
          if (u.hasOwnProperty(f) && ((c = u[f]), c != null))
            switch (f) {
              case "value":
                a = c;
                break;
              case "defaultValue":
                e = c;
                break;
              case "children":
                n = c;
                break;
              case "dangerouslySetInnerHTML":
                if (c != null) throw Error(m(91));
                break;
              default:
                cl(l, t, f, c, u, null);
            }
        Bi(l, a, e, n);
        return;
      case "option":
        for (i in u)
          u.hasOwnProperty(i) &&
            ((a = u[i]), a != null) &&
            (i === "selected"
              ? (l.selected =
                  a && typeof a != "function" && typeof a != "symbol")
              : cl(l, t, i, a, u, null));
        return;
      case "dialog":
        (K("beforetoggle", l), K("toggle", l), K("cancel", l), K("close", l));
        break;
      case "iframe":
      case "object":
        K("load", l);
        break;
      case "video":
      case "audio":
        for (a = 0; a < ve.length; a++) K(ve[a], l);
        break;
      case "image":
        (K("error", l), K("load", l));
        break;
      case "details":
        K("toggle", l);
        break;
      case "embed":
      case "source":
      case "link":
        (K("error", l), K("load", l));
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (h in u)
          if (u.hasOwnProperty(h) && ((a = u[h]), a != null))
            switch (h) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(m(137, t));
              default:
                cl(l, t, h, a, u, null);
            }
        return;
      default:
        if (tf(t)) {
          for (g in u)
            u.hasOwnProperty(g) &&
              ((a = u[g]), a !== void 0 && Zc(l, t, g, a, u, void 0));
          return;
        }
    }
    for (c in u)
      u.hasOwnProperty(c) && ((a = u[c]), a != null && cl(l, t, c, a, u, null));
  }
  function Ed(l, t, u, a) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var e = null,
          n = null,
          f = null,
          c = null,
          i = null,
          h = null,
          g = null;
        for (S in u) {
          var z = u[S];
          if (u.hasOwnProperty(S) && z != null)
            switch (S) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                i = z;
              default:
                a.hasOwnProperty(S) || cl(l, t, S, null, a, z);
            }
        }
        for (var o in a) {
          var S = a[o];
          if (((z = u[o]), a.hasOwnProperty(o) && (S != null || z != null)))
            switch (o) {
              case "type":
                n = S;
                break;
              case "name":
                e = S;
                break;
              case "checked":
                h = S;
                break;
              case "defaultChecked":
                g = S;
                break;
              case "value":
                f = S;
                break;
              case "defaultValue":
                c = S;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (S != null) throw Error(m(137, t));
                break;
              default:
                S !== z && cl(l, t, o, S, a, z);
            }
        }
        Pn(l, f, c, i, h, g, n, e);
        return;
      case "select":
        S = f = c = o = null;
        for (n in u)
          if (((i = u[n]), u.hasOwnProperty(n) && i != null))
            switch (n) {
              case "value":
                break;
              case "multiple":
                S = i;
              default:
                a.hasOwnProperty(n) || cl(l, t, n, null, a, i);
            }
        for (e in a)
          if (
            ((n = a[e]),
            (i = u[e]),
            a.hasOwnProperty(e) && (n != null || i != null))
          )
            switch (e) {
              case "value":
                o = n;
                break;
              case "defaultValue":
                c = n;
                break;
              case "multiple":
                f = n;
              default:
                n !== i && cl(l, t, e, n, a, i);
            }
        ((t = c),
          (u = f),
          (a = S),
          o != null
            ? wu(l, !!u, o, !1)
            : !!a != !!u &&
              (t != null ? wu(l, !!u, t, !0) : wu(l, !!u, u ? [] : "", !1)));
        return;
      case "textarea":
        S = o = null;
        for (c in u)
          if (
            ((e = u[c]),
            u.hasOwnProperty(c) && e != null && !a.hasOwnProperty(c))
          )
            switch (c) {
              case "value":
                break;
              case "children":
                break;
              default:
                cl(l, t, c, null, a, e);
            }
        for (f in a)
          if (
            ((e = a[f]),
            (n = u[f]),
            a.hasOwnProperty(f) && (e != null || n != null))
          )
            switch (f) {
              case "value":
                o = e;
                break;
              case "defaultValue":
                S = e;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (e != null) throw Error(m(91));
                break;
              default:
                e !== n && cl(l, t, f, e, a, n);
            }
        qi(l, o, S);
        return;
      case "option":
        for (var M in u)
          ((o = u[M]),
            u.hasOwnProperty(M) &&
              o != null &&
              !a.hasOwnProperty(M) &&
              (M === "selected" ? (l.selected = !1) : cl(l, t, M, null, a, o)));
        for (i in a)
          ((o = a[i]),
            (S = u[i]),
            a.hasOwnProperty(i) &&
              o !== S &&
              (o != null || S != null) &&
              (i === "selected"
                ? (l.selected =
                    o && typeof o != "function" && typeof o != "symbol")
                : cl(l, t, i, o, a, S)));
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var q in u)
          ((o = u[q]),
            u.hasOwnProperty(q) &&
              o != null &&
              !a.hasOwnProperty(q) &&
              cl(l, t, q, null, a, o));
        for (h in a)
          if (
            ((o = a[h]),
            (S = u[h]),
            a.hasOwnProperty(h) && o !== S && (o != null || S != null))
          )
            switch (h) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (o != null) throw Error(m(137, t));
                break;
              default:
                cl(l, t, h, o, a, S);
            }
        return;
      default:
        if (tf(t)) {
          for (var il in u)
            ((o = u[il]),
              u.hasOwnProperty(il) &&
                o !== void 0 &&
                !a.hasOwnProperty(il) &&
                Zc(l, t, il, void 0, a, o));
          for (g in a)
            ((o = a[g]),
              (S = u[g]),
              !a.hasOwnProperty(g) ||
                o === S ||
                (o === void 0 && S === void 0) ||
                Zc(l, t, g, o, a, S));
          return;
        }
    }
    for (var v in u)
      ((o = u[v]),
        u.hasOwnProperty(v) &&
          o != null &&
          !a.hasOwnProperty(v) &&
          cl(l, t, v, null, a, o));
    for (z in a)
      ((o = a[z]),
        (S = u[z]),
        !a.hasOwnProperty(z) ||
          o === S ||
          (o == null && S == null) ||
          cl(l, t, z, o, a, S));
  }
  function jy(l) {
    switch (l) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function Td() {
    if (typeof performance.getEntriesByType == "function") {
      for (
        var l = 0, t = 0, u = performance.getEntriesByType("resource"), a = 0;
        a < u.length;
        a++
      ) {
        var e = u[a],
          n = e.transferSize,
          f = e.initiatorType,
          c = e.duration;
        if (n && c && jy(f)) {
          for (f = 0, c = e.responseEnd, a += 1; a < u.length; a++) {
            var i = u[a],
              h = i.startTime;
            if (h > c) break;
            var g = i.transferSize,
              z = i.initiatorType;
            g &&
              jy(z) &&
              ((i = i.responseEnd), (f += g * (i < c ? 1 : (c - h) / (i - h))));
          }
          if ((--a, (t += (8 * (n + f)) / (e.duration / 1e3)), l++, 10 < l))
            break;
        }
      }
      if (0 < l) return t / l / 1e6;
    }
    return navigator.connection &&
      ((l = navigator.connection.downlink), typeof l == "number")
      ? l
      : 5;
  }
  var Vc = null,
    Lc = null;
  function pn(l) {
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  function Xy(l) {
    switch (l) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Qy(l, t) {
    if (l === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return l === 1 && t === "foreignObject" ? 0 : l;
  }
  function Kc(l, t) {
    return (
      l === "textarea" ||
      l === "noscript" ||
      typeof t.children == "string" ||
      typeof t.children == "number" ||
      typeof t.children == "bigint" ||
      (typeof t.dangerouslySetInnerHTML == "object" &&
        t.dangerouslySetInnerHTML !== null &&
        t.dangerouslySetInnerHTML.__html != null)
    );
  }
  var Jc = null;
  function Ad() {
    var l = window.event;
    return l && l.type === "popstate"
      ? l === Jc
        ? !1
        : ((Jc = l), !0)
      : ((Jc = null), !1);
  }
  var xy = typeof setTimeout == "function" ? setTimeout : void 0,
    _d = typeof clearTimeout == "function" ? clearTimeout : void 0,
    Zy = typeof Promise == "function" ? Promise : void 0,
    Od =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof Zy < "u"
          ? function (l) {
              return Zy.resolve(null).then(l).catch(Md);
            }
          : xy;
  function Md(l) {
    setTimeout(function () {
      throw l;
    });
  }
  function ou(l) {
    return l === "head";
  }
  function Vy(l, t) {
    var u = t,
      a = 0;
    do {
      var e = u.nextSibling;
      if ((l.removeChild(u), e && e.nodeType === 8))
        if (((u = e.data), u === "/$" || u === "/&")) {
          if (a === 0) {
            (l.removeChild(e), Oa(t));
            return;
          }
          a--;
        } else if (
          u === "$" ||
          u === "$?" ||
          u === "$~" ||
          u === "$!" ||
          u === "&"
        )
          a++;
        else if (u === "html") de(l.ownerDocument.documentElement);
        else if (u === "head") {
          ((u = l.ownerDocument.head), de(u));
          for (var n = u.firstChild; n; ) {
            var f = n.nextSibling,
              c = n.nodeName;
            (n[Ha] ||
              c === "SCRIPT" ||
              c === "STYLE" ||
              (c === "LINK" && n.rel.toLowerCase() === "stylesheet") ||
              u.removeChild(n),
              (n = f));
          }
        } else u === "body" && de(l.ownerDocument.body);
      u = e;
    } while (u);
    Oa(t);
  }
  function Ly(l, t) {
    var u = l;
    l = 0;
    do {
      var a = u.nextSibling;
      if (
        (u.nodeType === 1
          ? t
            ? ((u._stashedDisplay = u.style.display),
              (u.style.display = "none"))
            : ((u.style.display = u._stashedDisplay || ""),
              u.getAttribute("style") === "" && u.removeAttribute("style"))
          : u.nodeType === 3 &&
            (t
              ? ((u._stashedText = u.nodeValue), (u.nodeValue = ""))
              : (u.nodeValue = u._stashedText || "")),
        a && a.nodeType === 8)
      )
        if (((u = a.data), u === "/$")) {
          if (l === 0) break;
          l--;
        } else (u !== "$" && u !== "$?" && u !== "$~" && u !== "$!") || l++;
      u = a;
    } while (u);
  }
  function wc(l) {
    var t = l.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var u = t;
      switch (((t = t.nextSibling), u.nodeName)) {
        case "HTML":
        case "HEAD":
        case "BODY":
          (wc(u), kn(u));
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (u.rel.toLowerCase() === "stylesheet") continue;
      }
      l.removeChild(u);
    }
  }
  function pd(l, t, u, a) {
    for (; l.nodeType === 1; ) {
      var e = u;
      if (l.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (l.nodeName !== "INPUT" || l.type !== "hidden")) break;
      } else if (a) {
        if (!l[Ha])
          switch (t) {
            case "meta":
              if (!l.hasAttribute("itemprop")) break;
              return l;
            case "link":
              if (
                ((n = l.getAttribute("rel")),
                n === "stylesheet" && l.hasAttribute("data-precedence"))
              )
                break;
              if (
                n !== e.rel ||
                l.getAttribute("href") !==
                  (e.href == null || e.href === "" ? null : e.href) ||
                l.getAttribute("crossorigin") !==
                  (e.crossOrigin == null ? null : e.crossOrigin) ||
                l.getAttribute("title") !== (e.title == null ? null : e.title)
              )
                break;
              return l;
            case "style":
              if (l.hasAttribute("data-precedence")) break;
              return l;
            case "script":
              if (
                ((n = l.getAttribute("src")),
                (n !== (e.src == null ? null : e.src) ||
                  l.getAttribute("type") !== (e.type == null ? null : e.type) ||
                  l.getAttribute("crossorigin") !==
                    (e.crossOrigin == null ? null : e.crossOrigin)) &&
                  n &&
                  l.hasAttribute("async") &&
                  !l.hasAttribute("itemprop"))
              )
                break;
              return l;
            default:
              return l;
          }
      } else if (t === "input" && l.type === "hidden") {
        var n = e.name == null ? null : "" + e.name;
        if (e.type === "hidden" && l.getAttribute("name") === n) return l;
      } else return l;
      if (((l = gt(l.nextSibling)), l === null)) break;
    }
    return null;
  }
  function Dd(l, t, u) {
    if (t === "") return null;
    for (; l.nodeType !== 3; )
      if (
        ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") &&
          !u) ||
        ((l = gt(l.nextSibling)), l === null)
      )
        return null;
    return l;
  }
  function Ky(l, t) {
    for (; l.nodeType !== 8; )
      if (
        ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") &&
          !t) ||
        ((l = gt(l.nextSibling)), l === null)
      )
        return null;
    return l;
  }
  function Wc(l) {
    return l.data === "$?" || l.data === "$~";
  }
  function $c(l) {
    return (
      l.data === "$!" ||
      (l.data === "$?" && l.ownerDocument.readyState !== "loading")
    );
  }
  function Ud(l, t) {
    var u = l.ownerDocument;
    if (l.data === "$~") l._reactRetry = t;
    else if (l.data !== "$?" || u.readyState !== "loading") t();
    else {
      var a = function () {
        (t(), u.removeEventListener("DOMContentLoaded", a));
      };
      (u.addEventListener("DOMContentLoaded", a), (l._reactRetry = a));
    }
  }
  function gt(l) {
    for (; l != null; l = l.nextSibling) {
      var t = l.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (
          ((t = l.data),
          t === "$" ||
            t === "$!" ||
            t === "$?" ||
            t === "$~" ||
            t === "&" ||
            t === "F!" ||
            t === "F")
        )
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return l;
  }
  var Fc = null;
  function Jy(l) {
    l = l.nextSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var u = l.data;
        if (u === "/$" || u === "/&") {
          if (t === 0) return gt(l.nextSibling);
          t--;
        } else
          (u !== "$" && u !== "$!" && u !== "$?" && u !== "$~" && u !== "&") ||
            t++;
      }
      l = l.nextSibling;
    }
    return null;
  }
  function wy(l) {
    l = l.previousSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var u = l.data;
        if (u === "$" || u === "$!" || u === "$?" || u === "$~" || u === "&") {
          if (t === 0) return l;
          t--;
        } else (u !== "/$" && u !== "/&") || t++;
      }
      l = l.previousSibling;
    }
    return null;
  }
  function Wy(l, t, u) {
    switch (((t = pn(u)), l)) {
      case "html":
        if (((l = t.documentElement), !l)) throw Error(m(452));
        return l;
      case "head":
        if (((l = t.head), !l)) throw Error(m(453));
        return l;
      case "body":
        if (((l = t.body), !l)) throw Error(m(454));
        return l;
      default:
        throw Error(m(451));
    }
  }
  function de(l) {
    for (var t = l.attributes; t.length; ) l.removeAttributeNode(t[0]);
    kn(l);
  }
  var rt = new Map(),
    $y = new Set();
  function Dn(l) {
    return typeof l.getRootNode == "function"
      ? l.getRootNode()
      : l.nodeType === 9
        ? l
        : l.ownerDocument;
  }
  var Wt = _.d;
  _.d = { f: Nd, r: Hd, D: Rd, C: Cd, L: qd, m: Bd, X: Gd, S: Yd, M: jd };
  function Nd() {
    var l = Wt.f(),
      t = bn();
    return l || t;
  }
  function Hd(l) {
    var t = Lu(l);
    t !== null && t.tag === 5 && t.type === "form" ? ms(t) : Wt.r(l);
  }
  var Ta = typeof document > "u" ? null : document;
  function Fy(l, t, u) {
    var a = Ta;
    if (a && typeof t == "string" && t) {
      var e = yt(t);
      ((e = 'link[rel="' + l + '"][href="' + e + '"]'),
        typeof u == "string" && (e += '[crossorigin="' + u + '"]'),
        $y.has(e) ||
          ($y.add(e),
          (l = { rel: l, crossOrigin: u, href: t }),
          a.querySelector(e) === null &&
            ((t = a.createElement("link")),
            Cl(t, "link", l),
            Ml(t),
            a.head.appendChild(t))));
    }
  }
  function Rd(l) {
    (Wt.D(l), Fy("dns-prefetch", l, null));
  }
  function Cd(l, t) {
    (Wt.C(l, t), Fy("preconnect", l, t));
  }
  function qd(l, t, u) {
    Wt.L(l, t, u);
    var a = Ta;
    if (a && l && t) {
      var e = 'link[rel="preload"][as="' + yt(t) + '"]';
      t === "image" && u && u.imageSrcSet
        ? ((e += '[imagesrcset="' + yt(u.imageSrcSet) + '"]'),
          typeof u.imageSizes == "string" &&
            (e += '[imagesizes="' + yt(u.imageSizes) + '"]'))
        : (e += '[href="' + yt(l) + '"]');
      var n = e;
      switch (t) {
        case "style":
          n = Aa(l);
          break;
        case "script":
          n = _a(l);
      }
      rt.has(n) ||
        ((l = B(
          {
            rel: "preload",
            href: t === "image" && u && u.imageSrcSet ? void 0 : l,
            as: t,
          },
          u,
        )),
        rt.set(n, l),
        a.querySelector(e) !== null ||
          (t === "style" && a.querySelector(he(n))) ||
          (t === "script" && a.querySelector(oe(n))) ||
          ((t = a.createElement("link")),
          Cl(t, "link", l),
          Ml(t),
          a.head.appendChild(t)));
    }
  }
  function Bd(l, t) {
    Wt.m(l, t);
    var u = Ta;
    if (u && l) {
      var a = t && typeof t.as == "string" ? t.as : "script",
        e =
          'link[rel="modulepreload"][as="' + yt(a) + '"][href="' + yt(l) + '"]',
        n = e;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          n = _a(l);
      }
      if (
        !rt.has(n) &&
        ((l = B({ rel: "modulepreload", href: l }, t)),
        rt.set(n, l),
        u.querySelector(e) === null)
      ) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (u.querySelector(oe(n))) return;
        }
        ((a = u.createElement("link")),
          Cl(a, "link", l),
          Ml(a),
          u.head.appendChild(a));
      }
    }
  }
  function Yd(l, t, u) {
    Wt.S(l, t, u);
    var a = Ta;
    if (a && l) {
      var e = Ku(a).hoistableStyles,
        n = Aa(l);
      t = t || "default";
      var f = e.get(n);
      if (!f) {
        var c = { loading: 0, preload: null };
        if ((f = a.querySelector(he(n)))) c.loading = 5;
        else {
          ((l = B({ rel: "stylesheet", href: l, "data-precedence": t }, u)),
            (u = rt.get(n)) && kc(l, u));
          var i = (f = a.createElement("link"));
          (Ml(i),
            Cl(i, "link", l),
            (i._p = new Promise(function (h, g) {
              ((i.onload = h), (i.onerror = g));
            })),
            i.addEventListener("load", function () {
              c.loading |= 1;
            }),
            i.addEventListener("error", function () {
              c.loading |= 2;
            }),
            (c.loading |= 4),
            Un(f, t, a));
        }
        ((f = { type: "stylesheet", instance: f, count: 1, state: c }),
          e.set(n, f));
      }
    }
  }
  function Gd(l, t) {
    Wt.X(l, t);
    var u = Ta;
    if (u && l) {
      var a = Ku(u).hoistableScripts,
        e = _a(l),
        n = a.get(e);
      n ||
        ((n = u.querySelector(oe(e))),
        n ||
          ((l = B({ src: l, async: !0 }, t)),
          (t = rt.get(e)) && Ic(l, t),
          (n = u.createElement("script")),
          Ml(n),
          Cl(n, "link", l),
          u.head.appendChild(n)),
        (n = { type: "script", instance: n, count: 1, state: null }),
        a.set(e, n));
    }
  }
  function jd(l, t) {
    Wt.M(l, t);
    var u = Ta;
    if (u && l) {
      var a = Ku(u).hoistableScripts,
        e = _a(l),
        n = a.get(e);
      n ||
        ((n = u.querySelector(oe(e))),
        n ||
          ((l = B({ src: l, async: !0, type: "module" }, t)),
          (t = rt.get(e)) && Ic(l, t),
          (n = u.createElement("script")),
          Ml(n),
          Cl(n, "link", l),
          u.head.appendChild(n)),
        (n = { type: "script", instance: n, count: 1, state: null }),
        a.set(e, n));
    }
  }
  function ky(l, t, u, a) {
    var e = (e = V.current) ? Dn(e) : null;
    if (!e) throw Error(m(446));
    switch (l) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof u.precedence == "string" && typeof u.href == "string"
          ? ((t = Aa(u.href)),
            (u = Ku(e).hoistableStyles),
            (a = u.get(t)),
            a ||
              ((a = { type: "style", instance: null, count: 0, state: null }),
              u.set(t, a)),
            a)
          : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (
          u.rel === "stylesheet" &&
          typeof u.href == "string" &&
          typeof u.precedence == "string"
        ) {
          l = Aa(u.href);
          var n = Ku(e).hoistableStyles,
            f = n.get(l);
          if (
            (f ||
              ((e = e.ownerDocument || e),
              (f = {
                type: "stylesheet",
                instance: null,
                count: 0,
                state: { loading: 0, preload: null },
              }),
              n.set(l, f),
              (n = e.querySelector(he(l))) &&
                !n._p &&
                ((f.instance = n), (f.state.loading = 5)),
              rt.has(l) ||
                ((u = {
                  rel: "preload",
                  as: "style",
                  href: u.href,
                  crossOrigin: u.crossOrigin,
                  integrity: u.integrity,
                  media: u.media,
                  hrefLang: u.hrefLang,
                  referrerPolicy: u.referrerPolicy,
                }),
                rt.set(l, u),
                n || Xd(e, l, u, f.state))),
            t && a === null)
          )
            throw Error(m(528, ""));
          return f;
        }
        if (t && a !== null) throw Error(m(529, ""));
        return null;
      case "script":
        return (
          (t = u.async),
          (u = u.src),
          typeof u == "string" &&
          t &&
          typeof t != "function" &&
          typeof t != "symbol"
            ? ((t = _a(u)),
              (u = Ku(e).hoistableScripts),
              (a = u.get(t)),
              a ||
                ((a = {
                  type: "script",
                  instance: null,
                  count: 0,
                  state: null,
                }),
                u.set(t, a)),
              a)
            : { type: "void", instance: null, count: 0, state: null }
        );
      default:
        throw Error(m(444, l));
    }
  }
  function Aa(l) {
    return 'href="' + yt(l) + '"';
  }
  function he(l) {
    return 'link[rel="stylesheet"][' + l + "]";
  }
  function Iy(l) {
    return B({}, l, { "data-precedence": l.precedence, precedence: null });
  }
  function Xd(l, t, u, a) {
    l.querySelector('link[rel="preload"][as="style"][' + t + "]")
      ? (a.loading = 1)
      : ((t = l.createElement("link")),
        (a.preload = t),
        t.addEventListener("load", function () {
          return (a.loading |= 1);
        }),
        t.addEventListener("error", function () {
          return (a.loading |= 2);
        }),
        Cl(t, "link", u),
        Ml(t),
        l.head.appendChild(t));
  }
  function _a(l) {
    return '[src="' + yt(l) + '"]';
  }
  function oe(l) {
    return "script[async]" + l;
  }
  function Py(l, t, u) {
    if ((t.count++, t.instance === null))
      switch (t.type) {
        case "style":
          var a = l.querySelector('style[data-href~="' + yt(u.href) + '"]');
          if (a) return ((t.instance = a), Ml(a), a);
          var e = B({}, u, {
            "data-href": u.href,
            "data-precedence": u.precedence,
            href: null,
            precedence: null,
          });
          return (
            (a = (l.ownerDocument || l).createElement("style")),
            Ml(a),
            Cl(a, "style", e),
            Un(a, u.precedence, l),
            (t.instance = a)
          );
        case "stylesheet":
          e = Aa(u.href);
          var n = l.querySelector(he(e));
          if (n) return ((t.state.loading |= 4), (t.instance = n), Ml(n), n);
          ((a = Iy(u)),
            (e = rt.get(e)) && kc(a, e),
            (n = (l.ownerDocument || l).createElement("link")),
            Ml(n));
          var f = n;
          return (
            (f._p = new Promise(function (c, i) {
              ((f.onload = c), (f.onerror = i));
            })),
            Cl(n, "link", a),
            (t.state.loading |= 4),
            Un(n, u.precedence, l),
            (t.instance = n)
          );
        case "script":
          return (
            (n = _a(u.src)),
            (e = l.querySelector(oe(n)))
              ? ((t.instance = e), Ml(e), e)
              : ((a = u),
                (e = rt.get(n)) && ((a = B({}, u)), Ic(a, e)),
                (l = l.ownerDocument || l),
                (e = l.createElement("script")),
                Ml(e),
                Cl(e, "link", a),
                l.head.appendChild(e),
                (t.instance = e))
          );
        case "void":
          return null;
        default:
          throw Error(m(443, t.type));
      }
    else
      t.type === "stylesheet" &&
        (t.state.loading & 4) === 0 &&
        ((a = t.instance), (t.state.loading |= 4), Un(a, u.precedence, l));
    return t.instance;
  }
  function Un(l, t, u) {
    for (
      var a = u.querySelectorAll(
          'link[rel="stylesheet"][data-precedence],style[data-precedence]',
        ),
        e = a.length ? a[a.length - 1] : null,
        n = e,
        f = 0;
      f < a.length;
      f++
    ) {
      var c = a[f];
      if (c.dataset.precedence === t) n = c;
      else if (n !== e) break;
    }
    n
      ? n.parentNode.insertBefore(l, n.nextSibling)
      : ((t = u.nodeType === 9 ? u.head : u), t.insertBefore(l, t.firstChild));
  }
  function kc(l, t) {
    (l.crossOrigin == null && (l.crossOrigin = t.crossOrigin),
      l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy),
      l.title == null && (l.title = t.title));
  }
  function Ic(l, t) {
    (l.crossOrigin == null && (l.crossOrigin = t.crossOrigin),
      l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy),
      l.integrity == null && (l.integrity = t.integrity));
  }
  var Nn = null;
  function lv(l, t, u) {
    if (Nn === null) {
      var a = new Map(),
        e = (Nn = new Map());
      e.set(u, a);
    } else ((e = Nn), (a = e.get(u)), a || ((a = new Map()), e.set(u, a)));
    if (a.has(l)) return a;
    for (
      a.set(l, null), u = u.getElementsByTagName(l), e = 0;
      e < u.length;
      e++
    ) {
      var n = u[e];
      if (
        !(
          n[Ha] ||
          n[Ul] ||
          (l === "link" && n.getAttribute("rel") === "stylesheet")
        ) &&
        n.namespaceURI !== "http://www.w3.org/2000/svg"
      ) {
        var f = n.getAttribute(t) || "";
        f = l + f;
        var c = a.get(f);
        c ? c.push(n) : a.set(f, [n]);
      }
    }
    return a;
  }
  function tv(l, t, u) {
    ((l = l.ownerDocument || l),
      l.head.insertBefore(
        u,
        t === "title" ? l.querySelector("head > title") : null,
      ));
  }
  function Qd(l, t, u) {
    if (u === 1 || t.itemProp != null) return !1;
    switch (l) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (
          typeof t.precedence != "string" ||
          typeof t.href != "string" ||
          t.href === ""
        )
          break;
        return !0;
      case "link":
        if (
          typeof t.rel != "string" ||
          typeof t.href != "string" ||
          t.href === "" ||
          t.onLoad ||
          t.onError
        )
          break;
        return t.rel === "stylesheet"
          ? ((l = t.disabled), typeof t.precedence == "string" && l == null)
          : !0;
      case "script":
        if (
          t.async &&
          typeof t.async != "function" &&
          typeof t.async != "symbol" &&
          !t.onLoad &&
          !t.onError &&
          t.src &&
          typeof t.src == "string"
        )
          return !0;
    }
    return !1;
  }
  function uv(l) {
    return !(l.type === "stylesheet" && (l.state.loading & 3) === 0);
  }
  function xd(l, t, u, a) {
    if (
      u.type === "stylesheet" &&
      (typeof a.media != "string" || matchMedia(a.media).matches !== !1) &&
      (u.state.loading & 4) === 0
    ) {
      if (u.instance === null) {
        var e = Aa(a.href),
          n = t.querySelector(he(e));
        if (n) {
          ((t = n._p),
            t !== null &&
              typeof t == "object" &&
              typeof t.then == "function" &&
              (l.count++, (l = Hn.bind(l)), t.then(l, l)),
            (u.state.loading |= 4),
            (u.instance = n),
            Ml(n));
          return;
        }
        ((n = t.ownerDocument || t),
          (a = Iy(a)),
          (e = rt.get(e)) && kc(a, e),
          (n = n.createElement("link")),
          Ml(n));
        var f = n;
        ((f._p = new Promise(function (c, i) {
          ((f.onload = c), (f.onerror = i));
        })),
          Cl(n, "link", a),
          (u.instance = n));
      }
      (l.stylesheets === null && (l.stylesheets = new Map()),
        l.stylesheets.set(u, t),
        (t = u.state.preload) &&
          (u.state.loading & 3) === 0 &&
          (l.count++,
          (u = Hn.bind(l)),
          t.addEventListener("load", u),
          t.addEventListener("error", u)));
    }
  }
  var Pc = 0;
  function Zd(l, t) {
    return (
      l.stylesheets && l.count === 0 && Cn(l, l.stylesheets),
      0 < l.count || 0 < l.imgCount
        ? function (u) {
            var a = setTimeout(function () {
              if ((l.stylesheets && Cn(l, l.stylesheets), l.unsuspend)) {
                var n = l.unsuspend;
                ((l.unsuspend = null), n());
              }
            }, 6e4 + t);
            0 < l.imgBytes && Pc === 0 && (Pc = 62500 * Td());
            var e = setTimeout(
              function () {
                if (
                  ((l.waitingForImages = !1),
                  l.count === 0 &&
                    (l.stylesheets && Cn(l, l.stylesheets), l.unsuspend))
                ) {
                  var n = l.unsuspend;
                  ((l.unsuspend = null), n());
                }
              },
              (l.imgBytes > Pc ? 50 : 800) + t,
            );
            return (
              (l.unsuspend = u),
              function () {
                ((l.unsuspend = null), clearTimeout(a), clearTimeout(e));
              }
            );
          }
        : null
    );
  }
  function Hn() {
    if (
      (this.count--,
      this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))
    ) {
      if (this.stylesheets) Cn(this, this.stylesheets);
      else if (this.unsuspend) {
        var l = this.unsuspend;
        ((this.unsuspend = null), l());
      }
    }
  }
  var Rn = null;
  function Cn(l, t) {
    ((l.stylesheets = null),
      l.unsuspend !== null &&
        (l.count++,
        (Rn = new Map()),
        t.forEach(Vd, l),
        (Rn = null),
        Hn.call(l)));
  }
  function Vd(l, t) {
    if (!(t.state.loading & 4)) {
      var u = Rn.get(l);
      if (u) var a = u.get(null);
      else {
        ((u = new Map()), Rn.set(l, u));
        for (
          var e = l.querySelectorAll(
              "link[data-precedence],style[data-precedence]",
            ),
            n = 0;
          n < e.length;
          n++
        ) {
          var f = e[n];
          (f.nodeName === "LINK" || f.getAttribute("media") !== "not all") &&
            (u.set(f.dataset.precedence, f), (a = f));
        }
        a && u.set(null, a);
      }
      ((e = t.instance),
        (f = e.getAttribute("data-precedence")),
        (n = u.get(f) || a),
        n === a && u.set(null, e),
        u.set(f, e),
        this.count++,
        (a = Hn.bind(this)),
        e.addEventListener("load", a),
        e.addEventListener("error", a),
        n
          ? n.parentNode.insertBefore(e, n.nextSibling)
          : ((l = l.nodeType === 9 ? l.head : l),
            l.insertBefore(e, l.firstChild)),
        (t.state.loading |= 4));
    }
  }
  var Se = {
    $$typeof: Bl,
    Provider: null,
    Consumer: null,
    _currentValue: Y,
    _currentValue2: Y,
    _threadCount: 0,
  };
  function Ld(l, t, u, a, e, n, f, c, i) {
    ((this.tag = 1),
      (this.containerInfo = l),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode =
        this.next =
        this.pendingContext =
        this.context =
        this.cancelPendingCommit =
          null),
      (this.callbackPriority = 0),
      (this.expirationTimes = wn(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = wn(0)),
      (this.hiddenUpdates = wn(null)),
      (this.identifierPrefix = a),
      (this.onUncaughtError = e),
      (this.onCaughtError = n),
      (this.onRecoverableError = f),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = i),
      (this.incompleteTransitions = new Map()));
  }
  function av(l, t, u, a, e, n, f, c, i, h, g, z) {
    return (
      (l = new Ld(l, t, u, f, i, h, g, z, c)),
      (t = 1),
      n === !0 && (t |= 24),
      (n = ut(3, null, null, t)),
      (l.current = n),
      (n.stateNode = l),
      (t = Rf()),
      t.refCount++,
      (l.pooledCache = t),
      t.refCount++,
      (n.memoizedState = { element: a, isDehydrated: u, cache: t }),
      Yf(n),
      l
    );
  }
  function ev(l) {
    return l ? ((l = ta), l) : ta;
  }
  function nv(l, t, u, a, e, n) {
    ((e = ev(e)),
      a.context === null ? (a.context = e) : (a.pendingContext = e),
      (a = eu(t)),
      (a.payload = { element: u }),
      (n = n === void 0 ? null : n),
      n !== null && (a.callback = n),
      (u = nu(l, a, t)),
      u !== null && ($l(u, l, t), Wa(u, l, t)));
  }
  function fv(l, t) {
    if (((l = l.memoizedState), l !== null && l.dehydrated !== null)) {
      var u = l.retryLane;
      l.retryLane = u !== 0 && u < t ? u : t;
    }
  }
  function li(l, t) {
    (fv(l, t), (l = l.alternate) && fv(l, t));
  }
  function cv(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = Du(l, 67108864);
      (t !== null && $l(t, l, 67108864), li(l, 67108864));
    }
  }
  function iv(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = ct();
      t = Wn(t);
      var u = Du(l, t);
      (u !== null && $l(u, l, t), li(l, t));
    }
  }
  var qn = !0;
  function Kd(l, t, u, a) {
    var e = r.T;
    r.T = null;
    var n = _.p;
    try {
      ((_.p = 2), ti(l, t, u, a));
    } finally {
      ((_.p = n), (r.T = e));
    }
  }
  function Jd(l, t, u, a) {
    var e = r.T;
    r.T = null;
    var n = _.p;
    try {
      ((_.p = 8), ti(l, t, u, a));
    } finally {
      ((_.p = n), (r.T = e));
    }
  }
  function ti(l, t, u, a) {
    if (qn) {
      var e = ui(a);
      if (e === null) (xc(l, t, a, Bn, u), yv(l, a));
      else if (Wd(e, l, t, u, a)) a.stopPropagation();
      else if ((yv(l, a), t & 4 && -1 < wd.indexOf(l))) {
        for (; e !== null; ) {
          var n = Lu(e);
          if (n !== null)
            switch (n.tag) {
              case 3:
                if (((n = n.stateNode), n.current.memoizedState.isDehydrated)) {
                  var f = Au(n.pendingLanes);
                  if (f !== 0) {
                    var c = n;
                    for (c.pendingLanes |= 2, c.entangledLanes |= 2; f; ) {
                      var i = 1 << (31 - lt(f));
                      ((c.entanglements[1] |= i), (f &= ~i));
                    }
                    (Ut(n), (ll & 6) === 0 && ((gn = Il() + 500), ye(0)));
                  }
                }
                break;
              case 31:
              case 13:
                ((c = Du(n, 2)), c !== null && $l(c, n, 2), bn(), li(n, 2));
            }
          if (((n = ui(a)), n === null && xc(l, t, a, Bn, u), n === e)) break;
          e = n;
        }
        e !== null && a.stopPropagation();
      } else xc(l, t, a, null, u);
    }
  }
  function ui(l) {
    return ((l = af(l)), ai(l));
  }
  var Bn = null;
  function ai(l) {
    if (((Bn = null), (l = Vu(l)), l !== null)) {
      var t = C(l);
      if (t === null) l = null;
      else {
        var u = t.tag;
        if (u === 13) {
          if (((l = Z(t)), l !== null)) return l;
          l = null;
        } else if (u === 31) {
          if (((l = tl(t)), l !== null)) return l;
          l = null;
        } else if (u === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          l = null;
        } else t !== l && (l = null);
      }
    }
    return ((Bn = l), null);
  }
  function sv(l) {
    switch (l) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (Rv()) {
          case gi:
            return 2;
          case ri:
            return 8;
          case Ae:
          case Cv:
            return 32;
          case bi:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var ei = !1,
    Su = null,
    gu = null,
    ru = null,
    ge = new Map(),
    re = new Map(),
    bu = [],
    wd =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
        " ",
      );
  function yv(l, t) {
    switch (l) {
      case "focusin":
      case "focusout":
        Su = null;
        break;
      case "dragenter":
      case "dragleave":
        gu = null;
        break;
      case "mouseover":
      case "mouseout":
        ru = null;
        break;
      case "pointerover":
      case "pointerout":
        ge.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        re.delete(t.pointerId);
    }
  }
  function be(l, t, u, a, e, n) {
    return l === null || l.nativeEvent !== n
      ? ((l = {
          blockedOn: t,
          domEventName: u,
          eventSystemFlags: a,
          nativeEvent: n,
          targetContainers: [e],
        }),
        t !== null && ((t = Lu(t)), t !== null && cv(t)),
        l)
      : ((l.eventSystemFlags |= a),
        (t = l.targetContainers),
        e !== null && t.indexOf(e) === -1 && t.push(e),
        l);
  }
  function Wd(l, t, u, a, e) {
    switch (t) {
      case "focusin":
        return ((Su = be(Su, l, t, u, a, e)), !0);
      case "dragenter":
        return ((gu = be(gu, l, t, u, a, e)), !0);
      case "mouseover":
        return ((ru = be(ru, l, t, u, a, e)), !0);
      case "pointerover":
        var n = e.pointerId;
        return (ge.set(n, be(ge.get(n) || null, l, t, u, a, e)), !0);
      case "gotpointercapture":
        return (
          (n = e.pointerId),
          re.set(n, be(re.get(n) || null, l, t, u, a, e)),
          !0
        );
    }
    return !1;
  }
  function vv(l) {
    var t = Vu(l.target);
    if (t !== null) {
      var u = C(t);
      if (u !== null) {
        if (((t = u.tag), t === 13)) {
          if (((t = Z(u)), t !== null)) {
            ((l.blockedOn = t),
              Oi(l.priority, function () {
                iv(u);
              }));
            return;
          }
        } else if (t === 31) {
          if (((t = tl(u)), t !== null)) {
            ((l.blockedOn = t),
              Oi(l.priority, function () {
                iv(u);
              }));
            return;
          }
        } else if (t === 3 && u.stateNode.current.memoizedState.isDehydrated) {
          l.blockedOn = u.tag === 3 ? u.stateNode.containerInfo : null;
          return;
        }
      }
    }
    l.blockedOn = null;
  }
  function Yn(l) {
    if (l.blockedOn !== null) return !1;
    for (var t = l.targetContainers; 0 < t.length; ) {
      var u = ui(l.nativeEvent);
      if (u === null) {
        u = l.nativeEvent;
        var a = new u.constructor(u.type, u);
        ((uf = a), u.target.dispatchEvent(a), (uf = null));
      } else return ((t = Lu(u)), t !== null && cv(t), (l.blockedOn = u), !1);
      t.shift();
    }
    return !0;
  }
  function mv(l, t, u) {
    Yn(l) && u.delete(t);
  }
  function $d() {
    ((ei = !1),
      Su !== null && Yn(Su) && (Su = null),
      gu !== null && Yn(gu) && (gu = null),
      ru !== null && Yn(ru) && (ru = null),
      ge.forEach(mv),
      re.forEach(mv));
  }
  function Gn(l, t) {
    l.blockedOn === t &&
      ((l.blockedOn = null),
      ei ||
        ((ei = !0),
        T.unstable_scheduleCallback(T.unstable_NormalPriority, $d)));
  }
  var jn = null;
  function dv(l) {
    jn !== l &&
      ((jn = l),
      T.unstable_scheduleCallback(T.unstable_NormalPriority, function () {
        jn === l && (jn = null);
        for (var t = 0; t < l.length; t += 3) {
          var u = l[t],
            a = l[t + 1],
            e = l[t + 2];
          if (typeof a != "function") {
            if (ai(a || u) === null) continue;
            break;
          }
          var n = Lu(u);
          n !== null &&
            (l.splice(t, 3),
            (t -= 3),
            uc(n, { pending: !0, data: e, method: u.method, action: a }, a, e));
        }
      }));
  }
  function Oa(l) {
    function t(i) {
      return Gn(i, l);
    }
    (Su !== null && Gn(Su, l),
      gu !== null && Gn(gu, l),
      ru !== null && Gn(ru, l),
      ge.forEach(t),
      re.forEach(t));
    for (var u = 0; u < bu.length; u++) {
      var a = bu[u];
      a.blockedOn === l && (a.blockedOn = null);
    }
    for (; 0 < bu.length && ((u = bu[0]), u.blockedOn === null); )
      (vv(u), u.blockedOn === null && bu.shift());
    if (((u = (l.ownerDocument || l).$$reactFormReplay), u != null))
      for (a = 0; a < u.length; a += 3) {
        var e = u[a],
          n = u[a + 1],
          f = e[Vl] || null;
        if (typeof n == "function") f || dv(u);
        else if (f) {
          var c = null;
          if (n && n.hasAttribute("formAction")) {
            if (((e = n), (f = n[Vl] || null))) c = f.formAction;
            else if (ai(e) !== null) continue;
          } else c = f.action;
          (typeof c == "function" ? (u[a + 1] = c) : (u.splice(a, 3), (a -= 3)),
            dv(u));
        }
      }
  }
  function hv() {
    function l(n) {
      n.canIntercept &&
        n.info === "react-transition" &&
        n.intercept({
          handler: function () {
            return new Promise(function (f) {
              return (e = f);
            });
          },
          focusReset: "manual",
          scroll: "manual",
        });
    }
    function t() {
      (e !== null && (e(), (e = null)), a || setTimeout(u, 20));
    }
    function u() {
      if (!a && !navigation.transition) {
        var n = navigation.currentEntry;
        n &&
          n.url != null &&
          navigation.navigate(n.url, {
            state: n.getState(),
            info: "react-transition",
            history: "replace",
          });
      }
    }
    if (typeof navigation == "object") {
      var a = !1,
        e = null;
      return (
        navigation.addEventListener("navigate", l),
        navigation.addEventListener("navigatesuccess", t),
        navigation.addEventListener("navigateerror", t),
        setTimeout(u, 100),
        function () {
          ((a = !0),
            navigation.removeEventListener("navigate", l),
            navigation.removeEventListener("navigatesuccess", t),
            navigation.removeEventListener("navigateerror", t),
            e !== null && (e(), (e = null)));
        }
      );
    }
  }
  function ni(l) {
    this._internalRoot = l;
  }
  ((Xn.prototype.render = ni.prototype.render =
    function (l) {
      var t = this._internalRoot;
      if (t === null) throw Error(m(409));
      var u = t.current,
        a = ct();
      nv(u, a, l, t, null, null);
    }),
    (Xn.prototype.unmount = ni.prototype.unmount =
      function () {
        var l = this._internalRoot;
        if (l !== null) {
          this._internalRoot = null;
          var t = l.containerInfo;
          (nv(l.current, 2, null, l, null, null), bn(), (t[Zu] = null));
        }
      }));
  function Xn(l) {
    this._internalRoot = l;
  }
  Xn.prototype.unstable_scheduleHydration = function (l) {
    if (l) {
      var t = _i();
      l = { blockedOn: null, target: l, priority: t };
      for (var u = 0; u < bu.length && t !== 0 && t < bu[u].priority; u++);
      (bu.splice(u, 0, l), u === 0 && vv(l));
    }
  };
  var ov = R.version;
  if (ov !== "19.2.4") throw Error(m(527, ov, "19.2.4"));
  _.findDOMNode = function (l) {
    var t = l._reactInternals;
    if (t === void 0)
      throw typeof l.render == "function"
        ? Error(m(188))
        : ((l = Object.keys(l).join(",")), Error(m(268, l)));
    return (
      (l = A(t)),
      (l = l !== null ? k(l) : null),
      (l = l === null ? null : l.stateNode),
      l
    );
  };
  var Fd = {
    bundleType: 0,
    version: "19.2.4",
    rendererPackageName: "react-dom",
    currentDispatcherRef: r,
    reconcilerVersion: "19.2.4",
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Qn = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Qn.isDisabled && Qn.supportsFiber)
      try {
        ((Da = Qn.inject(Fd)), (Pl = Qn));
      } catch {}
  }
  return (
    (Ee.createRoot = function (l, t) {
      if (!N(l)) throw Error(m(299));
      var u = !1,
        a = "",
        e = Ts,
        n = As,
        f = _s;
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (u = !0),
          t.identifierPrefix !== void 0 && (a = t.identifierPrefix),
          t.onUncaughtError !== void 0 && (e = t.onUncaughtError),
          t.onCaughtError !== void 0 && (n = t.onCaughtError),
          t.onRecoverableError !== void 0 && (f = t.onRecoverableError)),
        (t = av(l, 1, !1, null, null, u, a, null, e, n, f, hv)),
        (l[Zu] = t.current),
        Qc(l),
        new ni(t)
      );
    }),
    (Ee.hydrateRoot = function (l, t, u) {
      if (!N(l)) throw Error(m(299));
      var a = !1,
        e = "",
        n = Ts,
        f = As,
        c = _s,
        i = null;
      return (
        u != null &&
          (u.unstable_strictMode === !0 && (a = !0),
          u.identifierPrefix !== void 0 && (e = u.identifierPrefix),
          u.onUncaughtError !== void 0 && (n = u.onUncaughtError),
          u.onCaughtError !== void 0 && (f = u.onCaughtError),
          u.onRecoverableError !== void 0 && (c = u.onRecoverableError),
          u.formState !== void 0 && (i = u.formState)),
        (t = av(l, 1, !0, t, u ?? null, a, e, i, n, f, c, hv)),
        (t.context = ev(null)),
        (u = t.current),
        (a = ct()),
        (a = Wn(a)),
        (e = eu(a)),
        (e.callback = null),
        nu(u, e, a),
        (u = a),
        (t.current.lanes = u),
        Na(t, u),
        Ut(t),
        (l[Zu] = t.current),
        Qc(l),
        new Xn(t)
      );
    }),
    (Ee.version = "19.2.4"),
    Ee
  );
}
var Ov;
function f1() {
  if (Ov) return ii.exports;
  Ov = 1;
  function T() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(T);
      } catch (R) {
        console.error(R);
      }
  }
  return (T(), (ii.exports = n1()), ii.exports);
}
var c1 = f1();
function i1() {
  const [T, R] = Fl.useState(null);
  Fl.useEffect(() => {
    function m(N) {
      const C = N.data;
      C.type === "ORIGIN_INIT"
        ? R(C.context)
        : C.type === "ORIGIN_THEME_CHANGE"
          ? R((Z) => Z && { ...Z, theme: C.theme })
          : C.type === "ORIGIN_CONFIG_UPDATE" &&
            R((Z) => Z && { ...Z, config: C.config });
    }
    return (
      window.addEventListener("message", m),
      window.parent.postMessage({ type: "ORIGIN_READY" }, "*"),
      () => window.removeEventListener("message", m)
    );
  }, []);
  const G = Fl.useCallback((m) => {
    window.parent.postMessage({ type: "ORIGIN_CONFIG_SET", patch: m }, "*");
  }, []);
  return T ? { ...T, setConfig: G } : null;
}
function s1(T, R) {
  return (
    Fl.useEffect(() => {
      window.parent.postMessage(
        { type: "ORIGIN_BUS_SUBSCRIBE", channel: T },
        "*",
      );
      function m(N) {
        const C = N.data;
        C.type === "ORIGIN_BUS_EVENT" && C.channel;
      }
      return (
        window.addEventListener("message", m),
        () => {
          (window.removeEventListener("message", m),
            window.parent.postMessage(
              { type: "ORIGIN_BUS_UNSUBSCRIBE", channel: T },
              "*",
            ));
        }
      );
    }, [T, R]),
    Fl.useCallback(
      (m) => {
        window.parent.postMessage(
          { type: "ORIGIN_BUS_PUBLISH", channel: T, payload: m },
          "*",
        );
      },
      [T],
    )
  );
}
function Ma(T, R) {
  return new Promise((G, m) => {
    const N = crypto.randomUUID();
    function C(Z) {
      const tl = Z.data;
      tl.type === "ORIGIN_INVOKE_RESULT" && tl.id === N
        ? (window.removeEventListener("message", C), G(tl.result))
        : tl.type === "ORIGIN_INVOKE_ERROR" &&
          tl.id === N &&
          (window.removeEventListener("message", C), m(new Error(tl.error)));
    }
    (window.addEventListener("message", C),
      window.parent.postMessage(
        { type: "ORIGIN_INVOKE", id: N, command: T, args: R ?? {} },
        "*",
      ));
  });
}
function y1(T) {
  return Ma("plugin:fs|read_text_file", { path: T });
}
function v1(T, R) {
  return Ma("plugin:fs|write_text_file", { path: T, contents: R });
}
function m1(T) {
  return Ma("plugin:fs|read_dir", { path: T });
}
function d1(T) {
  return Ma("plugin:dialog|open", T ?? {});
}
const mi = { id: "com.origin.filetree" };
function di(T, R) {
  const G = T.includes("\\") ? "\\" : "/";
  return `${T.endsWith("/") || T.endsWith("\\") ? T.slice(0, -1) : T}${G}${R}`;
}
function h1(T) {
  if (T.isDirectory) return "📁";
  const R = T.name.split(".").pop()?.toLowerCase() ?? "";
  return R === "ts" || R === "tsx"
    ? "📄"
    : R === "json"
      ? "{}"
      : R === "md"
        ? "📝"
        : "📄";
}
async function Mv(T) {
  return (await m1(T))
    .map((m) => ({
      name: m.name,
      path: di(T, m.name),
      isDirectory: m.isDirectory,
    }))
    .sort((m, N) =>
      m.isDirectory !== N.isDirectory
        ? m.isDirectory
          ? -1
          : 1
        : m.name.localeCompare(N.name),
    );
}
function pv(T, R, G) {
  return T.map((m) =>
    m.path === R
      ? { ...m, children: G }
      : m.children
        ? { ...m, children: pv(m.children, R, G) }
        : m,
  );
}
function Dv({
  node: T,
  depth: R,
  expandedPaths: G,
  onToggle: m,
  onFileClick: N,
}) {
  const C = G.has(T.path),
    Z = T.isDirectory ? (C ? "📂" : "📁") : h1(T);
  function tl() {
    T.isDirectory ? m(T) : N(T);
  }
  return Xl.jsxs("div", {
    children: [
      Xl.jsxs("div", {
        onClick: tl,
        className:
          "flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 text-xs hover:bg-white/10",
        style: { paddingLeft: `${4 + R * 14}px` },
        children: [
          Xl.jsx("span", { className: "shrink-0 select-none", children: Z }),
          Xl.jsx("span", {
            className: "truncate opacity-90",
            children: T.name,
          }),
        ],
      }),
      T.isDirectory &&
        C &&
        T.children?.map((p) =>
          Xl.jsx(
            Dv,
            {
              node: p,
              depth: R + 1,
              expandedPaths: G,
              onToggle: m,
              onFileClick: N,
            },
            p.path,
          ),
        ),
    ],
  });
}
function o1() {
  const T = i1(),
    [R, G] = Fl.useState(null),
    [m, N] = Fl.useState([]),
    [C, Z] = Fl.useState(new Set()),
    tl = s1("origin:workspace/active-path"),
    p = T ? di(T.workspacePath, "filetree") : null,
    A = T && p ? di(p, `${T.cardId}.json`) : null;
  (Fl.useEffect(() => {
    A &&
      (async () => {
        try {
          if (await Ma("plugin:fs|exists", { path: A })) {
            const ol = await y1(A),
              Dl = JSON.parse(ol);
            Dl.rootPath && G(Dl.rootPath);
          }
        } catch {}
      })();
  }, [A]),
    Fl.useEffect(() => {
      R &&
        (Mv(R)
          .then(N)
          .catch(() => N([])),
        Z(new Set()));
    }, [R]));
  const k = Fl.useCallback(async () => {
      const F = await d1({ directory: !0 });
      if (F && (G(F), p && A))
        try {
          (await Ma("plugin:fs|mkdir", { path: p, options: { recursive: !0 } }),
            await v1(A, JSON.stringify({ rootPath: F })));
        } catch {}
    }, [p, A]),
    B = Fl.useCallback(
      async (F) => {
        if (C.has(F.path)) {
          (Z((ol) => {
            const Dl = new Set(ol);
            return (Dl.delete(F.path), Dl);
          }),
            tl({ path: F.path, type: "directory", source: mi.id }));
          return;
        }
        if (!F.children)
          try {
            const ol = await Mv(F.path);
            N((Dl) => pv(Dl, F.path, ol));
          } catch {
            return;
          }
        (Z((ol) => new Set([...ol, F.path])),
          tl({ path: F.path, type: "directory", source: mi.id }));
      },
      [C, tl],
    ),
    vl = Fl.useCallback(
      (F) => {
        tl({ path: F.path, type: "file", source: mi.id });
      },
      [tl],
    );
  if (!T)
    return Xl.jsx("div", {
      className: "flex h-full items-center justify-center text-xs opacity-40",
      children: "Connecting…",
    });
  const ql = T.theme === "dark";
  return Xl.jsxs("div", {
    className: `flex h-full flex-col font-mono text-sm ${ql ? "text-zinc-100" : "text-zinc-900"}`,
    children: [
      Xl.jsxs("div", {
        className: `flex shrink-0 items-center gap-2 border-b px-3 py-2 ${ql ? "border-zinc-700" : "border-zinc-200"}`,
        children: [
          Xl.jsx("span", {
            className: "truncate text-xs opacity-60",
            children: R ? R.split(/[\\/]/).pop() || R : "No folder open",
          }),
          Xl.jsx("button", {
            onClick: k,
            className:
              "ml-auto shrink-0 rounded px-2 py-0.5 text-xs hover:bg-white/10",
            children: "Open",
          }),
        ],
      }),
      Xl.jsxs("div", {
        className: "min-h-0 flex-1 overflow-y-auto py-1",
        children: [
          !R &&
            Xl.jsx("p", {
              className: "px-3 py-8 text-center text-xs opacity-40",
              children: "Open a folder to browse files",
            }),
          m.map((F) =>
            Xl.jsx(
              Dv,
              {
                node: F,
                depth: 0,
                expandedPaths: C,
                onToggle: B,
                onFileClick: vl,
              },
              F.path,
            ),
          ),
        ],
      }),
    ],
  });
}
c1.createRoot(document.getElementById("root")).render(
  Xl.jsx(Fl.StrictMode, { children: Xl.jsx(o1, {}) }),
);

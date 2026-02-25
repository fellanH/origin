import { m as Ty } from "./monaco-editor-DYCCzzuR.js";
(function () {
  const v = document.createElement("link").relList;
  if (v && v.supports && v.supports("modulepreload")) return;
  for (const M of document.querySelectorAll('link[rel="modulepreload"]')) o(M);
  new MutationObserver((M) => {
    for (const _ of M)
      if (_.type === "childList")
        for (const q of _.addedNodes)
          q.tagName === "LINK" && q.rel === "modulepreload" && o(q);
  }).observe(document, { childList: !0, subtree: !0 });
  function m(M) {
    const _ = {};
    return (
      M.integrity && (_.integrity = M.integrity),
      M.referrerPolicy && (_.referrerPolicy = M.referrerPolicy),
      M.crossOrigin === "use-credentials"
        ? (_.credentials = "include")
        : M.crossOrigin === "anonymous"
          ? (_.credentials = "omit")
          : (_.credentials = "same-origin"),
      _
    );
  }
  function o(M) {
    if (M.ep) return;
    M.ep = !0;
    const _ = m(M);
    fetch(M.href, _);
  }
})();
function Oy(f) {
  return f && f.__esModule && Object.prototype.hasOwnProperty.call(f, "default")
    ? f.default
    : f;
}
var gf = { exports: {} },
  Ta = {};
var Rd;
function Ay() {
  if (Rd) return Ta;
  Rd = 1;
  var f = Symbol.for("react.transitional.element"),
    v = Symbol.for("react.fragment");
  function m(o, M, _) {
    var q = null;
    if (
      (_ !== void 0 && (q = "" + _),
      M.key !== void 0 && (q = "" + M.key),
      "key" in M)
    ) {
      _ = {};
      for (var x in M) x !== "key" && (_[x] = M[x]);
    } else _ = M;
    return (
      (M = _.ref),
      { $$typeof: f, type: o, key: q, ref: M !== void 0 ? M : null, props: _ }
    );
  }
  return ((Ta.Fragment = v), (Ta.jsx = m), (Ta.jsxs = m), Ta);
}
var Hd;
function My() {
  return (Hd || ((Hd = 1), (gf.exports = Ay())), gf.exports);
}
var jt = My(),
  Sf = { exports: {} },
  Z = {};
var Cd;
function _y() {
  if (Cd) return Z;
  Cd = 1;
  var f = Symbol.for("react.transitional.element"),
    v = Symbol.for("react.portal"),
    m = Symbol.for("react.fragment"),
    o = Symbol.for("react.strict_mode"),
    M = Symbol.for("react.profiler"),
    _ = Symbol.for("react.consumer"),
    q = Symbol.for("react.context"),
    x = Symbol.for("react.forward_ref"),
    D = Symbol.for("react.suspense"),
    z = Symbol.for("react.memo"),
    L = Symbol.for("react.lazy"),
    C = Symbol.for("react.activity"),
    il = Symbol.iterator;
  function jl(s) {
    return s === null || typeof s != "object"
      ? null
      : ((s = (il && s[il]) || s["@@iterator"]),
        typeof s == "function" ? s : null);
  }
  var Dl = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    cl = Object.assign,
    xl = {};
  function ql(s, T, N) {
    ((this.props = s),
      (this.context = T),
      (this.refs = xl),
      (this.updater = N || Dl));
  }
  ((ql.prototype.isReactComponent = {}),
    (ql.prototype.setState = function (s, T) {
      if (typeof s != "object" && typeof s != "function" && s != null)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables.",
        );
      this.updater.enqueueSetState(this, s, T, "setState");
    }),
    (ql.prototype.forceUpdate = function (s) {
      this.updater.enqueueForceUpdate(this, s, "forceUpdate");
    }));
  function El() {}
  El.prototype = ql.prototype;
  function zl(s, T, N) {
    ((this.props = s),
      (this.context = T),
      (this.refs = xl),
      (this.updater = N || Dl));
  }
  var Gl = (zl.prototype = new El());
  ((Gl.constructor = zl), cl(Gl, ql.prototype), (Gl.isPureReactComponent = !0));
  var dl = Array.isArray;
  function ul() {}
  var B = { H: null, A: null, T: null, S: null },
    Ul = Object.prototype.hasOwnProperty;
  function gl(s, T, N) {
    var R = N.ref;
    return {
      $$typeof: f,
      type: s,
      key: T,
      ref: R !== void 0 ? R : null,
      props: N,
    };
  }
  function ll(s, T) {
    return gl(s.type, T, s.props);
  }
  function Zl(s) {
    return typeof s == "object" && s !== null && s.$$typeof === f;
  }
  function Bl(s) {
    var T = { "=": "=0", ":": "=2" };
    return (
      "$" +
      s.replace(/[=:]/g, function (N) {
        return T[N];
      })
    );
  }
  var ht = /\/+/g;
  function $l(s, T) {
    return typeof s == "object" && s !== null && s.key != null
      ? Bl("" + s.key)
      : T.toString(36);
  }
  function F(s) {
    switch (s.status) {
      case "fulfilled":
        return s.value;
      case "rejected":
        throw s.reason;
      default:
        switch (
          (typeof s.status == "string"
            ? s.then(ul, ul)
            : ((s.status = "pending"),
              s.then(
                function (T) {
                  s.status === "pending" &&
                    ((s.status = "fulfilled"), (s.value = T));
                },
                function (T) {
                  s.status === "pending" &&
                    ((s.status = "rejected"), (s.reason = T));
                },
              )),
          s.status)
        ) {
          case "fulfilled":
            return s.value;
          case "rejected":
            throw s.reason;
        }
    }
    throw s;
  }
  function p(s, T, N, R, V) {
    var w = typeof s;
    (w === "undefined" || w === "boolean") && (s = null);
    var fl = !1;
    if (s === null) fl = !0;
    else
      switch (w) {
        case "bigint":
        case "string":
        case "number":
          fl = !0;
          break;
        case "object":
          switch (s.$$typeof) {
            case f:
            case v:
              fl = !0;
              break;
            case L:
              return ((fl = s._init), p(fl(s._payload), T, N, R, V));
          }
      }
    if (fl)
      return (
        (V = V(s)),
        (fl = R === "" ? "." + $l(s, 0) : R),
        dl(V)
          ? ((N = ""),
            fl != null && (N = fl.replace(ht, "$&/") + "/"),
            p(V, T, N, "", function (Nu) {
              return Nu;
            }))
          : V != null &&
            (Zl(V) &&
              (V = ll(
                V,
                N +
                  (V.key == null || (s && s.key === V.key)
                    ? ""
                    : ("" + V.key).replace(ht, "$&/") + "/") +
                  fl,
              )),
            T.push(V)),
        1
      );
    fl = 0;
    var Fl = R === "" ? "." : R + ":";
    if (dl(s))
      for (var Al = 0; Al < s.length; Al++)
        ((R = s[Al]), (w = Fl + $l(R, Al)), (fl += p(R, T, N, w, V)));
    else if (((Al = jl(s)), typeof Al == "function"))
      for (s = Al.call(s), Al = 0; !(R = s.next()).done; )
        ((R = R.value), (w = Fl + $l(R, Al++)), (fl += p(R, T, N, w, V)));
    else if (w === "object") {
      if (typeof s.then == "function") return p(F(s), T, N, R, V);
      throw (
        (T = String(s)),
        Error(
          "Objects are not valid as a React child (found: " +
            (T === "[object Object]"
              ? "object with keys {" + Object.keys(s).join(", ") + "}"
              : T) +
            "). If you meant to render a collection of children, use an array instead.",
        )
      );
    }
    return fl;
  }
  function U(s, T, N) {
    if (s == null) return s;
    var R = [],
      V = 0;
    return (
      p(s, R, "", "", function (w) {
        return T.call(N, w, V++);
      }),
      R
    );
  }
  function G(s) {
    if (s._status === -1) {
      var T = s._result;
      ((T = T()),
        T.then(
          function (N) {
            (s._status === 0 || s._status === -1) &&
              ((s._status = 1), (s._result = N));
          },
          function (N) {
            (s._status === 0 || s._status === -1) &&
              ((s._status = 2), (s._result = N));
          },
        ),
        s._status === -1 && ((s._status = 0), (s._result = T)));
    }
    if (s._status === 1) return s._result.default;
    throw s._result;
  }
  var al =
      typeof reportError == "function"
        ? reportError
        : function (s) {
            if (
              typeof window == "object" &&
              typeof window.ErrorEvent == "function"
            ) {
              var T = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof s == "object" &&
                  s !== null &&
                  typeof s.message == "string"
                    ? String(s.message)
                    : String(s),
                error: s,
              });
              if (!window.dispatchEvent(T)) return;
            } else if (
              typeof process == "object" &&
              typeof process.emit == "function"
            ) {
              process.emit("uncaughtException", s);
              return;
            }
            console.error(s);
          },
    ol = {
      map: U,
      forEach: function (s, T, N) {
        U(
          s,
          function () {
            T.apply(this, arguments);
          },
          N,
        );
      },
      count: function (s) {
        var T = 0;
        return (
          U(s, function () {
            T++;
          }),
          T
        );
      },
      toArray: function (s) {
        return (
          U(s, function (T) {
            return T;
          }) || []
        );
      },
      only: function (s) {
        if (!Zl(s))
          throw Error(
            "React.Children.only expected to receive a single React element child.",
          );
        return s;
      },
    };
  return (
    (Z.Activity = C),
    (Z.Children = ol),
    (Z.Component = ql),
    (Z.Fragment = m),
    (Z.Profiler = M),
    (Z.PureComponent = zl),
    (Z.StrictMode = o),
    (Z.Suspense = D),
    (Z.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = B),
    (Z.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (s) {
        return B.H.useMemoCache(s);
      },
    }),
    (Z.cache = function (s) {
      return function () {
        return s.apply(null, arguments);
      };
    }),
    (Z.cacheSignal = function () {
      return null;
    }),
    (Z.cloneElement = function (s, T, N) {
      if (s == null)
        throw Error(
          "The argument must be a React element, but you passed " + s + ".",
        );
      var R = cl({}, s.props),
        V = s.key;
      if (T != null)
        for (w in (T.key !== void 0 && (V = "" + T.key), T))
          !Ul.call(T, w) ||
            w === "key" ||
            w === "__self" ||
            w === "__source" ||
            (w === "ref" && T.ref === void 0) ||
            (R[w] = T[w]);
      var w = arguments.length - 2;
      if (w === 1) R.children = N;
      else if (1 < w) {
        for (var fl = Array(w), Fl = 0; Fl < w; Fl++)
          fl[Fl] = arguments[Fl + 2];
        R.children = fl;
      }
      return gl(s.type, V, R);
    }),
    (Z.createContext = function (s) {
      return (
        (s = {
          $$typeof: q,
          _currentValue: s,
          _currentValue2: s,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (s.Provider = s),
        (s.Consumer = { $$typeof: _, _context: s }),
        s
      );
    }),
    (Z.createElement = function (s, T, N) {
      var R,
        V = {},
        w = null;
      if (T != null)
        for (R in (T.key !== void 0 && (w = "" + T.key), T))
          Ul.call(T, R) &&
            R !== "key" &&
            R !== "__self" &&
            R !== "__source" &&
            (V[R] = T[R]);
      var fl = arguments.length - 2;
      if (fl === 1) V.children = N;
      else if (1 < fl) {
        for (var Fl = Array(fl), Al = 0; Al < fl; Al++)
          Fl[Al] = arguments[Al + 2];
        V.children = Fl;
      }
      if (s && s.defaultProps)
        for (R in ((fl = s.defaultProps), fl))
          V[R] === void 0 && (V[R] = fl[R]);
      return gl(s, w, V);
    }),
    (Z.createRef = function () {
      return { current: null };
    }),
    (Z.forwardRef = function (s) {
      return { $$typeof: x, render: s };
    }),
    (Z.isValidElement = Zl),
    (Z.lazy = function (s) {
      return { $$typeof: L, _payload: { _status: -1, _result: s }, _init: G };
    }),
    (Z.memo = function (s, T) {
      return { $$typeof: z, type: s, compare: T === void 0 ? null : T };
    }),
    (Z.startTransition = function (s) {
      var T = B.T,
        N = {};
      B.T = N;
      try {
        var R = s(),
          V = B.S;
        (V !== null && V(N, R),
          typeof R == "object" &&
            R !== null &&
            typeof R.then == "function" &&
            R.then(ul, al));
      } catch (w) {
        al(w);
      } finally {
        (T !== null && N.types !== null && (T.types = N.types), (B.T = T));
      }
    }),
    (Z.unstable_useCacheRefresh = function () {
      return B.H.useCacheRefresh();
    }),
    (Z.use = function (s) {
      return B.H.use(s);
    }),
    (Z.useActionState = function (s, T, N) {
      return B.H.useActionState(s, T, N);
    }),
    (Z.useCallback = function (s, T) {
      return B.H.useCallback(s, T);
    }),
    (Z.useContext = function (s) {
      return B.H.useContext(s);
    }),
    (Z.useDebugValue = function () {}),
    (Z.useDeferredValue = function (s, T) {
      return B.H.useDeferredValue(s, T);
    }),
    (Z.useEffect = function (s, T) {
      return B.H.useEffect(s, T);
    }),
    (Z.useEffectEvent = function (s) {
      return B.H.useEffectEvent(s);
    }),
    (Z.useId = function () {
      return B.H.useId();
    }),
    (Z.useImperativeHandle = function (s, T, N) {
      return B.H.useImperativeHandle(s, T, N);
    }),
    (Z.useInsertionEffect = function (s, T) {
      return B.H.useInsertionEffect(s, T);
    }),
    (Z.useLayoutEffect = function (s, T) {
      return B.H.useLayoutEffect(s, T);
    }),
    (Z.useMemo = function (s, T) {
      return B.H.useMemo(s, T);
    }),
    (Z.useOptimistic = function (s, T) {
      return B.H.useOptimistic(s, T);
    }),
    (Z.useReducer = function (s, T, N) {
      return B.H.useReducer(s, T, N);
    }),
    (Z.useRef = function (s) {
      return B.H.useRef(s);
    }),
    (Z.useState = function (s) {
      return B.H.useState(s);
    }),
    (Z.useSyncExternalStore = function (s, T, N) {
      return B.H.useSyncExternalStore(s, T, N);
    }),
    (Z.useTransition = function () {
      return B.H.useTransition();
    }),
    (Z.version = "19.2.4"),
    Z
  );
}
var jd;
function Mf() {
  return (jd || ((jd = 1), (Sf.exports = _y())), Sf.exports);
}
var Q = Mf();
const Uu = Oy(Q);
var bf = { exports: {} },
  Oa = {},
  pf = { exports: {} },
  Ef = {};
var qd;
function Dy() {
  return (
    qd ||
      ((qd = 1),
      (function (f) {
        function v(p, U) {
          var G = p.length;
          p.push(U);
          l: for (; 0 < G; ) {
            var al = (G - 1) >>> 1,
              ol = p[al];
            if (0 < M(ol, U)) ((p[al] = U), (p[G] = ol), (G = al));
            else break l;
          }
        }
        function m(p) {
          return p.length === 0 ? null : p[0];
        }
        function o(p) {
          if (p.length === 0) return null;
          var U = p[0],
            G = p.pop();
          if (G !== U) {
            p[0] = G;
            l: for (var al = 0, ol = p.length, s = ol >>> 1; al < s; ) {
              var T = 2 * (al + 1) - 1,
                N = p[T],
                R = T + 1,
                V = p[R];
              if (0 > M(N, G))
                R < ol && 0 > M(V, N)
                  ? ((p[al] = V), (p[R] = G), (al = R))
                  : ((p[al] = N), (p[T] = G), (al = T));
              else if (R < ol && 0 > M(V, G))
                ((p[al] = V), (p[R] = G), (al = R));
              else break l;
            }
          }
          return U;
        }
        function M(p, U) {
          var G = p.sortIndex - U.sortIndex;
          return G !== 0 ? G : p.id - U.id;
        }
        if (
          ((f.unstable_now = void 0),
          typeof performance == "object" &&
            typeof performance.now == "function")
        ) {
          var _ = performance;
          f.unstable_now = function () {
            return _.now();
          };
        } else {
          var q = Date,
            x = q.now();
          f.unstable_now = function () {
            return q.now() - x;
          };
        }
        var D = [],
          z = [],
          L = 1,
          C = null,
          il = 3,
          jl = !1,
          Dl = !1,
          cl = !1,
          xl = !1,
          ql = typeof setTimeout == "function" ? setTimeout : null,
          El = typeof clearTimeout == "function" ? clearTimeout : null,
          zl = typeof setImmediate < "u" ? setImmediate : null;
        function Gl(p) {
          for (var U = m(z); U !== null; ) {
            if (U.callback === null) o(z);
            else if (U.startTime <= p)
              (o(z), (U.sortIndex = U.expirationTime), v(D, U));
            else break;
            U = m(z);
          }
        }
        function dl(p) {
          if (((cl = !1), Gl(p), !Dl))
            if (m(D) !== null) ((Dl = !0), ul || ((ul = !0), Bl()));
            else {
              var U = m(z);
              U !== null && F(dl, U.startTime - p);
            }
        }
        var ul = !1,
          B = -1,
          Ul = 5,
          gl = -1;
        function ll() {
          return xl ? !0 : !(f.unstable_now() - gl < Ul);
        }
        function Zl() {
          if (((xl = !1), ul)) {
            var p = f.unstable_now();
            gl = p;
            var U = !0;
            try {
              l: {
                ((Dl = !1), cl && ((cl = !1), El(B), (B = -1)), (jl = !0));
                var G = il;
                try {
                  t: {
                    for (
                      Gl(p), C = m(D);
                      C !== null && !(C.expirationTime > p && ll());
                    ) {
                      var al = C.callback;
                      if (typeof al == "function") {
                        ((C.callback = null), (il = C.priorityLevel));
                        var ol = al(C.expirationTime <= p);
                        if (((p = f.unstable_now()), typeof ol == "function")) {
                          ((C.callback = ol), Gl(p), (U = !0));
                          break t;
                        }
                        (C === m(D) && o(D), Gl(p));
                      } else o(D);
                      C = m(D);
                    }
                    if (C !== null) U = !0;
                    else {
                      var s = m(z);
                      (s !== null && F(dl, s.startTime - p), (U = !1));
                    }
                  }
                  break l;
                } finally {
                  ((C = null), (il = G), (jl = !1));
                }
                U = void 0;
              }
            } finally {
              U ? Bl() : (ul = !1);
            }
          }
        }
        var Bl;
        if (typeof zl == "function")
          Bl = function () {
            zl(Zl);
          };
        else if (typeof MessageChannel < "u") {
          var ht = new MessageChannel(),
            $l = ht.port2;
          ((ht.port1.onmessage = Zl),
            (Bl = function () {
              $l.postMessage(null);
            }));
        } else
          Bl = function () {
            ql(Zl, 0);
          };
        function F(p, U) {
          B = ql(function () {
            p(f.unstable_now());
          }, U);
        }
        ((f.unstable_IdlePriority = 5),
          (f.unstable_ImmediatePriority = 1),
          (f.unstable_LowPriority = 4),
          (f.unstable_NormalPriority = 3),
          (f.unstable_Profiling = null),
          (f.unstable_UserBlockingPriority = 2),
          (f.unstable_cancelCallback = function (p) {
            p.callback = null;
          }),
          (f.unstable_forceFrameRate = function (p) {
            0 > p || 125 < p
              ? console.error(
                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
                )
              : (Ul = 0 < p ? Math.floor(1e3 / p) : 5);
          }),
          (f.unstable_getCurrentPriorityLevel = function () {
            return il;
          }),
          (f.unstable_next = function (p) {
            switch (il) {
              case 1:
              case 2:
              case 3:
                var U = 3;
                break;
              default:
                U = il;
            }
            var G = il;
            il = U;
            try {
              return p();
            } finally {
              il = G;
            }
          }),
          (f.unstable_requestPaint = function () {
            xl = !0;
          }),
          (f.unstable_runWithPriority = function (p, U) {
            switch (p) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                p = 3;
            }
            var G = il;
            il = p;
            try {
              return U();
            } finally {
              il = G;
            }
          }),
          (f.unstable_scheduleCallback = function (p, U, G) {
            var al = f.unstable_now();
            switch (
              (typeof G == "object" && G !== null
                ? ((G = G.delay),
                  (G = typeof G == "number" && 0 < G ? al + G : al))
                : (G = al),
              p)
            ) {
              case 1:
                var ol = -1;
                break;
              case 2:
                ol = 250;
                break;
              case 5:
                ol = 1073741823;
                break;
              case 4:
                ol = 1e4;
                break;
              default:
                ol = 5e3;
            }
            return (
              (ol = G + ol),
              (p = {
                id: L++,
                callback: U,
                priorityLevel: p,
                startTime: G,
                expirationTime: ol,
                sortIndex: -1,
              }),
              G > al
                ? ((p.sortIndex = G),
                  v(z, p),
                  m(D) === null &&
                    p === m(z) &&
                    (cl ? (El(B), (B = -1)) : (cl = !0), F(dl, G - al)))
                : ((p.sortIndex = ol),
                  v(D, p),
                  Dl || jl || ((Dl = !0), ul || ((ul = !0), Bl()))),
              p
            );
          }),
          (f.unstable_shouldYield = ll),
          (f.unstable_wrapCallback = function (p) {
            var U = il;
            return function () {
              var G = il;
              il = U;
              try {
                return p.apply(this, arguments);
              } finally {
                il = G;
              }
            };
          }));
      })(Ef)),
    Ef
  );
}
var Bd;
function Uy() {
  return (Bd || ((Bd = 1), (pf.exports = Dy())), pf.exports);
}
var zf = { exports: {} },
  Wl = {};
var Yd;
function Ny() {
  if (Yd) return Wl;
  Yd = 1;
  var f = Mf();
  function v(D) {
    var z = "https://react.dev/errors/" + D;
    if (1 < arguments.length) {
      z += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var L = 2; L < arguments.length; L++)
        z += "&args[]=" + encodeURIComponent(arguments[L]);
    }
    return (
      "Minified React error #" +
      D +
      "; visit " +
      z +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function m() {}
  var o = {
      d: {
        f: m,
        r: function () {
          throw Error(v(522));
        },
        D: m,
        C: m,
        L: m,
        m,
        X: m,
        S: m,
        M: m,
      },
      p: 0,
      findDOMNode: null,
    },
    M = Symbol.for("react.portal");
  function _(D, z, L) {
    var C =
      3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: M,
      key: C == null ? null : "" + C,
      children: D,
      containerInfo: z,
      implementation: L,
    };
  }
  var q = f.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function x(D, z) {
    if (D === "font") return "";
    if (typeof z == "string") return z === "use-credentials" ? z : "";
  }
  return (
    (Wl.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o),
    (Wl.createPortal = function (D, z) {
      var L =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!z || (z.nodeType !== 1 && z.nodeType !== 9 && z.nodeType !== 11))
        throw Error(v(299));
      return _(D, z, null, L);
    }),
    (Wl.flushSync = function (D) {
      var z = q.T,
        L = o.p;
      try {
        if (((q.T = null), (o.p = 2), D)) return D();
      } finally {
        ((q.T = z), (o.p = L), o.d.f());
      }
    }),
    (Wl.preconnect = function (D, z) {
      typeof D == "string" &&
        (z
          ? ((z = z.crossOrigin),
            (z =
              typeof z == "string"
                ? z === "use-credentials"
                  ? z
                  : ""
                : void 0))
          : (z = null),
        o.d.C(D, z));
    }),
    (Wl.prefetchDNS = function (D) {
      typeof D == "string" && o.d.D(D);
    }),
    (Wl.preinit = function (D, z) {
      if (typeof D == "string" && z && typeof z.as == "string") {
        var L = z.as,
          C = x(L, z.crossOrigin),
          il = typeof z.integrity == "string" ? z.integrity : void 0,
          jl = typeof z.fetchPriority == "string" ? z.fetchPriority : void 0;
        L === "style"
          ? o.d.S(D, typeof z.precedence == "string" ? z.precedence : void 0, {
              crossOrigin: C,
              integrity: il,
              fetchPriority: jl,
            })
          : L === "script" &&
            o.d.X(D, {
              crossOrigin: C,
              integrity: il,
              fetchPriority: jl,
              nonce: typeof z.nonce == "string" ? z.nonce : void 0,
            });
      }
    }),
    (Wl.preinitModule = function (D, z) {
      if (typeof D == "string")
        if (typeof z == "object" && z !== null) {
          if (z.as == null || z.as === "script") {
            var L = x(z.as, z.crossOrigin);
            o.d.M(D, {
              crossOrigin: L,
              integrity: typeof z.integrity == "string" ? z.integrity : void 0,
              nonce: typeof z.nonce == "string" ? z.nonce : void 0,
            });
          }
        } else z == null && o.d.M(D);
    }),
    (Wl.preload = function (D, z) {
      if (
        typeof D == "string" &&
        typeof z == "object" &&
        z !== null &&
        typeof z.as == "string"
      ) {
        var L = z.as,
          C = x(L, z.crossOrigin);
        o.d.L(D, L, {
          crossOrigin: C,
          integrity: typeof z.integrity == "string" ? z.integrity : void 0,
          nonce: typeof z.nonce == "string" ? z.nonce : void 0,
          type: typeof z.type == "string" ? z.type : void 0,
          fetchPriority:
            typeof z.fetchPriority == "string" ? z.fetchPriority : void 0,
          referrerPolicy:
            typeof z.referrerPolicy == "string" ? z.referrerPolicy : void 0,
          imageSrcSet:
            typeof z.imageSrcSet == "string" ? z.imageSrcSet : void 0,
          imageSizes: typeof z.imageSizes == "string" ? z.imageSizes : void 0,
          media: typeof z.media == "string" ? z.media : void 0,
        });
      }
    }),
    (Wl.preloadModule = function (D, z) {
      if (typeof D == "string")
        if (z) {
          var L = x(z.as, z.crossOrigin);
          o.d.m(D, {
            as: typeof z.as == "string" && z.as !== "script" ? z.as : void 0,
            crossOrigin: L,
            integrity: typeof z.integrity == "string" ? z.integrity : void 0,
          });
        } else o.d.m(D);
    }),
    (Wl.requestFormReset = function (D) {
      o.d.r(D);
    }),
    (Wl.unstable_batchedUpdates = function (D, z) {
      return D(z);
    }),
    (Wl.useFormState = function (D, z, L) {
      return q.H.useFormState(D, z, L);
    }),
    (Wl.useFormStatus = function () {
      return q.H.useHostTransitionStatus();
    }),
    (Wl.version = "19.2.4"),
    Wl
  );
}
var Gd;
function Ry() {
  if (Gd) return zf.exports;
  Gd = 1;
  function f() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(f);
      } catch (v) {
        console.error(v);
      }
  }
  return (f(), (zf.exports = Ny()), zf.exports);
}
var Xd;
function Hy() {
  if (Xd) return Oa;
  Xd = 1;
  var f = Uy(),
    v = Mf(),
    m = Ry();
  function o(l) {
    var t = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var e = 2; e < arguments.length; e++)
        t += "&args[]=" + encodeURIComponent(arguments[e]);
    }
    return (
      "Minified React error #" +
      l +
      "; visit " +
      t +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function M(l) {
    return !(!l || (l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11));
  }
  function _(l) {
    var t = l,
      e = l;
    if (l.alternate) for (; t.return; ) t = t.return;
    else {
      l = t;
      do ((t = l), (t.flags & 4098) !== 0 && (e = t.return), (l = t.return));
      while (l);
    }
    return t.tag === 3 ? e : null;
  }
  function q(l) {
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
  function x(l) {
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
  function D(l) {
    if (_(l) !== l) throw Error(o(188));
  }
  function z(l) {
    var t = l.alternate;
    if (!t) {
      if (((t = _(l)), t === null)) throw Error(o(188));
      return t !== l ? null : l;
    }
    for (var e = l, u = t; ; ) {
      var a = e.return;
      if (a === null) break;
      var n = a.alternate;
      if (n === null) {
        if (((u = a.return), u !== null)) {
          e = u;
          continue;
        }
        break;
      }
      if (a.child === n.child) {
        for (n = a.child; n; ) {
          if (n === e) return (D(a), l);
          if (n === u) return (D(a), t);
          n = n.sibling;
        }
        throw Error(o(188));
      }
      if (e.return !== u.return) ((e = a), (u = n));
      else {
        for (var i = !1, c = a.child; c; ) {
          if (c === e) {
            ((i = !0), (e = a), (u = n));
            break;
          }
          if (c === u) {
            ((i = !0), (u = a), (e = n));
            break;
          }
          c = c.sibling;
        }
        if (!i) {
          for (c = n.child; c; ) {
            if (c === e) {
              ((i = !0), (e = n), (u = a));
              break;
            }
            if (c === u) {
              ((i = !0), (u = n), (e = a));
              break;
            }
            c = c.sibling;
          }
          if (!i) throw Error(o(189));
        }
      }
      if (e.alternate !== u) throw Error(o(190));
    }
    if (e.tag !== 3) throw Error(o(188));
    return e.stateNode.current === e ? l : t;
  }
  function L(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l;
    for (l = l.child; l !== null; ) {
      if (((t = L(l)), t !== null)) return t;
      l = l.sibling;
    }
    return null;
  }
  var C = Object.assign,
    il = Symbol.for("react.element"),
    jl = Symbol.for("react.transitional.element"),
    Dl = Symbol.for("react.portal"),
    cl = Symbol.for("react.fragment"),
    xl = Symbol.for("react.strict_mode"),
    ql = Symbol.for("react.profiler"),
    El = Symbol.for("react.consumer"),
    zl = Symbol.for("react.context"),
    Gl = Symbol.for("react.forward_ref"),
    dl = Symbol.for("react.suspense"),
    ul = Symbol.for("react.suspense_list"),
    B = Symbol.for("react.memo"),
    Ul = Symbol.for("react.lazy"),
    gl = Symbol.for("react.activity"),
    ll = Symbol.for("react.memo_cache_sentinel"),
    Zl = Symbol.iterator;
  function Bl(l) {
    return l === null || typeof l != "object"
      ? null
      : ((l = (Zl && l[Zl]) || l["@@iterator"]),
        typeof l == "function" ? l : null);
  }
  var ht = Symbol.for("react.client.reference");
  function $l(l) {
    if (l == null) return null;
    if (typeof l == "function")
      return l.$$typeof === ht ? null : l.displayName || l.name || null;
    if (typeof l == "string") return l;
    switch (l) {
      case cl:
        return "Fragment";
      case ql:
        return "Profiler";
      case xl:
        return "StrictMode";
      case dl:
        return "Suspense";
      case ul:
        return "SuspenseList";
      case gl:
        return "Activity";
    }
    if (typeof l == "object")
      switch (l.$$typeof) {
        case Dl:
          return "Portal";
        case zl:
          return l.displayName || "Context";
        case El:
          return (l._context.displayName || "Context") + ".Consumer";
        case Gl:
          var t = l.render;
          return (
            (l = l.displayName),
            l ||
              ((l = t.displayName || t.name || ""),
              (l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef")),
            l
          );
        case B:
          return (
            (t = l.displayName || null),
            t !== null ? t : $l(l.type) || "Memo"
          );
        case Ul:
          ((t = l._payload), (l = l._init));
          try {
            return $l(l(t));
          } catch {}
      }
    return null;
  }
  var F = Array.isArray,
    p = v.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    U = m.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    G = { pending: !1, data: null, method: null, action: null },
    al = [],
    ol = -1;
  function s(l) {
    return { current: l };
  }
  function T(l) {
    0 > ol || ((l.current = al[ol]), (al[ol] = null), ol--);
  }
  function N(l, t) {
    (ol++, (al[ol] = l.current), (l.current = t));
  }
  var R = s(null),
    V = s(null),
    w = s(null),
    fl = s(null);
  function Fl(l, t) {
    switch ((N(w, t), N(V, l), N(R, null), t.nodeType)) {
      case 9:
      case 11:
        l = (l = t.documentElement) && (l = l.namespaceURI) ? ld(l) : 0;
        break;
      default:
        if (((l = t.tagName), (t = t.namespaceURI)))
          ((t = ld(t)), (l = td(t, l)));
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
    (T(R), N(R, l));
  }
  function Al() {
    (T(R), T(V), T(w));
  }
  function Nu(l) {
    l.memoizedState !== null && N(fl, l);
    var t = R.current,
      e = td(t, l.type);
    t !== e && (N(V, l), N(R, e));
  }
  function Ua(l) {
    (V.current === l && (T(R), T(V)),
      fl.current === l && (T(fl), (ba._currentValue = G)));
  }
  var In, Uf;
  function Ae(l) {
    if (In === void 0)
      try {
        throw Error();
      } catch (e) {
        var t = e.stack.trim().match(/\n( *(at )?)/);
        ((In = (t && t[1]) || ""),
          (Uf =
            -1 <
            e.stack.indexOf(`
    at`)
              ? " (<anonymous>)"
              : -1 < e.stack.indexOf("@")
                ? "@unknown:0:0"
                : ""));
      }
    return (
      `
` +
      In +
      l +
      Uf
    );
  }
  var Pn = !1;
  function li(l, t) {
    if (!l || Pn) return "";
    Pn = !0;
    var e = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var u = {
        DetermineComponentFrameRoot: function () {
          try {
            if (t) {
              var A = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(A.prototype, "props", {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == "object" && Reflect.construct)
              ) {
                try {
                  Reflect.construct(A, []);
                } catch (b) {
                  var S = b;
                }
                Reflect.construct(l, [], A);
              } else {
                try {
                  A.call();
                } catch (b) {
                  S = b;
                }
                l.call(A.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (b) {
                S = b;
              }
              (A = l()) &&
                typeof A.catch == "function" &&
                A.catch(function () {});
            }
          } catch (b) {
            if (b && S && typeof b.stack == "string") return [b.stack, S.stack];
          }
          return [null, null];
        },
      };
      u.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var a = Object.getOwnPropertyDescriptor(
        u.DetermineComponentFrameRoot,
        "name",
      );
      a &&
        a.configurable &&
        Object.defineProperty(u.DetermineComponentFrameRoot, "name", {
          value: "DetermineComponentFrameRoot",
        });
      var n = u.DetermineComponentFrameRoot(),
        i = n[0],
        c = n[1];
      if (i && c) {
        var r = i.split(`
`),
          g = c.split(`
`);
        for (
          a = u = 0;
          u < r.length && !r[u].includes("DetermineComponentFrameRoot");
        )
          u++;
        for (; a < g.length && !g[a].includes("DetermineComponentFrameRoot"); )
          a++;
        if (u === r.length || a === g.length)
          for (
            u = r.length - 1, a = g.length - 1;
            1 <= u && 0 <= a && r[u] !== g[a];
          )
            a--;
        for (; 1 <= u && 0 <= a; u--, a--)
          if (r[u] !== g[a]) {
            if (u !== 1 || a !== 1)
              do
                if ((u--, a--, 0 > a || r[u] !== g[a])) {
                  var E =
                    `
` + r[u].replace(" at new ", " at ");
                  return (
                    l.displayName &&
                      E.includes("<anonymous>") &&
                      (E = E.replace("<anonymous>", l.displayName)),
                    E
                  );
                }
              while (1 <= u && 0 <= a);
            break;
          }
      }
    } finally {
      ((Pn = !1), (Error.prepareStackTrace = e));
    }
    return (e = l ? l.displayName || l.name : "") ? Ae(e) : "";
  }
  function lv(l, t) {
    switch (l.tag) {
      case 26:
      case 27:
      case 5:
        return Ae(l.type);
      case 16:
        return Ae("Lazy");
      case 13:
        return l.child !== t && t !== null
          ? Ae("Suspense Fallback")
          : Ae("Suspense");
      case 19:
        return Ae("SuspenseList");
      case 0:
      case 15:
        return li(l.type, !1);
      case 11:
        return li(l.type.render, !1);
      case 1:
        return li(l.type, !0);
      case 31:
        return Ae("Activity");
      default:
        return "";
    }
  }
  function Nf(l) {
    try {
      var t = "",
        e = null;
      do ((t += lv(l, e)), (e = l), (l = l.return));
      while (l);
      return t;
    } catch (u) {
      return (
        `
Error generating stack: ` +
        u.message +
        `
` +
        u.stack
      );
    }
  }
  var ti = Object.prototype.hasOwnProperty,
    ei = f.unstable_scheduleCallback,
    ui = f.unstable_cancelCallback,
    tv = f.unstable_shouldYield,
    ev = f.unstable_requestPaint,
    nt = f.unstable_now,
    uv = f.unstable_getCurrentPriorityLevel,
    Rf = f.unstable_ImmediatePriority,
    Hf = f.unstable_UserBlockingPriority,
    Na = f.unstable_NormalPriority,
    av = f.unstable_LowPriority,
    Cf = f.unstable_IdlePriority,
    nv = f.log,
    iv = f.unstable_setDisableYieldValue,
    Ru = null,
    it = null;
  function Pt(l) {
    if (
      (typeof nv == "function" && iv(l),
      it && typeof it.setStrictMode == "function")
    )
      try {
        it.setStrictMode(Ru, l);
      } catch {}
  }
  var ct = Math.clz32 ? Math.clz32 : ov,
    cv = Math.log,
    fv = Math.LN2;
  function ov(l) {
    return ((l >>>= 0), l === 0 ? 32 : (31 - ((cv(l) / fv) | 0)) | 0);
  }
  var Ra = 256,
    Ha = 262144,
    Ca = 4194304;
  function Me(l) {
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
  function ja(l, t, e) {
    var u = l.pendingLanes;
    if (u === 0) return 0;
    var a = 0,
      n = l.suspendedLanes,
      i = l.pingedLanes;
    l = l.warmLanes;
    var c = u & 134217727;
    return (
      c !== 0
        ? ((u = c & ~n),
          u !== 0
            ? (a = Me(u))
            : ((i &= c),
              i !== 0
                ? (a = Me(i))
                : e || ((e = c & ~l), e !== 0 && (a = Me(e)))))
        : ((c = u & ~n),
          c !== 0
            ? (a = Me(c))
            : i !== 0
              ? (a = Me(i))
              : e || ((e = u & ~l), e !== 0 && (a = Me(e)))),
      a === 0
        ? 0
        : t !== 0 &&
            t !== a &&
            (t & n) === 0 &&
            ((n = a & -a),
            (e = t & -t),
            n >= e || (n === 32 && (e & 4194048) !== 0))
          ? t
          : a
    );
  }
  function Hu(l, t) {
    return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & t) === 0;
  }
  function rv(l, t) {
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
  function jf() {
    var l = Ca;
    return ((Ca <<= 1), (Ca & 62914560) === 0 && (Ca = 4194304), l);
  }
  function ai(l) {
    for (var t = [], e = 0; 31 > e; e++) t.push(l);
    return t;
  }
  function Cu(l, t) {
    ((l.pendingLanes |= t),
      t !== 268435456 &&
        ((l.suspendedLanes = 0), (l.pingedLanes = 0), (l.warmLanes = 0)));
  }
  function sv(l, t, e, u, a, n) {
    var i = l.pendingLanes;
    ((l.pendingLanes = e),
      (l.suspendedLanes = 0),
      (l.pingedLanes = 0),
      (l.warmLanes = 0),
      (l.expiredLanes &= e),
      (l.entangledLanes &= e),
      (l.errorRecoveryDisabledLanes &= e),
      (l.shellSuspendCounter = 0));
    var c = l.entanglements,
      r = l.expirationTimes,
      g = l.hiddenUpdates;
    for (e = i & ~e; 0 < e; ) {
      var E = 31 - ct(e),
        A = 1 << E;
      ((c[E] = 0), (r[E] = -1));
      var S = g[E];
      if (S !== null)
        for (g[E] = null, E = 0; E < S.length; E++) {
          var b = S[E];
          b !== null && (b.lane &= -536870913);
        }
      e &= ~A;
    }
    (u !== 0 && qf(l, u, 0),
      n !== 0 && a === 0 && l.tag !== 0 && (l.suspendedLanes |= n & ~(i & ~t)));
  }
  function qf(l, t, e) {
    ((l.pendingLanes |= t), (l.suspendedLanes &= ~t));
    var u = 31 - ct(t);
    ((l.entangledLanes |= t),
      (l.entanglements[u] = l.entanglements[u] | 1073741824 | (e & 261930)));
  }
  function Bf(l, t) {
    var e = (l.entangledLanes |= t);
    for (l = l.entanglements; e; ) {
      var u = 31 - ct(e),
        a = 1 << u;
      ((a & t) | (l[u] & t) && (l[u] |= t), (e &= ~a));
    }
  }
  function Yf(l, t) {
    var e = t & -t;
    return (
      (e = (e & 42) !== 0 ? 1 : ni(e)),
      (e & (l.suspendedLanes | t)) !== 0 ? 0 : e
    );
  }
  function ni(l) {
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
  function ii(l) {
    return (
      (l &= -l),
      2 < l ? (8 < l ? ((l & 134217727) !== 0 ? 32 : 268435456) : 8) : 2
    );
  }
  function Gf() {
    var l = U.p;
    return l !== 0 ? l : ((l = window.event), l === void 0 ? 32 : Od(l.type));
  }
  function Xf(l, t) {
    var e = U.p;
    try {
      return ((U.p = l), t());
    } finally {
      U.p = e;
    }
  }
  var le = Math.random().toString(36).slice(2),
    Ll = "__reactFiber$" + le,
    Il = "__reactProps$" + le,
    Ve = "__reactContainer$" + le,
    ci = "__reactEvents$" + le,
    dv = "__reactListeners$" + le,
    vv = "__reactHandles$" + le,
    Qf = "__reactResources$" + le,
    ju = "__reactMarker$" + le;
  function fi(l) {
    (delete l[Ll], delete l[Il], delete l[ci], delete l[dv], delete l[vv]);
  }
  function Ke(l) {
    var t = l[Ll];
    if (t) return t;
    for (var e = l.parentNode; e; ) {
      if ((t = e[Ve] || e[Ll])) {
        if (
          ((e = t.alternate),
          t.child !== null || (e !== null && e.child !== null))
        )
          for (l = fd(l); l !== null; ) {
            if ((e = l[Ll])) return e;
            l = fd(l);
          }
        return t;
      }
      ((l = e), (e = l.parentNode));
    }
    return null;
  }
  function Je(l) {
    if ((l = l[Ll] || l[Ve])) {
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
  function qu(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l.stateNode;
    throw Error(o(33));
  }
  function we(l) {
    var t = l[Qf];
    return (
      t ||
        (t = l[Qf] =
          { hoistableStyles: new Map(), hoistableScripts: new Map() }),
      t
    );
  }
  function Xl(l) {
    l[ju] = !0;
  }
  var xf = new Set(),
    Zf = {};
  function _e(l, t) {
    (We(l, t), We(l + "Capture", t));
  }
  function We(l, t) {
    for (Zf[l] = t, l = 0; l < t.length; l++) xf.add(t[l]);
  }
  var yv = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$",
    ),
    Lf = {},
    Vf = {};
  function mv(l) {
    return ti.call(Vf, l)
      ? !0
      : ti.call(Lf, l)
        ? !1
        : yv.test(l)
          ? (Vf[l] = !0)
          : ((Lf[l] = !0), !1);
  }
  function qa(l, t, e) {
    if (mv(t))
      if (e === null) l.removeAttribute(t);
      else {
        switch (typeof e) {
          case "undefined":
          case "function":
          case "symbol":
            l.removeAttribute(t);
            return;
          case "boolean":
            var u = t.toLowerCase().slice(0, 5);
            if (u !== "data-" && u !== "aria-") {
              l.removeAttribute(t);
              return;
            }
        }
        l.setAttribute(t, "" + e);
      }
  }
  function Ba(l, t, e) {
    if (e === null) l.removeAttribute(t);
    else {
      switch (typeof e) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(t);
          return;
      }
      l.setAttribute(t, "" + e);
    }
  }
  function qt(l, t, e, u) {
    if (u === null) l.removeAttribute(e);
    else {
      switch (typeof u) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(e);
          return;
      }
      l.setAttributeNS(t, e, "" + u);
    }
  }
  function gt(l) {
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
  function Kf(l) {
    var t = l.type;
    return (
      (l = l.nodeName) &&
      l.toLowerCase() === "input" &&
      (t === "checkbox" || t === "radio")
    );
  }
  function hv(l, t, e) {
    var u = Object.getOwnPropertyDescriptor(l.constructor.prototype, t);
    if (
      !l.hasOwnProperty(t) &&
      typeof u < "u" &&
      typeof u.get == "function" &&
      typeof u.set == "function"
    ) {
      var a = u.get,
        n = u.set;
      return (
        Object.defineProperty(l, t, {
          configurable: !0,
          get: function () {
            return a.call(this);
          },
          set: function (i) {
            ((e = "" + i), n.call(this, i));
          },
        }),
        Object.defineProperty(l, t, { enumerable: u.enumerable }),
        {
          getValue: function () {
            return e;
          },
          setValue: function (i) {
            e = "" + i;
          },
          stopTracking: function () {
            ((l._valueTracker = null), delete l[t]);
          },
        }
      );
    }
  }
  function oi(l) {
    if (!l._valueTracker) {
      var t = Kf(l) ? "checked" : "value";
      l._valueTracker = hv(l, t, "" + l[t]);
    }
  }
  function Jf(l) {
    if (!l) return !1;
    var t = l._valueTracker;
    if (!t) return !0;
    var e = t.getValue(),
      u = "";
    return (
      l && (u = Kf(l) ? (l.checked ? "true" : "false") : l.value),
      (l = u),
      l !== e ? (t.setValue(l), !0) : !1
    );
  }
  function Ya(l) {
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
  var gv = /[\n"\\]/g;
  function St(l) {
    return l.replace(gv, function (t) {
      return "\\" + t.charCodeAt(0).toString(16) + " ";
    });
  }
  function ri(l, t, e, u, a, n, i, c) {
    ((l.name = ""),
      i != null &&
      typeof i != "function" &&
      typeof i != "symbol" &&
      typeof i != "boolean"
        ? (l.type = i)
        : l.removeAttribute("type"),
      t != null
        ? i === "number"
          ? ((t === 0 && l.value === "") || l.value != t) &&
            (l.value = "" + gt(t))
          : l.value !== "" + gt(t) && (l.value = "" + gt(t))
        : (i !== "submit" && i !== "reset") || l.removeAttribute("value"),
      t != null
        ? si(l, i, gt(t))
        : e != null
          ? si(l, i, gt(e))
          : u != null && l.removeAttribute("value"),
      a == null && n != null && (l.defaultChecked = !!n),
      a != null &&
        (l.checked = a && typeof a != "function" && typeof a != "symbol"),
      c != null &&
      typeof c != "function" &&
      typeof c != "symbol" &&
      typeof c != "boolean"
        ? (l.name = "" + gt(c))
        : l.removeAttribute("name"));
  }
  function wf(l, t, e, u, a, n, i, c) {
    if (
      (n != null &&
        typeof n != "function" &&
        typeof n != "symbol" &&
        typeof n != "boolean" &&
        (l.type = n),
      t != null || e != null)
    ) {
      if (!((n !== "submit" && n !== "reset") || t != null)) {
        oi(l);
        return;
      }
      ((e = e != null ? "" + gt(e) : ""),
        (t = t != null ? "" + gt(t) : e),
        c || t === l.value || (l.value = t),
        (l.defaultValue = t));
    }
    ((u = u ?? a),
      (u = typeof u != "function" && typeof u != "symbol" && !!u),
      (l.checked = c ? l.checked : !!u),
      (l.defaultChecked = !!u),
      i != null &&
        typeof i != "function" &&
        typeof i != "symbol" &&
        typeof i != "boolean" &&
        (l.name = i),
      oi(l));
  }
  function si(l, t, e) {
    (t === "number" && Ya(l.ownerDocument) === l) ||
      l.defaultValue === "" + e ||
      (l.defaultValue = "" + e);
  }
  function $e(l, t, e, u) {
    if (((l = l.options), t)) {
      t = {};
      for (var a = 0; a < e.length; a++) t["$" + e[a]] = !0;
      for (e = 0; e < l.length; e++)
        ((a = t.hasOwnProperty("$" + l[e].value)),
          l[e].selected !== a && (l[e].selected = a),
          a && u && (l[e].defaultSelected = !0));
    } else {
      for (e = "" + gt(e), t = null, a = 0; a < l.length; a++) {
        if (l[a].value === e) {
          ((l[a].selected = !0), u && (l[a].defaultSelected = !0));
          return;
        }
        t !== null || l[a].disabled || (t = l[a]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Wf(l, t, e) {
    if (
      t != null &&
      ((t = "" + gt(t)), t !== l.value && (l.value = t), e == null)
    ) {
      l.defaultValue !== t && (l.defaultValue = t);
      return;
    }
    l.defaultValue = e != null ? "" + gt(e) : "";
  }
  function $f(l, t, e, u) {
    if (t == null) {
      if (u != null) {
        if (e != null) throw Error(o(92));
        if (F(u)) {
          if (1 < u.length) throw Error(o(93));
          u = u[0];
        }
        e = u;
      }
      (e == null && (e = ""), (t = e));
    }
    ((e = gt(t)),
      (l.defaultValue = e),
      (u = l.textContent),
      u === e && u !== "" && u !== null && (l.value = u),
      oi(l));
  }
  function Fe(l, t) {
    if (t) {
      var e = l.firstChild;
      if (e && e === l.lastChild && e.nodeType === 3) {
        e.nodeValue = t;
        return;
      }
    }
    l.textContent = t;
  }
  var Sv = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " ",
    ),
  );
  function Ff(l, t, e) {
    var u = t.indexOf("--") === 0;
    e == null || typeof e == "boolean" || e === ""
      ? u
        ? l.setProperty(t, "")
        : t === "float"
          ? (l.cssFloat = "")
          : (l[t] = "")
      : u
        ? l.setProperty(t, e)
        : typeof e != "number" || e === 0 || Sv.has(t)
          ? t === "float"
            ? (l.cssFloat = e)
            : (l[t] = ("" + e).trim())
          : (l[t] = e + "px");
  }
  function kf(l, t, e) {
    if (t != null && typeof t != "object") throw Error(o(62));
    if (((l = l.style), e != null)) {
      for (var u in e)
        !e.hasOwnProperty(u) ||
          (t != null && t.hasOwnProperty(u)) ||
          (u.indexOf("--") === 0
            ? l.setProperty(u, "")
            : u === "float"
              ? (l.cssFloat = "")
              : (l[u] = ""));
      for (var a in t)
        ((u = t[a]), t.hasOwnProperty(a) && e[a] !== u && Ff(l, a, u));
    } else for (var n in t) t.hasOwnProperty(n) && Ff(l, n, t[n]);
  }
  function di(l) {
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
  var bv = new Map([
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
    pv =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Ga(l) {
    return pv.test("" + l)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : l;
  }
  function Bt() {}
  var vi = null;
  function yi(l) {
    return (
      (l = l.target || l.srcElement || window),
      l.correspondingUseElement && (l = l.correspondingUseElement),
      l.nodeType === 3 ? l.parentNode : l
    );
  }
  var ke = null,
    Ie = null;
  function If(l) {
    var t = Je(l);
    if (t && (l = t.stateNode)) {
      var e = l[Il] || null;
      l: switch (((l = t.stateNode), t.type)) {
        case "input":
          if (
            (ri(
              l,
              e.value,
              e.defaultValue,
              e.defaultValue,
              e.checked,
              e.defaultChecked,
              e.type,
              e.name,
            ),
            (t = e.name),
            e.type === "radio" && t != null)
          ) {
            for (e = l; e.parentNode; ) e = e.parentNode;
            for (
              e = e.querySelectorAll(
                'input[name="' + St("" + t) + '"][type="radio"]',
              ),
                t = 0;
              t < e.length;
              t++
            ) {
              var u = e[t];
              if (u !== l && u.form === l.form) {
                var a = u[Il] || null;
                if (!a) throw Error(o(90));
                ri(
                  u,
                  a.value,
                  a.defaultValue,
                  a.defaultValue,
                  a.checked,
                  a.defaultChecked,
                  a.type,
                  a.name,
                );
              }
            }
            for (t = 0; t < e.length; t++)
              ((u = e[t]), u.form === l.form && Jf(u));
          }
          break l;
        case "textarea":
          Wf(l, e.value, e.defaultValue);
          break l;
        case "select":
          ((t = e.value), t != null && $e(l, !!e.multiple, t, !1));
      }
    }
  }
  var mi = !1;
  function Pf(l, t, e) {
    if (mi) return l(t, e);
    mi = !0;
    try {
      var u = l(t);
      return u;
    } finally {
      if (
        ((mi = !1),
        (ke !== null || Ie !== null) &&
          (Mn(), ke && ((t = ke), (l = Ie), (Ie = ke = null), If(t), l)))
      )
        for (t = 0; t < l.length; t++) If(l[t]);
    }
  }
  function Bu(l, t) {
    var e = l.stateNode;
    if (e === null) return null;
    var u = e[Il] || null;
    if (u === null) return null;
    e = u[t];
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
        ((u = !u.disabled) ||
          ((l = l.type),
          (u = !(
            l === "button" ||
            l === "input" ||
            l === "select" ||
            l === "textarea"
          ))),
          (l = !u));
        break l;
      default:
        l = !1;
    }
    if (l) return null;
    if (e && typeof e != "function") throw Error(o(231, t, typeof e));
    return e;
  }
  var Yt = !(
      typeof window > "u" ||
      typeof window.document > "u" ||
      typeof window.document.createElement > "u"
    ),
    hi = !1;
  if (Yt)
    try {
      var Yu = {};
      (Object.defineProperty(Yu, "passive", {
        get: function () {
          hi = !0;
        },
      }),
        window.addEventListener("test", Yu, Yu),
        window.removeEventListener("test", Yu, Yu));
    } catch {
      hi = !1;
    }
  var te = null,
    gi = null,
    Xa = null;
  function lo() {
    if (Xa) return Xa;
    var l,
      t = gi,
      e = t.length,
      u,
      a = "value" in te ? te.value : te.textContent,
      n = a.length;
    for (l = 0; l < e && t[l] === a[l]; l++);
    var i = e - l;
    for (u = 1; u <= i && t[e - u] === a[n - u]; u++);
    return (Xa = a.slice(l, 1 < u ? 1 - u : void 0));
  }
  function Qa(l) {
    var t = l.keyCode;
    return (
      "charCode" in l
        ? ((l = l.charCode), l === 0 && t === 13 && (l = 13))
        : (l = t),
      l === 10 && (l = 13),
      32 <= l || l === 13 ? l : 0
    );
  }
  function xa() {
    return !0;
  }
  function to() {
    return !1;
  }
  function Pl(l) {
    function t(e, u, a, n, i) {
      ((this._reactName = e),
        (this._targetInst = a),
        (this.type = u),
        (this.nativeEvent = n),
        (this.target = i),
        (this.currentTarget = null));
      for (var c in l)
        l.hasOwnProperty(c) && ((e = l[c]), (this[c] = e ? e(n) : n[c]));
      return (
        (this.isDefaultPrevented = (
          n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1
        )
          ? xa
          : to),
        (this.isPropagationStopped = to),
        this
      );
    }
    return (
      C(t.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var e = this.nativeEvent;
          e &&
            (e.preventDefault
              ? e.preventDefault()
              : typeof e.returnValue != "unknown" && (e.returnValue = !1),
            (this.isDefaultPrevented = xa));
        },
        stopPropagation: function () {
          var e = this.nativeEvent;
          e &&
            (e.stopPropagation
              ? e.stopPropagation()
              : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0),
            (this.isPropagationStopped = xa));
        },
        persist: function () {},
        isPersistent: xa,
      }),
      t
    );
  }
  var De = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (l) {
        return l.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    Za = Pl(De),
    Gu = C({}, De, { view: 0, detail: 0 }),
    Ev = Pl(Gu),
    Si,
    bi,
    Xu,
    La = C({}, Gu, {
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
      getModifierState: Ei,
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
          : (l !== Xu &&
              (Xu && l.type === "mousemove"
                ? ((Si = l.screenX - Xu.screenX), (bi = l.screenY - Xu.screenY))
                : (bi = Si = 0),
              (Xu = l)),
            Si);
      },
      movementY: function (l) {
        return "movementY" in l ? l.movementY : bi;
      },
    }),
    eo = Pl(La),
    zv = C({}, La, { dataTransfer: 0 }),
    Tv = Pl(zv),
    Ov = C({}, Gu, { relatedTarget: 0 }),
    pi = Pl(Ov),
    Av = C({}, De, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Mv = Pl(Av),
    _v = C({}, De, {
      clipboardData: function (l) {
        return "clipboardData" in l ? l.clipboardData : window.clipboardData;
      },
    }),
    Dv = Pl(_v),
    Uv = C({}, De, { data: 0 }),
    uo = Pl(Uv),
    Nv = {
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
    Rv = {
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
    Hv = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey",
    };
  function Cv(l) {
    var t = this.nativeEvent;
    return t.getModifierState
      ? t.getModifierState(l)
      : (l = Hv[l])
        ? !!t[l]
        : !1;
  }
  function Ei() {
    return Cv;
  }
  var jv = C({}, Gu, {
      key: function (l) {
        if (l.key) {
          var t = Nv[l.key] || l.key;
          if (t !== "Unidentified") return t;
        }
        return l.type === "keypress"
          ? ((l = Qa(l)), l === 13 ? "Enter" : String.fromCharCode(l))
          : l.type === "keydown" || l.type === "keyup"
            ? Rv[l.keyCode] || "Unidentified"
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
      getModifierState: Ei,
      charCode: function (l) {
        return l.type === "keypress" ? Qa(l) : 0;
      },
      keyCode: function (l) {
        return l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
      },
      which: function (l) {
        return l.type === "keypress"
          ? Qa(l)
          : l.type === "keydown" || l.type === "keyup"
            ? l.keyCode
            : 0;
      },
    }),
    qv = Pl(jv),
    Bv = C({}, La, {
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
    ao = Pl(Bv),
    Yv = C({}, Gu, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Ei,
    }),
    Gv = Pl(Yv),
    Xv = C({}, De, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Qv = Pl(Xv),
    xv = C({}, La, {
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
    Zv = Pl(xv),
    Lv = C({}, De, { newState: 0, oldState: 0 }),
    Vv = Pl(Lv),
    Kv = [9, 13, 27, 32],
    zi = Yt && "CompositionEvent" in window,
    Qu = null;
  Yt && "documentMode" in document && (Qu = document.documentMode);
  var Jv = Yt && "TextEvent" in window && !Qu,
    no = Yt && (!zi || (Qu && 8 < Qu && 11 >= Qu)),
    io = " ",
    co = !1;
  function fo(l, t) {
    switch (l) {
      case "keyup":
        return Kv.indexOf(t.keyCode) !== -1;
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
  function oo(l) {
    return (
      (l = l.detail),
      typeof l == "object" && "data" in l ? l.data : null
    );
  }
  var Pe = !1;
  function wv(l, t) {
    switch (l) {
      case "compositionend":
        return oo(t);
      case "keypress":
        return t.which !== 32 ? null : ((co = !0), io);
      case "textInput":
        return ((l = t.data), l === io && co ? null : l);
      default:
        return null;
    }
  }
  function Wv(l, t) {
    if (Pe)
      return l === "compositionend" || (!zi && fo(l, t))
        ? ((l = lo()), (Xa = gi = te = null), (Pe = !1), l)
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
        return no && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var $v = {
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
  function ro(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t === "input" ? !!$v[l.type] : t === "textarea";
  }
  function so(l, t, e, u) {
    (ke ? (Ie ? Ie.push(u) : (Ie = [u])) : (ke = u),
      (t = Cn(t, "onChange")),
      0 < t.length &&
        ((e = new Za("onChange", "change", null, e, u)),
        l.push({ event: e, listeners: t })));
  }
  var xu = null,
    Zu = null;
  function Fv(l) {
    Ws(l, 0);
  }
  function Va(l) {
    var t = qu(l);
    if (Jf(t)) return l;
  }
  function vo(l, t) {
    if (l === "change") return t;
  }
  var yo = !1;
  if (Yt) {
    var Ti;
    if (Yt) {
      var Oi = "oninput" in document;
      if (!Oi) {
        var mo = document.createElement("div");
        (mo.setAttribute("oninput", "return;"),
          (Oi = typeof mo.oninput == "function"));
      }
      Ti = Oi;
    } else Ti = !1;
    yo = Ti && (!document.documentMode || 9 < document.documentMode);
  }
  function ho() {
    xu && (xu.detachEvent("onpropertychange", go), (Zu = xu = null));
  }
  function go(l) {
    if (l.propertyName === "value" && Va(Zu)) {
      var t = [];
      (so(t, Zu, l, yi(l)), Pf(Fv, t));
    }
  }
  function kv(l, t, e) {
    l === "focusin"
      ? (ho(), (xu = t), (Zu = e), xu.attachEvent("onpropertychange", go))
      : l === "focusout" && ho();
  }
  function Iv(l) {
    if (l === "selectionchange" || l === "keyup" || l === "keydown")
      return Va(Zu);
  }
  function Pv(l, t) {
    if (l === "click") return Va(t);
  }
  function l0(l, t) {
    if (l === "input" || l === "change") return Va(t);
  }
  function t0(l, t) {
    return (l === t && (l !== 0 || 1 / l === 1 / t)) || (l !== l && t !== t);
  }
  var ft = typeof Object.is == "function" ? Object.is : t0;
  function Lu(l, t) {
    if (ft(l, t)) return !0;
    if (
      typeof l != "object" ||
      l === null ||
      typeof t != "object" ||
      t === null
    )
      return !1;
    var e = Object.keys(l),
      u = Object.keys(t);
    if (e.length !== u.length) return !1;
    for (u = 0; u < e.length; u++) {
      var a = e[u];
      if (!ti.call(t, a) || !ft(l[a], t[a])) return !1;
    }
    return !0;
  }
  function So(l) {
    for (; l && l.firstChild; ) l = l.firstChild;
    return l;
  }
  function bo(l, t) {
    var e = So(l);
    l = 0;
    for (var u; e; ) {
      if (e.nodeType === 3) {
        if (((u = l + e.textContent.length), l <= t && u >= t))
          return { node: e, offset: t - l };
        l = u;
      }
      l: {
        for (; e; ) {
          if (e.nextSibling) {
            e = e.nextSibling;
            break l;
          }
          e = e.parentNode;
        }
        e = void 0;
      }
      e = So(e);
    }
  }
  function po(l, t) {
    return l && t
      ? l === t
        ? !0
        : l && l.nodeType === 3
          ? !1
          : t && t.nodeType === 3
            ? po(l, t.parentNode)
            : "contains" in l
              ? l.contains(t)
              : l.compareDocumentPosition
                ? !!(l.compareDocumentPosition(t) & 16)
                : !1
      : !1;
  }
  function Eo(l) {
    l =
      l != null &&
      l.ownerDocument != null &&
      l.ownerDocument.defaultView != null
        ? l.ownerDocument.defaultView
        : window;
    for (var t = Ya(l.document); t instanceof l.HTMLIFrameElement; ) {
      try {
        var e = typeof t.contentWindow.location.href == "string";
      } catch {
        e = !1;
      }
      if (e) l = t.contentWindow;
      else break;
      t = Ya(l.document);
    }
    return t;
  }
  function Ai(l) {
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
  var e0 = Yt && "documentMode" in document && 11 >= document.documentMode,
    lu = null,
    Mi = null,
    Vu = null,
    _i = !1;
  function zo(l, t, e) {
    var u =
      e.window === e ? e.document : e.nodeType === 9 ? e : e.ownerDocument;
    _i ||
      lu == null ||
      lu !== Ya(u) ||
      ((u = lu),
      "selectionStart" in u && Ai(u)
        ? (u = { start: u.selectionStart, end: u.selectionEnd })
        : ((u = (
            (u.ownerDocument && u.ownerDocument.defaultView) ||
            window
          ).getSelection()),
          (u = {
            anchorNode: u.anchorNode,
            anchorOffset: u.anchorOffset,
            focusNode: u.focusNode,
            focusOffset: u.focusOffset,
          })),
      (Vu && Lu(Vu, u)) ||
        ((Vu = u),
        (u = Cn(Mi, "onSelect")),
        0 < u.length &&
          ((t = new Za("onSelect", "select", null, t, e)),
          l.push({ event: t, listeners: u }),
          (t.target = lu))));
  }
  function Ue(l, t) {
    var e = {};
    return (
      (e[l.toLowerCase()] = t.toLowerCase()),
      (e["Webkit" + l] = "webkit" + t),
      (e["Moz" + l] = "moz" + t),
      e
    );
  }
  var tu = {
      animationend: Ue("Animation", "AnimationEnd"),
      animationiteration: Ue("Animation", "AnimationIteration"),
      animationstart: Ue("Animation", "AnimationStart"),
      transitionrun: Ue("Transition", "TransitionRun"),
      transitionstart: Ue("Transition", "TransitionStart"),
      transitioncancel: Ue("Transition", "TransitionCancel"),
      transitionend: Ue("Transition", "TransitionEnd"),
    },
    Di = {},
    To = {};
  Yt &&
    ((To = document.createElement("div").style),
    "AnimationEvent" in window ||
      (delete tu.animationend.animation,
      delete tu.animationiteration.animation,
      delete tu.animationstart.animation),
    "TransitionEvent" in window || delete tu.transitionend.transition);
  function Ne(l) {
    if (Di[l]) return Di[l];
    if (!tu[l]) return l;
    var t = tu[l],
      e;
    for (e in t) if (t.hasOwnProperty(e) && e in To) return (Di[l] = t[e]);
    return l;
  }
  var Oo = Ne("animationend"),
    Ao = Ne("animationiteration"),
    Mo = Ne("animationstart"),
    u0 = Ne("transitionrun"),
    a0 = Ne("transitionstart"),
    n0 = Ne("transitioncancel"),
    _o = Ne("transitionend"),
    Do = new Map(),
    Ui =
      "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " ",
      );
  Ui.push("scrollEnd");
  function _t(l, t) {
    (Do.set(l, t), _e(t, [l]));
  }
  var Ka =
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
    bt = [],
    eu = 0,
    Ni = 0;
  function Ja() {
    for (var l = eu, t = (Ni = eu = 0); t < l; ) {
      var e = bt[t];
      bt[t++] = null;
      var u = bt[t];
      bt[t++] = null;
      var a = bt[t];
      bt[t++] = null;
      var n = bt[t];
      if (((bt[t++] = null), u !== null && a !== null)) {
        var i = u.pending;
        (i === null ? (a.next = a) : ((a.next = i.next), (i.next = a)),
          (u.pending = a));
      }
      n !== 0 && Uo(e, a, n);
    }
  }
  function wa(l, t, e, u) {
    ((bt[eu++] = l),
      (bt[eu++] = t),
      (bt[eu++] = e),
      (bt[eu++] = u),
      (Ni |= u),
      (l.lanes |= u),
      (l = l.alternate),
      l !== null && (l.lanes |= u));
  }
  function Ri(l, t, e, u) {
    return (wa(l, t, e, u), Wa(l));
  }
  function Re(l, t) {
    return (wa(l, null, null, t), Wa(l));
  }
  function Uo(l, t, e) {
    l.lanes |= e;
    var u = l.alternate;
    u !== null && (u.lanes |= e);
    for (var a = !1, n = l.return; n !== null; )
      ((n.childLanes |= e),
        (u = n.alternate),
        u !== null && (u.childLanes |= e),
        n.tag === 22 &&
          ((l = n.stateNode), l === null || l._visibility & 1 || (a = !0)),
        (l = n),
        (n = n.return));
    return l.tag === 3
      ? ((n = l.stateNode),
        a &&
          t !== null &&
          ((a = 31 - ct(e)),
          (l = n.hiddenUpdates),
          (u = l[a]),
          u === null ? (l[a] = [t]) : u.push(t),
          (t.lane = e | 536870912)),
        n)
      : null;
  }
  function Wa(l) {
    if (50 < da) throw ((da = 0), (Qc = null), Error(o(185)));
    for (var t = l.return; t !== null; ) ((l = t), (t = l.return));
    return l.tag === 3 ? l.stateNode : null;
  }
  var uu = {};
  function i0(l, t, e, u) {
    ((this.tag = l),
      (this.key = e),
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
      (this.mode = u),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function ot(l, t, e, u) {
    return new i0(l, t, e, u);
  }
  function Hi(l) {
    return ((l = l.prototype), !(!l || !l.isReactComponent));
  }
  function Gt(l, t) {
    var e = l.alternate;
    return (
      e === null
        ? ((e = ot(l.tag, t, l.key, l.mode)),
          (e.elementType = l.elementType),
          (e.type = l.type),
          (e.stateNode = l.stateNode),
          (e.alternate = l),
          (l.alternate = e))
        : ((e.pendingProps = t),
          (e.type = l.type),
          (e.flags = 0),
          (e.subtreeFlags = 0),
          (e.deletions = null)),
      (e.flags = l.flags & 65011712),
      (e.childLanes = l.childLanes),
      (e.lanes = l.lanes),
      (e.child = l.child),
      (e.memoizedProps = l.memoizedProps),
      (e.memoizedState = l.memoizedState),
      (e.updateQueue = l.updateQueue),
      (t = l.dependencies),
      (e.dependencies =
        t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
      (e.sibling = l.sibling),
      (e.index = l.index),
      (e.ref = l.ref),
      (e.refCleanup = l.refCleanup),
      e
    );
  }
  function No(l, t) {
    l.flags &= 65011714;
    var e = l.alternate;
    return (
      e === null
        ? ((l.childLanes = 0),
          (l.lanes = t),
          (l.child = null),
          (l.subtreeFlags = 0),
          (l.memoizedProps = null),
          (l.memoizedState = null),
          (l.updateQueue = null),
          (l.dependencies = null),
          (l.stateNode = null))
        : ((l.childLanes = e.childLanes),
          (l.lanes = e.lanes),
          (l.child = e.child),
          (l.subtreeFlags = 0),
          (l.deletions = null),
          (l.memoizedProps = e.memoizedProps),
          (l.memoizedState = e.memoizedState),
          (l.updateQueue = e.updateQueue),
          (l.type = e.type),
          (t = e.dependencies),
          (l.dependencies =
            t === null
              ? null
              : { lanes: t.lanes, firstContext: t.firstContext })),
      l
    );
  }
  function $a(l, t, e, u, a, n) {
    var i = 0;
    if (((u = l), typeof l == "function")) Hi(l) && (i = 1);
    else if (typeof l == "string")
      i = sy(l, e, R.current)
        ? 26
        : l === "html" || l === "head" || l === "body"
          ? 27
          : 5;
    else
      l: switch (l) {
        case gl:
          return (
            (l = ot(31, e, t, a)),
            (l.elementType = gl),
            (l.lanes = n),
            l
          );
        case cl:
          return He(e.children, a, n, t);
        case xl:
          ((i = 8), (a |= 24));
          break;
        case ql:
          return (
            (l = ot(12, e, t, a | 2)),
            (l.elementType = ql),
            (l.lanes = n),
            l
          );
        case dl:
          return (
            (l = ot(13, e, t, a)),
            (l.elementType = dl),
            (l.lanes = n),
            l
          );
        case ul:
          return (
            (l = ot(19, e, t, a)),
            (l.elementType = ul),
            (l.lanes = n),
            l
          );
        default:
          if (typeof l == "object" && l !== null)
            switch (l.$$typeof) {
              case zl:
                i = 10;
                break l;
              case El:
                i = 9;
                break l;
              case Gl:
                i = 11;
                break l;
              case B:
                i = 14;
                break l;
              case Ul:
                ((i = 16), (u = null));
                break l;
            }
          ((i = 29),
            (e = Error(o(130, l === null ? "null" : typeof l, ""))),
            (u = null));
      }
    return (
      (t = ot(i, e, t, a)),
      (t.elementType = l),
      (t.type = u),
      (t.lanes = n),
      t
    );
  }
  function He(l, t, e, u) {
    return ((l = ot(7, l, u, t)), (l.lanes = e), l);
  }
  function Ci(l, t, e) {
    return ((l = ot(6, l, null, t)), (l.lanes = e), l);
  }
  function Ro(l) {
    var t = ot(18, null, null, 0);
    return ((t.stateNode = l), t);
  }
  function ji(l, t, e) {
    return (
      (t = ot(4, l.children !== null ? l.children : [], l.key, t)),
      (t.lanes = e),
      (t.stateNode = {
        containerInfo: l.containerInfo,
        pendingChildren: null,
        implementation: l.implementation,
      }),
      t
    );
  }
  var Ho = new WeakMap();
  function pt(l, t) {
    if (typeof l == "object" && l !== null) {
      var e = Ho.get(l);
      return e !== void 0
        ? e
        : ((t = { value: l, source: t, stack: Nf(t) }), Ho.set(l, t), t);
    }
    return { value: l, source: t, stack: Nf(t) };
  }
  var au = [],
    nu = 0,
    Fa = null,
    Ku = 0,
    Et = [],
    zt = 0,
    ee = null,
    Nt = 1,
    Rt = "";
  function Xt(l, t) {
    ((au[nu++] = Ku), (au[nu++] = Fa), (Fa = l), (Ku = t));
  }
  function Co(l, t, e) {
    ((Et[zt++] = Nt), (Et[zt++] = Rt), (Et[zt++] = ee), (ee = l));
    var u = Nt;
    l = Rt;
    var a = 32 - ct(u) - 1;
    ((u &= ~(1 << a)), (e += 1));
    var n = 32 - ct(t) + a;
    if (30 < n) {
      var i = a - (a % 5);
      ((n = (u & ((1 << i) - 1)).toString(32)),
        (u >>= i),
        (a -= i),
        (Nt = (1 << (32 - ct(t) + a)) | (e << a) | u),
        (Rt = n + l));
    } else ((Nt = (1 << n) | (e << a) | u), (Rt = l));
  }
  function qi(l) {
    l.return !== null && (Xt(l, 1), Co(l, 1, 0));
  }
  function Bi(l) {
    for (; l === Fa; )
      ((Fa = au[--nu]), (au[nu] = null), (Ku = au[--nu]), (au[nu] = null));
    for (; l === ee; )
      ((ee = Et[--zt]),
        (Et[zt] = null),
        (Rt = Et[--zt]),
        (Et[zt] = null),
        (Nt = Et[--zt]),
        (Et[zt] = null));
  }
  function jo(l, t) {
    ((Et[zt++] = Nt),
      (Et[zt++] = Rt),
      (Et[zt++] = ee),
      (Nt = t.id),
      (Rt = t.overflow),
      (ee = l));
  }
  var Vl = null,
    Sl = null,
    P = !1,
    ue = null,
    Tt = !1,
    Yi = Error(o(519));
  function ae(l) {
    var t = Error(
      o(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1]
          ? "text"
          : "HTML",
        "",
      ),
    );
    throw (Ju(pt(t, l)), Yi);
  }
  function qo(l) {
    var t = l.stateNode,
      e = l.type,
      u = l.memoizedProps;
    switch (((t[Ll] = l), (t[Il] = u), e)) {
      case "dialog":
        ($("cancel", t), $("close", t));
        break;
      case "iframe":
      case "object":
      case "embed":
        $("load", t);
        break;
      case "video":
      case "audio":
        for (e = 0; e < ya.length; e++) $(ya[e], t);
        break;
      case "source":
        $("error", t);
        break;
      case "img":
      case "image":
      case "link":
        ($("error", t), $("load", t));
        break;
      case "details":
        $("toggle", t);
        break;
      case "input":
        ($("invalid", t),
          wf(
            t,
            u.value,
            u.defaultValue,
            u.checked,
            u.defaultChecked,
            u.type,
            u.name,
            !0,
          ));
        break;
      case "select":
        $("invalid", t);
        break;
      case "textarea":
        ($("invalid", t), $f(t, u.value, u.defaultValue, u.children));
    }
    ((e = u.children),
      (typeof e != "string" && typeof e != "number" && typeof e != "bigint") ||
      t.textContent === "" + e ||
      u.suppressHydrationWarning === !0 ||
      Is(t.textContent, e)
        ? (u.popover != null && ($("beforetoggle", t), $("toggle", t)),
          u.onScroll != null && $("scroll", t),
          u.onScrollEnd != null && $("scrollend", t),
          u.onClick != null && (t.onclick = Bt),
          (t = !0))
        : (t = !1),
      t || ae(l, !0));
  }
  function Bo(l) {
    for (Vl = l.return; Vl; )
      switch (Vl.tag) {
        case 5:
        case 31:
        case 13:
          Tt = !1;
          return;
        case 27:
        case 3:
          Tt = !0;
          return;
        default:
          Vl = Vl.return;
      }
  }
  function iu(l) {
    if (l !== Vl) return !1;
    if (!P) return (Bo(l), (P = !0), !1);
    var t = l.tag,
      e;
    if (
      ((e = t !== 3 && t !== 27) &&
        ((e = t === 5) &&
          ((e = l.type),
          (e =
            !(e !== "form" && e !== "button") || tf(l.type, l.memoizedProps))),
        (e = !e)),
      e && Sl && ae(l),
      Bo(l),
      t === 13)
    ) {
      if (((l = l.memoizedState), (l = l !== null ? l.dehydrated : null), !l))
        throw Error(o(317));
      Sl = cd(l);
    } else if (t === 31) {
      if (((l = l.memoizedState), (l = l !== null ? l.dehydrated : null), !l))
        throw Error(o(317));
      Sl = cd(l);
    } else
      t === 27
        ? ((t = Sl), Se(l.type) ? ((l = cf), (cf = null), (Sl = l)) : (Sl = t))
        : (Sl = Vl ? At(l.stateNode.nextSibling) : null);
    return !0;
  }
  function Ce() {
    ((Sl = Vl = null), (P = !1));
  }
  function Gi() {
    var l = ue;
    return (
      l !== null &&
        (ut === null ? (ut = l) : ut.push.apply(ut, l), (ue = null)),
      l
    );
  }
  function Ju(l) {
    ue === null ? (ue = [l]) : ue.push(l);
  }
  var Xi = s(null),
    je = null,
    Qt = null;
  function ne(l, t, e) {
    (N(Xi, t._currentValue), (t._currentValue = e));
  }
  function xt(l) {
    ((l._currentValue = Xi.current), T(Xi));
  }
  function Qi(l, t, e) {
    for (; l !== null; ) {
      var u = l.alternate;
      if (
        ((l.childLanes & t) !== t
          ? ((l.childLanes |= t), u !== null && (u.childLanes |= t))
          : u !== null && (u.childLanes & t) !== t && (u.childLanes |= t),
        l === e)
      )
        break;
      l = l.return;
    }
  }
  function xi(l, t, e, u) {
    var a = l.child;
    for (a !== null && (a.return = l); a !== null; ) {
      var n = a.dependencies;
      if (n !== null) {
        var i = a.child;
        n = n.firstContext;
        l: for (; n !== null; ) {
          var c = n;
          n = a;
          for (var r = 0; r < t.length; r++)
            if (c.context === t[r]) {
              ((n.lanes |= e),
                (c = n.alternate),
                c !== null && (c.lanes |= e),
                Qi(n.return, e, l),
                u || (i = null));
              break l;
            }
          n = c.next;
        }
      } else if (a.tag === 18) {
        if (((i = a.return), i === null)) throw Error(o(341));
        ((i.lanes |= e),
          (n = i.alternate),
          n !== null && (n.lanes |= e),
          Qi(i, e, l),
          (i = null));
      } else i = a.child;
      if (i !== null) i.return = a;
      else
        for (i = a; i !== null; ) {
          if (i === l) {
            i = null;
            break;
          }
          if (((a = i.sibling), a !== null)) {
            ((a.return = i.return), (i = a));
            break;
          }
          i = i.return;
        }
      a = i;
    }
  }
  function cu(l, t, e, u) {
    l = null;
    for (var a = t, n = !1; a !== null; ) {
      if (!n) {
        if ((a.flags & 524288) !== 0) n = !0;
        else if ((a.flags & 262144) !== 0) break;
      }
      if (a.tag === 10) {
        var i = a.alternate;
        if (i === null) throw Error(o(387));
        if (((i = i.memoizedProps), i !== null)) {
          var c = a.type;
          ft(a.pendingProps.value, i.value) ||
            (l !== null ? l.push(c) : (l = [c]));
        }
      } else if (a === fl.current) {
        if (((i = a.alternate), i === null)) throw Error(o(387));
        i.memoizedState.memoizedState !== a.memoizedState.memoizedState &&
          (l !== null ? l.push(ba) : (l = [ba]));
      }
      a = a.return;
    }
    (l !== null && xi(t, l, e, u), (t.flags |= 262144));
  }
  function ka(l) {
    for (l = l.firstContext; l !== null; ) {
      if (!ft(l.context._currentValue, l.memoizedValue)) return !0;
      l = l.next;
    }
    return !1;
  }
  function qe(l) {
    ((je = l),
      (Qt = null),
      (l = l.dependencies),
      l !== null && (l.firstContext = null));
  }
  function Kl(l) {
    return Yo(je, l);
  }
  function Ia(l, t) {
    return (je === null && qe(l), Yo(l, t));
  }
  function Yo(l, t) {
    var e = t._currentValue;
    if (((t = { context: t, memoizedValue: e, next: null }), Qt === null)) {
      if (l === null) throw Error(o(308));
      ((Qt = t),
        (l.dependencies = { lanes: 0, firstContext: t }),
        (l.flags |= 524288));
    } else Qt = Qt.next = t;
    return e;
  }
  var c0 =
      typeof AbortController < "u"
        ? AbortController
        : function () {
            var l = [],
              t = (this.signal = {
                aborted: !1,
                addEventListener: function (e, u) {
                  l.push(u);
                },
              });
            this.abort = function () {
              ((t.aborted = !0),
                l.forEach(function (e) {
                  return e();
                }));
            };
          },
    f0 = f.unstable_scheduleCallback,
    o0 = f.unstable_NormalPriority,
    Nl = {
      $$typeof: zl,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    };
  function Zi() {
    return { controller: new c0(), data: new Map(), refCount: 0 };
  }
  function wu(l) {
    (l.refCount--,
      l.refCount === 0 &&
        f0(o0, function () {
          l.controller.abort();
        }));
  }
  var Wu = null,
    Li = 0,
    fu = 0,
    ou = null;
  function r0(l, t) {
    if (Wu === null) {
      var e = (Wu = []);
      ((Li = 0),
        (fu = Jc()),
        (ou = {
          status: "pending",
          value: void 0,
          then: function (u) {
            e.push(u);
          },
        }));
    }
    return (Li++, t.then(Go, Go), t);
  }
  function Go() {
    if (--Li === 0 && Wu !== null) {
      ou !== null && (ou.status = "fulfilled");
      var l = Wu;
      ((Wu = null), (fu = 0), (ou = null));
      for (var t = 0; t < l.length; t++) (0, l[t])();
    }
  }
  function s0(l, t) {
    var e = [],
      u = {
        status: "pending",
        value: null,
        reason: null,
        then: function (a) {
          e.push(a);
        },
      };
    return (
      l.then(
        function () {
          ((u.status = "fulfilled"), (u.value = t));
          for (var a = 0; a < e.length; a++) (0, e[a])(t);
        },
        function (a) {
          for (u.status = "rejected", u.reason = a, a = 0; a < e.length; a++)
            (0, e[a])(void 0);
        },
      ),
      u
    );
  }
  var Xo = p.S;
  p.S = function (l, t) {
    ((zs = nt()),
      typeof t == "object" &&
        t !== null &&
        typeof t.then == "function" &&
        r0(l, t),
      Xo !== null && Xo(l, t));
  };
  var Be = s(null);
  function Vi() {
    var l = Be.current;
    return l !== null ? l : hl.pooledCache;
  }
  function Pa(l, t) {
    t === null ? N(Be, Be.current) : N(Be, t.pool);
  }
  function Qo() {
    var l = Vi();
    return l === null ? null : { parent: Nl._currentValue, pool: l };
  }
  var ru = Error(o(460)),
    Ki = Error(o(474)),
    ln = Error(o(542)),
    tn = { then: function () {} };
  function xo(l) {
    return ((l = l.status), l === "fulfilled" || l === "rejected");
  }
  function Zo(l, t, e) {
    switch (
      ((e = l[e]),
      e === void 0 ? l.push(t) : e !== t && (t.then(Bt, Bt), (t = e)),
      t.status)
    ) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw ((l = t.reason), Vo(l), l);
      default:
        if (typeof t.status == "string") t.then(Bt, Bt);
        else {
          if (((l = hl), l !== null && 100 < l.shellSuspendCounter))
            throw Error(o(482));
          ((l = t),
            (l.status = "pending"),
            l.then(
              function (u) {
                if (t.status === "pending") {
                  var a = t;
                  ((a.status = "fulfilled"), (a.value = u));
                }
              },
              function (u) {
                if (t.status === "pending") {
                  var a = t;
                  ((a.status = "rejected"), (a.reason = u));
                }
              },
            ));
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw ((l = t.reason), Vo(l), l);
        }
        throw ((Ge = t), ru);
    }
  }
  function Ye(l) {
    try {
      var t = l._init;
      return t(l._payload);
    } catch (e) {
      throw e !== null && typeof e == "object" && typeof e.then == "function"
        ? ((Ge = e), ru)
        : e;
    }
  }
  var Ge = null;
  function Lo() {
    if (Ge === null) throw Error(o(459));
    var l = Ge;
    return ((Ge = null), l);
  }
  function Vo(l) {
    if (l === ru || l === ln) throw Error(o(483));
  }
  var su = null,
    $u = 0;
  function en(l) {
    var t = $u;
    return (($u += 1), su === null && (su = []), Zo(su, l, t));
  }
  function Fu(l, t) {
    ((t = t.props.ref), (l.ref = t !== void 0 ? t : null));
  }
  function un(l, t) {
    throw t.$$typeof === il
      ? Error(o(525))
      : ((l = Object.prototype.toString.call(t)),
        Error(
          o(
            31,
            l === "[object Object]"
              ? "object with keys {" + Object.keys(t).join(", ") + "}"
              : l,
          ),
        ));
  }
  function Ko(l) {
    function t(y, d) {
      if (l) {
        var h = y.deletions;
        h === null ? ((y.deletions = [d]), (y.flags |= 16)) : h.push(d);
      }
    }
    function e(y, d) {
      if (!l) return null;
      for (; d !== null; ) (t(y, d), (d = d.sibling));
      return null;
    }
    function u(y) {
      for (var d = new Map(); y !== null; )
        (y.key !== null ? d.set(y.key, y) : d.set(y.index, y), (y = y.sibling));
      return d;
    }
    function a(y, d) {
      return ((y = Gt(y, d)), (y.index = 0), (y.sibling = null), y);
    }
    function n(y, d, h) {
      return (
        (y.index = h),
        l
          ? ((h = y.alternate),
            h !== null
              ? ((h = h.index), h < d ? ((y.flags |= 67108866), d) : h)
              : ((y.flags |= 67108866), d))
          : ((y.flags |= 1048576), d)
      );
    }
    function i(y) {
      return (l && y.alternate === null && (y.flags |= 67108866), y);
    }
    function c(y, d, h, O) {
      return d === null || d.tag !== 6
        ? ((d = Ci(h, y.mode, O)), (d.return = y), d)
        : ((d = a(d, h)), (d.return = y), d);
    }
    function r(y, d, h, O) {
      var Y = h.type;
      return Y === cl
        ? E(y, d, h.props.children, O, h.key)
        : d !== null &&
            (d.elementType === Y ||
              (typeof Y == "object" &&
                Y !== null &&
                Y.$$typeof === Ul &&
                Ye(Y) === d.type))
          ? ((d = a(d, h.props)), Fu(d, h), (d.return = y), d)
          : ((d = $a(h.type, h.key, h.props, null, y.mode, O)),
            Fu(d, h),
            (d.return = y),
            d);
    }
    function g(y, d, h, O) {
      return d === null ||
        d.tag !== 4 ||
        d.stateNode.containerInfo !== h.containerInfo ||
        d.stateNode.implementation !== h.implementation
        ? ((d = ji(h, y.mode, O)), (d.return = y), d)
        : ((d = a(d, h.children || [])), (d.return = y), d);
    }
    function E(y, d, h, O, Y) {
      return d === null || d.tag !== 7
        ? ((d = He(h, y.mode, O, Y)), (d.return = y), d)
        : ((d = a(d, h)), (d.return = y), d);
    }
    function A(y, d, h) {
      if (
        (typeof d == "string" && d !== "") ||
        typeof d == "number" ||
        typeof d == "bigint"
      )
        return ((d = Ci("" + d, y.mode, h)), (d.return = y), d);
      if (typeof d == "object" && d !== null) {
        switch (d.$$typeof) {
          case jl:
            return (
              (h = $a(d.type, d.key, d.props, null, y.mode, h)),
              Fu(h, d),
              (h.return = y),
              h
            );
          case Dl:
            return ((d = ji(d, y.mode, h)), (d.return = y), d);
          case Ul:
            return ((d = Ye(d)), A(y, d, h));
        }
        if (F(d) || Bl(d))
          return ((d = He(d, y.mode, h, null)), (d.return = y), d);
        if (typeof d.then == "function") return A(y, en(d), h);
        if (d.$$typeof === zl) return A(y, Ia(y, d), h);
        un(y, d);
      }
      return null;
    }
    function S(y, d, h, O) {
      var Y = d !== null ? d.key : null;
      if (
        (typeof h == "string" && h !== "") ||
        typeof h == "number" ||
        typeof h == "bigint"
      )
        return Y !== null ? null : c(y, d, "" + h, O);
      if (typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case jl:
            return h.key === Y ? r(y, d, h, O) : null;
          case Dl:
            return h.key === Y ? g(y, d, h, O) : null;
          case Ul:
            return ((h = Ye(h)), S(y, d, h, O));
        }
        if (F(h) || Bl(h)) return Y !== null ? null : E(y, d, h, O, null);
        if (typeof h.then == "function") return S(y, d, en(h), O);
        if (h.$$typeof === zl) return S(y, d, Ia(y, h), O);
        un(y, h);
      }
      return null;
    }
    function b(y, d, h, O, Y) {
      if (
        (typeof O == "string" && O !== "") ||
        typeof O == "number" ||
        typeof O == "bigint"
      )
        return ((y = y.get(h) || null), c(d, y, "" + O, Y));
      if (typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case jl:
            return (
              (y = y.get(O.key === null ? h : O.key) || null),
              r(d, y, O, Y)
            );
          case Dl:
            return (
              (y = y.get(O.key === null ? h : O.key) || null),
              g(d, y, O, Y)
            );
          case Ul:
            return ((O = Ye(O)), b(y, d, h, O, Y));
        }
        if (F(O) || Bl(O)) return ((y = y.get(h) || null), E(d, y, O, Y, null));
        if (typeof O.then == "function") return b(y, d, h, en(O), Y);
        if (O.$$typeof === zl) return b(y, d, h, Ia(d, O), Y);
        un(d, O);
      }
      return null;
    }
    function H(y, d, h, O) {
      for (
        var Y = null, tl = null, j = d, J = (d = 0), I = null;
        j !== null && J < h.length;
        J++
      ) {
        j.index > J ? ((I = j), (j = null)) : (I = j.sibling);
        var el = S(y, j, h[J], O);
        if (el === null) {
          j === null && (j = I);
          break;
        }
        (l && j && el.alternate === null && t(y, j),
          (d = n(el, d, J)),
          tl === null ? (Y = el) : (tl.sibling = el),
          (tl = el),
          (j = I));
      }
      if (J === h.length) return (e(y, j), P && Xt(y, J), Y);
      if (j === null) {
        for (; J < h.length; J++)
          ((j = A(y, h[J], O)),
            j !== null &&
              ((d = n(j, d, J)),
              tl === null ? (Y = j) : (tl.sibling = j),
              (tl = j)));
        return (P && Xt(y, J), Y);
      }
      for (j = u(j); J < h.length; J++)
        ((I = b(j, y, J, h[J], O)),
          I !== null &&
            (l && I.alternate !== null && j.delete(I.key === null ? J : I.key),
            (d = n(I, d, J)),
            tl === null ? (Y = I) : (tl.sibling = I),
            (tl = I)));
      return (
        l &&
          j.forEach(function (Te) {
            return t(y, Te);
          }),
        P && Xt(y, J),
        Y
      );
    }
    function X(y, d, h, O) {
      if (h == null) throw Error(o(151));
      for (
        var Y = null, tl = null, j = d, J = (d = 0), I = null, el = h.next();
        j !== null && !el.done;
        J++, el = h.next()
      ) {
        j.index > J ? ((I = j), (j = null)) : (I = j.sibling);
        var Te = S(y, j, el.value, O);
        if (Te === null) {
          j === null && (j = I);
          break;
        }
        (l && j && Te.alternate === null && t(y, j),
          (d = n(Te, d, J)),
          tl === null ? (Y = Te) : (tl.sibling = Te),
          (tl = Te),
          (j = I));
      }
      if (el.done) return (e(y, j), P && Xt(y, J), Y);
      if (j === null) {
        for (; !el.done; J++, el = h.next())
          ((el = A(y, el.value, O)),
            el !== null &&
              ((d = n(el, d, J)),
              tl === null ? (Y = el) : (tl.sibling = el),
              (tl = el)));
        return (P && Xt(y, J), Y);
      }
      for (j = u(j); !el.done; J++, el = h.next())
        ((el = b(j, y, J, el.value, O)),
          el !== null &&
            (l &&
              el.alternate !== null &&
              j.delete(el.key === null ? J : el.key),
            (d = n(el, d, J)),
            tl === null ? (Y = el) : (tl.sibling = el),
            (tl = el)));
      return (
        l &&
          j.forEach(function (zy) {
            return t(y, zy);
          }),
        P && Xt(y, J),
        Y
      );
    }
    function ml(y, d, h, O) {
      if (
        (typeof h == "object" &&
          h !== null &&
          h.type === cl &&
          h.key === null &&
          (h = h.props.children),
        typeof h == "object" && h !== null)
      ) {
        switch (h.$$typeof) {
          case jl:
            l: {
              for (var Y = h.key; d !== null; ) {
                if (d.key === Y) {
                  if (((Y = h.type), Y === cl)) {
                    if (d.tag === 7) {
                      (e(y, d.sibling),
                        (O = a(d, h.props.children)),
                        (O.return = y),
                        (y = O));
                      break l;
                    }
                  } else if (
                    d.elementType === Y ||
                    (typeof Y == "object" &&
                      Y !== null &&
                      Y.$$typeof === Ul &&
                      Ye(Y) === d.type)
                  ) {
                    (e(y, d.sibling),
                      (O = a(d, h.props)),
                      Fu(O, h),
                      (O.return = y),
                      (y = O));
                    break l;
                  }
                  e(y, d);
                  break;
                } else t(y, d);
                d = d.sibling;
              }
              h.type === cl
                ? ((O = He(h.props.children, y.mode, O, h.key)),
                  (O.return = y),
                  (y = O))
                : ((O = $a(h.type, h.key, h.props, null, y.mode, O)),
                  Fu(O, h),
                  (O.return = y),
                  (y = O));
            }
            return i(y);
          case Dl:
            l: {
              for (Y = h.key; d !== null; ) {
                if (d.key === Y)
                  if (
                    d.tag === 4 &&
                    d.stateNode.containerInfo === h.containerInfo &&
                    d.stateNode.implementation === h.implementation
                  ) {
                    (e(y, d.sibling),
                      (O = a(d, h.children || [])),
                      (O.return = y),
                      (y = O));
                    break l;
                  } else {
                    e(y, d);
                    break;
                  }
                else t(y, d);
                d = d.sibling;
              }
              ((O = ji(h, y.mode, O)), (O.return = y), (y = O));
            }
            return i(y);
          case Ul:
            return ((h = Ye(h)), ml(y, d, h, O));
        }
        if (F(h)) return H(y, d, h, O);
        if (Bl(h)) {
          if (((Y = Bl(h)), typeof Y != "function")) throw Error(o(150));
          return ((h = Y.call(h)), X(y, d, h, O));
        }
        if (typeof h.then == "function") return ml(y, d, en(h), O);
        if (h.$$typeof === zl) return ml(y, d, Ia(y, h), O);
        un(y, h);
      }
      return (typeof h == "string" && h !== "") ||
        typeof h == "number" ||
        typeof h == "bigint"
        ? ((h = "" + h),
          d !== null && d.tag === 6
            ? (e(y, d.sibling), (O = a(d, h)), (O.return = y), (y = O))
            : (e(y, d), (O = Ci(h, y.mode, O)), (O.return = y), (y = O)),
          i(y))
        : e(y, d);
    }
    return function (y, d, h, O) {
      try {
        $u = 0;
        var Y = ml(y, d, h, O);
        return ((su = null), Y);
      } catch (j) {
        if (j === ru || j === ln) throw j;
        var tl = ot(29, j, null, y.mode);
        return ((tl.lanes = O), (tl.return = y), tl);
      }
    };
  }
  var Xe = Ko(!0),
    Jo = Ko(!1),
    ie = !1;
  function Ji(l) {
    l.updateQueue = {
      baseState: l.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function wi(l, t) {
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
  function ce(l) {
    return { lane: l, tag: 0, payload: null, callback: null, next: null };
  }
  function fe(l, t, e) {
    var u = l.updateQueue;
    if (u === null) return null;
    if (((u = u.shared), (nl & 2) !== 0)) {
      var a = u.pending;
      return (
        a === null ? (t.next = t) : ((t.next = a.next), (a.next = t)),
        (u.pending = t),
        (t = Wa(l)),
        Uo(l, null, e),
        t
      );
    }
    return (wa(l, u, t, e), Wa(l));
  }
  function ku(l, t, e) {
    if (
      ((t = t.updateQueue), t !== null && ((t = t.shared), (e & 4194048) !== 0))
    ) {
      var u = t.lanes;
      ((u &= l.pendingLanes), (e |= u), (t.lanes = e), Bf(l, e));
    }
  }
  function Wi(l, t) {
    var e = l.updateQueue,
      u = l.alternate;
    if (u !== null && ((u = u.updateQueue), e === u)) {
      var a = null,
        n = null;
      if (((e = e.firstBaseUpdate), e !== null)) {
        do {
          var i = {
            lane: e.lane,
            tag: e.tag,
            payload: e.payload,
            callback: null,
            next: null,
          };
          (n === null ? (a = n = i) : (n = n.next = i), (e = e.next));
        } while (e !== null);
        n === null ? (a = n = t) : (n = n.next = t);
      } else a = n = t;
      ((e = {
        baseState: u.baseState,
        firstBaseUpdate: a,
        lastBaseUpdate: n,
        shared: u.shared,
        callbacks: u.callbacks,
      }),
        (l.updateQueue = e));
      return;
    }
    ((l = e.lastBaseUpdate),
      l === null ? (e.firstBaseUpdate = t) : (l.next = t),
      (e.lastBaseUpdate = t));
  }
  var $i = !1;
  function Iu() {
    if ($i) {
      var l = ou;
      if (l !== null) throw l;
    }
  }
  function Pu(l, t, e, u) {
    $i = !1;
    var a = l.updateQueue;
    ie = !1;
    var n = a.firstBaseUpdate,
      i = a.lastBaseUpdate,
      c = a.shared.pending;
    if (c !== null) {
      a.shared.pending = null;
      var r = c,
        g = r.next;
      ((r.next = null), i === null ? (n = g) : (i.next = g), (i = r));
      var E = l.alternate;
      E !== null &&
        ((E = E.updateQueue),
        (c = E.lastBaseUpdate),
        c !== i &&
          (c === null ? (E.firstBaseUpdate = g) : (c.next = g),
          (E.lastBaseUpdate = r)));
    }
    if (n !== null) {
      var A = a.baseState;
      ((i = 0), (E = g = r = null), (c = n));
      do {
        var S = c.lane & -536870913,
          b = S !== c.lane;
        if (b ? (k & S) === S : (u & S) === S) {
          (S !== 0 && S === fu && ($i = !0),
            E !== null &&
              (E = E.next =
                {
                  lane: 0,
                  tag: c.tag,
                  payload: c.payload,
                  callback: null,
                  next: null,
                }));
          l: {
            var H = l,
              X = c;
            S = t;
            var ml = e;
            switch (X.tag) {
              case 1:
                if (((H = X.payload), typeof H == "function")) {
                  A = H.call(ml, A, S);
                  break l;
                }
                A = H;
                break l;
              case 3:
                H.flags = (H.flags & -65537) | 128;
              case 0:
                if (
                  ((H = X.payload),
                  (S = typeof H == "function" ? H.call(ml, A, S) : H),
                  S == null)
                )
                  break l;
                A = C({}, A, S);
                break l;
              case 2:
                ie = !0;
            }
          }
          ((S = c.callback),
            S !== null &&
              ((l.flags |= 64),
              b && (l.flags |= 8192),
              (b = a.callbacks),
              b === null ? (a.callbacks = [S]) : b.push(S)));
        } else
          ((b = {
            lane: S,
            tag: c.tag,
            payload: c.payload,
            callback: c.callback,
            next: null,
          }),
            E === null ? ((g = E = b), (r = A)) : (E = E.next = b),
            (i |= S));
        if (((c = c.next), c === null)) {
          if (((c = a.shared.pending), c === null)) break;
          ((b = c),
            (c = b.next),
            (b.next = null),
            (a.lastBaseUpdate = b),
            (a.shared.pending = null));
        }
      } while (!0);
      (E === null && (r = A),
        (a.baseState = r),
        (a.firstBaseUpdate = g),
        (a.lastBaseUpdate = E),
        n === null && (a.shared.lanes = 0),
        (ve |= i),
        (l.lanes = i),
        (l.memoizedState = A));
    }
  }
  function wo(l, t) {
    if (typeof l != "function") throw Error(o(191, l));
    l.call(t);
  }
  function Wo(l, t) {
    var e = l.callbacks;
    if (e !== null)
      for (l.callbacks = null, l = 0; l < e.length; l++) wo(e[l], t);
  }
  var du = s(null),
    an = s(0);
  function $o(l, t) {
    ((l = Ft), N(an, l), N(du, t), (Ft = l | t.baseLanes));
  }
  function Fi() {
    (N(an, Ft), N(du, du.current));
  }
  function ki() {
    ((Ft = an.current), T(du), T(an));
  }
  var rt = s(null),
    Ot = null;
  function oe(l) {
    var t = l.alternate;
    (N(Ml, Ml.current & 1),
      N(rt, l),
      Ot === null &&
        (t === null || du.current !== null || t.memoizedState !== null) &&
        (Ot = l));
  }
  function Ii(l) {
    (N(Ml, Ml.current), N(rt, l), Ot === null && (Ot = l));
  }
  function Fo(l) {
    l.tag === 22
      ? (N(Ml, Ml.current), N(rt, l), Ot === null && (Ot = l))
      : re();
  }
  function re() {
    (N(Ml, Ml.current), N(rt, rt.current));
  }
  function st(l) {
    (T(rt), Ot === l && (Ot = null), T(Ml));
  }
  var Ml = s(0);
  function nn(l) {
    for (var t = l; t !== null; ) {
      if (t.tag === 13) {
        var e = t.memoizedState;
        if (e !== null && ((e = e.dehydrated), e === null || af(e) || nf(e)))
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
  var Zt = 0,
    K = null,
    vl = null,
    Rl = null,
    cn = !1,
    vu = !1,
    Qe = !1,
    fn = 0,
    la = 0,
    yu = null,
    d0 = 0;
  function Tl() {
    throw Error(o(321));
  }
  function Pi(l, t) {
    if (t === null) return !1;
    for (var e = 0; e < t.length && e < l.length; e++)
      if (!ft(l[e], t[e])) return !1;
    return !0;
  }
  function lc(l, t, e, u, a, n) {
    return (
      (Zt = n),
      (K = t),
      (t.memoizedState = null),
      (t.updateQueue = null),
      (t.lanes = 0),
      (p.H = l === null || l.memoizedState === null ? Cr : mc),
      (Qe = !1),
      (n = e(u, a)),
      (Qe = !1),
      vu && (n = Io(t, e, u, a)),
      ko(l),
      n
    );
  }
  function ko(l) {
    p.H = ua;
    var t = vl !== null && vl.next !== null;
    if (((Zt = 0), (Rl = vl = K = null), (cn = !1), (la = 0), (yu = null), t))
      throw Error(o(300));
    l === null ||
      Hl ||
      ((l = l.dependencies), l !== null && ka(l) && (Hl = !0));
  }
  function Io(l, t, e, u) {
    K = l;
    var a = 0;
    do {
      if ((vu && (yu = null), (la = 0), (vu = !1), 25 <= a))
        throw Error(o(301));
      if (((a += 1), (Rl = vl = null), l.updateQueue != null)) {
        var n = l.updateQueue;
        ((n.lastEffect = null),
          (n.events = null),
          (n.stores = null),
          n.memoCache != null && (n.memoCache.index = 0));
      }
      ((p.H = jr), (n = t(e, u)));
    } while (vu);
    return n;
  }
  function v0() {
    var l = p.H,
      t = l.useState()[0];
    return (
      (t = typeof t.then == "function" ? ta(t) : t),
      (l = l.useState()[0]),
      (vl !== null ? vl.memoizedState : null) !== l && (K.flags |= 1024),
      t
    );
  }
  function tc() {
    var l = fn !== 0;
    return ((fn = 0), l);
  }
  function ec(l, t, e) {
    ((t.updateQueue = l.updateQueue), (t.flags &= -2053), (l.lanes &= ~e));
  }
  function uc(l) {
    if (cn) {
      for (l = l.memoizedState; l !== null; ) {
        var t = l.queue;
        (t !== null && (t.pending = null), (l = l.next));
      }
      cn = !1;
    }
    ((Zt = 0), (Rl = vl = K = null), (vu = !1), (la = fn = 0), (yu = null));
  }
  function kl() {
    var l = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null,
    };
    return (Rl === null ? (K.memoizedState = Rl = l) : (Rl = Rl.next = l), Rl);
  }
  function _l() {
    if (vl === null) {
      var l = K.alternate;
      l = l !== null ? l.memoizedState : null;
    } else l = vl.next;
    var t = Rl === null ? K.memoizedState : Rl.next;
    if (t !== null) ((Rl = t), (vl = l));
    else {
      if (l === null)
        throw K.alternate === null ? Error(o(467)) : Error(o(310));
      ((vl = l),
        (l = {
          memoizedState: vl.memoizedState,
          baseState: vl.baseState,
          baseQueue: vl.baseQueue,
          queue: vl.queue,
          next: null,
        }),
        Rl === null ? (K.memoizedState = Rl = l) : (Rl = Rl.next = l));
    }
    return Rl;
  }
  function on() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function ta(l) {
    var t = la;
    return (
      (la += 1),
      yu === null && (yu = []),
      (l = Zo(yu, l, t)),
      (t = K),
      (Rl === null ? t.memoizedState : Rl.next) === null &&
        ((t = t.alternate),
        (p.H = t === null || t.memoizedState === null ? Cr : mc)),
      l
    );
  }
  function rn(l) {
    if (l !== null && typeof l == "object") {
      if (typeof l.then == "function") return ta(l);
      if (l.$$typeof === zl) return Kl(l);
    }
    throw Error(o(438, String(l)));
  }
  function ac(l) {
    var t = null,
      e = K.updateQueue;
    if ((e !== null && (t = e.memoCache), t == null)) {
      var u = K.alternate;
      u !== null &&
        ((u = u.updateQueue),
        u !== null &&
          ((u = u.memoCache),
          u != null &&
            (t = {
              data: u.data.map(function (a) {
                return a.slice();
              }),
              index: 0,
            })));
    }
    if (
      (t == null && (t = { data: [], index: 0 }),
      e === null && ((e = on()), (K.updateQueue = e)),
      (e.memoCache = t),
      (e = t.data[t.index]),
      e === void 0)
    )
      for (e = t.data[t.index] = Array(l), u = 0; u < l; u++) e[u] = ll;
    return (t.index++, e);
  }
  function Lt(l, t) {
    return typeof t == "function" ? t(l) : t;
  }
  function sn(l) {
    var t = _l();
    return nc(t, vl, l);
  }
  function nc(l, t, e) {
    var u = l.queue;
    if (u === null) throw Error(o(311));
    u.lastRenderedReducer = e;
    var a = l.baseQueue,
      n = u.pending;
    if (n !== null) {
      if (a !== null) {
        var i = a.next;
        ((a.next = n.next), (n.next = i));
      }
      ((t.baseQueue = a = n), (u.pending = null));
    }
    if (((n = l.baseState), a === null)) l.memoizedState = n;
    else {
      t = a.next;
      var c = (i = null),
        r = null,
        g = t,
        E = !1;
      do {
        var A = g.lane & -536870913;
        if (A !== g.lane ? (k & A) === A : (Zt & A) === A) {
          var S = g.revertLane;
          if (S === 0)
            (r !== null &&
              (r = r.next =
                {
                  lane: 0,
                  revertLane: 0,
                  gesture: null,
                  action: g.action,
                  hasEagerState: g.hasEagerState,
                  eagerState: g.eagerState,
                  next: null,
                }),
              A === fu && (E = !0));
          else if ((Zt & S) === S) {
            ((g = g.next), S === fu && (E = !0));
            continue;
          } else
            ((A = {
              lane: 0,
              revertLane: g.revertLane,
              gesture: null,
              action: g.action,
              hasEagerState: g.hasEagerState,
              eagerState: g.eagerState,
              next: null,
            }),
              r === null ? ((c = r = A), (i = n)) : (r = r.next = A),
              (K.lanes |= S),
              (ve |= S));
          ((A = g.action),
            Qe && e(n, A),
            (n = g.hasEagerState ? g.eagerState : e(n, A)));
        } else
          ((S = {
            lane: A,
            revertLane: g.revertLane,
            gesture: g.gesture,
            action: g.action,
            hasEagerState: g.hasEagerState,
            eagerState: g.eagerState,
            next: null,
          }),
            r === null ? ((c = r = S), (i = n)) : (r = r.next = S),
            (K.lanes |= A),
            (ve |= A));
        g = g.next;
      } while (g !== null && g !== t);
      if (
        (r === null ? (i = n) : (r.next = c),
        !ft(n, l.memoizedState) && ((Hl = !0), E && ((e = ou), e !== null)))
      )
        throw e;
      ((l.memoizedState = n),
        (l.baseState = i),
        (l.baseQueue = r),
        (u.lastRenderedState = n));
    }
    return (a === null && (u.lanes = 0), [l.memoizedState, u.dispatch]);
  }
  function ic(l) {
    var t = _l(),
      e = t.queue;
    if (e === null) throw Error(o(311));
    e.lastRenderedReducer = l;
    var u = e.dispatch,
      a = e.pending,
      n = t.memoizedState;
    if (a !== null) {
      e.pending = null;
      var i = (a = a.next);
      do ((n = l(n, i.action)), (i = i.next));
      while (i !== a);
      (ft(n, t.memoizedState) || (Hl = !0),
        (t.memoizedState = n),
        t.baseQueue === null && (t.baseState = n),
        (e.lastRenderedState = n));
    }
    return [n, u];
  }
  function Po(l, t, e) {
    var u = K,
      a = _l(),
      n = P;
    if (n) {
      if (e === void 0) throw Error(o(407));
      e = e();
    } else e = t();
    var i = !ft((vl || a).memoizedState, e);
    if (
      (i && ((a.memoizedState = e), (Hl = !0)),
      (a = a.queue),
      oc(er.bind(null, u, a, l), [l]),
      a.getSnapshot !== t || i || (Rl !== null && Rl.memoizedState.tag & 1))
    ) {
      if (
        ((u.flags |= 2048),
        mu(9, { destroy: void 0 }, tr.bind(null, u, a, e, t), null),
        hl === null)
      )
        throw Error(o(349));
      n || (Zt & 127) !== 0 || lr(u, t, e);
    }
    return e;
  }
  function lr(l, t, e) {
    ((l.flags |= 16384),
      (l = { getSnapshot: t, value: e }),
      (t = K.updateQueue),
      t === null
        ? ((t = on()), (K.updateQueue = t), (t.stores = [l]))
        : ((e = t.stores), e === null ? (t.stores = [l]) : e.push(l)));
  }
  function tr(l, t, e, u) {
    ((t.value = e), (t.getSnapshot = u), ur(t) && ar(l));
  }
  function er(l, t, e) {
    return e(function () {
      ur(t) && ar(l);
    });
  }
  function ur(l) {
    var t = l.getSnapshot;
    l = l.value;
    try {
      var e = t();
      return !ft(l, e);
    } catch {
      return !0;
    }
  }
  function ar(l) {
    var t = Re(l, 2);
    t !== null && at(t, l, 2);
  }
  function cc(l) {
    var t = kl();
    if (typeof l == "function") {
      var e = l;
      if (((l = e()), Qe)) {
        Pt(!0);
        try {
          e();
        } finally {
          Pt(!1);
        }
      }
    }
    return (
      (t.memoizedState = t.baseState = l),
      (t.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Lt,
        lastRenderedState: l,
      }),
      t
    );
  }
  function nr(l, t, e, u) {
    return ((l.baseState = e), nc(l, vl, typeof u == "function" ? u : Lt));
  }
  function y0(l, t, e, u, a) {
    if (yn(l)) throw Error(o(485));
    if (((l = t.action), l !== null)) {
      var n = {
        payload: a,
        action: l,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function (i) {
          n.listeners.push(i);
        },
      };
      (p.T !== null ? e(!0) : (n.isTransition = !1),
        u(n),
        (e = t.pending),
        e === null
          ? ((n.next = t.pending = n), ir(t, n))
          : ((n.next = e.next), (t.pending = e.next = n)));
    }
  }
  function ir(l, t) {
    var e = t.action,
      u = t.payload,
      a = l.state;
    if (t.isTransition) {
      var n = p.T,
        i = {};
      p.T = i;
      try {
        var c = e(a, u),
          r = p.S;
        (r !== null && r(i, c), cr(l, t, c));
      } catch (g) {
        fc(l, t, g);
      } finally {
        (n !== null && i.types !== null && (n.types = i.types), (p.T = n));
      }
    } else
      try {
        ((n = e(a, u)), cr(l, t, n));
      } catch (g) {
        fc(l, t, g);
      }
  }
  function cr(l, t, e) {
    e !== null && typeof e == "object" && typeof e.then == "function"
      ? e.then(
          function (u) {
            fr(l, t, u);
          },
          function (u) {
            return fc(l, t, u);
          },
        )
      : fr(l, t, e);
  }
  function fr(l, t, e) {
    ((t.status = "fulfilled"),
      (t.value = e),
      or(t),
      (l.state = e),
      (t = l.pending),
      t !== null &&
        ((e = t.next),
        e === t ? (l.pending = null) : ((e = e.next), (t.next = e), ir(l, e))));
  }
  function fc(l, t, e) {
    var u = l.pending;
    if (((l.pending = null), u !== null)) {
      u = u.next;
      do ((t.status = "rejected"), (t.reason = e), or(t), (t = t.next));
      while (t !== u);
    }
    l.action = null;
  }
  function or(l) {
    l = l.listeners;
    for (var t = 0; t < l.length; t++) (0, l[t])();
  }
  function rr(l, t) {
    return t;
  }
  function sr(l, t) {
    if (P) {
      var e = hl.formState;
      if (e !== null) {
        l: {
          var u = K;
          if (P) {
            if (Sl) {
              t: {
                for (var a = Sl, n = Tt; a.nodeType !== 8; ) {
                  if (!n) {
                    a = null;
                    break t;
                  }
                  if (((a = At(a.nextSibling)), a === null)) {
                    a = null;
                    break t;
                  }
                }
                ((n = a.data), (a = n === "F!" || n === "F" ? a : null));
              }
              if (a) {
                ((Sl = At(a.nextSibling)), (u = a.data === "F!"));
                break l;
              }
            }
            ae(u);
          }
          u = !1;
        }
        u && (t = e[0]);
      }
    }
    return (
      (e = kl()),
      (e.memoizedState = e.baseState = t),
      (u = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: rr,
        lastRenderedState: t,
      }),
      (e.queue = u),
      (e = Nr.bind(null, K, u)),
      (u.dispatch = e),
      (u = cc(!1)),
      (n = yc.bind(null, K, !1, u.queue)),
      (u = kl()),
      (a = { state: t, dispatch: null, action: l, pending: null }),
      (u.queue = a),
      (e = y0.bind(null, K, a, n, e)),
      (a.dispatch = e),
      (u.memoizedState = l),
      [t, e, !1]
    );
  }
  function dr(l) {
    var t = _l();
    return vr(t, vl, l);
  }
  function vr(l, t, e) {
    if (
      ((t = nc(l, t, rr)[0]),
      (l = sn(Lt)[0]),
      typeof t == "object" && t !== null && typeof t.then == "function")
    )
      try {
        var u = ta(t);
      } catch (i) {
        throw i === ru ? ln : i;
      }
    else u = t;
    t = _l();
    var a = t.queue,
      n = a.dispatch;
    return (
      e !== t.memoizedState &&
        ((K.flags |= 2048),
        mu(9, { destroy: void 0 }, m0.bind(null, a, e), null)),
      [u, n, l]
    );
  }
  function m0(l, t) {
    l.action = t;
  }
  function yr(l) {
    var t = _l(),
      e = vl;
    if (e !== null) return vr(t, e, l);
    (_l(), (t = t.memoizedState), (e = _l()));
    var u = e.queue.dispatch;
    return ((e.memoizedState = l), [t, u, !1]);
  }
  function mu(l, t, e, u) {
    return (
      (l = { tag: l, create: e, deps: u, inst: t, next: null }),
      (t = K.updateQueue),
      t === null && ((t = on()), (K.updateQueue = t)),
      (e = t.lastEffect),
      e === null
        ? (t.lastEffect = l.next = l)
        : ((u = e.next), (e.next = l), (l.next = u), (t.lastEffect = l)),
      l
    );
  }
  function mr() {
    return _l().memoizedState;
  }
  function dn(l, t, e, u) {
    var a = kl();
    ((K.flags |= l),
      (a.memoizedState = mu(
        1 | t,
        { destroy: void 0 },
        e,
        u === void 0 ? null : u,
      )));
  }
  function vn(l, t, e, u) {
    var a = _l();
    u = u === void 0 ? null : u;
    var n = a.memoizedState.inst;
    vl !== null && u !== null && Pi(u, vl.memoizedState.deps)
      ? (a.memoizedState = mu(t, n, e, u))
      : ((K.flags |= l), (a.memoizedState = mu(1 | t, n, e, u)));
  }
  function hr(l, t) {
    dn(8390656, 8, l, t);
  }
  function oc(l, t) {
    vn(2048, 8, l, t);
  }
  function h0(l) {
    K.flags |= 4;
    var t = K.updateQueue;
    if (t === null) ((t = on()), (K.updateQueue = t), (t.events = [l]));
    else {
      var e = t.events;
      e === null ? (t.events = [l]) : e.push(l);
    }
  }
  function gr(l) {
    var t = _l().memoizedState;
    return (
      h0({ ref: t, nextImpl: l }),
      function () {
        if ((nl & 2) !== 0) throw Error(o(440));
        return t.impl.apply(void 0, arguments);
      }
    );
  }
  function Sr(l, t) {
    return vn(4, 2, l, t);
  }
  function br(l, t) {
    return vn(4, 4, l, t);
  }
  function pr(l, t) {
    if (typeof t == "function") {
      l = l();
      var e = t(l);
      return function () {
        typeof e == "function" ? e() : t(null);
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
  function Er(l, t, e) {
    ((e = e != null ? e.concat([l]) : null), vn(4, 4, pr.bind(null, t, l), e));
  }
  function rc() {}
  function zr(l, t) {
    var e = _l();
    t = t === void 0 ? null : t;
    var u = e.memoizedState;
    return t !== null && Pi(t, u[1]) ? u[0] : ((e.memoizedState = [l, t]), l);
  }
  function Tr(l, t) {
    var e = _l();
    t = t === void 0 ? null : t;
    var u = e.memoizedState;
    if (t !== null && Pi(t, u[1])) return u[0];
    if (((u = l()), Qe)) {
      Pt(!0);
      try {
        l();
      } finally {
        Pt(!1);
      }
    }
    return ((e.memoizedState = [u, t]), u);
  }
  function sc(l, t, e) {
    return e === void 0 || ((Zt & 1073741824) !== 0 && (k & 261930) === 0)
      ? (l.memoizedState = t)
      : ((l.memoizedState = e), (l = Os()), (K.lanes |= l), (ve |= l), e);
  }
  function Or(l, t, e, u) {
    return ft(e, t)
      ? e
      : du.current !== null
        ? ((l = sc(l, e, u)), ft(l, t) || (Hl = !0), l)
        : (Zt & 42) === 0 || ((Zt & 1073741824) !== 0 && (k & 261930) === 0)
          ? ((Hl = !0), (l.memoizedState = e))
          : ((l = Os()), (K.lanes |= l), (ve |= l), t);
  }
  function Ar(l, t, e, u, a) {
    var n = U.p;
    U.p = n !== 0 && 8 > n ? n : 8;
    var i = p.T,
      c = {};
    ((p.T = c), yc(l, !1, t, e));
    try {
      var r = a(),
        g = p.S;
      if (
        (g !== null && g(c, r),
        r !== null && typeof r == "object" && typeof r.then == "function")
      ) {
        var E = s0(r, u);
        ea(l, t, E, yt(l));
      } else ea(l, t, u, yt(l));
    } catch (A) {
      ea(l, t, { then: function () {}, status: "rejected", reason: A }, yt());
    } finally {
      ((U.p = n),
        i !== null && c.types !== null && (i.types = c.types),
        (p.T = i));
    }
  }
  function g0() {}
  function dc(l, t, e, u) {
    if (l.tag !== 5) throw Error(o(476));
    var a = Mr(l).queue;
    Ar(
      l,
      a,
      t,
      G,
      e === null
        ? g0
        : function () {
            return (_r(l), e(u));
          },
    );
  }
  function Mr(l) {
    var t = l.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: G,
      baseState: G,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Lt,
        lastRenderedState: G,
      },
      next: null,
    };
    var e = {};
    return (
      (t.next = {
        memoizedState: e,
        baseState: e,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Lt,
          lastRenderedState: e,
        },
        next: null,
      }),
      (l.memoizedState = t),
      (l = l.alternate),
      l !== null && (l.memoizedState = t),
      t
    );
  }
  function _r(l) {
    var t = Mr(l);
    (t.next === null && (t = l.alternate.memoizedState),
      ea(l, t.next.queue, {}, yt()));
  }
  function vc() {
    return Kl(ba);
  }
  function Dr() {
    return _l().memoizedState;
  }
  function Ur() {
    return _l().memoizedState;
  }
  function S0(l) {
    for (var t = l.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var e = yt();
          l = ce(e);
          var u = fe(t, l, e);
          (u !== null && (at(u, t, e), ku(u, t, e)),
            (t = { cache: Zi() }),
            (l.payload = t));
          return;
      }
      t = t.return;
    }
  }
  function b0(l, t, e) {
    var u = yt();
    ((e = {
      lane: u,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
      yn(l)
        ? Rr(t, e)
        : ((e = Ri(l, t, e, u)), e !== null && (at(e, l, u), Hr(e, t, u))));
  }
  function Nr(l, t, e) {
    var u = yt();
    ea(l, t, e, u);
  }
  function ea(l, t, e, u) {
    var a = {
      lane: u,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    };
    if (yn(l)) Rr(t, a);
    else {
      var n = l.alternate;
      if (
        l.lanes === 0 &&
        (n === null || n.lanes === 0) &&
        ((n = t.lastRenderedReducer), n !== null)
      )
        try {
          var i = t.lastRenderedState,
            c = n(i, e);
          if (((a.hasEagerState = !0), (a.eagerState = c), ft(c, i)))
            return (wa(l, t, a, 0), hl === null && Ja(), !1);
        } catch {}
      if (((e = Ri(l, t, a, u)), e !== null))
        return (at(e, l, u), Hr(e, t, u), !0);
    }
    return !1;
  }
  function yc(l, t, e, u) {
    if (
      ((u = {
        lane: 2,
        revertLane: Jc(),
        gesture: null,
        action: u,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      yn(l))
    ) {
      if (t) throw Error(o(479));
    } else ((t = Ri(l, e, u, 2)), t !== null && at(t, l, 2));
  }
  function yn(l) {
    var t = l.alternate;
    return l === K || (t !== null && t === K);
  }
  function Rr(l, t) {
    vu = cn = !0;
    var e = l.pending;
    (e === null ? (t.next = t) : ((t.next = e.next), (e.next = t)),
      (l.pending = t));
  }
  function Hr(l, t, e) {
    if ((e & 4194048) !== 0) {
      var u = t.lanes;
      ((u &= l.pendingLanes), (e |= u), (t.lanes = e), Bf(l, e));
    }
  }
  var ua = {
    readContext: Kl,
    use: rn,
    useCallback: Tl,
    useContext: Tl,
    useEffect: Tl,
    useImperativeHandle: Tl,
    useLayoutEffect: Tl,
    useInsertionEffect: Tl,
    useMemo: Tl,
    useReducer: Tl,
    useRef: Tl,
    useState: Tl,
    useDebugValue: Tl,
    useDeferredValue: Tl,
    useTransition: Tl,
    useSyncExternalStore: Tl,
    useId: Tl,
    useHostTransitionStatus: Tl,
    useFormState: Tl,
    useActionState: Tl,
    useOptimistic: Tl,
    useMemoCache: Tl,
    useCacheRefresh: Tl,
  };
  ua.useEffectEvent = Tl;
  var Cr = {
      readContext: Kl,
      use: rn,
      useCallback: function (l, t) {
        return ((kl().memoizedState = [l, t === void 0 ? null : t]), l);
      },
      useContext: Kl,
      useEffect: hr,
      useImperativeHandle: function (l, t, e) {
        ((e = e != null ? e.concat([l]) : null),
          dn(4194308, 4, pr.bind(null, t, l), e));
      },
      useLayoutEffect: function (l, t) {
        return dn(4194308, 4, l, t);
      },
      useInsertionEffect: function (l, t) {
        dn(4, 2, l, t);
      },
      useMemo: function (l, t) {
        var e = kl();
        t = t === void 0 ? null : t;
        var u = l();
        if (Qe) {
          Pt(!0);
          try {
            l();
          } finally {
            Pt(!1);
          }
        }
        return ((e.memoizedState = [u, t]), u);
      },
      useReducer: function (l, t, e) {
        var u = kl();
        if (e !== void 0) {
          var a = e(t);
          if (Qe) {
            Pt(!0);
            try {
              e(t);
            } finally {
              Pt(!1);
            }
          }
        } else a = t;
        return (
          (u.memoizedState = u.baseState = a),
          (l = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: l,
            lastRenderedState: a,
          }),
          (u.queue = l),
          (l = l.dispatch = b0.bind(null, K, l)),
          [u.memoizedState, l]
        );
      },
      useRef: function (l) {
        var t = kl();
        return ((l = { current: l }), (t.memoizedState = l));
      },
      useState: function (l) {
        l = cc(l);
        var t = l.queue,
          e = Nr.bind(null, K, t);
        return ((t.dispatch = e), [l.memoizedState, e]);
      },
      useDebugValue: rc,
      useDeferredValue: function (l, t) {
        var e = kl();
        return sc(e, l, t);
      },
      useTransition: function () {
        var l = cc(!1);
        return (
          (l = Ar.bind(null, K, l.queue, !0, !1)),
          (kl().memoizedState = l),
          [!1, l]
        );
      },
      useSyncExternalStore: function (l, t, e) {
        var u = K,
          a = kl();
        if (P) {
          if (e === void 0) throw Error(o(407));
          e = e();
        } else {
          if (((e = t()), hl === null)) throw Error(o(349));
          (k & 127) !== 0 || lr(u, t, e);
        }
        a.memoizedState = e;
        var n = { value: e, getSnapshot: t };
        return (
          (a.queue = n),
          hr(er.bind(null, u, n, l), [l]),
          (u.flags |= 2048),
          mu(9, { destroy: void 0 }, tr.bind(null, u, n, e, t), null),
          e
        );
      },
      useId: function () {
        var l = kl(),
          t = hl.identifierPrefix;
        if (P) {
          var e = Rt,
            u = Nt;
          ((e = (u & ~(1 << (32 - ct(u) - 1))).toString(32) + e),
            (t = "_" + t + "R_" + e),
            (e = fn++),
            0 < e && (t += "H" + e.toString(32)),
            (t += "_"));
        } else ((e = d0++), (t = "_" + t + "r_" + e.toString(32) + "_"));
        return (l.memoizedState = t);
      },
      useHostTransitionStatus: vc,
      useFormState: sr,
      useActionState: sr,
      useOptimistic: function (l) {
        var t = kl();
        t.memoizedState = t.baseState = l;
        var e = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null,
        };
        return (
          (t.queue = e),
          (t = yc.bind(null, K, !0, e)),
          (e.dispatch = t),
          [l, t]
        );
      },
      useMemoCache: ac,
      useCacheRefresh: function () {
        return (kl().memoizedState = S0.bind(null, K));
      },
      useEffectEvent: function (l) {
        var t = kl(),
          e = { impl: l };
        return (
          (t.memoizedState = e),
          function () {
            if ((nl & 2) !== 0) throw Error(o(440));
            return e.impl.apply(void 0, arguments);
          }
        );
      },
    },
    mc = {
      readContext: Kl,
      use: rn,
      useCallback: zr,
      useContext: Kl,
      useEffect: oc,
      useImperativeHandle: Er,
      useInsertionEffect: Sr,
      useLayoutEffect: br,
      useMemo: Tr,
      useReducer: sn,
      useRef: mr,
      useState: function () {
        return sn(Lt);
      },
      useDebugValue: rc,
      useDeferredValue: function (l, t) {
        var e = _l();
        return Or(e, vl.memoizedState, l, t);
      },
      useTransition: function () {
        var l = sn(Lt)[0],
          t = _l().memoizedState;
        return [typeof l == "boolean" ? l : ta(l), t];
      },
      useSyncExternalStore: Po,
      useId: Dr,
      useHostTransitionStatus: vc,
      useFormState: dr,
      useActionState: dr,
      useOptimistic: function (l, t) {
        var e = _l();
        return nr(e, vl, l, t);
      },
      useMemoCache: ac,
      useCacheRefresh: Ur,
    };
  mc.useEffectEvent = gr;
  var jr = {
    readContext: Kl,
    use: rn,
    useCallback: zr,
    useContext: Kl,
    useEffect: oc,
    useImperativeHandle: Er,
    useInsertionEffect: Sr,
    useLayoutEffect: br,
    useMemo: Tr,
    useReducer: ic,
    useRef: mr,
    useState: function () {
      return ic(Lt);
    },
    useDebugValue: rc,
    useDeferredValue: function (l, t) {
      var e = _l();
      return vl === null ? sc(e, l, t) : Or(e, vl.memoizedState, l, t);
    },
    useTransition: function () {
      var l = ic(Lt)[0],
        t = _l().memoizedState;
      return [typeof l == "boolean" ? l : ta(l), t];
    },
    useSyncExternalStore: Po,
    useId: Dr,
    useHostTransitionStatus: vc,
    useFormState: yr,
    useActionState: yr,
    useOptimistic: function (l, t) {
      var e = _l();
      return vl !== null
        ? nr(e, vl, l, t)
        : ((e.baseState = l), [l, e.queue.dispatch]);
    },
    useMemoCache: ac,
    useCacheRefresh: Ur,
  };
  jr.useEffectEvent = gr;
  function hc(l, t, e, u) {
    ((t = l.memoizedState),
      (e = e(u, t)),
      (e = e == null ? t : C({}, t, e)),
      (l.memoizedState = e),
      l.lanes === 0 && (l.updateQueue.baseState = e));
  }
  var gc = {
    enqueueSetState: function (l, t, e) {
      l = l._reactInternals;
      var u = yt(),
        a = ce(u);
      ((a.payload = t),
        e != null && (a.callback = e),
        (t = fe(l, a, u)),
        t !== null && (at(t, l, u), ku(t, l, u)));
    },
    enqueueReplaceState: function (l, t, e) {
      l = l._reactInternals;
      var u = yt(),
        a = ce(u);
      ((a.tag = 1),
        (a.payload = t),
        e != null && (a.callback = e),
        (t = fe(l, a, u)),
        t !== null && (at(t, l, u), ku(t, l, u)));
    },
    enqueueForceUpdate: function (l, t) {
      l = l._reactInternals;
      var e = yt(),
        u = ce(e);
      ((u.tag = 2),
        t != null && (u.callback = t),
        (t = fe(l, u, e)),
        t !== null && (at(t, l, e), ku(t, l, e)));
    },
  };
  function qr(l, t, e, u, a, n, i) {
    return (
      (l = l.stateNode),
      typeof l.shouldComponentUpdate == "function"
        ? l.shouldComponentUpdate(u, n, i)
        : t.prototype && t.prototype.isPureReactComponent
          ? !Lu(e, u) || !Lu(a, n)
          : !0
    );
  }
  function Br(l, t, e, u) {
    ((l = t.state),
      typeof t.componentWillReceiveProps == "function" &&
        t.componentWillReceiveProps(e, u),
      typeof t.UNSAFE_componentWillReceiveProps == "function" &&
        t.UNSAFE_componentWillReceiveProps(e, u),
      t.state !== l && gc.enqueueReplaceState(t, t.state, null));
  }
  function xe(l, t) {
    var e = t;
    if ("ref" in t) {
      e = {};
      for (var u in t) u !== "ref" && (e[u] = t[u]);
    }
    if ((l = l.defaultProps)) {
      e === t && (e = C({}, e));
      for (var a in l) e[a] === void 0 && (e[a] = l[a]);
    }
    return e;
  }
  function Yr(l) {
    Ka(l);
  }
  function Gr(l) {
    console.error(l);
  }
  function Xr(l) {
    Ka(l);
  }
  function mn(l, t) {
    try {
      var e = l.onUncaughtError;
      e(t.value, { componentStack: t.stack });
    } catch (u) {
      setTimeout(function () {
        throw u;
      });
    }
  }
  function Qr(l, t, e) {
    try {
      var u = l.onCaughtError;
      u(e.value, {
        componentStack: e.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null,
      });
    } catch (a) {
      setTimeout(function () {
        throw a;
      });
    }
  }
  function Sc(l, t, e) {
    return (
      (e = ce(e)),
      (e.tag = 3),
      (e.payload = { element: null }),
      (e.callback = function () {
        mn(l, t);
      }),
      e
    );
  }
  function xr(l) {
    return ((l = ce(l)), (l.tag = 3), l);
  }
  function Zr(l, t, e, u) {
    var a = e.type.getDerivedStateFromError;
    if (typeof a == "function") {
      var n = u.value;
      ((l.payload = function () {
        return a(n);
      }),
        (l.callback = function () {
          Qr(t, e, u);
        }));
    }
    var i = e.stateNode;
    i !== null &&
      typeof i.componentDidCatch == "function" &&
      (l.callback = function () {
        (Qr(t, e, u),
          typeof a != "function" &&
            (ye === null ? (ye = new Set([this])) : ye.add(this)));
        var c = u.stack;
        this.componentDidCatch(u.value, {
          componentStack: c !== null ? c : "",
        });
      });
  }
  function p0(l, t, e, u, a) {
    if (
      ((e.flags |= 32768),
      u !== null && typeof u == "object" && typeof u.then == "function")
    ) {
      if (
        ((t = e.alternate),
        t !== null && cu(t, e, a, !0),
        (e = rt.current),
        e !== null)
      ) {
        switch (e.tag) {
          case 31:
          case 13:
            return (
              Ot === null ? _n() : e.alternate === null && Ol === 0 && (Ol = 3),
              (e.flags &= -257),
              (e.flags |= 65536),
              (e.lanes = a),
              u === tn
                ? (e.flags |= 16384)
                : ((t = e.updateQueue),
                  t === null ? (e.updateQueue = new Set([u])) : t.add(u),
                  Lc(l, u, a)),
              !1
            );
          case 22:
            return (
              (e.flags |= 65536),
              u === tn
                ? (e.flags |= 16384)
                : ((t = e.updateQueue),
                  t === null
                    ? ((t = {
                        transitions: null,
                        markerInstances: null,
                        retryQueue: new Set([u]),
                      }),
                      (e.updateQueue = t))
                    : ((e = t.retryQueue),
                      e === null ? (t.retryQueue = new Set([u])) : e.add(u)),
                  Lc(l, u, a)),
              !1
            );
        }
        throw Error(o(435, e.tag));
      }
      return (Lc(l, u, a), _n(), !1);
    }
    if (P)
      return (
        (t = rt.current),
        t !== null
          ? ((t.flags & 65536) === 0 && (t.flags |= 256),
            (t.flags |= 65536),
            (t.lanes = a),
            u !== Yi && ((l = Error(o(422), { cause: u })), Ju(pt(l, e))))
          : (u !== Yi && ((t = Error(o(423), { cause: u })), Ju(pt(t, e))),
            (l = l.current.alternate),
            (l.flags |= 65536),
            (a &= -a),
            (l.lanes |= a),
            (u = pt(u, e)),
            (a = Sc(l.stateNode, u, a)),
            Wi(l, a),
            Ol !== 4 && (Ol = 2)),
        !1
      );
    var n = Error(o(520), { cause: u });
    if (
      ((n = pt(n, e)),
      sa === null ? (sa = [n]) : sa.push(n),
      Ol !== 4 && (Ol = 2),
      t === null)
    )
      return !0;
    ((u = pt(u, e)), (e = t));
    do {
      switch (e.tag) {
        case 3:
          return (
            (e.flags |= 65536),
            (l = a & -a),
            (e.lanes |= l),
            (l = Sc(e.stateNode, u, l)),
            Wi(e, l),
            !1
          );
        case 1:
          if (
            ((t = e.type),
            (n = e.stateNode),
            (e.flags & 128) === 0 &&
              (typeof t.getDerivedStateFromError == "function" ||
                (n !== null &&
                  typeof n.componentDidCatch == "function" &&
                  (ye === null || !ye.has(n)))))
          )
            return (
              (e.flags |= 65536),
              (a &= -a),
              (e.lanes |= a),
              (a = xr(a)),
              Zr(a, l, e, u),
              Wi(e, a),
              !1
            );
      }
      e = e.return;
    } while (e !== null);
    return !1;
  }
  var bc = Error(o(461)),
    Hl = !1;
  function Jl(l, t, e, u) {
    t.child = l === null ? Jo(t, null, e, u) : Xe(t, l.child, e, u);
  }
  function Lr(l, t, e, u, a) {
    e = e.render;
    var n = t.ref;
    if ("ref" in u) {
      var i = {};
      for (var c in u) c !== "ref" && (i[c] = u[c]);
    } else i = u;
    return (
      qe(t),
      (u = lc(l, t, e, i, n, a)),
      (c = tc()),
      l !== null && !Hl
        ? (ec(l, t, a), Vt(l, t, a))
        : (P && c && qi(t), (t.flags |= 1), Jl(l, t, u, a), t.child)
    );
  }
  function Vr(l, t, e, u, a) {
    if (l === null) {
      var n = e.type;
      return typeof n == "function" &&
        !Hi(n) &&
        n.defaultProps === void 0 &&
        e.compare === null
        ? ((t.tag = 15), (t.type = n), Kr(l, t, n, u, a))
        : ((l = $a(e.type, null, u, t, t.mode, a)),
          (l.ref = t.ref),
          (l.return = t),
          (t.child = l));
    }
    if (((n = l.child), !_c(l, a))) {
      var i = n.memoizedProps;
      if (
        ((e = e.compare), (e = e !== null ? e : Lu), e(i, u) && l.ref === t.ref)
      )
        return Vt(l, t, a);
    }
    return (
      (t.flags |= 1),
      (l = Gt(n, u)),
      (l.ref = t.ref),
      (l.return = t),
      (t.child = l)
    );
  }
  function Kr(l, t, e, u, a) {
    if (l !== null) {
      var n = l.memoizedProps;
      if (Lu(n, u) && l.ref === t.ref)
        if (((Hl = !1), (t.pendingProps = u = n), _c(l, a)))
          (l.flags & 131072) !== 0 && (Hl = !0);
        else return ((t.lanes = l.lanes), Vt(l, t, a));
    }
    return pc(l, t, e, u, a);
  }
  function Jr(l, t, e, u) {
    var a = u.children,
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
      u.mode === "hidden")
    ) {
      if ((t.flags & 128) !== 0) {
        if (((n = n !== null ? n.baseLanes | e : e), l !== null)) {
          for (u = t.child = l.child, a = 0; u !== null; )
            ((a = a | u.lanes | u.childLanes), (u = u.sibling));
          u = a & ~n;
        } else ((u = 0), (t.child = null));
        return wr(l, t, n, e, u);
      }
      if ((e & 536870912) !== 0)
        ((t.memoizedState = { baseLanes: 0, cachePool: null }),
          l !== null && Pa(t, n !== null ? n.cachePool : null),
          n !== null ? $o(t, n) : Fi(),
          Fo(t));
      else
        return (
          (u = t.lanes = 536870912),
          wr(l, t, n !== null ? n.baseLanes | e : e, e, u)
        );
    } else
      n !== null
        ? (Pa(t, n.cachePool), $o(t, n), re(), (t.memoizedState = null))
        : (l !== null && Pa(t, null), Fi(), re());
    return (Jl(l, t, a, e), t.child);
  }
  function aa(l, t) {
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
  function wr(l, t, e, u, a) {
    var n = Vi();
    return (
      (n = n === null ? null : { parent: Nl._currentValue, pool: n }),
      (t.memoizedState = { baseLanes: e, cachePool: n }),
      l !== null && Pa(t, null),
      Fi(),
      Fo(t),
      l !== null && cu(l, t, u, !0),
      (t.childLanes = a),
      null
    );
  }
  function hn(l, t) {
    return (
      (t = Sn({ mode: t.mode, children: t.children }, l.mode)),
      (t.ref = l.ref),
      (l.child = t),
      (t.return = l),
      t
    );
  }
  function Wr(l, t, e) {
    return (
      Xe(t, l.child, null, e),
      (l = hn(t, t.pendingProps)),
      (l.flags |= 2),
      st(t),
      (t.memoizedState = null),
      l
    );
  }
  function E0(l, t, e) {
    var u = t.pendingProps,
      a = (t.flags & 128) !== 0;
    if (((t.flags &= -129), l === null)) {
      if (P) {
        if (u.mode === "hidden")
          return ((l = hn(t, u)), (t.lanes = 536870912), aa(null, l));
        if (
          (Ii(t),
          (l = Sl)
            ? ((l = id(l, Tt)),
              (l = l !== null && l.data === "&" ? l : null),
              l !== null &&
                ((t.memoizedState = {
                  dehydrated: l,
                  treeContext: ee !== null ? { id: Nt, overflow: Rt } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (e = Ro(l)),
                (e.return = t),
                (t.child = e),
                (Vl = t),
                (Sl = null)))
            : (l = null),
          l === null)
        )
          throw ae(t);
        return ((t.lanes = 536870912), null);
      }
      return hn(t, u);
    }
    var n = l.memoizedState;
    if (n !== null) {
      var i = n.dehydrated;
      if ((Ii(t), a))
        if (t.flags & 256) ((t.flags &= -257), (t = Wr(l, t, e)));
        else if (t.memoizedState !== null)
          ((t.child = l.child), (t.flags |= 128), (t = null));
        else throw Error(o(558));
      else if (
        (Hl || cu(l, t, e, !1), (a = (e & l.childLanes) !== 0), Hl || a)
      ) {
        if (
          ((u = hl),
          u !== null && ((i = Yf(u, e)), i !== 0 && i !== n.retryLane))
        )
          throw ((n.retryLane = i), Re(l, i), at(u, l, i), bc);
        (_n(), (t = Wr(l, t, e)));
      } else
        ((l = n.treeContext),
          (Sl = At(i.nextSibling)),
          (Vl = t),
          (P = !0),
          (ue = null),
          (Tt = !1),
          l !== null && jo(t, l),
          (t = hn(t, u)),
          (t.flags |= 4096));
      return t;
    }
    return (
      (l = Gt(l.child, { mode: u.mode, children: u.children })),
      (l.ref = t.ref),
      (t.child = l),
      (l.return = t),
      l
    );
  }
  function gn(l, t) {
    var e = t.ref;
    if (e === null) l !== null && l.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof e != "function" && typeof e != "object") throw Error(o(284));
      (l === null || l.ref !== e) && (t.flags |= 4194816);
    }
  }
  function pc(l, t, e, u, a) {
    return (
      qe(t),
      (e = lc(l, t, e, u, void 0, a)),
      (u = tc()),
      l !== null && !Hl
        ? (ec(l, t, a), Vt(l, t, a))
        : (P && u && qi(t), (t.flags |= 1), Jl(l, t, e, a), t.child)
    );
  }
  function $r(l, t, e, u, a, n) {
    return (
      qe(t),
      (t.updateQueue = null),
      (e = Io(t, u, e, a)),
      ko(l),
      (u = tc()),
      l !== null && !Hl
        ? (ec(l, t, n), Vt(l, t, n))
        : (P && u && qi(t), (t.flags |= 1), Jl(l, t, e, n), t.child)
    );
  }
  function Fr(l, t, e, u, a) {
    if ((qe(t), t.stateNode === null)) {
      var n = uu,
        i = e.contextType;
      (typeof i == "object" && i !== null && (n = Kl(i)),
        (n = new e(u, n)),
        (t.memoizedState =
          n.state !== null && n.state !== void 0 ? n.state : null),
        (n.updater = gc),
        (t.stateNode = n),
        (n._reactInternals = t),
        (n = t.stateNode),
        (n.props = u),
        (n.state = t.memoizedState),
        (n.refs = {}),
        Ji(t),
        (i = e.contextType),
        (n.context = typeof i == "object" && i !== null ? Kl(i) : uu),
        (n.state = t.memoizedState),
        (i = e.getDerivedStateFromProps),
        typeof i == "function" && (hc(t, e, i, u), (n.state = t.memoizedState)),
        typeof e.getDerivedStateFromProps == "function" ||
          typeof n.getSnapshotBeforeUpdate == "function" ||
          (typeof n.UNSAFE_componentWillMount != "function" &&
            typeof n.componentWillMount != "function") ||
          ((i = n.state),
          typeof n.componentWillMount == "function" && n.componentWillMount(),
          typeof n.UNSAFE_componentWillMount == "function" &&
            n.UNSAFE_componentWillMount(),
          i !== n.state && gc.enqueueReplaceState(n, n.state, null),
          Pu(t, u, n, a),
          Iu(),
          (n.state = t.memoizedState)),
        typeof n.componentDidMount == "function" && (t.flags |= 4194308),
        (u = !0));
    } else if (l === null) {
      n = t.stateNode;
      var c = t.memoizedProps,
        r = xe(e, c);
      n.props = r;
      var g = n.context,
        E = e.contextType;
      ((i = uu), typeof E == "object" && E !== null && (i = Kl(E)));
      var A = e.getDerivedStateFromProps;
      ((E =
        typeof A == "function" ||
        typeof n.getSnapshotBeforeUpdate == "function"),
        (c = t.pendingProps !== c),
        E ||
          (typeof n.UNSAFE_componentWillReceiveProps != "function" &&
            typeof n.componentWillReceiveProps != "function") ||
          ((c || g !== i) && Br(t, n, u, i)),
        (ie = !1));
      var S = t.memoizedState;
      ((n.state = S),
        Pu(t, u, n, a),
        Iu(),
        (g = t.memoizedState),
        c || S !== g || ie
          ? (typeof A == "function" && (hc(t, e, A, u), (g = t.memoizedState)),
            (r = ie || qr(t, e, r, u, S, g, i))
              ? (E ||
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
                (t.memoizedProps = u),
                (t.memoizedState = g)),
            (n.props = u),
            (n.state = g),
            (n.context = i),
            (u = r))
          : (typeof n.componentDidMount == "function" && (t.flags |= 4194308),
            (u = !1)));
    } else {
      ((n = t.stateNode),
        wi(l, t),
        (i = t.memoizedProps),
        (E = xe(e, i)),
        (n.props = E),
        (A = t.pendingProps),
        (S = n.context),
        (g = e.contextType),
        (r = uu),
        typeof g == "object" && g !== null && (r = Kl(g)),
        (c = e.getDerivedStateFromProps),
        (g =
          typeof c == "function" ||
          typeof n.getSnapshotBeforeUpdate == "function") ||
          (typeof n.UNSAFE_componentWillReceiveProps != "function" &&
            typeof n.componentWillReceiveProps != "function") ||
          ((i !== A || S !== r) && Br(t, n, u, r)),
        (ie = !1),
        (S = t.memoizedState),
        (n.state = S),
        Pu(t, u, n, a),
        Iu());
      var b = t.memoizedState;
      i !== A ||
      S !== b ||
      ie ||
      (l !== null && l.dependencies !== null && ka(l.dependencies))
        ? (typeof c == "function" && (hc(t, e, c, u), (b = t.memoizedState)),
          (E =
            ie ||
            qr(t, e, E, u, S, b, r) ||
            (l !== null && l.dependencies !== null && ka(l.dependencies)))
            ? (g ||
                (typeof n.UNSAFE_componentWillUpdate != "function" &&
                  typeof n.componentWillUpdate != "function") ||
                (typeof n.componentWillUpdate == "function" &&
                  n.componentWillUpdate(u, b, r),
                typeof n.UNSAFE_componentWillUpdate == "function" &&
                  n.UNSAFE_componentWillUpdate(u, b, r)),
              typeof n.componentDidUpdate == "function" && (t.flags |= 4),
              typeof n.getSnapshotBeforeUpdate == "function" &&
                (t.flags |= 1024))
            : (typeof n.componentDidUpdate != "function" ||
                (i === l.memoizedProps && S === l.memoizedState) ||
                (t.flags |= 4),
              typeof n.getSnapshotBeforeUpdate != "function" ||
                (i === l.memoizedProps && S === l.memoizedState) ||
                (t.flags |= 1024),
              (t.memoizedProps = u),
              (t.memoizedState = b)),
          (n.props = u),
          (n.state = b),
          (n.context = r),
          (u = E))
        : (typeof n.componentDidUpdate != "function" ||
            (i === l.memoizedProps && S === l.memoizedState) ||
            (t.flags |= 4),
          typeof n.getSnapshotBeforeUpdate != "function" ||
            (i === l.memoizedProps && S === l.memoizedState) ||
            (t.flags |= 1024),
          (u = !1));
    }
    return (
      (n = u),
      gn(l, t),
      (u = (t.flags & 128) !== 0),
      n || u
        ? ((n = t.stateNode),
          (e =
            u && typeof e.getDerivedStateFromError != "function"
              ? null
              : n.render()),
          (t.flags |= 1),
          l !== null && u
            ? ((t.child = Xe(t, l.child, null, a)),
              (t.child = Xe(t, null, e, a)))
            : Jl(l, t, e, a),
          (t.memoizedState = n.state),
          (l = t.child))
        : (l = Vt(l, t, a)),
      l
    );
  }
  function kr(l, t, e, u) {
    return (Ce(), (t.flags |= 256), Jl(l, t, e, u), t.child);
  }
  var Ec = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null,
  };
  function zc(l) {
    return { baseLanes: l, cachePool: Qo() };
  }
  function Tc(l, t, e) {
    return ((l = l !== null ? l.childLanes & ~e : 0), t && (l |= vt), l);
  }
  function Ir(l, t, e) {
    var u = t.pendingProps,
      a = !1,
      n = (t.flags & 128) !== 0,
      i;
    if (
      ((i = n) ||
        (i =
          l !== null && l.memoizedState === null ? !1 : (Ml.current & 2) !== 0),
      i && ((a = !0), (t.flags &= -129)),
      (i = (t.flags & 32) !== 0),
      (t.flags &= -33),
      l === null)
    ) {
      if (P) {
        if (
          (a ? oe(t) : re(),
          (l = Sl)
            ? ((l = id(l, Tt)),
              (l = l !== null && l.data !== "&" ? l : null),
              l !== null &&
                ((t.memoizedState = {
                  dehydrated: l,
                  treeContext: ee !== null ? { id: Nt, overflow: Rt } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (e = Ro(l)),
                (e.return = t),
                (t.child = e),
                (Vl = t),
                (Sl = null)))
            : (l = null),
          l === null)
        )
          throw ae(t);
        return (nf(l) ? (t.lanes = 32) : (t.lanes = 536870912), null);
      }
      var c = u.children;
      return (
        (u = u.fallback),
        a
          ? (re(),
            (a = t.mode),
            (c = Sn({ mode: "hidden", children: c }, a)),
            (u = He(u, a, e, null)),
            (c.return = t),
            (u.return = t),
            (c.sibling = u),
            (t.child = c),
            (u = t.child),
            (u.memoizedState = zc(e)),
            (u.childLanes = Tc(l, i, e)),
            (t.memoizedState = Ec),
            aa(null, u))
          : (oe(t), Oc(t, c))
      );
    }
    var r = l.memoizedState;
    if (r !== null && ((c = r.dehydrated), c !== null)) {
      if (n)
        t.flags & 256
          ? (oe(t), (t.flags &= -257), (t = Ac(l, t, e)))
          : t.memoizedState !== null
            ? (re(), (t.child = l.child), (t.flags |= 128), (t = null))
            : (re(),
              (c = u.fallback),
              (a = t.mode),
              (u = Sn({ mode: "visible", children: u.children }, a)),
              (c = He(c, a, e, null)),
              (c.flags |= 2),
              (u.return = t),
              (c.return = t),
              (u.sibling = c),
              (t.child = u),
              Xe(t, l.child, null, e),
              (u = t.child),
              (u.memoizedState = zc(e)),
              (u.childLanes = Tc(l, i, e)),
              (t.memoizedState = Ec),
              (t = aa(null, u)));
      else if ((oe(t), nf(c))) {
        if (((i = c.nextSibling && c.nextSibling.dataset), i)) var g = i.dgst;
        ((i = g),
          (u = Error(o(419))),
          (u.stack = ""),
          (u.digest = i),
          Ju({ value: u, source: null, stack: null }),
          (t = Ac(l, t, e)));
      } else if (
        (Hl || cu(l, t, e, !1), (i = (e & l.childLanes) !== 0), Hl || i)
      ) {
        if (
          ((i = hl),
          i !== null && ((u = Yf(i, e)), u !== 0 && u !== r.retryLane))
        )
          throw ((r.retryLane = u), Re(l, u), at(i, l, u), bc);
        (af(c) || _n(), (t = Ac(l, t, e)));
      } else
        af(c)
          ? ((t.flags |= 192), (t.child = l.child), (t = null))
          : ((l = r.treeContext),
            (Sl = At(c.nextSibling)),
            (Vl = t),
            (P = !0),
            (ue = null),
            (Tt = !1),
            l !== null && jo(t, l),
            (t = Oc(t, u.children)),
            (t.flags |= 4096));
      return t;
    }
    return a
      ? (re(),
        (c = u.fallback),
        (a = t.mode),
        (r = l.child),
        (g = r.sibling),
        (u = Gt(r, { mode: "hidden", children: u.children })),
        (u.subtreeFlags = r.subtreeFlags & 65011712),
        g !== null ? (c = Gt(g, c)) : ((c = He(c, a, e, null)), (c.flags |= 2)),
        (c.return = t),
        (u.return = t),
        (u.sibling = c),
        (t.child = u),
        aa(null, u),
        (u = t.child),
        (c = l.child.memoizedState),
        c === null
          ? (c = zc(e))
          : ((a = c.cachePool),
            a !== null
              ? ((r = Nl._currentValue),
                (a = a.parent !== r ? { parent: r, pool: r } : a))
              : (a = Qo()),
            (c = { baseLanes: c.baseLanes | e, cachePool: a })),
        (u.memoizedState = c),
        (u.childLanes = Tc(l, i, e)),
        (t.memoizedState = Ec),
        aa(l.child, u))
      : (oe(t),
        (e = l.child),
        (l = e.sibling),
        (e = Gt(e, { mode: "visible", children: u.children })),
        (e.return = t),
        (e.sibling = null),
        l !== null &&
          ((i = t.deletions),
          i === null ? ((t.deletions = [l]), (t.flags |= 16)) : i.push(l)),
        (t.child = e),
        (t.memoizedState = null),
        e);
  }
  function Oc(l, t) {
    return (
      (t = Sn({ mode: "visible", children: t }, l.mode)),
      (t.return = l),
      (l.child = t)
    );
  }
  function Sn(l, t) {
    return ((l = ot(22, l, null, t)), (l.lanes = 0), l);
  }
  function Ac(l, t, e) {
    return (
      Xe(t, l.child, null, e),
      (l = Oc(t, t.pendingProps.children)),
      (l.flags |= 2),
      (t.memoizedState = null),
      l
    );
  }
  function Pr(l, t, e) {
    l.lanes |= t;
    var u = l.alternate;
    (u !== null && (u.lanes |= t), Qi(l.return, t, e));
  }
  function Mc(l, t, e, u, a, n) {
    var i = l.memoizedState;
    i === null
      ? (l.memoizedState = {
          isBackwards: t,
          rendering: null,
          renderingStartTime: 0,
          last: u,
          tail: e,
          tailMode: a,
          treeForkCount: n,
        })
      : ((i.isBackwards = t),
        (i.rendering = null),
        (i.renderingStartTime = 0),
        (i.last = u),
        (i.tail = e),
        (i.tailMode = a),
        (i.treeForkCount = n));
  }
  function ls(l, t, e) {
    var u = t.pendingProps,
      a = u.revealOrder,
      n = u.tail;
    u = u.children;
    var i = Ml.current,
      c = (i & 2) !== 0;
    if (
      (c ? ((i = (i & 1) | 2), (t.flags |= 128)) : (i &= 1),
      N(Ml, i),
      Jl(l, t, u, e),
      (u = P ? Ku : 0),
      !c && l !== null && (l.flags & 128) !== 0)
    )
      l: for (l = t.child; l !== null; ) {
        if (l.tag === 13) l.memoizedState !== null && Pr(l, e, t);
        else if (l.tag === 19) Pr(l, e, t);
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
    switch (a) {
      case "forwards":
        for (e = t.child, a = null; e !== null; )
          ((l = e.alternate),
            l !== null && nn(l) === null && (a = e),
            (e = e.sibling));
        ((e = a),
          e === null
            ? ((a = t.child), (t.child = null))
            : ((a = e.sibling), (e.sibling = null)),
          Mc(t, !1, a, e, n, u));
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (e = null, a = t.child, t.child = null; a !== null; ) {
          if (((l = a.alternate), l !== null && nn(l) === null)) {
            t.child = a;
            break;
          }
          ((l = a.sibling), (a.sibling = e), (e = a), (a = l));
        }
        Mc(t, !0, e, null, n, u);
        break;
      case "together":
        Mc(t, !1, null, null, void 0, u);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Vt(l, t, e) {
    if (
      (l !== null && (t.dependencies = l.dependencies),
      (ve |= t.lanes),
      (e & t.childLanes) === 0)
    )
      if (l !== null) {
        if ((cu(l, t, e, !1), (e & t.childLanes) === 0)) return null;
      } else return null;
    if (l !== null && t.child !== l.child) throw Error(o(153));
    if (t.child !== null) {
      for (
        l = t.child, e = Gt(l, l.pendingProps), t.child = e, e.return = t;
        l.sibling !== null;
      )
        ((l = l.sibling),
          (e = e.sibling = Gt(l, l.pendingProps)),
          (e.return = t));
      e.sibling = null;
    }
    return t.child;
  }
  function _c(l, t) {
    return (l.lanes & t) !== 0
      ? !0
      : ((l = l.dependencies), !!(l !== null && ka(l)));
  }
  function z0(l, t, e) {
    switch (t.tag) {
      case 3:
        (Fl(t, t.stateNode.containerInfo),
          ne(t, Nl, l.memoizedState.cache),
          Ce());
        break;
      case 27:
      case 5:
        Nu(t);
        break;
      case 4:
        Fl(t, t.stateNode.containerInfo);
        break;
      case 10:
        ne(t, t.type, t.memoizedProps.value);
        break;
      case 31:
        if (t.memoizedState !== null) return ((t.flags |= 128), Ii(t), null);
        break;
      case 13:
        var u = t.memoizedState;
        if (u !== null)
          return u.dehydrated !== null
            ? (oe(t), (t.flags |= 128), null)
            : (e & t.child.childLanes) !== 0
              ? Ir(l, t, e)
              : (oe(t), (l = Vt(l, t, e)), l !== null ? l.sibling : null);
        oe(t);
        break;
      case 19:
        var a = (l.flags & 128) !== 0;
        if (
          ((u = (e & t.childLanes) !== 0),
          u || (cu(l, t, e, !1), (u = (e & t.childLanes) !== 0)),
          a)
        ) {
          if (u) return ls(l, t, e);
          t.flags |= 128;
        }
        if (
          ((a = t.memoizedState),
          a !== null &&
            ((a.rendering = null), (a.tail = null), (a.lastEffect = null)),
          N(Ml, Ml.current),
          u)
        )
          break;
        return null;
      case 22:
        return ((t.lanes = 0), Jr(l, t, e, t.pendingProps));
      case 24:
        ne(t, Nl, l.memoizedState.cache);
    }
    return Vt(l, t, e);
  }
  function ts(l, t, e) {
    if (l !== null)
      if (l.memoizedProps !== t.pendingProps) Hl = !0;
      else {
        if (!_c(l, e) && (t.flags & 128) === 0) return ((Hl = !1), z0(l, t, e));
        Hl = (l.flags & 131072) !== 0;
      }
    else ((Hl = !1), P && (t.flags & 1048576) !== 0 && Co(t, Ku, t.index));
    switch (((t.lanes = 0), t.tag)) {
      case 16:
        l: {
          var u = t.pendingProps;
          if (((l = Ye(t.elementType)), (t.type = l), typeof l == "function"))
            Hi(l)
              ? ((u = xe(l, u)), (t.tag = 1), (t = Fr(null, t, l, u, e)))
              : ((t.tag = 0), (t = pc(null, t, l, u, e)));
          else {
            if (l != null) {
              var a = l.$$typeof;
              if (a === Gl) {
                ((t.tag = 11), (t = Lr(null, t, l, u, e)));
                break l;
              } else if (a === B) {
                ((t.tag = 14), (t = Vr(null, t, l, u, e)));
                break l;
              }
            }
            throw ((t = $l(l) || l), Error(o(306, t, "")));
          }
        }
        return t;
      case 0:
        return pc(l, t, t.type, t.pendingProps, e);
      case 1:
        return ((u = t.type), (a = xe(u, t.pendingProps)), Fr(l, t, u, a, e));
      case 3:
        l: {
          if ((Fl(t, t.stateNode.containerInfo), l === null))
            throw Error(o(387));
          u = t.pendingProps;
          var n = t.memoizedState;
          ((a = n.element), wi(l, t), Pu(t, u, null, e));
          var i = t.memoizedState;
          if (
            ((u = i.cache),
            ne(t, Nl, u),
            u !== n.cache && xi(t, [Nl], e, !0),
            Iu(),
            (u = i.element),
            n.isDehydrated)
          )
            if (
              ((n = { element: u, isDehydrated: !1, cache: i.cache }),
              (t.updateQueue.baseState = n),
              (t.memoizedState = n),
              t.flags & 256)
            ) {
              t = kr(l, t, u, e);
              break l;
            } else if (u !== a) {
              ((a = pt(Error(o(424)), t)), Ju(a), (t = kr(l, t, u, e)));
              break l;
            } else
              for (
                l = t.stateNode.containerInfo,
                  l.nodeType === 9
                    ? (l = l.body)
                    : (l = l.nodeName === "HTML" ? l.ownerDocument.body : l),
                  Sl = At(l.firstChild),
                  Vl = t,
                  P = !0,
                  ue = null,
                  Tt = !0,
                  e = Jo(t, null, u, e),
                  t.child = e;
                e;
              )
                ((e.flags = (e.flags & -3) | 4096), (e = e.sibling));
          else {
            if ((Ce(), u === a)) {
              t = Vt(l, t, e);
              break l;
            }
            Jl(l, t, u, e);
          }
          t = t.child;
        }
        return t;
      case 26:
        return (
          gn(l, t),
          l === null
            ? (e = dd(t.type, null, t.pendingProps, null))
              ? (t.memoizedState = e)
              : P ||
                ((e = t.type),
                (l = t.pendingProps),
                (u = jn(w.current).createElement(e)),
                (u[Ll] = t),
                (u[Il] = l),
                wl(u, e, l),
                Xl(u),
                (t.stateNode = u))
            : (t.memoizedState = dd(
                t.type,
                l.memoizedProps,
                t.pendingProps,
                l.memoizedState,
              )),
          null
        );
      case 27:
        return (
          Nu(t),
          l === null &&
            P &&
            ((u = t.stateNode = od(t.type, t.pendingProps, w.current)),
            (Vl = t),
            (Tt = !0),
            (a = Sl),
            Se(t.type) ? ((cf = a), (Sl = At(u.firstChild))) : (Sl = a)),
          Jl(l, t, t.pendingProps.children, e),
          gn(l, t),
          l === null && (t.flags |= 4194304),
          t.child
        );
      case 5:
        return (
          l === null &&
            P &&
            ((a = u = Sl) &&
              ((u = I0(u, t.type, t.pendingProps, Tt)),
              u !== null
                ? ((t.stateNode = u),
                  (Vl = t),
                  (Sl = At(u.firstChild)),
                  (Tt = !1),
                  (a = !0))
                : (a = !1)),
            a || ae(t)),
          Nu(t),
          (a = t.type),
          (n = t.pendingProps),
          (i = l !== null ? l.memoizedProps : null),
          (u = n.children),
          tf(a, n) ? (u = null) : i !== null && tf(a, i) && (t.flags |= 32),
          t.memoizedState !== null &&
            ((a = lc(l, t, v0, null, null, e)), (ba._currentValue = a)),
          gn(l, t),
          Jl(l, t, u, e),
          t.child
        );
      case 6:
        return (
          l === null &&
            P &&
            ((l = e = Sl) &&
              ((e = P0(e, t.pendingProps, Tt)),
              e !== null
                ? ((t.stateNode = e), (Vl = t), (Sl = null), (l = !0))
                : (l = !1)),
            l || ae(t)),
          null
        );
      case 13:
        return Ir(l, t, e);
      case 4:
        return (
          Fl(t, t.stateNode.containerInfo),
          (u = t.pendingProps),
          l === null ? (t.child = Xe(t, null, u, e)) : Jl(l, t, u, e),
          t.child
        );
      case 11:
        return Lr(l, t, t.type, t.pendingProps, e);
      case 7:
        return (Jl(l, t, t.pendingProps, e), t.child);
      case 8:
        return (Jl(l, t, t.pendingProps.children, e), t.child);
      case 12:
        return (Jl(l, t, t.pendingProps.children, e), t.child);
      case 10:
        return (
          (u = t.pendingProps),
          ne(t, t.type, u.value),
          Jl(l, t, u.children, e),
          t.child
        );
      case 9:
        return (
          (a = t.type._context),
          (u = t.pendingProps.children),
          qe(t),
          (a = Kl(a)),
          (u = u(a)),
          (t.flags |= 1),
          Jl(l, t, u, e),
          t.child
        );
      case 14:
        return Vr(l, t, t.type, t.pendingProps, e);
      case 15:
        return Kr(l, t, t.type, t.pendingProps, e);
      case 19:
        return ls(l, t, e);
      case 31:
        return E0(l, t, e);
      case 22:
        return Jr(l, t, e, t.pendingProps);
      case 24:
        return (
          qe(t),
          (u = Kl(Nl)),
          l === null
            ? ((a = Vi()),
              a === null &&
                ((a = hl),
                (n = Zi()),
                (a.pooledCache = n),
                n.refCount++,
                n !== null && (a.pooledCacheLanes |= e),
                (a = n)),
              (t.memoizedState = { parent: u, cache: a }),
              Ji(t),
              ne(t, Nl, a))
            : ((l.lanes & e) !== 0 && (wi(l, t), Pu(t, null, null, e), Iu()),
              (a = l.memoizedState),
              (n = t.memoizedState),
              a.parent !== u
                ? ((a = { parent: u, cache: u }),
                  (t.memoizedState = a),
                  t.lanes === 0 &&
                    (t.memoizedState = t.updateQueue.baseState = a),
                  ne(t, Nl, u))
                : ((u = n.cache),
                  ne(t, Nl, u),
                  u !== a.cache && xi(t, [Nl], e, !0))),
          Jl(l, t, t.pendingProps.children, e),
          t.child
        );
      case 29:
        throw t.pendingProps;
    }
    throw Error(o(156, t.tag));
  }
  function Kt(l) {
    l.flags |= 4;
  }
  function Dc(l, t, e, u, a) {
    if (((t = (l.mode & 32) !== 0) && (t = !1), t)) {
      if (((l.flags |= 16777216), (a & 335544128) === a))
        if (l.stateNode.complete) l.flags |= 8192;
        else if (Ds()) l.flags |= 8192;
        else throw ((Ge = tn), Ki);
    } else l.flags &= -16777217;
  }
  function es(l, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      l.flags &= -16777217;
    else if (((l.flags |= 16777216), !gd(t)))
      if (Ds()) l.flags |= 8192;
      else throw ((Ge = tn), Ki);
  }
  function bn(l, t) {
    (t !== null && (l.flags |= 4),
      l.flags & 16384 &&
        ((t = l.tag !== 22 ? jf() : 536870912), (l.lanes |= t), (bu |= t)));
  }
  function na(l, t) {
    if (!P)
      switch (l.tailMode) {
        case "hidden":
          t = l.tail;
          for (var e = null; t !== null; )
            (t.alternate !== null && (e = t), (t = t.sibling));
          e === null ? (l.tail = null) : (e.sibling = null);
          break;
        case "collapsed":
          e = l.tail;
          for (var u = null; e !== null; )
            (e.alternate !== null && (u = e), (e = e.sibling));
          u === null
            ? t || l.tail === null
              ? (l.tail = null)
              : (l.tail.sibling = null)
            : (u.sibling = null);
      }
  }
  function bl(l) {
    var t = l.alternate !== null && l.alternate.child === l.child,
      e = 0,
      u = 0;
    if (t)
      for (var a = l.child; a !== null; )
        ((e |= a.lanes | a.childLanes),
          (u |= a.subtreeFlags & 65011712),
          (u |= a.flags & 65011712),
          (a.return = l),
          (a = a.sibling));
    else
      for (a = l.child; a !== null; )
        ((e |= a.lanes | a.childLanes),
          (u |= a.subtreeFlags),
          (u |= a.flags),
          (a.return = l),
          (a = a.sibling));
    return ((l.subtreeFlags |= u), (l.childLanes = e), t);
  }
  function T0(l, t, e) {
    var u = t.pendingProps;
    switch ((Bi(t), t.tag)) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (bl(t), null);
      case 1:
        return (bl(t), null);
      case 3:
        return (
          (e = t.stateNode),
          (u = null),
          l !== null && (u = l.memoizedState.cache),
          t.memoizedState.cache !== u && (t.flags |= 2048),
          xt(Nl),
          Al(),
          e.pendingContext &&
            ((e.context = e.pendingContext), (e.pendingContext = null)),
          (l === null || l.child === null) &&
            (iu(t)
              ? Kt(t)
              : l === null ||
                (l.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
                ((t.flags |= 1024), Gi())),
          bl(t),
          null
        );
      case 26:
        var a = t.type,
          n = t.memoizedState;
        return (
          l === null
            ? (Kt(t),
              n !== null ? (bl(t), es(t, n)) : (bl(t), Dc(t, a, null, u, e)))
            : n
              ? n !== l.memoizedState
                ? (Kt(t), bl(t), es(t, n))
                : (bl(t), (t.flags &= -16777217))
              : ((l = l.memoizedProps),
                l !== u && Kt(t),
                bl(t),
                Dc(t, a, l, u, e)),
          null
        );
      case 27:
        if (
          (Ua(t),
          (e = w.current),
          (a = t.type),
          l !== null && t.stateNode != null)
        )
          l.memoizedProps !== u && Kt(t);
        else {
          if (!u) {
            if (t.stateNode === null) throw Error(o(166));
            return (bl(t), null);
          }
          ((l = R.current),
            iu(t) ? qo(t) : ((l = od(a, u, e)), (t.stateNode = l), Kt(t)));
        }
        return (bl(t), null);
      case 5:
        if ((Ua(t), (a = t.type), l !== null && t.stateNode != null))
          l.memoizedProps !== u && Kt(t);
        else {
          if (!u) {
            if (t.stateNode === null) throw Error(o(166));
            return (bl(t), null);
          }
          if (((n = R.current), iu(t))) qo(t);
          else {
            var i = jn(w.current);
            switch (n) {
              case 1:
                n = i.createElementNS("http://www.w3.org/2000/svg", a);
                break;
              case 2:
                n = i.createElementNS("http://www.w3.org/1998/Math/MathML", a);
                break;
              default:
                switch (a) {
                  case "svg":
                    n = i.createElementNS("http://www.w3.org/2000/svg", a);
                    break;
                  case "math":
                    n = i.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      a,
                    );
                    break;
                  case "script":
                    ((n = i.createElement("div")),
                      (n.innerHTML = "<script><\/script>"),
                      (n = n.removeChild(n.firstChild)));
                    break;
                  case "select":
                    ((n =
                      typeof u.is == "string"
                        ? i.createElement("select", { is: u.is })
                        : i.createElement("select")),
                      u.multiple
                        ? (n.multiple = !0)
                        : u.size && (n.size = u.size));
                    break;
                  default:
                    n =
                      typeof u.is == "string"
                        ? i.createElement(a, { is: u.is })
                        : i.createElement(a);
                }
            }
            ((n[Ll] = t), (n[Il] = u));
            l: for (i = t.child; i !== null; ) {
              if (i.tag === 5 || i.tag === 6) n.appendChild(i.stateNode);
              else if (i.tag !== 4 && i.tag !== 27 && i.child !== null) {
                ((i.child.return = i), (i = i.child));
                continue;
              }
              if (i === t) break l;
              for (; i.sibling === null; ) {
                if (i.return === null || i.return === t) break l;
                i = i.return;
              }
              ((i.sibling.return = i.return), (i = i.sibling));
            }
            t.stateNode = n;
            l: switch ((wl(n, a, u), a)) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                u = !!u.autoFocus;
                break l;
              case "img":
                u = !0;
                break l;
              default:
                u = !1;
            }
            u && Kt(t);
          }
        }
        return (
          bl(t),
          Dc(t, t.type, l === null ? null : l.memoizedProps, t.pendingProps, e),
          null
        );
      case 6:
        if (l && t.stateNode != null) l.memoizedProps !== u && Kt(t);
        else {
          if (typeof u != "string" && t.stateNode === null) throw Error(o(166));
          if (((l = w.current), iu(t))) {
            if (
              ((l = t.stateNode),
              (e = t.memoizedProps),
              (u = null),
              (a = Vl),
              a !== null)
            )
              switch (a.tag) {
                case 27:
                case 5:
                  u = a.memoizedProps;
              }
            ((l[Ll] = t),
              (l = !!(
                l.nodeValue === e ||
                (u !== null && u.suppressHydrationWarning === !0) ||
                Is(l.nodeValue, e)
              )),
              l || ae(t, !0));
          } else
            ((l = jn(l).createTextNode(u)), (l[Ll] = t), (t.stateNode = l));
        }
        return (bl(t), null);
      case 31:
        if (((e = t.memoizedState), l === null || l.memoizedState !== null)) {
          if (((u = iu(t)), e !== null)) {
            if (l === null) {
              if (!u) throw Error(o(318));
              if (
                ((l = t.memoizedState),
                (l = l !== null ? l.dehydrated : null),
                !l)
              )
                throw Error(o(557));
              l[Ll] = t;
            } else
              (Ce(),
                (t.flags & 128) === 0 && (t.memoizedState = null),
                (t.flags |= 4));
            (bl(t), (l = !1));
          } else
            ((e = Gi()),
              l !== null &&
                l.memoizedState !== null &&
                (l.memoizedState.hydrationErrors = e),
              (l = !0));
          if (!l) return t.flags & 256 ? (st(t), t) : (st(t), null);
          if ((t.flags & 128) !== 0) throw Error(o(558));
        }
        return (bl(t), null);
      case 13:
        if (
          ((u = t.memoizedState),
          l === null ||
            (l.memoizedState !== null && l.memoizedState.dehydrated !== null))
        ) {
          if (((a = iu(t)), u !== null && u.dehydrated !== null)) {
            if (l === null) {
              if (!a) throw Error(o(318));
              if (
                ((a = t.memoizedState),
                (a = a !== null ? a.dehydrated : null),
                !a)
              )
                throw Error(o(317));
              a[Ll] = t;
            } else
              (Ce(),
                (t.flags & 128) === 0 && (t.memoizedState = null),
                (t.flags |= 4));
            (bl(t), (a = !1));
          } else
            ((a = Gi()),
              l !== null &&
                l.memoizedState !== null &&
                (l.memoizedState.hydrationErrors = a),
              (a = !0));
          if (!a) return t.flags & 256 ? (st(t), t) : (st(t), null);
        }
        return (
          st(t),
          (t.flags & 128) !== 0
            ? ((t.lanes = e), t)
            : ((e = u !== null),
              (l = l !== null && l.memoizedState !== null),
              e &&
                ((u = t.child),
                (a = null),
                u.alternate !== null &&
                  u.alternate.memoizedState !== null &&
                  u.alternate.memoizedState.cachePool !== null &&
                  (a = u.alternate.memoizedState.cachePool.pool),
                (n = null),
                u.memoizedState !== null &&
                  u.memoizedState.cachePool !== null &&
                  (n = u.memoizedState.cachePool.pool),
                n !== a && (u.flags |= 2048)),
              e !== l && e && (t.child.flags |= 8192),
              bn(t, t.updateQueue),
              bl(t),
              null)
        );
      case 4:
        return (Al(), l === null && Fc(t.stateNode.containerInfo), bl(t), null);
      case 10:
        return (xt(t.type), bl(t), null);
      case 19:
        if ((T(Ml), (u = t.memoizedState), u === null)) return (bl(t), null);
        if (((a = (t.flags & 128) !== 0), (n = u.rendering), n === null))
          if (a) na(u, !1);
          else {
            if (Ol !== 0 || (l !== null && (l.flags & 128) !== 0))
              for (l = t.child; l !== null; ) {
                if (((n = nn(l)), n !== null)) {
                  for (
                    t.flags |= 128,
                      na(u, !1),
                      l = n.updateQueue,
                      t.updateQueue = l,
                      bn(t, l),
                      t.subtreeFlags = 0,
                      l = e,
                      e = t.child;
                    e !== null;
                  )
                    (No(e, l), (e = e.sibling));
                  return (
                    N(Ml, (Ml.current & 1) | 2),
                    P && Xt(t, u.treeForkCount),
                    t.child
                  );
                }
                l = l.sibling;
              }
            u.tail !== null &&
              nt() > On &&
              ((t.flags |= 128), (a = !0), na(u, !1), (t.lanes = 4194304));
          }
        else {
          if (!a)
            if (((l = nn(n)), l !== null)) {
              if (
                ((t.flags |= 128),
                (a = !0),
                (l = l.updateQueue),
                (t.updateQueue = l),
                bn(t, l),
                na(u, !0),
                u.tail === null &&
                  u.tailMode === "hidden" &&
                  !n.alternate &&
                  !P)
              )
                return (bl(t), null);
            } else
              2 * nt() - u.renderingStartTime > On &&
                e !== 536870912 &&
                ((t.flags |= 128), (a = !0), na(u, !1), (t.lanes = 4194304));
          u.isBackwards
            ? ((n.sibling = t.child), (t.child = n))
            : ((l = u.last),
              l !== null ? (l.sibling = n) : (t.child = n),
              (u.last = n));
        }
        return u.tail !== null
          ? ((l = u.tail),
            (u.rendering = l),
            (u.tail = l.sibling),
            (u.renderingStartTime = nt()),
            (l.sibling = null),
            (e = Ml.current),
            N(Ml, a ? (e & 1) | 2 : e & 1),
            P && Xt(t, u.treeForkCount),
            l)
          : (bl(t), null);
      case 22:
      case 23:
        return (
          st(t),
          ki(),
          (u = t.memoizedState !== null),
          l !== null
            ? (l.memoizedState !== null) !== u && (t.flags |= 8192)
            : u && (t.flags |= 8192),
          u
            ? (e & 536870912) !== 0 &&
              (t.flags & 128) === 0 &&
              (bl(t), t.subtreeFlags & 6 && (t.flags |= 8192))
            : bl(t),
          (e = t.updateQueue),
          e !== null && bn(t, e.retryQueue),
          (e = null),
          l !== null &&
            l.memoizedState !== null &&
            l.memoizedState.cachePool !== null &&
            (e = l.memoizedState.cachePool.pool),
          (u = null),
          t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (u = t.memoizedState.cachePool.pool),
          u !== e && (t.flags |= 2048),
          l !== null && T(Be),
          null
        );
      case 24:
        return (
          (e = null),
          l !== null && (e = l.memoizedState.cache),
          t.memoizedState.cache !== e && (t.flags |= 2048),
          xt(Nl),
          bl(t),
          null
        );
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function O0(l, t) {
    switch ((Bi(t), t.tag)) {
      case 1:
        return (
          (l = t.flags),
          l & 65536 ? ((t.flags = (l & -65537) | 128), t) : null
        );
      case 3:
        return (
          xt(Nl),
          Al(),
          (l = t.flags),
          (l & 65536) !== 0 && (l & 128) === 0
            ? ((t.flags = (l & -65537) | 128), t)
            : null
        );
      case 26:
      case 27:
      case 5:
        return (Ua(t), null);
      case 31:
        if (t.memoizedState !== null) {
          if ((st(t), t.alternate === null)) throw Error(o(340));
          Ce();
        }
        return (
          (l = t.flags),
          l & 65536 ? ((t.flags = (l & -65537) | 128), t) : null
        );
      case 13:
        if (
          (st(t), (l = t.memoizedState), l !== null && l.dehydrated !== null)
        ) {
          if (t.alternate === null) throw Error(o(340));
          Ce();
        }
        return (
          (l = t.flags),
          l & 65536 ? ((t.flags = (l & -65537) | 128), t) : null
        );
      case 19:
        return (T(Ml), null);
      case 4:
        return (Al(), null);
      case 10:
        return (xt(t.type), null);
      case 22:
      case 23:
        return (
          st(t),
          ki(),
          l !== null && T(Be),
          (l = t.flags),
          l & 65536 ? ((t.flags = (l & -65537) | 128), t) : null
        );
      case 24:
        return (xt(Nl), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function us(l, t) {
    switch ((Bi(t), t.tag)) {
      case 3:
        (xt(Nl), Al());
        break;
      case 26:
      case 27:
      case 5:
        Ua(t);
        break;
      case 4:
        Al();
        break;
      case 31:
        t.memoizedState !== null && st(t);
        break;
      case 13:
        st(t);
        break;
      case 19:
        T(Ml);
        break;
      case 10:
        xt(t.type);
        break;
      case 22:
      case 23:
        (st(t), ki(), l !== null && T(Be));
        break;
      case 24:
        xt(Nl);
    }
  }
  function ia(l, t) {
    try {
      var e = t.updateQueue,
        u = e !== null ? e.lastEffect : null;
      if (u !== null) {
        var a = u.next;
        e = a;
        do {
          if ((e.tag & l) === l) {
            u = void 0;
            var n = e.create,
              i = e.inst;
            ((u = n()), (i.destroy = u));
          }
          e = e.next;
        } while (e !== a);
      }
    } catch (c) {
      sl(t, t.return, c);
    }
  }
  function se(l, t, e) {
    try {
      var u = t.updateQueue,
        a = u !== null ? u.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        u = n;
        do {
          if ((u.tag & l) === l) {
            var i = u.inst,
              c = i.destroy;
            if (c !== void 0) {
              ((i.destroy = void 0), (a = t));
              var r = e,
                g = c;
              try {
                g();
              } catch (E) {
                sl(a, r, E);
              }
            }
          }
          u = u.next;
        } while (u !== n);
      }
    } catch (E) {
      sl(t, t.return, E);
    }
  }
  function as(l) {
    var t = l.updateQueue;
    if (t !== null) {
      var e = l.stateNode;
      try {
        Wo(t, e);
      } catch (u) {
        sl(l, l.return, u);
      }
    }
  }
  function ns(l, t, e) {
    ((e.props = xe(l.type, l.memoizedProps)), (e.state = l.memoizedState));
    try {
      e.componentWillUnmount();
    } catch (u) {
      sl(l, t, u);
    }
  }
  function ca(l, t) {
    try {
      var e = l.ref;
      if (e !== null) {
        switch (l.tag) {
          case 26:
          case 27:
          case 5:
            var u = l.stateNode;
            break;
          case 30:
            u = l.stateNode;
            break;
          default:
            u = l.stateNode;
        }
        typeof e == "function" ? (l.refCleanup = e(u)) : (e.current = u);
      }
    } catch (a) {
      sl(l, t, a);
    }
  }
  function Ht(l, t) {
    var e = l.ref,
      u = l.refCleanup;
    if (e !== null)
      if (typeof u == "function")
        try {
          u();
        } catch (a) {
          sl(l, t, a);
        } finally {
          ((l.refCleanup = null),
            (l = l.alternate),
            l != null && (l.refCleanup = null));
        }
      else if (typeof e == "function")
        try {
          e(null);
        } catch (a) {
          sl(l, t, a);
        }
      else e.current = null;
  }
  function is(l) {
    var t = l.type,
      e = l.memoizedProps,
      u = l.stateNode;
    try {
      l: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          e.autoFocus && u.focus();
          break l;
        case "img":
          e.src ? (u.src = e.src) : e.srcSet && (u.srcset = e.srcSet);
      }
    } catch (a) {
      sl(l, l.return, a);
    }
  }
  function Uc(l, t, e) {
    try {
      var u = l.stateNode;
      (J0(u, l.type, e, t), (u[Il] = t));
    } catch (a) {
      sl(l, l.return, a);
    }
  }
  function cs(l) {
    return (
      l.tag === 5 ||
      l.tag === 3 ||
      l.tag === 26 ||
      (l.tag === 27 && Se(l.type)) ||
      l.tag === 4
    );
  }
  function Nc(l) {
    l: for (;;) {
      for (; l.sibling === null; ) {
        if (l.return === null || cs(l.return)) return null;
        l = l.return;
      }
      for (
        l.sibling.return = l.return, l = l.sibling;
        l.tag !== 5 && l.tag !== 6 && l.tag !== 18;
      ) {
        if (
          (l.tag === 27 && Se(l.type)) ||
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
  function Rc(l, t, e) {
    var u = l.tag;
    if (u === 5 || u === 6)
      ((l = l.stateNode),
        t
          ? (e.nodeType === 9
              ? e.body
              : e.nodeName === "HTML"
                ? e.ownerDocument.body
                : e
            ).insertBefore(l, t)
          : ((t =
              e.nodeType === 9
                ? e.body
                : e.nodeName === "HTML"
                  ? e.ownerDocument.body
                  : e),
            t.appendChild(l),
            (e = e._reactRootContainer),
            e != null || t.onclick !== null || (t.onclick = Bt)));
    else if (
      u !== 4 &&
      (u === 27 && Se(l.type) && ((e = l.stateNode), (t = null)),
      (l = l.child),
      l !== null)
    )
      for (Rc(l, t, e), l = l.sibling; l !== null; )
        (Rc(l, t, e), (l = l.sibling));
  }
  function pn(l, t, e) {
    var u = l.tag;
    if (u === 5 || u === 6)
      ((l = l.stateNode), t ? e.insertBefore(l, t) : e.appendChild(l));
    else if (
      u !== 4 &&
      (u === 27 && Se(l.type) && (e = l.stateNode), (l = l.child), l !== null)
    )
      for (pn(l, t, e), l = l.sibling; l !== null; )
        (pn(l, t, e), (l = l.sibling));
  }
  function fs(l) {
    var t = l.stateNode,
      e = l.memoizedProps;
    try {
      for (var u = l.type, a = t.attributes; a.length; )
        t.removeAttributeNode(a[0]);
      (wl(t, u, e), (t[Ll] = l), (t[Il] = e));
    } catch (n) {
      sl(l, l.return, n);
    }
  }
  var Jt = !1,
    Cl = !1,
    Hc = !1,
    os = typeof WeakSet == "function" ? WeakSet : Set,
    Ql = null;
  function A0(l, t) {
    if (((l = l.containerInfo), (Pc = xn), (l = Eo(l)), Ai(l))) {
      if ("selectionStart" in l)
        var e = { start: l.selectionStart, end: l.selectionEnd };
      else
        l: {
          e = ((e = l.ownerDocument) && e.defaultView) || window;
          var u = e.getSelection && e.getSelection();
          if (u && u.rangeCount !== 0) {
            e = u.anchorNode;
            var a = u.anchorOffset,
              n = u.focusNode;
            u = u.focusOffset;
            try {
              (e.nodeType, n.nodeType);
            } catch {
              e = null;
              break l;
            }
            var i = 0,
              c = -1,
              r = -1,
              g = 0,
              E = 0,
              A = l,
              S = null;
            t: for (;;) {
              for (
                var b;
                A !== e || (a !== 0 && A.nodeType !== 3) || (c = i + a),
                  A !== n || (u !== 0 && A.nodeType !== 3) || (r = i + u),
                  A.nodeType === 3 && (i += A.nodeValue.length),
                  (b = A.firstChild) !== null;
              )
                ((S = A), (A = b));
              for (;;) {
                if (A === l) break t;
                if (
                  (S === e && ++g === a && (c = i),
                  S === n && ++E === u && (r = i),
                  (b = A.nextSibling) !== null)
                )
                  break;
                ((A = S), (S = A.parentNode));
              }
              A = b;
            }
            e = c === -1 || r === -1 ? null : { start: c, end: r };
          } else e = null;
        }
      e = e || { start: 0, end: 0 };
    } else e = null;
    for (
      lf = { focusedElem: l, selectionRange: e }, xn = !1, Ql = t;
      Ql !== null;
    )
      if (
        ((t = Ql), (l = t.child), (t.subtreeFlags & 1028) !== 0 && l !== null)
      )
        ((l.return = t), (Ql = l));
      else
        for (; Ql !== null; ) {
          switch (((t = Ql), (n = t.alternate), (l = t.flags), t.tag)) {
            case 0:
              if (
                (l & 4) !== 0 &&
                ((l = t.updateQueue),
                (l = l !== null ? l.events : null),
                l !== null)
              )
                for (e = 0; e < l.length; e++)
                  ((a = l[e]), (a.ref.impl = a.nextImpl));
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((l & 1024) !== 0 && n !== null) {
                ((l = void 0),
                  (e = t),
                  (a = n.memoizedProps),
                  (n = n.memoizedState),
                  (u = e.stateNode));
                try {
                  var H = xe(e.type, a);
                  ((l = u.getSnapshotBeforeUpdate(H, n)),
                    (u.__reactInternalSnapshotBeforeUpdate = l));
                } catch (X) {
                  sl(e, e.return, X);
                }
              }
              break;
            case 3:
              if ((l & 1024) !== 0) {
                if (
                  ((l = t.stateNode.containerInfo), (e = l.nodeType), e === 9)
                )
                  uf(l);
                else if (e === 1)
                  switch (l.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      uf(l);
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
              if ((l & 1024) !== 0) throw Error(o(163));
          }
          if (((l = t.sibling), l !== null)) {
            ((l.return = t.return), (Ql = l));
            break;
          }
          Ql = t.return;
        }
  }
  function rs(l, t, e) {
    var u = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        (Wt(l, e), u & 4 && ia(5, e));
        break;
      case 1:
        if ((Wt(l, e), u & 4))
          if (((l = e.stateNode), t === null))
            try {
              l.componentDidMount();
            } catch (i) {
              sl(e, e.return, i);
            }
          else {
            var a = xe(e.type, t.memoizedProps);
            t = t.memoizedState;
            try {
              l.componentDidUpdate(a, t, l.__reactInternalSnapshotBeforeUpdate);
            } catch (i) {
              sl(e, e.return, i);
            }
          }
        (u & 64 && as(e), u & 512 && ca(e, e.return));
        break;
      case 3:
        if ((Wt(l, e), u & 64 && ((l = e.updateQueue), l !== null))) {
          if (((t = null), e.child !== null))
            switch (e.child.tag) {
              case 27:
              case 5:
                t = e.child.stateNode;
                break;
              case 1:
                t = e.child.stateNode;
            }
          try {
            Wo(l, t);
          } catch (i) {
            sl(e, e.return, i);
          }
        }
        break;
      case 27:
        t === null && u & 4 && fs(e);
      case 26:
      case 5:
        (Wt(l, e), t === null && u & 4 && is(e), u & 512 && ca(e, e.return));
        break;
      case 12:
        Wt(l, e);
        break;
      case 31:
        (Wt(l, e), u & 4 && vs(l, e));
        break;
      case 13:
        (Wt(l, e),
          u & 4 && ys(l, e),
          u & 64 &&
            ((l = e.memoizedState),
            l !== null &&
              ((l = l.dehydrated),
              l !== null && ((e = j0.bind(null, e)), ly(l, e)))));
        break;
      case 22:
        if (((u = e.memoizedState !== null || Jt), !u)) {
          ((t = (t !== null && t.memoizedState !== null) || Cl), (a = Jt));
          var n = Cl;
          ((Jt = u),
            (Cl = t) && !n ? $t(l, e, (e.subtreeFlags & 8772) !== 0) : Wt(l, e),
            (Jt = a),
            (Cl = n));
        }
        break;
      case 30:
        break;
      default:
        Wt(l, e);
    }
  }
  function ss(l) {
    var t = l.alternate;
    (t !== null && ((l.alternate = null), ss(t)),
      (l.child = null),
      (l.deletions = null),
      (l.sibling = null),
      l.tag === 5 && ((t = l.stateNode), t !== null && fi(t)),
      (l.stateNode = null),
      (l.return = null),
      (l.dependencies = null),
      (l.memoizedProps = null),
      (l.memoizedState = null),
      (l.pendingProps = null),
      (l.stateNode = null),
      (l.updateQueue = null));
  }
  var pl = null,
    lt = !1;
  function wt(l, t, e) {
    for (e = e.child; e !== null; ) (ds(l, t, e), (e = e.sibling));
  }
  function ds(l, t, e) {
    if (it && typeof it.onCommitFiberUnmount == "function")
      try {
        it.onCommitFiberUnmount(Ru, e);
      } catch {}
    switch (e.tag) {
      case 26:
        (Cl || Ht(e, t),
          wt(l, t, e),
          e.memoizedState
            ? e.memoizedState.count--
            : e.stateNode && ((e = e.stateNode), e.parentNode.removeChild(e)));
        break;
      case 27:
        Cl || Ht(e, t);
        var u = pl,
          a = lt;
        (Se(e.type) && ((pl = e.stateNode), (lt = !1)),
          wt(l, t, e),
          ha(e.stateNode),
          (pl = u),
          (lt = a));
        break;
      case 5:
        Cl || Ht(e, t);
      case 6:
        if (
          ((u = pl),
          (a = lt),
          (pl = null),
          wt(l, t, e),
          (pl = u),
          (lt = a),
          pl !== null)
        )
          if (lt)
            try {
              (pl.nodeType === 9
                ? pl.body
                : pl.nodeName === "HTML"
                  ? pl.ownerDocument.body
                  : pl
              ).removeChild(e.stateNode);
            } catch (n) {
              sl(e, t, n);
            }
          else
            try {
              pl.removeChild(e.stateNode);
            } catch (n) {
              sl(e, t, n);
            }
        break;
      case 18:
        pl !== null &&
          (lt
            ? ((l = pl),
              ad(
                l.nodeType === 9
                  ? l.body
                  : l.nodeName === "HTML"
                    ? l.ownerDocument.body
                    : l,
                e.stateNode,
              ),
              _u(l))
            : ad(pl, e.stateNode));
        break;
      case 4:
        ((u = pl),
          (a = lt),
          (pl = e.stateNode.containerInfo),
          (lt = !0),
          wt(l, t, e),
          (pl = u),
          (lt = a));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        (se(2, e, t), Cl || se(4, e, t), wt(l, t, e));
        break;
      case 1:
        (Cl ||
          (Ht(e, t),
          (u = e.stateNode),
          typeof u.componentWillUnmount == "function" && ns(e, t, u)),
          wt(l, t, e));
        break;
      case 21:
        wt(l, t, e);
        break;
      case 22:
        ((Cl = (u = Cl) || e.memoizedState !== null), wt(l, t, e), (Cl = u));
        break;
      default:
        wt(l, t, e);
    }
  }
  function vs(l, t) {
    if (
      t.memoizedState === null &&
      ((l = t.alternate), l !== null && ((l = l.memoizedState), l !== null))
    ) {
      l = l.dehydrated;
      try {
        _u(l);
      } catch (e) {
        sl(t, t.return, e);
      }
    }
  }
  function ys(l, t) {
    if (
      t.memoizedState === null &&
      ((l = t.alternate),
      l !== null &&
        ((l = l.memoizedState), l !== null && ((l = l.dehydrated), l !== null)))
    )
      try {
        _u(l);
      } catch (e) {
        sl(t, t.return, e);
      }
  }
  function M0(l) {
    switch (l.tag) {
      case 31:
      case 13:
      case 19:
        var t = l.stateNode;
        return (t === null && (t = l.stateNode = new os()), t);
      case 22:
        return (
          (l = l.stateNode),
          (t = l._retryCache),
          t === null && (t = l._retryCache = new os()),
          t
        );
      default:
        throw Error(o(435, l.tag));
    }
  }
  function En(l, t) {
    var e = M0(l);
    t.forEach(function (u) {
      if (!e.has(u)) {
        e.add(u);
        var a = q0.bind(null, l, u);
        u.then(a, a);
      }
    });
  }
  function tt(l, t) {
    var e = t.deletions;
    if (e !== null)
      for (var u = 0; u < e.length; u++) {
        var a = e[u],
          n = l,
          i = t,
          c = i;
        l: for (; c !== null; ) {
          switch (c.tag) {
            case 27:
              if (Se(c.type)) {
                ((pl = c.stateNode), (lt = !1));
                break l;
              }
              break;
            case 5:
              ((pl = c.stateNode), (lt = !1));
              break l;
            case 3:
            case 4:
              ((pl = c.stateNode.containerInfo), (lt = !0));
              break l;
          }
          c = c.return;
        }
        if (pl === null) throw Error(o(160));
        (ds(n, i, a),
          (pl = null),
          (lt = !1),
          (n = a.alternate),
          n !== null && (n.return = null),
          (a.return = null));
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; ) (ms(t, l), (t = t.sibling));
  }
  var Dt = null;
  function ms(l, t) {
    var e = l.alternate,
      u = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        (tt(t, l),
          et(l),
          u & 4 && (se(3, l, l.return), ia(3, l), se(5, l, l.return)));
        break;
      case 1:
        (tt(t, l),
          et(l),
          u & 512 && (Cl || e === null || Ht(e, e.return)),
          u & 64 &&
            Jt &&
            ((l = l.updateQueue),
            l !== null &&
              ((u = l.callbacks),
              u !== null &&
                ((e = l.shared.hiddenCallbacks),
                (l.shared.hiddenCallbacks = e === null ? u : e.concat(u))))));
        break;
      case 26:
        var a = Dt;
        if (
          (tt(t, l),
          et(l),
          u & 512 && (Cl || e === null || Ht(e, e.return)),
          u & 4)
        ) {
          var n = e !== null ? e.memoizedState : null;
          if (((u = l.memoizedState), e === null))
            if (u === null)
              if (l.stateNode === null) {
                l: {
                  ((u = l.type),
                    (e = l.memoizedProps),
                    (a = a.ownerDocument || a));
                  t: switch (u) {
                    case "title":
                      ((n = a.getElementsByTagName("title")[0]),
                        (!n ||
                          n[ju] ||
                          n[Ll] ||
                          n.namespaceURI === "http://www.w3.org/2000/svg" ||
                          n.hasAttribute("itemprop")) &&
                          ((n = a.createElement(u)),
                          a.head.insertBefore(
                            n,
                            a.querySelector("head > title"),
                          )),
                        wl(n, u, e),
                        (n[Ll] = l),
                        Xl(n),
                        (u = n));
                      break l;
                    case "link":
                      var i = md("link", "href", a).get(u + (e.href || ""));
                      if (i) {
                        for (var c = 0; c < i.length; c++)
                          if (
                            ((n = i[c]),
                            n.getAttribute("href") ===
                              (e.href == null || e.href === ""
                                ? null
                                : e.href) &&
                              n.getAttribute("rel") ===
                                (e.rel == null ? null : e.rel) &&
                              n.getAttribute("title") ===
                                (e.title == null ? null : e.title) &&
                              n.getAttribute("crossorigin") ===
                                (e.crossOrigin == null ? null : e.crossOrigin))
                          ) {
                            i.splice(c, 1);
                            break t;
                          }
                      }
                      ((n = a.createElement(u)),
                        wl(n, u, e),
                        a.head.appendChild(n));
                      break;
                    case "meta":
                      if (
                        (i = md("meta", "content", a).get(
                          u + (e.content || ""),
                        ))
                      ) {
                        for (c = 0; c < i.length; c++)
                          if (
                            ((n = i[c]),
                            n.getAttribute("content") ===
                              (e.content == null ? null : "" + e.content) &&
                              n.getAttribute("name") ===
                                (e.name == null ? null : e.name) &&
                              n.getAttribute("property") ===
                                (e.property == null ? null : e.property) &&
                              n.getAttribute("http-equiv") ===
                                (e.httpEquiv == null ? null : e.httpEquiv) &&
                              n.getAttribute("charset") ===
                                (e.charSet == null ? null : e.charSet))
                          ) {
                            i.splice(c, 1);
                            break t;
                          }
                      }
                      ((n = a.createElement(u)),
                        wl(n, u, e),
                        a.head.appendChild(n));
                      break;
                    default:
                      throw Error(o(468, u));
                  }
                  ((n[Ll] = l), Xl(n), (u = n));
                }
                l.stateNode = u;
              } else hd(a, l.type, l.stateNode);
            else l.stateNode = yd(a, u, l.memoizedProps);
          else
            n !== u
              ? (n === null
                  ? e.stateNode !== null &&
                    ((e = e.stateNode), e.parentNode.removeChild(e))
                  : n.count--,
                u === null
                  ? hd(a, l.type, l.stateNode)
                  : yd(a, u, l.memoizedProps))
              : u === null &&
                l.stateNode !== null &&
                Uc(l, l.memoizedProps, e.memoizedProps);
        }
        break;
      case 27:
        (tt(t, l),
          et(l),
          u & 512 && (Cl || e === null || Ht(e, e.return)),
          e !== null && u & 4 && Uc(l, l.memoizedProps, e.memoizedProps));
        break;
      case 5:
        if (
          (tt(t, l),
          et(l),
          u & 512 && (Cl || e === null || Ht(e, e.return)),
          l.flags & 32)
        ) {
          a = l.stateNode;
          try {
            Fe(a, "");
          } catch (H) {
            sl(l, l.return, H);
          }
        }
        (u & 4 &&
          l.stateNode != null &&
          ((a = l.memoizedProps), Uc(l, a, e !== null ? e.memoizedProps : a)),
          u & 1024 && (Hc = !0));
        break;
      case 6:
        if ((tt(t, l), et(l), u & 4)) {
          if (l.stateNode === null) throw Error(o(162));
          ((u = l.memoizedProps), (e = l.stateNode));
          try {
            e.nodeValue = u;
          } catch (H) {
            sl(l, l.return, H);
          }
        }
        break;
      case 3:
        if (
          ((Yn = null),
          (a = Dt),
          (Dt = qn(t.containerInfo)),
          tt(t, l),
          (Dt = a),
          et(l),
          u & 4 && e !== null && e.memoizedState.isDehydrated)
        )
          try {
            _u(t.containerInfo);
          } catch (H) {
            sl(l, l.return, H);
          }
        Hc && ((Hc = !1), hs(l));
        break;
      case 4:
        ((u = Dt),
          (Dt = qn(l.stateNode.containerInfo)),
          tt(t, l),
          et(l),
          (Dt = u));
        break;
      case 12:
        (tt(t, l), et(l));
        break;
      case 31:
        (tt(t, l),
          et(l),
          u & 4 &&
            ((u = l.updateQueue),
            u !== null && ((l.updateQueue = null), En(l, u))));
        break;
      case 13:
        (tt(t, l),
          et(l),
          l.child.flags & 8192 &&
            (l.memoizedState !== null) !=
              (e !== null && e.memoizedState !== null) &&
            (Tn = nt()),
          u & 4 &&
            ((u = l.updateQueue),
            u !== null && ((l.updateQueue = null), En(l, u))));
        break;
      case 22:
        a = l.memoizedState !== null;
        var r = e !== null && e.memoizedState !== null,
          g = Jt,
          E = Cl;
        if (
          ((Jt = g || a),
          (Cl = E || r),
          tt(t, l),
          (Cl = E),
          (Jt = g),
          et(l),
          u & 8192)
        )
          l: for (
            t = l.stateNode,
              t._visibility = a ? t._visibility & -2 : t._visibility | 1,
              a && (e === null || r || Jt || Cl || Ze(l)),
              e = null,
              t = l;
            ;
          ) {
            if (t.tag === 5 || t.tag === 26) {
              if (e === null) {
                r = e = t;
                try {
                  if (((n = r.stateNode), a))
                    ((i = n.style),
                      typeof i.setProperty == "function"
                        ? i.setProperty("display", "none", "important")
                        : (i.display = "none"));
                  else {
                    c = r.stateNode;
                    var A = r.memoizedProps.style,
                      S =
                        A != null && A.hasOwnProperty("display")
                          ? A.display
                          : null;
                    c.style.display =
                      S == null || typeof S == "boolean" ? "" : ("" + S).trim();
                  }
                } catch (H) {
                  sl(r, r.return, H);
                }
              }
            } else if (t.tag === 6) {
              if (e === null) {
                r = t;
                try {
                  r.stateNode.nodeValue = a ? "" : r.memoizedProps;
                } catch (H) {
                  sl(r, r.return, H);
                }
              }
            } else if (t.tag === 18) {
              if (e === null) {
                r = t;
                try {
                  var b = r.stateNode;
                  a ? nd(b, !0) : nd(r.stateNode, !1);
                } catch (H) {
                  sl(r, r.return, H);
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
              (e === t && (e = null), (t = t.return));
            }
            (e === t && (e = null),
              (t.sibling.return = t.return),
              (t = t.sibling));
          }
        u & 4 &&
          ((u = l.updateQueue),
          u !== null &&
            ((e = u.retryQueue),
            e !== null && ((u.retryQueue = null), En(l, e))));
        break;
      case 19:
        (tt(t, l),
          et(l),
          u & 4 &&
            ((u = l.updateQueue),
            u !== null && ((l.updateQueue = null), En(l, u))));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        (tt(t, l), et(l));
    }
  }
  function et(l) {
    var t = l.flags;
    if (t & 2) {
      try {
        for (var e, u = l.return; u !== null; ) {
          if (cs(u)) {
            e = u;
            break;
          }
          u = u.return;
        }
        if (e == null) throw Error(o(160));
        switch (e.tag) {
          case 27:
            var a = e.stateNode,
              n = Nc(l);
            pn(l, n, a);
            break;
          case 5:
            var i = e.stateNode;
            e.flags & 32 && (Fe(i, ""), (e.flags &= -33));
            var c = Nc(l);
            pn(l, c, i);
            break;
          case 3:
          case 4:
            var r = e.stateNode.containerInfo,
              g = Nc(l);
            Rc(l, g, r);
            break;
          default:
            throw Error(o(161));
        }
      } catch (E) {
        sl(l, l.return, E);
      }
      l.flags &= -3;
    }
    t & 4096 && (l.flags &= -4097);
  }
  function hs(l) {
    if (l.subtreeFlags & 1024)
      for (l = l.child; l !== null; ) {
        var t = l;
        (hs(t),
          t.tag === 5 && t.flags & 1024 && t.stateNode.reset(),
          (l = l.sibling));
      }
  }
  function Wt(l, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; ) (rs(l, t.alternate, t), (t = t.sibling));
  }
  function Ze(l) {
    for (l = l.child; l !== null; ) {
      var t = l;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (se(4, t, t.return), Ze(t));
          break;
        case 1:
          Ht(t, t.return);
          var e = t.stateNode;
          (typeof e.componentWillUnmount == "function" && ns(t, t.return, e),
            Ze(t));
          break;
        case 27:
          ha(t.stateNode);
        case 26:
        case 5:
          (Ht(t, t.return), Ze(t));
          break;
        case 22:
          t.memoizedState === null && Ze(t);
          break;
        case 30:
          Ze(t);
          break;
        default:
          Ze(t);
      }
      l = l.sibling;
    }
  }
  function $t(l, t, e) {
    for (e = e && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var u = t.alternate,
        a = l,
        n = t,
        i = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          ($t(a, n, e), ia(4, n));
          break;
        case 1:
          if (
            ($t(a, n, e),
            (u = n),
            (a = u.stateNode),
            typeof a.componentDidMount == "function")
          )
            try {
              a.componentDidMount();
            } catch (g) {
              sl(u, u.return, g);
            }
          if (((u = n), (a = u.updateQueue), a !== null)) {
            var c = u.stateNode;
            try {
              var r = a.shared.hiddenCallbacks;
              if (r !== null)
                for (a.shared.hiddenCallbacks = null, a = 0; a < r.length; a++)
                  wo(r[a], c);
            } catch (g) {
              sl(u, u.return, g);
            }
          }
          (e && i & 64 && as(n), ca(n, n.return));
          break;
        case 27:
          fs(n);
        case 26:
        case 5:
          ($t(a, n, e), e && u === null && i & 4 && is(n), ca(n, n.return));
          break;
        case 12:
          $t(a, n, e);
          break;
        case 31:
          ($t(a, n, e), e && i & 4 && vs(a, n));
          break;
        case 13:
          ($t(a, n, e), e && i & 4 && ys(a, n));
          break;
        case 22:
          (n.memoizedState === null && $t(a, n, e), ca(n, n.return));
          break;
        case 30:
          break;
        default:
          $t(a, n, e);
      }
      t = t.sibling;
    }
  }
  function Cc(l, t) {
    var e = null;
    (l !== null &&
      l.memoizedState !== null &&
      l.memoizedState.cachePool !== null &&
      (e = l.memoizedState.cachePool.pool),
      (l = null),
      t.memoizedState !== null &&
        t.memoizedState.cachePool !== null &&
        (l = t.memoizedState.cachePool.pool),
      l !== e && (l != null && l.refCount++, e != null && wu(e)));
  }
  function jc(l, t) {
    ((l = null),
      t.alternate !== null && (l = t.alternate.memoizedState.cache),
      (t = t.memoizedState.cache),
      t !== l && (t.refCount++, l != null && wu(l)));
  }
  function Ut(l, t, e, u) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) (gs(l, t, e, u), (t = t.sibling));
  }
  function gs(l, t, e, u) {
    var a = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (Ut(l, t, e, u), a & 2048 && ia(9, t));
        break;
      case 1:
        Ut(l, t, e, u);
        break;
      case 3:
        (Ut(l, t, e, u),
          a & 2048 &&
            ((l = null),
            t.alternate !== null && (l = t.alternate.memoizedState.cache),
            (t = t.memoizedState.cache),
            t !== l && (t.refCount++, l != null && wu(l))));
        break;
      case 12:
        if (a & 2048) {
          (Ut(l, t, e, u), (l = t.stateNode));
          try {
            var n = t.memoizedProps,
              i = n.id,
              c = n.onPostCommit;
            typeof c == "function" &&
              c(
                i,
                t.alternate === null ? "mount" : "update",
                l.passiveEffectDuration,
                -0,
              );
          } catch (r) {
            sl(t, t.return, r);
          }
        } else Ut(l, t, e, u);
        break;
      case 31:
        Ut(l, t, e, u);
        break;
      case 13:
        Ut(l, t, e, u);
        break;
      case 23:
        break;
      case 22:
        ((n = t.stateNode),
          (i = t.alternate),
          t.memoizedState !== null
            ? n._visibility & 2
              ? Ut(l, t, e, u)
              : fa(l, t)
            : n._visibility & 2
              ? Ut(l, t, e, u)
              : ((n._visibility |= 2),
                hu(l, t, e, u, (t.subtreeFlags & 10256) !== 0 || !1)),
          a & 2048 && Cc(i, t));
        break;
      case 24:
        (Ut(l, t, e, u), a & 2048 && jc(t.alternate, t));
        break;
      default:
        Ut(l, t, e, u);
    }
  }
  function hu(l, t, e, u, a) {
    for (
      a = a && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child;
      t !== null;
    ) {
      var n = l,
        i = t,
        c = e,
        r = u,
        g = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          (hu(n, i, c, r, a), ia(8, i));
          break;
        case 23:
          break;
        case 22:
          var E = i.stateNode;
          (i.memoizedState !== null
            ? E._visibility & 2
              ? hu(n, i, c, r, a)
              : fa(n, i)
            : ((E._visibility |= 2), hu(n, i, c, r, a)),
            a && g & 2048 && Cc(i.alternate, i));
          break;
        case 24:
          (hu(n, i, c, r, a), a && g & 2048 && jc(i.alternate, i));
          break;
        default:
          hu(n, i, c, r, a);
      }
      t = t.sibling;
    }
  }
  function fa(l, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var e = l,
          u = t,
          a = u.flags;
        switch (u.tag) {
          case 22:
            (fa(e, u), a & 2048 && Cc(u.alternate, u));
            break;
          case 24:
            (fa(e, u), a & 2048 && jc(u.alternate, u));
            break;
          default:
            fa(e, u);
        }
        t = t.sibling;
      }
  }
  var oa = 8192;
  function gu(l, t, e) {
    if (l.subtreeFlags & oa)
      for (l = l.child; l !== null; ) (Ss(l, t, e), (l = l.sibling));
  }
  function Ss(l, t, e) {
    switch (l.tag) {
      case 26:
        (gu(l, t, e),
          l.flags & oa &&
            l.memoizedState !== null &&
            dy(e, Dt, l.memoizedState, l.memoizedProps));
        break;
      case 5:
        gu(l, t, e);
        break;
      case 3:
      case 4:
        var u = Dt;
        ((Dt = qn(l.stateNode.containerInfo)), gu(l, t, e), (Dt = u));
        break;
      case 22:
        l.memoizedState === null &&
          ((u = l.alternate),
          u !== null && u.memoizedState !== null
            ? ((u = oa), (oa = 16777216), gu(l, t, e), (oa = u))
            : gu(l, t, e));
        break;
      default:
        gu(l, t, e);
    }
  }
  function bs(l) {
    var t = l.alternate;
    if (t !== null && ((l = t.child), l !== null)) {
      t.child = null;
      do ((t = l.sibling), (l.sibling = null), (l = t));
      while (l !== null);
    }
  }
  function ra(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var e = 0; e < t.length; e++) {
          var u = t[e];
          ((Ql = u), Es(u, l));
        }
      bs(l);
    }
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; ) (ps(l), (l = l.sibling));
  }
  function ps(l) {
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        (ra(l), l.flags & 2048 && se(9, l, l.return));
        break;
      case 3:
        ra(l);
        break;
      case 12:
        ra(l);
        break;
      case 22:
        var t = l.stateNode;
        l.memoizedState !== null &&
        t._visibility & 2 &&
        (l.return === null || l.return.tag !== 13)
          ? ((t._visibility &= -3), zn(l))
          : ra(l);
        break;
      default:
        ra(l);
    }
  }
  function zn(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var e = 0; e < t.length; e++) {
          var u = t[e];
          ((Ql = u), Es(u, l));
        }
      bs(l);
    }
    for (l = l.child; l !== null; ) {
      switch (((t = l), t.tag)) {
        case 0:
        case 11:
        case 15:
          (se(8, t, t.return), zn(t));
          break;
        case 22:
          ((e = t.stateNode),
            e._visibility & 2 && ((e._visibility &= -3), zn(t)));
          break;
        default:
          zn(t);
      }
      l = l.sibling;
    }
  }
  function Es(l, t) {
    for (; Ql !== null; ) {
      var e = Ql;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          se(8, e, t);
          break;
        case 23:
        case 22:
          if (e.memoizedState !== null && e.memoizedState.cachePool !== null) {
            var u = e.memoizedState.cachePool.pool;
            u != null && u.refCount++;
          }
          break;
        case 24:
          wu(e.memoizedState.cache);
      }
      if (((u = e.child), u !== null)) ((u.return = e), (Ql = u));
      else
        l: for (e = l; Ql !== null; ) {
          u = Ql;
          var a = u.sibling,
            n = u.return;
          if ((ss(u), u === e)) {
            Ql = null;
            break l;
          }
          if (a !== null) {
            ((a.return = n), (Ql = a));
            break l;
          }
          Ql = n;
        }
    }
  }
  var _0 = {
      getCacheForType: function (l) {
        var t = Kl(Nl),
          e = t.data.get(l);
        return (e === void 0 && ((e = l()), t.data.set(l, e)), e);
      },
      cacheSignal: function () {
        return Kl(Nl).controller.signal;
      },
    },
    D0 = typeof WeakMap == "function" ? WeakMap : Map,
    nl = 0,
    hl = null,
    W = null,
    k = 0,
    rl = 0,
    dt = null,
    de = !1,
    Su = !1,
    qc = !1,
    Ft = 0,
    Ol = 0,
    ve = 0,
    Le = 0,
    Bc = 0,
    vt = 0,
    bu = 0,
    sa = null,
    ut = null,
    Yc = !1,
    Tn = 0,
    zs = 0,
    On = 1 / 0,
    An = null,
    ye = null,
    Yl = 0,
    me = null,
    pu = null,
    kt = 0,
    Gc = 0,
    Xc = null,
    Ts = null,
    da = 0,
    Qc = null;
  function yt() {
    return (nl & 2) !== 0 && k !== 0 ? k & -k : p.T !== null ? Jc() : Gf();
  }
  function Os() {
    if (vt === 0)
      if ((k & 536870912) === 0 || P) {
        var l = Ha;
        ((Ha <<= 1), (Ha & 3932160) === 0 && (Ha = 262144), (vt = l));
      } else vt = 536870912;
    return ((l = rt.current), l !== null && (l.flags |= 32), vt);
  }
  function at(l, t, e) {
    (((l === hl && (rl === 2 || rl === 9)) || l.cancelPendingCommit !== null) &&
      (Eu(l, 0), he(l, k, vt, !1)),
      Cu(l, e),
      ((nl & 2) === 0 || l !== hl) &&
        (l === hl &&
          ((nl & 2) === 0 && (Le |= e), Ol === 4 && he(l, k, vt, !1)),
        Ct(l)));
  }
  function As(l, t, e) {
    if ((nl & 6) !== 0) throw Error(o(327));
    var u = (!e && (t & 127) === 0 && (t & l.expiredLanes) === 0) || Hu(l, t),
      a = u ? R0(l, t) : Zc(l, t, !0),
      n = u;
    do {
      if (a === 0) {
        Su && !u && he(l, t, 0, !1);
        break;
      } else {
        if (((e = l.current.alternate), n && !U0(e))) {
          ((a = Zc(l, t, !1)), (n = !1));
          continue;
        }
        if (a === 2) {
          if (((n = t), l.errorRecoveryDisabledLanes & n)) var i = 0;
          else
            ((i = l.pendingLanes & -536870913),
              (i = i !== 0 ? i : i & 536870912 ? 536870912 : 0));
          if (i !== 0) {
            t = i;
            l: {
              var c = l;
              a = sa;
              var r = c.current.memoizedState.isDehydrated;
              if ((r && (Eu(c, i).flags |= 256), (i = Zc(c, i, !1)), i !== 2)) {
                if (qc && !r) {
                  ((c.errorRecoveryDisabledLanes |= n), (Le |= n), (a = 4));
                  break l;
                }
                ((n = ut),
                  (ut = a),
                  n !== null &&
                    (ut === null ? (ut = n) : ut.push.apply(ut, n)));
              }
              a = i;
            }
            if (((n = !1), a !== 2)) continue;
          }
        }
        if (a === 1) {
          (Eu(l, 0), he(l, t, 0, !0));
          break;
        }
        l: {
          switch (((u = l), (n = a), n)) {
            case 0:
            case 1:
              throw Error(o(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              he(u, t, vt, !de);
              break l;
            case 2:
              ut = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && ((a = Tn + 300 - nt()), 10 < a)) {
            if ((he(u, t, vt, !de), ja(u, 0, !0) !== 0)) break l;
            ((kt = t),
              (u.timeoutHandle = ed(
                Ms.bind(
                  null,
                  u,
                  e,
                  ut,
                  An,
                  Yc,
                  t,
                  vt,
                  Le,
                  bu,
                  de,
                  n,
                  "Throttled",
                  -0,
                  0,
                ),
                a,
              )));
            break l;
          }
          Ms(u, e, ut, An, Yc, t, vt, Le, bu, de, n, null, -0, 0);
        }
      }
      break;
    } while (!0);
    Ct(l);
  }
  function Ms(l, t, e, u, a, n, i, c, r, g, E, A, S, b) {
    if (
      ((l.timeoutHandle = -1),
      (A = t.subtreeFlags),
      A & 8192 || (A & 16785408) === 16785408)
    ) {
      ((A = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Bt,
      }),
        Ss(t, n, A));
      var H =
        (n & 62914560) === n ? Tn - nt() : (n & 4194048) === n ? zs - nt() : 0;
      if (((H = vy(A, H)), H !== null)) {
        ((kt = n),
          (l.cancelPendingCommit = H(
            js.bind(null, l, t, n, e, u, a, i, c, r, E, A, null, S, b),
          )),
          he(l, n, i, !g));
        return;
      }
    }
    js(l, t, n, e, u, a, i, c, r);
  }
  function U0(l) {
    for (var t = l; ; ) {
      var e = t.tag;
      if (
        (e === 0 || e === 11 || e === 15) &&
        t.flags & 16384 &&
        ((e = t.updateQueue), e !== null && ((e = e.stores), e !== null))
      )
        for (var u = 0; u < e.length; u++) {
          var a = e[u],
            n = a.getSnapshot;
          a = a.value;
          try {
            if (!ft(n(), a)) return !1;
          } catch {
            return !1;
          }
        }
      if (((e = t.child), t.subtreeFlags & 16384 && e !== null))
        ((e.return = t), (t = e));
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
  function he(l, t, e, u) {
    ((t &= ~Bc),
      (t &= ~Le),
      (l.suspendedLanes |= t),
      (l.pingedLanes &= ~t),
      u && (l.warmLanes |= t),
      (u = l.expirationTimes));
    for (var a = t; 0 < a; ) {
      var n = 31 - ct(a),
        i = 1 << n;
      ((u[n] = -1), (a &= ~i));
    }
    e !== 0 && qf(l, e, t);
  }
  function Mn() {
    return (nl & 6) === 0 ? (va(0), !1) : !0;
  }
  function xc() {
    if (W !== null) {
      if (rl === 0) var l = W.return;
      else ((l = W), (Qt = je = null), uc(l), (su = null), ($u = 0), (l = W));
      for (; l !== null; ) (us(l.alternate, l), (l = l.return));
      W = null;
    }
  }
  function Eu(l, t) {
    var e = l.timeoutHandle;
    (e !== -1 && ((l.timeoutHandle = -1), $0(e)),
      (e = l.cancelPendingCommit),
      e !== null && ((l.cancelPendingCommit = null), e()),
      (kt = 0),
      xc(),
      (hl = l),
      (W = e = Gt(l.current, null)),
      (k = t),
      (rl = 0),
      (dt = null),
      (de = !1),
      (Su = Hu(l, t)),
      (qc = !1),
      (bu = vt = Bc = Le = ve = Ol = 0),
      (ut = sa = null),
      (Yc = !1),
      (t & 8) !== 0 && (t |= t & 32));
    var u = l.entangledLanes;
    if (u !== 0)
      for (l = l.entanglements, u &= t; 0 < u; ) {
        var a = 31 - ct(u),
          n = 1 << a;
        ((t |= l[a]), (u &= ~n));
      }
    return ((Ft = t), Ja(), e);
  }
  function _s(l, t) {
    ((K = null),
      (p.H = ua),
      t === ru || t === ln
        ? ((t = Lo()), (rl = 3))
        : t === Ki
          ? ((t = Lo()), (rl = 4))
          : (rl =
              t === bc
                ? 8
                : t !== null &&
                    typeof t == "object" &&
                    typeof t.then == "function"
                  ? 6
                  : 1),
      (dt = t),
      W === null && ((Ol = 1), mn(l, pt(t, l.current))));
  }
  function Ds() {
    var l = rt.current;
    return l === null
      ? !0
      : (k & 4194048) === k
        ? Ot === null
        : (k & 62914560) === k || (k & 536870912) !== 0
          ? l === Ot
          : !1;
  }
  function Us() {
    var l = p.H;
    return ((p.H = ua), l === null ? ua : l);
  }
  function Ns() {
    var l = p.A;
    return ((p.A = _0), l);
  }
  function _n() {
    ((Ol = 4),
      de || ((k & 4194048) !== k && rt.current !== null) || (Su = !0),
      ((ve & 134217727) === 0 && (Le & 134217727) === 0) ||
        hl === null ||
        he(hl, k, vt, !1));
  }
  function Zc(l, t, e) {
    var u = nl;
    nl |= 2;
    var a = Us(),
      n = Ns();
    ((hl !== l || k !== t) && ((An = null), Eu(l, t)), (t = !1));
    var i = Ol;
    l: do
      try {
        if (rl !== 0 && W !== null) {
          var c = W,
            r = dt;
          switch (rl) {
            case 8:
              (xc(), (i = 6));
              break l;
            case 3:
            case 2:
            case 9:
            case 6:
              rt.current === null && (t = !0);
              var g = rl;
              if (((rl = 0), (dt = null), zu(l, c, r, g), e && Su)) {
                i = 0;
                break l;
              }
              break;
            default:
              ((g = rl), (rl = 0), (dt = null), zu(l, c, r, g));
          }
        }
        (N0(), (i = Ol));
        break;
      } catch (E) {
        _s(l, E);
      }
    while (!0);
    return (
      t && l.shellSuspendCounter++,
      (Qt = je = null),
      (nl = u),
      (p.H = a),
      (p.A = n),
      W === null && ((hl = null), (k = 0), Ja()),
      i
    );
  }
  function N0() {
    for (; W !== null; ) Rs(W);
  }
  function R0(l, t) {
    var e = nl;
    nl |= 2;
    var u = Us(),
      a = Ns();
    hl !== l || k !== t
      ? ((An = null), (On = nt() + 500), Eu(l, t))
      : (Su = Hu(l, t));
    l: do
      try {
        if (rl !== 0 && W !== null) {
          t = W;
          var n = dt;
          t: switch (rl) {
            case 1:
              ((rl = 0), (dt = null), zu(l, t, n, 1));
              break;
            case 2:
            case 9:
              if (xo(n)) {
                ((rl = 0), (dt = null), Hs(t));
                break;
              }
              ((t = function () {
                ((rl !== 2 && rl !== 9) || hl !== l || (rl = 7), Ct(l));
              }),
                n.then(t, t));
              break l;
            case 3:
              rl = 7;
              break l;
            case 4:
              rl = 5;
              break l;
            case 7:
              xo(n)
                ? ((rl = 0), (dt = null), Hs(t))
                : ((rl = 0), (dt = null), zu(l, t, n, 7));
              break;
            case 5:
              var i = null;
              switch (W.tag) {
                case 26:
                  i = W.memoizedState;
                case 5:
                case 27:
                  var c = W;
                  if (i ? gd(i) : c.stateNode.complete) {
                    ((rl = 0), (dt = null));
                    var r = c.sibling;
                    if (r !== null) W = r;
                    else {
                      var g = c.return;
                      g !== null ? ((W = g), Dn(g)) : (W = null);
                    }
                    break t;
                  }
              }
              ((rl = 0), (dt = null), zu(l, t, n, 5));
              break;
            case 6:
              ((rl = 0), (dt = null), zu(l, t, n, 6));
              break;
            case 8:
              (xc(), (Ol = 6));
              break l;
            default:
              throw Error(o(462));
          }
        }
        H0();
        break;
      } catch (E) {
        _s(l, E);
      }
    while (!0);
    return (
      (Qt = je = null),
      (p.H = u),
      (p.A = a),
      (nl = e),
      W !== null ? 0 : ((hl = null), (k = 0), Ja(), Ol)
    );
  }
  function H0() {
    for (; W !== null && !tv(); ) Rs(W);
  }
  function Rs(l) {
    var t = ts(l.alternate, l, Ft);
    ((l.memoizedProps = l.pendingProps), t === null ? Dn(l) : (W = t));
  }
  function Hs(l) {
    var t = l,
      e = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = $r(e, t, t.pendingProps, t.type, void 0, k);
        break;
      case 11:
        t = $r(e, t, t.pendingProps, t.type.render, t.ref, k);
        break;
      case 5:
        uc(t);
      default:
        (us(e, t), (t = W = No(t, Ft)), (t = ts(e, t, Ft)));
    }
    ((l.memoizedProps = l.pendingProps), t === null ? Dn(l) : (W = t));
  }
  function zu(l, t, e, u) {
    ((Qt = je = null), uc(t), (su = null), ($u = 0));
    var a = t.return;
    try {
      if (p0(l, a, t, e, k)) {
        ((Ol = 1), mn(l, pt(e, l.current)), (W = null));
        return;
      }
    } catch (n) {
      if (a !== null) throw ((W = a), n);
      ((Ol = 1), mn(l, pt(e, l.current)), (W = null));
      return;
    }
    t.flags & 32768
      ? (P || u === 1
          ? (l = !0)
          : Su || (k & 536870912) !== 0
            ? (l = !1)
            : ((de = l = !0),
              (u === 2 || u === 9 || u === 3 || u === 6) &&
                ((u = rt.current),
                u !== null && u.tag === 13 && (u.flags |= 16384))),
        Cs(t, l))
      : Dn(t);
  }
  function Dn(l) {
    var t = l;
    do {
      if ((t.flags & 32768) !== 0) {
        Cs(t, de);
        return;
      }
      l = t.return;
      var e = T0(t.alternate, t, Ft);
      if (e !== null) {
        W = e;
        return;
      }
      if (((t = t.sibling), t !== null)) {
        W = t;
        return;
      }
      W = t = l;
    } while (t !== null);
    Ol === 0 && (Ol = 5);
  }
  function Cs(l, t) {
    do {
      var e = O0(l.alternate, l);
      if (e !== null) {
        ((e.flags &= 32767), (W = e));
        return;
      }
      if (
        ((e = l.return),
        e !== null &&
          ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null)),
        !t && ((l = l.sibling), l !== null))
      ) {
        W = l;
        return;
      }
      W = l = e;
    } while (l !== null);
    ((Ol = 6), (W = null));
  }
  function js(l, t, e, u, a, n, i, c, r) {
    l.cancelPendingCommit = null;
    do Un();
    while (Yl !== 0);
    if ((nl & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === l.current) throw Error(o(177));
      if (
        ((n = t.lanes | t.childLanes),
        (n |= Ni),
        sv(l, e, n, i, c, r),
        l === hl && ((W = hl = null), (k = 0)),
        (pu = t),
        (me = l),
        (kt = e),
        (Gc = n),
        (Xc = a),
        (Ts = u),
        (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
          ? ((l.callbackNode = null),
            (l.callbackPriority = 0),
            B0(Na, function () {
              return (Xs(), null);
            }))
          : ((l.callbackNode = null), (l.callbackPriority = 0)),
        (u = (t.flags & 13878) !== 0),
        (t.subtreeFlags & 13878) !== 0 || u)
      ) {
        ((u = p.T), (p.T = null), (a = U.p), (U.p = 2), (i = nl), (nl |= 4));
        try {
          A0(l, t, e);
        } finally {
          ((nl = i), (U.p = a), (p.T = u));
        }
      }
      ((Yl = 1), qs(), Bs(), Ys());
    }
  }
  function qs() {
    if (Yl === 1) {
      Yl = 0;
      var l = me,
        t = pu,
        e = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || e) {
        ((e = p.T), (p.T = null));
        var u = U.p;
        U.p = 2;
        var a = nl;
        nl |= 4;
        try {
          ms(t, l);
          var n = lf,
            i = Eo(l.containerInfo),
            c = n.focusedElem,
            r = n.selectionRange;
          if (
            i !== c &&
            c &&
            c.ownerDocument &&
            po(c.ownerDocument.documentElement, c)
          ) {
            if (r !== null && Ai(c)) {
              var g = r.start,
                E = r.end;
              if ((E === void 0 && (E = g), "selectionStart" in c))
                ((c.selectionStart = g),
                  (c.selectionEnd = Math.min(E, c.value.length)));
              else {
                var A = c.ownerDocument || document,
                  S = (A && A.defaultView) || window;
                if (S.getSelection) {
                  var b = S.getSelection(),
                    H = c.textContent.length,
                    X = Math.min(r.start, H),
                    ml = r.end === void 0 ? X : Math.min(r.end, H);
                  !b.extend && X > ml && ((i = ml), (ml = X), (X = i));
                  var y = bo(c, X),
                    d = bo(c, ml);
                  if (
                    y &&
                    d &&
                    (b.rangeCount !== 1 ||
                      b.anchorNode !== y.node ||
                      b.anchorOffset !== y.offset ||
                      b.focusNode !== d.node ||
                      b.focusOffset !== d.offset)
                  ) {
                    var h = A.createRange();
                    (h.setStart(y.node, y.offset),
                      b.removeAllRanges(),
                      X > ml
                        ? (b.addRange(h), b.extend(d.node, d.offset))
                        : (h.setEnd(d.node, d.offset), b.addRange(h)));
                  }
                }
              }
            }
            for (A = [], b = c; (b = b.parentNode); )
              b.nodeType === 1 &&
                A.push({ element: b, left: b.scrollLeft, top: b.scrollTop });
            for (
              typeof c.focus == "function" && c.focus(), c = 0;
              c < A.length;
              c++
            ) {
              var O = A[c];
              ((O.element.scrollLeft = O.left), (O.element.scrollTop = O.top));
            }
          }
          ((xn = !!Pc), (lf = Pc = null));
        } finally {
          ((nl = a), (U.p = u), (p.T = e));
        }
      }
      ((l.current = t), (Yl = 2));
    }
  }
  function Bs() {
    if (Yl === 2) {
      Yl = 0;
      var l = me,
        t = pu,
        e = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || e) {
        ((e = p.T), (p.T = null));
        var u = U.p;
        U.p = 2;
        var a = nl;
        nl |= 4;
        try {
          rs(l, t.alternate, t);
        } finally {
          ((nl = a), (U.p = u), (p.T = e));
        }
      }
      Yl = 3;
    }
  }
  function Ys() {
    if (Yl === 4 || Yl === 3) {
      ((Yl = 0), ev());
      var l = me,
        t = pu,
        e = kt,
        u = Ts;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
        ? (Yl = 5)
        : ((Yl = 0), (pu = me = null), Gs(l, l.pendingLanes));
      var a = l.pendingLanes;
      if (
        (a === 0 && (ye = null),
        ii(e),
        (t = t.stateNode),
        it && typeof it.onCommitFiberRoot == "function")
      )
        try {
          it.onCommitFiberRoot(Ru, t, void 0, (t.current.flags & 128) === 128);
        } catch {}
      if (u !== null) {
        ((t = p.T), (a = U.p), (U.p = 2), (p.T = null));
        try {
          for (var n = l.onRecoverableError, i = 0; i < u.length; i++) {
            var c = u[i];
            n(c.value, { componentStack: c.stack });
          }
        } finally {
          ((p.T = t), (U.p = a));
        }
      }
      ((kt & 3) !== 0 && Un(),
        Ct(l),
        (a = l.pendingLanes),
        (e & 261930) !== 0 && (a & 42) !== 0
          ? l === Qc
            ? da++
            : ((da = 0), (Qc = l))
          : (da = 0),
        va(0));
    }
  }
  function Gs(l, t) {
    (l.pooledCacheLanes &= t) === 0 &&
      ((t = l.pooledCache), t != null && ((l.pooledCache = null), wu(t)));
  }
  function Un() {
    return (qs(), Bs(), Ys(), Xs());
  }
  function Xs() {
    if (Yl !== 5) return !1;
    var l = me,
      t = Gc;
    Gc = 0;
    var e = ii(kt),
      u = p.T,
      a = U.p;
    try {
      ((U.p = 32 > e ? 32 : e), (p.T = null), (e = Xc), (Xc = null));
      var n = me,
        i = kt;
      if (((Yl = 0), (pu = me = null), (kt = 0), (nl & 6) !== 0))
        throw Error(o(331));
      var c = nl;
      if (
        ((nl |= 4),
        ps(n.current),
        gs(n, n.current, i, e),
        (nl = c),
        va(0, !1),
        it && typeof it.onPostCommitFiberRoot == "function")
      )
        try {
          it.onPostCommitFiberRoot(Ru, n);
        } catch {}
      return !0;
    } finally {
      ((U.p = a), (p.T = u), Gs(l, t));
    }
  }
  function Qs(l, t, e) {
    ((t = pt(e, t)),
      (t = Sc(l.stateNode, t, 2)),
      (l = fe(l, t, 2)),
      l !== null && (Cu(l, 2), Ct(l)));
  }
  function sl(l, t, e) {
    if (l.tag === 3) Qs(l, l, e);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Qs(t, l, e);
          break;
        } else if (t.tag === 1) {
          var u = t.stateNode;
          if (
            typeof t.type.getDerivedStateFromError == "function" ||
            (typeof u.componentDidCatch == "function" &&
              (ye === null || !ye.has(u)))
          ) {
            ((l = pt(e, l)),
              (e = xr(2)),
              (u = fe(t, e, 2)),
              u !== null && (Zr(e, u, t, l), Cu(u, 2), Ct(u)));
            break;
          }
        }
        t = t.return;
      }
  }
  function Lc(l, t, e) {
    var u = l.pingCache;
    if (u === null) {
      u = l.pingCache = new D0();
      var a = new Set();
      u.set(t, a);
    } else ((a = u.get(t)), a === void 0 && ((a = new Set()), u.set(t, a)));
    a.has(e) ||
      ((qc = !0), a.add(e), (l = C0.bind(null, l, t, e)), t.then(l, l));
  }
  function C0(l, t, e) {
    var u = l.pingCache;
    (u !== null && u.delete(t),
      (l.pingedLanes |= l.suspendedLanes & e),
      (l.warmLanes &= ~e),
      hl === l &&
        (k & e) === e &&
        (Ol === 4 || (Ol === 3 && (k & 62914560) === k && 300 > nt() - Tn)
          ? (nl & 2) === 0 && Eu(l, 0)
          : (Bc |= e),
        bu === k && (bu = 0)),
      Ct(l));
  }
  function xs(l, t) {
    (t === 0 && (t = jf()), (l = Re(l, t)), l !== null && (Cu(l, t), Ct(l)));
  }
  function j0(l) {
    var t = l.memoizedState,
      e = 0;
    (t !== null && (e = t.retryLane), xs(l, e));
  }
  function q0(l, t) {
    var e = 0;
    switch (l.tag) {
      case 31:
      case 13:
        var u = l.stateNode,
          a = l.memoizedState;
        a !== null && (e = a.retryLane);
        break;
      case 19:
        u = l.stateNode;
        break;
      case 22:
        u = l.stateNode._retryCache;
        break;
      default:
        throw Error(o(314));
    }
    (u !== null && u.delete(t), xs(l, e));
  }
  function B0(l, t) {
    return ei(l, t);
  }
  var Nn = null,
    Tu = null,
    Vc = !1,
    Rn = !1,
    Kc = !1,
    ge = 0;
  function Ct(l) {
    (l !== Tu &&
      l.next === null &&
      (Tu === null ? (Nn = Tu = l) : (Tu = Tu.next = l)),
      (Rn = !0),
      Vc || ((Vc = !0), G0()));
  }
  function va(l, t) {
    if (!Kc && Rn) {
      Kc = !0;
      do
        for (var e = !1, u = Nn; u !== null; ) {
          if (l !== 0) {
            var a = u.pendingLanes;
            if (a === 0) var n = 0;
            else {
              var i = u.suspendedLanes,
                c = u.pingedLanes;
              ((n = (1 << (31 - ct(42 | l) + 1)) - 1),
                (n &= a & ~(i & ~c)),
                (n = n & 201326741 ? (n & 201326741) | 1 : n ? n | 2 : 0));
            }
            n !== 0 && ((e = !0), Ks(u, n));
          } else
            ((n = k),
              (n = ja(
                u,
                u === hl ? n : 0,
                u.cancelPendingCommit !== null || u.timeoutHandle !== -1,
              )),
              (n & 3) === 0 || Hu(u, n) || ((e = !0), Ks(u, n)));
          u = u.next;
        }
      while (e);
      Kc = !1;
    }
  }
  function Y0() {
    Zs();
  }
  function Zs() {
    Rn = Vc = !1;
    var l = 0;
    ge !== 0 && W0() && (l = ge);
    for (var t = nt(), e = null, u = Nn; u !== null; ) {
      var a = u.next,
        n = Ls(u, t);
      (n === 0
        ? ((u.next = null),
          e === null ? (Nn = a) : (e.next = a),
          a === null && (Tu = e))
        : ((e = u), (l !== 0 || (n & 3) !== 0) && (Rn = !0)),
        (u = a));
    }
    ((Yl !== 0 && Yl !== 5) || va(l), ge !== 0 && (ge = 0));
  }
  function Ls(l, t) {
    for (
      var e = l.suspendedLanes,
        u = l.pingedLanes,
        a = l.expirationTimes,
        n = l.pendingLanes & -62914561;
      0 < n;
    ) {
      var i = 31 - ct(n),
        c = 1 << i,
        r = a[i];
      (r === -1
        ? ((c & e) === 0 || (c & u) !== 0) && (a[i] = rv(c, t))
        : r <= t && (l.expiredLanes |= c),
        (n &= ~c));
    }
    if (
      ((t = hl),
      (e = k),
      (e = ja(
        l,
        l === t ? e : 0,
        l.cancelPendingCommit !== null || l.timeoutHandle !== -1,
      )),
      (u = l.callbackNode),
      e === 0 ||
        (l === t && (rl === 2 || rl === 9)) ||
        l.cancelPendingCommit !== null)
    )
      return (
        u !== null && u !== null && ui(u),
        (l.callbackNode = null),
        (l.callbackPriority = 0)
      );
    if ((e & 3) === 0 || Hu(l, e)) {
      if (((t = e & -e), t === l.callbackPriority)) return t;
      switch ((u !== null && ui(u), ii(e))) {
        case 2:
        case 8:
          e = Hf;
          break;
        case 32:
          e = Na;
          break;
        case 268435456:
          e = Cf;
          break;
        default:
          e = Na;
      }
      return (
        (u = Vs.bind(null, l)),
        (e = ei(e, u)),
        (l.callbackPriority = t),
        (l.callbackNode = e),
        t
      );
    }
    return (
      u !== null && u !== null && ui(u),
      (l.callbackPriority = 2),
      (l.callbackNode = null),
      2
    );
  }
  function Vs(l, t) {
    if (Yl !== 0 && Yl !== 5)
      return ((l.callbackNode = null), (l.callbackPriority = 0), null);
    var e = l.callbackNode;
    if (Un() && l.callbackNode !== e) return null;
    var u = k;
    return (
      (u = ja(
        l,
        l === hl ? u : 0,
        l.cancelPendingCommit !== null || l.timeoutHandle !== -1,
      )),
      u === 0
        ? null
        : (As(l, u, t),
          Ls(l, nt()),
          l.callbackNode != null && l.callbackNode === e
            ? Vs.bind(null, l)
            : null)
    );
  }
  function Ks(l, t) {
    if (Un()) return null;
    As(l, t, !0);
  }
  function G0() {
    F0(function () {
      (nl & 6) !== 0 ? ei(Rf, Y0) : Zs();
    });
  }
  function Jc() {
    if (ge === 0) {
      var l = fu;
      (l === 0 && ((l = Ra), (Ra <<= 1), (Ra & 261888) === 0 && (Ra = 256)),
        (ge = l));
    }
    return ge;
  }
  function Js(l) {
    return l == null || typeof l == "symbol" || typeof l == "boolean"
      ? null
      : typeof l == "function"
        ? l
        : Ga("" + l);
  }
  function ws(l, t) {
    var e = t.ownerDocument.createElement("input");
    return (
      (e.name = t.name),
      (e.value = t.value),
      l.id && e.setAttribute("form", l.id),
      t.parentNode.insertBefore(e, t),
      (l = new FormData(l)),
      e.parentNode.removeChild(e),
      l
    );
  }
  function X0(l, t, e, u, a) {
    if (t === "submit" && e && e.stateNode === a) {
      var n = Js((a[Il] || null).action),
        i = u.submitter;
      i &&
        ((t = (t = i[Il] || null)
          ? Js(t.formAction)
          : i.getAttribute("formAction")),
        t !== null && ((n = t), (i = null)));
      var c = new Za("action", "action", null, u, a);
      l.push({
        event: c,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (u.defaultPrevented) {
                if (ge !== 0) {
                  var r = i ? ws(a, i) : new FormData(a);
                  dc(
                    e,
                    { pending: !0, data: r, method: a.method, action: n },
                    null,
                    r,
                  );
                }
              } else
                typeof n == "function" &&
                  (c.preventDefault(),
                  (r = i ? ws(a, i) : new FormData(a)),
                  dc(
                    e,
                    { pending: !0, data: r, method: a.method, action: n },
                    n,
                    r,
                  ));
            },
            currentTarget: a,
          },
        ],
      });
    }
  }
  for (var wc = 0; wc < Ui.length; wc++) {
    var Wc = Ui[wc],
      Q0 = Wc.toLowerCase(),
      x0 = Wc[0].toUpperCase() + Wc.slice(1);
    _t(Q0, "on" + x0);
  }
  (_t(Oo, "onAnimationEnd"),
    _t(Ao, "onAnimationIteration"),
    _t(Mo, "onAnimationStart"),
    _t("dblclick", "onDoubleClick"),
    _t("focusin", "onFocus"),
    _t("focusout", "onBlur"),
    _t(u0, "onTransitionRun"),
    _t(a0, "onTransitionStart"),
    _t(n0, "onTransitionCancel"),
    _t(_o, "onTransitionEnd"),
    We("onMouseEnter", ["mouseout", "mouseover"]),
    We("onMouseLeave", ["mouseout", "mouseover"]),
    We("onPointerEnter", ["pointerout", "pointerover"]),
    We("onPointerLeave", ["pointerout", "pointerover"]),
    _e(
      "onChange",
      "change click focusin focusout input keydown keyup selectionchange".split(
        " ",
      ),
    ),
    _e(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " ",
      ),
    ),
    _e("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    _e(
      "onCompositionEnd",
      "compositionend focusout keydown keypress keyup mousedown".split(" "),
    ),
    _e(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" "),
    ),
    _e(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
    ));
  var ya =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " ",
      ),
    Z0 = new Set(
      "beforetoggle cancel close invalid load scroll scrollend toggle"
        .split(" ")
        .concat(ya),
    );
  function Ws(l, t) {
    t = (t & 4) !== 0;
    for (var e = 0; e < l.length; e++) {
      var u = l[e],
        a = u.event;
      u = u.listeners;
      l: {
        var n = void 0;
        if (t)
          for (var i = u.length - 1; 0 <= i; i--) {
            var c = u[i],
              r = c.instance,
              g = c.currentTarget;
            if (((c = c.listener), r !== n && a.isPropagationStopped()))
              break l;
            ((n = c), (a.currentTarget = g));
            try {
              n(a);
            } catch (E) {
              Ka(E);
            }
            ((a.currentTarget = null), (n = r));
          }
        else
          for (i = 0; i < u.length; i++) {
            if (
              ((c = u[i]),
              (r = c.instance),
              (g = c.currentTarget),
              (c = c.listener),
              r !== n && a.isPropagationStopped())
            )
              break l;
            ((n = c), (a.currentTarget = g));
            try {
              n(a);
            } catch (E) {
              Ka(E);
            }
            ((a.currentTarget = null), (n = r));
          }
      }
    }
  }
  function $(l, t) {
    var e = t[ci];
    e === void 0 && (e = t[ci] = new Set());
    var u = l + "__bubble";
    e.has(u) || ($s(t, l, 2, !1), e.add(u));
  }
  function $c(l, t, e) {
    var u = 0;
    (t && (u |= 4), $s(e, l, u, t));
  }
  var Hn = "_reactListening" + Math.random().toString(36).slice(2);
  function Fc(l) {
    if (!l[Hn]) {
      ((l[Hn] = !0),
        xf.forEach(function (e) {
          e !== "selectionchange" && (Z0.has(e) || $c(e, !1, l), $c(e, !0, l));
        }));
      var t = l.nodeType === 9 ? l : l.ownerDocument;
      t === null || t[Hn] || ((t[Hn] = !0), $c("selectionchange", !1, t));
    }
  }
  function $s(l, t, e, u) {
    switch (Od(t)) {
      case 2:
        var a = hy;
        break;
      case 8:
        a = gy;
        break;
      default:
        a = df;
    }
    ((e = a.bind(null, t, e, l)),
      (a = void 0),
      !hi ||
        (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
        (a = !0),
      u
        ? a !== void 0
          ? l.addEventListener(t, e, { capture: !0, passive: a })
          : l.addEventListener(t, e, !0)
        : a !== void 0
          ? l.addEventListener(t, e, { passive: a })
          : l.addEventListener(t, e, !1));
  }
  function kc(l, t, e, u, a) {
    var n = u;
    if ((t & 1) === 0 && (t & 2) === 0 && u !== null)
      l: for (;;) {
        if (u === null) return;
        var i = u.tag;
        if (i === 3 || i === 4) {
          var c = u.stateNode.containerInfo;
          if (c === a) break;
          if (i === 4)
            for (i = u.return; i !== null; ) {
              var r = i.tag;
              if ((r === 3 || r === 4) && i.stateNode.containerInfo === a)
                return;
              i = i.return;
            }
          for (; c !== null; ) {
            if (((i = Ke(c)), i === null)) return;
            if (((r = i.tag), r === 5 || r === 6 || r === 26 || r === 27)) {
              u = n = i;
              continue l;
            }
            c = c.parentNode;
          }
        }
        u = u.return;
      }
    Pf(function () {
      var g = n,
        E = yi(e),
        A = [];
      l: {
        var S = Do.get(l);
        if (S !== void 0) {
          var b = Za,
            H = l;
          switch (l) {
            case "keypress":
              if (Qa(e) === 0) break l;
            case "keydown":
            case "keyup":
              b = qv;
              break;
            case "focusin":
              ((H = "focus"), (b = pi));
              break;
            case "focusout":
              ((H = "blur"), (b = pi));
              break;
            case "beforeblur":
            case "afterblur":
              b = pi;
              break;
            case "click":
              if (e.button === 2) break l;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              b = eo;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              b = Tv;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              b = Gv;
              break;
            case Oo:
            case Ao:
            case Mo:
              b = Mv;
              break;
            case _o:
              b = Qv;
              break;
            case "scroll":
            case "scrollend":
              b = Ev;
              break;
            case "wheel":
              b = Zv;
              break;
            case "copy":
            case "cut":
            case "paste":
              b = Dv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              b = ao;
              break;
            case "toggle":
            case "beforetoggle":
              b = Vv;
          }
          var X = (t & 4) !== 0,
            ml = !X && (l === "scroll" || l === "scrollend"),
            y = X ? (S !== null ? S + "Capture" : null) : S;
          X = [];
          for (var d = g, h; d !== null; ) {
            var O = d;
            if (
              ((h = O.stateNode),
              (O = O.tag),
              (O !== 5 && O !== 26 && O !== 27) ||
                h === null ||
                y === null ||
                ((O = Bu(d, y)), O != null && X.push(ma(d, O, h))),
              ml)
            )
              break;
            d = d.return;
          }
          0 < X.length &&
            ((S = new b(S, H, null, e, E)), A.push({ event: S, listeners: X }));
        }
      }
      if ((t & 7) === 0) {
        l: {
          if (
            ((S = l === "mouseover" || l === "pointerover"),
            (b = l === "mouseout" || l === "pointerout"),
            S &&
              e !== vi &&
              (H = e.relatedTarget || e.fromElement) &&
              (Ke(H) || H[Ve]))
          )
            break l;
          if (
            (b || S) &&
            ((S =
              E.window === E
                ? E
                : (S = E.ownerDocument)
                  ? S.defaultView || S.parentWindow
                  : window),
            b
              ? ((H = e.relatedTarget || e.toElement),
                (b = g),
                (H = H ? Ke(H) : null),
                H !== null &&
                  ((ml = _(H)),
                  (X = H.tag),
                  H !== ml || (X !== 5 && X !== 27 && X !== 6)) &&
                  (H = null))
              : ((b = null), (H = g)),
            b !== H)
          ) {
            if (
              ((X = eo),
              (O = "onMouseLeave"),
              (y = "onMouseEnter"),
              (d = "mouse"),
              (l === "pointerout" || l === "pointerover") &&
                ((X = ao),
                (O = "onPointerLeave"),
                (y = "onPointerEnter"),
                (d = "pointer")),
              (ml = b == null ? S : qu(b)),
              (h = H == null ? S : qu(H)),
              (S = new X(O, d + "leave", b, e, E)),
              (S.target = ml),
              (S.relatedTarget = h),
              (O = null),
              Ke(E) === g &&
                ((X = new X(y, d + "enter", H, e, E)),
                (X.target = h),
                (X.relatedTarget = ml),
                (O = X)),
              (ml = O),
              b && H)
            )
              t: {
                for (X = L0, y = b, d = H, h = 0, O = y; O; O = X(O)) h++;
                O = 0;
                for (var Y = d; Y; Y = X(Y)) O++;
                for (; 0 < h - O; ) ((y = X(y)), h--);
                for (; 0 < O - h; ) ((d = X(d)), O--);
                for (; h--; ) {
                  if (y === d || (d !== null && y === d.alternate)) {
                    X = y;
                    break t;
                  }
                  ((y = X(y)), (d = X(d)));
                }
                X = null;
              }
            else X = null;
            (b !== null && Fs(A, S, b, X, !1),
              H !== null && ml !== null && Fs(A, ml, H, X, !0));
          }
        }
        l: {
          if (
            ((S = g ? qu(g) : window),
            (b = S.nodeName && S.nodeName.toLowerCase()),
            b === "select" || (b === "input" && S.type === "file"))
          )
            var tl = vo;
          else if (ro(S))
            if (yo) tl = l0;
            else {
              tl = Iv;
              var j = kv;
            }
          else
            ((b = S.nodeName),
              !b ||
              b.toLowerCase() !== "input" ||
              (S.type !== "checkbox" && S.type !== "radio")
                ? g && di(g.elementType) && (tl = vo)
                : (tl = Pv));
          if (tl && (tl = tl(l, g))) {
            so(A, tl, e, E);
            break l;
          }
          (j && j(l, S, g),
            l === "focusout" &&
              g &&
              S.type === "number" &&
              g.memoizedProps.value != null &&
              si(S, "number", S.value));
        }
        switch (((j = g ? qu(g) : window), l)) {
          case "focusin":
            (ro(j) || j.contentEditable === "true") &&
              ((lu = j), (Mi = g), (Vu = null));
            break;
          case "focusout":
            Vu = Mi = lu = null;
            break;
          case "mousedown":
            _i = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ((_i = !1), zo(A, e, E));
            break;
          case "selectionchange":
            if (e0) break;
          case "keydown":
          case "keyup":
            zo(A, e, E);
        }
        var J;
        if (zi)
          l: {
            switch (l) {
              case "compositionstart":
                var I = "onCompositionStart";
                break l;
              case "compositionend":
                I = "onCompositionEnd";
                break l;
              case "compositionupdate":
                I = "onCompositionUpdate";
                break l;
            }
            I = void 0;
          }
        else
          Pe
            ? fo(l, e) && (I = "onCompositionEnd")
            : l === "keydown" &&
              e.keyCode === 229 &&
              (I = "onCompositionStart");
        (I &&
          (no &&
            e.locale !== "ko" &&
            (Pe || I !== "onCompositionStart"
              ? I === "onCompositionEnd" && Pe && (J = lo())
              : ((te = E),
                (gi = "value" in te ? te.value : te.textContent),
                (Pe = !0))),
          (j = Cn(g, I)),
          0 < j.length &&
            ((I = new uo(I, l, null, e, E)),
            A.push({ event: I, listeners: j }),
            J ? (I.data = J) : ((J = oo(e)), J !== null && (I.data = J)))),
          (J = Jv ? wv(l, e) : Wv(l, e)) &&
            ((I = Cn(g, "onBeforeInput")),
            0 < I.length &&
              ((j = new uo("onBeforeInput", "beforeinput", null, e, E)),
              A.push({ event: j, listeners: I }),
              (j.data = J))),
          X0(A, l, g, e, E));
      }
      Ws(A, t);
    });
  }
  function ma(l, t, e) {
    return { instance: l, listener: t, currentTarget: e };
  }
  function Cn(l, t) {
    for (var e = t + "Capture", u = []; l !== null; ) {
      var a = l,
        n = a.stateNode;
      if (
        ((a = a.tag),
        (a !== 5 && a !== 26 && a !== 27) ||
          n === null ||
          ((a = Bu(l, e)),
          a != null && u.unshift(ma(l, a, n)),
          (a = Bu(l, t)),
          a != null && u.push(ma(l, a, n))),
        l.tag === 3)
      )
        return u;
      l = l.return;
    }
    return [];
  }
  function L0(l) {
    if (l === null) return null;
    do l = l.return;
    while (l && l.tag !== 5 && l.tag !== 27);
    return l || null;
  }
  function Fs(l, t, e, u, a) {
    for (var n = t._reactName, i = []; e !== null && e !== u; ) {
      var c = e,
        r = c.alternate,
        g = c.stateNode;
      if (((c = c.tag), r !== null && r === u)) break;
      ((c !== 5 && c !== 26 && c !== 27) ||
        g === null ||
        ((r = g),
        a
          ? ((g = Bu(e, n)), g != null && i.unshift(ma(e, g, r)))
          : a || ((g = Bu(e, n)), g != null && i.push(ma(e, g, r)))),
        (e = e.return));
    }
    i.length !== 0 && l.push({ event: t, listeners: i });
  }
  var V0 = /\r\n?/g,
    K0 = /\u0000|\uFFFD/g;
  function ks(l) {
    return (typeof l == "string" ? l : "" + l)
      .replace(
        V0,
        `
`,
      )
      .replace(K0, "");
  }
  function Is(l, t) {
    return ((t = ks(t)), ks(l) === t);
  }
  function yl(l, t, e, u, a, n) {
    switch (e) {
      case "children":
        typeof u == "string"
          ? t === "body" || (t === "textarea" && u === "") || Fe(l, u)
          : (typeof u == "number" || typeof u == "bigint") &&
            t !== "body" &&
            Fe(l, "" + u);
        break;
      case "className":
        Ba(l, "class", u);
        break;
      case "tabIndex":
        Ba(l, "tabindex", u);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Ba(l, e, u);
        break;
      case "style":
        kf(l, u, n);
        break;
      case "data":
        if (t !== "object") {
          Ba(l, "data", u);
          break;
        }
      case "src":
      case "href":
        if (u === "" && (t !== "a" || e !== "href")) {
          l.removeAttribute(e);
          break;
        }
        if (
          u == null ||
          typeof u == "function" ||
          typeof u == "symbol" ||
          typeof u == "boolean"
        ) {
          l.removeAttribute(e);
          break;
        }
        ((u = Ga("" + u)), l.setAttribute(e, u));
        break;
      case "action":
      case "formAction":
        if (typeof u == "function") {
          l.setAttribute(
            e,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
          );
          break;
        } else
          typeof n == "function" &&
            (e === "formAction"
              ? (t !== "input" && yl(l, t, "name", a.name, a, null),
                yl(l, t, "formEncType", a.formEncType, a, null),
                yl(l, t, "formMethod", a.formMethod, a, null),
                yl(l, t, "formTarget", a.formTarget, a, null))
              : (yl(l, t, "encType", a.encType, a, null),
                yl(l, t, "method", a.method, a, null),
                yl(l, t, "target", a.target, a, null)));
        if (u == null || typeof u == "symbol" || typeof u == "boolean") {
          l.removeAttribute(e);
          break;
        }
        ((u = Ga("" + u)), l.setAttribute(e, u));
        break;
      case "onClick":
        u != null && (l.onclick = Bt);
        break;
      case "onScroll":
        u != null && $("scroll", l);
        break;
      case "onScrollEnd":
        u != null && $("scrollend", l);
        break;
      case "dangerouslySetInnerHTML":
        if (u != null) {
          if (typeof u != "object" || !("__html" in u)) throw Error(o(61));
          if (((e = u.__html), e != null)) {
            if (a.children != null) throw Error(o(60));
            l.innerHTML = e;
          }
        }
        break;
      case "multiple":
        l.multiple = u && typeof u != "function" && typeof u != "symbol";
        break;
      case "muted":
        l.muted = u && typeof u != "function" && typeof u != "symbol";
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
          u == null ||
          typeof u == "function" ||
          typeof u == "boolean" ||
          typeof u == "symbol"
        ) {
          l.removeAttribute("xlink:href");
          break;
        }
        ((e = Ga("" + u)),
          l.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", e));
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        u != null && typeof u != "function" && typeof u != "symbol"
          ? l.setAttribute(e, "" + u)
          : l.removeAttribute(e);
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
        u && typeof u != "function" && typeof u != "symbol"
          ? l.setAttribute(e, "")
          : l.removeAttribute(e);
        break;
      case "capture":
      case "download":
        u === !0
          ? l.setAttribute(e, "")
          : u !== !1 &&
              u != null &&
              typeof u != "function" &&
              typeof u != "symbol"
            ? l.setAttribute(e, u)
            : l.removeAttribute(e);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        u != null &&
        typeof u != "function" &&
        typeof u != "symbol" &&
        !isNaN(u) &&
        1 <= u
          ? l.setAttribute(e, u)
          : l.removeAttribute(e);
        break;
      case "rowSpan":
      case "start":
        u == null || typeof u == "function" || typeof u == "symbol" || isNaN(u)
          ? l.removeAttribute(e)
          : l.setAttribute(e, u);
        break;
      case "popover":
        ($("beforetoggle", l), $("toggle", l), qa(l, "popover", u));
        break;
      case "xlinkActuate":
        qt(l, "http://www.w3.org/1999/xlink", "xlink:actuate", u);
        break;
      case "xlinkArcrole":
        qt(l, "http://www.w3.org/1999/xlink", "xlink:arcrole", u);
        break;
      case "xlinkRole":
        qt(l, "http://www.w3.org/1999/xlink", "xlink:role", u);
        break;
      case "xlinkShow":
        qt(l, "http://www.w3.org/1999/xlink", "xlink:show", u);
        break;
      case "xlinkTitle":
        qt(l, "http://www.w3.org/1999/xlink", "xlink:title", u);
        break;
      case "xlinkType":
        qt(l, "http://www.w3.org/1999/xlink", "xlink:type", u);
        break;
      case "xmlBase":
        qt(l, "http://www.w3.org/XML/1998/namespace", "xml:base", u);
        break;
      case "xmlLang":
        qt(l, "http://www.w3.org/XML/1998/namespace", "xml:lang", u);
        break;
      case "xmlSpace":
        qt(l, "http://www.w3.org/XML/1998/namespace", "xml:space", u);
        break;
      case "is":
        qa(l, "is", u);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < e.length) ||
          (e[0] !== "o" && e[0] !== "O") ||
          (e[1] !== "n" && e[1] !== "N")) &&
          ((e = bv.get(e) || e), qa(l, e, u));
    }
  }
  function Ic(l, t, e, u, a, n) {
    switch (e) {
      case "style":
        kf(l, u, n);
        break;
      case "dangerouslySetInnerHTML":
        if (u != null) {
          if (typeof u != "object" || !("__html" in u)) throw Error(o(61));
          if (((e = u.__html), e != null)) {
            if (a.children != null) throw Error(o(60));
            l.innerHTML = e;
          }
        }
        break;
      case "children":
        typeof u == "string"
          ? Fe(l, u)
          : (typeof u == "number" || typeof u == "bigint") && Fe(l, "" + u);
        break;
      case "onScroll":
        u != null && $("scroll", l);
        break;
      case "onScrollEnd":
        u != null && $("scrollend", l);
        break;
      case "onClick":
        u != null && (l.onclick = Bt);
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
        if (!Zf.hasOwnProperty(e))
          l: {
            if (
              e[0] === "o" &&
              e[1] === "n" &&
              ((a = e.endsWith("Capture")),
              (t = e.slice(2, a ? e.length - 7 : void 0)),
              (n = l[Il] || null),
              (n = n != null ? n[e] : null),
              typeof n == "function" && l.removeEventListener(t, n, a),
              typeof u == "function")
            ) {
              (typeof n != "function" &&
                n !== null &&
                (e in l
                  ? (l[e] = null)
                  : l.hasAttribute(e) && l.removeAttribute(e)),
                l.addEventListener(t, u, a));
              break l;
            }
            e in l
              ? (l[e] = u)
              : u === !0
                ? l.setAttribute(e, "")
                : qa(l, e, u);
          }
    }
  }
  function wl(l, t, e) {
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
        ($("error", l), $("load", l));
        var u = !1,
          a = !1,
          n;
        for (n in e)
          if (e.hasOwnProperty(n)) {
            var i = e[n];
            if (i != null)
              switch (n) {
                case "src":
                  u = !0;
                  break;
                case "srcSet":
                  a = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(o(137, t));
                default:
                  yl(l, t, n, i, e, null);
              }
          }
        (a && yl(l, t, "srcSet", e.srcSet, e, null),
          u && yl(l, t, "src", e.src, e, null));
        return;
      case "input":
        $("invalid", l);
        var c = (n = i = a = null),
          r = null,
          g = null;
        for (u in e)
          if (e.hasOwnProperty(u)) {
            var E = e[u];
            if (E != null)
              switch (u) {
                case "name":
                  a = E;
                  break;
                case "type":
                  i = E;
                  break;
                case "checked":
                  r = E;
                  break;
                case "defaultChecked":
                  g = E;
                  break;
                case "value":
                  n = E;
                  break;
                case "defaultValue":
                  c = E;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (E != null) throw Error(o(137, t));
                  break;
                default:
                  yl(l, t, u, E, e, null);
              }
          }
        wf(l, n, c, r, g, i, a, !1);
        return;
      case "select":
        ($("invalid", l), (u = i = n = null));
        for (a in e)
          if (e.hasOwnProperty(a) && ((c = e[a]), c != null))
            switch (a) {
              case "value":
                n = c;
                break;
              case "defaultValue":
                i = c;
                break;
              case "multiple":
                u = c;
              default:
                yl(l, t, a, c, e, null);
            }
        ((t = n),
          (e = i),
          (l.multiple = !!u),
          t != null ? $e(l, !!u, t, !1) : e != null && $e(l, !!u, e, !0));
        return;
      case "textarea":
        ($("invalid", l), (n = a = u = null));
        for (i in e)
          if (e.hasOwnProperty(i) && ((c = e[i]), c != null))
            switch (i) {
              case "value":
                u = c;
                break;
              case "defaultValue":
                a = c;
                break;
              case "children":
                n = c;
                break;
              case "dangerouslySetInnerHTML":
                if (c != null) throw Error(o(91));
                break;
              default:
                yl(l, t, i, c, e, null);
            }
        $f(l, u, a, n);
        return;
      case "option":
        for (r in e)
          e.hasOwnProperty(r) &&
            ((u = e[r]), u != null) &&
            (r === "selected"
              ? (l.selected =
                  u && typeof u != "function" && typeof u != "symbol")
              : yl(l, t, r, u, e, null));
        return;
      case "dialog":
        ($("beforetoggle", l), $("toggle", l), $("cancel", l), $("close", l));
        break;
      case "iframe":
      case "object":
        $("load", l);
        break;
      case "video":
      case "audio":
        for (u = 0; u < ya.length; u++) $(ya[u], l);
        break;
      case "image":
        ($("error", l), $("load", l));
        break;
      case "details":
        $("toggle", l);
        break;
      case "embed":
      case "source":
      case "link":
        ($("error", l), $("load", l));
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
        for (g in e)
          if (e.hasOwnProperty(g) && ((u = e[g]), u != null))
            switch (g) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                yl(l, t, g, u, e, null);
            }
        return;
      default:
        if (di(t)) {
          for (E in e)
            e.hasOwnProperty(E) &&
              ((u = e[E]), u !== void 0 && Ic(l, t, E, u, e, void 0));
          return;
        }
    }
    for (c in e)
      e.hasOwnProperty(c) && ((u = e[c]), u != null && yl(l, t, c, u, e, null));
  }
  function J0(l, t, e, u) {
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
        var a = null,
          n = null,
          i = null,
          c = null,
          r = null,
          g = null,
          E = null;
        for (b in e) {
          var A = e[b];
          if (e.hasOwnProperty(b) && A != null)
            switch (b) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                r = A;
              default:
                u.hasOwnProperty(b) || yl(l, t, b, null, u, A);
            }
        }
        for (var S in u) {
          var b = u[S];
          if (((A = e[S]), u.hasOwnProperty(S) && (b != null || A != null)))
            switch (S) {
              case "type":
                n = b;
                break;
              case "name":
                a = b;
                break;
              case "checked":
                g = b;
                break;
              case "defaultChecked":
                E = b;
                break;
              case "value":
                i = b;
                break;
              case "defaultValue":
                c = b;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (b != null) throw Error(o(137, t));
                break;
              default:
                b !== A && yl(l, t, S, b, u, A);
            }
        }
        ri(l, i, c, r, g, E, n, a);
        return;
      case "select":
        b = i = c = S = null;
        for (n in e)
          if (((r = e[n]), e.hasOwnProperty(n) && r != null))
            switch (n) {
              case "value":
                break;
              case "multiple":
                b = r;
              default:
                u.hasOwnProperty(n) || yl(l, t, n, null, u, r);
            }
        for (a in u)
          if (
            ((n = u[a]),
            (r = e[a]),
            u.hasOwnProperty(a) && (n != null || r != null))
          )
            switch (a) {
              case "value":
                S = n;
                break;
              case "defaultValue":
                c = n;
                break;
              case "multiple":
                i = n;
              default:
                n !== r && yl(l, t, a, n, u, r);
            }
        ((t = c),
          (e = i),
          (u = b),
          S != null
            ? $e(l, !!e, S, !1)
            : !!u != !!e &&
              (t != null ? $e(l, !!e, t, !0) : $e(l, !!e, e ? [] : "", !1)));
        return;
      case "textarea":
        b = S = null;
        for (c in e)
          if (
            ((a = e[c]),
            e.hasOwnProperty(c) && a != null && !u.hasOwnProperty(c))
          )
            switch (c) {
              case "value":
                break;
              case "children":
                break;
              default:
                yl(l, t, c, null, u, a);
            }
        for (i in u)
          if (
            ((a = u[i]),
            (n = e[i]),
            u.hasOwnProperty(i) && (a != null || n != null))
          )
            switch (i) {
              case "value":
                S = a;
                break;
              case "defaultValue":
                b = a;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (a != null) throw Error(o(91));
                break;
              default:
                a !== n && yl(l, t, i, a, u, n);
            }
        Wf(l, S, b);
        return;
      case "option":
        for (var H in e)
          ((S = e[H]),
            e.hasOwnProperty(H) &&
              S != null &&
              !u.hasOwnProperty(H) &&
              (H === "selected" ? (l.selected = !1) : yl(l, t, H, null, u, S)));
        for (r in u)
          ((S = u[r]),
            (b = e[r]),
            u.hasOwnProperty(r) &&
              S !== b &&
              (S != null || b != null) &&
              (r === "selected"
                ? (l.selected =
                    S && typeof S != "function" && typeof S != "symbol")
                : yl(l, t, r, S, u, b)));
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
        for (var X in e)
          ((S = e[X]),
            e.hasOwnProperty(X) &&
              S != null &&
              !u.hasOwnProperty(X) &&
              yl(l, t, X, null, u, S));
        for (g in u)
          if (
            ((S = u[g]),
            (b = e[g]),
            u.hasOwnProperty(g) && S !== b && (S != null || b != null))
          )
            switch (g) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (S != null) throw Error(o(137, t));
                break;
              default:
                yl(l, t, g, S, u, b);
            }
        return;
      default:
        if (di(t)) {
          for (var ml in e)
            ((S = e[ml]),
              e.hasOwnProperty(ml) &&
                S !== void 0 &&
                !u.hasOwnProperty(ml) &&
                Ic(l, t, ml, void 0, u, S));
          for (E in u)
            ((S = u[E]),
              (b = e[E]),
              !u.hasOwnProperty(E) ||
                S === b ||
                (S === void 0 && b === void 0) ||
                Ic(l, t, E, S, u, b));
          return;
        }
    }
    for (var y in e)
      ((S = e[y]),
        e.hasOwnProperty(y) &&
          S != null &&
          !u.hasOwnProperty(y) &&
          yl(l, t, y, null, u, S));
    for (A in u)
      ((S = u[A]),
        (b = e[A]),
        !u.hasOwnProperty(A) ||
          S === b ||
          (S == null && b == null) ||
          yl(l, t, A, S, u, b));
  }
  function Ps(l) {
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
  function w0() {
    if (typeof performance.getEntriesByType == "function") {
      for (
        var l = 0, t = 0, e = performance.getEntriesByType("resource"), u = 0;
        u < e.length;
        u++
      ) {
        var a = e[u],
          n = a.transferSize,
          i = a.initiatorType,
          c = a.duration;
        if (n && c && Ps(i)) {
          for (i = 0, c = a.responseEnd, u += 1; u < e.length; u++) {
            var r = e[u],
              g = r.startTime;
            if (g > c) break;
            var E = r.transferSize,
              A = r.initiatorType;
            E &&
              Ps(A) &&
              ((r = r.responseEnd), (i += E * (r < c ? 1 : (c - g) / (r - g))));
          }
          if ((--u, (t += (8 * (n + i)) / (a.duration / 1e3)), l++, 10 < l))
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
  var Pc = null,
    lf = null;
  function jn(l) {
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  function ld(l) {
    switch (l) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function td(l, t) {
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
  function tf(l, t) {
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
  var ef = null;
  function W0() {
    var l = window.event;
    return l && l.type === "popstate"
      ? l === ef
        ? !1
        : ((ef = l), !0)
      : ((ef = null), !1);
  }
  var ed = typeof setTimeout == "function" ? setTimeout : void 0,
    $0 = typeof clearTimeout == "function" ? clearTimeout : void 0,
    ud = typeof Promise == "function" ? Promise : void 0,
    F0 =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof ud < "u"
          ? function (l) {
              return ud.resolve(null).then(l).catch(k0);
            }
          : ed;
  function k0(l) {
    setTimeout(function () {
      throw l;
    });
  }
  function Se(l) {
    return l === "head";
  }
  function ad(l, t) {
    var e = t,
      u = 0;
    do {
      var a = e.nextSibling;
      if ((l.removeChild(e), a && a.nodeType === 8))
        if (((e = a.data), e === "/$" || e === "/&")) {
          if (u === 0) {
            (l.removeChild(a), _u(t));
            return;
          }
          u--;
        } else if (
          e === "$" ||
          e === "$?" ||
          e === "$~" ||
          e === "$!" ||
          e === "&"
        )
          u++;
        else if (e === "html") ha(l.ownerDocument.documentElement);
        else if (e === "head") {
          ((e = l.ownerDocument.head), ha(e));
          for (var n = e.firstChild; n; ) {
            var i = n.nextSibling,
              c = n.nodeName;
            (n[ju] ||
              c === "SCRIPT" ||
              c === "STYLE" ||
              (c === "LINK" && n.rel.toLowerCase() === "stylesheet") ||
              e.removeChild(n),
              (n = i));
          }
        } else e === "body" && ha(l.ownerDocument.body);
      e = a;
    } while (e);
    _u(t);
  }
  function nd(l, t) {
    var e = l;
    l = 0;
    do {
      var u = e.nextSibling;
      if (
        (e.nodeType === 1
          ? t
            ? ((e._stashedDisplay = e.style.display),
              (e.style.display = "none"))
            : ((e.style.display = e._stashedDisplay || ""),
              e.getAttribute("style") === "" && e.removeAttribute("style"))
          : e.nodeType === 3 &&
            (t
              ? ((e._stashedText = e.nodeValue), (e.nodeValue = ""))
              : (e.nodeValue = e._stashedText || "")),
        u && u.nodeType === 8)
      )
        if (((e = u.data), e === "/$")) {
          if (l === 0) break;
          l--;
        } else (e !== "$" && e !== "$?" && e !== "$~" && e !== "$!") || l++;
      e = u;
    } while (e);
  }
  function uf(l) {
    var t = l.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var e = t;
      switch (((t = t.nextSibling), e.nodeName)) {
        case "HTML":
        case "HEAD":
        case "BODY":
          (uf(e), fi(e));
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (e.rel.toLowerCase() === "stylesheet") continue;
      }
      l.removeChild(e);
    }
  }
  function I0(l, t, e, u) {
    for (; l.nodeType === 1; ) {
      var a = e;
      if (l.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!u && (l.nodeName !== "INPUT" || l.type !== "hidden")) break;
      } else if (u) {
        if (!l[ju])
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
                n !== a.rel ||
                l.getAttribute("href") !==
                  (a.href == null || a.href === "" ? null : a.href) ||
                l.getAttribute("crossorigin") !==
                  (a.crossOrigin == null ? null : a.crossOrigin) ||
                l.getAttribute("title") !== (a.title == null ? null : a.title)
              )
                break;
              return l;
            case "style":
              if (l.hasAttribute("data-precedence")) break;
              return l;
            case "script":
              if (
                ((n = l.getAttribute("src")),
                (n !== (a.src == null ? null : a.src) ||
                  l.getAttribute("type") !== (a.type == null ? null : a.type) ||
                  l.getAttribute("crossorigin") !==
                    (a.crossOrigin == null ? null : a.crossOrigin)) &&
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
        var n = a.name == null ? null : "" + a.name;
        if (a.type === "hidden" && l.getAttribute("name") === n) return l;
      } else return l;
      if (((l = At(l.nextSibling)), l === null)) break;
    }
    return null;
  }
  function P0(l, t, e) {
    if (t === "") return null;
    for (; l.nodeType !== 3; )
      if (
        ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") &&
          !e) ||
        ((l = At(l.nextSibling)), l === null)
      )
        return null;
    return l;
  }
  function id(l, t) {
    for (; l.nodeType !== 8; )
      if (
        ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") &&
          !t) ||
        ((l = At(l.nextSibling)), l === null)
      )
        return null;
    return l;
  }
  function af(l) {
    return l.data === "$?" || l.data === "$~";
  }
  function nf(l) {
    return (
      l.data === "$!" ||
      (l.data === "$?" && l.ownerDocument.readyState !== "loading")
    );
  }
  function ly(l, t) {
    var e = l.ownerDocument;
    if (l.data === "$~") l._reactRetry = t;
    else if (l.data !== "$?" || e.readyState !== "loading") t();
    else {
      var u = function () {
        (t(), e.removeEventListener("DOMContentLoaded", u));
      };
      (e.addEventListener("DOMContentLoaded", u), (l._reactRetry = u));
    }
  }
  function At(l) {
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
  var cf = null;
  function cd(l) {
    l = l.nextSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var e = l.data;
        if (e === "/$" || e === "/&") {
          if (t === 0) return At(l.nextSibling);
          t--;
        } else
          (e !== "$" && e !== "$!" && e !== "$?" && e !== "$~" && e !== "&") ||
            t++;
      }
      l = l.nextSibling;
    }
    return null;
  }
  function fd(l) {
    l = l.previousSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var e = l.data;
        if (e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&") {
          if (t === 0) return l;
          t--;
        } else (e !== "/$" && e !== "/&") || t++;
      }
      l = l.previousSibling;
    }
    return null;
  }
  function od(l, t, e) {
    switch (((t = jn(e)), l)) {
      case "html":
        if (((l = t.documentElement), !l)) throw Error(o(452));
        return l;
      case "head":
        if (((l = t.head), !l)) throw Error(o(453));
        return l;
      case "body":
        if (((l = t.body), !l)) throw Error(o(454));
        return l;
      default:
        throw Error(o(451));
    }
  }
  function ha(l) {
    for (var t = l.attributes; t.length; ) l.removeAttributeNode(t[0]);
    fi(l);
  }
  var Mt = new Map(),
    rd = new Set();
  function qn(l) {
    return typeof l.getRootNode == "function"
      ? l.getRootNode()
      : l.nodeType === 9
        ? l
        : l.ownerDocument;
  }
  var It = U.d;
  U.d = { f: ty, r: ey, D: uy, C: ay, L: ny, m: iy, X: fy, S: cy, M: oy };
  function ty() {
    var l = It.f(),
      t = Mn();
    return l || t;
  }
  function ey(l) {
    var t = Je(l);
    t !== null && t.tag === 5 && t.type === "form" ? _r(t) : It.r(l);
  }
  var Ou = typeof document > "u" ? null : document;
  function sd(l, t, e) {
    var u = Ou;
    if (u && typeof t == "string" && t) {
      var a = St(t);
      ((a = 'link[rel="' + l + '"][href="' + a + '"]'),
        typeof e == "string" && (a += '[crossorigin="' + e + '"]'),
        rd.has(a) ||
          (rd.add(a),
          (l = { rel: l, crossOrigin: e, href: t }),
          u.querySelector(a) === null &&
            ((t = u.createElement("link")),
            wl(t, "link", l),
            Xl(t),
            u.head.appendChild(t))));
    }
  }
  function uy(l) {
    (It.D(l), sd("dns-prefetch", l, null));
  }
  function ay(l, t) {
    (It.C(l, t), sd("preconnect", l, t));
  }
  function ny(l, t, e) {
    It.L(l, t, e);
    var u = Ou;
    if (u && l && t) {
      var a = 'link[rel="preload"][as="' + St(t) + '"]';
      t === "image" && e && e.imageSrcSet
        ? ((a += '[imagesrcset="' + St(e.imageSrcSet) + '"]'),
          typeof e.imageSizes == "string" &&
            (a += '[imagesizes="' + St(e.imageSizes) + '"]'))
        : (a += '[href="' + St(l) + '"]');
      var n = a;
      switch (t) {
        case "style":
          n = Au(l);
          break;
        case "script":
          n = Mu(l);
      }
      Mt.has(n) ||
        ((l = C(
          {
            rel: "preload",
            href: t === "image" && e && e.imageSrcSet ? void 0 : l,
            as: t,
          },
          e,
        )),
        Mt.set(n, l),
        u.querySelector(a) !== null ||
          (t === "style" && u.querySelector(ga(n))) ||
          (t === "script" && u.querySelector(Sa(n))) ||
          ((t = u.createElement("link")),
          wl(t, "link", l),
          Xl(t),
          u.head.appendChild(t)));
    }
  }
  function iy(l, t) {
    It.m(l, t);
    var e = Ou;
    if (e && l) {
      var u = t && typeof t.as == "string" ? t.as : "script",
        a =
          'link[rel="modulepreload"][as="' + St(u) + '"][href="' + St(l) + '"]',
        n = a;
      switch (u) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          n = Mu(l);
      }
      if (
        !Mt.has(n) &&
        ((l = C({ rel: "modulepreload", href: l }, t)),
        Mt.set(n, l),
        e.querySelector(a) === null)
      ) {
        switch (u) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (e.querySelector(Sa(n))) return;
        }
        ((u = e.createElement("link")),
          wl(u, "link", l),
          Xl(u),
          e.head.appendChild(u));
      }
    }
  }
  function cy(l, t, e) {
    It.S(l, t, e);
    var u = Ou;
    if (u && l) {
      var a = we(u).hoistableStyles,
        n = Au(l);
      t = t || "default";
      var i = a.get(n);
      if (!i) {
        var c = { loading: 0, preload: null };
        if ((i = u.querySelector(ga(n)))) c.loading = 5;
        else {
          ((l = C({ rel: "stylesheet", href: l, "data-precedence": t }, e)),
            (e = Mt.get(n)) && ff(l, e));
          var r = (i = u.createElement("link"));
          (Xl(r),
            wl(r, "link", l),
            (r._p = new Promise(function (g, E) {
              ((r.onload = g), (r.onerror = E));
            })),
            r.addEventListener("load", function () {
              c.loading |= 1;
            }),
            r.addEventListener("error", function () {
              c.loading |= 2;
            }),
            (c.loading |= 4),
            Bn(i, t, u));
        }
        ((i = { type: "stylesheet", instance: i, count: 1, state: c }),
          a.set(n, i));
      }
    }
  }
  function fy(l, t) {
    It.X(l, t);
    var e = Ou;
    if (e && l) {
      var u = we(e).hoistableScripts,
        a = Mu(l),
        n = u.get(a);
      n ||
        ((n = e.querySelector(Sa(a))),
        n ||
          ((l = C({ src: l, async: !0 }, t)),
          (t = Mt.get(a)) && of(l, t),
          (n = e.createElement("script")),
          Xl(n),
          wl(n, "link", l),
          e.head.appendChild(n)),
        (n = { type: "script", instance: n, count: 1, state: null }),
        u.set(a, n));
    }
  }
  function oy(l, t) {
    It.M(l, t);
    var e = Ou;
    if (e && l) {
      var u = we(e).hoistableScripts,
        a = Mu(l),
        n = u.get(a);
      n ||
        ((n = e.querySelector(Sa(a))),
        n ||
          ((l = C({ src: l, async: !0, type: "module" }, t)),
          (t = Mt.get(a)) && of(l, t),
          (n = e.createElement("script")),
          Xl(n),
          wl(n, "link", l),
          e.head.appendChild(n)),
        (n = { type: "script", instance: n, count: 1, state: null }),
        u.set(a, n));
    }
  }
  function dd(l, t, e, u) {
    var a = (a = w.current) ? qn(a) : null;
    if (!a) throw Error(o(446));
    switch (l) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof e.precedence == "string" && typeof e.href == "string"
          ? ((t = Au(e.href)),
            (e = we(a).hoistableStyles),
            (u = e.get(t)),
            u ||
              ((u = { type: "style", instance: null, count: 0, state: null }),
              e.set(t, u)),
            u)
          : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (
          e.rel === "stylesheet" &&
          typeof e.href == "string" &&
          typeof e.precedence == "string"
        ) {
          l = Au(e.href);
          var n = we(a).hoistableStyles,
            i = n.get(l);
          if (
            (i ||
              ((a = a.ownerDocument || a),
              (i = {
                type: "stylesheet",
                instance: null,
                count: 0,
                state: { loading: 0, preload: null },
              }),
              n.set(l, i),
              (n = a.querySelector(ga(l))) &&
                !n._p &&
                ((i.instance = n), (i.state.loading = 5)),
              Mt.has(l) ||
                ((e = {
                  rel: "preload",
                  as: "style",
                  href: e.href,
                  crossOrigin: e.crossOrigin,
                  integrity: e.integrity,
                  media: e.media,
                  hrefLang: e.hrefLang,
                  referrerPolicy: e.referrerPolicy,
                }),
                Mt.set(l, e),
                n || ry(a, l, e, i.state))),
            t && u === null)
          )
            throw Error(o(528, ""));
          return i;
        }
        if (t && u !== null) throw Error(o(529, ""));
        return null;
      case "script":
        return (
          (t = e.async),
          (e = e.src),
          typeof e == "string" &&
          t &&
          typeof t != "function" &&
          typeof t != "symbol"
            ? ((t = Mu(e)),
              (e = we(a).hoistableScripts),
              (u = e.get(t)),
              u ||
                ((u = {
                  type: "script",
                  instance: null,
                  count: 0,
                  state: null,
                }),
                e.set(t, u)),
              u)
            : { type: "void", instance: null, count: 0, state: null }
        );
      default:
        throw Error(o(444, l));
    }
  }
  function Au(l) {
    return 'href="' + St(l) + '"';
  }
  function ga(l) {
    return 'link[rel="stylesheet"][' + l + "]";
  }
  function vd(l) {
    return C({}, l, { "data-precedence": l.precedence, precedence: null });
  }
  function ry(l, t, e, u) {
    l.querySelector('link[rel="preload"][as="style"][' + t + "]")
      ? (u.loading = 1)
      : ((t = l.createElement("link")),
        (u.preload = t),
        t.addEventListener("load", function () {
          return (u.loading |= 1);
        }),
        t.addEventListener("error", function () {
          return (u.loading |= 2);
        }),
        wl(t, "link", e),
        Xl(t),
        l.head.appendChild(t));
  }
  function Mu(l) {
    return '[src="' + St(l) + '"]';
  }
  function Sa(l) {
    return "script[async]" + l;
  }
  function yd(l, t, e) {
    if ((t.count++, t.instance === null))
      switch (t.type) {
        case "style":
          var u = l.querySelector('style[data-href~="' + St(e.href) + '"]');
          if (u) return ((t.instance = u), Xl(u), u);
          var a = C({}, e, {
            "data-href": e.href,
            "data-precedence": e.precedence,
            href: null,
            precedence: null,
          });
          return (
            (u = (l.ownerDocument || l).createElement("style")),
            Xl(u),
            wl(u, "style", a),
            Bn(u, e.precedence, l),
            (t.instance = u)
          );
        case "stylesheet":
          a = Au(e.href);
          var n = l.querySelector(ga(a));
          if (n) return ((t.state.loading |= 4), (t.instance = n), Xl(n), n);
          ((u = vd(e)),
            (a = Mt.get(a)) && ff(u, a),
            (n = (l.ownerDocument || l).createElement("link")),
            Xl(n));
          var i = n;
          return (
            (i._p = new Promise(function (c, r) {
              ((i.onload = c), (i.onerror = r));
            })),
            wl(n, "link", u),
            (t.state.loading |= 4),
            Bn(n, e.precedence, l),
            (t.instance = n)
          );
        case "script":
          return (
            (n = Mu(e.src)),
            (a = l.querySelector(Sa(n)))
              ? ((t.instance = a), Xl(a), a)
              : ((u = e),
                (a = Mt.get(n)) && ((u = C({}, e)), of(u, a)),
                (l = l.ownerDocument || l),
                (a = l.createElement("script")),
                Xl(a),
                wl(a, "link", u),
                l.head.appendChild(a),
                (t.instance = a))
          );
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" &&
        (t.state.loading & 4) === 0 &&
        ((u = t.instance), (t.state.loading |= 4), Bn(u, e.precedence, l));
    return t.instance;
  }
  function Bn(l, t, e) {
    for (
      var u = e.querySelectorAll(
          'link[rel="stylesheet"][data-precedence],style[data-precedence]',
        ),
        a = u.length ? u[u.length - 1] : null,
        n = a,
        i = 0;
      i < u.length;
      i++
    ) {
      var c = u[i];
      if (c.dataset.precedence === t) n = c;
      else if (n !== a) break;
    }
    n
      ? n.parentNode.insertBefore(l, n.nextSibling)
      : ((t = e.nodeType === 9 ? e.head : e), t.insertBefore(l, t.firstChild));
  }
  function ff(l, t) {
    (l.crossOrigin == null && (l.crossOrigin = t.crossOrigin),
      l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy),
      l.title == null && (l.title = t.title));
  }
  function of(l, t) {
    (l.crossOrigin == null && (l.crossOrigin = t.crossOrigin),
      l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy),
      l.integrity == null && (l.integrity = t.integrity));
  }
  var Yn = null;
  function md(l, t, e) {
    if (Yn === null) {
      var u = new Map(),
        a = (Yn = new Map());
      a.set(e, u);
    } else ((a = Yn), (u = a.get(e)), u || ((u = new Map()), a.set(e, u)));
    if (u.has(l)) return u;
    for (
      u.set(l, null), e = e.getElementsByTagName(l), a = 0;
      a < e.length;
      a++
    ) {
      var n = e[a];
      if (
        !(
          n[ju] ||
          n[Ll] ||
          (l === "link" && n.getAttribute("rel") === "stylesheet")
        ) &&
        n.namespaceURI !== "http://www.w3.org/2000/svg"
      ) {
        var i = n.getAttribute(t) || "";
        i = l + i;
        var c = u.get(i);
        c ? c.push(n) : u.set(i, [n]);
      }
    }
    return u;
  }
  function hd(l, t, e) {
    ((l = l.ownerDocument || l),
      l.head.insertBefore(
        e,
        t === "title" ? l.querySelector("head > title") : null,
      ));
  }
  function sy(l, t, e) {
    if (e === 1 || t.itemProp != null) return !1;
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
  function gd(l) {
    return !(l.type === "stylesheet" && (l.state.loading & 3) === 0);
  }
  function dy(l, t, e, u) {
    if (
      e.type === "stylesheet" &&
      (typeof u.media != "string" || matchMedia(u.media).matches !== !1) &&
      (e.state.loading & 4) === 0
    ) {
      if (e.instance === null) {
        var a = Au(u.href),
          n = t.querySelector(ga(a));
        if (n) {
          ((t = n._p),
            t !== null &&
              typeof t == "object" &&
              typeof t.then == "function" &&
              (l.count++, (l = Gn.bind(l)), t.then(l, l)),
            (e.state.loading |= 4),
            (e.instance = n),
            Xl(n));
          return;
        }
        ((n = t.ownerDocument || t),
          (u = vd(u)),
          (a = Mt.get(a)) && ff(u, a),
          (n = n.createElement("link")),
          Xl(n));
        var i = n;
        ((i._p = new Promise(function (c, r) {
          ((i.onload = c), (i.onerror = r));
        })),
          wl(n, "link", u),
          (e.instance = n));
      }
      (l.stylesheets === null && (l.stylesheets = new Map()),
        l.stylesheets.set(e, t),
        (t = e.state.preload) &&
          (e.state.loading & 3) === 0 &&
          (l.count++,
          (e = Gn.bind(l)),
          t.addEventListener("load", e),
          t.addEventListener("error", e)));
    }
  }
  var rf = 0;
  function vy(l, t) {
    return (
      l.stylesheets && l.count === 0 && Qn(l, l.stylesheets),
      0 < l.count || 0 < l.imgCount
        ? function (e) {
            var u = setTimeout(function () {
              if ((l.stylesheets && Qn(l, l.stylesheets), l.unsuspend)) {
                var n = l.unsuspend;
                ((l.unsuspend = null), n());
              }
            }, 6e4 + t);
            0 < l.imgBytes && rf === 0 && (rf = 62500 * w0());
            var a = setTimeout(
              function () {
                if (
                  ((l.waitingForImages = !1),
                  l.count === 0 &&
                    (l.stylesheets && Qn(l, l.stylesheets), l.unsuspend))
                ) {
                  var n = l.unsuspend;
                  ((l.unsuspend = null), n());
                }
              },
              (l.imgBytes > rf ? 50 : 800) + t,
            );
            return (
              (l.unsuspend = e),
              function () {
                ((l.unsuspend = null), clearTimeout(u), clearTimeout(a));
              }
            );
          }
        : null
    );
  }
  function Gn() {
    if (
      (this.count--,
      this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))
    ) {
      if (this.stylesheets) Qn(this, this.stylesheets);
      else if (this.unsuspend) {
        var l = this.unsuspend;
        ((this.unsuspend = null), l());
      }
    }
  }
  var Xn = null;
  function Qn(l, t) {
    ((l.stylesheets = null),
      l.unsuspend !== null &&
        (l.count++,
        (Xn = new Map()),
        t.forEach(yy, l),
        (Xn = null),
        Gn.call(l)));
  }
  function yy(l, t) {
    if (!(t.state.loading & 4)) {
      var e = Xn.get(l);
      if (e) var u = e.get(null);
      else {
        ((e = new Map()), Xn.set(l, e));
        for (
          var a = l.querySelectorAll(
              "link[data-precedence],style[data-precedence]",
            ),
            n = 0;
          n < a.length;
          n++
        ) {
          var i = a[n];
          (i.nodeName === "LINK" || i.getAttribute("media") !== "not all") &&
            (e.set(i.dataset.precedence, i), (u = i));
        }
        u && e.set(null, u);
      }
      ((a = t.instance),
        (i = a.getAttribute("data-precedence")),
        (n = e.get(i) || u),
        n === u && e.set(null, a),
        e.set(i, a),
        this.count++,
        (u = Gn.bind(this)),
        a.addEventListener("load", u),
        a.addEventListener("error", u),
        n
          ? n.parentNode.insertBefore(a, n.nextSibling)
          : ((l = l.nodeType === 9 ? l.head : l),
            l.insertBefore(a, l.firstChild)),
        (t.state.loading |= 4));
    }
  }
  var ba = {
    $$typeof: zl,
    Provider: null,
    Consumer: null,
    _currentValue: G,
    _currentValue2: G,
    _threadCount: 0,
  };
  function my(l, t, e, u, a, n, i, c, r) {
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
      (this.expirationTimes = ai(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = ai(0)),
      (this.hiddenUpdates = ai(null)),
      (this.identifierPrefix = u),
      (this.onUncaughtError = a),
      (this.onCaughtError = n),
      (this.onRecoverableError = i),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = r),
      (this.incompleteTransitions = new Map()));
  }
  function Sd(l, t, e, u, a, n, i, c, r, g, E, A) {
    return (
      (l = new my(l, t, e, i, r, g, E, A, c)),
      (t = 1),
      n === !0 && (t |= 24),
      (n = ot(3, null, null, t)),
      (l.current = n),
      (n.stateNode = l),
      (t = Zi()),
      t.refCount++,
      (l.pooledCache = t),
      t.refCount++,
      (n.memoizedState = { element: u, isDehydrated: e, cache: t }),
      Ji(n),
      l
    );
  }
  function bd(l) {
    return l ? ((l = uu), l) : uu;
  }
  function pd(l, t, e, u, a, n) {
    ((a = bd(a)),
      u.context === null ? (u.context = a) : (u.pendingContext = a),
      (u = ce(t)),
      (u.payload = { element: e }),
      (n = n === void 0 ? null : n),
      n !== null && (u.callback = n),
      (e = fe(l, u, t)),
      e !== null && (at(e, l, t), ku(e, l, t)));
  }
  function Ed(l, t) {
    if (((l = l.memoizedState), l !== null && l.dehydrated !== null)) {
      var e = l.retryLane;
      l.retryLane = e !== 0 && e < t ? e : t;
    }
  }
  function sf(l, t) {
    (Ed(l, t), (l = l.alternate) && Ed(l, t));
  }
  function zd(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = Re(l, 67108864);
      (t !== null && at(t, l, 67108864), sf(l, 67108864));
    }
  }
  function Td(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = yt();
      t = ni(t);
      var e = Re(l, t);
      (e !== null && at(e, l, t), sf(l, t));
    }
  }
  var xn = !0;
  function hy(l, t, e, u) {
    var a = p.T;
    p.T = null;
    var n = U.p;
    try {
      ((U.p = 2), df(l, t, e, u));
    } finally {
      ((U.p = n), (p.T = a));
    }
  }
  function gy(l, t, e, u) {
    var a = p.T;
    p.T = null;
    var n = U.p;
    try {
      ((U.p = 8), df(l, t, e, u));
    } finally {
      ((U.p = n), (p.T = a));
    }
  }
  function df(l, t, e, u) {
    if (xn) {
      var a = vf(u);
      if (a === null) (kc(l, t, u, Zn, e), Ad(l, u));
      else if (by(a, l, t, e, u)) u.stopPropagation();
      else if ((Ad(l, u), t & 4 && -1 < Sy.indexOf(l))) {
        for (; a !== null; ) {
          var n = Je(a);
          if (n !== null)
            switch (n.tag) {
              case 3:
                if (((n = n.stateNode), n.current.memoizedState.isDehydrated)) {
                  var i = Me(n.pendingLanes);
                  if (i !== 0) {
                    var c = n;
                    for (c.pendingLanes |= 2, c.entangledLanes |= 2; i; ) {
                      var r = 1 << (31 - ct(i));
                      ((c.entanglements[1] |= r), (i &= ~r));
                    }
                    (Ct(n), (nl & 6) === 0 && ((On = nt() + 500), va(0)));
                  }
                }
                break;
              case 31:
              case 13:
                ((c = Re(n, 2)), c !== null && at(c, n, 2), Mn(), sf(n, 2));
            }
          if (((n = vf(u)), n === null && kc(l, t, u, Zn, e), n === a)) break;
          a = n;
        }
        a !== null && u.stopPropagation();
      } else kc(l, t, u, null, e);
    }
  }
  function vf(l) {
    return ((l = yi(l)), yf(l));
  }
  var Zn = null;
  function yf(l) {
    if (((Zn = null), (l = Ke(l)), l !== null)) {
      var t = _(l);
      if (t === null) l = null;
      else {
        var e = t.tag;
        if (e === 13) {
          if (((l = q(t)), l !== null)) return l;
          l = null;
        } else if (e === 31) {
          if (((l = x(t)), l !== null)) return l;
          l = null;
        } else if (e === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          l = null;
        } else t !== l && (l = null);
      }
    }
    return ((Zn = l), null);
  }
  function Od(l) {
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
        switch (uv()) {
          case Rf:
            return 2;
          case Hf:
            return 8;
          case Na:
          case av:
            return 32;
          case Cf:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var mf = !1,
    be = null,
    pe = null,
    Ee = null,
    pa = new Map(),
    Ea = new Map(),
    ze = [],
    Sy =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
        " ",
      );
  function Ad(l, t) {
    switch (l) {
      case "focusin":
      case "focusout":
        be = null;
        break;
      case "dragenter":
      case "dragleave":
        pe = null;
        break;
      case "mouseover":
      case "mouseout":
        Ee = null;
        break;
      case "pointerover":
      case "pointerout":
        pa.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Ea.delete(t.pointerId);
    }
  }
  function za(l, t, e, u, a, n) {
    return l === null || l.nativeEvent !== n
      ? ((l = {
          blockedOn: t,
          domEventName: e,
          eventSystemFlags: u,
          nativeEvent: n,
          targetContainers: [a],
        }),
        t !== null && ((t = Je(t)), t !== null && zd(t)),
        l)
      : ((l.eventSystemFlags |= u),
        (t = l.targetContainers),
        a !== null && t.indexOf(a) === -1 && t.push(a),
        l);
  }
  function by(l, t, e, u, a) {
    switch (t) {
      case "focusin":
        return ((be = za(be, l, t, e, u, a)), !0);
      case "dragenter":
        return ((pe = za(pe, l, t, e, u, a)), !0);
      case "mouseover":
        return ((Ee = za(Ee, l, t, e, u, a)), !0);
      case "pointerover":
        var n = a.pointerId;
        return (pa.set(n, za(pa.get(n) || null, l, t, e, u, a)), !0);
      case "gotpointercapture":
        return (
          (n = a.pointerId),
          Ea.set(n, za(Ea.get(n) || null, l, t, e, u, a)),
          !0
        );
    }
    return !1;
  }
  function Md(l) {
    var t = Ke(l.target);
    if (t !== null) {
      var e = _(t);
      if (e !== null) {
        if (((t = e.tag), t === 13)) {
          if (((t = q(e)), t !== null)) {
            ((l.blockedOn = t),
              Xf(l.priority, function () {
                Td(e);
              }));
            return;
          }
        } else if (t === 31) {
          if (((t = x(e)), t !== null)) {
            ((l.blockedOn = t),
              Xf(l.priority, function () {
                Td(e);
              }));
            return;
          }
        } else if (t === 3 && e.stateNode.current.memoizedState.isDehydrated) {
          l.blockedOn = e.tag === 3 ? e.stateNode.containerInfo : null;
          return;
        }
      }
    }
    l.blockedOn = null;
  }
  function Ln(l) {
    if (l.blockedOn !== null) return !1;
    for (var t = l.targetContainers; 0 < t.length; ) {
      var e = vf(l.nativeEvent);
      if (e === null) {
        e = l.nativeEvent;
        var u = new e.constructor(e.type, e);
        ((vi = u), e.target.dispatchEvent(u), (vi = null));
      } else return ((t = Je(e)), t !== null && zd(t), (l.blockedOn = e), !1);
      t.shift();
    }
    return !0;
  }
  function _d(l, t, e) {
    Ln(l) && e.delete(t);
  }
  function py() {
    ((mf = !1),
      be !== null && Ln(be) && (be = null),
      pe !== null && Ln(pe) && (pe = null),
      Ee !== null && Ln(Ee) && (Ee = null),
      pa.forEach(_d),
      Ea.forEach(_d));
  }
  function Vn(l, t) {
    l.blockedOn === t &&
      ((l.blockedOn = null),
      mf ||
        ((mf = !0),
        f.unstable_scheduleCallback(f.unstable_NormalPriority, py)));
  }
  var Kn = null;
  function Dd(l) {
    Kn !== l &&
      ((Kn = l),
      f.unstable_scheduleCallback(f.unstable_NormalPriority, function () {
        Kn === l && (Kn = null);
        for (var t = 0; t < l.length; t += 3) {
          var e = l[t],
            u = l[t + 1],
            a = l[t + 2];
          if (typeof u != "function") {
            if (yf(u || e) === null) continue;
            break;
          }
          var n = Je(e);
          n !== null &&
            (l.splice(t, 3),
            (t -= 3),
            dc(n, { pending: !0, data: a, method: e.method, action: u }, u, a));
        }
      }));
  }
  function _u(l) {
    function t(r) {
      return Vn(r, l);
    }
    (be !== null && Vn(be, l),
      pe !== null && Vn(pe, l),
      Ee !== null && Vn(Ee, l),
      pa.forEach(t),
      Ea.forEach(t));
    for (var e = 0; e < ze.length; e++) {
      var u = ze[e];
      u.blockedOn === l && (u.blockedOn = null);
    }
    for (; 0 < ze.length && ((e = ze[0]), e.blockedOn === null); )
      (Md(e), e.blockedOn === null && ze.shift());
    if (((e = (l.ownerDocument || l).$$reactFormReplay), e != null))
      for (u = 0; u < e.length; u += 3) {
        var a = e[u],
          n = e[u + 1],
          i = a[Il] || null;
        if (typeof n == "function") i || Dd(e);
        else if (i) {
          var c = null;
          if (n && n.hasAttribute("formAction")) {
            if (((a = n), (i = n[Il] || null))) c = i.formAction;
            else if (yf(a) !== null) continue;
          } else c = i.action;
          (typeof c == "function" ? (e[u + 1] = c) : (e.splice(u, 3), (u -= 3)),
            Dd(e));
        }
      }
  }
  function Ud() {
    function l(n) {
      n.canIntercept &&
        n.info === "react-transition" &&
        n.intercept({
          handler: function () {
            return new Promise(function (i) {
              return (a = i);
            });
          },
          focusReset: "manual",
          scroll: "manual",
        });
    }
    function t() {
      (a !== null && (a(), (a = null)), u || setTimeout(e, 20));
    }
    function e() {
      if (!u && !navigation.transition) {
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
      var u = !1,
        a = null;
      return (
        navigation.addEventListener("navigate", l),
        navigation.addEventListener("navigatesuccess", t),
        navigation.addEventListener("navigateerror", t),
        setTimeout(e, 100),
        function () {
          ((u = !0),
            navigation.removeEventListener("navigate", l),
            navigation.removeEventListener("navigatesuccess", t),
            navigation.removeEventListener("navigateerror", t),
            a !== null && (a(), (a = null)));
        }
      );
    }
  }
  function hf(l) {
    this._internalRoot = l;
  }
  ((Jn.prototype.render = hf.prototype.render =
    function (l) {
      var t = this._internalRoot;
      if (t === null) throw Error(o(409));
      var e = t.current,
        u = yt();
      pd(e, u, l, t, null, null);
    }),
    (Jn.prototype.unmount = hf.prototype.unmount =
      function () {
        var l = this._internalRoot;
        if (l !== null) {
          this._internalRoot = null;
          var t = l.containerInfo;
          (pd(l.current, 2, null, l, null, null), Mn(), (t[Ve] = null));
        }
      }));
  function Jn(l) {
    this._internalRoot = l;
  }
  Jn.prototype.unstable_scheduleHydration = function (l) {
    if (l) {
      var t = Gf();
      l = { blockedOn: null, target: l, priority: t };
      for (var e = 0; e < ze.length && t !== 0 && t < ze[e].priority; e++);
      (ze.splice(e, 0, l), e === 0 && Md(l));
    }
  };
  var Nd = v.version;
  if (Nd !== "19.2.4") throw Error(o(527, Nd, "19.2.4"));
  U.findDOMNode = function (l) {
    var t = l._reactInternals;
    if (t === void 0)
      throw typeof l.render == "function"
        ? Error(o(188))
        : ((l = Object.keys(l).join(",")), Error(o(268, l)));
    return (
      (l = z(t)),
      (l = l !== null ? L(l) : null),
      (l = l === null ? null : l.stateNode),
      l
    );
  };
  var Ey = {
    bundleType: 0,
    version: "19.2.4",
    rendererPackageName: "react-dom",
    currentDispatcherRef: p,
    reconcilerVersion: "19.2.4",
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var wn = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!wn.isDisabled && wn.supportsFiber)
      try {
        ((Ru = wn.inject(Ey)), (it = wn));
      } catch {}
  }
  return (
    (Oa.createRoot = function (l, t) {
      if (!M(l)) throw Error(o(299));
      var e = !1,
        u = "",
        a = Yr,
        n = Gr,
        i = Xr;
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (e = !0),
          t.identifierPrefix !== void 0 && (u = t.identifierPrefix),
          t.onUncaughtError !== void 0 && (a = t.onUncaughtError),
          t.onCaughtError !== void 0 && (n = t.onCaughtError),
          t.onRecoverableError !== void 0 && (i = t.onRecoverableError)),
        (t = Sd(l, 1, !1, null, null, e, u, null, a, n, i, Ud)),
        (l[Ve] = t.current),
        Fc(l),
        new hf(t)
      );
    }),
    (Oa.hydrateRoot = function (l, t, e) {
      if (!M(l)) throw Error(o(299));
      var u = !1,
        a = "",
        n = Yr,
        i = Gr,
        c = Xr,
        r = null;
      return (
        e != null &&
          (e.unstable_strictMode === !0 && (u = !0),
          e.identifierPrefix !== void 0 && (a = e.identifierPrefix),
          e.onUncaughtError !== void 0 && (n = e.onUncaughtError),
          e.onCaughtError !== void 0 && (i = e.onCaughtError),
          e.onRecoverableError !== void 0 && (c = e.onRecoverableError),
          e.formState !== void 0 && (r = e.formState)),
        (t = Sd(l, 1, !0, t, e ?? null, u, a, r, n, i, c, Ud)),
        (t.context = bd(null)),
        (e = t.current),
        (u = yt()),
        (u = ni(u)),
        (a = ce(u)),
        (a.callback = null),
        fe(e, a, u),
        (e = u),
        (t.current.lanes = e),
        Cu(t, e),
        Ct(t),
        (l[Ve] = t.current),
        Fc(l),
        new Jn(t)
      );
    }),
    (Oa.version = "19.2.4"),
    Oa
  );
}
var Qd;
function Cy() {
  if (Qd) return bf.exports;
  Qd = 1;
  function f() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(f);
      } catch (v) {
        console.error(v);
      }
  }
  return (f(), (bf.exports = Hy()), bf.exports);
}
var jy = Cy();
function xd(f, v) {
  (v == null || v > f.length) && (v = f.length);
  for (var m = 0, o = Array(v); m < v; m++) o[m] = f[m];
  return o;
}
function qy(f) {
  if (Array.isArray(f)) return f;
}
function By(f, v, m) {
  return (
    (v = Ly(v)) in f
      ? Object.defineProperty(f, v, {
          value: m,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (f[v] = m),
    f
  );
}
function Yy(f, v) {
  var m =
    f == null
      ? null
      : (typeof Symbol < "u" && f[Symbol.iterator]) || f["@@iterator"];
  if (m != null) {
    var o,
      M,
      _,
      q,
      x = [],
      D = !0,
      z = !1;
    try {
      if (((_ = (m = m.call(f)).next), v !== 0))
        for (
          ;
          !(D = (o = _.call(m)).done) && (x.push(o.value), x.length !== v);
          D = !0
        );
    } catch (L) {
      ((z = !0), (M = L));
    } finally {
      try {
        if (!D && m.return != null && ((q = m.return()), Object(q) !== q))
          return;
      } finally {
        if (z) throw M;
      }
    }
    return x;
  }
}
function Gy() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Zd(f, v) {
  var m = Object.keys(f);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(f);
    (v &&
      (o = o.filter(function (M) {
        return Object.getOwnPropertyDescriptor(f, M).enumerable;
      })),
      m.push.apply(m, o));
  }
  return m;
}
function Ld(f) {
  for (var v = 1; v < arguments.length; v++) {
    var m = arguments[v] != null ? arguments[v] : {};
    v % 2
      ? Zd(Object(m), !0).forEach(function (o) {
          By(f, o, m[o]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(f, Object.getOwnPropertyDescriptors(m))
        : Zd(Object(m)).forEach(function (o) {
            Object.defineProperty(f, o, Object.getOwnPropertyDescriptor(m, o));
          });
  }
  return f;
}
function Xy(f, v) {
  if (f == null) return {};
  var m,
    o,
    M = Qy(f, v);
  if (Object.getOwnPropertySymbols) {
    var _ = Object.getOwnPropertySymbols(f);
    for (o = 0; o < _.length; o++)
      ((m = _[o]),
        v.indexOf(m) === -1 &&
          {}.propertyIsEnumerable.call(f, m) &&
          (M[m] = f[m]));
  }
  return M;
}
function Qy(f, v) {
  if (f == null) return {};
  var m = {};
  for (var o in f)
    if ({}.hasOwnProperty.call(f, o)) {
      if (v.indexOf(o) !== -1) continue;
      m[o] = f[o];
    }
  return m;
}
function xy(f, v) {
  return qy(f) || Yy(f, v) || Vy(f, v) || Gy();
}
function Zy(f, v) {
  if (typeof f != "object" || !f) return f;
  var m = f[Symbol.toPrimitive];
  if (m !== void 0) {
    var o = m.call(f, v);
    if (typeof o != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (v === "string" ? String : Number)(f);
}
function Ly(f) {
  var v = Zy(f, "string");
  return typeof v == "symbol" ? v : v + "";
}
function Vy(f, v) {
  if (f) {
    if (typeof f == "string") return xd(f, v);
    var m = {}.toString.call(f).slice(8, -1);
    return (
      m === "Object" && f.constructor && (m = f.constructor.name),
      m === "Map" || m === "Set"
        ? Array.from(f)
        : m === "Arguments" ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(m)
          ? xd(f, v)
          : void 0
    );
  }
}
function Ky(f, v, m) {
  return (
    v in f
      ? Object.defineProperty(f, v, {
          value: m,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (f[v] = m),
    f
  );
}
function Vd(f, v) {
  var m = Object.keys(f);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(f);
    (v &&
      (o = o.filter(function (M) {
        return Object.getOwnPropertyDescriptor(f, M).enumerable;
      })),
      m.push.apply(m, o));
  }
  return m;
}
function Kd(f) {
  for (var v = 1; v < arguments.length; v++) {
    var m = arguments[v] != null ? arguments[v] : {};
    v % 2
      ? Vd(Object(m), !0).forEach(function (o) {
          Ky(f, o, m[o]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(f, Object.getOwnPropertyDescriptors(m))
        : Vd(Object(m)).forEach(function (o) {
            Object.defineProperty(f, o, Object.getOwnPropertyDescriptor(m, o));
          });
  }
  return f;
}
function Jy() {
  for (var f = arguments.length, v = new Array(f), m = 0; m < f; m++)
    v[m] = arguments[m];
  return function (o) {
    return v.reduceRight(function (M, _) {
      return _(M);
    }, o);
  };
}
function Aa(f) {
  return function v() {
    for (
      var m = this, o = arguments.length, M = new Array(o), _ = 0;
      _ < o;
      _++
    )
      M[_] = arguments[_];
    return M.length >= f.length
      ? f.apply(this, M)
      : function () {
          for (var q = arguments.length, x = new Array(q), D = 0; D < q; D++)
            x[D] = arguments[D];
          return v.apply(m, [].concat(M, x));
        };
  };
}
function Fn(f) {
  return {}.toString.call(f).includes("Object");
}
function wy(f) {
  return !Object.keys(f).length;
}
function _a(f) {
  return typeof f == "function";
}
function Wy(f, v) {
  return Object.prototype.hasOwnProperty.call(f, v);
}
function $y(f, v) {
  return (
    Fn(v) || Oe("changeType"),
    Object.keys(v).some(function (m) {
      return !Wy(f, m);
    }) && Oe("changeField"),
    v
  );
}
function Fy(f) {
  _a(f) || Oe("selectorType");
}
function ky(f) {
  (_a(f) || Fn(f) || Oe("handlerType"),
    Fn(f) &&
      Object.values(f).some(function (v) {
        return !_a(v);
      }) &&
      Oe("handlersType"));
}
function Iy(f) {
  (f || Oe("initialIsRequired"),
    Fn(f) || Oe("initialType"),
    wy(f) && Oe("initialContent"));
}
function Py(f, v) {
  throw new Error(f[v] || f.default);
}
var lm = {
    initialIsRequired: "initial state is required",
    initialType: "initial state should be an object",
    initialContent: "initial state shouldn't be an empty object",
    handlerType: "handler should be an object or a function",
    handlersType: "all handlers should be a functions",
    selectorType: "selector should be a function",
    changeType: "provided value of changes should be an object",
    changeField:
      'it seams you want to change a field in the state which is not specified in the "initial" state',
    default: "an unknown error accured in `state-local` package",
  },
  Oe = Aa(Py)(lm),
  Wn = { changes: $y, selector: Fy, handler: ky, initial: Iy };
function tm(f) {
  var v = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  (Wn.initial(f), Wn.handler(v));
  var m = { current: f },
    o = Aa(am)(m, v),
    M = Aa(um)(m),
    _ = Aa(Wn.changes)(f),
    q = Aa(em)(m);
  function x() {
    var z =
      arguments.length > 0 && arguments[0] !== void 0
        ? arguments[0]
        : function (L) {
            return L;
          };
    return (Wn.selector(z), z(m.current));
  }
  function D(z) {
    Jy(o, M, _, q)(z);
  }
  return [x, D];
}
function em(f, v) {
  return _a(v) ? v(f.current) : v;
}
function um(f, v) {
  return ((f.current = Kd(Kd({}, f.current), v)), v);
}
function am(f, v, m) {
  return (
    _a(v)
      ? v(f.current)
      : Object.keys(m).forEach(function (o) {
          var M;
          return (M = v[o]) === null || M === void 0
            ? void 0
            : M.call(v, f.current[o]);
        }),
    m
  );
}
var nm = { create: tm },
  im = {
    paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs" },
  };
function cm(f) {
  return function v() {
    for (
      var m = this, o = arguments.length, M = new Array(o), _ = 0;
      _ < o;
      _++
    )
      M[_] = arguments[_];
    return M.length >= f.length
      ? f.apply(this, M)
      : function () {
          for (var q = arguments.length, x = new Array(q), D = 0; D < q; D++)
            x[D] = arguments[D];
          return v.apply(m, [].concat(M, x));
        };
  };
}
function fm(f) {
  return {}.toString.call(f).includes("Object");
}
function om(f) {
  return (
    f || Jd("configIsRequired"),
    fm(f) || Jd("configType"),
    f.urls ? (rm(), { paths: { vs: f.urls.monacoBase } }) : f
  );
}
function rm() {
  console.warn(wd.deprecation);
}
function sm(f, v) {
  throw new Error(f[v] || f.default);
}
var wd = {
    configIsRequired: "the configuration object is required",
    configType: "the configuration object should be an object",
    default: "an unknown error accured in `@monaco-editor/loader` package",
    deprecation: `Deprecation warning!
    You are using deprecated way of configuration.

    Instead of using
      monaco.config({ urls: { monacoBase: '...' } })
    use
      monaco.config({ paths: { vs: '...' } })

    For more please check the link https://github.com/suren-atoyan/monaco-loader#config
  `,
  },
  Jd = cm(sm)(wd),
  dm = { config: om },
  vm = function () {
    for (var v = arguments.length, m = new Array(v), o = 0; o < v; o++)
      m[o] = arguments[o];
    return function (M) {
      return m.reduceRight(function (_, q) {
        return q(_);
      }, M);
    };
  };
function Wd(f, v) {
  return (
    Object.keys(v).forEach(function (m) {
      v[m] instanceof Object && f[m] && Object.assign(v[m], Wd(f[m], v[m]));
    }),
    Ld(Ld({}, f), v)
  );
}
var ym = { type: "cancelation", msg: "operation is manually canceled" };
function Tf(f) {
  var v = !1,
    m = new Promise(function (o, M) {
      (f.then(function (_) {
        return v ? M(ym) : o(_);
      }),
        f.catch(M));
    });
  return (
    (m.cancel = function () {
      return (v = !0);
    }),
    m
  );
}
var mm = ["monaco"],
  hm = nm.create({
    config: im,
    isInitialized: !1,
    resolve: null,
    reject: null,
    monaco: null,
  }),
  $d = xy(hm, 2),
  Da = $d[0],
  kn = $d[1];
function gm(f) {
  var v = dm.config(f),
    m = v.monaco,
    o = Xy(v, mm);
  kn(function (M) {
    return { config: Wd(M.config, o), monaco: m };
  });
}
function Sm() {
  var f = Da(function (v) {
    var m = v.monaco,
      o = v.isInitialized,
      M = v.resolve;
    return { monaco: m, isInitialized: o, resolve: M };
  });
  if (!f.isInitialized) {
    if ((kn({ isInitialized: !0 }), f.monaco))
      return (f.resolve(f.monaco), Tf(Of));
    if (window.monaco && window.monaco.editor)
      return (Fd(window.monaco), f.resolve(window.monaco), Tf(Of));
    vm(bm, Em)(zm);
  }
  return Tf(Of);
}
function bm(f) {
  return document.body.appendChild(f);
}
function pm(f) {
  var v = document.createElement("script");
  return (f && (v.src = f), v);
}
function Em(f) {
  var v = Da(function (o) {
      var M = o.config,
        _ = o.reject;
      return { config: M, reject: _ };
    }),
    m = pm("".concat(v.config.paths.vs, "/loader.js"));
  return (
    (m.onload = function () {
      return f();
    }),
    (m.onerror = v.reject),
    m
  );
}
function zm() {
  var f = Da(function (m) {
      var o = m.config,
        M = m.resolve,
        _ = m.reject;
      return { config: o, resolve: M, reject: _ };
    }),
    v = window.require;
  (v.config(f.config),
    v(
      ["vs/editor/editor.main"],
      function (m) {
        var o = m.m || m;
        (Fd(o), f.resolve(o));
      },
      function (m) {
        f.reject(m);
      },
    ));
}
function Fd(f) {
  Da().monaco || kn({ monaco: f });
}
function Tm() {
  return Da(function (f) {
    var v = f.monaco;
    return v;
  });
}
var Of = new Promise(function (f, v) {
    return kn({ resolve: f, reject: v });
  }),
  _f = { config: gm, init: Sm, __getMonacoInstance: Tm },
  Om = {
    wrapper: { display: "flex", position: "relative", textAlign: "initial" },
    fullWidth: { width: "100%" },
    hide: { display: "none" },
  },
  Af = Om,
  Am = {
    container: {
      display: "flex",
      height: "100%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
  },
  Mm = Am;
function _m({ children: f }) {
  return Uu.createElement("div", { style: Mm.container }, f);
}
var Dm = _m,
  Um = Dm;
function Nm({
  width: f,
  height: v,
  isEditorReady: m,
  loading: o,
  _ref: M,
  className: _,
  wrapperProps: q,
}) {
  return Uu.createElement(
    "section",
    { style: { ...Af.wrapper, width: f, height: v }, ...q },
    !m && Uu.createElement(Um, null, o),
    Uu.createElement("div", {
      ref: M,
      style: { ...Af.fullWidth, ...(!m && Af.hide) },
      className: _,
    }),
  );
}
var Rm = Nm,
  kd = Q.memo(Rm);
function Hm(f) {
  Q.useEffect(f, []);
}
var Id = Hm;
function Cm(f, v, m = !0) {
  let o = Q.useRef(!0);
  Q.useEffect(
    o.current || !m
      ? () => {
          o.current = !1;
        }
      : f,
    v,
  );
}
var mt = Cm;
function Ma() {}
function Du(f, v, m, o) {
  return jm(f, o) || qm(f, v, m, o);
}
function jm(f, v) {
  return f.editor.getModel(Pd(f, v));
}
function qm(f, v, m, o) {
  return f.editor.createModel(v, m, o ? Pd(f, o) : void 0);
}
function Pd(f, v) {
  return f.Uri.parse(v);
}
function Bm({
  original: f,
  modified: v,
  language: m,
  originalLanguage: o,
  modifiedLanguage: M,
  originalModelPath: _,
  modifiedModelPath: q,
  keepCurrentOriginalModel: x = !1,
  keepCurrentModifiedModel: D = !1,
  theme: z = "light",
  loading: L = "Loading...",
  options: C = {},
  height: il = "100%",
  width: jl = "100%",
  className: Dl,
  wrapperProps: cl = {},
  beforeMount: xl = Ma,
  onMount: ql = Ma,
}) {
  let [El, zl] = Q.useState(!1),
    [Gl, dl] = Q.useState(!0),
    ul = Q.useRef(null),
    B = Q.useRef(null),
    Ul = Q.useRef(null),
    gl = Q.useRef(ql),
    ll = Q.useRef(xl),
    Zl = Q.useRef(!1);
  (Id(() => {
    let F = _f.init();
    return (
      F.then((p) => (B.current = p) && dl(!1)).catch(
        (p) =>
          p?.type !== "cancelation" &&
          console.error("Monaco initialization: error:", p),
      ),
      () => (ul.current ? $l() : F.cancel())
    );
  }),
    mt(
      () => {
        if (ul.current && B.current) {
          let F = ul.current.getOriginalEditor(),
            p = Du(B.current, f || "", o || m || "text", _ || "");
          p !== F.getModel() && F.setModel(p);
        }
      },
      [_],
      El,
    ),
    mt(
      () => {
        if (ul.current && B.current) {
          let F = ul.current.getModifiedEditor(),
            p = Du(B.current, v || "", M || m || "text", q || "");
          p !== F.getModel() && F.setModel(p);
        }
      },
      [q],
      El,
    ),
    mt(
      () => {
        let F = ul.current.getModifiedEditor();
        F.getOption(B.current.editor.EditorOption.readOnly)
          ? F.setValue(v || "")
          : v !== F.getValue() &&
            (F.executeEdits("", [
              {
                range: F.getModel().getFullModelRange(),
                text: v || "",
                forceMoveMarkers: !0,
              },
            ]),
            F.pushUndoStop());
      },
      [v],
      El,
    ),
    mt(
      () => {
        ul.current?.getModel()?.original.setValue(f || "");
      },
      [f],
      El,
    ),
    mt(
      () => {
        let { original: F, modified: p } = ul.current.getModel();
        (B.current.editor.setModelLanguage(F, o || m || "text"),
          B.current.editor.setModelLanguage(p, M || m || "text"));
      },
      [m, o, M],
      El,
    ),
    mt(
      () => {
        B.current?.editor.setTheme(z);
      },
      [z],
      El,
    ),
    mt(
      () => {
        ul.current?.updateOptions(C);
      },
      [C],
      El,
    ));
  let Bl = Q.useCallback(() => {
      if (!B.current) return;
      ll.current(B.current);
      let F = Du(B.current, f || "", o || m || "text", _ || ""),
        p = Du(B.current, v || "", M || m || "text", q || "");
      ul.current?.setModel({ original: F, modified: p });
    }, [m, v, M, f, o, _, q]),
    ht = Q.useCallback(() => {
      !Zl.current &&
        Ul.current &&
        ((ul.current = B.current.editor.createDiffEditor(Ul.current, {
          automaticLayout: !0,
          ...C,
        })),
        Bl(),
        B.current?.editor.setTheme(z),
        zl(!0),
        (Zl.current = !0));
    }, [C, z, Bl]);
  (Q.useEffect(() => {
    El && gl.current(ul.current, B.current);
  }, [El]),
    Q.useEffect(() => {
      !Gl && !El && ht();
    }, [Gl, El, ht]));
  function $l() {
    let F = ul.current?.getModel();
    (x || F?.original?.dispose(),
      D || F?.modified?.dispose(),
      ul.current?.dispose());
  }
  return Uu.createElement(kd, {
    width: jl,
    height: il,
    isEditorReady: El,
    loading: L,
    _ref: Ul,
    className: Dl,
    wrapperProps: cl,
  });
}
var Ym = Bm;
Q.memo(Ym);
function Gm(f) {
  let v = Q.useRef();
  return (
    Q.useEffect(() => {
      v.current = f;
    }, [f]),
    v.current
  );
}
var Xm = Gm,
  $n = new Map();
function Qm({
  defaultValue: f,
  defaultLanguage: v,
  defaultPath: m,
  value: o,
  language: M,
  path: _,
  theme: q = "light",
  line: x,
  loading: D = "Loading...",
  options: z = {},
  overrideServices: L = {},
  saveViewState: C = !0,
  keepCurrentModel: il = !1,
  width: jl = "100%",
  height: Dl = "100%",
  className: cl,
  wrapperProps: xl = {},
  beforeMount: ql = Ma,
  onMount: El = Ma,
  onChange: zl,
  onValidate: Gl = Ma,
}) {
  let [dl, ul] = Q.useState(!1),
    [B, Ul] = Q.useState(!0),
    gl = Q.useRef(null),
    ll = Q.useRef(null),
    Zl = Q.useRef(null),
    Bl = Q.useRef(El),
    ht = Q.useRef(ql),
    $l = Q.useRef(),
    F = Q.useRef(o),
    p = Xm(_),
    U = Q.useRef(!1),
    G = Q.useRef(!1);
  (Id(() => {
    let s = _f.init();
    return (
      s
        .then((T) => (gl.current = T) && Ul(!1))
        .catch(
          (T) =>
            T?.type !== "cancelation" &&
            console.error("Monaco initialization: error:", T),
        ),
      () => (ll.current ? ol() : s.cancel())
    );
  }),
    mt(
      () => {
        let s = Du(gl.current, f || o || "", v || M || "", _ || m || "");
        s !== ll.current?.getModel() &&
          (C && $n.set(p, ll.current?.saveViewState()),
          ll.current?.setModel(s),
          C && ll.current?.restoreViewState($n.get(_)));
      },
      [_],
      dl,
    ),
    mt(
      () => {
        ll.current?.updateOptions(z);
      },
      [z],
      dl,
    ),
    mt(
      () => {
        !ll.current ||
          o === void 0 ||
          (ll.current.getOption(gl.current.editor.EditorOption.readOnly)
            ? ll.current.setValue(o)
            : o !== ll.current.getValue() &&
              ((G.current = !0),
              ll.current.executeEdits("", [
                {
                  range: ll.current.getModel().getFullModelRange(),
                  text: o,
                  forceMoveMarkers: !0,
                },
              ]),
              ll.current.pushUndoStop(),
              (G.current = !1)));
      },
      [o],
      dl,
    ),
    mt(
      () => {
        let s = ll.current?.getModel();
        s && M && gl.current?.editor.setModelLanguage(s, M);
      },
      [M],
      dl,
    ),
    mt(
      () => {
        x !== void 0 && ll.current?.revealLine(x);
      },
      [x],
      dl,
    ),
    mt(
      () => {
        gl.current?.editor.setTheme(q);
      },
      [q],
      dl,
    ));
  let al = Q.useCallback(() => {
    if (!(!Zl.current || !gl.current) && !U.current) {
      ht.current(gl.current);
      let s = _ || m,
        T = Du(gl.current, o || f || "", v || M || "", s || "");
      ((ll.current = gl.current?.editor.create(
        Zl.current,
        { model: T, automaticLayout: !0, ...z },
        L,
      )),
        C && ll.current.restoreViewState($n.get(s)),
        gl.current.editor.setTheme(q),
        x !== void 0 && ll.current.revealLine(x),
        ul(!0),
        (U.current = !0));
    }
  }, [f, v, m, o, M, _, z, L, C, q, x]);
  (Q.useEffect(() => {
    dl && Bl.current(ll.current, gl.current);
  }, [dl]),
    Q.useEffect(() => {
      !B && !dl && al();
    }, [B, dl, al]),
    (F.current = o),
    Q.useEffect(() => {
      dl &&
        zl &&
        ($l.current?.dispose(),
        ($l.current = ll.current?.onDidChangeModelContent((s) => {
          G.current || zl(ll.current.getValue(), s);
        })));
    }, [dl, zl]),
    Q.useEffect(() => {
      if (dl) {
        let s = gl.current.editor.onDidChangeMarkers((T) => {
          let N = ll.current.getModel()?.uri;
          if (N && T.find((R) => R.path === N.path)) {
            let R = gl.current.editor.getModelMarkers({ resource: N });
            Gl?.(R);
          }
        });
        return () => {
          s?.dispose();
        };
      }
      return () => {};
    }, [dl, Gl]));
  function ol() {
    ($l.current?.dispose(),
      il
        ? C && $n.set(_, ll.current.saveViewState())
        : ll.current.getModel()?.dispose(),
      ll.current.dispose());
  }
  return Uu.createElement(kd, {
    width: jl,
    height: Dl,
    isEditorReady: dl,
    loading: D,
    _ref: Zl,
    className: cl,
    wrapperProps: xl,
  });
}
var xm = Qm,
  Zm = Q.memo(xm),
  Lm = Zm;
function Vm(f) {
  return new Worker("/assets/editor.worker-CdQrwHl8.js", { name: f?.name });
}
function Km(f) {
  return new Worker("/assets/json.worker-BoL8UZqY.js", { name: f?.name });
}
function Jm(f) {
  return new Worker("/assets/css.worker-DBVD8oXr.js", { name: f?.name });
}
function wm(f) {
  return new Worker("/assets/html.worker-CwpTb9lJ.js", { name: f?.name });
}
function Wm(f) {
  return new Worker("/assets/ts.worker-BH9nVgjN.js", { name: f?.name });
}
function $m() {
  const [f, v] = Q.useState(null);
  Q.useEffect(() => {
    function o(M) {
      const _ = M.data;
      _.type === "ORIGIN_INIT"
        ? v(_.context)
        : _.type === "ORIGIN_THEME_CHANGE"
          ? v((q) => q && { ...q, theme: _.theme })
          : _.type === "ORIGIN_CONFIG_UPDATE" &&
            v((q) => q && { ...q, config: _.config });
    }
    return (
      window.addEventListener("message", o),
      window.parent.postMessage({ type: "ORIGIN_READY" }, "*"),
      () => window.removeEventListener("message", o)
    );
  }, []);
  const m = Q.useCallback((o) => {
    window.parent.postMessage({ type: "ORIGIN_CONFIG_SET", patch: o }, "*");
  }, []);
  return f ? { ...f, setConfig: m } : null;
}
function Fm(f, v) {
  return (
    Q.useEffect(() => {
      window.parent.postMessage(
        { type: "ORIGIN_BUS_SUBSCRIBE", channel: f },
        "*",
      );
      function o(M) {
        const _ = M.data;
        _.type === "ORIGIN_BUS_EVENT" && _.channel === f && v && v(_.payload);
      }
      return (
        window.addEventListener("message", o),
        () => {
          (window.removeEventListener("message", o),
            window.parent.postMessage(
              { type: "ORIGIN_BUS_UNSUBSCRIBE", channel: f },
              "*",
            ));
        }
      );
    }, [f, v]),
    Q.useCallback(
      (o) => {
        window.parent.postMessage(
          { type: "ORIGIN_BUS_PUBLISH", channel: f, payload: o },
          "*",
        );
      },
      [f],
    )
  );
}
function Df(f, v) {
  return new Promise((m, o) => {
    const M = crypto.randomUUID();
    function _(q) {
      const x = q.data;
      x.type === "ORIGIN_INVOKE_RESULT" && x.id === M
        ? (window.removeEventListener("message", _), m(x.result))
        : x.type === "ORIGIN_INVOKE_ERROR" &&
          x.id === M &&
          (window.removeEventListener("message", _), o(new Error(x.error)));
    }
    (window.addEventListener("message", _),
      window.parent.postMessage(
        { type: "ORIGIN_INVOKE", id: M, command: f, args: v ?? {} },
        "*",
      ));
  });
}
function km(f) {
  return Df("plugin:fs|read_text_file", { path: f });
}
function Im(f, v) {
  return Df("plugin:fs|write_text_file", { path: f, contents: v });
}
function Pm(f) {
  return Df("plugin:dialog|open", f ?? {});
}
function lh(f) {
  const v = f.split(".").pop()?.toLowerCase() ?? "";
  return (
    {
      ts: "typescript",
      tsx: "typescript",
      js: "javascript",
      jsx: "javascript",
      json: "json",
      md: "markdown",
      rs: "rust",
      css: "css",
      html: "html",
      py: "python",
      sh: "shell",
      toml: "toml",
      yaml: "yaml",
      yml: "yaml",
    }[v] ?? "plaintext"
  );
}
function th(f) {
  return f.split(/[\\/]/).pop() ?? f;
}
function eh({ context: f }) {
  const [v, m] = Q.useState(null),
    [o, M] = Q.useState(""),
    [_, q] = Q.useState("plaintext"),
    [x, D] = Q.useState(!1),
    z = f.theme === "dark";
  async function L(cl) {
    try {
      const xl = await km(cl);
      (m(cl), M(xl), q(lh(cl)), D(!1));
    } catch {}
  }
  async function C() {
    const cl = await Pm({ multiple: !1 });
    cl && (await L(cl));
  }
  async function il() {
    if (!(!v || !x))
      try {
        (await Im(v, o), D(!1));
      } catch {}
  }
  const jl = Q.useCallback((cl) => {
      (M(cl ?? ""), D(!0));
    }, []),
    Dl = Q.useCallback((cl) => {
      const { path: xl, type: ql } = cl;
      ql === "file" && L(xl);
    }, []);
  return (
    Fm("origin:workspace/active-path", Dl),
    jt.jsxs("div", {
      className: "flex h-full flex-col",
      children: [
        jt.jsxs("div", {
          className: `flex shrink-0 items-center gap-2 border-b px-3 py-2 text-sm ${z ? "border-zinc-700 text-zinc-100" : "border-zinc-200 text-zinc-900"}`,
          children: [
            jt.jsxs("span", {
              className: "truncate text-xs opacity-60 font-mono",
              children: [v ? th(v) : "No file open", x && " •"],
            }),
            jt.jsx("button", {
              onClick: C,
              className:
                "ml-auto shrink-0 rounded px-2 py-0.5 text-xs hover:bg-white/10",
              children: "Open",
            }),
            jt.jsx("button", {
              onClick: il,
              disabled: !x || !v,
              className:
                "shrink-0 rounded px-2 py-0.5 text-xs hover:bg-white/10 disabled:opacity-30",
              children: "Save",
            }),
          ],
        }),
        jt.jsx("div", {
          className: "min-h-0 flex-1",
          children: jt.jsx(Lm, {
            height: "100%",
            language: _,
            value: o,
            onChange: jl,
            theme: z ? "vs-dark" : "vs-light",
            options: {
              minimap: { enabled: !1 },
              fontSize: 12,
              lineNumbers: "on",
              scrollBeyondLastLine: !1,
              wordWrap: "on",
            },
          }),
        }),
      ],
    })
  );
}
self.MonacoEnvironment = {
  getWorker(f, v) {
    return v === "json"
      ? new Km()
      : v === "css" || v === "scss" || v === "less"
        ? new Jm()
        : v === "html" || v === "handlebars" || v === "razor"
          ? new wm()
          : v === "typescript" || v === "javascript"
            ? new Wm()
            : new Vm();
  },
};
_f.config({ monaco: Ty });
function uh() {
  const f = $m();
  return f ? jt.jsx(eh, { context: f }) : null;
}
jy.createRoot(document.getElementById("root")).render(
  jt.jsx(Q.StrictMode, { children: jt.jsx(uh, {}) }),
);

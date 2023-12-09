/*! jCarousel - v0.3.9 - 2018-07-30
 * http://sorgalla.com/jcarousel/
 * Copyright (c) 2006-2018 Jan Sorgalla; Licensed MIT */

!(function (t) {
  "use strict";
  var i = (t.jCarousel = {});
  i.version = "0.3.9";
  var s = /^([+\-]=)?(.+)$/;
  (i.parseTarget = function (t) {
    var i = !1,
      e = "object" != typeof t ? s.exec(t) : null;
    return (
      e
        ? ((t = parseInt(e[2], 10) || 0),
          e[1] && ((i = !0), "-=" === e[1] && (t *= -1)))
        : "object" != typeof t && (t = parseInt(t, 10) || 0),
      { target: t, relative: i }
    );
  }),
    (i.detectCarousel = function (t) {
      for (var i; t.length > 0; ) {
        if ((i = t.filter("[data-jcarousel]")).length > 0) return i;
        if ((i = t.find("[data-jcarousel]")).length > 0) return i;
        t = t.parent();
      }
      return null;
    }),
    (i.base = function (s) {
      return {
        version: i.version,
        _options: {},
        _element: null,
        _carousel: null,
        _init: t.noop,
        _create: t.noop,
        _destroy: t.noop,
        _reload: t.noop,
        create: function () {
          return (
            this._element.attr("data-" + s.toLowerCase(), !0).data(s, this),
            !1 === this._trigger("create")
              ? this
              : (this._create(), this._trigger("createend"), this)
          );
        },
        destroy: function () {
          return !1 === this._trigger("destroy")
            ? this
            : (this._destroy(),
              this._trigger("destroyend"),
              this._element.removeData(s).removeAttr("data-" + s.toLowerCase()),
              this);
        },
        reload: function (t) {
          return !1 === this._trigger("reload")
            ? this
            : (t && this.options(t),
              this._reload(),
              this._trigger("reloadend"),
              this);
        },
        element: function () {
          return this._element;
        },
        options: function (i, s) {
          if (0 === arguments.length) return t.extend({}, this._options);
          if ("string" == typeof i) {
            if (void 0 === s)
              return void 0 === this._options[i] ? null : this._options[i];
            this._options[i] = s;
          } else this._options = t.extend({}, this._options, i);
          return this;
        },
        carousel: function () {
          return (
            this._carousel ||
              ((this._carousel = i.detectCarousel(
                this.options("carousel") || this._element
              )),
              this._carousel ||
                t.error('Could not detect carousel for plugin "' + s + '"')),
            this._carousel
          );
        },
        _trigger: function (i, e, r) {
          var n,
            o = !1;
          return (
            (r = [this].concat(r || [])),
            (e || this._element).each(function () {
              (n = t.Event((s + ":" + i).toLowerCase())),
                t(this).trigger(n, r),
                n.isDefaultPrevented() && (o = !0);
            }),
            !o
          );
        },
      };
    }),
    (i.plugin = function (s, e) {
      var r = (t[s] = function (i, s) {
        (this._element = t(i)), this.options(s), this._init(), this.create();
      });
      return (
        (r.fn = r.prototype = t.extend({}, i.base(s), e)),
        (t.fn[s] = function (i) {
          var e = Array.prototype.slice.call(arguments, 1),
            n = this;
          return (
            "string" == typeof i
              ? this.each(function () {
                  var r = t(this).data(s);
                  if (!r)
                    return t.error(
                      "Cannot call methods on " +
                        s +
                        ' prior to initialization; attempted to call method "' +
                        i +
                        '"'
                    );
                  if (!t.isFunction(r[i]) || "_" === i.charAt(0))
                    return t.error(
                      'No such method "' + i + '" for ' + s + " instance"
                    );
                  var o = r[i].apply(r, e);
                  return o !== r && void 0 !== o ? ((n = o), !1) : void 0;
                })
              : this.each(function () {
                  var e = t(this).data(s);
                  e instanceof r ? e.reload(i) : new r(this, i);
                }),
            n
          );
        }),
        r
      );
    });
})(jQuery),
  (function (t, i) {
    "use strict";
    var s = t(i),
      e = function (t) {
        return parseFloat(t) || 0;
      };
    t.jCarousel.plugin("jcarousel", {
      animating: !1,
      tail: 0,
      inTail: !1,
      resizeState: null,
      resizeTimer: null,
      lt: null,
      vertical: !1,
      rtl: !1,
      circular: !1,
      underflow: !1,
      relative: !1,
      _options: {
        list: function () {
          return this.element().children().eq(0);
        },
        items: function () {
          return this.list().children();
        },
        animation: 400,
        transitions: !1,
        wrap: null,
        vertical: null,
        rtl: null,
        center: !1,
      },
      _list: null,
      _items: null,
      _target: t(),
      _first: t(),
      _last: t(),
      _visible: t(),
      _fullyvisible: t(),
      _init: function () {
        var t = this;
        return (
          (t.resizeState = s.width() + "x" + s.height()),
          (this.onWindowResize = function () {
            t.resizeTimer && clearTimeout(t.resizeTimer),
              (t.resizeTimer = setTimeout(function () {
                var i = s.width() + "x" + s.height();
                i !== t.resizeState && ((t.resizeState = i), t.reload());
              }, 100));
          }),
          this
        );
      },
      _create: function () {
        this._reload(), s.on("resize.jcarousel", this.onWindowResize);
      },
      _destroy: function () {
        s.off("resize.jcarousel", this.onWindowResize);
      },
      _reload: function () {
        (this.vertical = this.options("vertical")),
          null == this.vertical &&
            (this.vertical = e(this.list().height()) > e(this.list().width())),
          (this.rtl = this.options("rtl")),
          null == this.rtl &&
            (this.rtl = (function (i) {
              if ("rtl" === ("" + i.attr("dir")).toLowerCase()) return !0;
              var s = !1;
              return (
                i.parents("[dir]").each(function () {
                  if (/rtl/i.test(t(this).attr("dir"))) return (s = !0), !1;
                }),
                s
              );
            })(this._element)),
          (this.lt = this.vertical ? "top" : "left"),
          (this.relative = "relative" === this.list().css("position")),
          (this._list = null),
          (this._items = null);
        var i = this.index(this._target) >= 0 ? this._target : this.closest();
        (this.circular = "circular" === this.options("wrap")),
          (this.underflow = !1);
        var s = { left: 0, top: 0 };
        return (
          i.length > 0 &&
            (this._prepare(i),
            this.list().find("[data-jcarousel-clone]").remove(),
            (this._items = null),
            (this.underflow = this._fullyvisible.length >= this.items().length),
            (this.circular = this.circular && !this.underflow),
            (s[this.lt] = this._position(i) + "px")),
          this.move(s),
          this
        );
      },
      list: function () {
        if (null === this._list) {
          var i = this.options("list");
          this._list = t.isFunction(i) ? i.call(this) : this._element.find(i);
        }
        return this._list;
      },
      items: function () {
        if (null === this._items) {
          var i = this.options("items");
          this._items = (
            t.isFunction(i) ? i.call(this) : this.list().find(i)
          ).not("[data-jcarousel-clone]");
        }
        return this._items;
      },
      index: function (t) {
        return this.items().index(t);
      },
      closest: function () {
        var i,
          s = this,
          r = this.list().position()[this.lt],
          n = t(),
          o = !1,
          l = this.vertical
            ? "bottom"
            : this.rtl && !this.relative
            ? "left"
            : "right";
        return (
          this.rtl &&
            this.relative &&
            !this.vertical &&
            (r += e(this.list().width()) - this.clipping()),
          this.items().each(function () {
            if (((n = t(this)), o)) return !1;
            var a = s.dimension(n);
            if ((r += a) >= 0) {
              if (
                ((i = a - e(n.css("margin-" + l))),
                !(Math.abs(r) - a + i / 2 <= 0))
              )
                return !1;
              o = !0;
            }
          }),
          n
        );
      },
      target: function () {
        return this._target;
      },
      first: function () {
        return this._first;
      },
      last: function () {
        return this._last;
      },
      visible: function () {
        return this._visible;
      },
      fullyvisible: function () {
        return this._fullyvisible;
      },
      hasNext: function () {
        if (!1 === this._trigger("hasnext")) return !0;
        var t = this.options("wrap"),
          i = this.items().length - 1,
          s = this.options("center") ? this._target : this._last;
        return !!(
          i >= 0 &&
          !this.underflow &&
          ((t && "first" !== t) ||
            this.index(s) < i ||
            (this.tail && !this.inTail))
        );
      },
      hasPrev: function () {
        if (!1 === this._trigger("hasprev")) return !0;
        var t = this.options("wrap");
        return !!(
          this.items().length > 0 &&
          !this.underflow &&
          ((t && "last" !== t) ||
            this.index(this._first) > 0 ||
            (this.tail && this.inTail))
        );
      },
      clipping: function () {
        return e(
          this._element["inner" + (this.vertical ? "Height" : "Width")]()
        );
      },
      dimension: function (t) {
        return e(t["outer" + (this.vertical ? "Height" : "Width")](!0));
      },
      scroll: function (i, s, e) {
        if (this.animating) return this;
        if (!1 === this._trigger("scroll", null, [i, s])) return this;
        t.isFunction(s) && ((e = s), (s = !0));
        var r = t.jCarousel.parseTarget(i);
        if (r.relative) {
          var n,
            o,
            l,
            a,
            h,
            u,
            c,
            f,
            d = this.items().length - 1,
            _ = Math.abs(r.target),
            p = this.options("wrap");
          if (r.target > 0) {
            var g = this.index(this._last);
            if (g >= d && this.tail)
              this.inTail
                ? "both" === p || "last" === p
                  ? this._scroll(0, s, e)
                  : t.isFunction(e) && e.call(this, !1)
                : this._scrollTail(s, e);
            else if (
              ((n = this.index(this._target)),
              (this.underflow &&
                n === d &&
                ("circular" === p || "both" === p || "last" === p)) ||
                (!this.underflow && g === d && ("both" === p || "last" === p)))
            )
              this._scroll(0, s, e);
            else if (((l = n + _), this.circular && l > d)) {
              for (f = d, h = this.items().get(-1); f++ < l; )
                (h = this.items().eq(0)),
                  (u = this._visible.index(h) >= 0) &&
                    h.after(h.clone(!0).attr("data-jcarousel-clone", !0)),
                  this.list().append(h),
                  u ||
                    (((c = {})[this.lt] = this.dimension(h)), this.moveBy(c)),
                  (this._items = null);
              this._scroll(h, s, e);
            } else this._scroll(Math.min(l, d), s, e);
          } else if (this.inTail)
            this._scroll(Math.max(this.index(this._first) - _ + 1, 0), s, e);
          else if (
            ((o = this.index(this._first)),
            (n = this.index(this._target)),
            (l = (a = this.underflow ? n : o) - _),
            a <= 0 &&
              ((this.underflow && "circular" === p) ||
                "both" === p ||
                "first" === p))
          )
            this._scroll(d, s, e);
          else if (this.circular && l < 0) {
            for (f = l, h = this.items().get(0); f++ < 0; ) {
              (h = this.items().eq(-1)),
                (u = this._visible.index(h) >= 0) &&
                  h.after(h.clone(!0).attr("data-jcarousel-clone", !0)),
                this.list().prepend(h),
                (this._items = null);
              var m = this.dimension(h);
              ((c = {})[this.lt] = -m), this.moveBy(c);
            }
            this._scroll(h, s, e);
          } else this._scroll(Math.max(l, 0), s, e);
        } else this._scroll(r.target, s, e);
        return this._trigger("scrollend"), this;
      },
      moveBy: function (t, i) {
        var s = this.list().position(),
          r = 1,
          n = 0;
        return (
          this.rtl &&
            !this.vertical &&
            ((r = -1),
            this.relative && (n = e(this.list().width()) - this.clipping())),
          t.left && (t.left = e(s.left) + n + e(t.left) * r + "px"),
          t.top && (t.top = e(s.top) + n + e(t.top) * r + "px"),
          this.move(t, i)
        );
      },
      move: function (i, s) {
        s = s || {};
        var e = this.options("transitions"),
          r = !!e,
          n = !!e.transforms,
          o = !!e.transforms3d,
          l = s.duration || 0,
          a = this.list();
        if (!r && l > 0) a.animate(i, s);
        else {
          var h = s.complete || t.noop,
            u = {};
          if (r) {
            var c = {
                transitionDuration: a.css("transitionDuration"),
                transitionTimingFunction: a.css("transitionTimingFunction"),
                transitionProperty: a.css("transitionProperty"),
              },
              f = h;
            (h = function () {
              t(this).css(c), f.call(this);
            }),
              (u = {
                transitionDuration: (l > 0 ? l / 1e3 : 0) + "s",
                transitionTimingFunction: e.easing || s.easing,
                transitionProperty:
                  l > 0 ? (n || o ? "all" : i.left ? "left" : "top") : "none",
                transform: "none",
              });
          }
          o
            ? (u.transform =
                "translate3d(" + (i.left || 0) + "," + (i.top || 0) + ",0)")
            : n
            ? (u.transform =
                "translate(" + (i.left || 0) + "," + (i.top || 0) + ")")
            : t.extend(u, i),
            r &&
              l > 0 &&
              a.one(
                "transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd",
                h
              ),
            a.css(u),
            l <= 0 &&
              a.each(function () {
                h.call(this);
              });
        }
      },
      _scroll: function (i, s, r) {
        if (this.animating) return t.isFunction(r) && r.call(this, !1), this;
        if (
          ("object" != typeof i
            ? (i = this.items().eq(i))
            : void 0 === i.jquery && (i = t(i)),
          0 === i.length)
        )
          return t.isFunction(r) && r.call(this, !1), this;
        (this.inTail = !1), this._prepare(i);
        var n = this._position(i);
        if (n === e(this.list().position()[this.lt]))
          return t.isFunction(r) && r.call(this, !1), this;
        var o = {};
        return (o[this.lt] = n + "px"), this._animate(o, s, r), this;
      },
      _scrollTail: function (i, s) {
        if (this.animating || !this.tail)
          return t.isFunction(s) && s.call(this, !1), this;
        var r = this.list().position()[this.lt];
        this.rtl &&
          this.relative &&
          !this.vertical &&
          (r += e(this.list().width()) - this.clipping()),
          this.rtl && !this.vertical ? (r += this.tail) : (r -= this.tail),
          (this.inTail = !0);
        var n = {};
        return (
          (n[this.lt] = r + "px"),
          this._update({
            target: this._target.next(),
            fullyvisible: this._fullyvisible.slice(1).add(this._visible.last()),
          }),
          this._animate(n, i, s),
          this
        );
      },
      _animate: function (i, s, e) {
        if (((e = e || t.noop), !1 === this._trigger("animate")))
          return e.call(this, !1), this;
        this.animating = !0;
        var r = this.options("animation"),
          n = t.proxy(function () {
            this.animating = !1;
            var t = this.list().find("[data-jcarousel-clone]");
            t.length > 0 && (t.remove(), this._reload()),
              this._trigger("animateend"),
              e.call(this, !0);
          }, this),
          o = "object" == typeof r ? t.extend({}, r) : { duration: r },
          l = o.complete || t.noop;
        return (
          !1 === s
            ? (o.duration = 0)
            : void 0 !== t.fx.speeds[o.duration] &&
              (o.duration = t.fx.speeds[o.duration]),
          (o.complete = function () {
            n(), l.call(this);
          }),
          this.move(i, o),
          this
        );
      },
      _prepare: function (i) {
        var s,
          r,
          n,
          o = this.index(i),
          l = o,
          a = this.dimension(i),
          h = this.clipping(),
          u = this.vertical ? "bottom" : this.rtl ? "left" : "right",
          c = this.options("center"),
          f = {
            target: i,
            first: i,
            last: i,
            visible: i,
            fullyvisible: a <= h ? i : t(),
          };
        if ((c && ((a /= 2), (h /= 2)), a < h))
          for (;;) {
            if (0 === (s = this.items().eq(++l)).length) {
              if (!this.circular) break;
              if (((s = this.items().eq(0)), i.get(0) === s.get(0))) break;
              if (
                ((r = this._visible.index(s) >= 0) &&
                  s.after(s.clone(!0).attr("data-jcarousel-clone", !0)),
                this.list().append(s),
                !r)
              ) {
                var d = {};
                (d[this.lt] = this.dimension(s)), this.moveBy(d);
              }
              this._items = null;
            }
            if (0 === (n = this.dimension(s))) break;
            if (
              ((a += n),
              (f.last = s),
              (f.visible = f.visible.add(s)),
              a - e(s.css("margin-" + u)) <= h &&
                (f.fullyvisible = f.fullyvisible.add(s)),
              a >= h)
            )
              break;
          }
        if (!this.circular && !c && a < h)
          for (
            l = o;
            !(
              --l < 0 ||
              0 === (s = this.items().eq(l)).length ||
              0 === (n = this.dimension(s)) ||
              ((a += n),
              (f.first = s),
              (f.visible = f.visible.add(s)),
              a - e(s.css("margin-" + u)) <= h &&
                (f.fullyvisible = f.fullyvisible.add(s)),
              a >= h)
            );

          );
        return (
          this._update(f),
          (this.tail = 0),
          c ||
            "circular" === this.options("wrap") ||
            "custom" === this.options("wrap") ||
            this.index(f.last) !== this.items().length - 1 ||
            ((a -= e(f.last.css("margin-" + u))) > h && (this.tail = a - h)),
          this
        );
      },
      _position: function (t) {
        var i = this._first,
          s = e(i.position()[this.lt]),
          r = this.options("center"),
          n = r ? this.clipping() / 2 - this.dimension(i) / 2 : 0;
        return (
          this.rtl && !this.vertical
            ? (this.relative
                ? (s -= e(this.list().width()) - this.dimension(i))
                : (s -= this.clipping() - this.dimension(i)),
              (s += n))
            : (s -= n),
          !r && (this.index(t) > this.index(i) || this.inTail) && this.tail
            ? ((s = this.rtl && !this.vertical ? s - this.tail : s + this.tail),
              (this.inTail = !0))
            : (this.inTail = !1),
          -s
        );
      },
      _update: function (i) {
        var s,
          e = this,
          r = {
            target: this._target,
            first: this._first,
            last: this._last,
            visible: this._visible,
            fullyvisible: this._fullyvisible,
          },
          n = this.index(i.first || r.first) < this.index(r.first),
          o = function (s) {
            var o = [],
              l = [];
            i[s].each(function () {
              r[s].index(this) < 0 && o.push(this);
            }),
              r[s].each(function () {
                i[s].index(this) < 0 && l.push(this);
              }),
              n ? (o = o.reverse()) : (l = l.reverse()),
              e._trigger(s + "in", t(o)),
              e._trigger(s + "out", t(l)),
              (e["_" + s] = i[s]);
          };
        for (s in i) o(s);
        return this;
      },
    });
  })(jQuery, window),
  (function (t) {
    "use strict";
    t.jcarousel.fn.scrollIntoView = function (i, s, e) {
      var r,
        n = t.jCarousel.parseTarget(i),
        o = this.index(this._fullyvisible.first()),
        l = this.index(this._fullyvisible.last());
      if (
        (r = n.relative
          ? n.target < 0
            ? Math.max(0, o + n.target)
            : l + n.target
          : "object" != typeof n.target
          ? n.target
          : this.index(n.target)) < o
      )
        return this.scroll(r, s, e);
      if (r >= o && r <= l) return t.isFunction(e) && e.call(this, !1), this;
      for (
        var a,
          h = this.items(),
          u = this.clipping(),
          c = this.vertical ? "bottom" : this.rtl ? "left" : "right",
          f = 0;
        0 !== (a = h.eq(r)).length;

      ) {
        if ((f += this.dimension(a)) >= u) {
          f - (parseFloat(a.css("margin-" + c)) || 0) !== u && r++;
          break;
        }
        if (r <= 0) break;
        r--;
      }
      return this.scroll(r, s, e);
    };
  })(jQuery),
  (function (t) {
    "use strict";
    t.jCarousel.plugin("jcarouselControl", {
      _options: { target: "+=1", event: "click", method: "scroll" },
      _active: null,
      _init: function () {
        (this.onDestroy = t.proxy(function () {
          this._destroy(),
            this.carousel().one(
              "jcarousel:createend",
              t.proxy(this._create, this)
            );
        }, this)),
          (this.onReload = t.proxy(this._reload, this)),
          (this.onEvent = t.proxy(function (i) {
            i.preventDefault();
            var s = this.options("method");
            t.isFunction(s)
              ? s.call(this)
              : this.carousel().jcarousel(
                  this.options("method"),
                  this.options("target")
                );
          }, this));
      },
      _create: function () {
        this.carousel()
          .one("jcarousel:destroy", this.onDestroy)
          .on("jcarousel:reloadend jcarousel:scrollend", this.onReload),
          this._element.on(
            this.options("event") + ".jcarouselcontrol",
            this.onEvent
          ),
          this._reload();
      },
      _destroy: function () {
        this._element.off(".jcarouselcontrol", this.onEvent),
          this.carousel()
            .off("jcarousel:destroy", this.onDestroy)
            .off("jcarousel:reloadend jcarousel:scrollend", this.onReload);
      },
      _reload: function () {
        var i,
          s = t.jCarousel.parseTarget(this.options("target")),
          e = this.carousel();
        if (s.relative) i = e.jcarousel(s.target > 0 ? "hasNext" : "hasPrev");
        else {
          var r =
            "object" != typeof s.target
              ? e.jcarousel("items").eq(s.target)
              : s.target;
          i = e.jcarousel("target").index(r) >= 0;
        }
        return (
          this._active !== i &&
            (this._trigger(i ? "active" : "inactive"), (this._active = i)),
          this
        );
      },
    });
  })(jQuery),
  (function (t) {
    "use strict";
    t.jCarousel.plugin("jcarouselPagination", {
      _options: {
        perPage: null,
        item: function (t) {
          return '<a href="#' + t + '">' + t + "</a>";
        },
        event: "click",
        method: "scroll",
      },
      _carouselItems: null,
      _pages: {},
      _items: {},
      _currentPage: null,
      _init: function () {
        (this.onDestroy = t.proxy(function () {
          this._destroy(),
            this.carousel().one(
              "jcarousel:createend",
              t.proxy(this._create, this)
            );
        }, this)),
          (this.onReload = t.proxy(this._reload, this)),
          (this.onScroll = t.proxy(this._update, this));
      },
      _create: function () {
        this.carousel()
          .one("jcarousel:destroy", this.onDestroy)
          .on("jcarousel:reloadend", this.onReload)
          .on("jcarousel:scrollend", this.onScroll),
          this._reload();
      },
      _destroy: function () {
        this._clear(),
          this.carousel()
            .off("jcarousel:destroy", this.onDestroy)
            .off("jcarousel:reloadend", this.onReload)
            .off("jcarousel:scrollend", this.onScroll),
          (this._carouselItems = null);
      },
      _reload: function () {
        var i = this.options("perPage");
        if (
          ((this._pages = {}),
          (this._items = {}),
          t.isFunction(i) && (i = i.call(this)),
          null == i)
        )
          this._pages = this._calculatePages();
        else
          for (
            var s,
              e = parseInt(i, 10) || 0,
              r = this._getCarouselItems(),
              n = 1,
              o = 0;
            0 !== (s = r.eq(o++)).length;

          )
            this._pages[n]
              ? (this._pages[n] = this._pages[n].add(s))
              : (this._pages[n] = s),
              o % e == 0 && n++;
        this._clear();
        var l = this,
          a = this.carousel().data("jcarousel"),
          h = this._element,
          u = this.options("item"),
          c = this._getCarouselItems().length;
        t.each(this._pages, function (i, s) {
          var e = (l._items[i] = t(u.call(l, i, s)));
          e.on(
            l.options("event") + ".jcarouselpagination",
            t.proxy(function () {
              var t = s.eq(0);
              if (a.circular) {
                var e = a.index(a.target()),
                  r = a.index(t);
                parseFloat(i) > parseFloat(l._currentPage)
                  ? r < e && (t = "+=" + (c - e + r))
                  : r > e && (t = "-=" + (e + (c - r)));
              }
              a[this.options("method")](t);
            }, l)
          ),
            h.append(e);
        }),
          this._update();
      },
      _update: function () {
        var i,
          s = this.carousel().jcarousel("target");
        t.each(this._pages, function (t, e) {
          if (
            (e.each(function () {
              if (s.is(this)) return (i = t), !1;
            }),
            i)
          )
            return !1;
        }),
          this._currentPage !== i &&
            (this._trigger("inactive", this._items[this._currentPage]),
            this._trigger("active", this._items[i])),
          (this._currentPage = i);
      },
      items: function () {
        return this._items;
      },
      reloadCarouselItems: function () {
        return (this._carouselItems = null), this;
      },
      _clear: function () {
        this._element.empty(), (this._currentPage = null);
      },
      _calculatePages: function () {
        for (
          var t,
            i,
            s = this.carousel().data("jcarousel"),
            e = this._getCarouselItems(),
            r = s.clipping(),
            n = 0,
            o = 0,
            l = 1,
            a = {};
          0 !== (t = e.eq(o++)).length;

        )
          n + (i = s.dimension(t)) > r && (l++, (n = 0)),
            (n += i),
            a[l] ? (a[l] = a[l].add(t)) : (a[l] = t);
        return a;
      },
      _getCarouselItems: function () {
        return (
          this._carouselItems ||
            (this._carouselItems = this.carousel().jcarousel("items")),
          this._carouselItems
        );
      },
    });
  })(jQuery),
  (function (t, i) {
    "use strict";
    var s, e;
    t.each(
      {
        hidden: "visibilitychange",
        mozHidden: "mozvisibilitychange",
        msHidden: "msvisibilitychange",
        webkitHidden: "webkitvisibilitychange",
      },
      function (t, r) {
        if (void 0 !== i[t]) return (s = t), (e = r), !1;
      }
    ),
      t.jCarousel.plugin("jcarouselAutoscroll", {
        _options: {
          target: "+=1",
          interval: 3e3,
          autostart: !0,
          method: "scroll",
        },
        _timer: null,
        _started: !1,
        _init: function () {
          (this.onDestroy = t.proxy(function () {
            this._destroy(),
              this.carousel().one(
                "jcarousel:createend",
                t.proxy(this._create, this)
              );
          }, this)),
            (this.onAnimateEnd = t.proxy(this._start, this)),
            (this.onVisibilityChange = t.proxy(function () {
              i[s] ? this._stop() : this._start();
            }, this));
        },
        _create: function () {
          this.carousel().one("jcarousel:destroy", this.onDestroy),
            t(i).on(e, this.onVisibilityChange),
            this.options("autostart") && this.start();
        },
        _destroy: function () {
          this._stop(),
            this.carousel().off("jcarousel:destroy", this.onDestroy),
            t(i).off(e, this.onVisibilityChange);
        },
        _start: function () {
          if ((this._stop(), this._started))
            return (
              this.carousel().one("jcarousel:animateend", this.onAnimateEnd),
              (this._timer = setTimeout(
                t.proxy(function () {
                  this.carousel().jcarousel(
                    this.options("method"),
                    this.options("target")
                  );
                }, this),
                this.options("interval")
              )),
              this
            );
        },
        _stop: function () {
          return (
            this._timer && (this._timer = clearTimeout(this._timer)),
            this.carousel().off("jcarousel:animateend", this.onAnimateEnd),
            this
          );
        },
        start: function () {
          return (this._started = !0), this._start(), this;
        },
        stop: function () {
          return (this._started = !1), this._stop(), this;
        },
      });
  })(jQuery, document);

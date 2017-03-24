function init() {
    var i = styles[0],
        f = {
        	mapTypeControl: false,
        	scrollwheel:false,
        	center: {
        	    lat: 1.290270,
        	    lng: 103.851959
        	},
        	zoom: 13,
            navigationControl: !1,
            mapTypeControl: !1,
            scaleControl: !1,
            streetViewControl: !1,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, "map_style"]
            },
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
	        styles: [{"featureType":"all","elementType":"geometry.fill","stylers":[{"weight":"2.00"}]},{"featureType":"all","elementType":"geometry.stroke","stylers":[{"color":"#9c9c9c"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#eeeeee"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#7b7b7b"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#c8d7d4"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#070707"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]}]
        },
        e = $("#editor-map").get(0),
        r, n, t, u;
    map = new google.maps.Map(e, f);
    r = new google.maps.StyledMapType(i.json, {
        name: "Map Style"
    });
    new AutocompleteDirectionsHandler(map);
    var search_box = document.getElementsByClassName('map-search');
    var searchBarHeight = document.getElementById('sticker').offsetHeight;
    var stickyHeaderHeight = document.getElementById('sticker-sticky-wrapper').offsetHeight;
    var map_container = document.getElementById('map-top');
    
    map.mapTypes.set("map_style", r);
    map.setMapTypeId("map_style");
    google.maps.event.addListener(map, "bounds_changed", function() {
        boundsChange(map)
    });
    n = getBoundsFromCookie();
    n && (map.setZoom(n.z), map.setCenter(n.c));
    // t = new google.maps.places.Autocomplete($("#map-location-search")[0]);
    // t.bindTo("bounds", map);
    google.maps.event.addListener(t, "place_changed", function() {
        var n = t.getPlace();
        n.geometry && (n.geometry.viewport ? map.fitBounds(n.geometry.viewport) : map.setCenter(n.geometry.location), setBoundsCookie(map))
    });
    u = JSON.stringify(i.json, undefined, 4);
    $("#style-json").html(u);
    $("#copy-json").zclip({
        path: $.url("Scripts/Shared/Plugins/zclip/ZeroClipboard.swf"),
        copy: function() {
            return JSON.stringify(i.json)
        },
        afterCopy: function() {
            return notify.success("Copied to clipboard!"), ga("send", "event", "Copied JSON", $("h1 .name").text()), !1
        }
    })
}
function AutocompleteDirectionsHandler(map) {
    this.map = map;
    this.originPlaceId = null;
    this.destinationPlaceId = null;
    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');
    var modeSelector = document.getElementById('search_btn');
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(map);

    var originAutocomplete = new google.maps.places.Autocomplete(
        originInput, {
            placeIdOnly: true
        });
    originAutocomplete.setComponentRestrictions({
        'country': ['sg']
    });
    var destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput, {
            placeIdOnly: true
        });
    destinationAutocomplete.setComponentRestrictions({
        'country': ['sg']
    });

    this.setupClickListener('changemode-driving', 'DRIVING');
    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
}
AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
    var radioButton = document.getElementById(id);

    var me = this;
    radioButton.addEventListener('click', function() {
       
        me.travelMode = mode;
   
        me.route();
    });
};

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
    var me = this;
    autocomplete.bindTo('bounds', this.map);
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
        }
        if (mode === 'ORIG') {
            me.originPlaceId = place.place_id;
        } else {
            me.destinationPlaceId = place.place_id;
        }
        //me.route();
    });

};

AutocompleteDirectionsHandler.prototype.route = function() {
    if (!this.originPlaceId || !this.destinationPlaceId) {
        return;
    }
    var me = this;

    this.directionsService.route({
        origin: {
            'placeId': this.originPlaceId
        },
        destination: {
            'placeId': this.destinationPlaceId
        },
        travelMode: 'DRIVING'
    }, function(response, status) {
        if (status === 'OK') {
            me.directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
};
var ZeroClipboard, hljs, map, styles;
(function(n) {
    n.fn.zclip = function(t) {
        if (typeof t != "object" || t.length) {
            if (typeof t == "string") return this.each(function() {
                var r = n(this),
                    u, i;
                t = t.toLowerCase();
                u = r.data("zclipId");
                i = n("#" + u + ".zclip");
                t == "remove" ? (i.remove(), r.removeClass("active hover")) : t == "hide" ? (i.hide(), r.removeClass("active hover")) : t == "show" && i.show()
            })
        } else {
            var i = n.extend({
                path: "ZeroClipboard.swf",
                copy: null,
                beforeCopy: null,
                afterCopy: null,
                clickAfter: !0,
                setHandCursor: !0,
                setCSSEffects: !0
            }, t);
            return this.each(function() {
                var t = n(this),
                    r;
                t.is(":visible") && (typeof i.copy == "string" || n.isFunction(i.copy)) && (ZeroClipboard.setMoviePath(i.path), r = new ZeroClipboard.Client, n.isFunction(i.copy) && t.bind("zClip_copy", i.copy), n.isFunction(i.beforeCopy) && t.bind("zClip_beforeCopy", i.beforeCopy), n.isFunction(i.afterCopy) && t.bind("zClip_afterCopy", i.afterCopy), r.setHandCursor(i.setHandCursor), r.setCSSEffects(i.setCSSEffects), r.addEventListener("mouseOver", function() {
                    t.trigger("mouseenter")
                }), r.addEventListener("mouseOut", function() {
                    t.trigger("mouseleave")
                }), r.addEventListener("mouseDown", function() {
                    t.trigger("mousedown");
                    n.isFunction(i.copy) ? r.setText(t.triggerHandler("zClip_copy")) : r.setText(i.copy);
                    n.isFunction(i.beforeCopy) && t.trigger("zClip_beforeCopy")
                }), r.addEventListener("complete", function(r, u) {
                    n.isFunction(i.afterCopy) ? t.trigger("zClip_afterCopy") : (u.length > 500 && (u = u.substr(0, 500) + "...\n\n(" + (u.length - 500) + " characters not shown)"), t.removeClass("hover"), alert("Copied text to clipboard:\n\n " + u));
                    i.clickAfter && t.trigger("click")
                }), r.glue(t[0], t.parent()[0]), n(window).bind("load resize", function() {
                    r.reposition()
                }))
            })
        }
    }
})(jQuery);
ZeroClipboard = {
    version: "1.0.7",
    clients: {},
    moviePath: "ZeroClipboard.swf",
    nextId: 1,
    $: function(n) {
        return typeof n == "string" && (n = document.getElementById(n)), n.addClass || (n.hide = function() {
            this.style.display = "none"
        }, n.show = function() {
            this.style.display = ""
        }, n.addClass = function(n) {
            this.removeClass(n);
            this.className += " " + n
        }, n.removeClass = function(n) {
            for (var i = this.className.split(/\s+/), r = -1, t = 0; t < i.length; t++) i[t] == n && (r = t, t = i.length);
            return r > -1 && (i.splice(r, 1), this.className = i.join(" ")), this
        }, n.hasClass = function(n) {
            return !!this.className.match(new RegExp("\\s*" + n + "\\s*"))
        }), n
    },
    setMoviePath: function(n) {
        this.moviePath = n
    },
    dispatch: function(n, t, i) {
        var r = this.clients[n];
        r && r.receiveEvent(t, i)
    },
    register: function(n, t) {
        this.clients[n] = t
    },
    getDOMObjectPosition: function(n, t) {
        var i = {
            left: 0,
            top: 0,
            width: n.width ? n.width : n.offsetWidth,
            height: n.height ? n.height : n.offsetHeight
        };
        return n && n != t && (i.left += n.offsetLeft, i.top += n.offsetTop), i
    },
    Client: function(n) {
        this.handlers = {};
        this.id = ZeroClipboard.nextId++;
        this.movieId = "ZeroClipboardMovie_" + this.id;
        ZeroClipboard.register(this.id, this);
        n && this.glue(n)
    }
};
ZeroClipboard.Client.prototype = {
    id: 0,
    ready: !1,
    movie: null,
    clipText: "",
    handCursorEnabled: !0,
    cssEffects: !0,
    handlers: null,
    glue: function(n, t, i) {
        var f, u, r;
        if (this.domElement = ZeroClipboard.$(n), f = 99, this.domElement.style.zIndex && (f = parseInt(this.domElement.style.zIndex, 10) + 1), typeof t == "string" ? t = ZeroClipboard.$(t) : typeof t == "undefined" && (t = document.getElementsByTagName("body")[0]), u = ZeroClipboard.getDOMObjectPosition(this.domElement, t), this.div = document.createElement("div"), this.div.className = "zclip", this.div.id = "zclip-" + this.movieId, $(this.domElement).data("zclipId", "zclip-" + this.movieId), r = this.div.style, r.position = "absolute", r.left = "" + u.left + "px", r.top = "" + u.top + "px", r.width = "" + u.width + "px", r.height = "" + u.height + "px", r.zIndex = f, typeof i == "object")
            for (addedStyle in i) r[addedStyle] = i[addedStyle];
        t.appendChild(this.div);
        this.div.innerHTML = this.getHTML(u.width, u.height)
    },
    getHTML: function(n, t) {
        var i = "",
            r = "id=" + this.id + "&width=" + n + "&height=" + t,
            u;
        return navigator.userAgent.match(/MSIE/) ? (u = location.href.match(/^https/i) ? "https://" : "http://", i += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + u + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + n + '" height="' + t + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + ZeroClipboard.moviePath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + r + '"/><param name="wmode" value="transparent"/><\/object>') : i += '<embed id="' + this.movieId + '" src="' + ZeroClipboard.moviePath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + n + '" height="' + t + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + r + '" wmode="transparent" />', i
    },
    hide: function() {
        this.div && (this.div.style.left = "-2000px")
    },
    show: function() {
        this.reposition()
    },
    destroy: function() {
        if (this.domElement && this.div) {
            this.hide();
            this.div.innerHTML = "";
            var n = document.getElementsByTagName("body")[0];
            try {
                n.removeChild(this.div)
            } catch (t) {}
            this.domElement = null;
            this.div = null
        }
    },
    reposition: function(n) {
        if (n && (this.domElement = ZeroClipboard.$(n), this.domElement || this.hide()), this.domElement && this.div) {
            var t = ZeroClipboard.getDOMObjectPosition(this.domElement),
                i = this.div.style;
            i.left = "" + t.left + "px";
            i.top = "" + t.top + "px"
        }
    },
    setText: function(n) {
        this.clipText = n;
        this.ready && this.movie.setText(n)
    },
    addEventListener: function(n, t) {
        n = n.toString().toLowerCase().replace(/^on/, "");
        this.handlers[n] || (this.handlers[n] = []);
        this.handlers[n].push(t)
    },
    setHandCursor: function(n) {
        this.handCursorEnabled = n;
        this.ready && this.movie.setHandCursor(n)
    },
    setCSSEffects: function(n) {
        this.cssEffects = !!n
    },
    receiveEvent: function(n, t) {
        var r, u, f, i;
        n = n.toString().toLowerCase().replace(/^on/, "");
        switch (n) {
            case "load":
                if (this.movie = document.getElementById(this.movieId), !this.movie) {
                    r = this;
                    setTimeout(function() {
                        r.receiveEvent("load", null)
                    }, 1);
                    return
                }
                if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
                    r = this;
                    setTimeout(function() {
                        r.receiveEvent("load", null)
                    }, 100);
                    this.ready = !0;
                    return
                }
                this.ready = !0;
                try {
                    this.movie.setText(this.clipText)
                } catch (e) {}
                try {
                    this.movie.setHandCursor(this.handCursorEnabled)
                } catch (e) {}
                break;
            case "mouseover":
                this.domElement && this.cssEffects && (this.domElement.addClass("hover"), this.recoverActive && this.domElement.addClass("active"));
                break;
            case "mouseout":
                this.domElement && this.cssEffects && (this.recoverActive = !1, this.domElement.hasClass("active") && (this.domElement.removeClass("active"), this.recoverActive = !0), this.domElement.removeClass("hover"));
                break;
            case "mousedown":
                this.domElement && this.cssEffects && this.domElement.addClass("active");
                break;
            case "mouseup":
                this.domElement && this.cssEffects && (this.domElement.removeClass("active"), this.recoverActive = !1)
        }
        if (this.handlers[n])
            for (u = 0, f = this.handlers[n].length; u < f; u++) i = this.handlers[n][u], typeof i == "function" ? i(this, t) : typeof i == "object" && i.length == 2 ? i[0][i[1]](this, t) : typeof i == "string" && window[i](this, t)
    }
};
hljs = new function() {
    function n(n) {
        return n.replace(/&/gm, "&amp;").replace(/</gm, "&lt;").replace(/>/gm, "&gt;")
    }

    function h(n) {
        for (var t = n.firstChild; t; t = t.nextSibling) {
            if (t.nodeName == "CODE") return t;
            if (!(t.nodeType == 3 && t.nodeValue.match(/\s+/))) break
        }
    }

    function f(n, t) {
        return Array.prototype.map.call(n.childNodes, function(n) {
            return n.nodeType == 3 ? t ? n.nodeValue.replace(/\n/g, "") : n.nodeValue : n.nodeName == "BR" ? "\n" : f(n, t)
        }).join("")
    }

    function c(n) {
        for (var i = (n.className + " " + n.parentNode.className).split(/\s+/), i = i.map(function(n) {
                return n.replace(/^language-/, "")
            }), r = 0; r < i.length; r++)
            if (t[i[r]] || i[r] == "no-highlight") return i[r]
    }

    function e(n) {
        var t = [];
        return function i(n, r) {
            for (var u = n.firstChild; u; u = u.nextSibling) u.nodeType == 3 ? r += u.nodeValue.length : u.nodeName == "BR" ? r += 1 : u.nodeType == 1 && (t.push({
                event: "start",
                offset: r,
                node: u
            }), r = i(u, r), t.push({
                event: "stop",
                offset: r,
                node: u
            }));
            return r
        }(n, 0), t
    }

    function l(t, i, r) {
        function l() {
            return t.length && i.length ? t[0].offset != i[0].offset ? t[0].offset < i[0].offset ? t : i : i[0].event == "start" ? t : i : t.length ? t : i
        }

        function c(t) {
            function i(t) {
                return " " + t.nodeName + '="' + n(t.value) + '"'
            }
            return "<" + t.nodeName + Array.prototype.map.call(t.attributes, i).join("") + ">"
        }
        for (var s = 0, o = "", e = [], u, h, f; t.length || i.length;)
            if (u = l().splice(0, 1)[0], o += n(r.substr(s, u.offset - s)), s = u.offset, u.event == "start") o += c(u.node), e.push(u.node);
            else if (u.event == "stop") {
            f = e.length;
            do f--, h = e[f], o += "<\/" + h.nodeName.toLowerCase() + ">"; while (h != u.node);
            for (e.splice(f, 1); f < e.length;) o += c(e[f]), f++
        }
        return o + n(r.substr(s))
    }

    function a(n) {
        function t(t, i) {
            return RegExp(t, "m" + (n.cI ? "i" : "") + (i ? "g" : ""))
        }

        function i(n, r) {
            var o, s, e, f, u;
            if (!n.compiled) {
                if (n.compiled = !0, o = [], n.k) {
                    s = {};

                    function h(n, t) {
                        t.split(" ").forEach(function(t) {
                            var i = t.split("|");
                            s[i[0]] = [n, i[1] ? Number(i[1]) : 1];
                            o.push(i[0])
                        })
                    }
                    if (n.lR = t(n.l || hljs.IR, !0), typeof n.k == "string") h("keyword", n.k);
                    else
                        for (e in n.k) n.k.hasOwnProperty(e) && h(e, n.k[e]);
                    n.k = s
                }
                for (r && (n.bWK && (n.b = "\\b(" + o.join("|") + ")\\s"), n.bR = t(n.b ? n.b : "\\B|\\b"), n.e || n.eW || (n.e = "\\B|\\b"), n.e && (n.eR = t(n.e)), n.tE = n.e || "", n.eW && r.tE && (n.tE += (n.e ? "|" : "") + r.tE)), n.i && (n.iR = t(n.i)), n.r === undefined && (n.r = 1), n.c || (n.c = []), u = 0; u < n.c.length; u++) n.c[u] == "self" && (n.c[u] = n), i(n.c[u], n);
                for (n.starts && i(n.starts, r), f = [], u = 0; u < n.c.length; u++) f.push(n.c[u].b);
                n.tE && f.push(n.tE);
                n.i && f.push(n.i);
                n.t = f.length ? t(f.join("|"), !0) : {
                    exec: function() {
                        return null
                    }
                }
            }
        }
        i(n)
    }

    function r(i, f) {
        function nt(n, t) {
            for (var r, i = 0; i < t.c.length; i++)
                if (r = t.c[i].bR.exec(n), r && r.index == 0) return t.c[i]
        }

        function w(n, t) {
            return n.e && n.eR.test(t) ? n : n.eW ? w(n.parent, t) : void 0
        }

        function tt(n, t) {
            return t.i && t.iR.test(n)
        }

        function it(n, t) {
            var i = v.cI ? t[0].toLowerCase() : t[0];
            return n.k.hasOwnProperty(i) && n.k[i]
        }

        function rt() {
            var i = n(o),
                r, u, t, f;
            if (!e.k) return i;
            for (r = "", u = 0, e.lR.lastIndex = 0, t = e.lR.exec(i); t;) r += i.substr(u, t.index - u), f = it(e, t), f ? (p += f[1], r += '<span class="' + f[0] + '">' + t[0] + "<\/span>") : r += t[0], u = e.lR.lastIndex, t = e.lR.exec(i);
            return r + i.substr(u)
        }

        function ut() {
            if (e.sL && !t[e.sL]) return n(o);
            var i = e.sL ? r(e.sL, o) : u(o);
            return e.r > 0 && (p += i.keyword_count, y += i.r), '<span class="' + i.language + '">' + i.value + "<\/span>"
        }

        function l() {
            return e.sL !== undefined ? ut() : rt()
        }

        function b(t, i) {
            var r = t.cN ? '<span class="' + t.cN + '">' : "";
            t.rB ? (s += r, o = "") : t.eB ? (s += n(i) + r, o = "") : (s += r, o = i);
            e = Object.create(t, {
                parent: {
                    value: e
                }
            });
            y += t.r
        }

        function k(t, i) {
            var u, r;
            if (o += t, i === undefined) return s += l(), 0;
            if (u = nt(i, e), u) return s += l(), b(u, i), u.rB ? 0 : i.length;
            if (r = w(e, i), r) {
                r.rE || r.eE || (o += i);
                s += l();
                do e.cN && (s += "<\/span>"), e = e.parent; while (e != r.parent);
                return r.eE && (s += n(i)), o = "", r.starts && b(r.starts, ""), r.rE ? 0 : i.length
            }
            if (tt(i, e)) throw "Illegal";
            return o += i, i.length || 1
        }
        var v = t[i],
            c, d, h;
        a(v);
        var e = v,
            o = "",
            y = 0,
            p = 0,
            s = "";
        try {
            for (h = 0;;) {
                if (e.t.lastIndex = h, c = e.t.exec(f), !c) break;
                d = k(f.substr(h, c.index - h), c[0]);
                h = c.index + d
            }
            return k(f.substr(h)), {
                r: y,
                keyword_count: p,
                value: s,
                language: i
            }
        } catch (g) {
            if (g == "Illegal") return {
                r: 0,
                keyword_count: 0,
                value: n(f)
            };
            throw g;
        }
    }

    function u(i) {
        var f = {
                keyword_count: 0,
                r: 0,
                value: n(i)
            },
            e = f,
            o, u;
        for (o in t) t.hasOwnProperty(o) && (u = r(o, i), u.language = o, u.keyword_count + u.r > e.keyword_count + e.r && (e = u), u.keyword_count + u.r > f.keyword_count + f.r && (e = f, f = u));
        return e.language && (f.second_best = e), f
    }

    function o(n, t, i) {
        return t && (n = n.replace(/^((<[^>]+>|\t)+)/gm, function(n, i) {
            return i.replace(/\t/g, t)
        })), i && (n = n.replace(/\n/g, "<br>")), n
    }

    function s(n, t, i) {
        var v = f(n, i),
            h = c(n),
            s, y, p, a;
        h != "no-highlight" && (s = h ? r(h, v) : u(v), h = s.language, y = e(n), y.length && (p = document.createElement("pre"), p.innerHTML = s.value, s.value = l(y, e(p), v)), s.value = o(s.value, t, i), a = n.className, a.match("(\\s|^)(language-)?" + h + "(\\s|$)") || (a = a ? a + " " + h : h), n.innerHTML = s.value, n.className = a, n.result = {
            language: h,
            kw: s.keyword_count,
            re: s.r
        }, s.second_best && (n.second_best = {
            language: s.second_best.language,
            kw: s.second_best.keyword_count,
            re: s.second_best.r
        }))
    }

    function i() {
        i.called || (i.called = !0, Array.prototype.map.call(document.getElementsByTagName("pre"), h).filter(Boolean).forEach(function(n) {
            s(n, hljs.tabReplace)
        }))
    }

    function v() {
        window.addEventListener("DOMContentLoaded", i, !1);
        window.addEventListener("load", i, !1)
    }
    var t = {};
    this.LANGUAGES = t;
    this.highlight = r;
    this.highlightAuto = u;
    this.fixMarkup = o;
    this.highlightBlock = s;
    this.initHighlighting = i;
    this.initHighlightingOnLoad = v;
    this.IR = "[a-zA-Z][a-zA-Z0-9_]*";
    this.UIR = "[a-zA-Z_][a-zA-Z0-9_]*";
    this.NR = "\\b\\d+(\\.\\d+)?";
    this.CNR = "(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";
    this.BNR = "\\b(0b[01]+)";
    this.RSR = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|\\.|-|-=|/|/=|:|;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";
    this.BE = {
        b: "\\\\[\\s\\S]",
        r: 0
    };
    this.ASM = {
        cN: "string",
        b: "'",
        e: "'",
        i: "\\n",
        c: [this.BE],
        r: 0
    };
    this.QSM = {
        cN: "string",
        b: '"',
        e: '"',
        i: "\\n",
        c: [this.BE],
        r: 0
    };
    this.CLCM = {
        cN: "comment",
        b: "//",
        e: "$"
    };
    this.CBLCLM = {
        cN: "comment",
        b: "/\\*",
        e: "\\*/"
    };
    this.HCM = {
        cN: "comment",
        b: "#",
        e: "$"
    };
    this.NM = {
        cN: "number",
        b: this.NR,
        r: 0
    };
    this.CNM = {
        cN: "number",
        b: this.CNR,
        r: 0
    };
    this.BNM = {
        cN: "number",
        b: this.BNR,
        r: 0
    };
    this.inherit = function(n, t) {
        var r = {},
            i;
        for (i in n) r[i] = n[i];
        if (t)
            for (i in t) r[i] = t[i];
        return r
    }
};
hljs.LANGUAGES.javascript = function(n) {
    return {
        k: {
            keyword: "in if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const",
            literal: "true false null undefined NaN Infinity"
        },
        c: [n.ASM, n.QSM, n.CLCM, n.CBLCLM, n.CNM, {
            b: "(" + n.RSR + "|\\b(case|return|throw)\\b)\\s*",
            k: "return throw case",
            c: [n.CLCM, n.CBLCLM, {
                cN: "regexp",
                b: "/",
                e: "/[gim]*",
                i: "\\n",
                c: [{
                    b: "\\\\/"
                }]
            }, {
                b: "<",
                e: ">;",
                sL: "xml"
            }],
            r: 0
        }, {
            cN: "function",
            bWK: !0,
            e: "{",
            k: "function",
            c: [{
                cN: "title",
                b: "[A-Za-z$_][0-9A-Za-z$_]*"
            }, {
                cN: "params",
                b: "\\(",
                e: "\\)",
                c: [n.CLCM, n.CBLCLM],
                i: "[\"'\\(]"
            }],
            i: "\\[|%"
        }]
    }
}(hljs);
hljs.LANGUAGES.json = function(n) {
    var i = {
            literal: "true false null"
        },
        t = [n.QSM, n.CNM],
        r = {
            cN: "value",
            e: ",",
            eW: !0,
            eE: !0,
            c: t,
            k: i
        },
        u = {
            b: "{",
            e: "}",
            c: [{
                cN: "attribute",
                b: '\\s*"',
                e: '"\\s*:\\s*',
                eB: !0,
                eE: !0,
                c: [n.BE],
                i: "\\n",
                starts: r
            }],
            i: "\\S"
        },
        f = {
            b: "\\[",
            e: "\\]",
            c: [n.inherit(r, {
                cN: null
            })],
            i: "\\S"
        };
    return t.splice(t.length, 0, u, f), {
        c: t,
        k: i,
        i: "\\S"
    }
}(hljs);
styles = [];
google.maps.event.addDomListener(window, "load", init);
$(document).on("click", ".download-example", function() {
    ga("send", "event", "Download Example", $("h1").text())
});
$(document).on("click", "#favorite-style", function() {
    var n = $(this);
    $.ajax({
        method: "GET",
        url: $(this).data("fav-url"),
        error: function() {
            notify.error("Sorry, looks like something went wrong when favoriting this style. Please refresh the page and try again.")
        },
        success: function(t) {
            t && t.success || notify.error("Sorry, looks like something went wrong when favoriting this style. Please refresh the page and try again.");
            $("#fav-amount").text(t.newFavs);
            t.favorited ? n.addClass("is-favorite").find("i").removeClass().addClass("icon-star").end().find(".fav-text").text("Favorited") : n.removeClass("is-favorite").find("i").removeClass().addClass("icon-star-empty").end().find(".fav-text").text("Favorite")
        }
    });
    n.blur()
});
$(document).on("click", "#side-controls .toggler", function() {
    $("body").toggleClass("menu-collapsed");
    setTimeout(function() {
        google.maps.event.trigger(map, "resize")
    }, 300)
});
$(document).on("click", ".side-menu-toggle", function() {
    $("body").toggleClass("details-expanded")
});
window.onload = function() {
    for (var i = document.getElementsByTagName("pre"), n, t = 0; t < i.length; t++) n = i[t], hljs.highlightBlock(n), $(n).closest(".code-body").addClass("highlighted-block"), $(n).height() > $(n).closest(".code-body").height() && $(n).closest(".code-body").addClass("toggle");
    $(document).on("click", ".code-toggle", function() {
        $(this).closest(".code-body").toggleClass("expanded")
    })
}
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
var Type;
(function (Type) {
    Type[Type["PAGEEVENT"] = 1] = "PAGEEVENT";
    Type[Type["CLICKEVENT"] = 2] = "CLICKEVENT";
    Type[Type["CUSTOMEVENT"] = 3] = "CUSTOMEVENT";
})(Type || (Type = {}));
var Tracker = /** @class */ (function () {
    function Tracker(config) {
        this.currentPath = null;
        this.token = config.token;
        this.referrer = document.referrer;
        if (config.pageView !== false) {
            this.EnablePageView();
        }
    }
    Tracker.prototype.sendTrackingData = function (endpoint, data, type) {
        try {
            var payload = __assign(__assign({ token: this.token }, data), { type: type });
            console.log(payload);
            fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
                keepalive: true,
            });
        }
        catch (error) {
            console.error("Error sending tracking data:", error);
        }
    };
    Tracker.prototype.trackEvent = function (event, type) {
        this.sendTrackingData("http://localhost:8000/v0/t", event, type);
    };
    Tracker.prototype.trackPageView = function () {
        if (this.currentPath === window.location.pathname)
            return;
        this.currentPath = window.location.pathname;
        if (this.currentPath) {
            if (!this.referrer || this.referrer.includes(location.hostname)) {
                this.referrer = null;
            }
            this.trackEvent({ name: "page_view", data: { pathname: this.currentPath, search: window.location.search, referrer: this.referrer, date: Date.now() } }, Type.PAGEEVENT);
            if (this.referrer) {
                this.referrer = null;
                sessionStorage.setItem("privvy.referrer", "set");
            }
        }
    };
    Tracker.prototype.handleHistoryChanges = function () {
        var _this = this;
        var originalPushState = history.pushState;
        history.pushState = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            originalPushState.apply(history, args);
            _this.trackPageView();
        };
        window.addEventListener("popstate", function () { return _this.trackPageView(); });
        var handleVisibilityChange = function () {
            if (!_this.currentPath && document.visibilityState === "visible") {
                _this.trackPageView();
            }
        };
        if (document.visibilityState !== "visible") {
            document.addEventListener("visibilitychange", handleVisibilityChange);
        }
        else {
            this.trackPageView();
        }
    };
    Tracker.prototype.EnablePageView = function () {
        if (!this.currentPath) {
            this.handleHistoryChanges();
        }
    };
    Tracker.prototype.track = function (name, data, type) {
        this.trackEvent({ name: name, data: data }, type);
    };
    return Tracker;
}());
var scriptElement = document.currentScript;
var token = (_a = scriptElement === null || scriptElement === void 0 ? void 0 : scriptElement.getAttribute("data-token")) !== null && _a !== void 0 ? _a : "";
var pageView = (scriptElement === null || scriptElement === void 0 ? void 0 : scriptElement.getAttribute("data-page-view")) !== "false";
var tracker = new Tracker({ token: token, pageView: pageView });
window.privvy = tracker;
if (pageView) {
    tracker.EnablePageView();
}

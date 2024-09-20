enum Type {
    PAGEEVENT = 1,
    CLICKEVENT,
    CUSTOMEVENT,
}

interface TrackingConfig {
    token: string;
    pageView?: boolean;
}

interface TrackingEvent {
    name: string;
    data: any;
}


class Tracker {
    private token: string;
    private currentPath: string | null = null;
    private referrer: string | null;

    constructor (config: TrackingConfig) {
        this.token = config.token;
        this.referrer = document.referrer;

        if (config.pageView !== false) {
            this.EnablePageView();
        }
    }

    private sendTrackingData(endpoint: string, data: any, type: Type) {
        try {
            const payload = { token: this.token, ...data, type };
            console.log(payload);
            fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
                keepalive: true,
            });
        } catch (error) {
            console.error("Error sending tracking data:", error);
        }
    }

    private trackEvent(event: TrackingEvent, type: Type) {
        this.sendTrackingData(`http://localhost:8000/v0/t`, event, type);
    }

    private trackPageView() {
        if (this.currentPath === window.location.pathname) return;
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
    }

    private handleHistoryChanges() {
        const originalPushState = history.pushState;
        history.pushState = (...args) => {
            originalPushState.apply(history, args);
            this.trackPageView();
        };

        window.addEventListener("popstate", () => this.trackPageView());

        const handleVisibilityChange = () => {
            if (!this.currentPath && document.visibilityState === "visible") {
                this.trackPageView();
            }
        };

        if (document.visibilityState !== "visible") {
            document.addEventListener("visibilitychange", handleVisibilityChange);
        } else {
            this.trackPageView();
        }
    }

    public EnablePageView() {
        if (!this.currentPath) {
            this.handleHistoryChanges();
        }
    }

    public track(name: string, data: any, type: Type) {
        this.trackEvent({ name, data }, type);
    }
}

const scriptElement = document.currentScript as HTMLScriptElement;
const token = scriptElement?.getAttribute("data-token") ?? "";
const pageView = scriptElement?.getAttribute("data-page-view") !== "false";

const tracker = new Tracker({ token, pageView });
(window as any).privvy = tracker;

if (pageView) {
    tracker.EnablePageView();
}
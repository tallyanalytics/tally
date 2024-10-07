enum Type {
    PAGEEVENT = 1,
    CLICKEVENT,
    CUSTOMEVENT,
}

interface TrackingConfig {
    token: string;
    pageView?: boolean;
    skipURL?: string[] | undefined;
    maskURL?: string[] | undefined;
}

interface TrackingEvent {
    name: string;
    data: any;
}


class Tracker {
    private token: string;
    private currentPath: string | undefined = undefined;
    private referrer: string | undefined;
    private skipURL: string[];
    private maskURL: string[];

    constructor (config: TrackingConfig) {
        this.token = config.token;
        this.referrer = document.referrer;
        this.skipURL = config.skipURL ?? [];
        this.maskURL = config.maskURL ?? [];

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
            console.error("Error sending tracking data:\n\n", error);
        }
    }

    private trackEvent(event: TrackingEvent, type: Type) {
        this.sendTrackingData(`http://localhost:8000/v0/t`, event, type);
    }

    private trackPageView() {
        if (this.currentPath === window.location.pathname || window.location.pathname.includes("localhost")) return;
        this.currentPath = window.location.pathname;

        const pathname = this.urlRegex(this.currentPath);

        if (!pathname) return;


        if (!this.referrer || this.referrer.includes(location.hostname)) {
            this.referrer = undefined;
        }

        this.trackEvent({ name: "page_view", data: { pathname: pathname, search: window.location.search, referrer: this.referrer, date: Date.now() } }, Type.PAGEEVENT);

        if (this.referrer) {
            this.referrer = undefined;
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

    private urlRegex(pathname: string): string | null {
        const regexSkip = this.skipURL.map(
            (pattern) => new RegExp(`^${pattern.replace(/\*/g, "[^/]+")}$`),
        );

        const regexMask = this.maskURL.map(
            (pattern) => new RegExp(`^${pattern.replace(/\*/g, "[^/]+")}$`),
        );

        if (regexSkip?.some(regex => regex.test(pathname))) {
            return null;
        }

        for (let i = 0; i < this.maskURL.length; i++) {
            if (regexMask[i].test(pathname)) {
                return this.maskURL[i];
            }
        }
        return pathname;
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
const skipURL = scriptElement?.getAttribute("data-skip-url")?.split(",") ?? [];
const maskURL = scriptElement?.getAttribute("data-mask-url")?.split(",") ?? [];

const tracker = new Tracker({ token, pageView, skipURL, maskURL });

if (pageView) {
    tracker.EnablePageView();
}
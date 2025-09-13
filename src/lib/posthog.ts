import posthog from 'posthog-js';

export const initPostHog = () => {
  if (typeof window !== 'undefined' && !posthog.__loaded) {
    posthog.init('phc_rLlto3DNeIBlh5QE67I4ylxVYLX0fUHWjY4orvNpkwl', {
      api_host: 'https://app.posthog.com',
      autocapture: true,
      capture_pageview: true,
    });
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, string | number | boolean>) => {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties);
  }
};

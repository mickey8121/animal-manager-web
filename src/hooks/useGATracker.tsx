import { useCallback, useEffect, useState } from 'react';

import { useGA4React } from 'ga-4-react';

import app from 'helpers/app';

import { GA4ReactResolveInterface } from 'ga-4-react/dist/models/gtagModels';
import { useLocation } from 'react-router-dom';

type pageView = () => GA4ReactResolveInterface | void;
type event = (event_label: string | Record<string, unknown>) => GA4ReactResolveInterface | void;
type timings = () => GA4ReactResolveInterface | void;

interface useGATracker {
  pageView: pageView;
  customEvent: event;
  getTimings: timings;
}

const useGATracker = (): useGATracker => {
  const { pathname, search } = useLocation();
  const [initialized, setUninitialized] = useState(true);
  const ga4React = useGA4React(app.gaId, { send_page_view: false, app_name: app.appName });

  useEffect(() => {
    if (app.nodeEnv === 'development') setUninitialized(false);
  }, []);

  const pageView = useCallback(() => {
    if (initialized) {
      ga4React?.gtag('event', 'page_view', {
        page_location: search,
        page_path: pathname,
        send_to: app.gaId,
      });
    }
  }, [initialized, ga4React, search, pathname]);

  const customEvent = useCallback(
    event_label => {
      if (initialized) {
        ga4React?.event('event', event_label, pathname);
      }
    },
    [initialized, ga4React, pathname],
  );

  const getTimings = useCallback(() => {
    if (window.performance) {
      const timeSincePageLoad = Math.round(performance.now());

      ga4React?.gtag('event', 'timing_complete', {
        name: `load ${pathname}`,
        value: timeSincePageLoad,
        event_category: 'JS Dependencies',
      });
    }
  }, [ga4React, pathname]);

  return { pageView, customEvent, getTimings };
};

export default useGATracker;

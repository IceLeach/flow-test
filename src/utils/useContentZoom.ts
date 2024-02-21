import { useMemo } from 'react';
import { useSize } from 'ahooks';

const useContentZoom = <T extends HTMLElement>(watcherRef: React.MutableRefObject<T | null>, designSize: { width: number; height: number }) => {
  const watcherSize = useSize(watcherRef);
  const zoom = useMemo(() => {
    if (watcherSize) {
      const watcherRatio = watcherSize.width / watcherSize.height;
      const designRatio = designSize.width / designSize.height;
      const newZoom =
        watcherRatio < designRatio
          ? watcherSize.width / designSize.width
          : watcherSize.height / designSize.height;
      return newZoom;
    } else {
      return 1;
    }
  }, [watcherSize])

  return zoom;
}

export default useContentZoom;

import type { Graph } from '@antv/x6';

export const coverToFit = (graph: Graph, containerSize: { width: number; height: number }) => {
  const contentSize = graph.getContentArea();
  const contentRatio = contentSize.width / contentSize.height;
  const containerRatio = containerSize.width / containerSize.height;
  const zoom =
    contentRatio < containerRatio
      ? containerSize.width / contentSize.width
      : containerSize.height / contentSize.height;
  graph.zoomToFit();
  graph.zoomTo(zoom);
};

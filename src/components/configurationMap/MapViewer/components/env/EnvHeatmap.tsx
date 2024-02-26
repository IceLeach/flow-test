import { useEffect, useRef, useState } from 'react';
import Heatmap from 'heatmap.js';
import { useThrottleFn } from 'ahooks';
import { CustomComponent } from '../types';
import { HeatMapModePoint } from '../../types';

type EnvHeatmapConfig = {
  points: HeatMapModePoint[];
  onMouseMove: (point: { x: number; y: number; value: number } | undefined, e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
};

const EnvHeatmap: CustomComponent<EnvHeatmapConfig> = (props) => {
  const { node } = props;
  const { config } = node.getData();
  const { points, onMouseMove, onMouseLeave } = config;
  const [activePoint, setActivePoint] = useState<{ x: number; y: number }>();
  const mapRef = useRef<Heatmap.Heatmap<'value', 'x', 'y'>>();

  useEffect(() => {
    const heatmapContainer = document.getElementById('THHeatmap');
    if (heatmapContainer) {
      const map =
        mapRef.current ??
        Heatmap.create({
          container: heatmapContainer,
          // backgroundColor: 'rgba(61, 174, 41,0.5)',
          // backgroundColor: 'rgba(3,203,254,0.2)',
          gradient: {
            1.0: '#FF4800',
            0.75: '#C9FE00',
            0.5: '#00FF35',
            0.25: '#03CBFE',
            0.0: '#1E78E0',
          },
          radius: 120,
          maxOpacity: 0.5,
          minOpacity: 0.2,
          blur: 0.8,
        });
      map.setData({
        max: 33,
        min: 18,
        data: points,
      });
      mapRef.current = map;
    }

    return () => {
      mapRef.current = undefined;
    };
  }, []);

  const { run } = useThrottleFn((point: { x: number; y: number }, e: React.MouseEvent) => {
    const { x, y } = point;
    let minPoint: { point: { x: number; y: number; value: number }; dis: number } | undefined;
    points.forEach((p: any) => {
      const current = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2));
      // console.log('c', current, p)
      if (!minPoint) {
        minPoint = { point: p, dis: current };
      } else {
        if (current < minPoint.dis) {
          minPoint = { point: p, dis: current };
        }
      }
    });
    // console.log('minPoint', minPoint)
    if (minPoint?.point) {
      setActivePoint({ x: minPoint?.point.x, y: minPoint?.point.y });
    }
    onMouseMove(minPoint?.point, e);
  }, { wait: 100 });

  const heatmapOnMouseMove = (point: { x: number; y: number }, e: React.MouseEvent) => {
    run(point, e);
  };

  const heatmapOnMouseLeave = (e: React.MouseEvent) => {
    setTimeout(() => {
      setActivePoint(undefined);
      onMouseLeave(e);
    }, 100);
  };

  return (
    <div
      id='THHeatmap'
      onMouseMove={(e) => {
        heatmapOnMouseMove({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }, e);
      }}
      onMouseLeave={heatmapOnMouseLeave}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {activePoint && (
        <div
          style={{
            position: 'absolute',
            left: activePoint.x,
            top: activePoint.y,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'red',
          }}
        />
      )}
    </div>
  );
}

export default EnvHeatmap;

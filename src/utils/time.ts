import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const formatToDuration = (time: string | dayjs.Dayjs) => {
  const customTime = dayjs(time);
  const currentTime = dayjs();
  const duration = dayjs.duration(currentTime.diff(customTime));
  const durationMs = duration.as('millisecond');
  const suffix = durationMs > 0 ? '前' : '后';
  if (duration.get('year')) {
    return `${Math.abs(duration.get('year'))}年${suffix}`;
  } else if (duration.get('month')) {
    return `${Math.abs(duration.get('month'))}月${suffix}`;
  } else if (duration.get('day')) {
    return `${Math.abs(duration.get('day'))}天${suffix}`;
  } else if (duration.get('hour')) {
    return `${Math.abs(duration.get('hour'))}小时${suffix}`;
  } else if (duration.get('minute')) {
    return `${Math.abs(duration.get('minute'))}分钟${suffix}`;
  } else {
    return `几秒${suffix}`;
  }
};

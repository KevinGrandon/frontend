// @flow

import JobStates from '../constants/JobStates';

export function jobTime(job: Object) {
  const { state, startedAt, finishedAt, canceledAt, timedOutAt } = job;
  const time = {};

  // job never stared, so no duration to show
  if (!startedAt) {
    return time;
  }

  time.from = startedAt;

  switch (state) {
    case JobStates.FINISHED:
      time.to = finishedAt;
      break;

    case JobStates.CANCELED:
    case JobStates.CANCELING:
      time.to = canceledAt;
      break;

    case JobStates.TIMED_OUT:
    case JobStates.TIMING_OUT:
      time.to = timedOutAt;
      break;
  }

  return time;
}

export function jobWaitTime(job: Object) {
  const { state, scheduledAt, startedAt } = job;
  const time = {};
  
  // job is blocked, don't bother to calculate
  if (state === JobStates.BLOCKED) {
    return time;
  }

  time.from = scheduledAt;

  if (startedAt) {
    time.to = startedAt;
  }
  
  return time;
}

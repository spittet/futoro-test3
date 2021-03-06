// @flow

import RNFS                       from 'react-native-fs';
import utils                      from '../utils';

import PushNotification           from 'react-native-push-notification';

PushNotification.configure({
  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert:                        true,
    badge:                        true,
    sound:                        true
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification:         true,

  requestPermissions:             true,
});


// TODO: AFAIK the capsule status should be removable - at least for published.
export const config = {
  CAPSULES_DIR:                   RNFS.DocumentDirectoryPath + '/capsules',
  MAX_RECORDING_DURATION:         10 * 60,    // Recording timeout in seconds
  CAPSULE_STATUS_NEW:             0,          // Initial state of a new capsule
  CAPSULE_STATUS_RECORDED:        1,          // Recorded state for previews
  CAPSULE_STATUS_SAVED:           2,          // Capsule is persisted
  CAPSULE_STATUS_PUBLISHED:       3,          // Capsule is available to user
  CAPSULE_PERIOD_1MIN:            'CAPSULE_PERIOD_1MIN',
  CAPSULE_PERIOD_2W:              'CAPSULE_PERIOD_2W',
  CAPSULE_PERIOD_1M:              'CAPSULE_PERIOD_1M',
  CAPSULE_PERIOD_3M:              'CAPSULE_PERIOD_3M',
  CAPSULE_PERIOD_6M:              'CAPSULE_PERIOD_6M',
  CAPSULE_PERIOD_12M:             'CAPSULE_PERIOD_12M',
  GA_TRACKING_ID:                 'UA-104685259-1',
}

export function locapsInit() {
  createCapsulesDirectory();
  utils.clearVideos();
  //utils.resetCapsules();
  //utils.generateFakeCapsules();
}

function createCapsulesDirectory() {
  RNFS.exists(config.CAPSULES_DIR).then((result) => {
    if (!result) {
      RNFS.mkdir(config.CAPSULES_DIR);
    } else {
      // ADD ANALYTICS
    }
  });
}
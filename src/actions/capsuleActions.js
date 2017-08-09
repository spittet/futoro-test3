//@flow

import type {Capsule} from '../reducers/currentCapsule';

import { config } from '../config';

import db from '../db';
import utils from '../utils';

import RNFS from 'react-native-fs';
import moment from 'moment';

/**
 * Sets the publishing date of the capsule.
 * Recorded as a timestamp.
 */
export function setNewCapsulePublishDate(publishedAt: string){
  return {
    type: 'SET_NEW_CAPSULE_PUBLISH_DATE',
    publishedAt: publishedAt
  }
}


export function recordNewCapsule(capsule: Capsule) {
  utils.listFilesInDirsForDebugging();
  return {
    type: 'RECORD_NEW_CAPSULE',
    uri: capsule.uri
  };
}

/**
 * Saves the new capsule
 * Before saving the capsule data to the global state we need to move it to the
 * directory where capsules are persisted.
 */
export function saveNewCapsule(capsule: Capsule) {
  // Avoid publishing twice
  if (capsule && capsule.status === config.CAPSULE_STATUS_RECORDED) {
    capsule.uri = utils.persistVideoFile(capsule.uri);
    capsule.status = config.CAPSULE_STATUS_SAVED;
    capsule.savedAt = moment().toISOString();

    db.createCapsule(capsule);

    utils.scheduleNotification(capsule.publishedAt);

    // Run the cleanup to make sure we keep disk space to min
    utils.clearVideos();

    return {
      type: 'SAVE_NEW_CAPSULE',
      uri: capsule.uri,
      status: capsule.status,
      savedAt: capsule.savedAt
    }
  } else {
    return {
      type: ''
    }
  }
}

/**
 * Publishes the new capsule
 */
export function publishNewCapsule(capsule: Capsule) {
  utils.listFilesInDirsForDebugging();
  // Avoid publishing twice
  if (capsule && capsule.status === config.CAPSULE_STATUS_SAVED) {
    return {
      type: 'PUBLISH_NEW_CAPSULE',
      publishedAt: moment().toISOString()
    }
  } else {
    return {
      type: ''
    }
  }
}

/**
 * Cancels a capsule and deletes the file from disk
 */
export function cancelNewCapsule(capsule: Capsule) {
  if (capsule && capsule.uri) {
    RNFS.unlink(capsule.uri)
      .then(() => {
        // ADD ANALYTICS
      })
      .catch(() => {
        // ADD ANALYTICS
      });
  }
  utils.listFilesInDirsForDebugging();
  return {
    type: 'CANCEL_NEW_CAPSULE'
  }
}

/**
 * Get the list of capsules
 */
export function getCapsules() {
  const capsules = db.getAllCapsules();
  return {
    type: 'GET_CAPSULES',
    items: capsules
  }

}

/**
 * View a capsule
 */
export function getCapsule(id: string){
  const result = db.getOneCapsule(id);
  const capsule: Capsule = {
    id: result.id,
    uri: result.uri,
    status: result.status,
    publishedAt: result.publishedAt,
    savedAt: result.savedAt,
    read: true
  } 

  db.updateCapsule(capsule);

  return {
    type: 'GET_CAPSULE',
    capsule: capsule
  }
}

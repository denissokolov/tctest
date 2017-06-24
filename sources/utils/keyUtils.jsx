/* eslint-disable import/prefer-default-export */

const KEY_LEVEL_LENGTH = 6;

function numberToKeyLevel(num) {
  return String(`00000${num}`).slice(-KEY_LEVEL_LENGTH);
}

function getParentKeyAndCurrentLevelPosition(key) {
  const lastDelimiterIndex = key.lastIndexOf('/');
  if (lastDelimiterIndex === -1) {
    return {
      parentKey: '',
      currentLevelPosition: parseInt(key, 10),
    };
  }

  return {
    parentKey: key.substring(0, lastDelimiterIndex + 1),
    currentLevelPosition: parseInt(key.substring(lastDelimiterIndex + 1), 10),
  };
}

export function generateKey(currentNumber, parentKey) {
  const currentPart = numberToKeyLevel(currentNumber);

  if (parentKey) {
    return `${parentKey}/${currentPart}`;
  }

  return currentPart;
}

export function getNextKeyOnSameLevel(key) {
  const { parentKey, currentLevelPosition } = getParentKeyAndCurrentLevelPosition(key);

  const newPosition = currentLevelPosition + 1;
  return `${parentKey}${numberToKeyLevel(newPosition)}`;
}


export function getPrevKeyOnSameLevel(key) {
  const { parentKey, currentLevelPosition } = getParentKeyAndCurrentLevelPosition(key);

  const newPosition = currentLevelPosition - 1;
  return newPosition >= 0 ? `${parentKey}${numberToKeyLevel(newPosition)}` : null;
}

export function getParentKeyFromKey(key) {
  const lastDelimiterIndex = key.lastIndexOf('/');
  if (lastDelimiterIndex === -1) {
    return null;
  }

  return key.substring(0, lastDelimiterIndex);
}

export function getAllParentsKeysFromKey(key) {
  const parts = key.split('/');
  const parentKeys = [];
  let tempKey;

  for (let i = 0; i < parts.length - 1; i += 1) {
    tempKey = tempKey ? `${tempKey}/${parts[i]}` : parts[i];
    parentKeys.push(tempKey);
  }

  return parentKeys;
}

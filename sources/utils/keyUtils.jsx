const KEY_LEVEL_LENGTH = 6;

function numberToKeyLevel(num) {
  return String(`00000${num}`).slice(-KEY_LEVEL_LENGTH);
}

export function generateKey(currentNumber, parentKey) {
  const currentPart = numberToKeyLevel(currentNumber);

  if (parentKey) {
    return `${parentKey}/${currentPart}`;
  }

  return currentPart;
}

export function regenerateKeyFromParent(childKey, parentKey) {
  return parentKey + childKey.substring(parentKey.length);
}

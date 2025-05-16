export function parseFeatures(features: any): string[] {
  if (!features) return [];

  if (Array.isArray(features)) {
    if (typeof features[0] === 'string' && features[0].startsWith('[')) {
      try {
        return JSON.parse(features[0]);
      } catch {
        return [];
      }
    }
    return features;
  }

  if (typeof features === 'string') {
    try {
      if (features.startsWith('[') && features.endsWith(']')) {
        return JSON.parse(features);
      }
      return [features];
    } catch {
      return features.split(',').map(item => item.trim());
    }
  }

  return [];
}
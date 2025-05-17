import * as Icons from 'lucide-react';

export const getIcon = (iconName) => {
  return (Icons[iconName] && typeof Icons[iconName] === 'function')
    ? Icons[iconName]
    : Icons.Smile; // Fallback icon if the requested one is not found or not a component
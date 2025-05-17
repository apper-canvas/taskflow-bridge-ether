import * as Icons from 'lucide-react';

export const getIcon = (iconName) => {
  const IconComponent = Icons[iconName];
  // Check if the icon exists and return it, otherwise return a default icon (e.g., 'AlertCircle')
  return IconComponent ? <IconComponent /> : <Icons.AlertCircle />;
};
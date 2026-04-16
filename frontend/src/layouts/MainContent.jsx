// MainContent.js

import React from 'react';

export default function MainContent({ children }) {
  return <div className="flex-1 overflow-y-auto outline-none scroll-smooth">{children}</div>;
}
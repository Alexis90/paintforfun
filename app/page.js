'use client';

import { useState, useEffect } from 'react';
import PixelArtEditor from './components/PixelArtEditor';
import HomePage from './components/HomePage';
import Council from './components/Council';

export default function Page() {
  const [currentHash, setCurrentHash] = useState('');
  const [jsonData, setJsonData] = useState(null);

  const parseHash = (hash) => {
    const [page, queryString] = hash.replace('#', '').split('?');
    const params = new URLSearchParams(queryString);
    const data = params.get('data');
    return { page, data };
  };

  const renderContent = () => {
    switch (currentHash) {
      case 'paint':
        return <PixelArtEditor dataJsonString={jsonData} />;
      case 'council':
        return <Council />;
      case 'home':
        return <HomePage />;
      default:
        return <HomePage />;
    }
  };

  useEffect(() => {
    const onHashChanged = () => {
      const hash = window.location.hash || '';
      const { page, data } = parseHash(hash);

      if (data) setJsonData(data);

      setCurrentHash(page || 'home');
    };

    onHashChanged();

    window.addEventListener('hashchange', onHashChanged);

    return () => {
      window.removeEventListener('hashchange', onHashChanged);
    };
  }, []);

  return <main className="w-full h-full overflow-auto">{renderContent()}</main>;
}

import React from 'react';
import './Loader.css';

const loaderAssets = {
  xs: {
    base: 'http://localhost:3845/assets/6ad9880dcb83282d09c13956958b9cacbcea7b55.svg',
    arc: 'http://localhost:3845/assets/ea98be29a4b1a21ea30630628587bf32f9ff5035.svg',
    size: 12
  },
  sm: {
    base: 'http://localhost:3845/assets/06db2cb74b4fe47ea2bd566e2fbd308c5557e19b.svg',
    arc: 'http://localhost:3845/assets/563968524e10b4dd0e82ad4eb8607cea618bffbf.svg',
    size: 16
  },
  md: {
    base: 'http://localhost:3845/assets/887bada5f6554bb82ec26e53888a5481f150ab92.svg',
    arc: 'http://localhost:3845/assets/3ab6d459feb022ded58c2d81b2e180bd48e59360.svg',
    size: 20
  },
  lg: {
    base: 'http://localhost:3845/assets/7db57873e54459b15efd81514f38086a47131786.svg',
    arc: 'http://localhost:3845/assets/d6e6413de8b7f7af3951ea07be1e8b20e7c8cb7a.svg',
    size: 24
  },
  xl: {
    base: 'http://localhost:3845/assets/b64dff457c609ff5a34ed6ffd02e88308cc4cd3d.svg',
    arc: 'http://localhost:3845/assets/9bec418cdd4b6bd62e10de4ceb221f24d1e43b9f.svg',
    size: 28
  },
  '2xl': {
    base: 'http://localhost:3845/assets/bf9cd8884914323567a3cff99135dcdccbe2ddf6.svg',
    arc: 'http://localhost:3845/assets/32ba06283175d897cc637139a462be42a2357d95.svg',
    size: 32
  }
} as const;

export type LoaderSize = keyof typeof loaderAssets;

export interface LoaderProps {
  size?: LoaderSize;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'xs', className = '' }) => {
  const asset = loaderAssets[size];

  return (
    <div
      className={`loader loader--${size} ${className}`.trim()}
      style={{ width: asset.size, height: asset.size }}
      role="status"
      aria-label="Loading"
    >
      <img className="loader__base" src={asset.base} alt="" aria-hidden="true" />
      <img className="loader__arc" src={asset.arc} alt="" aria-hidden="true" />
    </div>
  );
};

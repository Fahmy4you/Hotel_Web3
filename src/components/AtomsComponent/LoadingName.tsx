import React from 'react';

const LoadingName = () => {
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .exact-loader {
        width: 40px;
        aspect-ratio: 4;
        --_g: no-repeat radial-gradient(circle closest-side, #7828C8 90%, transparent);
        background: 
          var(--_g) 0%   50%,
          var(--_g) 50%  50%,
          var(--_g) 100% 50%;
        background-size: calc(100%/3) 100%;
        animation: l7 1s infinite linear;
      }
      @keyframes l7 {
        33% { background-size: calc(100%/3) 0%, calc(100%/3) 100%, calc(100%/3) 100% }
        50% { background-size: calc(100%/3) 100%, calc(100%/3) 0%, calc(100%/3) 100% }
        66% { background-size: calc(100%/3) 100%, calc(100%/3) 100%, calc(100%/3) 0% }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return <div className="exact-loader"></div>;
};

export default LoadingName;
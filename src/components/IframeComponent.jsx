import React from 'react';

const IframeComponent = () => {
  return (
    <div style={{ width: '100%', height: '100vh', border: 'none' }}>
      <iframe
        title="TOPFRAME"
        src="https://bento.me/aburakt"
        style={{ width: '100%', height: '100vh', border: 'none' }}
        frameBorder="0"
        marginWidth="0"
        marginHeight="0"
        noresize="noresize"
      ></iframe>
    </div>
  );
};

export default IframeComponent;

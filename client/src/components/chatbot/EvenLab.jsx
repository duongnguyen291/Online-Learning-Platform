import React, { useEffect, useState } from 'react';
import './EvenLab.css';

const SCRIPT_URL = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
const CUSTOM_ELEMENT_NAME = 'elevenlabs-convai';

const EvenLab = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(null);

  useEffect(() => {
    // Check if custom element is already defined
    if (customElements.get(CUSTOM_ELEMENT_NAME)) {
      setScriptLoaded(true);
      return;
    }

    // Check if script is already loading
    const existingScript = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (existingScript) {
      // If script exists but custom element isn't defined, wait for it
      const checkElement = setInterval(() => {
        if (customElements.get(CUSTOM_ELEMENT_NAME)) {
          setScriptLoaded(true);
          clearInterval(checkElement);
        }
      }, 100);

      // Clear interval after 10 seconds to prevent infinite checking
      setTimeout(() => clearInterval(checkElement), 10000);
      return;
    }

    // Create and load script if not already loading
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.type = 'text/javascript';
    
    script.onload = () => {
      const checkCustomElement = setInterval(() => {
        if (customElements.get(CUSTOM_ELEMENT_NAME)) {
          console.log('ElevenLabs script and custom element loaded successfully');
          setScriptLoaded(true);
          clearInterval(checkCustomElement);
        }
      }, 100);

      // Clear interval after 10 seconds
      setTimeout(() => clearInterval(checkCustomElement), 10000);
    };

    script.onerror = (error) => {
      console.error('Error loading ElevenLabs script:', error);
      setScriptError('Failed to load ElevenLabs script');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup intervals if component unmounts
      const intervals = setInterval(() => {}, 0);
      for (let i = 0; i < intervals; i++) {
        clearInterval(i);
      }
    };
  }, []);

  if (scriptError) {
    return <div className="evenlab-error">{scriptError}</div>;
  }

  return (
    <div className="evenlab-container">
      {scriptLoaded ? (
        <elevenlabs-convai 
          agent-id="agent_01jxh2m2ejfvpt5vtv9hsg5sjf"
          className="evenlab-widget"
        />
      ) : (
        <div className="evenlab-loading">Loading ElevenLabs widget...</div>
      )}
    </div>
  );
};

export default EvenLab;

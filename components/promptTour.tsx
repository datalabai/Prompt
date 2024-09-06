'use client';

import React, { useState, useEffect } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';

const steps = [
  {
    target: '#lightbulb-toggle',
    content: 'Click here to switch between intent mode and prompt mode.',
    disableBeacon: true,
  },
  {
    target: '[data-tour="mail-input"]',
    content: 'Insert your intent / prompt here and press enter.',
    disableBeacon: true,
  },
  {
    target: '[data-tour="toggle-reply-input"]',
    content: 'Click here to Chat with prompt expert.',
    disableBeacon: true,
  },
  {
    target: '[data-tour="prompt-execute"]',
    content: 'Click here to execute this prompt',
    disableBeacon: true,
  },
  
];

const PromptTour: React.FC = () => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    console.log('PromptTour component mounted');
    const timer = setTimeout(() => {
      console.log('Setting run to true');
      setRun(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleJoyrideCallback = (data: any) => {
    const { action, index, status, type } = data;
    console.log('Joyride callback:', data);

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      setRun(true);
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setRun(false);
    }
  };

  console.log('Rendering PromptTour component, run:', run);

  return (
    <div style={{ position: 'relative', zIndex: 9999 }}>
      <Joyride
        steps={steps}
        run={run}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            arrowColor: '#fff',
            backgroundColor: '#fff',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            primaryColor: '#007bff',
            textColor: '#333',
            zIndex: 10000,
          },
          tooltip: {
            fontSize: 15,
            padding: 15,
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          buttonNext: {
            backgroundColor: '#007bff',
            fontSize: 14,
            padding: '8px 15px',
          },
          buttonBack: {
            color: '#666',
            marginRight: 10,
          },
        }}
      />
    </div>
  );
};

export default PromptTour;
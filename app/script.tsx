import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { remote } from 'electron';

const container = document.getElementById('app')!;

const root = createRoot(container);

const App = () => {
  const START_TIME_IN_MS = 1200000;
  const BREAK_TIME_IN_MS = 120000;
  const WORK_IMG_PATH = './images/work.png';
  const REST_IMG_PATH = './images/rest.png';
  const AUDIO_URL = './sounds/bell.wav';
  const MINUTE_TO_MS = 60000;
  const SECOND_TO_MS = 1000;
  const MINUTE_TO_SECONDS = 60;

  const convertTime = (ms: number) => {
    const minutesToDisplay = Math.floor(ms / MINUTE_TO_MS);
    const secondsToDisplay = Math.floor(ms / SECOND_TO_MS - minutesToDisplay * MINUTE_TO_SECONDS);
    return (
      ('00' + minutesToDisplay).slice(-2) +
      ':' +
      (secondsToDisplay % MINUTE_TO_SECONDS === 0 ? '00' : secondsToDisplay)
    );
  };

  const [audio] = useState(new Audio(AUDIO_URL));
  const [intervalState, setIntervalState] = useState<null | NodeJS.Timer>(null);
  const [timeInMs, setTimeInMs] = useState(START_TIME_IN_MS);
  const [convertedTime, setConvertedTime] = useState(convertTime(timeInMs));
  const [displayedImage, setDisplayedImage] = useState(WORK_IMG_PATH);

  const playAudio = () => {
    audio.play();
    audio.addEventListener('ended', () => audio.pause());
  };

  const startTimer = () => {
    if (!intervalState) {
      let didUserRest = false;
      setIntervalState(
        setInterval(() => {
          setTimeInMs((timeInMs) => {
            if (timeInMs === 0 && !didUserRest) {
              playAudio();
              setConvertedTime(convertTime(BREAK_TIME_IN_MS));
              setDisplayedImage(REST_IMG_PATH);
              didUserRest = true;
              return SECOND_TO_MS;
            }
            if (timeInMs === 0 && didUserRest) {
              didUserRest = false;
              playAudio();
              setConvertedTime(convertTime(START_TIME_IN_MS));
              setDisplayedImage(WORK_IMG_PATH);
              return START_TIME_IN_MS;
            }
            setConvertedTime(convertTime(timeInMs - SECOND_TO_MS));
            return timeInMs - SECOND_TO_MS;
          });
        }, SECOND_TO_MS)
      );
    }
  };

  const stopTimer = () => {
    if (intervalState) clearInterval(intervalState);
    setIntervalState(null);
    setTimeInMs(START_TIME_IN_MS);
    setConvertedTime(convertTime(START_TIME_IN_MS));
  };

  const closeApp = () => {
    const window = remote.getCurrentWindow();
    window.close();
  };

  const minimizeApp = () => {
    const window = remote.getCurrentWindow();
    window.minimize();
  };

  return (
    <div>
      <h1>Protect your eyes</h1>
      {intervalState && (
        <div>
          <img src={displayedImage} alt="" />
          <div className="timer">{convertedTime}</div>
          <button onClick={() => stopTimer()} className="btn">
            Stop
          </button>
        </div>
      )}
      {!intervalState && (
        <div>
          <p>
            According to optometrists in order to save your eyes, you should follow the 20/20/20. It
            means you should let your eyes rest every 20 minutes for 20 seconds by looking more than
            20 feet away.
          </p>
          <p>This app will help you track your time and inform you when it's time to rest.</p>
          <button onClick={() => startTimer()} className="btn">
            Start
          </button>
        </div>
      )}
      <button onClick={() => closeApp()} className="btn btn-close">
        X
      </button>
      <button onClick={() => minimizeApp()} className="btn btn-minimize">
        -
      </button>
    </div>
  );
};

root.render(<App />);

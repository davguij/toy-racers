import { useEffect, useState } from 'react';
import Lobby from './components/Lobby';
import { DevTrackViewer } from './scenes';

const App = () => {
  const [showDevTrack, setShowDevTrack] = useState(false);

  useEffect(() => {
    // Check if URL contains dev-track parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('dev-track')) {
      setShowDevTrack(true);
    }
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Toy Racers</h1>
      </header>

      <main className="app-content">
        {showDevTrack ? <DevTrackViewer /> : <Lobby />}
      </main>

      <footer className="app-footer">
        <p>Toy Racers &copy; 2023</p>
      </footer>
    </div>
  );
};

export default App;

import Lobby from './components/Lobby';

const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Toy Racers</h1>
      </header>

      <main className="app-content">
        <Lobby />
      </main>

      <footer className="app-footer">
        <p>Toy Racers &copy; 2023</p>
      </footer>
    </div>
  );
};

export default App;
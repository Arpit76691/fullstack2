import Header from './components/Header';
import StatsBar from './components/StatsBar';
import PlatformsList from './features/platforms/PlatformsList';
import PostsList from './features/posts/PostsList';
import AddPostForm from './features/posts/AddPostForm';
import './App.css';
import './styles/components.css';

function App() {
  return (
    <div className="app-shell">
      <Header />
      <StatsBar />
      <div className="columns">
        <div className="column">
          <AddPostForm />
          <PlatformsList />
        </div>
        <div className="column">
          <PostsList />
        </div>
      </div>
      <footer className="app-footer">
        <small>
          State is centralized in a Redux Toolkit store — no prop drilling.
          Posts and platforms are stored in a normalized shape.
        </small>
      </footer>
    </div>
  );
}

export default App;

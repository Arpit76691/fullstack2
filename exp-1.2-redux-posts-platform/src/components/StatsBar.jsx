import { useSelector } from 'react-redux';
import { selectStats } from '../features/posts/postsSelectors';

function StatsBar() {
  const { totalPosts, totalPlatforms, totalLikes, mostActivePlatformName } =
    useSelector(selectStats);

  return (
    <section className="stats-bar" aria-label="Stats">
      <div className="stats-card">
        <div className="stats-value">{totalPosts}</div>
        <div className="stats-label">Total posts</div>
      </div>
      <div className="stats-card">
        <div className="stats-value">{totalPlatforms}</div>
        <div className="stats-label">Platforms</div>
      </div>
      <div className="stats-card">
        <div className="stats-value">{totalLikes}</div>
        <div className="stats-label">Total likes</div>
      </div>
      <div className="stats-card">
        <div className="stats-value">{mostActivePlatformName}</div>
        <div className="stats-label">Most active</div>
      </div>
    </section>
  );
}

export default StatsBar;

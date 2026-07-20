function PlatformBadge({ name }) {
  return <span className="badge">{name ?? 'Unknown'}</span>;
}

export default PlatformBadge;

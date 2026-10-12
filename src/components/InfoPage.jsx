function InfoPage({ label, title, updatedAt, children }) {
  return (
    <div className="info-page">
      <header className="info-page-header">
        <span className="tag">{label}</span>
        <h1 className="gradient-text">{title}</h1>
        {updatedAt && <p>Last updated: {updatedAt}</p>}
      </header>
      <article className="glass-card info-page-card">
        <div className="info-page-content">{children}</div>
      </article>
    </div>
  )
}

export default InfoPage

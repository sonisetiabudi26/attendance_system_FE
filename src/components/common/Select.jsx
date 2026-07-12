export default function Select({ label, error, id, children, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <select id={id} className={`input ${error ? 'border-danger focus:border-danger focus:ring-danger' : ''}`} {...props}>
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  )
}

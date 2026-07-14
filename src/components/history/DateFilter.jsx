import Button from "@/shared/components/common/Button.jsx"


export default function DateFilter({ filters, onChange, onReset }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:flex-wrap">
      <div className="flex-1 min-w-[140px]">
        <label className="label" htmlFor="startDate">Dari Tanggal</label>
        <input
          id="startDate"
          type="date"
          className="input"
          value={filters.startDate}
          max={filters.endDate || undefined}
          onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
        />
      </div>

      <div className="flex-1 min-w-[140px]">
        <label className="label" htmlFor="endDate">Sampai Tanggal</label>
        <input
          id="endDate"
          type="date"
          className="input"
          value={filters.endDate}
          min={filters.startDate || undefined}
          onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
        />
      </div>

      <Button variant="outline" onClick={onReset} className="sm:mb-0">
        Reset Filter
      </Button>
    </div>
  )
}

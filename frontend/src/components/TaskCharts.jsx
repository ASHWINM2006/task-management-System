import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const PIE_COLORS = ["#a855f7","#10b981","#f59e0b","#f43f5e"];

function buildMonthly(stats) {
  if (!stats) return [];
  const now = new Date().getMonth();
  return MONTHS.map((m, i) => {
    const weight = Math.max(0.1, 1 - Math.abs(i - now) * 0.08);
    const base = Math.round((stats.total || 10) * weight);
    return { month:m, completed:Math.round(base*.6), inprogress:Math.round(base*.4) };
  });
}

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:"var(--bg-card)", border:"1px solid var(--border)",
      borderRadius:10, padding:"10px 16px", boxShadow:"var(--shadow-md)",
      fontSize:12,
    }}>
      <p style={{ fontWeight:700, marginBottom:6, color:"var(--text-primary)" }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color:p.fill, margin:0, fontWeight:600 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function TaskCharts({ stats }) {
  const monthly = buildMonthly(stats);
  const rate    = stats?.completion_rate ?? 0;

  const donut = stats ? [
    { name:"Completed",   value:stats.completed    || 0 },
    { name:"In Progress", value:stats.in_progress  || 0 },
    { name:"Pending",     value:stats.pending      || 0 },
    { name:"Overdue",     value:stats.overdue      || 0 },
  ].filter(d => d.value > 0) : [];

  return (
    <div className="charts-row">
      {/* Bar chart */}
      <div className="chart-card">
        <div className="chart-header">
          <span className="chart-title">📊 Monthly Activity Overview</span>
          <span className="chart-period">This Year</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthly} barSize={9} barGap={3} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
            <XAxis dataKey="month" tick={{ fontSize:11, fill:"var(--text-muted)" }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize:11, fill:"var(--text-muted)" }} axisLine={false} tickLine={false} width={28}/>
            <Tooltip content={<ChartTip/>}/>
            <Bar dataKey="completed"  name="Completed"   fill="#a855f7" radius={[5,5,0,0]}/>
            <Bar dataKey="inprogress" name="In Progress" fill="#c084fc" radius={[5,5,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
        <div className="chart-legend">
          <span className="legend-label"><span className="legend-dot" style={{background:"#a855f7"}}/>Completed</span>
          <span className="legend-label"><span className="legend-dot" style={{background:"#c084fc"}}/>In Progress</span>
        </div>
      </div>

      {/* Donut chart */}
      <div className="chart-card">
        <div className="chart-header">
          <span className="chart-title">🍩 Task Distribution</span>
        </div>

        {donut.length > 0 ? (
          <>
            <div style={{ position:"relative" }}>
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie data={donut} cx="50%" cy="50%" innerRadius={58} outerRadius={85}
                       paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {donut.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
                  </Pie>
                  <Tooltip formatter={(v,n) => [v, n]}/>
                </PieChart>
              </ResponsiveContainer>
              {/* Centre overlay */}
              <div style={{
                position:"absolute", top:"50%", left:"50%",
                transform:"translate(-50%,-50%)",
                textAlign:"center", pointerEvents:"none",
              }}>
                <div className="donut-val">{rate}%</div>
                <div className="donut-sub">Completion</div>
              </div>
            </div>
            <div className="donut-grid">
              {donut.map((d,i) => (
                <div key={d.name} className="donut-item">
                  <span className="legend-dot" style={{background:PIE_COLORS[i%PIE_COLORS.length]}}/>
                  <span style={{color:"var(--text-muted)",fontSize:11}}>{d.name}:</span>
                  <span style={{fontWeight:700,fontSize:12,color:"var(--text-primary)"}}>{d.value}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{textAlign:"center",padding:"40px 0",color:"var(--text-muted)",fontSize:13}}>
            No data yet — create some tasks!
          </div>
        )}
      </div>
    </div>
  );
}

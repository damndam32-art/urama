import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { calculateWithdrawalFee, validateWithdrawal } from '../utils/campaignLogic';

const D30 = [
  20, 28, 25, 34, 30, 38, 44, 41, 52, 48, 55, 50, 62, 58, 66, 60, 72, 69, 78, 74, 82, 77, 90, 86,
  95, 88, 101, 96, 108, 104,
];
const D28 = D30.slice(2).map(v => Math.round(v * 50) / 100);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getDateForIndex(i: number) {
  // 28 days back from Oct 24, 2026
  const d = new Date(2026, 9, 24 - (27 - i));
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

function isFriday(i: number) {
  const d = new Date(2026, 9, 24 - (27 - i));
  return d.getDay() === 5;
}

export function EarningsView() {
  const {
    availableBalance,
    paidOutTotal,
    payoutHistory,
    campaigns,
    userProfile,
    withdraw,
    navigate,
  } = useApp();

  // Top campaigns toggle (3 or 5)
  const [topCount, setTopCount] = useState<number>(3);

  // Interactive chart hover state
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Withdraw Modal State
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [withdrawAmountInput, setWithdrawAmountInput] = useState<string>(
    availableBalance >= 50 ? availableBalance.toFixed(2) : '50.00'
  );
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    userProfile.payoutMethods[0]?.id || ''
  );
  const [validationError, setValidationError] = useState<string>('');
  const [withdrawSuccess, setWithdrawSuccess] = useState<boolean>(false);

  const selectedMethod =
    userProfile.payoutMethods.find(m => m.id === selectedMethodId) ||
    userProfile.payoutMethods[0];

  const parsedAmount = parseFloat(withdrawAmountInput) || 0;
  const currentFee = selectedMethod ? calculateWithdrawalFee(parsedAmount, selectedMethod.type) : 0;
  const netWithdrawal = Math.max(0, parsedAmount - currentFee);
  const arrivalText = selectedMethod?.type === 'card' ? 'Within 30 minutes' : 'Friday, Oct 30';

  // Compute total earned over 28 days
  const totalEarned28 = useMemo(() => {
    return D28.reduce((a, b) => a + b, 0);
  }, []);

  // SVG spline calculation
  const { pathD, areaD, points, maxVal, stepY, yTicks } = useMemo(() => {
    const W = 600;
    const H = 190;
    const n = D28.length;
    const mx = Math.max(...D28);
    const mag = Math.pow(10, Math.floor(Math.log10(mx)));
    const ss = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 8, 10];
    const st = (ss.find(s => s * mag * 3 >= mx) || 1) * mag;
    const top = st * 3;
    const ticks = [0, st, st * 2, st * 3];

    const pts: [number, number][] = [];
    let p = '';
    let px = 0;
    let py = 0;

    for (let i = 0; i < n; i++) {
      const x = (i * W) / (n - 1);
      const y = H - (D28[i] / top) * H;
      pts.push([(x / W) * 100, (y / H) * 100]);

      if (i === 0) {
        p = `M ${x} ${y}`;
      } else {
        const mm = (px + x) / 2;
        p += ` C ${mm} ${py} ${mm} ${y} ${x} ${y}`;
      }
      px = x;
      py = y;
    }

    const aPath = `${p} L ${W} ${H} L 0 ${H} Z`;

    return {
      pathD: p,
      areaD: aPath,
      points: pts,
      maxVal: top,
      stepY: st,
      yTicks: ticks,
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const idx = Math.min(D28.length - 1, Math.max(0, Math.round(ratio * (D28.length - 1))));
    setHoverIndex(idx);
  };

  const handlePointerLeave = () => {
    setHoverIndex(null);
  };

  const activeHover = hoverIndex !== null ? hoverIndex : null;

  // Top campaigns list based on available campaigns
  const topCampaignsList = useMemo(() => {
    const earningsByCampaign = [
      { id: 'palazzo', earned: 94.0, installs: 188 },
      { id: 'tempo', earned: 77.0, installs: 154 },
      { id: 'margin', earned: 60.0, installs: 100 },
      { id: 'tavern', earned: 43.0, installs: 86 },
      { id: 'lingo', earned: 26.0, installs: 52 },
    ];

    return earningsByCampaign.slice(0, topCount).map(item => {
      const matched = campaigns.find(c => c.id === item.id) || campaigns[0];
      return {
        ...matched,
        earned: item.earned,
        installs: item.installs,
      };
    });
  }, [campaigns, topCount]);

  const handleExecuteWithdrawal = () => {
    if (!selectedMethod) return;
    const val = validateWithdrawal(parsedAmount, availableBalance, userProfile.minPayout);
    if (!val.valid) {
      setValidationError(val.error || 'Invalid amount');
      return;
    }

    const res = withdraw(parsedAmount, selectedMethod.id);
    if (!res.success) {
      setValidationError(res.error || 'Withdrawal failed');
      return;
    }

    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setShowWithdrawModal(false);
    }, 1800);
  };

  return (
    <div className="w-full space-y-6">
      {/* Breadcrumb Navigation with Icons */}
      <div className="flex items-center justify-between pb-3 border-b border-[#161616]">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#8E8C84]">
          <button
            onClick={() => navigate('campaigns')}
            className="flex items-center gap-1.5 hover:text-[#F4F2EC] transition-colors"
          >
            <i className="ti ti-speakerphone text-[14px]" />
            <span>Campaigns</span>
          </button>
          <i className="ti ti-chevron-right text-[10px] text-[#55534E]" />
          <span className="flex items-center gap-1.5 text-[#F4F2EC] font-medium">
            <i className="ti ti-coin text-[14px] text-[#D4C7F9]" />
            <span>Earnings</span>
          </span>
        </nav>

        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[#B8EBD0] bg-[#000000] border border-[#161616]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8EBD0]" />
            Stripe Connected · Next payout Friday
          </span>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#F4F2EC] text-black hover:bg-white transition-colors cursor-pointer"
          >
            <i className="ti ti-arrow-up-right text-[13px]" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Main Single Stat Hero Card (.yt structure from template) */}
      <div className="bg-[#000000] border border-[#161616] rounded-2xl overflow-hidden shadow-2xl">
        {/* Top Single Stat Row (.one) */}
        <div className="p-6 sm:p-8 pb-4 border-b border-[#161616]">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#8E8C84] font-medium block">
                Earned, last 28 days
              </span>
              <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#F4F2EC] tracking-tight mt-1.5 tabular-nums">
                $
                {totalEarned28.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#B8EBD0] bg-[#000000] border border-[#1b2b22] px-3 py-1.5 rounded-full font-medium">
                <i className="ti ti-arrow-up-right text-[14px]" />
                <span>18% more than previous 28 days</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Split Layout (.yb: .yl area plot + .yr top campaigns) */}
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-[#161616]">
          {/* Left Column (.yl): Spline Area Plot */}
          <div className="flex-1 p-6 sm:p-8 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-[#8E8C84] font-medium flex items-center gap-2">
                <i className="ti ti-chart-line text-[#D4C7F9]" />
                <span>Daily verified attribution</span>
              </div>
              <div className="text-xs text-[#8E8C84] tabular-nums">
                {activeHover !== null ? (
                  <span className="text-[#F4F2EC] font-medium">
                    {getDateForIndex(activeHover)}: ${D28[activeHover].toFixed(2)}
                  </span>
                ) : (
                  <span>Hover to scrub daily earnings</span>
                )}
              </div>
            </div>

            {/* Plot Container */}
            <div className="relative pr-12 pb-2">
              <div
                className="relative h-[210px] w-full cursor-crosshair select-none touch-none"
                onPointerMove={handlePointerMove}
                onPointerDown={handlePointerMove}
                onPointerLeave={handlePointerLeave}
              >
                {/* Horizontal Grid lines & Right Y-Axis ticks */}
                {yTicks.map((t, idx) => {
                  const bottomPct = (t / maxVal) * 100;
                  return (
                    <React.Fragment key={idx}>
                      <div
                        className="absolute left-0 right-0 border-t border-[#161616]"
                        style={{ bottom: `${bottomPct}%` }}
                      />
                      <span
                        className="absolute left-full ml-2.5 text-[11px] text-[#6E6C66] tabular-nums font-mono -translate-y-1/2"
                        style={{ bottom: `${bottomPct}%` }}
                      >
                        ${Math.round(t)}
                      </span>
                    </React.Fragment>
                  );
                })}

                {/* SVG Area and Stroke Line */}
                <svg
                  viewBox="0 0 600 190"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
                >
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4C7F9" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#D4C7F9" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Gradient Area Fill */}
                  <path d={areaD} fill="url(#areaGradient)" />

                  {/* Spline Curve Stroke */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#D4C7F9"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Interactive Scrubber Cursor Line & Dot */}
                {activeHover !== null && (
                  <>
                    <div
                      className="absolute top-0 bottom-0 w-[1px] bg-[#3A3834] pointer-events-none transition-all duration-75"
                      style={{ left: `${points[activeHover][0]}%` }}
                    />
                    <div
                      className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-[#D4C7F9] border-2 border-[#000000] shadow-[0_0_12px_rgba(212,199,249,0.8)] pointer-events-none transition-all duration-75"
                      style={{
                        left: `${points[activeHover][0]}%`,
                        top: `${points[activeHover][1]}%`,
                      }}
                    />
                    {/* Tooltip */}
                    <div
                      className="absolute -top-9 -translate-x-1/2 bg-[#121212] border border-[#262626] text-[#F4F2EC] text-[11px] font-mono px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap pointer-events-none z-20 tabular-nums transition-all duration-75"
                      style={{
                        left: `${Math.max(10, Math.min(90, points[activeHover][0]))}%`,
                      }}
                    >
                      {getDateForIndex(activeHover)} · ${D28[activeHover].toFixed(2)}
                    </div>
                  </>
                )}
              </div>

              {/* Payout Markers row (.mk from template) */}
              <div className="relative h-6 mt-3">
                {D28.map((_, i) => {
                  if (!isFriday(i)) return null;
                  const leftPct = (i / (D28.length - 1)) * 100;
                  return (
                    <span
                      key={i}
                      title={`Friday settlement payout on ${getDateForIndex(i)}`}
                      className="absolute -translate-x-1/2 w-5 h-5 rounded-md bg-[#000000] border border-[#222222] flex items-center justify-center text-[#D4C7F9] text-[11px] cursor-help shadow-sm"
                      style={{ left: `${leftPct}%` }}
                    >
                      <i className="ti ti-coin" />
                    </span>
                  );
                })}
              </div>

              {/* X-axis date labels (.xl from template) */}
              <div className="flex justify-between mt-2 text-[11px] text-[#6E6C66] font-mono select-none">
                {[0, 7, 14, 21, 27].map(idx => (
                  <span key={idx}>{getDateForIndex(idx)}</span>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2 text-xs text-[#8E8C84] mt-4 pt-3 border-t border-[#141414]">
                <i className="ti ti-coin text-[#D4C7F9] text-[14px]" />
                <span>Friday Payout Days (automatic ACH via Stripe)</span>
              </div>
            </div>
          </div>

          {/* Right Column (.yr): Top Campaigns */}
          <div className="w-full lg:w-[320px] xl:w-[360px] p-6 sm:p-8 bg-[#000000] flex flex-col justify-between shrink-0">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-[#8E8C84] font-medium">
                  Top campaigns
                </span>
                <span className="text-[11px] text-[#6E6C66]">Last 28 days</span>
              </div>

              {/* Campaign list items */}
              <div className="space-y-3">
                {topCampaignsList.map(item => (
                  <div
                    key={item.id}
                    onClick={() => navigate('campaign', item.id)}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#000000] border border-[#161616] hover:border-[#262626] hover:bg-[#050505] transition-all cursor-pointer group"
                  >
                    {/* Tile with campaign color & icon */}
                    <div
                      style={{ backgroundColor: item.bg, color: item.fg }}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 shadow-sm"
                    >
                      <i className={`ti ${item.ic}`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-medium text-[#F4F2EC] truncate group-hover:text-[#D4C7F9] transition-colors flex items-center gap-1.5">
                        <span>{item.name}</span>
                        <i className="ti ti-rosette-discount-check text-[#D4C7F9] text-[13px]" />
                      </div>
                      <div className="text-xs text-[#8E8C84] tabular-nums mt-0.5">
                        ${item.earned.toFixed(2)} earned · {item.installs} installs
                      </div>
                    </div>

                    <i className="ti ti-chevron-right text-xs text-[#55534E] group-hover:text-[#F4F2EC] transition-colors" />
                  </div>
                ))}
              </div>

              {/* Toggle See more / See less button */}
              <button
                onClick={() => setTopCount(prev => (prev === 3 ? 5 : 3))}
                className="w-full mt-4 py-2 px-3 rounded-xl border border-[#1c1c1c] text-xs font-medium text-[#8E8C84] hover:text-[#F4F2EC] hover:bg-[#0a0a0a] transition-all text-center cursor-pointer"
              >
                {topCount === 3 ? 'See more (5)' : 'See less (3)'}
              </button>
            </div>

            {/* Verification Guarantee badge */}
            <div className="mt-6 pt-5 border-t border-[#161616] flex items-center gap-2.5 text-xs text-[#8E8C84]">
              <i className="ti ti-shield-check text-[#B8EBD0] text-base shrink-0" />
              <span>Fraud-filtered attribution guaranteed on every unique launch.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complimentary Section: Account Balances & Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#000000] border border-[#161616] rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-[#8E8C84]">Available Balance</div>
          <div className="font-serif text-2xl font-medium text-[#F4F2EC] mt-1 tabular-nums">
            ${availableBalance.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#B8EBD0] mt-1 flex items-center gap-1">
            <i className="ti ti-check text-[11px]" /> Ready for instant transfer
          </div>
        </div>

        <div className="bg-[#000000] border border-[#161616] rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-[#8E8C84]">Pending Verification</div>
          <div className="font-serif text-2xl font-medium text-[#F4F2EC] mt-1 tabular-nums">
            $342.00
          </div>
          <div className="text-[11px] text-[#FBE4B5] mt-1 flex items-center gap-1">
            <i className="ti ti-clock text-[11px]" /> Releases this Friday
          </div>
        </div>

        <div className="bg-[#000000] border border-[#161616] rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-[#8E8C84]">Lifetime Settled</div>
          <div className="font-serif text-2xl font-medium text-[#F4F2EC] mt-1 tabular-nums">
            ${paidOutTotal.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#8E8C84] mt-1 flex items-center gap-1">
            <i className="ti ti-building-bank text-[11px]" /> Sent to Chase Checking
          </div>
        </div>

        <div className="bg-[#000000] border border-[#161616] rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-[#8E8C84]">Verified Installs</div>
          <div className="font-serif text-2xl font-medium text-[#F4F2EC] mt-1 tabular-nums">
            2,840
          </div>
          <div className="text-[11px] text-[#D4C7F9] mt-1 flex items-center gap-1">
            <i className="ti ti-device-mobile text-[11px]" /> 99.2% approval rate
          </div>
        </div>
      </div>

      {/* Complimentary Section: Settlement & Payout History Table */}
      <div className="bg-[#000000] border border-[#161616] rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#161616]">
          <div>
            <h2 className="font-serif text-lg font-medium text-[#F4F2EC]">
              Settlement &amp; Payout History
            </h2>
            <div className="text-xs text-[#8E8C84] mt-0.5">
              Direct deposits processed through umi Attribution Network
            </div>
          </div>
          <div className="text-xs text-[#8E8C84] flex items-center gap-2">
            <i className="ti ti-file-text text-[14px]" />
            <span>Monthly Statements (CSV / PDF)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#161616] text-[#8E8C84]">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Destination</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#121212]">
              {payoutHistory.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#050505] transition-colors">
                  <td className="py-3.5 text-[#C8C6BE] font-mono tabular-nums">{item.date}</td>
                  <td className="py-3.5 text-[#F4F2EC] font-medium">{item.description}</td>
                  <td className="py-3.5 text-[#8E8C84]">{item.method}</td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        item.status === 'Paid'
                          ? 'bg-[#0b1c13] text-[#B8EBD0] border border-[#183a27]'
                          : 'bg-[#1e190e] text-[#FBE4B5] border border-[#3d3319]'
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full ${
                          item.status === 'Paid' ? 'bg-[#B8EBD0]' : 'bg-[#FBE4B5]'
                        }`}
                      />
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-mono font-medium text-[#F4F2EC] tabular-nums">
                    +${item.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdraw Modal Drawer */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#000000] border border-[#222222] rounded-2xl p-6 sm:p-7 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#161616]">
              <div className="flex items-center gap-2">
                <i className="ti ti-coin text-[#D4C7F9] text-xl" />
                <h3 className="font-serif text-lg font-medium text-[#F4F2EC]">
                  Withdraw to Bank or Card
                </h3>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-[#8E8C84] hover:text-[#F4F2EC] p-1 cursor-pointer"
              >
                <i className="ti ti-x text-lg" />
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#11261b] text-[#B8EBD0] flex items-center justify-center text-2xl mx-auto border border-[#1d442e]">
                  <i className="ti ti-check" />
                </div>
                <div className="font-serif text-xl text-[#F4F2EC]">Transfer Initiated</div>
                <p className="text-xs text-[#8E8C84] max-w-xs mx-auto">
                  ${netWithdrawal.toFixed(2)} is on the way to {selectedMethod?.name} (arrival:{' '}
                  {arrivalText}).
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#8E8C84] block">
                    Withdrawal Amount ($ USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8E8C84]">
                      $
                    </span>
                    <input
                      type="number"
                      step="1"
                      min={userProfile.minPayout}
                      max={availableBalance}
                      value={withdrawAmountInput}
                      onChange={e => {
                        setWithdrawAmountInput(e.target.value);
                        setValidationError('');
                      }}
                      className="w-full bg-[#080808] border border-[#1c1c1c] rounded-xl pl-8 pr-4 py-2.5 text-sm text-[#F4F2EC] font-mono focus:border-[#D4C7F9] focus:outline-none tabular-nums"
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#8E8C84] px-1">
                    <span>Available: ${availableBalance.toFixed(2)}</span>
                    <button
                      type="button"
                      onClick={() => setWithdrawAmountInput(availableBalance.toFixed(2))}
                      className="text-[#D4C7F9] hover:underline cursor-pointer"
                    >
                      Max amount
                    </button>
                  </div>
                </div>

                {/* Payout Destination */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#8E8C84] block">
                    Payout Destination
                  </label>
                  <div className="space-y-2">
                    {userProfile.payoutMethods.map(m => (
                      <label
                        key={m.id}
                        onClick={() => setSelectedMethodId(m.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                          selectedMethod?.id === m.id
                            ? 'bg-[#080808] border-[#D4C7F9] text-[#F4F2EC]'
                            : 'bg-[#000000] border-[#161616] text-[#8E8C84] hover:border-[#222222]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <i
                            className={`ti ${
                              m.type === 'bank' ? 'ti-building-bank' : 'ti-credit-card'
                            } text-lg text-[#D4C7F9]`}
                          />
                          <div>
                            <div className="text-xs font-medium text-[#F4F2EC]">{m.name}</div>
                            <div className="text-[11px] text-[#6E6C66]">•••• {m.last4}</div>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="payout_method"
                          checked={selectedMethod?.id === m.id}
                          onChange={() => setSelectedMethodId(m.id)}
                          className="accent-[#D4C7F9]"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Fee & Net Summary */}
                <div className="bg-[#080808] border border-[#161616] rounded-xl p-3.5 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#8E8C84]">
                    <span>Transfer fee:</span>
                    <span className="font-mono text-[#F4F2EC]">${currentFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#8E8C84]">
                    <span>Estimated arrival:</span>
                    <span className="text-[#F4F2EC]">{arrivalText}</span>
                  </div>
                  <div className="flex justify-between font-medium text-sm pt-2 border-t border-[#161616] text-[#F4F2EC]">
                    <span>Net deposit:</span>
                    <span className="font-mono text-[#B8EBD0]">${netWithdrawal.toFixed(2)}</span>
                  </div>
                </div>

                {validationError && (
                  <div className="text-xs text-[#FAD2C0] bg-[#241512] border border-[#3e1f18] p-2.5 rounded-lg flex items-center gap-2">
                    <i className="ti ti-alert-circle text-sm" />
                    <span>{validationError}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#1c1c1c] text-xs font-medium text-[#8E8C84] hover:text-[#F4F2EC] hover:bg-[#0a0a0a] transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteWithdrawal}
                    className="flex-1 py-2.5 rounded-xl bg-[#F4F2EC] text-black text-xs font-semibold hover:bg-white transition-all cursor-pointer shadow-lg"
                  >
                    Confirm &amp; Transfer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

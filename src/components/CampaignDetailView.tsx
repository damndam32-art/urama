import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QrCodeSvg } from './UmiGraphic';

const PEOPLE = [
  { name: 'Giulia Ferrante', role: 'Product Lead', color: '#D4C7F9', ig: 'giulia.f', x: 'giuliaf' },
  { name: 'Ravi Anand', role: 'Growth', color: '#B8EBD0', ig: 'ravi.anand', x: 'ravia' },
  { name: 'Noor Haddad', role: 'Design', color: '#FAD2C0', ig: 'noorhaddad', x: 'noor_h' },
  { name: 'Tomas Veliz', role: 'Engineering', color: '#FBE4B5', ig: 'tomas.v', x: 'tomasv' },
];

export function CampaignDetailView() {
  const {
    selectedCampaign: campaign,
    joinedMap,
    requestJoinCampaign,
    navigate,
    userProfile,
  } = useApp();

  const [isFollowing, setIsFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Status can be: 'host' | 'joined' | 'pending' | 'closed' | 'open'
  const isHost = Boolean(campaign.mine);
  const userJoinStatusNum = joinedMap[campaign.id] || 0; // 0 = none, 1 = pending, 2 = joined

  let status: 'host' | 'joined' | 'pending' | 'closed' | 'open' = 'open';
  if (isHost) {
    status = 'host';
  } else if (userJoinStatusNum === 2) {
    status = 'joined';
  } else if (userJoinStatusNum === 1) {
    status = 'pending';
  } else if (campaign.days <= 0) {
    status = 'closed';
  }

  const trackedLink = `umi.link/${campaign.id}-${userProfile.handle.slice(0, 2)}`;

  const handleCopy = () => {
    try {
      navigator.clipboard?.writeText(`https://${trackedLink}`);
    } catch (e) {
      // fallback
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleJoinRequest = () => {
    requestJoinCampaign(campaign.id, {
      whyFit: `Mobile review creator focusing on ${campaign.cat} apps`,
      channels: `@${userProfile.handle}`,
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Breadcrumb Navigation with Icons */}
      <div className="flex items-center justify-between pb-3 border-b border-[#161616]">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#8E8C84]">
          <button
            onClick={() => navigate('campaigns')}
            className="flex items-center gap-1.5 hover:text-[#F4F2EC] transition-colors cursor-pointer"
          >
            <i className="ti ti-speakerphone text-[14px]" />
            <span>Campaigns</span>
          </button>
          <i className="ti ti-chevron-right text-[10px] text-[#55534E]" />
          <span className="flex items-center gap-1.5 text-[#F4F2EC] font-medium">
            <i className={`ti ${campaign.ic} text-[14px] text-[#D4C7F9]`} />
            <span>{campaign.name}</span>
          </span>
        </nav>

        <div className="flex items-center gap-3">
          {isHost ? (
            <button
              onClick={() => navigate('manager')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F4F2EC] text-black hover:bg-white transition-colors cursor-pointer"
            >
              <i className="ti ti-notes text-[13px]" />
              <span>Campaign Manager</span>
            </button>
          ) : (
            <span className="text-xs text-[#8E8C84]">
              Presented by <strong className="text-[#F4F2EC] font-medium">{campaign.b}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Soft Pastel Ambient Glow Header */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4C7F9]/10 via-[#D4C7F9]/5 to-transparent pointer-events-none rounded-2xl" />

        {/* 2-Column Responsive Layout (.dg: .dl left rail 280px + .dr right main) */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)] gap-10 items-start relative pt-4">
          {/* LEFT COLUMN (.dl from template) */}
          <div className="space-y-6 shrink-0">
            {/* Square Cover Card (.cov from template) */}
            <div className="aspect-square rounded-2xl bg-[#000000] border border-[#161616] p-6 flex flex-col items-center justify-center text-center gap-4 shadow-xl">
              <div
                style={{ backgroundColor: campaign.bg, color: campaign.fg }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-serif text-3xl font-medium shadow-md"
              >
                {campaign.name[0]}
              </div>
              <span className="text-xl font-medium text-[#F4F2EC] tracking-tight">
                {campaign.name}
              </span>
              <span className="text-xs text-[#8E8C84] -mt-2">Attribution SDK Active</span>
            </div>

            {/* Presented By & Follow Row */}
            <div className="p-4 rounded-xl bg-[#000000] border border-[#161616] space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    style={{ backgroundColor: campaign.bg, color: campaign.fg }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-medium text-base shrink-0"
                  >
                    {campaign.b[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] text-[#8E8C84] leading-tight">Presented by</div>
                    <div className="text-sm font-medium text-[#F4F2EC] truncate">{campaign.b}</div>
                  </div>
                </div>

                <button
                  onClick={() => setIsFollowing(prev => !prev)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                    isFollowing
                      ? 'bg-[#141414] border border-[#222222] text-[#F4F2EC]'
                      : 'bg-[#F4F2EC] text-black hover:bg-white'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>

              <div className="text-xs text-[#8E8C84] pt-2 border-t border-[#141414]">
                {campaign.cat} campaigns on umi
              </div>
            </div>

            {/* Run By Team Section (.sec & .pr from template) */}
            <div className="p-4 rounded-xl bg-[#000000] border border-[#161616] space-y-3">
              <div className="text-xs font-medium text-[#8E8C84] uppercase tracking-wider">
                Run by
              </div>
              <div className="space-y-2.5">
                {PEOPLE.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span
                      style={{ backgroundColor: p.color }}
                      className="w-7 h-7 rounded-full text-black font-semibold text-[11px] flex items-center justify-center shrink-0"
                    >
                      {p.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-[#F4F2EC] truncate">{p.name}</div>
                      <div className="text-[10px] text-[#6E6C66]">{p.role}</div>
                    </div>
                    <div className="flex items-center gap-2 text-[#8E8C84] text-sm">
                      <i className="ti ti-brand-instagram hover:text-[#F4F2EC] cursor-pointer" />
                      <i className="ti ti-brand-x hover:text-[#F4F2EC] cursor-pointer" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (.dr from template) */}
          <div className="space-y-7 min-w-0">
            {/* Featured Chip */}
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#000000] border border-[#161616] text-xs text-[#8E8C84]">
                <i className="ti ti-sparkles text-[#D4C7F9]" />
                <span>
                  Featured in <strong className="text-[#F4F2EC] font-medium">Creator picks</strong>
                </span>
                <i className="ti ti-chevron-right text-[10px]" />
              </span>

              {/* Title (.ttl) */}
              <div className="flex items-center gap-3 flex-wrap mt-3 mb-4">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F4F2EC] tracking-tight">
                  {campaign.name}
                </h1>
                <i className="ti ti-rosette-discount-check text-[#D4C7F9] text-2xl" />
              </div>
            </div>

            {/* Info Bullets (.ib from template) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[#000000] border border-[#161616]">
                <div className="w-11 h-11 rounded-xl bg-[#080808] border border-[#1c1c1c] flex items-center justify-center text-xl text-[#D4C7F9] shrink-0">
                  <i className="ti ti-calendar" />
                </div>
                <div>
                  <div className="text-xs font-medium text-[#F4F2EC]">{campaign.end}</div>
                  <div className="text-[11px] text-[#8E8C84] mt-0.5">
                    Ends 11:59 PM PDT · {campaign.days} days left
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[#000000] border border-[#161616]">
                <div className="w-11 h-11 rounded-xl bg-[#080808] border border-[#1c1c1c] flex items-center justify-center text-xl text-[#B8EBD0] shrink-0">
                  <i className="ti ti-coin" />
                </div>
                <div>
                  <div className="text-xs font-medium text-[#F4F2EC] tabular-nums">
                    ${campaign.price} per verified install
                  </div>
                  <div className="text-[11px] text-[#8E8C84] mt-0.5">
                    Paid every Friday through Stripe
                  </div>
                </div>
              </div>
            </div>

            {/* Join Campaign Card (.rg from template with all states) */}
            <div className="rounded-2xl border border-[#161616] bg-[#000000] overflow-hidden shadow-xl">
              <div className="px-5 py-3 border-b border-[#161616] text-xs font-medium text-[#8E8C84] uppercase tracking-wider flex items-center justify-between">
                <span>Join campaign</span>
                <span className="text-[11px] text-[#B8EBD0] normal-case flex items-center gap-1 font-normal">
                  <i className="ti ti-shield-check" /> Verified Settlement
                </span>
              </div>

              <div className="p-6">
                {status === 'open' && (
                  <div className="space-y-4">
                    <h4 className="text-base font-medium text-[#F4F2EC]">Open to creators</h4>
                    <p className="text-xs text-[#8E8C84] leading-relaxed">
                      Request to join and get your own tracked link. You earn ${campaign.price} for
                      every verified install with instant Friday payouts.
                    </p>
                    <button
                      onClick={handleJoinRequest}
                      className="w-full py-3 rounded-xl bg-[#F4F2EC] text-black font-semibold text-xs hover:bg-white transition-all cursor-pointer shadow-lg"
                    >
                      Request to join
                    </button>
                  </div>
                )}

                {status === 'pending' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#FBE4B5] font-medium text-sm">
                      <i className="ti ti-clock text-lg" />
                      <span>Pending approval</span>
                    </div>
                    <p className="text-xs text-[#8E8C84]">
                      Your request has been submitted to the {campaign.b} team. They usually reply
                      within 24 hours. We will notify you once approved.
                    </p>
                  </div>
                )}

                {status === 'joined' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#B8EBD0] font-medium text-sm">
                        <i className="ti ti-circle-check text-lg" />
                        <span>You&apos;re in</span>
                      </div>
                      <button
                        onClick={() => setShowQr(prev => !prev)}
                        className="text-xs text-[#D4C7F9] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <i className="ti ti-qrcode" />
                        <span>{showQr ? 'Hide QR' : 'Show QR code'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-[#8E8C84]">
                      Your tracked link is ready to share on your TikTok, Instagram, or YouTube
                      descriptions:
                    </p>

                    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#080808] border border-[#161616]">
                      <span className="font-mono text-xs text-[#F4F2EC] truncate">
                        {trackedLink}
                      </span>
                      <button
                        onClick={handleCopy}
                        className="px-3 py-1.5 rounded-lg bg-[#141414] border border-[#222222] text-xs font-medium text-[#F4F2EC] hover:bg-[#1a1a1a] transition-all cursor-pointer shrink-0"
                      >
                        {copiedLink ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    {showQr && (
                      <div className="p-4 bg-white rounded-xl flex items-center justify-center mx-auto w-36 h-36">
                        <QrCodeSvg value={`https://${trackedLink}`} size={120} />
                      </div>
                    )}
                  </div>
                )}

                {status === 'host' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#D4C7F9] font-medium text-sm">
                      <i className="ti ti-flag text-lg" />
                      <span>You run this campaign</span>
                    </div>
                    <p className="text-xs text-[#8E8C84]">
                      Creators who join appear under People in your campaign management dashboard.
                    </p>
                    <button
                      onClick={() => navigate('manager')}
                      className="w-full py-2.5 rounded-xl border border-[#222222] text-xs font-medium text-[#F4F2EC] hover:bg-[#0c0c0c] transition-all cursor-pointer"
                    >
                      Open Campaign Manager
                    </button>
                  </div>
                )}

                {status === 'closed' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#8E8C84] font-medium text-sm">
                      <i className="ti ti-circle-minus text-lg" />
                      <span>Campaign closed</span>
                    </div>
                    <p className="text-xs text-[#8E8C84]">
                      This campaign is not taking new creators. You can follow {campaign.b} to hear
                      about the next program.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* About Campaign Section (.sec from template) */}
            <div className="space-y-4 pt-2">
              <div className="text-xs font-medium text-[#8E8C84] uppercase tracking-wider border-b border-[#161616] pb-2">
                About campaign
              </div>

              <div className="text-xs sm:text-sm text-[#C8C6BE] leading-relaxed space-y-3">
                <p>
                  <strong className="text-[#F4F2EC] font-medium">{campaign.name}</strong> is{' '}
                  {campaign.d} {campaign.d2}
                </p>
                <p className="text-[#8E8C84]">
                  Creators earn ${campaign.price} for every verified install, paid every Friday. An
                  install counts once the app has been opened on a genuine physical device and
                  passes umi&apos;s anti-fraud checks. The campaign ends on {campaign.end} or when
                  the creator budget pool is fully settled.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

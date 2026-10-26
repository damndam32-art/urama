import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UmiPetal } from './UmiGraphic';

export function Overlays() {
  const {
    overlay,
    closeOverlay,
    campaigns,
    selectedCampaignId,
    navigate,
    requestJoinCampaign,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    userProfile,
    resetDemoData,
  } = useApp();

  // Request form state
  const [tiktokLink, setTiktokLink] = useState(userProfile.channels.tiktok || '@amara');
  const [youtubeLink, setYoutubeLink] = useState(userProfile.channels.youtube || 'youtube.com/@amara');
  const [fitText, setFitText] = useState(
    'I review productivity and photo apps for people who like simple, beautiful tools. My audience engages heavily with workflow tutorials.'
  );
  const [sponsoredAgreement, setSponsoredAgreement] = useState(false);
  const [formError, setFormError] = useState('');

  if (!overlay) return null;

  const currentCampaign =
    campaigns.find(k => k.id === selectedCampaignId) || campaigns[0];

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsoredAgreement) {
      setFormError('You must agree to label every post as sponsored.');
      return;
    }
    if (!fitText.trim()) {
      setFormError('Please explain why you are a good fit for this campaign.');
      return;
    }

    setFormError('');
    requestJoinCampaign(currentCampaign.id, {
      whyFit: fitText,
      channels: `${tiktokLink} · ${youtubeLink}`,
    });
    closeOverlay();
  };

  return (
    <>
      {/* 1. NOTIFICATIONS DRAWER (docked adjacent to sidebar matching reference) */}
      {overlay === 'notif' && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex"
          onClick={closeOverlay}
        >
          <div
            className="fixed top-0 bottom-0 left-0 md:left-14 xl:left-[216px] w-full sm:w-[380px] md:w-[400px] h-full bg-[#000000] border-r border-[#161616] flex flex-col shadow-2xl animate-in slide-in-from-left duration-200 z-50"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#161616]">
              <div className="flex items-center gap-2.5">
                <h3 className="font-serif text-lg font-medium text-[#F4F2EC]">Notifications</h3>
                {notifications.some(n => n.unread) && (
                  <span className="w-2 h-2 rounded-full bg-[#D4C7F9] shadow-[0_0_6px_rgba(212,199,249,0.7)]" />
                )}
              </div>
              <div className="flex items-center gap-3">
                {notifications.some(n => n.unread) && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-[#8E8C84] hover:text-[#D4C7F9] transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeOverlay}
                  className="text-[#8E8C84] hover:text-[#F4F2EC] p-1 transition-colors"
                  aria-label="Close notifications"
                >
                  <i className="ti ti-x text-base" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#121212]">
              {notifications.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    markNotificationAsRead(item.id);
                    closeOverlay();
                    navigate(item.targetScreen, item.targetCampaignId);
                  }}
                  className={`px-5 py-4 flex items-start gap-3.5 cursor-pointer transition-colors hover:bg-[#080808] group ${
                    item.unread ? 'bg-[#050505]' : 'bg-[#000000]'
                  }`}
                >
                  {/* Brand/avatar circle */}
                  <div className="w-9 h-9 rounded-full bg-[#141414] border border-[#222222] text-[#F4F2EC] flex items-center justify-center shrink-0 font-medium text-xs select-none shadow-sm">
                    {item.type === 'payout' ? (
                      <i className="ti ti-coin text-base text-[#D4C7F9]" />
                    ) : (
                      <span className="font-serif text-sm">{item.title.charAt(0)}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-medium text-[13.5px] text-[#F4F2EC] group-hover:text-white truncate">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-[#8E8C84] shrink-0 font-normal">
                        {item.date}
                      </span>
                    </div>
                    <div className="text-[12.5px] text-[#C8C6BE] mt-0.5 leading-snug">
                      {item.subtitle}
                    </div>
                    {item.body && (
                      <div className="mt-2 pl-2.5 border-l border-[#222222] text-xs text-[#8E8C84] leading-relaxed line-clamp-3">
                        {item.body}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. REQUEST TO JOIN FORM (position: fixed to viewport) */}
      {overlay === 'req' && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4"
          onClick={closeOverlay}
        >
          <div
            className="w-full max-w-md bg-[#000000] border border-[#1c1c1c] rounded-2xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#161616]">
              <div>
                <h3 className="font-serif text-lg font-medium text-[#F4F2EC]">Request to join</h3>
                <div className="text-xs text-[#8E8C84] mt-0.5">{currentCampaign.name}</div>
              </div>
              <button
                type="button"
                onClick={closeOverlay}
                className="text-[#8E8C84] hover:text-[#F4F2EC] p-1 text-base"
                aria-label="Close request modal"
              >
                <i className="ti ti-x" />
              </button>
            </div>

            <p className="text-xs text-[#8E8C84] leading-relaxed">
              Founders approve verified creators before generating your unique attribution link and coupon code.
            </p>

            <form onSubmit={handleRequestSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] text-[#8E8C84] block mb-1">TikTok Handle / Link</label>
                <input
                  type="text"
                  required
                  value={tiktokLink}
                  onChange={e => setTiktokLink(e.target.value)}
                  placeholder="@yourhandle or link"
                  className="w-full h-10 px-3 bg-[#080808] border border-[#1c1c1c] rounded-xl text-xs text-[#F4F2EC] outline-none focus:border-[#D4C7F9] transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#8E8C84] block mb-1">YouTube Channel URL</label>
                <input
                  type="text"
                  required
                  value={youtubeLink}
                  onChange={e => setYoutubeLink(e.target.value)}
                  placeholder="youtube.com/@channel"
                  className="w-full h-10 px-3 bg-[#080808] border border-[#1c1c1c] rounded-xl text-xs text-[#F4F2EC] outline-none focus:border-[#D4C7F9] transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#8E8C84] block mb-1">Why are you a good fit?</label>
                <textarea
                  rows={3}
                  required
                  value={fitText}
                  onChange={e => setFitText(e.target.value)}
                  placeholder="Describe your audience niche and past campaign experience..."
                  className="w-full bg-[#080808] border border-[#1c1c1c] rounded-xl p-2.5 text-xs text-[#F4F2EC] outline-none focus:border-[#D4C7F9] resize-none leading-relaxed transition-colors"
                />
              </div>

              {/* Sponsorship Agreement Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="reqSponsoredTerms"
                  required
                  checked={sponsoredAgreement}
                  onChange={e => {
                    setSponsoredAgreement(e.target.checked);
                    if (e.target.checked) setFormError('');
                  }}
                  className="accent-[#D4C7F9] mt-0.5 cursor-pointer"
                />
                <label
                  htmlFor="reqSponsoredTerms"
                  className="text-xs text-[#C8C6BE] leading-relaxed cursor-pointer select-none"
                >
                  <strong className="text-[#F4F2EC]">I will label every post as sponsored</strong> and
                  abide by FTC creator disclosure requirements and umi partner terms.
                </label>
              </div>

              {formError && (
                <div className="p-2.5 rounded-xl bg-[#241617] border border-[#3C2022] text-xs text-[#FAD2C0]">
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[#161616]">
                <button
                  type="button"
                  onClick={closeOverlay}
                  className="px-4 py-2 text-xs font-medium rounded-full border border-[#222222] text-[#8E8C84] hover:text-[#F4F2EC] hover:bg-[#0c0c0c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-full bg-[#F4F2EC] text-black hover:bg-white shadow-md transition-colors"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. MORE DROPDOWN MENU (position: fixed to viewport) */}
      {overlay === 'more' && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs"
          onClick={closeOverlay}
        >
          <div
            className="fixed bottom-16 md:bottom-6 left-4 md:left-[60px] xl:left-[224px] w-60 bg-[#000000] border border-[#1c1c1c] rounded-2xl p-2 shadow-2xl space-y-1 text-xs select-none animate-in fade-in zoom-in-95 duration-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-3 py-2 border-b border-[#161616] flex items-center gap-2">
              <UmiPetal size={18} />
              <span className="font-serif text-sm font-medium text-[#F4F2EC]">umi protocol</span>
            </div>

            <button
              onClick={() => {
                closeOverlay();
                navigate('docs');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F4F2EC] hover:bg-[#0c0c0c] transition-colors text-left"
            >
              <i className="ti ti-book text-base text-[#D4C7F9]" />
              <span>Documentation</span>
            </button>

            <button
              onClick={() => {
                closeOverlay();
                navigate('keys');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F4F2EC] hover:bg-[#0c0c0c] transition-colors text-left"
            >
              <i className="ti ti-key text-base text-[#D4C7F9]" />
              <span>SDK &amp; Keys</span>
            </button>

            <button
              onClick={() => {
                closeOverlay();
                navigate('manager');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F4F2EC] hover:bg-[#0c0c0c] transition-colors text-left"
            >
              <i className="ti ti-dashboard text-base text-[#D4C7F9]" />
              <span>Campaign Manager</span>
            </button>

            <div className="pt-1 border-t border-[#161616]">
              <button
                onClick={() => {
                  closeOverlay();
                  resetDemoData();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#FAD2C0] hover:bg-[#0c0c0c] transition-colors text-left"
              >
                <i className="ti ti-refresh text-base" />
                <span>Reset Demo State</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

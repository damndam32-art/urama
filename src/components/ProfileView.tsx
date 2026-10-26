import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export function ProfileView() {
  const { userProfile, updateUserProfile, campaigns, navigate } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name || 'Maya Okafor');
  const [bioInput, setBioInput] = useState(
    userProfile.bio ||
      'Mobile creator. I make short, honest app reviews and get paid when people install.'
  );
  const [locationInput, setLocationInput] = useState('Lagos, Nigeria');
  const [socialInput, setSocialInput] = useState('maya.reviews');

  const handleSave = () => {
    updateUserProfile({
      name: nameInput.trim() || userProfile.name,
      bio: bioInput.trim() || userProfile.bio,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNameInput(userProfile.name);
    setBioInput(userProfile.bio);
    setIsEditing(false);
  };

  const initialLetter = (userProfile.name || 'Maya')[0].toUpperCase();

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
            <i className="ti ti-user text-[14px] text-[#D4C7F9]" />
            <span>Profile</span>
          </span>
        </nav>

        <span className="text-xs text-[#8E8C84] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8EBD0]" />
          Verified Creator Partner
        </span>
      </div>

      {/* Main Profile Card (.cv + .pav structure from template) */}
      <div className="bg-[#000000] border border-[#161616] rounded-2xl overflow-hidden shadow-2xl">
        {/* Cover Banner (.cv from template) */}
        <div className="h-36 sm:h-44 w-full bg-gradient-to-r from-[#D4C7F9]/20 via-[#B8EBD0]/10 to-[#FAD2C0]/20 border-b border-[#161616] relative">
          <div className="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
        </div>

        {/* Profile Avatar and Actions Row */}
        <div className="px-6 sm:px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-5">
            {/* Avatar (.pav from template) */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#D4C7F9] text-black font-serif text-4xl sm:text-5xl font-medium flex items-center justify-center border-4 border-[#000000] shadow-2xl shrink-0 select-none">
              {initialLetter}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#222222] text-[#8E8C84] hover:text-[#F4F2EC] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#F4F2EC] text-black hover:bg-white transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-[#141414] border border-[#222222] text-[#F4F2EC] hover:bg-[#1f1f1f] transition-colors cursor-pointer"
                >
                  <i className="ti ti-edit text-xs" />
                  <span>Edit profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Profile Details */}
          {isEditing ? (
            <div className="space-y-4 max-w-lg mt-4">
              <div>
                <label className="text-xs text-[#8E8C84] font-medium block mb-1">Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  className="w-full bg-[#080808] border border-[#222222] rounded-xl px-3.5 py-2 text-sm text-[#F4F2EC] focus:border-[#D4C7F9] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#8E8C84] font-medium block mb-1">Creator Bio</label>
                <textarea
                  rows={3}
                  value={bioInput}
                  onChange={e => setBioInput(e.target.value)}
                  className="w-full bg-[#080808] border border-[#222222] rounded-xl px-3.5 py-2 text-sm text-[#F4F2EC] focus:border-[#D4C7F9] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#8E8C84] font-medium block mb-1">Location</label>
                  <input
                    type="text"
                    value={locationInput}
                    onChange={e => setLocationInput(e.target.value)}
                    className="w-full bg-[#080808] border border-[#222222] rounded-xl px-3.5 py-2 text-xs text-[#F4F2EC] focus:border-[#D4C7F9] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8E8C84] font-medium block mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={socialInput}
                    onChange={e => setSocialInput(e.target.value)}
                    className="w-full bg-[#080808] border border-[#222222] rounded-xl px-3.5 py-2 text-xs text-[#F4F2EC] focus:border-[#D4C7F9] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#F4F2EC]">
                  {userProfile.name || 'Maya Okafor'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium text-[#D4C7F9] bg-[#161324] border border-[#28223B]">
                  Top 5% Partner
                </span>
              </div>

              <div className="text-xs font-mono text-[#8E8C84]">@{userProfile.handle || 'maya'}</div>

              <p className="text-xs sm:text-sm text-[#C8C6BE] leading-relaxed max-w-xl">
                {userProfile.bio ||
                  'Mobile creator. I make short, honest app reviews and get paid when people install.'}
              </p>

              <div className="flex items-center gap-5 text-xs text-[#8E8C84] pt-2 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <i className="ti ti-map-pin text-[#D4C7F9]" /> {locationInput}
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="ti ti-brand-instagram text-[#D4C7F9]" /> {socialInput}
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="ti ti-brand-tiktok text-[#D4C7F9]" /> @{userProfile.handle}.reviews
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="ti ti-brand-youtube text-[#D4C7F9]" /> Maya Tech
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Complimentary Stats & Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#000000] border border-[#161616] rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-[#8E8C84]">Attributed Installs</div>
          <div className="font-serif text-2xl font-medium text-[#F4F2EC] mt-1 tabular-nums">
            1,420
          </div>
          <div className="text-[11px] text-[#B8EBD0] mt-1">Verified physical devices</div>
        </div>

        <div className="bg-[#000000] border border-[#161616] rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-[#8E8C84]">Total Creator Revenue</div>
          <div className="font-serif text-2xl font-medium text-[#F4F2EC] mt-1 tabular-nums">
            $1,820.50
          </div>
          <div className="text-[11px] text-[#B8EBD0] mt-1">Settled on schedule</div>
        </div>

        <div className="bg-[#000000] border border-[#161616] rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-[#8E8C84]">Verification Accuracy</div>
          <div className="font-serif text-2xl font-medium text-[#F4F2EC] mt-1 tabular-nums">
            99.2%
          </div>
          <div className="text-[11px] text-[#D4C7F9] mt-1">Zero fraud flags recorded</div>
        </div>

        <div className="bg-[#000000] border border-[#161616] rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-[#8E8C84]">Active Campaigns</div>
          <div className="font-serif text-2xl font-medium text-[#F4F2EC] mt-1 tabular-nums">
            4 Active
          </div>
          <div className="text-[11px] text-[#8E8C84] mt-1">Attribution deep links live</div>
        </div>
      </div>

      {/* Complimentary Active Partnerships & Payout Account */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Partnerships List */}
        <div className="bg-[#000000] border border-[#161616] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#161616]">
            <div>
              <h2 className="font-serif text-base font-medium text-[#F4F2EC]">
                Active Partnerships
              </h2>
              <div className="text-xs text-[#8E8C84] mt-0.5">Campaigns you have joined</div>
            </div>
            <button
              onClick={() => navigate('campaigns')}
              className="text-xs text-[#D4C7F9] hover:underline cursor-pointer"
            >
              Browse more
            </button>
          </div>

          <div className="space-y-3">
            {campaigns.slice(0, 3).map(c => (
              <div
                key={c.id}
                onClick={() => navigate('campaign', c.id)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#080808] border border-[#161616] hover:border-[#262626] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: c.bg, color: c.fg }}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-base"
                  >
                    <i className={`ti ${c.ic}`} />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#F4F2EC]">{c.name}</div>
                    <div className="text-[11px] text-[#8E8C84]">
                      ${c.price} per install · umi.link/{c.id}-mo
                    </div>
                  </div>
                </div>
                <i className="ti ti-chevron-right text-xs text-[#55534E]" />
              </div>
            ))}
          </div>
        </div>

        {/* Linked Payout Methods & Tax Status */}
        <div className="bg-[#000000] border border-[#161616] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#161616]">
            <div>
              <h2 className="font-serif text-base font-medium text-[#F4F2EC]">
                Connected Payouts
              </h2>
              <div className="text-xs text-[#8E8C84] mt-0.5">Stripe Express &amp; Direct Deposit</div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#B8EBD0]">
              <i className="ti ti-check" /> Active
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080808] border border-[#161616] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8E8C84]">Default Bank</span>
              <span className="font-medium text-[#F4F2EC]">Chase Checking (•••• 4821)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8E8C84]">Settlement Cadence</span>
              <span className="text-[#B8EBD0]">Every Friday, 9:00 AM UTC</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8E8C84]">1099 Tax Profile</span>
              <span className="text-[#F4F2EC]">W-9 On File (Verified)</span>
            </div>
          </div>

          <div className="text-xs text-[#8E8C84] pt-1">
            Settlement transfers are automatically sent to your linked bank account every Friday once
            your balance reaches the $50 minimum threshold.
          </div>
        </div>
      </div>
    </div>
  );
}

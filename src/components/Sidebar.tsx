import React from 'react';
import { UmiPetal } from './UmiGraphic';
import { useApp } from '../context/AppContext';

export function Sidebar() {
  const {
    currentScreen,
    overlay,
    navigate,
    openOverlay,
    unreadNotificationsCount,
    userProfile,
  } = useApp();

  const isCampaignsActive =
    !overlay && ['campaigns', 'campaign', 'create', 'manager'].includes(currentScreen);
  const isSearchActive = !overlay && currentScreen === 'search';
  const isEarningsActive = !overlay && currentScreen === 'earnings';
  const isProfileActive = !overlay && currentScreen === 'profile';

  const userInitial = (userProfile.name || 'Maya')[0].toUpperCase();

  return (
    <aside
      className="hidden md:flex flex-col w-[56px] xl:w-[216px] shrink-0 border-r border-[#161616] bg-[#000000] p-2 xl:p-3 text-[#B8B6AE] select-none h-screen sticky top-0 z-30 transition-all duration-200"
      aria-label="Main Navigation"
    >
      {/* Brand logo & wordmark */}
      <button
        onClick={() => navigate('campaigns')}
        className="flex items-center gap-3 px-2 xl:px-3 py-3 mb-3 text-left hover:opacity-90 transition-opacity justify-center xl:justify-start cursor-pointer"
        aria-label="umi home"
      >
        <UmiPetal size={28} />
        <span className="hidden xl:inline font-serif text-[22px] tracking-tight font-medium text-[#F4F2EC]">
          umi
        </span>
      </button>

      {/* Primary Navigation Links (Campaigns, Search, Notifications, Earnings, Profile) */}
      <div className="flex flex-col gap-1.5">
        <button
          onClick={() => navigate('campaigns')}
          title="Campaigns"
          className={`flex items-center gap-3 px-2.5 xl:px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors text-left justify-center xl:justify-start cursor-pointer ${
            isCampaignsActive
              ? 'bg-[#121212] text-[#F4F2EC] border border-[#1f1f1f]'
              : 'hover:bg-[#0c0c0c] hover:text-[#F4F2EC] border border-transparent'
          }`}
        >
          <i className="ti ti-speakerphone text-[19px] shrink-0" />
          <span className="hidden xl:inline">Campaigns</span>
        </button>

        <button
          onClick={() => navigate('search')}
          title="Search"
          className={`flex items-center gap-3 px-2.5 xl:px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors text-left justify-center xl:justify-start cursor-pointer ${
            isSearchActive
              ? 'bg-[#121212] text-[#F4F2EC] border border-[#1f1f1f]'
              : 'hover:bg-[#0c0c0c] hover:text-[#F4F2EC] border border-transparent'
          }`}
        >
          <i className="ti ti-search text-[19px] shrink-0" />
          <span className="hidden xl:inline">Search</span>
        </button>

        <button
          onClick={() => openOverlay(overlay === 'notif' ? null : 'notif')}
          title="Notifications"
          className={`flex items-center justify-between px-2.5 xl:px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors text-left relative justify-center xl:justify-between cursor-pointer ${
            overlay === 'notif'
              ? 'bg-[#121212] text-[#F4F2EC] border border-[#1f1f1f]'
              : 'hover:bg-[#0c0c0c] hover:text-[#F4F2EC] border border-transparent'
          }`}
        >
          <div className="flex items-center gap-3">
            <i className="ti ti-bell text-[19px] shrink-0" />
            <span className="hidden xl:inline">Notifications</span>
          </div>
          {unreadNotificationsCount > 0 && (
            <span
              className="w-2 h-2 rounded-full bg-[#D4C7F9] shrink-0 absolute top-2.5 right-2.5 xl:static shadow-[0_0_8px_rgba(212,199,249,0.5)]"
              aria-label={`${unreadNotificationsCount} new notifications`}
            />
          )}
        </button>

        <button
          onClick={() => navigate('earnings')}
          title="Earnings"
          className={`flex items-center gap-3 px-2.5 xl:px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors text-left justify-center xl:justify-start cursor-pointer ${
            isEarningsActive
              ? 'bg-[#121212] text-[#F4F2EC] border border-[#1f1f1f]'
              : 'hover:bg-[#0c0c0c] hover:text-[#F4F2EC] border border-transparent'
          }`}
        >
          <i className="ti ti-coin text-[19px] shrink-0" />
          <span className="hidden xl:inline">Earnings</span>
        </button>

        <button
          onClick={() => navigate('profile')}
          title="Profile"
          className={`flex items-center gap-3 px-2.5 xl:px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors text-left justify-center xl:justify-start cursor-pointer ${
            isProfileActive
              ? 'bg-[#121212] text-[#F4F2EC] border border-[#1f1f1f]'
              : 'hover:bg-[#0c0c0c] hover:text-[#F4F2EC] border border-transparent'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-[#D4C7F9] text-black font-semibold text-[11px] flex items-center justify-center shrink-0">
            {userInitial}
          </span>
          <span className="hidden xl:inline">Profile</span>
        </button>
      </div>

      {/* Spacer to push bottom items down */}
      <div className="flex-1" />

      {/* Bottom Pinned More Button */}
      <div className="pt-2 border-t border-[#161616]">
        <button
          onClick={() => openOverlay(overlay === 'more' ? null : 'more')}
          title="More options"
          className={`w-full flex items-center gap-3 px-2.5 xl:px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors text-left justify-center xl:justify-start cursor-pointer ${
            overlay === 'more'
              ? 'bg-[#121212] text-[#F4F2EC] border border-[#1f1f1f]'
              : 'hover:bg-[#0c0c0c] hover:text-[#F4F2EC] border border-transparent'
          }`}
        >
          <i className="ti ti-menu-2 text-[19px] shrink-0" />
          <span className="hidden xl:inline">More</span>
        </button>
      </div>
    </aside>
  );
}

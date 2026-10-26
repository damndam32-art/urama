import React from 'react';
import { useApp } from '../context/AppContext';

export function MobileNav() {
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
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center bg-[#000000] border-t border-[#161616] px-1 py-1.5 text-[#8E8C84] select-none"
      aria-label="Mobile Navigation"
    >
      <button
        onClick={() => navigate('campaigns')}
        className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2 transition-colors cursor-pointer ${
          isCampaignsActive ? 'text-[#F4F2EC] font-medium' : 'hover:text-[#F4F2EC]'
        }`}
      >
        <i className="ti ti-speakerphone text-[19px]" />
        <span>Campaigns</span>
      </button>

      <button
        onClick={() => navigate('search')}
        className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2 transition-colors cursor-pointer ${
          isSearchActive ? 'text-[#F4F2EC] font-medium' : 'hover:text-[#F4F2EC]'
        }`}
      >
        <i className="ti ti-search text-[19px]" />
        <span>Search</span>
      </button>

      <button
        onClick={() => navigate('earnings')}
        className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2 transition-colors cursor-pointer ${
          isEarningsActive ? 'text-[#F4F2EC] font-medium' : 'hover:text-[#F4F2EC]'
        }`}
      >
        <i className="ti ti-coin text-[19px]" />
        <span>Earnings</span>
      </button>

      <button
        onClick={() => openOverlay(overlay === 'notif' ? null : 'notif')}
        className={`relative flex flex-col items-center gap-0.5 text-[10px] py-1 px-2 transition-colors cursor-pointer ${
          overlay === 'notif' ? 'text-[#F4F2EC] font-medium' : 'hover:text-[#F4F2EC]'
        }`}
      >
        <i className="ti ti-bell text-[19px]" />
        <span>Alerts</span>
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-[#D4C7F9] shadow-[0_0_6px_rgba(212,199,249,0.6)]" />
        )}
      </button>

      <button
        onClick={() => navigate('profile')}
        className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2 transition-colors cursor-pointer ${
          isProfileActive ? 'text-[#F4F2EC] font-medium' : 'hover:text-[#F4F2EC]'
        }`}
      >
        <span className="w-5 h-5 rounded-full bg-[#D4C7F9] text-black font-semibold text-[10px] flex items-center justify-center shrink-0">
          {userInitial}
        </span>
        <span>Profile</span>
      </button>
    </nav>
  );
}

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';

export function SearchView() {
  const { campaigns, joinedMap, navigate } = useApp();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Photo', 'Productivity', 'Finance', 'Health', 'Social', 'Games'];

  const filteredCampaigns = useMemo(() => {
    const q = query.trim().toLowerCase();
    return campaigns.filter(c => {
      const matchesCategory =
        selectedCategory === 'all' ||
        c.cat.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.b.toLowerCase().includes(q) ||
        c.cat.toLowerCase().includes(q) ||
        c.d.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [campaigns, query, selectedCategory]);

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
            <i className="ti ti-search text-[14px] text-[#D4C7F9]" />
            <span>Search</span>
          </span>
        </nav>

        <span className="text-xs text-[#8E8C84]">{filteredCampaigns.length} campaigns found</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#F4F2EC] tracking-tight">
          Search
        </h1>
        <div className="text-xs text-[#8E8C84] mt-1">
          Explore verified app partnerships, software studios, and categories
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8C84] text-lg pointer-events-none">
          <i className="ti ti-search" />
        </div>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search campaigns, companies, or categories..."
          autoFocus
          className="w-full bg-[#000000] border border-[#161616] rounded-2xl pl-12 pr-10 py-3.5 text-sm sm:text-base text-[#F4F2EC] placeholder-[#55534E] focus:outline-none focus:border-[#D4C7F9] shadow-xl transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8E8C84] hover:text-[#F4F2EC] p-1 cursor-pointer"
          >
            <i className="ti ti-x text-sm" />
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
        {categories.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#141414] text-[#F4F2EC] border border-[#2e2e2e]'
                  : 'bg-[#000000] text-[#8E8C84] border border-[#161616] hover:border-[#222222] hover:text-[#F4F2EC]'
              }`}
            >
              {cat === 'all' ? 'All categories' : cat}
            </button>
          );
        })}
      </div>

      {/* Results List */}
      <div className="space-y-3 pt-2">
        {filteredCampaigns.length > 0 ? (
          filteredCampaigns.map(c => {
            const joinStatusNum = joinedMap[c.id] || 0;
            const isMine = Boolean(c.mine);

            return (
              <div
                key={c.id}
                onClick={() => navigate('campaign', c.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#000000] border border-[#161616] hover:border-[#262626] hover:bg-[#050505] transition-all cursor-pointer gap-4 group shadow-sm"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Tile */}
                  <div
                    style={{ backgroundColor: c.bg, color: c.fg }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm"
                  >
                    <i className={`ti ${c.ic}`} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#F4F2EC] group-hover:text-[#D4C7F9] transition-colors truncate">
                        {c.name}
                      </span>
                      <i className="ti ti-rosette-discount-check text-[#D4C7F9] text-sm shrink-0" />
                    </div>

                    <div className="text-xs text-[#8E8C84] mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>{c.b}</span>
                      <span>·</span>
                      <span>{c.cat}</span>
                      <span>·</span>
                      <span className="text-[#F4F2EC] font-mono tabular-nums">
                        ${c.price} per install
                      </span>
                    </div>

                    <div className="text-xs text-[#6E6C66] line-clamp-1 mt-1 max-w-xl">
                      {c.d}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  {isMine ? (
                    <span className="text-[11px] font-medium text-[#D4C7F9] bg-[#161324] border border-[#28223B] px-2.5 py-1 rounded-full">
                      HOSTING
                    </span>
                  ) : joinStatusNum === 2 ? (
                    <span className="text-[11px] font-medium text-[#B8EBD0] bg-[#0c1e14] border border-[#183a27] px-2.5 py-1 rounded-full">
                      JOINED
                    </span>
                  ) : joinStatusNum === 1 ? (
                    <span className="text-[11px] font-medium text-[#FBE4B5] bg-[#1c190d] border border-[#383018] px-2.5 py-1 rounded-full">
                      PENDING
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-[#B8EBD0] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B8EBD0]" />
                      OPEN
                    </span>
                  )}

                  <i className="ti ti-chevron-right text-xs text-[#55534E] group-hover:text-[#F4F2EC] transition-colors" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#000000] border border-[#161616] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#0a0a0a] text-[#8E8C84] flex items-center justify-center text-xl mx-auto border border-[#161616]">
              <i className="ti ti-search" />
            </div>
            <div className="font-serif text-lg text-[#F4F2EC]">No campaigns found</div>
            <p className="text-xs text-[#8E8C84] max-w-sm mx-auto">
              Nothing matches &ldquo;{query}&rdquo; in {selectedCategory} category. Try searching
              for &ldquo;Photo&rdquo;, &ldquo;Notes&rdquo;, or &ldquo;Loop&rdquo;.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-1.5 rounded-full text-xs font-medium bg-[#141414] border border-[#222222] text-[#F4F2EC] hover:bg-[#1a1a1a] transition-all cursor-pointer mt-2 inline-block"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

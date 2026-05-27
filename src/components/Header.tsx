/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChevronLeft, Share2 } from "lucide-react";

interface HeaderProps {
  title: string;
  onBack?: () => void;
  onShare?: () => void;
  showBack?: boolean;
}

export default function Header({ title, onBack, onShare, showBack = true }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 flex justify-between items-center w-full px-4 h-16 sticky top-0 z-40 shadow-xs">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={onBack}
            className="hover:bg-gray-100 active:scale-95 transition-all p-2 rounded-full text-blue-900"
            title="Quay lại"
            id="header-back-btn"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}
        <h1 className="font-semibold text-lg md:text-xl text-blue-900 leading-tight truncate max-w-[240px] md:max-w-xs">
          {title}
        </h1>
      </div>
      
      {onShare && (
        <button
          onClick={onShare}
          className="hover:bg-gray-100 active:scale-95 transition-all p-2 rounded-full text-gray-500"
          title="Chia sẻ"
          id="header-share-btn"
        >
          <Share2 className="w-5 h-5" />
        </button>
      )}
    </header>
  );
}

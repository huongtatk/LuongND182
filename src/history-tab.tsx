/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SalaryCalculationResult } from "./types";
import { formatVND } from "./data";
import { Trash2, ArrowRightLeft, Calendar, FileCheck, HelpCircle } from "lucide-react";

interface HistoryTabProps {
  historyList: SalaryCalculationResult[];
  onSelect: (result: SalaryCalculationResult) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function HistoryTab({ historyList, onSelect, onDelete, onClearAll }: HistoryTabProps) {
  
  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-5" id="history-tab">
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-sm font-bold text-gray-400 tracking-wider uppercase">
            Lịch sử tra cứu của bạn
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Các kết quả ghi nhớ được lưu trữ trên trình duyệt</p>
        </div>
        {historyList.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-red-600 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100/70 px-3 py-1.5 rounded-lg border border-red-100 transition-all cursor-pointer"
            id="clear-all-history-btn"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {historyList.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center flex flex-col items-center justify-center space-y-4 shadow-xs" id="empty-history-alert">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-900 border border-blue-100 flex items-center justify-center">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-gray-800 text-base">Chưa có bản ghi nào</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Khi thực hiện phép tính lương, nhấn nút <b className="text-blue-900">Lưu kết quả</b> để ghi lại và so sánh tại đây.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3" id="history-items-list">
          {historyList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:border-blue-900 transition-all overflow-hidden flex flex-col"
              id={`history-item-${item.id}`}
            >
              {/* Card top */}
              <div className="p-4 flex justify-between items-start gap-3">
                <div className="space-y-1 max-w-[70%]">
                  <span className="inline-block text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-sm">
                    Hệ số: {item.input.coeff}
                  </span>
                  <h3 className="font-bold text-[15px] text-gray-800 line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(item.timestamp)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">THỰC LĨNH</span>
                  <p className="text-[16px] font-extrabold text-blue-900">
                    {formatVND(item.netSalary)} đ
                  </p>
                </div>
              </div>

              {/* Card actions footer */}
              <div className="bg-gray-50/70 border-t border-gray-100 px-4 py-2.5 flex justify-between gap-2">
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-xs text-gray-500 hover:text-red-700 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Xóa bản ghi"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa</span>
                </button>

                <button
                  onClick={() => onSelect(item)}
                  className="text-xs text-blue-900 font-bold flex items-center gap-1 hover:underline transition-all cursor-pointer"
                >
                  <span>Xem chi tiết</span>
                  <FileCheck className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

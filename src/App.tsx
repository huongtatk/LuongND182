/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Header from "./components/Header";
import SalaryCalculatorForm from "./components/SalaryCalculatorForm";
import SalaryDetailsView from "./components/SalaryDetailsView";
import HistoryTab from "./history-tab";
import InfoTab from "./components/InfoTab";
import { calculateSalary } from "./data";
import { SalaryCalculationResult, SalaryCalculationInput } from "./types";
import { Calculator, History, Info as InfoIcon } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "history" | "info">("home");
  const [historyList, setHistoryList] = useState<SalaryCalculationResult[]>([]);
  
  // Set default pre-calculated details matching the screenshot on system boot
  const defaultInput: SalaryCalculationInput = {
    profileId: "giao-vien-tiep-hoc-iii",
    baseSalary: 2340000,
    coeff: 2.34,
    positionCoeff: 0,
    overgradeSeniorityRate: 0,
    professionalAllowanceRate: 35,
    seniorityYears: 5,
    hasSeniority: false,
    publicServiceRate: 0,
    regionAllowanceValue: 0,
    otherAllowancesValue: 0, // Prefilled to 0 as default
    insuranceRate: 10.5
  };
  
  const [activeResult, setActiveResult] = useState<SalaryCalculationResult | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("salary_calc_history");
      if (stored) {
        setHistoryList(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Lỗi lấy lịch sử tính lương:", e);
    }
  }, []);

  const handleCalculate = (result: SalaryCalculationResult) => {
    setActiveResult(result);
  };

  const handleSaveResult = (result: SalaryCalculationResult) => {
    // Check if double saved
    if (historyList.some((item) => item.id === result.id)) return;
    
    const updated = [result, ...historyList];
    setHistoryList(updated);
    try {
      localStorage.setItem("salary_calc_history", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteHistory = (id: string) => {
    const updated = historyList.filter((item) => item.id !== id);
    setHistoryList(updated);
    try {
      localStorage.setItem("salary_calc_history", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ bản ghi lịch sử?")) {
      setHistoryList([]);
      try {
        localStorage.removeItem("salary_calc_history");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleLoadHistoryItem = (item: SalaryCalculationResult) => {
    setActiveResult(item);
    setActiveTab("home");
  };

  // Compute Active Application Header Title
  let headerTitle = "Tính Lương Cán Bộ";
  if (activeTab === "home") {
    headerTitle = activeResult ? "Chi Tiết Bảng Lương" : "Tra Cứu Hệ Số Lương";
  } else if (activeTab === "history") {
    headerTitle = "Bản Ghi Lịch Sử";
  } else if (activeTab === "info") {
    headerTitle = "Thông Tin & Tư Vấn";
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col antialiased text-gray-800 font-sans" id="app-wrapper">
      
      {/* Dynamic Header */}
      <Header
        title={headerTitle}
        showBack={activeTab === "home" && activeResult !== null}
        onBack={() => {
          if (activeTab === "home" && activeResult) {
            setActiveResult(null); // Return to inputs form
          }
        }}
        onShare={activeTab === "home" && activeResult ? () => {} : undefined} // Handled within Details view, or can trigger the details share
      />

      {/* Main Container */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 pt-5 pb-32">
        
        {activeTab === "home" && (
          <div className="space-y-4">
            {activeResult ? (
              <SalaryDetailsView
                result={activeResult}
                onSave={handleSaveResult}
                onBackToCalculator={() => setActiveResult(null)}
              />
            ) : (
              <div className="space-y-4">
                <div className="px-1">
                  <h2 className="text-xl font-black text-blue-900 tracking-tight">Tính Lương Nghị Định 182</h2>
                  <p className="text-xs text-gray-500 mt-1">Hệ thống mô phỏng thu nhập thực lĩnh cho công chức và viên chức</p>
                </div>
                <SalaryCalculatorForm 
                  onCalculate={handleCalculate}
                  initialInput={activeResult?.input}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <HistoryTab
            historyList={historyList}
            onSelect={handleLoadHistoryItem}
            onDelete={handleDeleteHistory}
            onClearAll={handleClearAllHistory}
          />
        )}

        {activeTab === "info" && (
          <InfoTab />
        )}

      </main>

      {/* Bottom Administrative Tab Navigation matching original design details */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-250 py-2.5 shadow-lg max-w-xl mx-auto rounded-t-2xl">
        <div className="flex justify-around items-center px-4">
          
          {/* Tab 1: Home Calculator */}
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all cursor-pointer ${
              activeTab === "home"
                ? "text-blue-900 font-bold bg-blue-50"
                : "text-gray-400 hover:text-gray-600 font-medium"
            }`}
            id="nav-home-tab"
          >
            <Calculator className="w-5.5 h-5.5" />
            <span className="text-[10px] tracking-wider uppercase">Trang chủ</span>
          </button>

          {/* Tab 2: Saved records feed */}
          <button
            onClick={() => setActiveTab("history")}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all cursor-pointer ${
              activeTab === "history"
                ? "text-blue-900 font-bold bg-blue-50"
                : "text-gray-400 hover:text-gray-600 font-medium"
            }`}
            id="nav-history-tab"
          >
            <History className="w-5.5 h-5.5" />
            <span className="text-[10px] tracking-wider uppercase">Lịch sử</span>
          </button>

          {/* Tab 3: Policy documents & Gemini Assistant */}
          <button
            onClick={() => setActiveTab("info")}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all cursor-pointer ${
              activeTab === "info"
                ? "text-blue-900 font-bold bg-blue-50"
                : "text-gray-400 hover:text-gray-600 font-medium"
            }`}
            id="nav-info-tab"
          >
            <InfoIcon className="w-5.5 h-5.5" />
            <span className="text-[10px] tracking-wider uppercase">Thông tin</span>
          </button>

        </div>
      </nav>

      {/* Light elegant blurred background accents */}
      <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none -z-10 overflow-hidden opacity-10">
        <div className="absolute top-[15%] right-[-10%] w-80 h-80 bg-blue-900 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[-15%] w-96 h-96 bg-sky-600 rounded-full blur-3xl"></div>
      </div>

    </div>
  );
}

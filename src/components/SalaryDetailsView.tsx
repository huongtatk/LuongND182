/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { SalaryCalculationResult, SalaryCalculationInput } from "../types";
import { formatVND } from "../data";
import { 
  BadgeCheck, 
  Coins, 
  GraduationCap, 
  History, 
  ShieldAlert, 
  Info, 
  Save, 
  Share2, 
  Check, 
  CircleDollarSign,
  MapPin,
  ClipboardList,
  ArrowLeft
} from "lucide-react";

interface SalaryDetailsViewProps {
  result: SalaryCalculationResult;
  onSave: (result: SalaryCalculationResult) => void;
  onBackToCalculator: () => void;
}

export default function SalaryDetailsView({ result, onSave, onBackToCalculator }: SalaryDetailsViewProps) {
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  const {
    basicSalary,
    professionalAllowance,
    seniorityAllowance,
    publicServiceAllowance,
    regionAllowance,
    otherAllowances,
    grossSalary,
    insuranceDeduction,
    netSalary,
    input
  } = result;

  const handleSaveClick = () => {
    onSave(result);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleShareClick = () => {
    // Generate brief summary
    const optionsTextParts = [];
    optionsTextParts.push(`Hệ số gốc: ${input.coeff}`);
    if (input.positionCoeff) {
      optionsTextParts.push(`Chức vụ: ${input.positionCoeff}`);
    }
    if (input.overgradeSeniorityRate) {
      optionsTextParts.push(`Vượt khung: ${input.overgradeSeniorityRate}%`);
    }
    const coeffDetails = optionsTextParts.join(", ");
    const summary = `📊 BẢNG CHI TIẾT LƯƠNG CÔNG CHỨC NGHỊ ĐỊNH 182
📌 Đối tượng: ${result.title}
----------------------------------------
- Lương hệ số (${coeffDetails}): ${formatVND(basicSalary)} đ
- Phụ cấp ưu đãi nghề (${input.professionalAllowanceRate}%): ${formatVND(professionalAllowance)} đ
${input.hasSeniority ? `- Phụ cấp thâm niên (${input.seniorityYears} năm): ${formatVND(seniorityAllowance)} đ\n` : ""}${input.publicServiceRate > 0 ? `- Phụ cấp công vụ (${input.publicServiceRate}%): ${formatVND(publicServiceAllowance)} đ\n` : ""}${regionAllowance > 0 ? `- Phụ cấp khu vực: ${formatVND(regionAllowance)} đ\n` : ""}${otherAllowances > 0 ? `- Phụ cấp khác: ${formatVND(otherAllowances)} đ\n` : ""}- Khấu trừ bảo hiểm (${input.insuranceRate}%): -${formatVND(insuranceDeduction)} đ
----------------------------------------
💰 TỔNG CỘNG THỰC LĨNH: ${formatVND(netSalary)} VNĐ
Dự toán căn cứ theo Dự thảo Nghị định 182/2026/NĐ-CP.`;

    navigator.clipboard.writeText(summary);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  // Setup circle parameters
  // Circle radius 88, circumference = 2 * PI * r = 552.9
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  // Let the percentage sweep represent the basic salary to gross salary ratio or fixed 75% for aesthetics
  const ratio = grossSalary > 0 ? (basicSalary / grossSalary) : 0.7;
  const strokeDashoffset = circumference - ratio * circumference;

  return (
    <div className="space-y-6" id="salary-details-view">
      {/* 1. Summary Highlight Card */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden" id="summary-hightlight-card">
        {/* Blue top line */}
        <div className="h-1 bg-cyan-750 w-full" style={{ backgroundColor: "#1A5276" }}></div>
        <div className="p-6 flex flex-col items-center text-center">
          
          {/* Circular Chart Gauge */}
          <div className="relative w-48 h-48 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              {/* Outer track */}
              <circle
                cx="96"
                cy="96"
                fill="transparent"
                r={radius}
                stroke="#E9ECEF"
                strokeWidth="12"
              />
              {/* Inner active sweep */}
              <circle
                cx="96"
                cy="96"
                fill="transparent"
                r={radius}
                stroke="#1A5276"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="12"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[11px] font-semibold text-gray-500 tracking-widest uppercase">
                TỔNG THU NHẬP
              </span>
              <div className="text-2xl font-bold text-blue-900 mt-1" id="total-revenue-lbl">
                {formatVND(grossSalary)}
              </div>
              <span className="text-xs font-bold text-gray-500 mt-0.5">VNĐ</span>
            </div>
          </div>

          {/* Verified tag */}
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 px-3.5 py-1.5 rounded-full border border-blue-200 shadow-xs">
            <BadgeCheck className="w-4 h-4 text-blue-900" />
            <span className="text-xs font-semibold">Dự kiến Nghị định 182/2026</span>
          </div>
        </div>
      </section>

      {/* 2. Breakdown Cards List */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-gray-400 tracking-wider uppercase ml-1">
          Chi tiết các khoản
        </h2>
        
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
          
          {/* Item 1 - Lương theo hệ số */}
          <div className="p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#003b5a] font-semibold">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Lương theo hệ số (Thực hưởng)</p>
                <p className="text-xs text-gray-500 font-mono">
                  {formatVND(input.baseSalary)}đ × ({input.coeff} {input.positionCoeff ? `+ ${input.positionCoeff} (chức vụ)` : ""} + {input.overgradeSeniorityRate || 0}% vượt khung × {input.coeff})
                </p>
              </div>
            </div>
            <p className="text-sm md:text-base font-extrabold text-[#003b5a]">
              {formatVND(basicSalary)} <span className="text-[11px] font-normal opacity-70">đ</span>
            </p>
          </div>

          {/* Item 2 - Phụ cấp ưu đãi nghề */}
          <div className="p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center" style={{ color: "#006497" }}>
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Phụ cấp ưu đãi nghề</p>
                <p className="text-xs text-gray-500">Tỷ lệ {input.professionalAllowanceRate}%</p>
              </div>
            </div>
            <p className="text-sm md:text-base font-extrabold text-gray-800">
              {formatVND(professionalAllowance)} <span className="text-[11px] font-normal opacity-70">đ</span>
            </p>
          </div>

          {/* Item 3 - Phụ cấp thâm niên (Show only if hasSeniority true) */}
          {input.hasSeniority && (
            <div className="p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center" style={{ color: "#735c00" }}>
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Phụ cấp thâm niên nghề</p>
                  <p className="text-xs text-gray-500">Thâm thâm niên {input.seniorityYears}% ({input.seniorityYears} năm)</p>
                </div>
              </div>
              <p className="text-sm md:text-base font-extrabold text-gray-800">
                {formatVND(seniorityAllowance)} <span className="text-[11px] font-normal opacity-70">đ</span>
              </p>
            </div>
          )}

          {/* Item 3.5 - Phụ cấp công vụ (Show only if input.publicServiceRate > 0) */}
          {input.publicServiceRate > 0 && (
            <div className="p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center" style={{ color: "#0e4b6e" }}>
                  <CircleDollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Phụ cấp công vụ</p>
                  <p className="text-xs text-gray-500">Tỷ lệ {input.publicServiceRate}% lương hệ số</p>
                </div>
              </div>
              <p className="text-sm md:text-base font-extrabold text-gray-800">
                {formatVND(publicServiceAllowance)} <span className="text-[11px] font-normal opacity-70">đ</span>
              </p>
            </div>
          )}

          {/* Item 3.6 - Phụ cấp khu vực (Show only if regionAllowance > 0) */}
          {regionAllowance > 0 && (
            <div className="p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center" style={{ color: "#2f6388" }}>
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Phụ cấp khu vực</p>
                  <p className="text-xs text-gray-500">Độ rộng theo khu vực địa giới</p>
                </div>
              </div>
              <p className="text-sm md:text-base font-extrabold text-gray-800">
                {formatVND(regionAllowance)} <span className="text-[11px] font-normal opacity-70">đ</span>
              </p>
            </div>
          )}

          {/* Item 3.7 - Phụ cấp khác (Show only if otherAllowances > 0) */}
          {otherAllowances > 0 && (
            <div className="p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center" style={{ color: "#574500" }}>
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Phụ cấp khác / Đặc thù</p>
                  <p className="text-xs text-gray-500">Phụ cấp thâm niên vượt khung, thâm niên khác</p>
                </div>
              </div>
              <p className="text-sm md:text-base font-extrabold text-gray-800">
                {formatVND(otherAllowances)} <span className="text-[11px] font-normal opacity-70">đ</span>
              </p>
            </div>
          )}

          {/* Item 4 - Các khoản bảo hiểm */}
          <div className="p-4 flex justify-between items-center hover:bg-red-50/20 transition-colors bg-red-50/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-700">Các khoản bảo hiểm</p>
                <p className="text-xs text-red-500">Trừ {input.insuranceRate}% (BHXH, BHYT, BHTN)</p>
              </div>
            </div>
            <p className="text-sm md:text-base font-extrabold text-red-600">
              -{formatVND(insuranceDeduction)} <span className="text-[11px] font-normal opacity-70">đ</span>
            </p>
          </div>

          {/* Computed Net Income Card */}
          <div className="p-4 flex justify-between items-center bg-blue-50/50 transition-colors">
            <span className="text-sm font-bold text-blue-900 border-l-4 border-blue-900 pl-2">
              THỰC LĨNH HOÀN TOÀN (NET)
            </span>
            <span className="text-base md:text-lg font-black text-blue-900" id="net-salary-lbl">
              {formatVND(netSalary)} đ
            </span>
          </div>

        </div>
      </section>

      {/* 4. Information Info section */}
      <section className="bg-gray-100 rounded-2xl p-4 border border-gray-200 flex gap-3">
        <div className="text-blue-900 pt-0.5" style={{ color: "#1A5276" }}>
          <Info className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-blue-900 uppercase">Thông tin thêm</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-normal">
            Bảng tính này được xây dựng dựa trên dự thảo căn cứ theo <span className="font-bold text-gray-700">Nghị định 182/2026/NĐ-CP</span> về cải cách tiền lương đối với cán bộ, công chức, viên chức và lực lượng vũ trang. Kết quả có tính chất tham khảo.
          </p>
        </div>
      </section>

      {/* 5. Trigger buttons */}
      <div className="flex flex-col gap-3 pt-2">
        <button
          onClick={onBackToCalculator}
          className="w-full py-4 bg-gray-150 text-gray-700 font-bold rounded-xl transition-all border border-gray-200 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-200 active:scale-98"
          id="back-to-calculator-view-btn"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại chỉnh sửa tham số đầu vào
        </button>

        <button
          onClick={handleSaveClick}
          className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 ${
            saved 
              ? "bg-emerald-600 text-white" 
              : "bg-blue-900 text-white hover:bg-blue-950"
          }`}
          id="save-result-btn"
        >
          {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {saved ? "Đã lưu thành công" : "Lưu kết quả"}
        </button>

        <button
          onClick={handleShareClick}
          className={`w-full border py-4 rounded-xl font-semibold transition-all flex items-center justify-semibold gap-2 cursor-pointer active:scale-98 ${
            shared
              ? "bg-emerald-50 border-emerald-400 text-emerald-700"
              : "bg-white border-blue-900 text-blue-900 hover:bg-gray-50"
          }`}
          id="share-result-btn"
        >
          {shared ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
          {shared ? "Đã sao chép chi tiết vào khay nhớ" : "Chia sẻ với đồng nghiệp"}
        </button>
      </div>
    </div>
  );
}

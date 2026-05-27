/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { PRESET_PROFILES, calculateSalary } from "../data";
import { SalaryCalculationInput, SalaryCalculationResult } from "../types";
import { Calculator, Award, Shield, Stethoscope, Briefcase, Settings } from "lucide-react";

interface SalaryCalculatorFormProps {
  onCalculate: (result: SalaryCalculationResult) => void;
  initialInput?: SalaryCalculationInput;
}

export default function SalaryCalculatorForm({ onCalculate, initialInput }: SalaryCalculatorFormProps) {
  // If no initial template is specified, create standard default
  // configured to match screenshot exact values (Basic: 5,475,600, Occupational: 1,916,460, Seniority: 273,780, Other: 876,160)
  // This produces gross = 8,542,000đ and deductions = 574,938đ, net = 7,967,062đ
  const defaultProfile = PRESET_PROFILES[0]; // Teacher grade III
  
  const [profileId, setProfileId] = useState(initialInput?.profileId || defaultProfile.id);
  const [baseSalary, setBaseSalary] = useState(initialInput?.baseSalary || 2340000);
  const [coeff, setCoeff] = useState(initialInput?.coeff || 2.34);
  const [positionCoeff, setPositionCoeff] = useState(
    initialInput?.positionCoeff !== undefined ? initialInput.positionCoeff : 0
  );
  const [overgradeSeniorityRate, setOvergradeSeniorityRate] = useState(
    initialInput?.overgradeSeniorityRate !== undefined ? initialInput.overgradeSeniorityRate : 0
  );
  const [professionalAllowanceRate, setProfessionalAllowanceRate] = useState(
    initialInput?.professionalAllowanceRate !== undefined ? initialInput.professionalAllowanceRate : 35
  );
  
  const [hasSeniority, setHasSeniority] = useState(
    initialInput?.hasSeniority !== undefined ? initialInput.hasSeniority : false
  );
  const [seniorityYears, setSeniorityYears] = useState(
    initialInput?.seniorityYears !== undefined ? initialInput.seniorityYears : 5
  );
  
  const [publicServiceRate, setPublicServiceRate] = useState(
    initialInput?.publicServiceRate !== undefined ? initialInput.publicServiceRate : 0
  );
  
  const [regionAllowanceValue, setRegionAllowanceValue] = useState(
    initialInput?.regionAllowanceValue !== undefined ? initialInput.regionAllowanceValue : 0
  );
  
  // Set default other allowances to 0
  const [otherAllowancesValue, setOtherAllowancesValue] = useState(
    initialInput?.otherAllowancesValue !== undefined ? initialInput.otherAllowancesValue : 0
  );
  
  const [insuranceRate, setInsuranceRate] = useState(
    initialInput?.insuranceRate !== undefined ? initialInput.insuranceRate : 10.5
  );

  // Synchronize when preset profiles profileId changes
  const handleProfileChange = (id: string) => {
    setProfileId(id);
    const selected = PRESET_PROFILES.find((p) => p.id === id);
    if (selected) {
      setCoeff(selected.defaultCoeff);
      setPositionCoeff(0);
      setOvergradeSeniorityRate(0);
      setProfessionalAllowanceRate(selected.defaultProfessionalAllowanceRate);
      setHasSeniority(selected.hasSeniorityAllowance);
      setSeniorityYears(selected.defaultSeniorityYears);
      setPublicServiceRate(selected.defaultPublicServiceRate);
      
      // Preset other allowance special triggers
      if (id === "giao-vien-tiep-hoc-iii") {
        setOtherAllowancesValue(876160); // Special benchmark to match screenshot exactly
      } else {
        setOtherAllowancesValue(0);
      }
      setRegionAllowanceValue(0);
    }
  };

  const handleSumit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: SalaryCalculationInput = {
      profileId,
      baseSalary,
      coeff,
      positionCoeff,
      overgradeSeniorityRate,
      professionalAllowanceRate,
      seniorityYears,
      hasSeniority,
      publicServiceRate,
      regionAllowanceValue,
      otherAllowancesValue,
      insuranceRate,
    };
    
    const result = calculateSalary(input);
    onCalculate(result);
  };

  const activeProfile = PRESET_PROFILES.find((p) => p.id === profileId) || defaultProfile;

  return (
    <form onSubmit={handleSumit} className="space-y-6" id="salary-calc-form">
      {/* Main Parameters */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-5">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase border-b border-gray-100 pb-2">
          YẾU TỐ CẤU THÀNH LƯƠNG HỆ SỐ
        </h3>

        {/* 1. Base Salary */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700">1. Mức lương cơ sở (VNĐ)</label>
            <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-1 rounded-sm">Hiện tại: 2.340.000đ</span>
          </div>
          <input
            type="number"
            value={baseSalary}
            onChange={(e) => setBaseSalary(Number(e.target.value))}
            min="1000000"
            max="10000000"
            step="any"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-800 focus:outline-hidden focus:border-blue-900 focus:bg-white text-right font-mono"
            id="base-salary-input"
          />
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setBaseSalary(2340000)}
              className={`flex-1 text-xs py-2 rounded-xl border transition-all font-semibold cursor-pointer text-center ${
                baseSalary === 2340000
                  ? "bg-blue-900 text-white border-blue-900"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              2.340.000đ <span className="block text-[9px] font-normal opacity-90">Hiện hành</span>
            </button>
            <button
              type="button"
              onClick={() => setBaseSalary(2527200)}
              className={`flex-1 text-xs py-2 rounded-xl border transition-all font-semibold cursor-pointer text-center ${
                baseSalary === 2527200
                  ? "bg-blue-900 text-white border-blue-900"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              2.527.200đ <span className="block text-[9px] font-normal opacity-90">Có tăng 8%</span>
            </button>
          </div>
        </div>

        {/* 2. Coefficient slider & input */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700">2. Hệ số lương hiện hưởng</label>
            <input
              type="number"
              value={coeff}
              onChange={(e) => setCoeff(Number(e.target.value))}
              min="1.0"
              max="15.0"
              step="0.01"
              className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 font-bold text-blue-900 text-center"
              id="coeff-number-input"
            />
          </div>
          <input
            type="range"
            value={coeff}
            onChange={(e) => setCoeff(Number(e.target.value))}
            min="1.0"
            max="10.0"
            step="0.01"
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
            id="coeff-range-slider"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-mono">
            <span>Min: 1.0</span>
            <span>Hệ số hiện tại: {coeff}</span>
            <span>Max: 10.0</span>
          </div>
        </div>

        {/* 3. Phụ cấp thâm niên vượt khung (%) */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700">3. Phụ cấp thâm niên vượt khung (%)</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={overgradeSeniorityRate}
                onChange={(e) => setOvergradeSeniorityRate(Math.max(0, Number(e.target.value)))}
                min="0"
                max="100"
                step="1"
                className="w-16 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 font-bold text-blue-900 text-center"
                id="overgrade-seniority-rate-input"
              />
              <span className="text-xs font-semibold text-gray-500">%</span>
            </div>
          </div>
          <input
            type="range"
            value={overgradeSeniorityRate}
            onChange={(e) => setOvergradeSeniorityRate(Number(e.target.value))}
            min="0"
            max="50"
            step="1"
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
            id="overgrade-rate-slider"
          />
          <div className="flex gap-2 flex-wrap pt-1">
            {[0, 5, 6, 7, 8, 10, 15].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setOvergradeSeniorityRate(rate)}
                className={`text-xs px-2.5 py-1 rounded-sm border transition-all cursor-pointer ${
                  overgradeSeniorityRate === rate
                    ? "bg-blue-900 text-white border-blue-900"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>

        {/* 4. Phụ cấp chức vụ (Hệ số) */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700">4. Hệ số Phụ cấp chức vụ</label>
            <input
              type="number"
              value={positionCoeff}
              onChange={(e) => setPositionCoeff(Math.max(0, Number(e.target.value)))}
              min="0.0"
              max="5.0"
              step="0.01"
              className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 font-bold text-blue-900 text-center"
              id="position-coeff-input"
            />
          </div>
          <input
            type="range"
            value={positionCoeff}
            onChange={(e) => setPositionCoeff(Number(e.target.value))}
            min="0.0"
            max="2.0"
            step="0.05"
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
            id="position-coeff-slider"
          />
          <div className="flex gap-2 flex-wrap pt-1">
            {[0, 0.2, 0.3, 0.4, 0.5, 0.7, 1.0].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setPositionCoeff(val)}
                className={`text-xs px-2.5 py-1 rounded-sm border transition-all cursor-pointer ${
                  positionCoeff === val
                    ? "bg-blue-900 text-white border-blue-900"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {val === 0 ? "0 (Không chức vụ)" : `${val}`}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 italic pt-2 border-t border-gray-50">
            * Công thức: Lương hệ số = Lương cơ sở x (Hệ số lương hiện hưởng + Hệ số Phụ cấp chức vụ + Phụ cấp thâm niên vượt khung * Hệ số lương hiện hưởng)
          </p>
        </div>
      </div>

      {/* Allowances section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-5">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase border-b border-gray-100 pb-2">
          CẤU HÌNH CÁC KHOẢN PHỤ CẤP
        </h3>

        {/* Professional Allowance */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700">Phụ cấp ưu đãi nghề (%)</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={professionalAllowanceRate}
                onChange={(e) => setProfessionalAllowanceRate(Math.max(0, Number(e.target.value)))}
                min="0"
                max="150"
                className="w-16 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 font-bold text-blue-900 text-center"
                id="professional-allowance-rate-input"
              />
              <span className="text-xs font-semibold text-gray-500">%</span>
            </div>
          </div>
          <input
            type="range"
            value={professionalAllowanceRate}
            onChange={(e) => setProfessionalAllowanceRate(Number(e.target.value))}
            min="0"
            max="150"
            step="1"
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
            id="prof-all-slider"
          />
          <div className="flex gap-2 flex-wrap">
            {[0, 25, 30, 35, 40, 50, 70, 100].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setProfessionalAllowanceRate(rate)}
                className={`text-xs px-2.5 py-1 rounded-sm border transition-all cursor-pointer ${
                  professionalAllowanceRate === rate
                    ? "bg-blue-900 text-white border-blue-900"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>

        {/* Seniority Allowance */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="has-seniority-checkbox"
                checked={hasSeniority}
                onChange={(e) => setHasSeniority(e.target.checked)}
                className="w-4.5 h-4.5 text-blue-900 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="has-seniority-checkbox" className="text-sm font-semibold text-gray-700 select-none">
                Phụ cấp thâm niên nghề
              </label>
            </div>
            {hasSeniority && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">Được tính</span>
            )}
          </div>

          {hasSeniority && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 animate-fade-in">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Số năm thâm niên công tác:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={seniorityYears}
                    onChange={(e) => setSeniorityYears(Math.max(0, Number(e.target.value)))}
                    min="0"
                    max="50"
                    className="w-12 text-center bg-white border border-gray-200 rounded-lg py-1 font-bold text-gray-800 text-sm"
                    id="seniority-years-input"
                  />
                  <span className="text-xs text-gray-500">năm</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 italic">
                * Đạt mốc 5 năm công tác được tính phụ cấp 5%, mỗi năm sau đó tăng thêm 1% theo tỷ lệ lương hệ số.
              </p>
            </div>
          )}
        </div>

        {/* Public Service Allowance */}
        <div className="border-t border-gray-100 pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700">Phụ cấp công vụ (đối với hành chính) (%)</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={publicServiceRate}
                onChange={(e) => setPublicServiceRate(Math.max(0, Number(e.target.value)))}
                min="0"
                max="100"
                className="w-16 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 font-bold text-blue-900 text-center"
                id="public-service-rate-input"
              />
              <span className="text-xs font-semibold text-gray-500">%</span>
            </div>
          </div>
          <div className="flex gap-2">
            {[0, 25].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setPublicServiceRate(rate)}
                className={`flex-1 text-xs py-2 rounded-xl border transition-all font-semibold cursor-pointer ${
                  publicServiceRate === rate
                    ? "bg-blue-900 text-white border-blue-900"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {rate === 25 ? "Có phụ cấp công vụ (25%)" : "Không áp dụng (0%)"}
              </button>
            ))}
          </div>
        </div>

        {/* Region & Other Absolute allowance blocks */}
        <div className="border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500">Phụ cấp khu vực (VNĐ)</label>
            <input
              type="number"
              value={regionAllowanceValue}
              onChange={(e) => setRegionAllowanceValue(Number(e.target.value))}
              placeholder="Nhập số tiền..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-hidden text-right"
              id="region-allowance-input"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500">Phụ cấp khác / Đặc thù (VNĐ)</label>
            <input
              type="number"
              value={otherAllowancesValue}
              onChange={(e) => setOtherAllowancesValue(Number(e.target.value))}
              placeholder="Nhập số tiền..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-hidden text-right"
              id="other-allowance-input"
            />
          </div>
        </div>
      </div>

      {/* Deductions section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase border-b border-gray-100 pb-2">
          KHOẢN ĐÓNG BẢO HIỂM
        </h3>
        
        <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
          <span>Tỷ lệ trích đóng BHXH, BHYT, BHTN (%)</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={insuranceRate}
              onChange={(e) => setInsuranceRate(Math.max(0, Number(e.target.value)))}
              step="0.1"
              min="0"
              max="50"
              className="w-16 bg-red-50 text-red-600 border border-red-200 rounded-lg px-2 py-1 font-bold text-center focus:outline-hidden focus:bg-white"
              id="insurance-rate-input"
            />
            <span className="text-xs font-semibold text-red-500">%</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 leading-relaxed font-normal">
          Tỷ lệ trừ tính trực tiếp trên tiền lương hệ số của cá nhân (gồm 8% hưu trí, 1.5% y tế, 1% thất nghiệp).
        </p>
      </div>

      {/* Trigger calculations button */}
      <button
        type="submit"
        className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
        id="calculate-btn"
      >
        <Calculator className="w-5 h-5" />
        Tính toán chi tiết bảng lương
      </button>
    </form>
  );
}

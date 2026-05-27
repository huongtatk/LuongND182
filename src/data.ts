/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CareerProfile, ProfileGroup, SalaryCalculationInput, SalaryCalculationResult } from "./types";

export const DEFAULT_BASE_SALARY = 2340000; // Lương cơ sở dưới Nghị định mới (2,340,000 VNĐ)

export const PRESET_PROFILES: CareerProfile[] = [
  {
    id: "giao-vien-tiep-hoc-iii",
    name: "Giáo viên Tiểu học - Hạng III",
    group: ProfileGroup.TEACHER,
    defaultCoeff: 2.34,
    minCoeff: 2.10,
    maxCoeff: 4.89,
    defaultProfessionalAllowanceRate: 35,
    hasSeniorityAllowance: true,
    defaultSeniorityYears: 5, // 5 năm tương đương 5% thâm niên
    defaultPublicServiceRate: 0,
    description: "Công chức/viên chức giáo dục giảng dạy tiểu học, lương khởi điểm đại học."
  },
  {
    id: "giao-vien-mam-non-ii",
    name: "Giáo viên Mầm non - Hạng II",
    group: ProfileGroup.TEACHER,
    defaultCoeff: 4.00,
    minCoeff: 4.00,
    maxCoeff: 6.38,
    defaultProfessionalAllowanceRate: 35,
    hasSeniorityAllowance: true,
    defaultSeniorityYears: 8,
    defaultPublicServiceRate: 0,
    description: "Giáo viên mầm non đạt chuẩn thâm niên hạng II có phụ cấp ưu đãi và thâm niên."
  },
  {
    id: "cong-chuc-chuyen-vien",
    name: "Công chức loại A1 (Chuyên viên)",
    group: ProfileGroup.GOVERNMENT,
    defaultCoeff: 2.34,
    minCoeff: 2.34,
    maxCoeff: 4.98,
    defaultProfessionalAllowanceRate: 0,
    hasSeniorityAllowance: false,
    defaultSeniorityYears: 0,
    defaultPublicServiceRate: 25, // Phụ cấp công vụ chuyên viên hành chính 25%
    description: "Chuyên viên ban, bộ, ngành, Ủy ban nhân dân các cấp hưởng phụ cấp công vụ 25%."
  },
  {
    id: "bac-si-hang-iii",
    name: "Bác sĩ y tế công cộng (Hạng III)",
    group: ProfileGroup.DOCTOR,
    defaultCoeff: 2.34,
    minCoeff: 2.34,
    maxCoeff: 4.98,
    defaultProfessionalAllowanceRate: 40, // 40% phụ cấp ưu đãi y tế cơ sở
    hasSeniorityAllowance: false,
    defaultSeniorityYears: 0,
    defaultPublicServiceRate: 0,
    description: "Bác sĩ trực tiếp điều trị tại các bệnh viện công lập."
  },
  {
    id: "sy-quan-quan-nhan",
    name: "Sĩ quan quân đội (Cấp tá/Cấp úy)",
    group: ProfileGroup.MILITARY,
    defaultCoeff: 5.00,
    minCoeff: 4.20,
    maxCoeff: 8.00,
    defaultProfessionalAllowanceRate: 30,
    hasSeniorityAllowance: true,
    defaultSeniorityYears: 12,
    defaultPublicServiceRate: 0,
    description: "Lực lượng quân đội, công an chuyên trách với phụ cấp thâm niên quân ngũ tự động."
  },
  {
    id: "tuy-chinh",
    name: "Phần trăm tùy chọn (Tự nhập tay)",
    group: ProfileGroup.CUSTOM,
    defaultCoeff: 2.34,
    minCoeff: 1.00,
    maxCoeff: 10.00,
    defaultProfessionalAllowanceRate: 35,
    hasSeniorityAllowance: true,
    defaultSeniorityYears: 5,
    defaultPublicServiceRate: 25,
    description: "Tự cấu hình mọi hệ số và loại phụ cấp để tính toán mức lương phù hợp nhất."
  }
];

export function calculateSalary(input: SalaryCalculationInput): SalaryCalculationResult {
  const {
    baseSalary,
    coeff,
    positionCoeff = 0,
    overgradeSeniorityRate = 0,
    professionalAllowanceRate,
    seniorityYears,
    hasSeniority,
    publicServiceRate,
    regionAllowanceValue,
    otherAllowancesValue,
    insuranceRate
  } = input;

  // 1. Lương cơ bản theo hệ số: 
  // Lương cơ sở x (Hệ số lương hiện hưởng + Hệ số phụ cấp chức vụ + Phụ cấp thâm niên vượt khung * Hệ số lương hiện hưởng)
  const overgradeFactor = overgradeSeniorityRate / 100;
  let basicSalary = Math.round(baseSalary * (coeff + positionCoeff + overgradeFactor * coeff));

  // 2. Phụ cấp ưu đãi nghề
  const professionalAllowance = Math.round(basicSalary * (professionalAllowanceRate / 100));

  // 3. Phụ cấp thâm niên (Nếu áp dụng và số năm >= 5)
  // Quy chuẩn: 5 năm là 5%, sau đó mỗi năm tăng 1%
  let seniorityAllowance = 0;
  if (hasSeniority && seniorityYears >= 5) {
    const rate = seniorityYears;
    seniorityAllowance = Math.round(basicSalary * (rate / 100));
  }

  // 4. Phụ cấp công vụ (%)
  const publicServiceAllowance = Math.round(basicSalary * (publicServiceRate / 100));

  // 5. Phụ cấp khu vực & khác (Cộng tuyệt đối)
  const regionAllowance = Math.round(regionAllowanceValue);
  const otherAllowances = Math.round(otherAllowancesValue);

  // 6. Tổng thu nhập (Gross)
  const grossSalary = basicSalary + professionalAllowance + seniorityAllowance + publicServiceAllowance + regionAllowance + otherAllowances;

  // 7. Bảo hiểm (Deductions: 10.5% tính trên Lương cơ bản theo hệ số)
  const insuranceDeduction = Math.round(basicSalary * (insuranceRate / 100));

  // 8. Thực nhận (Net)
  const netSalary = grossSalary - insuranceDeduction;

  // Bảng lương mẫu trong screenshot là 8,542,000đ tổng thu nhập trước thuế hoặc thực lĩnh
  // Hãy gán tiêu đề phù hợp
  return {
    id: Math.random().toString(36).substring(2, 11),
    title: "Bảng lương cán bộ",
    input,
    timestamp: Date.now(),
    basicSalary,
    professionalAllowance,
    seniorityAllowance,
    publicServiceAllowance,
    regionAllowance,
    otherAllowances,
    grossSalary,
    insuranceDeduction,
    netSalary
  };
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "decimal",
  }).format(amount);
}

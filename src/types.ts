/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ProfileGroup {
  GOVERNMENT = "GOVERNMENT", // Công chức hành chính
  TEACHER = "TEACHER",       // Giáo viên / Giáo dục
  DOCTOR = "DOCTOR",         // Bác sĩ / Y tế
  MILITARY = "MILITARY",     // Công an / Quân đội / Lực lượng vũ trang
  CUSTOM = "CUSTOM"          // Tùy chỉnh khác
}

export interface CareerProfile {
  id: string;
  name: string;
  group: ProfileGroup;
  defaultCoeff: number;
  minCoeff: number;
  maxCoeff: number;
  defaultProfessionalAllowanceRate: number; // in %
  hasSeniorityAllowance: boolean;
  defaultSeniorityYears: number;
  defaultPublicServiceRate: number; // in %
  description: string;
}

export interface SalaryCalculationInput {
  profileId: string;
  baseSalary: number; // Lương cơ sở (default 2,340,000)
  coeff: number;      // Hệ số lương hiện hưởng (e.g., 2.34)
  positionCoeff: number; // Hệ số phụ cấp chức vụ (leadership position coefficient)
  overgradeSeniorityRate: number; // Phụ cấp thâm niên vượt khung (%) (e.g., 5)
  professionalAllowanceRate: number; // Phụ cấp ưu đãi nghề (%)
  seniorityYears: number; // Số năm thâm niên (để tính % thâm niên, ví dụ >= 5 năm)
  hasSeniority: boolean;
  publicServiceRate: number; // Phụ cấp công vụ (%)
  regionAllowanceValue: number; // Phụ cấp khu vực (amount in VND)
  otherAllowancesValue: number; // Phụ cấp khác (amount in VND)
  insuranceRate: number; // Tỷ lệ trừ BHXH, BHYT, BHTN (usually 10.5%)
}

export interface SalaryCalculationResult {
  id: string;
  title: string;
  input: SalaryCalculationInput;
  timestamp: number;
  
  // Computed values
  basicSalary: number;         // Lương theo hệ số (coeff * baseSalary)
  professionalAllowance: number; // Phụ cấp ưu đãi nghề
  seniorityAllowance: number;    // Phụ cấp thâm niên
  publicServiceAllowance: number; // Phụ cấp công vụ
  regionAllowance: number;       // Phụ cấp khu vực
  otherAllowances: number;       // Phụ cấp khác
  
  grossSalary: number;           // Tổng thu nhập trước thuế/bảo hiểm
  insuranceDeduction: number;    // Các khoản bảo hiểm (deducted, negative)
  netSalary: number;             // Thực lĩnh (Gross - Deductions)
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: number;
}

export interface DemographicFilterDto {
  genders?: string[];
  minAge?: number;
  maxAge?: number;
}

export interface DemographicMetricsDto {
  genderMetrics: GenderMetricDto[];
  ageMetrics: AgeDistributionMetricDto[];
  totalPatients: number;
}

export interface GenderMetricDto {
  gender: string;
  count: number;
  percentage: number;
}

export interface AgeDistributionMetricDto {
  ageRange: string;
  count: number;
}
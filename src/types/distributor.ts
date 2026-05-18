export type DistributorStatus = "active" | "suspended" | "inactive"

export type DistributorProfile = {
  id: string
  customer_id: string
  referral_code: string
  referral_url: string
  sponsor: { id: string; name: string } | null
  status: DistributorStatus
  joined_at: string
  created_at: string
  updated_at: string
}

export type PVRecord = {
  id: string
  distributor_id: string
  order_id: string
  pv_earned: number
  period_year: number
  period_month: number
  created_at: string
}

export type PVSummary = {
  period: { year: number; month: number }
  pv_total: number
  records: PVRecord[]
}

export type RegisterDistributorResponse = {
  distributor: DistributorProfile & {
    pv_current_period: number
  }
}

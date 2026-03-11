export interface College {
  id: number;
  name: string;
  city: string;
  state: string;
  country: string;
}

export interface LeetcodeStats {
  id: number;
  userId: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  contestRating: number;
  globalRanking: number;
  lastUpdated: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  leetcodeUsername: string;
  collegeId: number;
  college?: College;
  collegeName?: string;
  leetcodeStats?: LeetcodeStats;
  collegeRank?: number;
  totalInCollege?: number;
  avatar?: string;
  createdAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: number;
  name: string;
  leetcodeUsername: string;
  avatar?: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  contestRating: number;
  globalRanking: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
  detectedSchool?: string;
}

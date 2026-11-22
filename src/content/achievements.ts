import type { Achievement, Education } from "../types/content";

export const achievements = [
  {
    id: "dsa",
    title: "Competitive programming",
    value: "400+",
    description: "DSA problems solved on LeetCode and GeeksforGeeks.",
    links: [
      { label: "LeetCode", href: "https://leetcode.com/u/Shivam_Gupta322/" },
      { label: "GeeksforGeeks", href: "https://www.geeksforgeeks.org/user/guptashivamsg02/" },
    ],
  },
  {
    id: "scholarship",
    title: "Academic scholarship",
    value: "₹40,000",
    description: "Awarded for academic excellence in the 1st and 2nd year of B.Tech.",
  },
] as const satisfies readonly Achievement[];

export const education = {
  institution: "Shri Ram Murti Smarak College of Engineering and Technology",
  location: "Bareilly, Uttar Pradesh",
  degree: "B.Tech in Computer Science and Engineering",
  university: "Dr. A.P.J. Abdul Kalam Technical University",
  grade: "CGPA 7.99/10",
  period: { start: 2021, end: 2025 },
} as const satisfies Education;

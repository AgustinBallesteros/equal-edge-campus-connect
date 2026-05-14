// ─── Lesson categories ────────────────────────────────────────────────────────

export type LessonCategory =
  | "Self-Regulation"
  | "Self-Advocacy"
  | "Accommodation"
  | "Communication"
  | "Goal Setting"
  | "Planning"
  | "Transition"
  | "Work Skills"
  | "Social Skills"
  | "Health";

export const CATEGORY_COLOR: Record<LessonCategory, string> = {
  "Self-Regulation": "#F59E0B",  // amber
  "Self-Advocacy":   "#A855F7",  // purple
  "Accommodation":   "#6366F1",  // indigo
  "Communication":   "#10B981",  // green
  "Goal Setting":    "#EF4444",  // red
  "Planning":        "#06B6D4",  // aquamarine
  "Transition":      "#3B82F6",  // blue
  "Work Skills":     "#6B7280",  // grey
  "Social Skills":   "#7C3AED",  // violet
  "Health":          "#84CC16",  // light green
};

// ─── Lessons ──────────────────────────────────────────────────────────────────

export type Lesson = {
  id:       number;
  category: LessonCategory;
  title:    string;
  summary:  string;
  minRead:  number;
  blocks:   number;
};

export const LESSONS: Lesson[] = [
  { id:  1, category: "Self-Regulation", title: "Managing Test Anxiety",                  summary: "Practical strategies to reduce anxiety before and during exams.",                                     minRead:  8, blocks:  6 },
  { id:  2, category: "Self-Advocacy",   title: "Understanding Your Rights",               summary: "An overview of disability rights in higher education under the ADA and Section 504.",                minRead: 10, blocks:  8 },
  { id:  3, category: "Accommodation",   title: "Requesting Classroom Accommodations",     summary: "Step-by-step guidance on requesting and using academic accommodations effectively.",                  minRead:  7, blocks:  5 },
  { id:  4, category: "Communication",   title: "Email Etiquette with Professors",         summary: "How to write clear, professional emails that get timely responses.",                                   minRead:  6, blocks:  4 },
  { id:  5, category: "Goal Setting",    title: "Setting SMART Goals",                     summary: "Learn to create goals that are Specific, Measurable, Achievable, Relevant, and Time-bound.",         minRead:  9, blocks:  7 },
  { id:  6, category: "Planning",        title: "Weekly Schedule Planning",                summary: "Build a sustainable weekly routine that balances academics, work, and self-care.",                    minRead:  8, blocks:  6 },
  { id:  7, category: "Transition",      title: "College to Career Transition",            summary: "Navigating the shift from academic life to the professional world.",                                  minRead: 12, blocks:  9 },
  { id:  8, category: "Work Skills",     title: "Workplace Professionalism",               summary: "Core behaviors and attitudes that drive success in any professional setting.",                        minRead: 10, blocks:  7 },
  { id:  9, category: "Social Skills",   title: "Building Study Groups",                   summary: "How to find, form, and maintain productive study groups.",                                            minRead:  7, blocks:  5 },
  { id: 10, category: "Health",          title: "Sleep and Academic Performance",          summary: "The science behind sleep and practical tips for better rest during the semester.",                    minRead:  8, blocks:  6 },
  { id: 11, category: "Self-Regulation", title: "Emotional Regulation Strategies",         summary: "Tools for identifying and managing intense emotions in academic settings.",                           minRead: 11, blocks:  8 },
  { id: 12, category: "Self-Advocacy",   title: "Speaking Up in Office Hours",             summary: "How to make the most of professor office hours and advocate for your needs.",                        minRead:  6, blocks:  4 },
  { id: 13, category: "Accommodation",   title: "Extended Time and Testing Centers",       summary: "Understanding and navigating extended time accommodations and testing center logistics.",             minRead:  7, blocks:  5 },
  { id: 14, category: "Communication",   title: "Presenting to Peers",                     summary: "Building confidence and clarity when speaking in front of groups.",                                  minRead:  9, blocks:  7 },
  { id: 15, category: "Goal Setting",    title: "Long-Term Goal Mapping",                  summary: "Visualizing and planning for goals that span months or years.",                                      minRead: 10, blocks:  8 },
  { id: 16, category: "Planning",        title: "Semester Planning Essentials",            summary: "Map out your full semester from syllabus review to finals week.",                                    minRead:  9, blocks:  7 },
  { id: 17, category: "Transition",      title: "Resume and Interview Basics",             summary: "Build a strong resume and prepare for your first professional interviews.",                           minRead: 14, blocks: 11 },
  { id: 18, category: "Work Skills",     title: "Time Management at Work",                 summary: "Strategies for prioritizing tasks and meeting deadlines in a work environment.",                     minRead:  8, blocks:  6 },
  { id: 19, category: "Social Skills",   title: "Networking on Campus",                    summary: "How to build meaningful professional and social connections at college.",                             minRead:  7, blocks:  5 },
  { id: 20, category: "Health",          title: "Stress, Nutrition, and Focus",            summary: "How diet and lifestyle choices affect your stress levels and cognitive performance.",                 minRead:  9, blocks:  7 },
];

// ─── Activities ───────────────────────────────────────────────────────────────

export type Activity = {
  id:          number;
  title:       string;
  description: string;
  dueDate:     string; // ISO date
};

export const ACTIVITIES: Activity[] = [
  { id:  1, title: "Write a Self-Accommodation Letter",      description: "Draft a letter requesting accommodations for an upcoming exam or assignment.",                                     dueDate: "2026-02-14" },
  { id:  2, title: "Practice Your 30-Second Introduction",   description: "Record yourself giving a professional introduction and reflect on your delivery.",                                 dueDate: "2026-02-07" },
  { id:  3, title: "Create a Semester Study Schedule",       description: "Build a week-by-week study schedule for the current semester.",                                                    dueDate: "2026-01-31" },
  { id:  4, title: "Set 3 SMART Goals for the Month",        description: "Write three personal or academic goals using the SMART framework.",                                                dueDate: "2026-02-03" },
  { id:  5, title: "Stress Journal Entry",                   description: "Write a reflective entry identifying your current stressors and coping strategies.",                               dueDate: "2026-02-21" },
  { id:  6, title: "Draft an Email to a Professor",          description: "Write a professional email to one of your professors requesting feedback or clarification.",                       dueDate: "2026-02-10" },
  { id:  7, title: "Campus Resource Map",                    description: "Identify and document five campus resources that support your academic and personal success.",                     dueDate: "2026-02-17" },
  { id:  8, title: "Salary Negotiation Role-Play",           description: "Practice a salary negotiation conversation using the provided script framework.",                                  dueDate: "2026-03-07" },
  { id:  9, title: "Attend a Networking Event",              description: "Attend one campus networking or career event and document three connections you made.",                            dueDate: "2026-03-14" },
  { id: 10, title: "Sleep Tracking Log",                     description: "Track your sleep patterns for one week using the provided log template.",                                          dueDate: "2026-02-28" },
  { id: 11, title: "Create a LinkedIn Profile",              description: "Set up or update your LinkedIn with your education, skills, and a professional photo.",                            dueDate: "2026-03-21" },
  { id: 12, title: "Active Listening Exercise",              description: "Complete the active listening worksheet with a peer or family member.",                                            dueDate: "2026-02-24" },
  { id: 13, title: "Cover Letter Draft",                     description: "Write a cover letter for a job or internship you are interested in applying for.",                                 dueDate: "2026-03-28" },
  { id: 14, title: "Time Audit Worksheet",                   description: "Track how you spend your time over three days and identify areas for improvement.",                                dueDate: "2026-02-20" },
  { id: 15, title: "Schedule Advising Appointment",          description: "Book a meeting with your academic advisor and prepare three questions in advance.",                                dueDate: "2026-03-01" },
];

// ─── Staff members ────────────────────────────────────────────────────────────

export type StaffMember = {
  id:   number;
  name: string;
};

export const STAFF: StaffMember[] = [
  { id: 1, name: "Dr. Amara Okafor"     },
  { id: 2, name: "Dr. Marcus Williams"  },
  { id: 3, name: "Prof. Elena Rodriguez"},
  { id: 4, name: "Prof. David Kim"      },
  { id: 5, name: "Dr. Priya Patel"      },
  { id: 6, name: "James Mitchell"       },
  { id: 7, name: "Sofia Hernandez"      },
  { id: 8, name: "Dr. Chris Thompson"   },
];

// ─── Alumni ───────────────────────────────────────────────────────────────────

export type AlumniStatus = "Activated" | "Invited" | "Not Invited";
export type AlumniGender = "Male" | "Female" | "Non-binary";

export type Alumni = {
  id:                   number;
  name:                 string;
  gender:               AlumniGender;
  status:               AlumniStatus;
  dateInvited:          string | null; // ISO date
  dateActivated:        string | null; // ISO date
  dateLastActive:       string | null; // ISO date
  assignedLessonIds:    number[];      // references LESSONS[].id
  assignedActivityIds:  number[];      // references ACTIVITIES[].id
  staffMemberId:        number;        // references STAFF[].id
  engagementScore:      number;        // 0–100
};

export const ALUMNI: Alumni[] = [
  // ── Activated (18) ──────────────────────────────────────────────────────────
  { id:  1, name: "Jordan Reyes",      gender: "Male",   status: "Activated", dateInvited: "2025-12-10", dateActivated: "2026-01-08", dateLastActive: "2026-05-12", assignedLessonIds: [1, 3, 5, 9, 16],          assignedActivityIds: [3, 4, 7],        staffMemberId: 1, engagementScore: 82 },
  { id:  2, name: "Aaliyah Johnson",   gender: "Female", status: "Activated", dateInvited: "2025-12-10", dateActivated: "2026-01-09", dateLastActive: "2026-05-13", assignedLessonIds: [2, 4, 7, 11, 14, 17],     assignedActivityIds: [2, 6, 9, 11],    staffMemberId: 1, engagementScore: 91 },
  { id:  3, name: "Marcus Thompson",   gender: "Male",   status: "Activated", dateInvited: "2025-12-15", dateActivated: "2026-01-12", dateLastActive: "2026-04-28", assignedLessonIds: [1, 6, 8, 15],             assignedActivityIds: [3, 14],          staffMemberId: 2, engagementScore: 67 },
  { id:  4, name: "Priya Sharma",      gender: "Female", status: "Activated", dateInvited: "2025-12-15", dateActivated: "2026-01-14", dateLastActive: "2026-05-10", assignedLessonIds: [2, 3, 10, 13, 16, 20],    assignedActivityIds: [1, 5, 10, 15],   staffMemberId: 3, engagementScore: 88 },
  { id:  5, name: "Ethan Park",        gender: "Male",   status: "Activated", dateInvited: "2026-01-05", dateActivated: "2026-01-18", dateLastActive: "2026-05-08", assignedLessonIds: [5, 7, 17, 18],            assignedActivityIds: [8, 11, 13],      staffMemberId: 2, engagementScore: 74 },
  { id:  6, name: "Maya Williams",     gender: "Female", status: "Activated", dateInvited: "2026-01-05", dateActivated: "2026-01-20", dateLastActive: "2026-05-11", assignedLessonIds: [1, 4, 9, 11, 19],         assignedActivityIds: [2, 4, 12],       staffMemberId: 4, engagementScore: 79 },
  { id:  7, name: "Zoe Carter",        gender: "Female", status: "Activated", dateInvited: "2026-01-08", dateActivated: "2026-01-22", dateLastActive: "2026-04-30", assignedLessonIds: [3, 6, 12, 16],            assignedActivityIds: [1, 7],           staffMemberId: 3, engagementScore: 61 },
  { id:  8, name: "Kwame Asante",      gender: "Male",   status: "Activated", dateInvited: "2026-01-08", dateActivated: "2026-01-25", dateLastActive: "2026-05-09", assignedLessonIds: [2, 5, 8, 15, 17, 18, 19], assignedActivityIds: [8, 9, 11, 13],   staffMemberId: 5, engagementScore: 93 },
  { id:  9, name: "Aiden Cooper",      gender: "Male",   status: "Activated", dateInvited: "2026-01-10", dateActivated: "2026-01-28", dateLastActive: "2026-03-15", assignedLessonIds: [1, 10, 20],               assignedActivityIds: [5, 10],          staffMemberId: 6, engagementScore: 38 },
  { id: 10, name: "Destiny Robinson",  gender: "Female", status: "Activated", dateInvited: "2026-01-10", dateActivated: "2026-01-29", dateLastActive: "2026-05-12", assignedLessonIds: [4, 6, 9, 14, 16],         assignedActivityIds: [2, 6, 12, 15],   staffMemberId: 1, engagementScore: 85 },
  { id: 11, name: "Emma Sullivan",     gender: "Female", status: "Activated", dateInvited: "2026-01-12", dateActivated: "2026-02-01", dateLastActive: "2026-05-01", assignedLessonIds: [7, 17, 18],               assignedActivityIds: [8, 9],           staffMemberId: 4, engagementScore: 72 },
  { id: 12, name: "Malik Hassan",      gender: "Male",   status: "Activated", dateInvited: "2026-01-12", dateActivated: "2026-02-03", dateLastActive: "2026-04-22", assignedLessonIds: [1, 3, 11, 13],            assignedActivityIds: [1, 5, 14],       staffMemberId: 5, engagementScore: 56 },
  { id: 13, name: "Tyler Brooks",      gender: "Male",   status: "Activated", dateInvited: "2026-01-15", dateActivated: "2026-02-05", dateLastActive: "2026-05-13", assignedLessonIds: [2, 5, 6, 15, 16, 17],     assignedActivityIds: [3, 4, 11, 13],   staffMemberId: 2, engagementScore: 87 },
  { id: 14, name: "Liam O'Brien",      gender: "Male",   status: "Activated", dateInvited: "2026-01-15", dateActivated: "2026-02-06", dateLastActive: "2026-04-10", assignedLessonIds: [8, 18],                   assignedActivityIds: [8],              staffMemberId: 7, engagementScore: 33 },
  { id: 15, name: "Jasmine Wright",    gender: "Female", status: "Activated", dateInvited: "2026-01-18", dateActivated: "2026-02-08", dateLastActive: "2026-05-12", assignedLessonIds: [2, 4, 9, 11, 12, 14, 19], assignedActivityIds: [2, 6, 9, 12, 15], staffMemberId: 3, engagementScore: 96 },
  { id: 16, name: "Natalie Kim",       gender: "Female", status: "Activated", dateInvited: "2026-01-18", dateActivated: "2026-02-10", dateLastActive: "2026-05-07", assignedLessonIds: [3, 10, 13, 20],           assignedActivityIds: [1, 10, 15],      staffMemberId: 6, engagementScore: 69 },
  { id: 17, name: "Chloe Turner",      gender: "Female", status: "Activated", dateInvited: "2026-01-20", dateActivated: "2026-02-12", dateLastActive: "2026-04-25", assignedLessonIds: [1, 6, 16],                assignedActivityIds: [3, 7],           staffMemberId: 8, engagementScore: 51 },
  { id: 18, name: "Xavier Washington", gender: "Male",   status: "Activated", dateInvited: "2026-01-20", dateActivated: "2026-02-14", dateLastActive: "2026-05-11", assignedLessonIds: [5, 7, 8, 15, 17, 18],     assignedActivityIds: [8, 9, 11, 13, 14], staffMemberId: 4, engagementScore: 89 },

  // ── Invited (8) ─────────────────────────────────────────────────────────────
  { id: 19, name: "Sofia Nguyen",      gender: "Female",      status: "Invited", dateInvited: "2026-02-01", dateActivated: null, dateLastActive: null, assignedLessonIds: [],    assignedActivityIds: [],    staffMemberId: 1, engagementScore: 0 },
  { id: 20, name: "Noah Bennett",      gender: "Male",        status: "Invited", dateInvited: "2026-02-03", dateActivated: null, dateLastActive: null, assignedLessonIds: [1],   assignedActivityIds: [],    staffMemberId: 2, engagementScore: 0 },
  { id: 21, name: "Carlos Rivera",     gender: "Male",        status: "Invited", dateInvited: "2026-02-05", dateActivated: null, dateLastActive: null, assignedLessonIds: [],    assignedActivityIds: [],    staffMemberId: 5, engagementScore: 0 },
  { id: 22, name: "Amara Diallo",      gender: "Female",      status: "Invited", dateInvited: "2026-02-08", dateActivated: null, dateLastActive: null, assignedLessonIds: [2],   assignedActivityIds: [4],   staffMemberId: 3, engagementScore: 0 },
  { id: 23, name: "Brandon Lewis",     gender: "Male",        status: "Invited", dateInvited: "2026-02-10", dateActivated: null, dateLastActive: null, assignedLessonIds: [],    assignedActivityIds: [],    staffMemberId: 7, engagementScore: 0 },
  { id: 24, name: "Fatima Al-Amin",    gender: "Female",      status: "Invited", dateInvited: "2026-02-12", dateActivated: null, dateLastActive: null, assignedLessonIds: [],    assignedActivityIds: [],    staffMemberId: 8, engagementScore: 0 },
  { id: 25, name: "Simone Davis",      gender: "Female",      status: "Invited", dateInvited: "2026-02-15", dateActivated: null, dateLastActive: null, assignedLessonIds: [5],   assignedActivityIds: [],    staffMemberId: 6, engagementScore: 0 },
  { id: 26, name: "Hannah Pierce",     gender: "Female",      status: "Invited", dateInvited: "2026-02-18", dateActivated: null, dateLastActive: null, assignedLessonIds: [],    assignedActivityIds: [],    staffMemberId: 4, engagementScore: 0 },

  // ── Not Invited (6) ─────────────────────────────────────────────────────────
  { id: 27, name: "Diego Flores",      gender: "Male",        status: "Not Invited", dateInvited: null, dateActivated: null, dateLastActive: null, assignedLessonIds: [], assignedActivityIds: [], staffMemberId: 1, engagementScore: 0 },
  { id: 28, name: "Isabella Martinez", gender: "Female",      status: "Not Invited", dateInvited: null, dateActivated: null, dateLastActive: null, assignedLessonIds: [], assignedActivityIds: [], staffMemberId: 2, engagementScore: 0 },
  { id: 29, name: "Grace Chen",        gender: "Female",      status: "Not Invited", dateInvited: null, dateActivated: null, dateLastActive: null, assignedLessonIds: [], assignedActivityIds: [], staffMemberId: 3, engagementScore: 0 },
  { id: 30, name: "Samuel Okafor",     gender: "Male",        status: "Not Invited", dateInvited: null, dateActivated: null, dateLastActive: null, assignedLessonIds: [], assignedActivityIds: [], staffMemberId: 5, engagementScore: 0 },
  { id: 31, name: "Connor Hughes",     gender: "Male",        status: "Not Invited", dateInvited: null, dateActivated: null, dateLastActive: null, assignedLessonIds: [], assignedActivityIds: [], staffMemberId: 7, engagementScore: 0 },
  { id: 32, name: "Andre Moreau",      gender: "Male",        status: "Not Invited", dateInvited: null, dateActivated: null, dateLastActive: null, assignedLessonIds: [], assignedActivityIds: [], staffMemberId: 8, engagementScore: 0 },
];

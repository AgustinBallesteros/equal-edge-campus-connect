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
  "Self-Regulation": "#F59E0B",
  "Self-Advocacy":   "#A855F7",
  "Accommodation":   "#6366F1",
  "Communication":   "#10B981",
  "Goal Setting":    "#EF4444",
  "Planning":        "#06B6D4",
  "Transition":      "#3B82F6",
  "Work Skills":     "#6B7280",
  "Social Skills":   "#7C3AED",
  "Health":          "#84CC16",
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
  { id:  1, category: "Self-Regulation", title: "Managing Test Anxiety",              summary: "Practical strategies to reduce anxiety before and during exams.",                                     minRead:  8, blocks:  6 },
  { id:  2, category: "Self-Advocacy",   title: "Understanding Your Rights",           summary: "An overview of disability rights in higher education under the ADA and Section 504.",                minRead: 10, blocks:  8 },
  { id:  3, category: "Accommodation",   title: "Requesting Classroom Accommodations", summary: "Step-by-step guidance on requesting and using academic accommodations effectively.",                  minRead:  7, blocks:  5 },
  { id:  4, category: "Communication",   title: "Email Etiquette with Professors",     summary: "How to write clear, professional emails that get timely responses.",                                   minRead:  6, blocks:  4 },
  { id:  5, category: "Goal Setting",    title: "Setting SMART Goals",                 summary: "Learn to create goals that are Specific, Measurable, Achievable, Relevant, and Time-bound.",         minRead:  9, blocks:  7 },
  { id:  6, category: "Planning",        title: "Weekly Schedule Planning",            summary: "Build a sustainable weekly routine that balances academics, work, and self-care.",                    minRead:  8, blocks:  6 },
  { id:  7, category: "Transition",      title: "College to Career Transition",        summary: "Navigating the shift from academic life to the professional world.",                                  minRead: 12, blocks:  9 },
  { id:  8, category: "Work Skills",     title: "Workplace Professionalism",           summary: "Core behaviors and attitudes that drive success in any professional setting.",                        minRead: 10, blocks:  7 },
  { id:  9, category: "Social Skills",   title: "Building Study Groups",               summary: "How to find, form, and maintain productive study groups.",                                            minRead:  7, blocks:  5 },
  { id: 10, category: "Health",          title: "Sleep and Academic Performance",      summary: "The science behind sleep and practical tips for better rest during the semester.",                    minRead:  8, blocks:  6 },
  { id: 11, category: "Self-Regulation", title: "Emotional Regulation Strategies",     summary: "Tools for identifying and managing intense emotions in academic settings.",                           minRead: 11, blocks:  8 },
  { id: 12, category: "Self-Advocacy",   title: "Speaking Up in Office Hours",         summary: "How to make the most of professor office hours and advocate for your needs.",                        minRead:  6, blocks:  4 },
  { id: 13, category: "Accommodation",   title: "Extended Time and Testing Centers",   summary: "Understanding and navigating extended time accommodations and testing center logistics.",             minRead:  7, blocks:  5 },
  { id: 14, category: "Communication",   title: "Presenting to Peers",                 summary: "Building confidence and clarity when speaking in front of groups.",                                  minRead:  9, blocks:  7 },
  { id: 15, category: "Goal Setting",    title: "Long-Term Goal Mapping",              summary: "Visualizing and planning for goals that span months or years.",                                      minRead: 10, blocks:  8 },
  { id: 16, category: "Planning",        title: "Semester Planning Essentials",        summary: "Map out your full semester from syllabus review to finals week.",                                    minRead:  9, blocks:  7 },
  { id: 17, category: "Transition",      title: "Resume and Interview Basics",         summary: "Build a strong resume and prepare for your first professional interviews.",                           minRead: 14, blocks: 11 },
  { id: 18, category: "Work Skills",     title: "Time Management at Work",             summary: "Strategies for prioritizing tasks and meeting deadlines in a work environment.",                     minRead:  8, blocks:  6 },
  { id: 19, category: "Social Skills",   title: "Networking on Campus",                summary: "How to build meaningful professional and social connections at college.",                             minRead:  7, blocks:  5 },
  { id: 20, category: "Health",          title: "Stress, Nutrition, and Focus",        summary: "How diet and lifestyle choices affect your stress levels and cognitive performance.",                 minRead:  9, blocks:  7 },
];

// ─── Activities ───────────────────────────────────────────────────────────────

export type Activity = {
  id:          number;
  title:       string;
  description: string;
  dueDate:     string;
};

export const ACTIVITIES: Activity[] = [
  { id:  1, title: "Write a Self-Accommodation Letter",    description: "Draft a letter requesting accommodations for an upcoming exam or assignment.",                               dueDate: "2026-02-14" },
  { id:  2, title: "Practice Your 30-Second Introduction", description: "Record yourself giving a professional introduction and reflect on your delivery.",                           dueDate: "2026-02-07" },
  { id:  3, title: "Create a Semester Study Schedule",     description: "Build a week-by-week study schedule for the current semester.",                                              dueDate: "2026-01-31" },
  { id:  4, title: "Set 3 SMART Goals for the Month",      description: "Write three personal or academic goals using the SMART framework.",                                          dueDate: "2026-02-03" },
  { id:  5, title: "Stress Journal Entry",                 description: "Write a reflective entry identifying your current stressors and coping strategies.",                         dueDate: "2026-02-21" },
  { id:  6, title: "Draft an Email to a Professor",        description: "Write a professional email to one of your professors requesting feedback or clarification.",                 dueDate: "2026-02-10" },
  { id:  7, title: "Campus Resource Map",                  description: "Identify and document five campus resources that support your academic and personal success.",               dueDate: "2026-02-17" },
  { id:  8, title: "Salary Negotiation Role-Play",         description: "Practice a salary negotiation conversation using the provided script framework.",                            dueDate: "2026-03-07" },
  { id:  9, title: "Attend a Networking Event",            description: "Attend one campus networking or career event and document three connections you made.",                      dueDate: "2026-03-14" },
  { id: 10, title: "Sleep Tracking Log",                   description: "Track your sleep patterns for one week using the provided log template.",                                    dueDate: "2026-02-28" },
  { id: 11, title: "Create a LinkedIn Profile",            description: "Set up or update your LinkedIn with your education, skills, and a professional photo.",                      dueDate: "2026-03-21" },
  { id: 12, title: "Active Listening Exercise",            description: "Complete the active listening worksheet with a peer or family member.",                                      dueDate: "2026-02-24" },
  { id: 13, title: "Cover Letter Draft",                   description: "Write a cover letter for a job or internship you are interested in applying for.",                           dueDate: "2026-03-28" },
  { id: 14, title: "Time Audit Worksheet",                 description: "Track how you spend your time over three days and identify areas for improvement.",                          dueDate: "2026-02-20" },
  { id: 15, title: "Schedule Advising Appointment",        description: "Book a meeting with your academic advisor and prepare three questions in advance.",                          dueDate: "2026-03-01" },
];

// ─── Scripts ─────────────────────────────────────────────────────────────────

export type ScriptCategory =
  | "Accommodation Request"
  | "Follow-Up / Escalation"
  | "Emailing a Professor"
  | "Advisor Communication"
  | "Peer Communication";

export const SCRIPT_CATEGORY_COLOR: Record<ScriptCategory, string> = {
  "Accommodation Request":  "#3B82F6", // blue
  "Follow-Up / Escalation": "#F59E0B", // yellow
  "Emailing a Professor":   "#10B981", // green
  "Advisor Communication":  "#8B5CF6", // purple
  "Peer Communication":     "#EC4899", // pink
};

export type Script = {
  id:       number;
  category: ScriptCategory;
  title:    string;
  text:     string;
};

export const SCRIPTS: Script[] = [
  {
    id: 1,
    category: "Accommodation Request",
    title: "Accommodation Request — First Ask",
    text: `Subject: Accommodation Request — [Your Name], [Course Name]

Dear Professor [Last Name],

My name is [Your Name] and I am enrolled in your [Course Name] course (Section [#]). I am registered with the Disability Services Office and have been approved for the following accommodations: [list accommodations].

I wanted to reach out early in the semester to introduce myself and discuss how we can best implement these accommodations in your course. I have attached my official accommodation letter for your reference.

Please let me know if you have any questions or if there is a time we could meet to discuss further.

Thank you for your support.

[Your Name]
[Student ID] · [Email Address]`,
  },
  {
    id: 2,
    category: "Accommodation Request",
    title: "Accommodation Request — New Semester",
    text: `Subject: Accommodation Renewal — [Your Name], [Course Name], [Semester]

Dear Professor [Last Name],

I hope you are doing well. I am writing to let you know that I am once again enrolled in one of your courses this semester: [Course Name] (Section [#]).

I continue to be registered with the Disability Services Office and my approved accommodations remain the same: [list accommodations]. Please find my updated accommodation letter attached.

I appreciate your continued support. Please don't hesitate to reach out if you have any questions.

Best regards,
[Your Name]
[Student ID] · [Email Address]`,
  },
  {
    id: 3,
    category: "Accommodation Request",
    title: "Requesting Extended Time on an Exam",
    text: `Subject: Extended Time Accommodation — [Exam Name], [Course Name]

Dear Professor [Last Name],

I am writing to confirm the use of my extended time accommodation for the upcoming [Exam Name] on [Date]. As noted in my accommodation letter, I am approved for [1.5x / 2x] extended time and will be completing the exam at the [Testing Center Name].

I plan to schedule my exam slot for [proposed time/date]. I wanted to ensure we are aligned before I finalize the booking.

Please let me know if there is anything you need from me in advance, such as a copy of the exam or specific instructions for the testing center.

Thank you,
[Your Name]
[Student ID] · [Email Address]`,
  },
  {
    id: 4,
    category: "Follow-Up / Escalation",
    title: "Following Up After No Response",
    text: `Subject: Follow-Up: [Original Subject Line]

Dear Professor [Last Name],

I hope this message finds you well. I am following up on an email I sent on [Original Date] regarding [brief topic — e.g., my accommodation request / a question about the assignment].

I understand you are busy and I want to be respectful of your time. I wanted to make sure my previous message didn't get lost. Please let me know if you need any additional information from me.

I am happy to meet during your office hours or at another time that works for you.

Thank you,
[Your Name]
[Student ID] · [Email Address]`,
  },
  {
    id: 5,
    category: "Follow-Up / Escalation",
    title: "Escalating an Unresolved Accommodation",
    text: `Subject: Unresolved Accommodation — Request for Assistance

Dear [Disability Services Coordinator Name],

I am reaching out because I have been unable to resolve an accommodation issue directly with my professor for [Course Name].

I initially sent my accommodation letter on [Date] and followed up on [Date], but I have not received a response. My approved accommodations include [list], and [upcoming exam/deadline] is on [Date].

I would appreciate any guidance or support you can provide in ensuring my accommodations are implemented in time.

Thank you for your help.

[Your Name]
[Student ID] · [Email Address]`,
  },
  {
    id: 6,
    category: "Follow-Up / Escalation",
    title: "Following Up on a Grade Dispute",
    text: `Subject: Follow-Up: Grade Review Request — [Assignment Name]

Dear Professor [Last Name],

I am following up on my grade review request for [Assignment Name], which I submitted on [Date]. I have not yet received a response and wanted to check in on the status.

To summarize my concern: I believe there may have been an error in the grading of [specific section/question]. I am happy to discuss this further during office hours or via email.

I appreciate your time and look forward to your response.

Best,
[Your Name]
[Student ID] · [Email Address]`,
  },
  {
    id: 7,
    category: "Emailing a Professor",
    title: "Introducing Yourself to a Professor",
    text: `Subject: Introduction — [Your Name], [Course Name]

Dear Professor [Last Name],

My name is [Your Name] and I am enrolled in your [Course Name] course this semester (Section [#], [Days/Time]). I wanted to take a moment to introduce myself.

I am a [year] student majoring in [Major]. I am particularly interested in this course because [brief reason]. I am looking forward to learning from you this semester.

If there is anything I should know about your expectations or the course before we get started, I would welcome the chance to hear it.

Thank you for your time.

[Your Name]
[Student ID] · [Email Address]`,
  },
  {
    id: 8,
    category: "Emailing a Professor",
    title: "Requesting a Meeting with a Professor",
    text: `Subject: Office Hours / Meeting Request — [Your Name], [Course Name]

Dear Professor [Last Name],

I hope you are doing well. I am a student in your [Course Name] course and I would like to schedule a time to meet with you to discuss [reason — e.g., the upcoming assignment / my progress in the course / a concept I am struggling with].

I am available [list 2–3 availability windows], but I am happy to work around your schedule. Please let me know what works best for you.

Thank you for your time and I look forward to speaking with you.

Best regards,
[Your Name]
[Student ID] · [Email Address]`,
  },
  {
    id: 9,
    category: "Emailing a Professor",
    title: "Asking for Feedback on an Assignment",
    text: `Subject: Feedback Request — [Assignment Name], [Course Name]

Dear Professor [Last Name],

Thank you for returning our graded [Assignment Name]. I reviewed your comments and I want to make sure I understand how to improve for future submissions.

Specifically, I had a question about [brief description of the section or feedback]. Could you help me understand what a stronger response would have looked like?

I am happy to visit during office hours if that would be easier. Thank you in advance for your time.

[Your Name]
[Student ID] · [Email Address]`,
  },
  {
    id: 10,
    category: "Advisor Communication",
    title: "Scheduling an Advising Appointment",
    text: `Subject: Advising Appointment Request — [Your Name], [Major], [Year]

Dear [Advisor Name],

My name is [Your Name] and I am a [year] student majoring in [Major] (Student ID: [#]). I would like to schedule an advising appointment to discuss [reason — e.g., my course plan for next semester / my four-year plan / a potential change of major].

I am available [list 2–3 availability windows] and I am flexible if none of those times work. Please let me know how to best book a time with you.

Thank you,
[Your Name]
[Phone Number] · [Email Address]`,
  },
  {
    id: 11,
    category: "Advisor Communication",
    title: "Checking In on Degree Progress",
    text: `Subject: Degree Progress Check-In — [Your Name]

Dear [Advisor Name],

I hope you are well. I am writing to request a brief check-in regarding my degree progress. I want to make sure I am on track to graduate in [expected graduation semester] and that I haven't missed any requirements.

I have been reviewing my degree audit in [system name] and have a few questions about [specific area — e.g., elective credits / prerequisites for my major / transfer credit evaluations].

Would you have availability for a quick meeting or call this week or next? I am available [list availability].

Thank you for your continued guidance.

[Your Name]
[Student ID] · [Email Address]`,
  },
  {
    id: 12,
    category: "Peer Communication",
    title: "Asking a Classmate to Join a Study Group",
    text: `Hi [Classmate's Name],

I'm [Your Name] from [Course Name]. I've been working on putting together a small study group for the upcoming [exam / project] and wanted to see if you'd be interested in joining.

We're planning to meet [day/time] at [location / online via Zoom] for about [duration]. The goal is to go over [topic areas] together and quiz each other on the material.

Let me know if this sounds good or if you'd like to suggest a different time. Either way, good luck with the class!

[Your Name]`,
  },
];

// ─── Staff members ────────────────────────────────────────────────────────────

export type StaffMember = {
  id:   number;
  name: string;
};

export const STAFF: StaffMember[] = [
  { id: 1, name: "Dr. Amara Okafor"      },
  { id: 2, name: "Dr. Marcus Williams"   },
  { id: 3, name: "Prof. Elena Rodriguez" },
  { id: 4, name: "Prof. David Kim"       },
  { id: 5, name: "Dr. Priya Patel"       },
  { id: 6, name: "James Mitchell"        },
  { id: 7, name: "Sofia Hernandez"       },
  { id: 8, name: "Dr. Chris Thompson"    },
];

// ─── Alumni ───────────────────────────────────────────────────────────────────

export type AlumniStatus = "Activated" | "Invited" | "Not Invited";
export type AlumniGender = "Male" | "Female" | "Non-binary";

export type Alumni = {
  id:                  number;
  name:                string;
  gender:              AlumniGender;
  status:              AlumniStatus;
  dateInvited:         string | null;
  dateActivated:       string | null;
  dateLastActive:      string | null;
  assignedLessonIds:   number[];
  assignedActivityIds: number[];
  staffMemberId:       number;
  engagementScore:     number;
  trend:               number;  // weekly score delta (+ up, - down, 0 flat)
  streak:              number;  // consecutive active days
};

export const ALUMNI: Alumni[] = [
  // ── Activated (18) ──────────────────────────────────────────────────────────
  { id:  1, name: "Jordan Reyes",      gender: "Male",   status: "Activated",    dateInvited: "2025-12-10", dateActivated: "2026-01-08", dateLastActive: "2026-05-12", assignedLessonIds: [1,3,5,9,16],         assignedActivityIds: [3,4,7],       staffMemberId: 1, engagementScore: 82, trend:   8, streak:  5 },
  { id:  2, name: "Aaliyah Johnson",   gender: "Female", status: "Activated",    dateInvited: "2025-12-10", dateActivated: "2026-01-09", dateLastActive: "2026-05-13", assignedLessonIds: [2,4,7,11,14,17],    assignedActivityIds: [2,6,9,11],    staffMemberId: 1, engagementScore: 91, trend:  15, streak: 12 },
  { id:  3, name: "Marcus Thompson",   gender: "Male",   status: "Activated",    dateInvited: "2025-12-15", dateActivated: "2026-01-12", dateLastActive: "2026-04-28", assignedLessonIds: [1,6,8,15],          assignedActivityIds: [3,14],        staffMemberId: 2, engagementScore: 67, trend:   4, streak:  3 },
  { id:  4, name: "Priya Sharma",      gender: "Female", status: "Activated",    dateInvited: "2025-12-15", dateActivated: "2026-01-14", dateLastActive: "2026-05-10", assignedLessonIds: [2,3,10,13,16,20],  assignedActivityIds: [1,5,10,15],   staffMemberId: 3, engagementScore: 88, trend:  11, streak:  9 },
  { id:  5, name: "Ethan Park",        gender: "Male",   status: "Activated",    dateInvited: "2026-01-05", dateActivated: "2026-01-18", dateLastActive: "2026-05-08", assignedLessonIds: [5,7,17,18],         assignedActivityIds: [8,11,13],     staffMemberId: 2, engagementScore: 74, trend:   6, streak:  4 },
  { id:  6, name: "Maya Williams",     gender: "Female", status: "Activated",    dateInvited: "2026-01-05", dateActivated: "2026-01-20", dateLastActive: "2026-05-11", assignedLessonIds: [1,4,9,11,19],       assignedActivityIds: [2,4,12],      staffMemberId: 4, engagementScore: 79, trend:  -2, streak:  0 },
  { id:  7, name: "Zoe Carter",        gender: "Female", status: "Activated",    dateInvited: "2026-01-08", dateActivated: "2026-01-22", dateLastActive: "2026-04-30", assignedLessonIds: [3,6,12,16],         assignedActivityIds: [1,7],         staffMemberId: 3, engagementScore: 61, trend:   3, streak:  2 },
  { id:  8, name: "Kwame Asante",      gender: "Male",   status: "Activated",    dateInvited: "2026-01-08", dateActivated: "2026-01-25", dateLastActive: "2026-05-09", assignedLessonIds: [2,5,8,15,17,18,19], assignedActivityIds: [8,9,11,13],  staffMemberId: 5, engagementScore: 93, trend:  19, streak: 14 },
  { id:  9, name: "Aiden Cooper",      gender: "Male",   status: "Activated",    dateInvited: "2026-01-10", dateActivated: "2026-01-28", dateLastActive: "2026-03-15", assignedLessonIds: [1,10,20],           assignedActivityIds: [5,10],        staffMemberId: 6, engagementScore: 38, trend:  -8, streak:  0 },
  { id: 10, name: "Destiny Robinson",  gender: "Female", status: "Activated",    dateInvited: "2026-01-10", dateActivated: "2026-01-29", dateLastActive: "2026-05-12", assignedLessonIds: [4,6,9,14,16],       assignedActivityIds: [2,6,12,15],   staffMemberId: 1, engagementScore: 85, trend:  12, streak:  7 },
  { id: 11, name: "Emma Sullivan",     gender: "Female", status: "Activated",    dateInvited: "2026-01-12", dateActivated: "2026-02-01", dateLastActive: "2026-05-01", assignedLessonIds: [7,17,18],           assignedActivityIds: [8,9],         staffMemberId: 4, engagementScore: 72, trend:   5, streak:  3 },
  { id: 12, name: "Malik Hassan",      gender: "Male",   status: "Activated",    dateInvited: "2026-01-12", dateActivated: "2026-02-03", dateLastActive: "2026-04-22", assignedLessonIds: [1,3,11,13],         assignedActivityIds: [1,5,14],      staffMemberId: 5, engagementScore: 56, trend:  -3, streak:  0 },
  { id: 13, name: "Tyler Brooks",      gender: "Male",   status: "Activated",    dateInvited: "2026-01-15", dateActivated: "2026-02-05", dateLastActive: "2026-05-13", assignedLessonIds: [2,5,6,15,16,17],   assignedActivityIds: [3,4,11,13],   staffMemberId: 2, engagementScore: 87, trend:  13, streak:  8 },
  { id: 14, name: "Liam O'Brien",      gender: "Male",   status: "Activated",    dateInvited: "2026-01-15", dateActivated: "2026-02-06", dateLastActive: "2026-04-10", assignedLessonIds: [8,18],              assignedActivityIds: [8],           staffMemberId: 7, engagementScore: 33, trend: -12, streak:  0 },
  { id: 15, name: "Jasmine Wright",    gender: "Female", status: "Activated",    dateInvited: "2026-01-18", dateActivated: "2026-02-08", dateLastActive: "2026-05-12", assignedLessonIds: [2,4,9,11,12,14,19], assignedActivityIds: [2,6,9,12,15], staffMemberId: 3, engagementScore: 96, trend:  22, streak: 16 },
  { id: 16, name: "Natalie Kim",       gender: "Female", status: "Activated",    dateInvited: "2026-01-18", dateActivated: "2026-02-10", dateLastActive: "2026-05-07", assignedLessonIds: [3,10,13,20],        assignedActivityIds: [1,10,15],     staffMemberId: 6, engagementScore: 69, trend:   7, streak:  5 },
  { id: 17, name: "Chloe Turner",      gender: "Female", status: "Activated",    dateInvited: "2026-01-20", dateActivated: "2026-02-12", dateLastActive: "2026-04-25", assignedLessonIds: [1,6,16],            assignedActivityIds: [3,7],         staffMemberId: 8, engagementScore: 51, trend:   2, streak:  1 },
  { id: 18, name: "Xavier Washington", gender: "Male",   status: "Activated",    dateInvited: "2026-01-20", dateActivated: "2026-02-14", dateLastActive: "2026-05-11", assignedLessonIds: [5,7,8,15,17,18],   assignedActivityIds: [8,9,11,13,14], staffMemberId: 4, engagementScore: 89, trend:  16, streak: 11 },

  // ── Invited (8) ─────────────────────────────────────────────────────────────
  { id: 19, name: "Sofia Nguyen",      gender: "Female", status: "Invited",      dateInvited: "2026-02-01", dateActivated: null, dateLastActive: null, assignedLessonIds: [],  assignedActivityIds: [],  staffMemberId: 1, engagementScore: 0, trend: 0, streak: 0 },
  { id: 20, name: "Noah Bennett",      gender: "Male",   status: "Invited",      dateInvited: "2026-02-03", dateActivated: null, dateLastActive: null, assignedLessonIds: [1], assignedActivityIds: [],  staffMemberId: 2, engagementScore: 0, trend: 0, streak: 0 },
  { id: 21, name: "Carlos Rivera",     gender: "Male",   status: "Invited",      dateInvited: "2026-02-05", dateActivated: null, dateLastActive: null, assignedLessonIds: [],  assignedActivityIds: [],  staffMemberId: 5, engagementScore: 0, trend: 0, streak: 0 },
  { id: 22, name: "Amara Diallo",      gender: "Female", status: "Invited",      dateInvited: "2026-02-08", dateActivated: null, dateLastActive: null, assignedLessonIds: [2], assignedActivityIds: [4], staffMemberId: 3, engagementScore: 0, trend: 0, streak: 0 },
  { id: 23, name: "Brandon Lewis",     gender: "Male",   status: "Invited",      dateInvited: "2026-02-10", dateActivated: null, dateLastActive: null, assignedLessonIds: [],  assignedActivityIds: [],  staffMemberId: 7, engagementScore: 0, trend: 0, streak: 0 },
  { id: 24, name: "Fatima Al-Amin",    gender: "Female", status: "Invited",      dateInvited: "2026-02-12", dateActivated: null, dateLastActive: null, assignedLessonIds: [],  assignedActivityIds: [],  staffMemberId: 8, engagementScore: 0, trend: 0, streak: 0 },
  { id: 25, name: "Simone Davis",      gender: "Female", status: "Invited",      dateInvited: "2026-02-15", dateActivated: null, dateLastActive: null, assignedLessonIds: [5], assignedActivityIds: [],  staffMemberId: 6, engagementScore: 0, trend: 0, streak: 0 },
  { id: 26, name: "Hannah Pierce",     gender: "Female", status: "Invited",      dateInvited: "2026-02-18", dateActivated: null, dateLastActive: null, assignedLessonIds: [],  assignedActivityIds: [],  staffMemberId: 4, engagementScore: 0, trend: 0, streak: 0 },

  // ── Not Invited (6) ─────────────────────────────────────────────────────────
  { id: 27, name: "Diego Flores",      gender: "Male",   status: "Not Invited",  dateInvited: null, dateActivated: null, dateLastActive: null, assignedLessonIds: [], assignedActivityIds: [], staffMemberId: 1, engagementScore: 0, trend: 0, streak: 0 },
  { id: 28, name: "Isabella Martinez", gender: "Female", status: "Not Invited",  dateInvited: null, dateActivated: null, dateLastActive: null, assignedLessonIds: [], assignedActivityIds: [], staffMemberId: 2, engagementScore: 0, trend: 0, streak: 0 },
  { id: 29, name: "Grace Chen",        gender: "Female", status: "Not Invited",  dateInvited: null, dateActivated: null, dateLastActive: null, assignedLessonIds: [], assignedActivityIds: [], staffMemberId: 3, engagementScore: 0, trend: 0, streak: 0 },
  { id: 30, name: "Samuel Okafor",     gender: "Male",   status: "Not Invited",  dateInvited: null, dateActivated: null, dateLastActive: null, assignedLessonIds: [], assignedActivityIds: [], staffMemberId: 5, engagementScore: 0, trend: 0, streak: 0 },
  { id: 31, name: "Connor Hughes",     gender: "Male",   status: "Not Invited",  dateInvited: null, dateActivated: null, dateLastActive: null, assignedLessonIds: [], assignedActivityIds: [], staffMemberId: 7, engagementScore: 0, trend: 0, streak: 0 },
  { id: 32, name: "Andre Moreau",      gender: "Male",   status: "Not Invited",  dateInvited: null, dateActivated: null, dateLastActive: null, assignedLessonIds: [], assignedActivityIds: [], staffMemberId: 8, engagementScore: 0, trend: 0, streak: 0 },
];

// ─── Weekly engagement trend (for Dashboard graph) ───────────────────────────

export type EngagementPoint = { label: string; score: number };

export const WEEKLY_ENGAGEMENT: EngagementPoint[] = [
  { label: "Jan W1", score: 34 },
  { label: "Jan W2", score: 48 },
  { label: "Jan W3", score: 43 },
  { label: "Jan W4", score: 57 },
  { label: "Feb W1", score: 52 },
  { label: "Feb W2", score: 68 },
  { label: "Feb W3", score: 61 },
  { label: "Feb W4", score: 74 },
  { label: "Mar W1", score: 70 },
  { label: "Mar W2", score: 79 },
  { label: "Mar W3", score: 73 },
  { label: "Mar W4", score: 83 },
  { label: "Apr W1", score: 78 },
  { label: "Apr W2", score: 88 },
  { label: "Apr W3", score: 82 },
  { label: "Apr W4", score: 91 },
  { label: "May W1", score: 86 },
  { label: "May W2", score: 94 },
];

// ─── Messages ────────────────────────────────────────────────────────────────

export type MessageSender = "staff" | "student";

export type Message = {
  id:     number;
  sender: MessageSender;
  text:   string;
  date:   string; // ISO date
  time:   string; // "HH:MM"
};

export type MessageThread = {
  id:          number;
  studentId:   number; // references ALUMNI id
  messages:    Message[];
  unreadCount: number; // unread messages from student
};

export const MESSAGE_THREADS: MessageThread[] = [
  // ── Aaliyah Johnson (id:2) — check-in, 2 unread ───────────────────────────
  {
    id: 1, studentId: 2, unreadCount: 2,
    messages: [
      { id: 1,  sender: "staff",   date: "2026-05-07", time: "09:12", text: "Hi Aaliyah! Just checking in — how are you feeling about the semester so far?" },
      { id: 2,  sender: "student", date: "2026-05-07", time: "10:45", text: "Hi Dr. Okafor! Things are going well overall. I finished the SMART goals activity and it really helped me focus." },
      { id: 3,  sender: "staff",   date: "2026-05-08", time: "08:30", text: "That's great to hear! Have you started thinking about your end-of-semester reflection?" },
      { id: 4,  sender: "student", date: "2026-05-08", time: "11:20", text: "Not yet, but I will this weekend. I also wanted to ask — is the activity deadline firm or is there any flexibility?" },
      { id: 5,  sender: "student", date: "2026-05-13", time: "14:05", text: "Hey, just following up on my question about the deadline 😊" },
      { id: 6,  sender: "student", date: "2026-05-14", time: "09:30", text: "No worries if you're busy, I can also check with the office!" },
    ],
  },
  // ── Jasmine Wright (id:15) — accommodation escalation, 3 unread ───────────
  {
    id: 2, studentId: 15, unreadCount: 3,
    messages: [
      { id: 7,  sender: "staff",   date: "2026-05-06", time: "10:00", text: "Hi Jasmine, I wanted to check in about your accommodation letter for Professor Chen's class. Did you hear back?" },
      { id: 8,  sender: "student", date: "2026-05-06", time: "13:15", text: "Not yet. I sent it two weeks ago and followed up once but still nothing." },
      { id: 9,  sender: "staff",   date: "2026-05-07", time: "09:05", text: "That's not okay — I'll reach out to the DSO today to loop them in. Your exam is next Thursday, right?" },
      { id: 10, sender: "student", date: "2026-05-07", time: "09:45", text: "Yes, May 15th. I'm really stressed about it." },
      { id: 11, sender: "student", date: "2026-05-13", time: "16:00", text: "Update: I heard back from DSO and they said they contacted the professor directly." },
      { id: 12, sender: "student", date: "2026-05-14", time: "08:10", text: "The professor replied and confirmed I can use the testing center 🎉 Thank you so much for your help!" },
      { id: 13, sender: "student", date: "2026-05-14", time: "08:12", text: "I just wanted to make sure you saw the update before the exam tomorrow." },
    ],
  },
  // ── Jordan Reyes (id:1) — exam prep, 0 unread ─────────────────────────────
  {
    id: 3, studentId: 1, unreadCount: 0,
    messages: [
      { id: 14, sender: "staff",   date: "2026-05-09", time: "11:00", text: "Jordan, finals are coming up — have you scheduled your extended time exams at the testing center?" },
      { id: 15, sender: "student", date: "2026-05-09", time: "14:30", text: "Yes! I booked all three. Two are next week and one is the week after." },
      { id: 16, sender: "staff",   date: "2026-05-09", time: "15:05", text: "Perfect. Don't forget to use the anxiety management strategies from the lesson. You've got this!" },
      { id: 17, sender: "student", date: "2026-05-10", time: "09:00", text: "Will do. That lesson was actually really helpful — I've been using the breathing technique before practice tests." },
    ],
  },
  // ── Maya Williams (id:6) — missed session, 2 unread ──────────────────────
  {
    id: 4, studentId: 6, unreadCount: 2,
    messages: [
      { id: 18, sender: "staff",   date: "2026-05-10", time: "14:00", text: "Hi Maya, I noticed you missed our check-in session yesterday. Is everything okay?" },
      { id: 19, sender: "student", date: "2026-05-11", time: "10:20", text: "I'm sorry about that! I had a family situation come up. Can we reschedule?" },
      { id: 20, sender: "staff",   date: "2026-05-11", time: "11:00", text: "Of course, no worries. I have openings Tuesday or Thursday this week — does either work?" },
      { id: 21, sender: "student", date: "2026-05-13", time: "17:45", text: "Thursday at 2pm works great for me!" },
      { id: 22, sender: "student", date: "2026-05-14", time: "10:00", text: "Just confirming Thursday 2pm — see you then!" },
    ],
  },
  // ── Tyler Brooks (id:13) — internship advice, 0 unread ───────────────────
  {
    id: 5, studentId: 13, unreadCount: 0,
    messages: [
      { id: 23, sender: "student", date: "2026-05-08", time: "16:00", text: "Hi Dr. Okafor! I got a call back from the internship I applied to. Do you have any tips for the interview?" },
      { id: 24, sender: "staff",   date: "2026-05-08", time: "16:45", text: "Tyler, that's fantastic news! Yes — make sure you review your resume bullet points so you can speak to each one. Do you want to do a quick mock interview?" },
      { id: 25, sender: "student", date: "2026-05-08", time: "17:10", text: "That would be amazing. I'm free Monday morning or Wednesday afternoon." },
      { id: 26, sender: "staff",   date: "2026-05-09", time: "08:30", text: "Monday at 10am works for me. I'll send a calendar invite. Come ready with your top 3 strengths!" },
      { id: 27, sender: "student", date: "2026-05-09", time: "09:00", text: "Done! See you Monday. Thank you so much 🙏" },
    ],
  },
  // ── Marcus Thompson (id:3) — grade concern, 1 unread ─────────────────────
  {
    id: 6, studentId: 3, unreadCount: 1,
    messages: [
      { id: 28, sender: "staff",   date: "2026-05-05", time: "10:30", text: "Hi Marcus, I saw your engagement score has dipped a bit this month. Anything going on that I should know about?" },
      { id: 29, sender: "student", date: "2026-05-05", time: "13:00", text: "Yeah, I've been struggling with one of my courses. The midterm didn't go well and I've been pretty discouraged." },
      { id: 30, sender: "staff",   date: "2026-05-06", time: "09:15", text: "I hear you. Let's talk through it — sometimes one grade doesn't reflect what you're capable of. Can you meet this week?" },
      { id: 31, sender: "student", date: "2026-05-12", time: "11:30", text: "I met with my professor during office hours and she offered a makeup assignment. Feeling better about it now!" },
    ],
  },
  // ── Destiny Robinson (id:10) — lesson question, 0 unread ─────────────────
  {
    id: 7, studentId: 10, unreadCount: 0,
    messages: [
      { id: 32, sender: "student", date: "2026-05-11", time: "15:20", text: "Hi Dr. Okafor! I finished the 'Building Study Groups' lesson and I was wondering — do you know if there are any study groups already formed for accounting?" },
      { id: 33, sender: "staff",   date: "2026-05-11", time: "16:00", text: "Great question! I'll check with the tutoring center and get back to you. In the meantime, the peer communication script in your library has a good template for reaching out to classmates." },
      { id: 34, sender: "student", date: "2026-05-11", time: "16:30", text: "Oh perfect, I'll use that. Thank you!" },
      { id: 35, sender: "staff",   date: "2026-05-12", time: "09:00", text: "Just checked — the tutoring center has a study group forming this Friday at 3pm. Room 204 in the library. Thought you might want to join!" },
      { id: 36, sender: "student", date: "2026-05-12", time: "09:45", text: "That's perfect, I'll be there. You're the best 😊" },
    ],
  },
  // ── Kwame Asante (id:8) — rising star check-in, 0 unread ─────────────────
  {
    id: 8, studentId: 8, unreadCount: 0,
    messages: [
      { id: 37, sender: "staff",   date: "2026-05-13", time: "10:00", text: "Kwame! I just reviewed your progress this month and your engagement score is one of the highest in the cohort. Really impressive work." },
      { id: 38, sender: "student", date: "2026-05-13", time: "12:15", text: "Thank you so much! I've been putting in a lot of effort this semester. The goal-setting lesson really changed how I approach my week." },
      { id: 39, sender: "staff",   date: "2026-05-13", time: "13:00", text: "It shows. Have you thought about applying for the peer mentor program next year? I think you'd be a great fit." },
      { id: 40, sender: "student", date: "2026-05-13", time: "14:30", text: "I hadn't thought about it but that actually sounds really cool. Can you send me more info?" },
      { id: 41, sender: "staff",   date: "2026-05-13", time: "15:00", text: "Absolutely — I'll forward the application details. Deadline is June 1st so you have time." },
      { id: 42, sender: "student", date: "2026-05-13", time: "15:20", text: "Amazing, thank you! I'll look it over this weekend." },
    ],
  },
];

// ─── Program health delta (mock month-over-month change) ─────────────────────

export const PROGRAM_HEALTH_DELTA            = 6;  // +6 pts since last month
export const MOCK_LESSONS_COMPLETED          = 52; // out of 84 assigned to activated students (~62%)
export const MOCK_ACTIVITIES_OVERDUE         = 27;
export const MOCK_ACTIVITIES_RESOLVED_WEEK   = 12;

// ─── Mock "today" reference date ─────────────────────────────────────────────
// All UI that needs "today" should read from here, not hardcode dates.

export const MOCK_TODAY = { year: 2026, month: 4 /* 0-indexed, May */, day: 14 };

// ─── Calendar events ──────────────────────────────────────────────────────────

export type CalendarEvent = {
  id:        number;
  title:     string;
  date:      string; // ISO date
  timeLabel: string;
};

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 1, title: "SAS Drop-In Hours",          date: "2026-05-14", timeLabel: "10:00–12:00" },
  { id: 2, title: "Financial Aid Deadline",      date: "2026-05-15", timeLabel: "by 5:00 PM"  },
  { id: 3, title: "Disability Services Meeting", date: "2026-05-20", timeLabel: "2:00–3:30"   },
  { id: 4, title: "Academic Advising Day",       date: "2026-05-21", timeLabel: "9:00–4:00"   },
  { id: 5, title: "End of Semester Check-In",    date: "2026-05-28", timeLabel: "1:00–2:00"   },
  { id: 6, title: "Graduation Rehearsal",        date: "2026-05-30", timeLabel: "10:00–1:00"  },
];

// ─── Graph data (0–100 scale) ─────────────────────────────────────────────────

export type GraphViewKey = "week" | "month" | "semester";
export type GraphPoint   = { label: string; value: number };

export const ENGAGEMENT_DATA: Record<GraphViewKey, GraphPoint[]> = {
  week: [
    { label: "Mon", value: 71 }, { label: "Tue", value: 76 }, { label: "Wed", value: 83 },
    { label: "Thu", value: 88 }, { label: "Fri", value: 79 }, { label: "Sat", value: 62 },
    { label: "Sun", value: 58 },
  ],
  month: [
    { label: "Wk 1", value: 68 }, { label: "Wk 2", value: 73 }, { label: "Wk 3", value: 81 },
    { label: "Wk 4", value: 88 }, { label: "Wk 5", value: 94 },
  ],
  semester: [
    { label: "Jan", value: 34 }, { label: "Feb", value: 52 }, { label: "Mar", value: 68 },
    { label: "Apr", value: 79 }, { label: "May", value: 91 },
  ],
};

export const COMPLETION_DATA: Record<GraphViewKey, GraphPoint[]> = {
  week: [
    { label: "Mon", value: 45 }, { label: "Tue", value: 52 }, { label: "Wed", value: 61 },
    { label: "Thu", value: 74 }, { label: "Fri", value: 68 }, { label: "Sat", value: 41 },
    { label: "Sun", value: 33 },
  ],
  month: [
    { label: "Wk 1", value: 52 }, { label: "Wk 2", value: 61 }, { label: "Wk 3", value: 70 },
    { label: "Wk 4", value: 78 }, { label: "Wk 5", value: 82 },
  ],
  semester: [
    { label: "Jan", value: 28 }, { label: "Feb", value: 44 }, { label: "Mar", value: 58 },
    { label: "Apr", value: 69 }, { label: "May", value: 79 },
  ],
};

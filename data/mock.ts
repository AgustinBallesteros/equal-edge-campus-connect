// ─── Mock data — April 2026 week ─────────────────────────────────────────────

export type SubTask = { label: string; minutes: number | null };

export type TaskEntry = {
  kind: "task";
  id: string; title: string; accentColor: string;
  tasks?: SubTask[];
  initialDoneMap?: Record<number, boolean>;
  initialChecked?: boolean;
};
export type TimedEntry = {
  kind: "timed";
  id: string; title: string; timeRange: string;
  avatarColor: string;
  tasks?: SubTask[];
  initialDoneMap?: Record<number, boolean>;
};
export type GapEntry = { kind: "gap"; id: string; label: string };
export type PlannedEntry = TimedEntry | GapEntry;

export const DAY_CONTENT: Record<number, { anytime: TaskEntry[]; planned: PlannedEntry[] }> = {
  // ── Sunday ──────────────────────────────────────────────────────────────────
  // Pre-seeded ~75% (11/15 done)
  5: {
    anytime: [
      {
        kind: "task", id: "sun-journal", title: "Journal morning thoughts", accentColor: "#A78BFA",
        tasks: [
          { label: "Write 3 things you're grateful for", minutes: 5  },
          { label: "Reflect on yesterday's wins",        minutes: 5  },
          { label: "Set an intention for the week",      minutes: 5  },
        ],
        initialDoneMap: { 0: true, 1: true }, // 2 / 3
      },
      {
        kind: "task", id: "sun-walk", title: "Evening walk", accentColor: "#34D399",
        tasks: [], initialChecked: true,      // 1 / 1
      },
      {
        kind: "task", id: "sun-reading", title: "Catch up on reading", accentColor: "#F59E0B",
        tasks: [
          { label: "Read assigned chapter",   minutes: 20 },
          { label: "Take brief notes",        minutes: 10 },
          { label: "Look up unfamiliar terms",minutes: 5  },
          { label: "Review chapter summary",  minutes: 5  },
        ],
        initialDoneMap: { 0: true, 1: true, 2: true }, // 3 / 4
      },
    ],
    planned: [
      {
        kind: "timed", id: "sun-yoga", title: "Morning yoga",
        timeRange: "8:00AM → 8:45 AM", avatarColor: "#F472B6",
        tasks: [
          { label: "Warm-up stretches",           minutes: 5  },
          { label: "Sun salutation flow",          minutes: 15 },
          { label: "Core and balance work",        minutes: 15 },
          { label: "Cool-down and breathing",      minutes: 10 },
        ],
        initialDoneMap: { 0: true, 1: true, 2: true }, // 3 / 4
      },
      { kind: "gap", id: "sun-gap-2hr", label: "2:15hr gap" },
      {
        kind: "timed", id: "sun-grocery", title: "Grocery run",
        timeRange: "11:00AM → 12:00 PM", avatarColor: "#4ADE80",
        tasks: [
          { label: "Write shopping list",          minutes: 5  },
          { label: "Check pantry for stock",       minutes: 5  },
          { label: "Drive to store and shop",      minutes: 40 },
        ],
        initialDoneMap: { 0: true, 1: true }, // 2 / 3
      },
    ],
  },

  // ── Monday (current day) ─────────────────────────────────────────────────────
  6: {
    anytime: [
      {
        kind: "task", id: "card-biology-study", title: "Biology study", accentColor: "#7BC875",
        tasks: [
          { label: "Review chapter notes",             minutes: 15 },
          { label: "Read assigned textbook pages",     minutes: 20 },
          { label: "Watch lecture recap video",        minutes: 10 },
          { label: "Solve practice problems",          minutes: 15 },
          { label: "Review diagrams and figures",      minutes: 10 },
          { label: "Write key term definitions",       minutes: 10 },
          { label: "Complete practice quiz",           minutes: 15 },
          { label: "Review quiz answers",              minutes: 5  },
        ],
      },
      {
        kind: "task", id: "card-math-prep", title: "Math prep", accentColor: "#D1AB30",
        tasks: [
          { label: "Review class notes",               minutes: 10 },
          { label: "Read textbook section",            minutes: 15 },
          { label: "Watch tutorial video",             minutes: 10 },
          { label: "Solve example problems",           minutes: 20 },
          { label: "Check answers and correct errors", minutes: 10 },
          { label: "Complete assigned exercises",      minutes: 25 },
          { label: "Review formulas and theorems",     minutes: 10 },
          { label: "Practice mental math",             minutes: 5  },
          { label: "Prepare questions for tutor",      minutes: 5  },
          { label: "Summarize key concepts",           minutes: 5  },
          { label: "Test yourself with flashcards",    minutes: 10 },
        ],
      },
      {
        kind: "task", id: "card-reading", title: "15 min reading", accentColor: "#A6A6A6",
        tasks: [],
      },
    ],
    planned: [
      {
        kind: "timed", id: "card-go-for-a-run", title: "Go for a run",
        timeRange: "8:00AM → 9:00 AM", avatarColor: "#7BC875",
        tasks: [
          { label: "Put on running shoes and gear",                    minutes: 4  },
          { label: "Check route conditions and set a distance goal",   minutes: 5  },
          { label: "Start with an easy trail jog",                     minutes: 20 },
          { label: "Rehydrate with a few sips of water",               minutes: 5  },
          { label: "Push effort on bleachers",                         minutes: 16 },
          { label: "Maintain steady breathing and form",               minutes: null },
          { label: "Finish with a short recovery walk",                minutes: 10 },
        ],
      },
      { kind: "gap", id: "gap-1hr", label: "1:00hr gap" },
      {
        kind: "timed", id: "card-biology-class", title: "Biology class",
        timeRange: "10:00AM → 11:00 AM", avatarColor: "#558BF7",
        tasks: [
          { label: "Review last lecture notes",          minutes: 10   },
          { label: "Complete assigned reading",          minutes: 20   },
          { label: "Prepare questions for professor",    minutes: 5    },
          { label: "Participate in class discussion",    minutes: null },
          { label: "Write a brief post-class summary",   minutes: 10   },
          { label: "Schedule office hours if needed",    minutes: 5    },
          { label: "Update study calendar",              minutes: 5    },
          { label: "Start homework outline",             minutes: 5    },
        ],
      },
      { kind: "gap", id: "gap-30min", label: "30min gap" },
      {
        kind: "timed", id: "card-clean-dorm", title: "Clean dorm room",
        timeRange: "11:30AM → 12:00 PM", avatarColor: "#A6A6A6",
        tasks: [
          { label: "Clear desk and put away books",  minutes: 5    },
          { label: "Make the bed",                   minutes: 3    },
          { label: "Vacuum or sweep the floor",      minutes: 7    },
          { label: "Take out the trash",             minutes: 2    },
          { label: "Wipe down surfaces",             minutes: 5    },
          { label: "Organize closet",                minutes: 8    },
          { label: "Do laundry",                     minutes: null },
          { label: "Restock supplies",               minutes: 5    },
        ],
      },
    ],
  },

  // ── Tuesday ──────────────────────────────────────────────────────────────────
  7: {
    anytime: [
      {
        kind: "task", id: "tue-chem-study", title: "Chemistry study", accentColor: "#60C6E8",
        tasks: [
          { label: "Review lecture slides",              minutes: 15 },
          { label: "Read textbook chapter",              minutes: 20 },
          { label: "Re-do sample problems",              minutes: 20 },
          { label: "Highlight key equations",            minutes: 10 },
          { label: "Write summary card",                 minutes: 10 },
        ],
      },
      {
        kind: "task", id: "tue-essay", title: "Draft essay outline", accentColor: "#F87171",
        tasks: [
          { label: "Re-read the prompt",                 minutes: 5  },
          { label: "Brainstorm main arguments",          minutes: 15 },
          { label: "Research supporting evidence",       minutes: 25 },
          { label: "Build section outline",              minutes: 15 },
          { label: "Write thesis statement",             minutes: 10 },
        ],
      },
    ],
    planned: [
      {
        kind: "timed", id: "tue-chem-lab", title: "Chemistry lab",
        timeRange: "9:00AM → 11:00 AM", avatarColor: "#60C6E8",
        tasks: [
          { label: "Review lab safety protocols",        minutes: 5  },
          { label: "Set up equipment",                   minutes: 10 },
          { label: "Run experiment procedure",           minutes: 50 },
          { label: "Record observations",                minutes: 15 },
          { label: "Clean and return equipment",         minutes: 10 },
          { label: "Start lab report",                   minutes: 20 },
        ],
      },
      { kind: "gap", id: "tue-gap-2hr", label: "2:00hr gap" },
      {
        kind: "timed", id: "tue-study-group", title: "Study group",
        timeRange: "1:00PM → 2:30 PM", avatarColor: "#A78BFA",
        tasks: [
          { label: "Prepare discussion questions",       minutes: 10 },
          { label: "Review each member's notes",         minutes: 20 },
          { label: "Work through practice problems",     minutes: 40 },
          { label: "Assign follow-up tasks",             minutes: 10 },
        ],
      },
    ],
  },

  // ── Wednesday ────────────────────────────────────────────────────────────────
  1: {
    anytime: [
      {
        kind: "task", id: "wed-history", title: "History reading", accentColor: "#C084FC",
        tasks: [
          { label: "Read chapter 7",                     minutes: 30 },
          { label: "Annotate key passages",              minutes: 15 },
          { label: "Write a one-page summary",           minutes: 20 },
          { label: "Connect to class lecture",           minutes: 10 },
        ],
      },
      {
        kind: "task", id: "wed-laundry", title: "Do laundry", accentColor: "#94A3B8",
        tasks: [],
      },
    ],
    planned: [
      {
        kind: "timed", id: "wed-gym", title: "Gym workout",
        timeRange: "7:00AM → 8:00 AM", avatarColor: "#F97316",
        tasks: [
          { label: "5 min warm-up on treadmill",         minutes: 5  },
          { label: "Upper body compound lifts",          minutes: 25 },
          { label: "Core circuit",                       minutes: 15 },
          { label: "Cool-down stretch",                  minutes: 10 },
        ],
      },
      { kind: "gap", id: "wed-gap-3hr", label: "3:00hr gap" },
      {
        kind: "timed", id: "wed-stats-class", title: "Statistics class",
        timeRange: "11:00AM → 12:00 PM", avatarColor: "#558BF7",
        tasks: [
          { label: "Review homework before class",       minutes: 10 },
          { label: "Take detailed lecture notes",        minutes: 45 },
          { label: "Note any confusing topics",          minutes: 5  },
        ],
      },
    ],
  },

  // ── Thursday ─────────────────────────────────────────────────────────────────
  2: {
    anytime: [
      {
        kind: "task", id: "thu-physics", title: "Physics problem set", accentColor: "#38BDF8",
        tasks: [
          { label: "Read problem set instructions",      minutes: 5  },
          { label: "Attempt problems 1–5",               minutes: 30 },
          { label: "Review relevant formulas",           minutes: 10 },
          { label: "Attempt problems 6–10",              minutes: 30 },
          { label: "Check answers with solutions manual",minutes: 15 },
          { label: "Write up final solutions neatly",    minutes: 20 },
        ],
      },
      {
        kind: "task", id: "thu-email", title: "Email professor", accentColor: "#FB923C",
        tasks: [],
      },
    ],
    planned: [
      {
        kind: "timed", id: "thu-physics-lecture", title: "Physics lecture",
        timeRange: "10:00AM → 11:30 AM", avatarColor: "#38BDF8",
        tasks: [
          { label: "Review last class notes",            minutes: 10 },
          { label: "Listen and take notes",              minutes: 70 },
          { label: "Ask clarifying questions",           minutes: 10 },
        ],
      },
      { kind: "gap", id: "thu-gap-30min", label: "30min gap" },
      {
        kind: "timed", id: "thu-office-hours", title: "Office hours",
        timeRange: "12:00PM → 12:30 PM", avatarColor: "#A78BFA",
        tasks: [
          { label: "Prepare specific questions",         minutes: 5  },
          { label: "Discuss problem set issues",         minutes: 20 },
          { label: "Note professor's guidance",          minutes: 5  },
        ],
      },
    ],
  },

  // ── Friday ───────────────────────────────────────────────────────────────────
  3: {
    anytime: [
      {
        kind: "task", id: "fri-review", title: "Review week notes", accentColor: "#4ADE80",
        tasks: [
          { label: "Compile notes from each class",      minutes: 15 },
          { label: "Highlight unresolved questions",     minutes: 10 },
          { label: "Create a weekly summary page",       minutes: 20 },
          { label: "Flag topics to revisit over weekend",minutes: 5  },
        ],
      },
      {
        kind: "task", id: "fri-weekend-plan", title: "Weekend planning", accentColor: "#FACC15",
        tasks: [
          { label: "List weekend priorities",            minutes: 5  },
          { label: "Block study time on calendar",       minutes: 5  },
          { label: "Plan social or rest activity",       minutes: 5  },
        ],
      },
    ],
    planned: [
      {
        kind: "timed", id: "fri-stats-lab", title: "Stats lab",
        timeRange: "9:00AM → 10:00 AM", avatarColor: "#558BF7",
        tasks: [
          { label: "Open dataset in R/Python",           minutes: 5  },
          { label: "Run assigned analyses",              minutes: 30 },
          { label: "Interpret output",                   minutes: 15 },
          { label: "Write brief lab summary",            minutes: 10 },
        ],
      },
      { kind: "gap", id: "fri-gap-2hr", label: "2:00hr gap" },
      {
        kind: "timed", id: "fri-club", title: "Campus club meeting",
        timeRange: "12:00PM → 1:00 PM", avatarColor: "#F472B6",
        tasks: [
          { label: "Review meeting agenda",              minutes: 5  },
          { label: "Attend and take notes",              minutes: 45 },
          { label: "Follow up on action items",          minutes: 10 },
        ],
      },
    ],
  },

  // ── Saturday ─────────────────────────────────────────────────────────────────
  4: {
    anytime: [
      {
        kind: "task", id: "sat-clean", title: "Deep clean room", accentColor: "#94A3B8",
        tasks: [
          { label: "Declutter desk and shelves",         minutes: 15 },
          { label: "Wipe down all surfaces",             minutes: 10 },
          { label: "Vacuum and mop floor",               minutes: 15 },
          { label: "Organise wardrobe",                  minutes: 20 },
          { label: "Take out trash and recycling",       minutes: 5  },
        ],
      },
      {
        kind: "task", id: "sat-mealprep", title: "Meal prep", accentColor: "#34D399",
        tasks: [
          { label: "Plan meals for the week",            minutes: 10 },
          { label: "Write grocery list",                 minutes: 5  },
          { label: "Cook grains and proteins",           minutes: 40 },
          { label: "Chop and store vegetables",          minutes: 20 },
          { label: "Portion into containers",            minutes: 10 },
        ],
      },
    ],
    planned: [
      {
        kind: "timed", id: "sat-run", title: "Morning run",
        timeRange: "7:00AM → 8:00 AM", avatarColor: "#7BC875",
        tasks: [
          { label: "Dynamic warm-up",                    minutes: 5  },
          { label: "Easy 5 km run",                      minutes: 30 },
          { label: "Sprint intervals",                   minutes: 10 },
          { label: "Cool-down walk and stretch",         minutes: 10 },
        ],
      },
      { kind: "gap", id: "sat-gap-4hr", label: "4:00hr gap" },
      {
        kind: "timed", id: "sat-library", title: "Library study session",
        timeRange: "12:00PM → 3:00 PM", avatarColor: "#D1AB30",
        tasks: [
          { label: "Arrive and set up workspace",        minutes: 5  },
          { label: "Work through priority assignments",  minutes: 90 },
          { label: "Take a 10-min break",                minutes: 10 },
          { label: "Continue with secondary tasks",      minutes: 50 },
          { label: "Pack up and review tomorrow's plan", minutes: 5  },
        ],
      },
    ],
  },

  // ── Wednesday Apr 8 ─────────────────────────────────────────────────────────
  8: {
    anytime: [
      {
        kind: "task", id: "wed8-review", title: "Review lecture slides", accentColor: "#818CF8",
        tasks: [
          { label: "Re-read Biology slides",          minutes: 15 },
          { label: "Highlight key diagrams",          minutes: 10 },
          { label: "Write summary notes",             minutes: 10 },
        ],
      },
      {
        kind: "task", id: "wed8-flashcards", title: "Make flashcards", accentColor: "#F59E0B",
        tasks: [
          { label: "Create cards for new terms",      minutes: 20 },
          { label: "Review previous deck",            minutes: 10 },
        ],
      },
    ],
    planned: [
      {
        kind: "timed", id: "wed8-gym", title: "Gym session",
        timeRange: "7:30AM → 8:30 AM", avatarColor: "#F97316",
        tasks: [
          { label: "Warm-up cardio",                  minutes: 10 },
          { label: "Upper body strength sets",        minutes: 30 },
          { label: "Core circuit",                    minutes: 10 },
          { label: "Cool-down stretch",               minutes: 10 },
        ],
      },
      { kind: "gap", id: "wed8-gap-2hr", label: "2:00hr gap" },
      {
        kind: "timed", id: "wed8-bio-lab", title: "Biology lab",
        timeRange: "10:30AM → 12:30 PM", avatarColor: "#34D399",
        tasks: [
          { label: "Read pre-lab instructions",       minutes: 10 },
          { label: "Set up equipment",                minutes: 10 },
          { label: "Run experiment",                  minutes: 60 },
          { label: "Record results and clean up",     minutes: 20 },
        ],
      },
      { kind: "gap", id: "wed8-gap-3hr", label: "3:00hr gap" },
      {
        kind: "timed", id: "wed8-tutoring", title: "Peer tutoring — Calculus",
        timeRange: "3:30PM → 4:30 PM", avatarColor: "#A78BFA",
        tasks: [
          { label: "Review problem sets together",    minutes: 30 },
          { label: "Work through tricky integrals",  minutes: 20 },
          { label: "Summarise key methods",           minutes: 10 },
        ],
      },
    ],
  },

  // ── Thursday Apr 9 ──────────────────────────────────────────────────────────
  9: {
    anytime: [
      {
        kind: "task", id: "thu9-essay", title: "Essay draft — History", accentColor: "#F472B6",
        tasks: [
          { label: "Outline argument structure",      minutes: 15 },
          { label: "Write introduction paragraph",   minutes: 20 },
          { label: "Draft body paragraphs",          minutes: 40 },
          { label: "Add citations",                  minutes: 15 },
        ],
      },
      {
        kind: "task", id: "thu9-email", title: "Reply to professor email", accentColor: "#60A5FA",
        tasks: [
          { label: "Read professor's feedback",      minutes: 5  },
          { label: "Draft reply",                    minutes: 10 },
          { label: "Proofread and send",             minutes: 5  },
        ],
      },
    ],
    planned: [
      {
        kind: "timed", id: "thu9-physics", title: "Physics lecture",
        timeRange: "9:00AM → 10:30 AM", avatarColor: "#38BDF8",
        tasks: [
          { label: "Review previous notes before class", minutes: 10 },
          { label: "Attend and take notes",           minutes: 75 },
          { label: "Summarise key equations",         minutes: 5  },
        ],
      },
      { kind: "gap", id: "thu9-gap-90min", label: "1:30hr gap" },
      {
        kind: "timed", id: "thu9-office", title: "Office hours — Physics",
        timeRange: "12:00PM → 1:00 PM", avatarColor: "#FB923C",
        tasks: [
          { label: "Prepare questions in advance",   minutes: 10 },
          { label: "Discuss problem set doubts",     minutes: 40 },
          { label: "Note down professor's hints",    minutes: 10 },
        ],
      },
      { kind: "gap", id: "thu9-gap-3hr", label: "3:00hr gap" },
      {
        kind: "timed", id: "thu9-study-group", title: "Study group — Chemistry",
        timeRange: "4:00PM → 5:30 PM", avatarColor: "#4ADE80",
        tasks: [
          { label: "Assign topics to each member",   minutes: 5  },
          { label: "Present individual summaries",   minutes: 50 },
          { label: "Solve practice problems together", minutes: 35 },
        ],
      },
    ],
  },

  // ── Friday Apr 10 ───────────────────────────────────────────────────────────
  10: {
    anytime: [
      {
        kind: "task", id: "fri10-plan", title: "Weekend planning", accentColor: "#34D399",
        tasks: [
          { label: "List pending assignments",       minutes: 10 },
          { label: "Block study time on calendar",   minutes: 5  },
          { label: "Plan one fun activity",          minutes: 5  },
        ],
      },
      {
        kind: "task", id: "fri10-laundry", title: "Do laundry", accentColor: "#F59E0B",
        tasks: [
          { label: "Sort clothes by colour",        minutes: 5  },
          { label: "Run wash cycle",                minutes: 40 },
          { label: "Dry and fold",                  minutes: 20 },
        ],
      },
    ],
    planned: [
      {
        kind: "timed", id: "fri10-stats-lab", title: "Stats lab",
        timeRange: "10:00AM → 11:30 AM", avatarColor: "#818CF8",
        tasks: [
          { label: "Open dataset and verify import", minutes: 10 },
          { label: "Run regression analysis",       minutes: 30 },
          { label: "Interpret output",              minutes: 20 },
          { label: "Write lab report section",      minutes: 30 },
        ],
      },
      { kind: "gap", id: "fri10-gap-90min", label: "1:30hr gap" },
      {
        kind: "timed", id: "fri10-club", title: "Academic club meeting",
        timeRange: "1:00PM → 2:00 PM", avatarColor: "#F472B6",
        tasks: [
          { label: "Catch up on announcements",     minutes: 10 },
          { label: "Participate in discussion",     minutes: 40 },
          { label: "Volunteer for next event",      minutes: 10 },
        ],
      },
      { kind: "gap", id: "fri10-gap-4hr", label: "4:00hr gap" },
      {
        kind: "timed", id: "fri10-dinner", title: "Dinner with friends",
        timeRange: "6:00PM → 7:30 PM", avatarColor: "#FCD34D",
        tasks: [
          { label: "Pick a restaurant",             minutes: 5  },
          { label: "Enjoy the meal",                minutes: 60 },
          { label: "Split the bill",                minutes: 5  },
        ],
      },
    ],
  },
};

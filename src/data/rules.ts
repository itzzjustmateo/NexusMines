export type Rule = {
  id: string;
  title: string;
  desc: string;
  icon?: string;
};

export type RuleCategory = {
  id: string;
  title: string;
  icon: string;
  rules: Rule[];
};

export const rules: RuleCategory[] = [
  {
    id: "general",
    title: "General Conduct",
    icon: "Shield",
    rules: [
      {
        "id": "1",
        "title": "No cheating, hacking, or unfair modifications.",
        "desc": "Play fair. Mods or clients that give unfair advantages are strictly forbidden.",
        "icon": "ShieldAlert"
      },
      {
        "id": "2",
        "title": "Respect all players and staff.",
        "desc": "Treat everyone with kindness and maturity. Harassment, hate speech, or toxicity won't be tolerated.",
        "icon": "UserCheck"
      },
      {
        "id": "7",
        "title": "Use common sense.",
        "desc": "If it feels wrong or harmful, it probably is. Not every rule can be written down—play responsibly.",
        "icon": "Brain"
      },
      {
        "id": "8",
        "title": "Staff decisions are final.",
        "desc": "Respect the judgment of our team. If you disagree, discuss politely and responsibly via our support channels.",
        "icon": "Gavel"
      }
    ]
  },
  {
    id: "gameplay",
    title: "Gameplay",
    icon: "Gamepad2",
    rules: [
      {
        "id": "3",
        "title": "No griefing or exploiting bugs.",
        "desc": "Exploiting glitches or intentionally ruining experiences for others is not allowed. Report bugs to staff.",
        "icon": "BugOff"
      },
      {
        "id": "5",
        "title": "No lag machines or intentional server stress.",
        "desc": "Creating devices or behaviors designed to lag the server or crash instances is strictly prohibited.",
        "icon": "Zap"
      },
      {
        "id": "6",
        "title": "No real-money trading (RMT).",
        "desc": "Trading in-game items or services for real-world currency is not allowed and will result in a permanent ban.",
        "icon": "Coins"
      }
    ]
  },
  {
    id: "chat",
    title: "Chat & Communication",
    icon: "MessageSquare",
    rules: [
      {
        "id": "4",
        "title": "No spamming or advertising.",
        "desc": "Keep chat clean and relevant. No server ads, self-promotion, or message flooding.",
        "icon": "MegaphoneOff"
      }
    ]
  }
];
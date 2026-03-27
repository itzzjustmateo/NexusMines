export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  publishedAt: string;
  tags: string[];
};

export const blogPosts: BlogPost[] = [
  {
    "slug": "welcome-to-nexusmines",
    "title": "Welcome to NexusMines",
    "excerpt": "We're excited to announce the launch of our new minecraft server!",
    "content": "<p>Welcome to <strong>NexusMines</strong>!</p><p>We're thrilled to have you here. Our server offers a unique gameplay experience with custom features, active community, and endless fun.</p><h2>What makes us special?</h2><ul><li>Custom gameplay mechanics</li><li>Friendly community</li><li>Regular events and updates</li></ul><p>Join us today and start your adventure!</p>",
    "coverImage": "",
    "author": "NexusMines Team",
    "publishedAt": "2026-03-16",
    "tags": [
      "announcement",
      "welcome"
    ]
  },
  {
    "slug": "server-rules-update",
    "title": "Server Rules Update",
    "excerpt": "We've updated our rules to ensure a better gameplay experience for everyone.",
    "content": "<p>We've made some important changes to our server rules:</p><ul><li>Updated chat guidelines</li><li>New griefing policies</li><li>Clearer consequences for violations</li></ul><p>Please take a moment to review the updated rules on our Rules page.</p>",
    "author": "NexusMines Team",
    "publishedAt": "2026-03-15",
    "tags": [
      "rules",
      "update"
    ]
  }
];

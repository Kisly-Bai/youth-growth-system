// 模拟动态数据
export const mockPosts = [
  {
    id: 1,
    author: {
      name: '张明',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
      level: '高三',
      school: '市重点中学'
    },
    content: '今天完成了数学竞赛的集训，分享一些解题技巧：\n1. 函数问题要特别注意定义域\n2. 几何题要善于运用辅助线\n3. 概率题要理清事件关系\n\n希望对大家有帮助！',
    images: ['https://img.yzcdn.cn/vant/cat.jpeg'],
    likes: 128,
    comments: 32,
    shares: 15,
    tags: ['数学竞赛', '学习经验'],
    createdAt: '2024-02-20 14:30:00'
  },
  {
    id: 2,
    author: {
      name: '李华',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
      level: '高二',
      school: '省重点中学'
    },
    content: '英语四级考试备考经验分享：\n1. 听力训练：每天听15分钟英语新闻\n2. 阅读练习：从简单文章开始，逐步提高难度\n3. 写作积累：背诵常用句型和范文\n4. 口语练习：大声朗读或找伙伴对话\n\n大家一起加油！',
    images: [],
    likes: 256,
    comments: 48,
    shares: 28,
    tags: ['英语学习', '考试经验'],
    createdAt: '2024-02-20 13:15:00'
  }
];

// 模拟学习小组数据
export const mockGroups = [
  {
    id: 1,
    name: '高中数学竞赛小组',
    description: '分享数学竞赛经验，讨论解题方法，组织线上学习活动',
    cover: 'https://img.yzcdn.cn/vant/cat.jpeg',
    members: 128,
    posts: 256,
    tags: ['数学竞赛', '学习小组'],
    isJoined: true
  },
  {
    id: 2,
    name: '英语口语练习营',
    description: '每天进行英语口语练习，分享学习资源，互相督促进步',
    cover: 'https://img.yzcdn.cn/vant/cat.jpeg',
    members: 96,
    posts: 180,
    tags: ['英语学习', '口语练习'],
    isJoined: false
  }
];

// 模拟问题数据
export const mockQuestions = [
  {
    id: 1,
    title: '如何解决二次方程的根的问题？',
    content: '在做二次方程题目时，经常遇到求根的问题，有什么好的解题思路吗？',
    author: {
      name: '王同学',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg'
    },
    answers: 5,
    views: 128,
    tags: ['数学', '二次方程'],
    createdAt: '2024-02-20 10:30:00'
  },
  {
    id: 2,
    title: '英语听力提高方法',
    content: '听力一直是弱项，想请教大家有什么好的提高方法？',
    author: {
      name: '李同学',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg'
    },
    answers: 8,
    views: 256,
    tags: ['英语', '听力'],
    createdAt: '2024-02-20 09:15:00'
  }
];

// 模拟资源数据
export const mockResources = [
  {
    id: 1,
    title: '高中数学竞赛真题解析',
    type: 'pdf',
    size: '2.5MB',
    downloads: 128,
    rating: 4.8,
    tags: ['数学竞赛', '真题解析'],
    author: {
      name: '张老师',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg'
    },
    createdAt: '2024-02-20 08:30:00'
  },
  {
    id: 2,
    title: '英语四级听力训练材料',
    type: 'audio',
    size: '15MB',
    downloads: 256,
    rating: 4.6,
    tags: ['英语', '听力训练'],
    author: {
      name: '李老师',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg'
    },
    createdAt: '2024-02-20 07:15:00'
  }
];

// 模拟活动数据
export const mockEvents = [
  {
    id: 1,
    title: '数学竞赛经验分享会',
    description: '邀请数学竞赛获奖者分享备考经验和解题技巧',
    date: '2024-02-25 14:00:00',
    location: '线上直播',
    participants: 128,
    maxParticipants: 200,
    tags: ['数学竞赛', '经验分享'],
    organizer: {
      name: '数学竞赛小组',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg'
    }
  },
  {
    id: 2,
    title: '英语口语角',
    description: '每周一次的英语口语练习活动，提高口语表达能力',
    date: '2024-02-26 19:00:00',
    location: '线上会议',
    participants: 96,
    maxParticipants: 150,
    tags: ['英语学习', '口语练习'],
    organizer: {
      name: '英语口语练习营',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg'
    }
  }
]; 
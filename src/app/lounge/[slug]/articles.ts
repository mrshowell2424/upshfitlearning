/**
 * The lounge articles, lifted out of the page component.
 *
 * They used to live inside a 'use client' file, which meant the server could
 * not read them -- so every article previewed under the section's title
 * instead of its own, and a link to one newsletter piece looked exactly like
 * a link to another. Data is not UI; it belongs where both sides can reach
 * it, the same reason COURSE_COUNT moved out of the courses component.
 */
export const articles = {
  'spaced-repetition': {
    title: 'The Science of Spaced Repetition',
    category: 'Learning Science',
    readTime: '8 min read',
    content: `Spaced repetition is one of the most powerful techniques for improving long-term retention. Instead of cramming information all at once, spacing out your study sessions leads to dramatically better learning outcomes.

Research shows that when students review material at increasing intervals, they build stronger neural pathways and retain information much longer. This technique is backed by decades of cognitive psychology research.

How to implement spaced repetition in your classroom:
- Introduce new material
- Review after 1-2 days
- Review again after 1 week
- Final review after 1 month

This pattern creates the optimal spacing for long-term retention without wasting time on material students already know.`
  },
  'active-retrieval': {
    title: 'Active Retrieval Practice in the Classroom',
    category: 'Teaching Strategy',
    readTime: '10 min read',
    content: `Active retrieval practice—forcing students to pull information from memory rather than re-reading it—is one of the most effective learning strategies available. Yet many classrooms still rely on passive review methods.

When students actively retrieve information from memory, they strengthen that memory and prepare it for future use. This is far more effective than passive study methods like highlighting or re-reading.

Strategies for active retrieval:
- Use frequent low-stakes quizzes
- Ask students to explain concepts to peers
- Use free recall without notes
- Test across units to encourage cumulative learning

The testing effect is powerful: students who take tests learn more than students who study the same material.`
  },
  'metacognition': {
    title: 'Building Metacognitive Skills',
    category: 'Student Development',
    readTime: '7 min read',
    content: `Metacognition—thinking about thinking—is a critical skill that helps students become self-directed learners. Students with strong metacognitive skills can monitor their understanding and adjust their strategies accordingly.

When students develop metacognitive awareness, they become better at:
- Recognizing when they don't understand something
- Choosing appropriate learning strategies
- Monitoring their progress toward learning goals
- Adjusting their approach when something isn't working

Ways to build metacognitive skills:
- Ask students to explain their thinking process
- Have students predict their performance before assessments
- Use think-aloud modeling
- Encourage journaling about learning strategies
- Discuss what worked and what didn't after lessons`
  },
  'interleaving': {
    title: 'Interleaving: Mix It Up for Better Learning',
    category: 'Learning Science',
    readTime: '9 min read',
    content: `Interleaving—mixing different topics or types of problems during practice—improves student learning compared to blocked practice where one type of problem is practiced at a time.

Students often prefer blocked practice because it feels easier in the moment. However, this initial ease is misleading. Interleaving requires more cognitive effort, which leads to stronger learning.

Benefits of interleaving:
- Improved discrimination between problem types
- Better transfer to new problems
- Enhanced long-term retention
- Develops problem-solving flexibility

How to implement interleaving in your classroom:
- Mix problem types in homework and practice
- Vary topics across lessons
- Create mixed-topic quizzes
- Use problem sets with different types intermixed

The research is clear: students learn more when they experience varied problems in mixed order.`
  },
  'elaboration': {
    title: 'The Role of Elaboration in Learning',
    category: 'Teaching Strategy',
    readTime: '6 min read',
    content: `Elaboration—explaining why something is true and how it connects to other knowledge—deepens student understanding and improves retention. When students elaborate on new information, they build richer neural representations.

Elaboration works by connecting new information to existing knowledge. The more connections made, the more retrieval paths exist for the information, making it more accessible.

Techniques for promoting elaboration:
- Ask "why" and "how" questions frequently
- Have students explain concepts in their own words
- Connect new material to real-world examples
- Build concept maps showing relationships
- Have students teach the material to peers
- Encourage analogies and metaphors

When you ask students to elaborate, you're forcing them to think deeply about material, resulting in better understanding and longer-lasting memories.`
  },
  'growth-mindset': {
    title: 'Creating a Growth Mindset Culture',
    category: 'Student Development',
    readTime: '11 min read',
    content: `Students with a growth mindset—the belief that abilities can be developed through effort—achieve more than those with a fixed mindset. As an educator, you can cultivate this mindset in your classroom.

Research by Carol Dweck shows that students who believe intelligence can be developed work harder, persist longer, and achieve better outcomes. Your language and classroom practices shape how students think about their abilities.

Strategies for building a growth mindset classroom:
- Praise effort and strategies, not intelligence
- Use language like "not yet" instead of "can't"
- Celebrate mistakes as learning opportunities
- Highlight examples of people who improved through effort
- Teach about neuroplasticity
- Create low-stakes opportunities to struggle and learn
- Model growth mindset yourself

When students believe they can improve through effort, they embrace challenges rather than avoid them. This fundamental shift in perspective opens up a world of learning possibilities.`
  }
}

export type ArticleSlug = keyof typeof articles;

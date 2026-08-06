// @ts-nocheck
import { Anthropic } from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { standard_code, format, student_needs, blueprint, unpack } = await request.json();

    if (!standard_code || !format) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Say so plainly rather than failing as a generic error
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not set; cannot generate");
      return Response.json(
        { error: "Lesson generation isn't configured on this environment yet." },
        { status: 503 }
      );
    }

    const prompt = buildPrompt(standard_code, format, student_needs, blueprint, unpack);

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return Response.json(
        { error: "Unexpected response type" },
        { status: 500 }
      );
    }

    // Parse the generated content based on format
    const generated = parseGeneratedContent(format, content.text);

    return Response.json({
      success: true,
      format,
      content: generated,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return Response.json(
      { error: "Lesson generation failed" },
      { status: 500 }
    );
  }
}

function buildPrompt(
  standard_code: string,
  format: string,
  student_needs: string[],
  blueprint: any,
  unpack: any
): string {
  const efSupports = student_needs.includes("ef") ? "Include executive function supports (checklists, time management, step-by-step instructions)." : "";
  const visualSupports = student_needs.includes("visual") ? "Include visual supports (diagrams, color coding, graphic organizers)." : "";
  const languageLearners = student_needs.includes("language") ? "Use simplified language and include vocabulary support for English language learners." : "";
  const extensions = student_needs.includes("ext") ? "Include extension activities for advanced learners." : "";

  const supports = [efSupports, visualSupports, languageLearners, extensions]
    .filter(Boolean)
    .join(" ");

  // Flatten the authored blueprint/unpack into prompt-ready lines once, so each
  // format below reads the same facts.
  const verbs = (unpack?.verbs ?? []).map((v: any) => v.word ?? v).join(", ");
  const concepts = (unpack?.concepts ?? []).join(", ");
  const vocabulary = (unpack?.vocabulary ?? [])
    .map((v: any) => (typeof v === "string" ? v : v.term ?? v.word))
    .filter(Boolean)
    .join(", ");
  const mastery = unpack?.masteryStatement || "Master the standard";
  const ladder = (unpack?.ladder ?? []).map((r: any) => r.name ?? r).join(" → ");

  const lessonTitle = blueprint?.title ?? "Lesson";
  const route = [blueprint?.routeName, blueprint?.routeLine].filter(Boolean).join(" — ");
  const stepList = (blueprint?.steps ?? [])
    .map((s: any) => s.title)
    .filter(Boolean)
    .join(" → ");
  const efSupportList = (blueprint?.efSupports ?? []).join(", ");
  const successCriteria = (blueprint?.successCriteria ?? []).join("; ");

  if (format === "presentation") {
    return `Generate a Google Slides presentation outline for teaching ${standard_code}.

Standard: ${verbs} - understand ${concepts}

Lesson Blueprint:
- Lesson: ${lessonTitle}
- Success criteria: ${successCriteria}
- Instructional Route: ${route}
- Steps: ${stepList}
- Supports: ${efSupportList}

Student Customizations: ${supports}

Generate a JSON response with this exact structure (no markdown, just JSON):
{
  "title": "Lesson title",
  "slides": [
    {
      "number": 1,
      "title": "Slide title",
      "bullets": ["Point 1", "Point 2", "Point 3"],
      "notes": "Speaker notes for this slide"
    }
  ]
}

Create 8-10 slides that follow the lesson blueprint. Make slides visually engaging and teacher-friendly.`;
  }

  if (format === "document") {
    return `Generate a detailed lesson plan document outline for ${standard_code}.

Standard Learning: ${verbs}
Key Concepts: ${concepts}

Blueprint:
- Lesson: ${lessonTitle}
- Success criteria: ${successCriteria}
- Route: ${route}
- EF Supports: ${efSupportList}

Student Needs: ${supports}

Generate a JSON response with this exact structure (no markdown, just JSON):
{
  "title": "Lesson Plan Title",
  "sections": [
    {
      "heading": "Lesson Overview",
      "content": "Overview text"
    },
    {
      "heading": "Learning Objectives",
      "bullets": ["Objective 1", "Objective 2"]
    },
    {
      "heading": "Materials Needed",
      "bullets": ["Material 1", "Material 2"]
    },
    {
      "heading": "Detailed Lesson Steps",
      "steps": [
        {
          "step": 1,
          "title": "Step title",
          "timing": "5 min",
          "content": "Detailed instructions"
        }
      ]
    },
    {
      "heading": "Assessment",
      "content": "How to assess student learning"
    }
  ]
}

Create a comprehensive, grade-appropriate lesson plan.`;
  }

  if (format === "worksheet") {
    return `Generate a student worksheet for practicing ${standard_code}.

Learning Goal: ${mastery}
Concepts: ${concepts}
Vocabulary: ${vocabulary}

${supports}

Generate a JSON response with this exact structure (no markdown, just JSON):
{
  "title": "Worksheet Title",
  "instructions": "Clear instructions for students",
  "sections": [
    {
      "heading": "Section title",
      "type": "activity",
      "content": "Activity description or questions"
    }
  ],
  "answer_key_notes": "Notes for the teacher about correct answers"
}

Create an engaging, grade-appropriate worksheet with 3-4 activities that build skills progressively.`;
  }

  if (format === "assessment") {
    return `Generate an assessment rubric for evaluating student mastery of ${standard_code}.

Standard: ${verbs} - understand ${concepts}
Mastery Criteria: ${mastery}
Learning Ladder: ${ladder}

Generate a JSON response with this exact structure (no markdown, just JSON):
{
  "title": "Assessment Rubric",
  "description": "How to use this rubric",
  "criteria": [
    {
      "skill": "Skill being assessed",
      "proficiency_levels": [
        {
          "level": "Beginning",
          "descriptor": "What does beginning look like?"
        },
        {
          "level": "Developing",
          "descriptor": "What does developing look like?"
        },
        {
          "level": "Proficient",
          "descriptor": "What does proficient look like?"
        },
        {
          "level": "Advanced",
          "descriptor": "What does advanced look like?"
        }
      ]
    }
  ]
}

Create a 2-3 criteria rubric that clearly distinguishes proficiency levels and is easy for teachers to use.`;
  }

  return "";
}

function parseGeneratedContent(format: string, text: string): any {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { raw: text };
  } catch (e) {
    console.error("Parse error:", e);
    return { raw: text };
  }
}

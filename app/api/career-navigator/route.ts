import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { degree, experiences, interests, sector, sectorLabel } = await req.json();

    const sectorInstruction =
      sector === "all"
        ? "Include roles across pharma, NHS, health tech, CRO/consultancy, and government/regulation."
        : `PRIORITISE roles in: ${sectorLabel}. Only include roles from other sectors if they are an exceptionally strong fit.`;

    const prompt = `You are a specialist career advisor for STEM graduates entering the life sciences and healthcare industry. A student/early career professional has:
- Degree: ${degree}
- Experiences: ${experiences?.join(", ") || "none specified"}
- Interests: ${interests?.join(", ") || "none specified"}
- Preferred sector focus: ${sectorLabel}

${sectorInstruction}

Return ONLY valid JSON (no markdown, no backticks, no explanation) with this exact structure:
{
  "summary": "2-3 sentence personalised summary of their profile and unique strengths",
  "roles": [
    {
      "title": "Exact role title",
      "sector": "e.g. Pharma / NHS / Health Tech",
      "fit": "High or Medium",
      "why": "2 sentences on why this person is a strong candidate",
      "trajectory": ["Entry-level title", "Mid-level title", "Senior title"],
      "salary_range": "e.g. £28k–£45k entry level (UK)",
      "skills_to_build": ["skill1", "skill2", "skill3"],
      "certifications": ["e.g. ICH GCP", "PMP", "none needed"],
      "example_employers": ["Employer A", "Employer B", "Employer C"]
    }
  ],
  "top_tip": "One specific, actionable tip to stand out in applications"
}

Return 4-6 roles ordered by fit (High first). Be specific about real employers and real certifications. Be encouraging and realistic.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.map((i: { text?: string }) => i.text || "").join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Career navigator error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

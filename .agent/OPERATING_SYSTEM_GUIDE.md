# 🚦 Antigravity AI Operating System: User Guide (ZettaCars)

This guide explains how to use the "AI Operating System" I just set up in the `.agent/` directory to ensure consistent, premium, and safe development.

## 🏁 How to Activate the Environment
To make any agent (like me, Antigravity) follow these rules, you can add this line at the beginning of your request or keep it in your "Personality" settings:
> "Follow the instructions and skills defined in the project's **`.agent/`** directory."

## 🏗️ The System Components

### 1️⃣ [Global Instructions](file:///c:/Users/david/Personal%20work/2025/ZettaCars/zettaCars/.agent/instructions.md) (The Core Rules)
- **PLAN-FIRST**: Forces a mandatory planning phase before any coding.
- **WOW FACTOR**: Ensures all UI implementation aims for a premium look (glassmorphism, gradients, micro-animations).

### 2️⃣ [The Skills Library](file:///c:/Users/david/Personal%20work/2025/ZettaCars/zettaCars/.agent/skills/) (Guardrails)
- **[Global Styling](file:///c:/Users/david/Personal%20work/2025/ZettaCars/zettaCars/.agent/skills/global_styling_compliance/SKILL.md)**: Strictly slate backgrounds, pink highlights, and **zero** hardcoded hex colors.
- **[Design System](file:///c:/Users/david/Personal%20work/2025/ZettaCars/zettaCars/.agent/skills/design_system_compliance/SKILL.md)**: Reuses `AnimatedGroup`, `Lucide React`, and `Framer Motion`.
- **[Architecture](file:///c:/Users/david/Personal%20work/2025/ZettaCars/zettaCars/.agent/skills/architecture_compliance/SKILL.md)**: Grouping related logic as established in the current codebase.
- **[Self-Check](file:///c:/Users/david/Personal%20work/2025/ZettaCars/zettaCars/.agent/skills/self_check/SKILL.md)**: A final verification step that I run (or you can ask me to run) before presenting the work.

### 3️⃣ [Specialized Subagents](file:///c:/Users/david/Personal%20work/2025/ZettaCars/zettaCars/.agent/agents/) (The Team)
When giving a task, you can specify:
- **"Assign to Frontend Developer"**: For UI design, client-side React logic, and CSS.
- **"Assign to Backend Developer"**: For Convex schema, API design, and data logic.
- **"Assign to Tester"**: For QA plan, edge case discovery, and regression testing.

## 📋 The "Golden Workflow" Steps
Every request I handle for you follows this flow:
1. **Analyze Request**: Understand the specific core objective.
2. **Assign Role**: I act as a Frontend, Backend, or Tester depending on the task.
3. **Draft Plan**: I present a mandatory **plan** for your review first.
4. **Halt & Review**: I wait for your explicit **"GO"**.
5. **Implement**: I only execute the approved plan, including all project guardrails.
6. **Verify & Summarize**: I provide a report of files changed, risks identified, and future improvements.

## 📋 Copyable Version for Profile
If you want to paste this into your Antigravity "Personality" settings for absolute persistence, check the [**.agent/FINAL_AI_OS.md**](file:///c:/Users/david/Personal%20work/2025/ZettaCars/zettaCars/.agent/FINAL_AI_OS.md) file.

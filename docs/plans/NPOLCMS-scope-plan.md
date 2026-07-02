# NPOLCMS Scope Plan

**Status:** Draft | **Date:** 2026-07-02 | **Author:** AI Assistant

## 1. Summary

This plan captures the initial scope-planning work for the NPOLCMS Jira board at the provided URL. The current blocker is Atlassian authentication: the board request is redirecting to an OAuth sign-in flow, so no backlog details can yet be read from Jira.

### Requirements

- [ ] Confirm access to the NPOLCMS Jira board after Atlassian authentication succeeds.
- [ ] Identify the relevant backlog items, epics, and board structure that affect implementation scope.
- [ ] Produce a concrete implementation plan and estimate once the required Jira context is available.

## 2. Discovery Summary

### Design Tree

| Branch | Status | Evidence / Rationale |
| ------ | ------ | -------------------- |
| Jira board access | Blocked | Atlassian sign-in page is currently presented for the requested board URL. |
| Project context | Observed | Workspace instructions define the Jira project as NPOLCMS and the Atlassian MCP server as the integration target. |
| Scope planning workflow | Observed | The plugin skill at plugins/aimate/skills/scope-plan/SKILL.md defines the required planning format and estimation approach. |

## 3. Risks

| Risk | Probability | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| Authentication blocker | High | High | Complete the Atlassian sign-in flow and retry the board access. |
| Incomplete backlog visibility | High | Medium | Re-run scope planning after Jira data is available. |

## 4. Technical Approach

The next step is to authenticate with Atlassian and then inspect the board backlog, epics, and issue details. Once that data is visible, the plan can be expanded into a full task breakdown with estimates.

## 5. Implementation Plan

### Jira / Planning

#### Task 1 — Authenticate and retrieve board context
- **Docs / References:** None
- **Depends on:** None
- **Execution Mode:** Sequential
- **Allowed Scope:** [No repository files; external Jira access]
- **Estimate:** 0.5h base × 1.0 = 0.5h

**Required Context to Read:**

- None

**Contract Inputs:**

- None

**Context to Preserve:**

- Existing workspace Jira configuration and project context.

**Validation Commands:**

- Complete Atlassian sign-in and confirm the board URL loads with project data.

**1.1 Authenticate to Atlassian**

**Acceptance Criteria:**
- The Atlassian sign-in flow completes successfully.
- The requested board URL resolves to the NPOLCMS board instead of the sign-in page.

**1.2 Read board backlog and issue metadata**

**Acceptance Criteria:**
- The relevant board, epics, and issue list are visible.
- The scope-planning workflow can identify implementation candidates and dependencies.

#### Task 2 — Draft implementation plan and estimate
- **Docs / References:** plugins/aimate/skills/scope-plan/SKILL.md
- **Depends on:** Task 1
- **Execution Mode:** Sequential
- **Allowed Scope:** docs/plans/ (create)
- **Estimate:** 1.0h base × 1.0 = 1.0h

**Required Context to Read:**

- plugins/aimate/skills/scope-plan/SKILL.md

**Contract Inputs:**

- None

**Context to Preserve:**

- Existing repo conventions for planning documents.

**Validation Commands:**

- Confirm the plan file exists in docs/plans/ and contains the required sections.

**2.1 Create scope plan document**

**Acceptance Criteria:**
- A planning document is created under docs/plans/ with summary, requirements, design tree, risks, and implementation tasks.
- The plan reflects the Jira context available after authentication.

#### Task 3 — Documentation/Rework
- **Docs / References:** None
- **Depends on:** Task 2
- **Execution Mode:** Coordinator-only
- **Allowed Scope:** docs/plans/
- **Estimate:** 0.5h base × 1.0 = 0.5h

**Required Context to Read:**

- docs/plans/NPOLCMS-scope-plan.md

**Contract Inputs:**

- None

**Context to Preserve:**

- Existing plan structure and terminology.

**Validation Commands:**

- Review the generated document for completeness and consistency.

**3.1 Documentation updates**

**Acceptance Criteria:**
- The scope plan is concise and complete.
- Any remaining authentication blockers are explicitly noted.

**3.2 Rework**

**Acceptance Criteria:**
- The plan is updated to reflect the latest authenticated Jira context if access becomes available.

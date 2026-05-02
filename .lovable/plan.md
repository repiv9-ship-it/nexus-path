# Make the University Side 100% Functional

The university dashboard already has CRUD scaffolding for most sections, but several gaps stop it from being truly end-to-end. This plan closes them.

## Gaps identified

1. **Navigation incomplete** — sidebar has no entry for Students, Professors, Schedule editor; admin can't reach those sections even though the code exists.
2. **No Schedule editor for admin** — `schedule_entries` is read-only from the UI; admin can't create timetable.
3. **Classes never linked to students** — students appear in a flat list, not per-class; can't move/assign students between classes.
4. **Subjects not scoped to a class properly** — subject creation requires picking a class first; the "Add subject" flow without a selected class is broken.
5. **Invitations don't send email** — only DB row is inserted; invitee never gets notified unless they happen to log in.
6. **Employees & Roles is read-only** — admin can't grant/revoke `professor` / `admin` roles within their university.
7. **Data not scoped to the admin's university** — `useSubjects`, `useScheduleEntries`, `useExamSchedule`, `useProfessors`, `useInternships`, `useStudentPayments` return rows from ALL universities. Need university-scoped variants.
8. **No way for admin to record marks / attendance** — professors can but admin overview lacks it.
9. **Reports has no CSV export** — numbers shown but no download.
10. **Auto-create university for new admin** — when a super admin grants `admin` role, no university row is auto-created and the admin sees an empty dashboard with no way to set name/contact.

## Plan

### 1. Database (migrations)
- Add `university_id` to `subjects`, `schedule_entries`, `exam_schedule`, `professors`, `internships`, `student_payments` so admins only see their own data.
- Tighten RLS on those tables: SELECT for own university users + super admin; admin manages only own university rows.
- Add `class_id` (optional) to `schedule_entries` so timetables can be per class.
- Add `university_id` to `marks` and `attendance` (denormalized) for scoping.
- Backfill existing rows to the single existing university.

### 2. Hooks (`src/hooks/useSupabaseData.tsx`)
- Update `useSubjects`, `useScheduleEntries`, `useExamSchedule`, `useProfessors`, `useInternships`, `useStudentPayments` to accept and filter by `universityId`.
- Add `useClassSubjects(classId)`, `useClassStudents(classId)`, `useUniversityProfiles(uniId, role?)`.
- Add `useAllMarksForUni(uniId)` and `useAllAttendanceForUni(uniId)`.

### 3. Navigation (`src/lib/navigation.ts`)
- Add to `uniAdminNav`: `uni_students` (Students), `uni_professors` (Professors), `uni_schedule` (Schedule editor).
- Add `uni_schedule` to `ViewType`.

### 4. University Dashboard sections
- **ClassesSection**: per-class view — click a class to see assigned students, professors, subjects; assign / unassign via `class_members`; reassign student to another class; "Add subject" tied to current class.
- **StudentsSection**: filter by class, bulk-invite (paste emails), reassign class, remove from university (set `profiles.university_id = null` + delete `class_members`).
- **ProfessorsSection**: assign professor to one or more classes/subjects, link a `professors` row to a `user_id` once they accept their invitation.
- **New ScheduleSection (`uni_schedule`)**: weekly grid + form to create/edit/delete `schedule_entries` (subject, day_of_week, start/end time, room, type, professor, class).
- **EmployeesSection**: add Promote/Demote actions calling `user_roles` insert/delete; only allowed if profile.university_id = uniId.
- **ReportsSection**: add "Export CSV" button generating a downloadable summary (students, payments, salaries, attendance %).
- **InvitationsSection (new tab inside Students/Professors)**: resend, copy link, see status; click "Resend" calls a new edge function.

### 5. Edge function `send-invitation-email`
- New function in `supabase/functions/send-invitation-email/`.
- Uses Lovable AI gateway (no key) — wait, email needs Resend; will use a simple branded template via `fetch` to a configurable RESEND_API_KEY (ask user once via add_secret).
- Triggered on invite create + on Resend button.
- Email contains the platform URL with the user's email pre-filled and a one-line "You've been invited" message.

### 6. Dashboard.tsx
- Route the new `uni_schedule` view to `<UniversityDashboard activeSection="uni_schedule" />`.

### 7. Auto university bootstrap
- When super admin grants `admin` role to a user with no `university_id`, prompt them on first dashboard load with a "Create your university" modal (name, slug, contact, plan) that inserts a row in `universities` and updates their profile.

## Technical notes

```text
classes ──< class_members >── profiles
         └─< subjects >── schedule_entries / exam_schedule / marks / attendance
universities ──< profiles, classes, professors, subjects, internships, payments, salaries, modules, invitations, announcements
```

- RLS pattern: every table gets `university_id` and the policy uses `EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND university_id = table.university_id)` for SELECT, plus `has_role(auth.uid(), 'admin') AND profiles.university_id = table.university_id` for write.
- For invitation emails: requires a `RESEND_API_KEY` secret. I will request it via `add_secret` before deploying the function. If declined, invitations still work but rely on in-app notification only.

## Out of scope (already working / future)
- Student & professor side dashboards (already functional from earlier turns).
- Real-time chat between roles (would need a separate plan).
- File attachments on announcements (storage bucket would be a follow-up).

Once approved, I'll implement all of the above in one pass and verify with the Supabase linter + a quick smoke test.

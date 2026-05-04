export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      academic_years: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          is_current: boolean | null
          name: string
          start_date: string | null
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          name: string
          start_date?: string | null
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          name?: string
          start_date?: string | null
        }
        Relationships: []
      }
      announcements: {
        Row: {
          audience: string
          author_id: string | null
          class_id: string | null
          content: string
          created_at: string
          id: string
          priority: string
          title: string
          university_id: string | null
        }
        Insert: {
          audience?: string
          author_id?: string | null
          class_id?: string | null
          content: string
          created_at?: string
          id?: string
          priority?: string
          title: string
          university_id?: string | null
        }
        Update: {
          audience?: string
          author_id?: string | null
          class_id?: string | null
          content?: string
          created_at?: string
          id?: string
          priority?: string
          title?: string
          university_id?: string | null
        }
        Relationships: []
      }
      application_requests: {
        Row: {
          applicant_id: string
          created_at: string
          id: string
          payload: Json
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          applicant_id: string
          created_at?: string
          id?: string
          payload?: Json
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          created_at?: string
          id?: string
          payload?: Json
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          created_at: string
          id: string
          is_justified: boolean | null
          justification: string | null
          session_date: string
          status: string
          subject_id: string
          university_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_justified?: boolean | null
          justification?: string | null
          session_date: string
          status?: string
          subject_id: string
          university_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_justified?: boolean | null
          justification?: string | null
          session_date?: string
          status?: string
          subject_id?: string
          university_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      certification_requests: {
        Row: {
          admin_note: string | null
          certification_name: string
          created_at: string
          id: string
          passed: boolean | null
          request_type: string
          result: string | null
          score: string | null
          status: string
          updated_at: string
          user_id: string
          voucher_code: string | null
        }
        Insert: {
          admin_note?: string | null
          certification_name: string
          created_at?: string
          id?: string
          passed?: boolean | null
          request_type?: string
          result?: string | null
          score?: string | null
          status?: string
          updated_at?: string
          user_id: string
          voucher_code?: string | null
        }
        Update: {
          admin_note?: string | null
          certification_name?: string
          created_at?: string
          id?: string
          passed?: boolean | null
          request_type?: string
          result?: string | null
          score?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          voucher_code?: string | null
        }
        Relationships: []
      }
      class_members: {
        Row: {
          class_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      classes: {
        Row: {
          academic_year_id: string | null
          capacity: number | null
          class_code: string | null
          created_at: string
          department: string | null
          id: string
          level: string
          name: string
          university_id: string
          updated_at: string
        }
        Insert: {
          academic_year_id?: string | null
          capacity?: number | null
          class_code?: string | null
          created_at?: string
          department?: string | null
          id?: string
          level?: string
          name: string
          university_id: string
          updated_at?: string
        }
        Update: {
          academic_year_id?: string | null
          capacity?: number | null
          class_code?: string | null
          created_at?: string
          department?: string | null
          id?: string
          level?: string
          name?: string
          university_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      course_materials: {
        Row: {
          class_id: string | null
          course_submission_id: string | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          link_url: string | null
          material_type: string
          subject_id: string | null
          title: string
          university_id: string | null
          uploaded_by: string
        }
        Insert: {
          class_id?: string | null
          course_submission_id?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          link_url?: string | null
          material_type?: string
          subject_id?: string | null
          title: string
          university_id?: string | null
          uploaded_by: string
        }
        Update: {
          class_id?: string | null
          course_submission_id?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          link_url?: string | null
          material_type?: string
          subject_id?: string | null
          title?: string
          university_id?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_materials_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_materials_course_submission_id_fkey"
            columns: ["course_submission_id"]
            isOneToOne: false
            referencedRelation: "course_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_materials_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_materials_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      course_submissions: {
        Row: {
          category: string
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          instructor_name: string | null
          price: number
          professor_user_id: string | null
          rejection_reason: string | null
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_by: string
          target_audience: string | null
          title: string
          university_id: string | null
        }
        Insert: {
          category?: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          instructor_name?: string | null
          price?: number
          professor_user_id?: string | null
          rejection_reason?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_by: string
          target_audience?: string | null
          title: string
          university_id?: string | null
        }
        Update: {
          category?: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          instructor_name?: string | null
          price?: number
          professor_user_id?: string | null
          rejection_reason?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_by?: string
          target_audience?: string | null
          title?: string
          university_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_submissions_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      document_requests: {
        Row: {
          admin_note: string | null
          comment: string | null
          created_at: string
          exam_type: string | null
          id: string
          request_type: string
          status: string
          subject_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          comment?: string | null
          created_at?: string
          exam_type?: string | null
          id?: string
          request_type: string
          status?: string
          subject_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          comment?: string | null
          created_at?: string
          exam_type?: string | null
          id?: string
          request_type?: string
          status?: string
          subject_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_requests_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_results: {
        Row: {
          created_at: string
          exam_id: string
          graded_by: string | null
          id: string
          max_score: number
          qr_code: string
          scanned_at: string | null
          score: number | null
          student_id: string
        }
        Insert: {
          created_at?: string
          exam_id: string
          graded_by?: string | null
          id?: string
          max_score?: number
          qr_code?: string
          scanned_at?: string | null
          score?: number | null
          student_id: string
        }
        Update: {
          created_at?: string
          exam_id?: string
          graded_by?: string | null
          id?: string
          max_score?: number
          qr_code?: string
          scanned_at?: string | null
          score?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_results_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exam_schedule"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_schedule: {
        Row: {
          created_at: string
          duration_minutes: number | null
          exam_date: string
          exam_type: string
          id: string
          room: string | null
          semester_id: string
          subject_id: string
          university_id: string | null
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          exam_date: string
          exam_type?: string
          id?: string
          room?: string | null
          semester_id: string
          subject_id: string
          university_id?: string | null
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          exam_date?: string
          exam_type?: string
          id?: string
          room?: string | null
          semester_id?: string
          subject_id?: string
          university_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_schedule_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_schedule_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      internship_applications: {
        Row: {
          created_at: string
          cv_url: string | null
          id: string
          internship_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cv_url?: string | null
          id?: string
          internship_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cv_url?: string | null
          id?: string
          internship_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "internship_applications_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
        ]
      }
      internships: {
        Row: {
          company: string
          created_at: string
          deadline: string | null
          description: string | null
          duration: string | null
          id: string
          is_published: boolean | null
          location: string | null
          title: string
          university_id: string | null
        }
        Insert: {
          company: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          is_published?: boolean | null
          location?: string | null
          title: string
          university_id?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          is_published?: boolean | null
          location?: string | null
          title?: string
          university_id?: string | null
        }
        Relationships: []
      }
      marks: {
        Row: {
          coefficient: number
          created_at: string
          date: string | null
          exam_paper_url: string | null
          exam_type: string
          id: string
          max_score: number
          score: number
          subject_id: string
          university_id: string | null
          user_id: string
        }
        Insert: {
          coefficient?: number
          created_at?: string
          date?: string | null
          exam_paper_url?: string | null
          exam_type?: string
          id?: string
          max_score?: number
          score: number
          subject_id: string
          university_id?: string | null
          user_id: string
        }
        Update: {
          coefficient?: number
          created_at?: string
          date?: string | null
          exam_paper_url?: string | null
          exam_type?: string
          id?: string
          max_score?: number
          score?: number
          subject_id?: string
          university_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          class_id: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          host_id: string
          id: string
          meeting_url: string | null
          scheduled_at: string
          status: string
          title: string
          university_id: string | null
          with_user_id: string | null
        }
        Insert: {
          class_id?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          host_id: string
          id?: string
          meeting_url?: string | null
          scheduled_at: string
          status?: string
          title: string
          university_id?: string | null
          with_user_id?: string | null
        }
        Update: {
          class_id?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          host_id?: string
          id?: string
          meeting_url?: string | null
          scheduled_at?: string
          status?: string
          title?: string
          university_id?: string | null
          with_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meetings_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          category: string
          created_at: string
          id: string
          is_read: boolean | null
          link: string | null
          message: string
          title: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          message: string
          title: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_banners: {
        Row: {
          created_at: string
          ends_at: string | null
          id: string
          image_url: string | null
          is_active: boolean
          link: string | null
          position: number
          starts_at: string | null
          subtitle: string | null
          title: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          link?: string | null
          position?: number
          starts_at?: string | null
          subtitle?: string | null
          title: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          link?: string | null
          position?: number
          starts_at?: string | null
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      platform_discounts: {
        Row: {
          code: string
          created_at: string
          current_uses: number
          discount_percent: number
          ends_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          name: string
          starts_at: string | null
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number
          discount_percent?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          name: string
          starts_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number
          discount_percent?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          name?: string
          starts_at?: string | null
        }
        Relationships: []
      }
      platform_payouts: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          paid_at: string | null
          period: string
          status: string
          university_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          period: string
          status?: string
          university_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          period?: string
          status?: string
          university_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_payouts_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      professor_salaries: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          note: string | null
          paid_at: string | null
          period: string
          professor_id: string | null
          status: string
          university_id: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          note?: string | null
          paid_at?: string | null
          period: string
          professor_id?: string | null
          status?: string
          university_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          note?: string | null
          paid_at?: string | null
          period?: string
          professor_id?: string | null
          status?: string
          university_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      professors: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          created_at: string
          department: string | null
          email: string | null
          headline: string | null
          id: string
          is_independent: boolean | null
          name: string
          office_hours: string | null
          office_location: string | null
          rating: number | null
          university_id: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          headline?: string | null
          id?: string
          is_independent?: boolean | null
          name: string
          office_hours?: string | null
          office_location?: string | null
          rating?: number | null
          university_id?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          headline?: string | null
          id?: string
          is_independent?: boolean | null
          name?: string
          office_hours?: string | null
          office_location?: string | null
          rating?: number | null
          university_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          created_at: string
          department: string | null
          email: string | null
          first_name: string
          headline: string | null
          id: string
          last_name: string
          level: string | null
          university_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          first_name?: string
          headline?: string | null
          id?: string
          last_name?: string
          level?: string | null
          university_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          first_name?: string
          headline?: string | null
          id?: string
          last_name?: string
          level?: string | null
          university_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      schedule_entries: {
        Row: {
          class_id: string | null
          created_at: string
          day_of_week: number
          end_time: string
          entry_type: string
          id: string
          professor_name: string | null
          room: string | null
          semester_id: string
          start_time: string
          subject_id: string
          university_id: string | null
        }
        Insert: {
          class_id?: string | null
          created_at?: string
          day_of_week: number
          end_time: string
          entry_type?: string
          id?: string
          professor_name?: string | null
          room?: string | null
          semester_id: string
          start_time: string
          subject_id: string
          university_id?: string | null
        }
        Update: {
          class_id?: string | null
          created_at?: string
          day_of_week?: number
          end_time?: string
          entry_type?: string
          id?: string
          professor_name?: string | null
          room?: string | null
          semester_id?: string
          start_time?: string
          subject_id?: string
          university_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_entries_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_entries_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      search_events: {
        Row: {
          category: string | null
          course_id: string | null
          created_at: string
          event_type: string
          id: string
          query: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          course_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          query?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          course_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          query?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      semesters: {
        Row: {
          academic_year_id: string
          created_at: string
          end_date: string | null
          id: string
          is_current: boolean | null
          name: string
          number: number
          start_date: string | null
        }
        Insert: {
          academic_year_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          name: string
          number?: number
          start_date?: string | null
        }
        Update: {
          academic_year_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          name?: string
          number?: number
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "semesters_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
        ]
      }
      student_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          note: string | null
          payment_method: string
          payment_period: string
          receipt_number: string
          recorded_by: string | null
          student_id: string
          total_due: number
          university_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          note?: string | null
          payment_method?: string
          payment_period?: string
          receipt_number?: string
          recorded_by?: string | null
          student_id: string
          total_due?: number
          university_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          note?: string | null
          payment_method?: string
          payment_period?: string
          receipt_number?: string
          recorded_by?: string | null
          student_id?: string
          total_due?: number
          university_id?: string | null
        }
        Relationships: []
      }
      subjects: {
        Row: {
          class_id: string | null
          code: string | null
          created_at: string
          credits: number | null
          id: string
          module_group: string | null
          name: string
          professor_name: string | null
          semester_id: string
          university_id: string | null
        }
        Insert: {
          class_id?: string | null
          code?: string | null
          created_at?: string
          credits?: number | null
          id?: string
          module_group?: string | null
          name: string
          professor_name?: string | null
          semester_id: string
          university_id?: string | null
        }
        Update: {
          class_id?: string | null
          code?: string | null
          created_at?: string
          credits?: number | null
          id?: string
          module_group?: string | null
          name?: string
          professor_name?: string | null
          semester_id?: string
          university_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subjects_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          created_by: string
          id: string
          message: string
          priority: string
          status: string
          subject: string
          university_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          created_by: string
          id?: string
          message: string
          priority?: string
          status?: string
          subject: string
          university_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          created_by?: string
          id?: string
          message?: string
          priority?: string
          status?: string
          subject?: string
          university_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_replies: {
        Row: {
          author_id: string
          author_role: string
          created_at: string
          id: string
          message: string
          ticket_id: string
        }
        Insert: {
          author_id: string
          author_role?: string
          created_at?: string
          id?: string
          message: string
          ticket_id: string
        }
        Update: {
          author_id?: string
          author_role?: string
          created_at?: string
          id?: string
          message?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_replies_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          activated_at: string | null
          active_seats: number
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          country: string | null
          created_at: string
          id: string
          logo_url: string | null
          max_seats: number
          name: string
          slug: string
          status: string
          storage_limit_gb: number
          storage_used_gb: number
          subscription_plan: string
          subscription_price: number
          suspended_at: string | null
        }
        Insert: {
          activated_at?: string | null
          active_seats?: number
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          max_seats?: number
          name: string
          slug: string
          status?: string
          storage_limit_gb?: number
          storage_used_gb?: number
          subscription_plan?: string
          subscription_price?: number
          suspended_at?: string | null
        }
        Update: {
          activated_at?: string | null
          active_seats?: number
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          max_seats?: number
          name?: string
          slug?: string
          status?: string
          storage_limit_gb?: number
          storage_used_gb?: number
          subscription_plan?: string
          subscription_price?: number
          suspended_at?: string | null
        }
        Relationships: []
      }
      university_invitations: {
        Row: {
          class_id: string | null
          created_at: string
          expires_at: string | null
          id: string
          invited_by: string | null
          invited_email: string
          invited_user_id: string | null
          message: string | null
          responded_at: string | null
          role: string
          status: string
          university_id: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          invited_email: string
          invited_user_id?: string | null
          message?: string | null
          responded_at?: string | null
          role?: string
          status?: string
          university_id: string
        }
        Update: {
          class_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          invited_email?: string
          invited_user_id?: string | null
          message?: string | null
          responded_at?: string | null
          role?: string
          status?: string
          university_id?: string
        }
        Relationships: []
      }
      university_members: {
        Row: {
          created_at: string
          id: string
          role: string
          university_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          university_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          university_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "university_members_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      university_modules: {
        Row: {
          id: string
          is_enabled: boolean
          module_key: string
          university_id: string
          updated_at: string
        }
        Insert: {
          id?: string
          is_enabled?: boolean
          module_key: string
          university_id: string
          updated_at?: string
        }
        Update: {
          id?: string
          is_enabled?: boolean
          module_key?: string
          university_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_university_invitation: {
        Args: { _invitation_id: string }
        Returns: undefined
      }
      admin_set_user_role: {
        Args: {
          _grant?: boolean
          _role: Database["public"]["Enums"]["app_role"]
          _target_user: string
        }
        Returns: undefined
      }
      approve_application: {
        Args: { _id: string; _note?: string }
        Returns: string
      }
      bulk_invite_to_university: {
        Args: {
          _class_id?: string
          _emails: string[]
          _message?: string
          _role?: string
          _university_id: string
        }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_university_member: { Args: { _uni: string }; Returns: boolean }
      reject_application: {
        Args: { _id: string; _note?: string }
        Returns: undefined
      }
      set_active_university: { Args: { _uni: string }; Returns: undefined }
      submit_application: {
        Args: { _payload: Json; _type: string }
        Returns: string
      }
    }
    Enums: {
      app_role:
        | "student"
        | "university_student"
        | "professor"
        | "admin"
        | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "student",
        "university_student",
        "professor",
        "admin",
        "super_admin",
      ],
    },
  },
} as const

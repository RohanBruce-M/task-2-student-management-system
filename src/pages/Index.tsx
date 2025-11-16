import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { StudentForm } from "@/components/StudentForm";
import { StudentTable } from "@/components/StudentTable";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Student {
  id: string;
  name: string;
  age: number;
  course: string;
}

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  // Fetch students from database
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const tl = gsap.timeline();
    
    if (iconRef.current) {
      tl.from(iconRef.current, {
        scale: 0,
        rotation: -180,
        duration: 0.8,
        ease: "back.out(1.7)",
      });
    }
    
    if (titleRef.current) {
      tl.from(titleRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.6,
        ease: "power3.out",
      }, "-=0.4");
    }

    if (headerRef.current) {
      tl.from(headerRef.current.querySelector("p"), {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.3");
    }
  }, []);

  const handleAddStudent = async (studentData: { name: string; age: number; course: string }) => {
    try {
      if (editingStudent) {
        // Update existing student
        const { error } = await supabase
          .from('students')
          .update(studentData)
          .eq('id', editingStudent.id);

        if (error) throw error;
        setEditingStudent(null);
      } else {
        // Add new student
        const { error } = await supabase
          .from('students')
          .insert([studentData]);

        if (error) throw error;
      }
      
      await fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error("Failed to save student");
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchStudents();
      toast.success("Student deleted successfully!");
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error("Failed to delete student");
    }
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 relative overflow-hidden">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap ref={iconRef} className="h-12 w-12 text-primary" />
            <h1 ref={titleRef} className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Student Management System
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Manage your students efficiently and effectively
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <StudentForm 
              onSubmit={handleAddStudent} 
              editingStudent={editingStudent}
              onCancelEdit={handleCancelEdit}
            />
          </div>
          <div className="lg:col-span-3">
            <StudentTable
              students={students}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface StudentFormProps {
  onSubmit: (student: { name: string; age: number; course: string }) => void;
  editingStudent?: { id: string; name: string; age: number; course: string } | null;
  onCancelEdit?: () => void;
}

export const StudentForm = ({ onSubmit, editingStudent, onCancelEdit }: StudentFormProps) => {
  const [name, setName] = useState(editingStudent?.name || "");
  const [age, setAge] = useState(editingStudent?.age?.toString() || "");
  const [course, setCourse] = useState(editingStudent?.course || "");
  const formRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (formRef.current) {
      gsap.from(formRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power3.out",
      });
    }
  }, []);

  useEffect(() => {
    if (editingStudent) {
      gsap.from(formRef.current, {
        scale: 0.95,
        duration: 0.3,
        ease: "back.out(1.7)",
      });
    }
  }, [editingStudent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (!age || isNaN(Number(age)) || Number(age) <= 0) {
      toast.error("Age must be a valid number");
      return;
    }

    if (!course.trim()) {
      toast.error("Course cannot be empty");
      return;
    }

    onSubmit({ name: name.trim(), age: Number(age), course: course.trim() });
    
    // Reset form
    setName("");
    setAge("");
    setCourse("");
    
    toast.success(editingStudent ? "Student updated successfully!" : "Student added successfully!");
  };

  return (
    <Card ref={formRef} className="shadow-lg border-primary/10 hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          {editingStudent ? "Edit Student" : "Add New Student"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div ref={el => inputRefs.current[0] = el} className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
              className="transition-all focus:ring-2 focus:ring-primary"
            />
          </div>

          <div ref={el => inputRefs.current[1] = el} className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter student age"
              className="transition-all focus:ring-2 focus:ring-primary"
            />
          </div>

          <div ref={el => inputRefs.current[2] = el} className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Input
              id="course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="Enter course name"
              className="transition-all focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 transition-all">
              {editingStudent ? "Update Student" : "Add Student"}
            </Button>
            {editingStudent && onCancelEdit && (
              <Button type="button" variant="outline" onClick={onCancelEdit} className="flex-1">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

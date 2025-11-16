import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

interface Student {
  id: string;
  name: string;
  age: number;
  course: string;
}

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export const StudentTable = ({ students, onEdit, onDelete }: StudentTableProps) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  useEffect(() => {
    if (tableRef.current) {
      gsap.from(tableRef.current, {
        opacity: 0,
        x: 50,
        duration: 0.6,
        ease: "power3.out",
      });
    }
  }, []);

  useEffect(() => {
    rowRefs.current.forEach((row, index) => {
      if (row) {
        gsap.from(row, {
          opacity: 0,
          x: -20,
          duration: 0.4,
          delay: index * 0.1,
          ease: "power2.out",
        });
      }
    });
  }, [students]);

  return (
    <Card ref={tableRef} className="shadow-lg border-primary/10 hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Student List</h2>
        
        {students.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">No students added yet</p>
            <p className="text-sm">Add your first student using the form above</p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/5">
                  <TableHead className="font-bold">Name</TableHead>
                  <TableHead className="font-bold">Age</TableHead>
                  <TableHead className="font-bold">Course</TableHead>
                  <TableHead className="font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow 
                    key={student.id}
                    ref={el => rowRefs.current[index] = el}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.age}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(student)}
                        className="hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(student.id)}
                        className="hover:bg-destructive hover:text-destructive-foreground transition-all hover:scale-110"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Card>
  );
};

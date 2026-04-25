"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { EditMovieDialog } from "./EditMovieDialog";
import { useRouter } from "next/navigation";

export function EditMovieButton({ movie }: { movie: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleUpdate = (action?: 'delete' | 'update') => {
    if (action === 'delete') {
      router.push(movie.status === 'Watched' ? '/dashboard/watched' : '/dashboard');
      router.refresh();
    } else {
      router.refresh();
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Edit className="w-4 h-4 mr-2" /> Edit Details
      </Button>
      {isOpen && (
        <EditMovieDialog 
          movie={movie} 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          onUpdate={handleUpdate} 
        />
      )}
    </>
  );
}
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { NotesListActions } from "@/hooks/notes/use-notes-list";

interface EmptyStateProps {
  notesCount: number | undefined;
  filteredNotesCount: number;
  onAddNote: () => void;
}

export function EmptyState({ 
  notesCount, 
  filteredNotesCount, 
  onAddNote 
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="pt-12 pb-12">
        <div className="text-center">
          <div className="text-muted-foreground mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {notesCount === 0
              ? "Nenhuma nota encontrada"
              : "Nenhuma nota corresponde aos filtros"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {notesCount === 0
              ? "Crie sua primeira nota para começar a organizar suas ideias."
              : "Tente ajustar os filtros para encontrar o que procura."}
          </p>
          {notesCount === 0 && (
            <Button onClick={onAddNote}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeira Nota
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
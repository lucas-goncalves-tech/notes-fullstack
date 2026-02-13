"use client";

import { useState } from "react";
import { Note } from "@/types/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteNote, useUpdateNote } from "@/hooks/api/use-notes";
import { Edit, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
}

export function NoteCard({ note, onEdit }: NoteCardProps) {
  const deleteNoteMutation = useDeleteNote();
  const updateNoteMutation = useUpdateNote();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteNoteMutation.mutateAsync(note.id);
      toast.success("Nota excluída com sucesso!");
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao excluir nota";
      toast.error(errorMessage);
    }
  };

  const handleToggleComplete = async () => {
    console.log("editou");
    try {
      await updateNoteMutation.mutateAsync({
        id: note.id,
        data: { completed: note.completed === 1 ? 0 : 1 },
      });
      toast.success(
        `Nota ${note.completed === 1 ? "reaberta" : "concluída"} com sucesso!`
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao atualizar nota";
      toast.error(errorMessage);
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "alto":
        return "bg-red-900/30 text-red-300 border-red-800/50";
      case "medio":
        return "bg-yellow-900/30 text-yellow-300 border-yellow-800/50";
      case "baixo":
        return "bg-green-900/30 text-green-300 border-green-800/50";
      default:
        return "bg-gray-800 text-gray-300 border-gray-700";
    }
  };

  const getImportanceLabel = (importance: string) => {
    switch (importance) {
      case "alto":
        return "Alta";
      case "medio":
        return "Média";
      case "baixo":
        return "Baixa";
      default:
        return importance;
    }
  };

  return (
    <Card
      className={`transition-all hover:shadow-md ${
        note.completed ? "opacity-75" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3
              className={`font-semibold text-lg ${
                note.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {note.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getImportanceColor(note.importance)}>
                {getImportanceLabel(note.importance)}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(note)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={deleteNoteMutation.isPending}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p
          className={`text-muted-foreground mb-4 ${
            note.completed ? "line-through" : ""
          }`}
        >
          {note.description}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(note.created_at), "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">Concluída:</span>
            <Switch
              checked={note.completed === 1}
              onCheckedChange={handleToggleComplete}
              disabled={updateNoteMutation.isPending}
              className="scale-75"
            />
          </div>
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a nota "{note.title}"? Esta ação
              não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteNoteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteNoteMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

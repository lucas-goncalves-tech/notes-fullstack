"use client";

import { Note } from "@/types/api";
import { useNotes } from "@/hooks/api/use-notes";
import { NoteCard } from "./note-card";
import { NoteForm } from "@/components/forms/note-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  NoteCardSkeleton,
  StatsCardSkeleton,
} from "@/components/ui/skeleton-card";
import { Plus } from "lucide-react";
import { useNotesList } from "@/hooks/notes/use-notes-list";
import { StatsCard } from "./notes-list/stats-card";
import { Filters } from "./notes-list/filters";
import { EmptyState } from "./notes-list/empty-state";

interface NotesListProps {
  onNoteUpdate?: () => void;
}

export function NotesList({ onNoteUpdate }: NotesListProps) {
  const { data: notes, isLoading, error, refetch } = useNotes();
  const { state, actions, filteredNotesResult } = useNotesList({
    notes,
    refetch,
    onNoteUpdate,
  });

  const { filteredNotes, stats } = filteredNotesResult;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Stats skeletons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>

        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
        </div>

        {/* Filters skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-20 bg-muted rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-muted rounded animate-pulse"
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <NoteCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-800/50 bg-red-950/30">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-red-400">Erro ao carregar notas</p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="mt-2"
            >
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Total" value={stats.total} subtitle="Notas" />
        <StatsCard
          title="Concluídas"
          value={stats.completed}
          color="text-green-400"
          subtitle="Tarefas"
        />
        <StatsCard
          title="Pendentes"
          value={stats.incomplete}
          color="text-orange-400"
          subtitle="Tarefas"
        />
        <StatsCard
          title="Alta Prioridade"
          value={stats.high}
          color="text-red-400"
          subtitle="Notas"
        />
      </div>

      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Minhas Notas</h2>
          <p className="text-gray-600">
            {filteredNotes.length} de {notes?.length || 0} notas
          </p>
        </div>
        <Button onClick={actions.handleCreateNote} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nova Nota
        </Button>
      </div>

      {/* Filters */}
      <Filters
        searchTerm={state.searchTerm}
        importanceFilter={state.importanceFilter}
        statusFilter={state.statusFilter}
        actions={actions}
      />

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          notesCount={notes?.length}
          filteredNotesCount={filteredNotes.length}
          onAddNote={actions.handleCreateNote}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={actions.handleEditNote}
            />
          ))}
        </div>
      )}

      {/* Create Note Dialog */}
      <Dialog
        open={state.isCreateDialogOpen}
        onOpenChange={actions.setIsCreateDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px] ">
          <DialogHeader>
            <DialogTitle>Nova Nota</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar uma nova nota
            </DialogDescription>
          </DialogHeader>
          <NoteForm
            onSuccess={actions.handleCreateSuccess}
            onCancel={actions.handleCreateCancel}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog
        open={state.isEditDialogOpen}
        onOpenChange={actions.setIsEditDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Nota</DialogTitle>
            <DialogDescription>Edite os detalhes da nota</DialogDescription>
          </DialogHeader>
          <NoteForm
            note={state.editingNote || undefined}
            onSuccess={actions.handleEditSuccess}
            onCancel={actions.handleEditCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

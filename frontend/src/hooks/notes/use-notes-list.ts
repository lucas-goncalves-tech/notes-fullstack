import { useState } from "react";
import { Note } from "@/types/api";

interface UseNotesListProps {
  notes: Note[] | undefined;
  refetch: () => void;
  onNoteUpdate?: () => void;
}

export interface NotesListState {
  searchTerm: string;
  importanceFilter: string;
  statusFilter: string;
  isCreateDialogOpen: boolean;
  editingNote: Note | null;
  isEditDialogOpen: boolean;
}

export interface NotesListActions {
  setSearchTerm: (term: string) => void;
  setImportanceFilter: (filter: string) => void;
  setStatusFilter: (filter: string) => void;
  setIsCreateDialogOpen: (open: boolean) => void;
  setEditingNote: (note: Note | null) => void;
  setIsEditDialogOpen: (open: boolean) => void;
  handleCreateNote: () => void;
  handleEditNote: (note: Note) => void;
  handleCreateSuccess: () => void;
  handleEditSuccess: () => void;
  handleCreateCancel: () => void;
  handleEditCancel: () => void;
  clearSearchFilter: () => void;
  clearImportanceFilter: () => void;
  clearStatusFilter: () => void;
}

export interface FilteredNotesResult {
  filteredNotes: Note[];
  stats: {
    total: number;
    completed: number;
    incomplete: number;
    high: number;
    medium: number;
    low: number;
  };
}

export function useNotesList({
  notes,
  refetch,
  onNoteUpdate,
}: UseNotesListProps): {
  state: NotesListState;
  actions: NotesListActions;
  filteredNotesResult: FilteredNotesResult;
} {
  const [searchTerm, setSearchTerm] = useState("");
  const [importanceFilter, setImportanceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filter notes based on search term, importance, and status
  const filteredNotes =
    notes?.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesImportance =
        importanceFilter === "all" || note.importance === importanceFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && note.completed === 1) ||
        (statusFilter === "incomplete" && note.completed === 0);

      return matchesSearch && matchesImportance && matchesStatus;
    }) || [];

  // Calculate stats
  const stats = {
    total: notes?.length || 0,
    completed: notes?.filter((n) => n.completed === 1).length || 0,
    incomplete: notes?.filter((n) => n.completed === 0).length || 0,
    high: notes?.filter((n) => n.importance === "alto").length || 0,
    medium: notes?.filter((n) => n.importance === "medio").length || 0,
    low: notes?.filter((n) => n.importance === "baixo").length || 0,
  };

  // Actions
  const handleCreateNote = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditDialogOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    refetch();
    onNoteUpdate?.();
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setEditingNote(null);
    refetch();
    onNoteUpdate?.();
  };

  const handleCreateCancel = () => {
    setIsCreateDialogOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditDialogOpen(false);
    setEditingNote(null);
  };

  const clearSearchFilter = () => {
    setSearchTerm("");
  };

  const clearImportanceFilter = () => {
    setImportanceFilter("all");
  };

  const clearStatusFilter = () => {
    setStatusFilter("all");
  };

  return {
    state: {
      searchTerm,
      importanceFilter,
      statusFilter,
      isCreateDialogOpen,
      editingNote,
      isEditDialogOpen,
    },
    actions: {
      setSearchTerm,
      setImportanceFilter,
      setStatusFilter,
      setIsCreateDialogOpen,
      setEditingNote,
      setIsEditDialogOpen,
      handleCreateNote,
      handleEditNote,
      handleCreateSuccess,
      handleEditSuccess,
      handleCreateCancel,
      handleEditCancel,
      clearSearchFilter,
      clearImportanceFilter,
      clearStatusFilter,
    },
    filteredNotesResult: {
      filteredNotes,
      stats,
    },
  };
}
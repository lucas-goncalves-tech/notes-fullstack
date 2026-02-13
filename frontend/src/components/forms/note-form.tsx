"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createNoteSchema,
  updateNoteSchema,
  CreateNoteFormData,
  UpdateNoteFormData,
} from "@/lib/schemas";
import { Note, ImportanceLevel } from "@/types/api";
import { useCreateNote, useUpdateNote } from "@/hooks/api/use-notes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { Switch } from "../ui/switch";
import { toast } from "sonner";

interface NoteFormProps {
  note?: Note;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NoteForm({ note, onSuccess, onCancel }: NoteFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();

  const isEditing = !!note;

  const form = useForm<CreateNoteFormData | UpdateNoteFormData>({
    resolver: zodResolver(isEditing ? updateNoteSchema : createNoteSchema),
    defaultValues: {
      title: note?.title || "",
      description: note?.description || "",
      importance: note?.importance || "medio",
      ...(isEditing && { completed: note?.completed }),
    },
  });

  const onSubmit = async (data: CreateNoteFormData | UpdateNoteFormData) => {
    setIsLoading(true);
    try {
      if (isEditing && note) {
        await updateNoteMutation.mutateAsync({ id: note.id, data });
        toast.success("Nota atualizada com sucesso!");
      } else {
        await createNoteMutation.mutateAsync(data as CreateNoteFormData);
        toast.success("Nota criada com sucesso!");
      }
      onSuccess?.();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao salvar nota";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const importanceOptions: {
    value: ImportanceLevel;
    label: string;
    color: string;
  }[] = [
    { value: "baixo", label: "Baixo", color: "text-green-600" },
    { value: "medio", label: "Médio", color: "text-yellow-600" },
    { value: "alto", label: "Alto", color: "text-red-600" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <input
                  placeholder="Digite o título da nota"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite a descrição da nota"
                  className="min-h-[100px]"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="importance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Importância</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível de importância" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {importanceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className={option.color}>{option.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditing && (
          <FormField
            control={form.control}
            name="completed"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 cursor-pointer select-none hover:bg-accent transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-sm font-medium">
                      Marcar como concluída
                    </span>
                    <FormDescription className="text-xs text-muted-foreground">
                      Indica se esta nota foi finalizada
                    </FormDescription>
                  </div>

                  <FormControl>
                    <Switch
                      checked={field.value === 1}
                      onCheckedChange={(checked) => {
                        field.onChange(checked ? 1 : 0);
                      }}
                      disabled={isLoading || updateNoteMutation.isPending}
                      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                    />
                  </FormControl>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Atualizar" : "Criar"}
              </>
            )}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

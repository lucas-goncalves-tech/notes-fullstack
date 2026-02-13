import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";
import { NotesListActions } from "@/hooks/notes/use-notes-list";

interface FiltersProps {
  searchTerm: string;
  importanceFilter: string;
  statusFilter: string;
  actions: NotesListActions;
}

export function Filters({ 
  searchTerm, 
  importanceFilter, 
  statusFilter, 
  actions 
}: FiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 md:flex md:justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar notas..."
              value={searchTerm}
              onChange={(e) => actions.setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-4 md:flex md:gap-4">
            <Select
              value={importanceFilter}
              onValueChange={actions.setImportanceFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por importância" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as importâncias</SelectItem>
                <SelectItem value="alto">Alta</SelectItem>
                <SelectItem value="medio">Média</SelectItem>
                <SelectItem value="baixo">Baixa</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={actions.setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
                <SelectItem value="incomplete">Pendentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {searchTerm && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={actions.clearSearchFilter}
            >
              Busca: {searchTerm} ×
            </Badge>
          )}
          {importanceFilter !== "all" && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={actions.clearImportanceFilter}
            >
              Importância: {importanceFilter} ×
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={actions.clearStatusFilter}
            >
              Status:{" "}
              {statusFilter === "completed" ? "Concluídas" : "Pendentes"} ×
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
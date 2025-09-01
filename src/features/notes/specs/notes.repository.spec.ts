import { NotesService } from "../notes.service";
import { NotFoundError } from "../../../shared/erros/not-found.error";
import { NotesRepository } from "../notes.repository";

jest.mock("../notes.repository");

describe("NotesService", () => {
  let service: NotesService;
  let mockRepository: jest.Mocked<NotesRepository>;

  beforeEach(() => {
    mockRepository = new NotesRepository() as jest.Mocked<NotesRepository>;
    service = new NotesService(mockRepository);
  });

  it("should create a new note", () => {
    const noteData = {
      title: "Hello world",
      content: "Teste unitario!",
    };
    const fakeNote = {
      id: "uuid",
      ...noteData,
    };

    mockRepository.create.mockReturnValue(fakeNote);
    const result = service.create(noteData);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("string");
    expect({ title: result.title, content: result.content }).toEqual(noteData);
  });

  it("Should return all notes", () => {
    const noteData1 = {
      title: "Tarefa 1",
      content: "Conteúdo da tarefa 1",
    };
    const noteData2 = {
      title: "Tarefa 2",
      content: "Conteúdo da tarefa 2",
    };

    const fakeNote1 = {
      id: "uuid-1",
      ...noteData1,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const fakeNote2 = {
      id: "uuid-2",
      ...noteData2,
      created_at: new Date(),
      updated_at: new Date(),
    };

    mockRepository.create
      .mockReturnValueOnce(fakeNote1)
      .mockReturnValueOnce(fakeNote2);
    service.create(noteData1);
    service.create(noteData2);

    mockRepository.getAll.mockReturnValue([fakeNote1, fakeNote2]);
    const result = service.getAll();

    expect(result).toHaveLength(2);
    expect(Array.isArray(result)).toBe(true);
  });

  it("should find note by id", () => {
    const noteData = {
      title: "Hello world",
      content: "Teste unitario!",
    };
    const fakeNote = {
      id: "uuid",
      ...noteData,
    };

    mockRepository.create.mockReturnValue(fakeNote);
    const createdTask = service.create(noteData);
    const result = service.getById(createdTask.id);

    expect(result).toEqual(createdTask);
  });
});

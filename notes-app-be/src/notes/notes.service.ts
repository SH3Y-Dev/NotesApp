import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNoteDto, UpdateNoteDto } from './dto/notes.dto';
import { Note } from 'src/schema/notes.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const note = new this.noteModel(createNoteDto);
    return note.save();
  }

  async findAll(): Promise<Note[]> {
    return this.noteModel.find().exec();
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.noteModel.findOne({ _id: id }).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.noteModel.findByIdAndUpdate(id, updateNoteDto, {
      new: true,
    });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async delete(id: string): Promise<void> {
    const result = await this.noteModel.findOneAndDelete({ _id: id }).exec();
    if (!result) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
  }
}

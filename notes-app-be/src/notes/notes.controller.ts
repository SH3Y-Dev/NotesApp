import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/notes.dto';
import { Note } from 'src/schema/notes.schema';
import { AuthGuard } from '@nestjs/passport';
import { NotesGateway } from './gateway/notes.gateway';
import axios from 'axios';
@Controller('notes')
@UseGuards(AuthGuard('jwt'))
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly notesGateway: NotesGateway,
  ) {}

  @Post()
  async create(@Body() createNote: CreateNoteDto): Promise<Note> {
    const note = await this.notesService.create(createNote);
    this.notesGateway.emitNoteCreated(note, createNote.clientId);
    return note;
  }

  @Get()
  async findAll(): Promise<Note[]> {
    return this.notesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Note> {
    return this.notesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    const note = await this.notesService.update(id, updateNoteDto);
    this.notesGateway.emitNoteUpdated(note);
    return note;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.notesService.delete(id);
    this.notesGateway.emitNoteDeleted(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('enhance')
  async enhanceNoteContent(
    @Body('content') content: string,
  ): Promise<{ enhancedContent: string }> {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-r1:free',
        messages: [
          {
            role: 'user',
            content: `Rewrite the following sentence to make it grammatically correct and slightly enhanced, using the same or slightly more words: ${content}. Return only the rewritten sentence without any additional explanations or formatting.`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const enhancedContent = response.data.choices[0].message.content;
    return { enhancedContent };
  }
}

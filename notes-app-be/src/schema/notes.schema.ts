import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Note extends Document {
  @Prop({ required: false })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: 0 })
  x: number;

  @Prop({ default: 0 })
  y: number;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
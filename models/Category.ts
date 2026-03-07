import { Model, Schema, model, models } from "mongoose";

export interface CategoryDocument {
  name: string;
  slug: string;
  parentCategory?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<CategoryDocument>(
  {
    // Categories stay flexible enough for nested catalogue structures.
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    parentCategory: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Category =
  (models.Category as Model<CategoryDocument>) ||
  model<CategoryDocument>("Category", categorySchema);

export default Category;

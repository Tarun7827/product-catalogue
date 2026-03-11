import { Model, Schema, model, models } from "mongoose";

export interface ProductDocument {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  brand: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  source?: string;
  externalId?: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDocument>(
  {
    // The product schema defines the catalogue fields stored in MongoDB.
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    categoryId: {
      type: String,
      required: true,
      index: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    source: {
      type: String,
      default: "local",
      index: true,
      trim: true,
      lowercase: true,
    },
    externalId: {
      type: Number,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index(
  { source: 1, externalId: 1 },
  {
    unique: true,
    partialFilterExpression: { externalId: { $type: "number" } },
  },
);

const Product =
  (models.Product as Model<ProductDocument>) ||
  model<ProductDocument>("Product", productSchema);

export default Product;

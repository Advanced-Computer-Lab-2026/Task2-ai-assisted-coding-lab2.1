import mongoose from 'mongoose';

/*| field | type | rules |
|---|---|---|
| `bookCode` | String | required (e.g. `"BK101"`) |
| `rating` | Number | required, `min: 1`, `max: 5` |
| `note` | String | optional |
| `ratedBy` | ObjectId ref `User` | optional |

Keep `{ timestamps: true }` and add a **compound unique index** on
`{ bookCode: 1, ratedBy: 1 }`.*/

// TODO: define the Rating schema per README.md section 1.

const ratingSchema = new mongoose.Schema(
  {
    bookCode: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    note: { type: String },
    ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

  },
  { timestamps: true }
);

// TODO: add the compound uniqueness constraint described in README.md section 1.
ratingSchema.index({ bookCode: 1, ratedBy: 1 }, { unique: true });

export const Rating = mongoose.model('Rating', ratingSchema);

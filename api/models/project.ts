import mongoose from "../config/atlasdb";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  members: {
    type: Array,
    default: null
  },
  userId: {
    type: String,
    required: true
  },
  tasks: {
    type: Array,
    default: []
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

schema.pre('findOne', async function () {
  this.where({ isDeleted: false })
})

schema.pre('find', async function () {
  this.where({ isDeleted: false })
})

schema.post('deleteOne', async function () {
  await mongoose
    .model('Task')
    .deleteMany({ projectId: this.getQuery()['_id'] })
})

const model = mongoose.model('Project', schema)

export default model
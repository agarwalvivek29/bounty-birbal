// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   githubId: { type: String, required: true },
//   username: { type: String, required: true },
//   accessToken: { type: String, required: false },
//   githubUsername:{type:String}
// });

// export default mongoose.models.User || mongoose.model('User', userSchema);


import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  githubId: { type: String, required: true },
  githubUsername: { type: String, required: true },
  accessToken: { type: String, required: true }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
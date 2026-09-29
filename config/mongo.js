const mongoose = require("mongoose");

async function removeLegacyUsernameIndex() {
  try {
    const usersCollection = mongoose.connection.collection("users");
    const indexes = await usersCollection.indexes();
    const legacyIndex = indexes.find((index) => index.key && index.key.username === 1);

    if (legacyIndex) {
      await usersCollection.dropIndex(legacyIndex.name);
      console.log("Dropped legacy unique username index from MongoDB");
    }
  } catch (error) {
    console.warn("Legacy username index cleanup skipped:", error.message || error);
  }
}

function connectToMongoDB() {
  mongoose
    .connect(process.env.CONNECTION_STRING, {
      serverSelectionTimeoutMS: 15000,
      retryWrites: true,
      w: 'majority',
    })
    .then(async () => {
      console.log("MongoDB connected");
      await removeLegacyUsernameIndex();
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message || err);
    });
}

module.exports = { connectToMongoDB };

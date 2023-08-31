module.exports = {
  async up(db, client) {
    await db.createCollection('migration');
  },

  async down(db, client) {
    await db.collection('migration').drop();
  }
};
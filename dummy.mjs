import mongoose from 'mongoose';
import SlotModel from './Models/Slot.model.js';

const migrateData = async () => {
  await mongoose.connect('mongodb://localhost:27017/slotTest', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const slots = await SlotModel.find();

  for (const slot of slots) {
    for (const booker of slot.bookers) {
      if (booker.bookingDate === undefined) {
        booker.bookingDate = null;
      }
      if (booker.bookingTime === undefined) {
        booker.bookingTime = null;
      }
    }
    await slot.save();
  }

  console.log('Migration completed');
  mongoose.disconnect();
};

migrateData().catch((err) => {
  console.error('Migration failed', err);
  mongoose.disconnect();
});
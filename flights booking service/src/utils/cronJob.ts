import cron from 'node-cron';
import { cancelOldBookings } from '../service/booking.service';

export function scheduleCrons(){
    cron.schedule('*/30 * * * *', async () => {
          await cancelOldBookings();
        
     })
}


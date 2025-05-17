import 'dotenv/config';
import App from '@/main';
import AuthRouter from './routes/auth.routes';
import BookingRouter from './routes/admin/booking.routes';
import SlotRouter from './routes/admin/slot.routes';
import UserRouter from './routes/user.route';
import CustomerBookingRouter from './routes/customer/booking.routes';
import CustomerSlotRouter from './routes/customer/slot.routes';



const app = new App([
  new AuthRouter(),
  new BookingRouter(),
  new SlotRouter(),
  new UserRouter(),
  new CustomerBookingRouter(),
  new CustomerSlotRouter(),
]);

app.listen();

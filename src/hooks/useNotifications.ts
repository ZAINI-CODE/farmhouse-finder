import { supabase } from '@/integrations/supabase/client';

interface BookingDetails {
  bookingId: string;
  propertyName: string;
  eventDate: string;
  guestCount: number;
  totalAmount: number;
  transactionId?: string;
}

type NotificationType = 'booking_confirmed' | 'payment_received' | 'payment_verified' | 'booking_reminder';

export function useNotifications() {
  const sendNotification = async (
    type: NotificationType,
    recipientEmail: string,
    recipientName: string,
    bookingDetails: BookingDetails
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-booking-notification', {
        body: {
          type,
          recipientEmail,
          recipientName,
          bookingDetails,
        },
      });

      if (error) {
        console.error('Error sending notification:', error);
        return { success: false, error };
      }

      console.log('Notification sent:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error invoking notification function:', error);
      return { success: false, error };
    }
  };

  const sendBookingConfirmation = async (
    recipientEmail: string,
    recipientName: string,
    bookingDetails: BookingDetails
  ) => {
    return sendNotification('booking_confirmed', recipientEmail, recipientName, bookingDetails);
  };

  const sendPaymentReceived = async (
    recipientEmail: string,
    recipientName: string,
    bookingDetails: BookingDetails
  ) => {
    return sendNotification('payment_received', recipientEmail, recipientName, bookingDetails);
  };

  const sendPaymentVerified = async (
    recipientEmail: string,
    recipientName: string,
    bookingDetails: BookingDetails
  ) => {
    return sendNotification('payment_verified', recipientEmail, recipientName, bookingDetails);
  };

  const sendBookingReminder = async (
    recipientEmail: string,
    recipientName: string,
    bookingDetails: BookingDetails
  ) => {
    return sendNotification('booking_reminder', recipientEmail, recipientName, bookingDetails);
  };

  return {
    sendNotification,
    sendBookingConfirmation,
    sendPaymentReceived,
    sendPaymentVerified,
    sendBookingReminder,
  };
}

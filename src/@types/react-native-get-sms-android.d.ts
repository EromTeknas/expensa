// src/types/react-native-get-sms-android.d.ts
declare module 'react-native-get-sms-android' {
  export type SmsFilter = {
    box?: 'inbox' | 'sent' | 'draft' | 'outbox' | 'failed' | 'queued' | '';
    minDate?: number;
    maxDate?: number;
    bodyRegex?: string;
    read?: 0 | 1;
    _id?: number;
    thread_id?: number;
    address?: string;
    body?: string;
    indexFrom?: number;
    maxCount?: number;
  };

  type SmsMessage = {
    _id: number;
    thread_id: number;
    address: string;
    person: number;
    date: number;
    date_sent: number;
    protocol: number;
    read: number;
    status: number;
    type: number;
    body: string;
    service_center: string;
    locked: number;
    error_code: number;
    sub_id: number;
    seen: number;
    deletable: number;
    sim_slot: number;
    hidden: number;
    app_id: number;
    msg_id: number;
    reserved: number;
    pri: number;
    teleservice_id: number;
    svc_cmd: number;
    roam_pending: number;
    spam_report: number;
    secret_mode: number;
    safe_message: number;
    favorite: number;
  };

  const SmsAndroid: {
    list(
      filter: string,
      onFailure: (error: string) => void,
      onSuccess: (count: number, smsList: string) => void,
    ): void;

    delete(
      id: number,
      onFailure: (error: string) => void,
      onSuccess: (success: string) => void,
    ): void;

    autoSend(
      phoneNumber: string,
      message: string,
      onFailure: (error: string) => void,
      onSuccess: (success: string) => void,
    ): void;
  };

  type SmsMessage = {
    _id: number;
    thread_id: number;
    address: string;
    date: number;
    body: string;
    // ... add other fields as needed
  };

  export default SmsAndroid;
}

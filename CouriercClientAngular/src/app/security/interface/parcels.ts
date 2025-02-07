
export interface Parcel {
    parcelId: number;
    trackingCode?:string;
    SendingBranch?: boolean | null;
    PercelSendingDestribution?: boolean | null;
    RecebingDistributin?: boolean | null;
    RecebingBranch?: boolean | null;
    RecebingReceber?: boolean | null;
    // অন্যান্য প্রোপার্টি যোগ করুন
  }
  
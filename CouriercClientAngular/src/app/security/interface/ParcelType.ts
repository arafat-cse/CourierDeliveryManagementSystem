export interface ParcelType {
    parcelTypeId: number;
    parcelTypeName: string;
    createBy?: string;
    createDate?: Date | null;
    updateBy?: string;
    updateDate?: Date | null;
    isActive: boolean;
    defaultPrice:number;
  }

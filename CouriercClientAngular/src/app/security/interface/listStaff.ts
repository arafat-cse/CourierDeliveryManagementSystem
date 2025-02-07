export interface Staff {
    staffId:number;
    staffName: string;
    email: string;
    staffPhone: string;
    designationId: number|null;
    branchId: number|null;
    createBy?: string;
    createDate?: Date | null;
    updateBy?: string;
    updateDate?: Date | null;
    isActive: boolean;
  }
  
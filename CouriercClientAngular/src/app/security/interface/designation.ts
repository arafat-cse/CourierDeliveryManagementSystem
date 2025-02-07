export interface Designation {
    designationId: number;
    title: string;
    salaryRange?: string;
    createBy?: string;
    createDate?: Date | null;
    updateBy?: string;
    updateDate?: Date | null;
    isActive: boolean;
  }
 export interface Branch {
    branchId: number;
    branchName: string;
    address?: string;
    parentId: number | null;
    childBranches: Branch[] | null;
    isActive: boolean;
    createBy?: string;
    createDate?: Date | null;
    updateBy?: string;
    updateDate?: Date | null;
  }
  
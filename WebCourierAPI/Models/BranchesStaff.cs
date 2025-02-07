using System;
using System.Collections.Generic;

namespace WebCourierAPI.Models;

public partial class BranchesStaff
{
    public int BranchStaffId { get; set; }

    public string? BranchStaffName { get; set; }

    public string? CreateBy { get; set; }

    public DateTime? CreateDate { get; set; }

    public string? UpdateBy { get; set; }

    public DateTime? UpdateDate { get; set; }

    public bool IsActive { get; set; }

    public int StaffId { get; set; }

    public virtual Staff Staff { get; set; } = null!;
}

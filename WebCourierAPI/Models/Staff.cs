using System;
using System.Collections.Generic;

namespace WebCourierAPI.Models;

public partial class Staff
{
    public int StaffId { get; set; }

    public string? StaffName { get; set; }

    public string? Email { get; set; }

    public string? CreateBy { get; set; }

    public DateTime? CreateDate { get; set; }

    public string? UpdateBy { get; set; }

    public DateTime? UpdateDate { get; set; }

    public bool IsActive { get; set; }

    public int? DesignationId { get; set; }

    public string? StaffPhone { get; set; }

    public int? BranchId { get; set; }

    public virtual Branch? Branch { get; set; }

    public virtual ICollection<BranchesStaff> BranchesStaffs { get; set; } = new List<BranchesStaff>();

    public virtual Designation? Designation { get; set; } = null!;
}

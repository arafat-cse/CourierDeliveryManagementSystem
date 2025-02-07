using System;
using System.Collections.Generic;

namespace WebCourierAPI.Models;

public partial class Branch
{
    public int BranchId { get; set; }

    public string? BranchName { get; set; } = null!;

    public string? Address { get; set; } = null!;

    public string? CreateBy { get; set; }

    public DateTime? CreateDate { get; set; }

    public string? UpdateBy { get; set; }

    public DateTime? UpdateDate { get; set; }

    public bool IsActive { get; set; }

    public int? ParentId { get; set; }

    public virtual ICollection<Branch> InverseParent { get; set; } = new List<Branch>();

    public virtual ICollection<Parcel> ParcelReceiverBranches { get; set; } = new List<Parcel>();

    public virtual ICollection<Parcel> ParcelSenderBranches { get; set; } = new List<Parcel>();

    public virtual Branch? Parent { get; set; }

    public virtual ICollection<Staff> Staff { get; set; } = new List<Staff>();
}

using System;
using System.Collections.Generic;

namespace WebCourierAPI.Models;

public partial class Bank
{
    public int BankId { get; set; }

    public string? Address { get; set; }

    public string? AccountNo { get; set; }

    public string? BranchName { get; set; }

    public string CreateBy { get; set; } = null!;

    public DateTime CreateDate { get; set; }

    public string? UpdateBy { get; set; }

    public DateTime? UpdateDate { get; set; }

    public bool IsActive { get; set; }

    public int CompanyId { get; set; }

    public virtual Company Company { get; set; } = null!;
}
